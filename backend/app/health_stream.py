import asyncio
import json

from opensearchpy.exceptions import OpenSearchException

from app.opensearch_client import ensure_index, is_reachable


def get_opensearch_state():
    """Return OpenSearch status as up, starting, or down."""
    if not is_reachable():
        return "down"
    try:
        ensure_index()
        return "up"
    except OpenSearchException:
        return "starting"


async def health_event_stream():
    """Yield SSE payloads when OpenSearch health state changes."""
    last_opensearch = None
    while True:
        opensearch = get_opensearch_state()
        if opensearch != last_opensearch:
            yield f"data: {json.dumps({'opensearch': opensearch})}\n\n"
            last_opensearch = opensearch
        await asyncio.sleep(1)
