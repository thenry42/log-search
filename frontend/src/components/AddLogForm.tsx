import { useState, type SubmitEvent } from "react";
import { createLog } from "../api/logs";
import { LOG_LEVELS, type LogLevel } from "../types/log";

const SERVICE_MAX_LEN = 64;
const MESSAGE_MAX_LEN = 2048;

export default function AddLogForm({ onLogAdded }: { onLogAdded: () => void }) {
  const [level, setLevel] = useState<LogLevel>("INFO");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setDone(false);

    try {
      await createLog({
        level,
        service,
        message,
        timestamp: new Date().toISOString(),
      });
      setMessage("");
      setDone(true);
      onLogAdded();
    } catch {
      setError("Couldn't add log");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="w-72 shrink-0 rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Add New log</h2>

        <label className="flex flex-col gap-1 text-sm">
          level
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as LogLevel)}
            className="rounded border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
          >
            {LOG_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          service
          <input
            type="text"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
            minLength={1}
            maxLength={SERVICE_MAX_LEN}
            className="rounded border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          message
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            minLength={1}
            maxLength={MESSAGE_MAX_LEN}
            rows={4}
            className="rounded border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {done && <p className="text-sm text-green-700 dark:text-green-400">Log added</p>}

        <button
          type="submit"
          disabled={submitting}
          className="cursor-pointer rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900"
        >
          {submitting ? "Adding..." : "Add"}
        </button>
      </form>
    </section>
  );
}
