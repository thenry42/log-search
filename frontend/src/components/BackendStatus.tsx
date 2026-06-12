import { useEffect, useState } from "react";

type BackendState = "loading" | "ok" | "error";

/**
 * Check the status of the backend every 5 seconds.
 */
export default function BackendStatus() {
  const [state, setState] = useState<BackendState>("loading");

  useEffect(() => {
    setState("loading");

    const checkBackend = () => {
      fetch(`${import.meta.env.VITE_API_URL}/`, { cache: "no-store" })
        .then((res) => {
          if (!res.ok) throw new Error("not ok");
          setState("ok");
        })
        .catch(() => setState("error"));
    };

    checkBackend();
    const id = setInterval(checkBackend, 5_000);
    return () => clearInterval(id);
  }, []);

  const label =
    state === "loading"
      ? "Checking backend…"
      : state === "ok"
        ? "Backend: OK"
        : "Backend: unavailable";

  const colorClass =
    state === "loading"
      ? "bg-gray-200 text-gray-700 border-gray-300"
      : state === "ok"
        ? "bg-green-100 text-green-800 border-green-300"
        : "bg-red-100 text-red-800 border-red-300";

  return (
    <button
      type="button"
      disabled={state === "loading"}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${colorClass}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          state === "ok"
            ? "bg-green-500 animate-pulse"
            : state === "error"
              ? "bg-red-500"
              : "bg-gray-400"
        }`}
      />
      {label}
    </button>
  );
}
