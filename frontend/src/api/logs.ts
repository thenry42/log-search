import type { Log, LogLevel, LogSearchParams, LogSearchResult } from "../types/log";
import { api } from "./client";

export async function createLog(data: {
  level: LogLevel;
  service: string;
  message: string;
  timestamp: string;
}) {
  const { data: log } = await api.post<Log>("/logs", data);
  return log;
}

export async function searchLogs(params: LogSearchParams, page = 1) {
  const { data } = await api.get<LogSearchResult>("/logs/search", {
    params: {
      page,
      ...(params.q ? { q: params.q } : {}),
      ...(params.level ? { level: params.level } : {}),
    },
  });
  return data;
}
