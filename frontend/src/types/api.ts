export type HealthResponse = {
  status: "ok" | "error";
  opensearch: "ok" | "unavailable";
};