from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from opensearchpy.exceptions import OpenSearchException

from app.models.Log import Log
from app.opensearch_client import LOGS_INDEX, ensure_index, get_client, is_reachable

app = FastAPI()

# Ensure the opensearch index exists on startup
@app.on_event("startup")
def startup():
    try:
        ensure_index()
    except OpenSearchException:
        pass

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoints (used for the backend status)
@app.get("/")
def read_root():
    return Response(status_code=200)


# Health check endpoints (used for the opensearch status)
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
def create_log(log: Log):
    return log


@app.get("/logs/search")
def search_logs() -> list[Log]:
    try:
        ensure_index()
        response = get_client().search(
            index=LOGS_INDEX,
            body={"query": {"match_all": {}}},
        )
    except OpenSearchException:
        raise HTTPException(status_code=503)

    return [
        Log(
            id=hit["_source"]["id"],
            level=hit["_source"]["level"],
            message=hit["_source"]["message"],
            service=hit["_source"]["service"],
            timestamp=hit["_source"]["timestamp"],
            id_opensearch=hit["_id"],
        )
        for hit in response["hits"]["hits"]
    ]
