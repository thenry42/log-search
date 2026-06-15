import BackendStatus from "./BackendStatus";
import OpenSearchStatus from "./OpenSearchStatus";

export default function Header() {
  return (
    <header className="border-b border-gray-200 px-8 py-4 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">log search</h1>
        <div className="flex items-center gap-2">
          <BackendStatus />
          <OpenSearchStatus />
        </div>
      </div>
    </header>
  );
}
