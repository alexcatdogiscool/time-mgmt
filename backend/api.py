from events import Event, EventBuilder
from db import *
from events import *
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo
from contextlib import asynccontextmanager

LOCAL_TZ = ZoneInfo("Pacific/Auckland")

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

################################################

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/events")
def recv_event(event: dict):
    init_db()
    e = Event.from_dict(event)
    insert_event(e)
    return e.to_dict()

@app.get("/timeline")
def get_timeline(date: str):
    try:
        day_start_local = datetime.strptime(date, "%Y-%m-%d").replace(tzinfo=LOCAL_TZ)
    except ValueError:
        raise HTTPException(400, "date must be YYYY-MM-DD")

    day_start_utc = day_start_local.astimezone(timezone.utc)
    day_end_utc = day_start_utc + timedelta(days=1)

    now_utc = datetime.now(timezone.utc)
    is_today = day_start_utc <= now_utc < day_end_utc

    range_end = min(day_end_utc, now_utc) if is_today else day_end_utc

    events = get_from_timerange(day_start_utc, range_end)

    print(day_start_utc)
    print(range_end)
    print(events)

    if not events:
        return {"date": date, "segments": []}

    segments = to_segments(events, range_end)

    for seg in segments:
        seg["start"] = seg["start"].astimezone(LOCAL_TZ).isoformat()
        seg["end"] = seg["end"].astimezone(LOCAL_TZ).isoformat()

    return {"date": date, "segments": segments}

app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="frontend")