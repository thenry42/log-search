import { LOG_LEVELS, type LogLevel, type LogSearchParams } from "../types/log";

const ACTIVE_LEVEL_CLASS: Record<LogLevel, string> = {
  DEBUG: "border-green-300 bg-green-100 text-green-800",
  INFO: "border-blue-300 bg-blue-100 text-blue-800",
  WARNING: "border-yellow-300 bg-yellow-100 text-yellow-800",
  ERROR: "border-red-300 bg-red-100 text-red-800",
};

export default function LogSearchArea({
  params,
  onChange,
}: {
  params: LogSearchParams;
  onChange: (params: LogSearchParams) => void;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3 flex items-center gap-3">
        <h2 className="text-lg font-semibold">Search</h2>
        {(params.q || params.level) && (
          <button
            type="button"
            onClick={() => onChange({ q: "", level: "" })}
            className="cursor-pointer rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={params.q}
          onChange={(e) => onChange({ ...params, q: e.target.value })}
          placeholder="message or service"
          className="h-9 min-w-48 flex-1 rounded border border-gray-300 bg-white px-3 text-sm dark:border-gray-600 dark:bg-gray-700"
        />

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...params, level: "" })}
            className={
              "h-9 cursor-pointer rounded border px-3 text-sm font-medium " +
              (params.level === ""
                ? "border-gray-400 bg-gray-200 text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600")
            }
          >
            all
          </button>
          {LOG_LEVELS.map((level) => {
            const active = params.level === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => onChange({ ...params, level })}
                className={
                  "h-9 cursor-pointer rounded border bg-white px-3 text-sm font-medium dark:bg-gray-700 " +
                  (active ? ACTIVE_LEVEL_CLASS[level] : "")
                }
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
