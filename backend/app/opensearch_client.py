import os
import urllib.request
from datetime import date, datetime

from opensearchpy import OpenSearch

from app.models.Log import Log, LogCreate

LOGS_INDEX_PATTERN = "logs-*"

LOGS_INDEX_BODY = {
    "mappings": {
        "properties": {
            "level": {"type": "keyword"},
            "message": {"type": "text"},
            "service": {"type": "keyword"},
            "timestamp": {"type": "date"},
        }
    }
}


def logs_index_name(for_date=None):
    """Return the daily OpenSearch index name for the given date."""
    if for_date is None:
        d = date.today()
    elif isinstance(for_date, datetime):
        d = for_date.date()
    else:
        d = for_date
    return f"logs-{d.strftime('%Y-%m-%d')}"


def is_reachable():
    """Return whether OpenSearch responds at OPENSEARCH_URL."""
    url = os.getenv("OPENSEARCH_URL")
    if not url:
        return False
    try:
        urllib.request.urlopen(url, timeout=3)
        return True
    except Exception:
        return False


def get_client():
    """Create an OpenSearch client from OPENSEARCH_URL."""
    url = os.getenv("OPENSEARCH_URL")
    if not url:
        raise ValueError("OPENSEARCH_URL is not set")
    return OpenSearch(hosts=[url])


def ensure_index(for_date=None):
    """Create the daily logs index if it does not already exist."""
    index = logs_index_name(for_date)
    client = get_client()
    if not client.indices.exists(index=index):
        client.indices.create(index=index, body=LOGS_INDEX_BODY)
    return index


def create_opensearch_log(log: LogCreate):
    """Index a log document and return it with OpenSearch metadata."""
    index = ensure_index(log.timestamp)
    client = get_client()
    response = client.index(
        index=index,
        body=log.model_dump(mode="json"),
        refresh="wait_for",
    )
    return Log(
        **log.model_dump(),
        id_opensearch=response["_id"],
        index_opensearch=index,
    )
