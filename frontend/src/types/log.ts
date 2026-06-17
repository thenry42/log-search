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

export const LOG_PAGE_SIZE = 20;

export type LogLevelCounts = Record<LogLevel, number>;

export type LogSearchResult = {
  logs: Log[];
  total: number;
  page: number;
  page_size: number;
  level_counts: LogLevelCounts;
};

export const EMPTY_LEVEL_COUNTS: LogLevelCounts = {
  DEBUG: 0,
  INFO: 0,
  WARNING: 0,
  ERROR: 0,
};