from datetime import datetime
from typing import Optional

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from app.models.Log import Log, LogLevel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"status": "ok"}


@app.post("/logs")
def create_log(log: Log):
    return {"status": "ok"}


@app.get("/logs/search")
def search_logs(
    query: Optional[str] = Query(None),
    level: Optional[LogLevel] = Query(None),
    service: Optional[str] = Query(None),
    from_date: Optional[datetime] = Query(None),
    to_date: Optional[datetime] = Query(None),
):
    return {"status": "ok"}
