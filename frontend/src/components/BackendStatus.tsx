import type { BackendHealthState } from "../hooks/useHealthStream";

type BackendStatusProps = {
  status: BackendHealthState;
};

export default function BackendStatus({ status }: BackendStatusProps) {
  const color =
    status === "up"
      ? "bg-green-100 text-green-800 border-green-300"
      : status === "down"
        ? "bg-red-100 text-red-800 border-red-300"
        : "bg-gray-200 text-gray-700 border-gray-300";

  const dot =
    status === "up" ? "bg-green-500" : status === "down" ? "bg-red-500" : "bg-gray-400";

  const label =
    status === "up" ? "Backend OK" : status === "down" ? "Backend down" : "Checking backend...";

  return (
    <span
      className={"inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium " + color}
    >
      <span className={"h-2 w-2 rounded-full " + dot} />
      {label}
    </span>
  );
}
