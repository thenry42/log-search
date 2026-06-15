import { useState } from "react";
import { createLog } from "../api/logs";
import {
  RANDOM_MESSAGES,
  RANDOM_SERVICES,
} from "../data/randomLogOptions";
import { LOG_LEVELS } from "../types/log";

export default function AddRandomLogForm({ onLogAdded }: { onLogAdded: () => void }) {
  const [count, setCount] = useState("5");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(0);

  async function handleAddRandom() {
    const n = Number(count);
    if (!Number.isInteger(n) || n < 1 || n > 100) {
      setError("Enter a number between 1 and 100");
      return;
    }

    setSubmitting(true);
    setError("");
    setAdded(0);

    try {
      await Promise.all(
        Array.from({ length: n }, () =>
          createLog({
            level: LOG_LEVELS[Math.floor(Math.random() * LOG_LEVELS.length)],
            service: RANDOM_SERVICES[Math.floor(Math.random() * RANDOM_SERVICES.length)],
            message: RANDOM_MESSAGES[Math.floor(Math.random() * RANDOM_MESSAGES.length)],
            timestamp: new Date().toISOString(),
          }).then(() => setAdded((c) => c + 1)),
        ),
      );
      onLogAdded();
    } catch {
      setError("Couldn't add logs");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="w-72 shrink-0 rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-2">
        <h2 className="shrink-0 text-base font-semibold">Add Random logs</h2>
        <input
          type="text"
          inputMode="numeric"
          value={count}
          onChange={(e) => {
            setError("");
            setCount(e.target.value);
          }}
          className="min-w-0 flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
        />
      </div>

      <button
        type="button"
        onClick={handleAddRandom}
        disabled={submitting}
        className="mt-3 w-full cursor-pointer rounded bg-gray-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900"
      >
        {submitting ? `Adding... (${added}/${count})` : "Add"}
      </button>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </section>
  );
}
