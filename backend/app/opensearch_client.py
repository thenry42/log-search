import os
import urllib.request

from opensearchpy import OpenSearch

LOGS_INDEX = "logs"

LOGS_INDEX_BODY = {
    "mappings": {
        "properties": {
            "id": {"type": "keyword"},
            "level": {"type": "keyword"},
            "message": {"type": "text"},
            "service": {"type": "keyword"},
            "timestamp": {"type": "date"},
        }
    }
}


def is_reachable() -> bool:
    url = os.getenv("OPENSEARCH_URL")
    if not url:
        return False
    try:
        with urllib.request.urlopen(url, timeout=3):
            return True
    except Exception:
        return False


def get_client() -> OpenSearch:
    """
    Get the opensearch client.
    """
    url = os.getenv("OPENSEARCH_URL")
    if not url:
        raise ValueError("OPENSEARCH_URL is not set")
    return OpenSearch(hosts=[url])


def ensure_index() -> None:
    """
    Create the logs index if it does not exist.
    """
    client = get_client()
    if not client.indices.exists(index=LOGS_INDEX):
        client.indices.create(index=LOGS_INDEX, body=LOGS_INDEX_BODY)
