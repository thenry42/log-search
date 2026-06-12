import os
from opensearchpy import OpenSearch


def get_client() -> OpenSearch:
    """
    Get the opensearch client.
    """
    url = os.getenv("OPENSEARCH_URL")
    if not url:
        raise ValueError("OPENSEARCH_URL is not set")
    return OpenSearch(hosts=[url])
