import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, StreamingResponse
from opensearchpy.exceptions import OpenSearchException

from app.health_stream import get_opensearch_state, health_event_stream
from app.log_search import search_opensearch_logs
from app.models.Log import LogCreate, LogLevel
from app.opensearch_client import create_opensearch_log, ensure_index

app = FastAPI()


@app.on_event("startup")
def startup():
    """Ensure the OpenSearch logs index exists on application startup."""
    try:
        ensure_index()
    except OpenSearchException:
        pass


cors_origins = []
for port in [os.getenv("FRONTEND_PORT"), os.getenv("OPENSEARCH_PORT")]:
    if port:
        cors_origins.append(f"http://localhost:{port}")
        cors_origins.append(f"http://127.0.0.1:{port}")

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


@app.get("/health/opensearch")
def opensearch_health():
    """Report OpenSearch availability as an HTTP status code."""
    state = get_opensearch_state()
    if state == "up":
        return Response(status_code=200)
    if state == "starting":
        return Response(status_code=503)
    return Response(status_code=502)


@app.get("/events/health")
async def health_events():
    """Stream OpenSearch health changes as server-sent events."""
    return StreamingResponse(
        health_event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )


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
