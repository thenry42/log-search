import { useEffect, useRef, useState } from "react";
import { api } from "../api/client";

export type HealthStatus = "loading" | "up" | "down";

export type HealthState = {
  backend: HealthStatus;
  opensearch: HealthStatus;
};

const POLL_MS = 2000;

export function useHealth(onOpenSearchUp?: () => void) {
  const [health, setHealth] = useState<HealthState>({
    backend: "loading",
    opensearch: "loading",
  });
  const wasOpenSearchUpRef = useRef(false);
  const onOpenSearchUpRef = useRef(onOpenSearchUp);

  useEffect(() => {
    onOpenSearchUpRef.current = onOpenSearchUp;
  }, [onOpenSearchUp]);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const { data } = await api.get<{ opensearch: "up" | "down" }>("/health");
        if (cancelled) {
          return;
        }
        if (!wasOpenSearchUpRef.current && data.opensearch === "up") {
          onOpenSearchUpRef.current?.();
        }
        wasOpenSearchUpRef.current = data.opensearch === "up";
        setHealth({ backend: "up", opensearch: data.opensearch });
      } catch {
        if (!cancelled) {
          setHealth((prev) => ({ backend: "down", opensearch: prev.opensearch }));
        }
      }
    }

    void poll();
    const id = window.setInterval(() => void poll(), POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return health;
}
