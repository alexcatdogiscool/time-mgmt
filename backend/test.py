import requests
from events import EventBuilder, Event
from datetime import datetime, timezone
from zoneinfo import ZoneInfo
from db import *

LOCAL_TZ = ZoneInfo("Pacific/Auckland")

url = "http://127.0.0.1:8000/events"

e = (EventBuilder()
     .with_activity("poopin...")
     .with_timestamp(datetime.now().astimezone(LOCAL_TZ))
     .build())

payload = e.to_dict()

response = requests.post(url, json=payload)

print(response.status_code)
print(response.json())


url = "http://127.0.0.1:8000/timeline"

response = requests.get(url, params={"date": "2026-08-01"})

print(response.status_code)
print(response.json())

