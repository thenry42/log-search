from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class LogLevel(str, Enum):
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"


class LogCreate(BaseModel):
    level: LogLevel
    service: str = Field(min_length=1, max_length=64)
    message: str = Field(min_length=1, max_length=2048)
    timestamp: datetime


class Log(LogCreate):
    id_opensearch: str
    index_opensearch: str = ""


class LogSearchResult(BaseModel):
    logs: list[Log]
    total: int
    page: int
    page_size: int
    level_counts: dict[str, int]
