import type { Log, LogLevel, LogSearchParams } from "../types/log";
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

export async function searchLogs(params: LogSearchParams) {
  const { data } = await api.get<Log[]>("/logs/search", {
    params: {
      ...(params.q ? { q: params.q } : {}),
      ...(params.level ? { level: params.level } : {}),
    },
  });
  return data;
}
