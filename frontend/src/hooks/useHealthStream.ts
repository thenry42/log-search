import { useEffect, useRef, useState } from "react";

export type BackendHealthState = "loading" | "up" | "down";
export type OpenSearchHealthState = "loading" | "starting" | "up" | "down";

export type HealthStreamState = {
  backend: BackendHealthState;
  opensearch: OpenSearchHealthState;
};

type HealthStreamEvent = {
  opensearch: "starting" | "up" | "down";
};

export function useHealthStream(onOpenSearchUp?: () => void) {
  const [health, setHealth] = useState<HealthStreamState>({
    backend: "loading",
    opensearch: "loading",
  });
  const lastOpenSearchRef = useRef<OpenSearchHealthState>("loading");
  const onOpenSearchUpRef = useRef(onOpenSearchUp);

  useEffect(() => {
    onOpenSearchUpRef.current = onOpenSearchUp;
  }, [onOpenSearchUp]);

  useEffect(() => {
    const source = new EventSource(`${import.meta.env.VITE_API_URL}/events/health`);

    source.onopen = () => {
      setHealth((prev) => ({ ...prev, backend: "up" }));
    };

    source.onmessage = (event) => {
      const data = JSON.parse(event.data) as HealthStreamEvent;
      if (lastOpenSearchRef.current !== "up" && data.opensearch === "up") {
        onOpenSearchUpRef.current?.();
      }
      lastOpenSearchRef.current = data.opensearch;
      setHealth({ backend: "up", opensearch: data.opensearch });
    };

    source.onerror = () => {
      setHealth((prev) => ({ ...prev, backend: "down" }));
    };

    return () => source.close();
  }, []);

  return health;
}
