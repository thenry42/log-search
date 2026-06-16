import type { OpenSearchHealthState } from "../hooks/useHealthStream";

type OpenSearchStatusProps = {
  status: OpenSearchHealthState;
};

export default function OpenSearchStatus({ status }: OpenSearchStatusProps) {
  const color =
    status === "up"
      ? "bg-green-100 text-green-800 border-green-300"
      : status === "starting" || status === "loading"
        ? "bg-amber-100 text-amber-800 border-amber-300"
        : status === "down"
          ? "bg-red-100 text-red-800 border-red-300"
          : "bg-amber-100 text-amber-800 border-amber-300";

  const dot =
    status === "up"
      ? "bg-green-500"
      : status === "down"
        ? "bg-red-500"
        : "bg-amber-500";

  const label =
    status === "up"
      ? "OpenSearch OK"
      : status === "starting"
        ? "OpenSearch starting..."
        : status === "down"
          ? "OpenSearch down"
          : "Checking OpenSearch...";

  return (
    <span
      className={"inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium " + color}
    >
      <span className={"h-2 w-2 rounded-full " + dot} />
      {label}
    </span>
  );
}
