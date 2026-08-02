#!/bin/bash

source ./app-env/bin/activate
cd backend
fastapi dev api.py &

cd ../frontend-web/frontend
npm run dev
