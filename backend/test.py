import requests
from events import EventBuilder, Event
from datetime import datetime, timezone, timedelta, time
from zoneinfo import ZoneInfo
from db import *

LOCAL_TZ = ZoneInfo("Pacific/Auckland")

url = "http://127.0.0.1:8000/events"

e = (EventBuilder()
     .with_activity("sleeping")
     .with_note("backfill the db :p")
     .with_timestamp((datetime.combine(datetime.now(), time.min) - timedelta(hours=0, minutes=30)).astimezone(LOCAL_TZ))
     .build())

payload = e.to_dict()

response = requests.post(url, json=payload)
print(response.status_code)
print(response.json())


url = "http://127.0.0.1:8000/timeline"

response = requests.get(url, params={"date": "2026-08-01"})

print(response.status_code)
print(response.json())

