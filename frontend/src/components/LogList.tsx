import type { Log } from "../types/log";
import LogListItem from "./LogListItem";
import LogPagination from "./LogPagination";

export default function LogList({
  logs,
  page,
  total,
  loading,
  error,
  onPageChange,
}: {
  logs: Log[];
  page: number;
  total: number;
  loading: boolean;
  error: string;
  onPageChange: (page: number) => void;
}) {
  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {loading && logs.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      )}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {!loading && !error && logs.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">No logs yet</p>
      )}

      <ul className="min-h-0 flex-1 divide-y divide-gray-200 overflow-y-auto rounded-lg border border-gray-200 bg-white dark:divide-gray-700 dark:border-gray-600 dark:bg-gray-900">
        {logs.map((log) => (
          <LogListItem key={log.id_opensearch} log={log} />
        ))}
      </ul>

      <LogPagination page={page} total={total} onPageChange={onPageChange} />
    </section>
  );
}
