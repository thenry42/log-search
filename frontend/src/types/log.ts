export type LogLevel = "DEBUG" | "INFO" | "WARNING" | "ERROR";

export type Log = {
    id: string;
    level: LogLevel;
    message: string;
    service: string;
    timestamp: string;
    id_opensearch: string;
};