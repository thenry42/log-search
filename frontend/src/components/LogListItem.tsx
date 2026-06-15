import { useState } from "react";
import type { Log, LogLevel } from "../types/log";

function levelColor(level: LogLevel): string {
  if (level === "DEBUG") return "bg-green-100 text-green-800";
  if (level === "INFO") return "bg-blue-100 text-blue-800";
  if (level === "WARNING") return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
}

export default function LogListItem({ log }: { log: Log }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyJson(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(JSON.stringify(log, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked, whatever
    }
  }

  return (
    <li className="text-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60"
      >
        <span className="shrink-0 text-xl font-semibold leading-none text-gray-500 dark:text-gray-400">
          {open ? "▼" : "▶"}
        </span>
        <time className="shrink-0 text-gray-500 dark:text-gray-400">
          {new Date(log.timestamp).toLocaleString()}
        </time>
        <span className={"shrink-0 rounded px-2 py-0.5 text-xs font-medium " + levelColor(log.level)}>
          {log.level}
        </span>
        <span className="shrink-0 font-medium">{log.service}</span>
        <span className="min-w-0 truncate text-gray-700 dark:text-gray-300">{log.message}</span>
      </button>

      {open && (
        <div className="relative border-t border-gray-100 bg-gray-50 px-4 py-3 text-xs dark:border-gray-700 dark:bg-gray-800/50">
          <button
            type="button"
            onClick={copyJson}
            className="absolute top-3 right-4 rounded-md border border-gray-300 px-2 py-1 text-gray-600 hover:bg-gray-200 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <pre className="overflow-x-auto pr-16 whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200">
            {JSON.stringify(log, null, 2)}
          </pre>
        </div>
      )}
    </li>
  );
}
