import sqlite3
from pathlib import Path
import os
from contextlib import contextmanager
from events import Event, EventBuilder
from datetime import datetime, timezone

file_path = Path(__file__).resolve().parent
DB_NAME = "database.db"
DB_PATH = os.path.join(file_path, DB_NAME)

SCHEMA = """
CREATE TABLE IF NOT EXISTS events (
    id          TEXT PRIMARY KEY,
    activity    TEXT NOT NULL,
    label       TEXT,
    timestamp   TEXT NOT NULL,
    note        TEXT,
    created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);

CREATE INDEX IF NOT EXISTS idx_events_activity ON events(activity);

CREATE TRIGGER IF NOT EXISTS trg_events_updated_at
AFTER UPDATE ON events
FOR EACH Row
BEGIN
    UPDATE events SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE id = NEW.id;
END;
"""

@contextmanager
def get_conn(db_path=DB_PATH):
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA busy_timeout = 5000")
    conn.execute("PRAGMA foreign_keys = ON")

    try:
        yield conn
    finally:
        conn.close()


def init_db(db_path=DB_PATH):
    with get_conn(db_path) as conn:
        conn.executescript(SCHEMA)
        conn.commit()


def insert_event(event: Event, db_path=DB_PATH):
    with get_conn(db_path) as conn:
        conn.execute(
            """
            INSERT INTO events (id, activity, label, timestamp, note, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                event.id,
                event.activity,
                event.label,
                event.timestamp.isoformat(),
                event.note,
                event.created_at.isoformat(),
                event.updated_at.isoformat(),
            ),
        )
        conn.commit()

def get_from_timerange(start: datetime, end: datetime, db_path=DB_PATH) -> list[Event]:
    if start.tzinfo is None or end.tzinfo is None:
        raise ValueError("times must be timezone aware!!!")

    start_iso = start.isoformat()
    end_iso = end.isoformat()

    with get_conn(db_path) as conn:
        rows = conn.execute(
            """
            SELECT * FROM events
            WHERE timestamp >= :start AND timestamp < :end

            UNION ALL

            SELECT * FROM (
                SELECT * FROM events
                WHERE timestamp < :start
                ORDER BY timestamp DESC
                LIMIT 1
            )
            """,
            {"start": start_iso, "end": end_iso},
        ).fetchall()

        events = [Event.from_dict(dict(row)) for row in rows]
        events.sort(key=lambda e: e.timestamp)
        return events


def to_segments(events: list[Event], range_end: datetime) -> list[dict]:
    """Turn a sorted event list into (activity, start, end) segments."""
    segments = []
    for i, event in enumerate(events):
        seg_end = events[i + 1].timestamp if i + 1 < len(events) else range_end
        segments.append({
            "activity": event.activity,
            "label": event.label,
            "start": event.timestamp,
            "end": seg_end,
        })
    return segments