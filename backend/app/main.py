import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from opensearchpy.exceptions import OpenSearchException

from app.log_search import search_opensearch_logs
from app.models.Log import Log, LogCreate, LogLevel
from app.opensearch_client import create_opensearch_log, ensure_index, is_reachable

app = FastAPI()


@app.on_event("startup")
def startup():
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
    return Response(status_code=200)


@app.get("/health/opensearch")
def opensearch_health():
    if not is_reachable():
        return Response(status_code=503)
    try:
        ensure_index()
        return Response(status_code=200)
    except OpenSearchException:
        return Response(status_code=503)


@app.post("/logs", status_code=201)
def create_log(log: LogCreate):
    try:
        return create_opensearch_log(log)
    except OpenSearchException:
        raise HTTPException(status_code=503)


@app.get("/logs/search")
def search_logs(q: str | None = None, level: LogLevel | None = None, service: str | None = None):
    try:
        return search_opensearch_logs(q=q, level=level, service=service)
    except OpenSearchException:
        raise HTTPException(status_code=503)
