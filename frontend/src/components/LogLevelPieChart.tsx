import { EMPTY_LEVEL_COUNTS, LOG_LEVELS, type LogLevel, type LogLevelCounts } from "../types/log";

const LEVEL_FILL: Record<LogLevel, string> = {
  DEBUG: "#86efac",
  INFO: "#93c5fd",
  WARNING: "#fde047",
  ERROR: "#fca5a5",
};

function buildGradient(counts: LogLevelCounts): string | null {
  const total = LOG_LEVELS.reduce((sum, level) => sum + counts[level], 0);
  if (total === 0) {
    return null;
  }

  let deg = 0;
  const stops: string[] = [];
  for (const level of LOG_LEVELS) {
    const count = counts[level];
    if (count === 0) {
      continue;
    }
    const slice = (count / total) * 360;
    stops.push(`${LEVEL_FILL[level]} ${deg}deg ${deg + slice}deg`);
    deg += slice;
  }
  return `conic-gradient(${stops.join(", ")})`;
}

export default function LogLevelPieChart({
  levelCounts = EMPTY_LEVEL_COUNTS,
  loading,
}: {
  levelCounts?: LogLevelCounts;
  loading?: boolean;
}) {
  const gradient = buildGradient(levelCounts);
  const total = LOG_LEVELS.reduce((sum, level) => sum + levelCounts[level], 0);

  return (
    <section className="w-72 shrink-0 rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="text-base font-semibold">Logs by level</h2>

      <div className="mt-3 flex flex-col items-center gap-4">
        <div
          className="h-36 w-36 rounded-full border border-gray-200 dark:border-gray-600"
          style={{
            background: gradient ?? "#e5e7eb",
          }}
          aria-label="Pie chart of log levels"
        />

        {loading && total === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        )}
        {!loading && total === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">No logs yet</p>
        )}

        <ul className="w-full space-y-1 text-sm">
          {LOG_LEVELS.map((level) => (
            <li key={level} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-sm"
                  style={{ backgroundColor: LEVEL_FILL[level] }}
                />
                {level}
              </span>
              <span className="tabular-nums text-gray-600 dark:text-gray-300">
                {levelCounts[level]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
