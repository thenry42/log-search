from datetime import datetime
from enum import Enum

from pydantic import BaseModel


class LogLevel(str, Enum):
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"


class LogCreate(BaseModel):
    level: LogLevel
    message: str
    service: str
    timestamp: datetime


class Log(LogCreate):
    id_opensearch: str
    index_opensearch: str = ""


class LogSearchResult(BaseModel):
    logs: list[Log]
    total: int
    page: int
    page_size: int
