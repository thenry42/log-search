import { useEffect, useState } from "react";
import type { HealthResponse } from "../types/api";

type OpenSearchState = "loading" | "ok" | "error";

/**
 * Check the status of the OpenSearch cluster and index every 10 seconds.
 * TODO: check if the opensearch index exists.
 */
export default function OpenSearchStatus() {
  const [state, setState] = useState<OpenSearchState>("loading");

  useEffect(() => {
    const checkOpenSearch = () => {
      fetch(`${import.meta.env.VITE_API_URL}/`)
        .then((res) => {
          if (!res.ok) throw new Error("not ok");
          return res.json() as Promise<HealthResponse>;
        })
        .then((data) => setState(data.opensearch === "ok" ? "ok" : "error"))
        .catch(() => setState("error"));
    };

    checkOpenSearch();
    const id = setInterval(checkOpenSearch, 10_000);
    return () => clearInterval(id);
  }, []);

  const label =
    state === "loading"
      ? "Checking OpenSearch…"
      : state === "ok"
        ? "OpenSearch: OK"
        : "OpenSearch: unavailable";

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
