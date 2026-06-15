export type LogLevel = "DEBUG" | "INFO" | "WARNING" | "ERROR";

export const LOG_LEVELS: LogLevel[] = ["DEBUG", "INFO", "WARNING", "ERROR"];

export type LogSearchParams = {
  q: string;
  level: LogLevel | "";
};

export type Log = {
  level: LogLevel;
  message: string;
  service: string;
  timestamp: string;
  id_opensearch: string;
  index_opensearch: string;
};