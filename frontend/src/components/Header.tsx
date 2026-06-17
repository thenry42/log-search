import { useHealth } from "../hooks/useHealth";
import BackendStatus from "./BackendStatus";
import OpenSearchStatus from "./OpenSearchStatus";

type HeaderProps = {
  onOpenSearchUp?: () => void;
};

export default function Header({ onOpenSearchUp }: HeaderProps) {
  const health = useHealth(onOpenSearchUp);

  return (
    <header className="border-b border-gray-200 px-8 py-4 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">log search</h1>
        <div className="flex items-center gap-2">
          <BackendStatus status={health.backend} />
          <OpenSearchStatus status={health.opensearch} />
        </div>
      </div>
    </header>
  );
}
