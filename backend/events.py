import time
from datetime import datetime, timezone
from dataclasses import dataclass, field
from typing import Optional
import uuid

@dataclass
class Event:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    activity: str = ""
    label: Optional[str] = field(default_factory=lambda: None)
    timestamp: datetime = field(default_factory=(lambda: datetime.now(timezone.utc)))
    note: Optional[str] = field(default_factory=(lambda: None))
    created_at: datetime = field(default_factory=(lambda: datetime.now(timezone.utc)))
    updated_at: datetime = field(default_factory=(lambda: datetime.now(timezone.utc)))

    def __post_init__(self):
        if self.timestamp.tzinfo is None:
            raise ValueError("timestamp must be timezone-aware")
        self.timestamp = self.timestamp.astimezone(timezone.utc)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "activity": self.activity,
            "label": self.label,
            "timestamp": self.timestamp.isoformat(),
            "note": self.note,
            "updated_at": self.updated_at.isoformat(),
            "created_at": self.created_at.isoformat(),
        }

    @classmethod
    def from_dict(cls, data: dict) -> "Event":
        kwargs = {
            "activity": data["activity"],
            "label": data.get("label"),
            "note": data.get("note"),
        }
        if "id" in data:
            kwargs["id"] = data["id"]
        if "timestamp" in data and data["timestamp"] is not None:
            kwargs["timestamp"] = datetime.fromisoformat(data["timestamp"])
        if "created_at" in data:
            kwargs["created_at"] = datetime.fromisoformat(data["created_at"])
        if "updated_at" in data:
            kwargs["updated_at"] = datetime.fromisoformat(data["updated_at"])

        return cls(**kwargs)



class EventBuilder:
    def __init__(self):
        self._event = Event()

    def with_activity(self, activity: str) -> "EventBuilder":
        self._event.activity = activity
        return self

    def with_label(self, label: str) -> "EventBuilder":
        self._event.label = label
        return self

    def with_note(self, note: str) -> "EventBuilder":
        self._event.note = note
        return self

    def with_timestamp(self, ts: datetime) -> "EventBuilder":
        self._event.timestamp = ts
        return self

    def build(self) -> Event:
        if not self._event.activity:
            raise ValueError("No activity added to Event")
        return self._event