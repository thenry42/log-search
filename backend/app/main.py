import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from opensearchpy.exceptions import OpenSearchException

from app.log_search import search_opensearch_logs
from app.models.Log import LogCreate, LogLevel
from app.opensearch_client import (
    create_opensearch_log,
    ensure_index,
    opensearch_ready,
)

app = FastAPI()


@app.on_event("startup")
def startup():
    """Ensure the OpenSearch logs index exists on application startup."""
    try:
        ensure_index()
    except OpenSearchException:
        pass


port = os.getenv("FRONTEND_PORT")
cors_origins = [
    f"http://localhost:{port}",
    f"http://127.0.0.1:{port}",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/")
def read_root():
    """Return 200 when the API is reachable."""
    return Response(status_code=200)


@app.get("/health")
def health():
    """Report backend and OpenSearch availability."""
    return {"opensearch": "up" if opensearch_ready() else "down"}


@app.post("/logs", status_code=201)
def create_log(log: LogCreate):
    """Persist a new log entry in OpenSearch."""
    try:
        return create_opensearch_log(log)
    except OpenSearchException:
        raise HTTPException(status_code=503)


@app.get("/logs/search")
def search_logs(
    q: str | None = None,
    level: LogLevel | None = None,
    service: str | None = None,
    page: int = 1,
):
    """Search logs with optional text, level, and service filters."""
    if page < 1:
        raise HTTPException(status_code=400, detail="page must be >= 1")
    try:
        return search_opensearch_logs(
            q=q, level=level, service=service, page=page
        )
    except OpenSearchException:
        raise HTTPException(status_code=503)
