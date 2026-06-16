from app.models.Log import Log, LogLevel, LogSearchResult
from app.opensearch_client import LOGS_INDEX_PATTERN, ensure_index, get_client

PAGE_SIZE = 20


def _wildcard(field, text):
    return {
        "wildcard": {
            field: {
                "value": f"*{text}*",
                "case_insensitive": True,
            }
        }
    }


def build_search_query(q=None, level=None, service=None):
    must = []
    filt = []

    if q:
        for word in q.strip().split():
            must.append({
                "bool": {
                    "should": [
                        _wildcard("message", word),
                        _wildcard("service", word),
                    ],
                    "minimum_should_match": 1,
                }
            })

    if level is not None:
        filt.append({"term": {"level": level.value}})

    if service:
        filt.append(_wildcard("service", service))

    if not must and not filt:
        return {"match_all": {}}

    body = {"bool": {}}
    if must:
        body["bool"]["must"] = must
    if filt:
        body["bool"]["filter"] = filt
    return body


def search_opensearch_logs(q=None, level=None, service=None, page=1):
    ensure_index()
    client = get_client()
    response = client.search(
        index=LOGS_INDEX_PATTERN,
        body={
            "query": build_search_query(q, level, service),
            "sort": [{"timestamp": {"order": "desc"}}],
            "from": (page - 1) * PAGE_SIZE,
            "size": PAGE_SIZE,
        },
    )

    total = response["hits"]["total"]
    if isinstance(total, dict):
        total = total["value"]

    logs = []
    for hit in response["hits"]["hits"]:
        src = hit["_source"]
        logs.append(Log(
            level=src["level"],
            message=src["message"],
            service=src["service"],
            timestamp=src["timestamp"],
            id_opensearch=hit["_id"],
            index_opensearch=hit["_index"],
        ))
    return LogSearchResult(
        logs=logs,
        total=total,
        page=page,
        page_size=PAGE_SIZE,
    )
