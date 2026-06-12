from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel


class LogLevel(str, Enum):
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"


class Log(BaseModel):
    """
    A log entry with:
    - id: the log entry id only for backend usage (UUID)
    - level: level of the log (INFO, WARNING, DEBUG,ERROR) as Enum
    - message: the log message (str)
    - service: the service that generated the log (str)
    - timestamp: the timestamp of the log entry (ISO 8601)
    - id_opensearch: the id of the log entry in the opensearch index (returned by opensearch)
    """
    id: UUID
    level: LogLevel
    message: str
    service: str
    timestamp: datetime
    id_opensearch: str
