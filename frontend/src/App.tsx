import { useEffect, useState } from "react";
import { searchLogs } from "./api/logs";
import AddLogForm from "./components/AddLogForm";
import AddRandomLogForm from "./components/AddRandomLogForm";
import Footer from "./components/Footer";
import Header from "./components/Header";
import LogList from "./components/LogList";
import LogSearchArea from "./components/LogSearchArea";
import type { Log, LogSearchParams } from "./types/log";

export default function App() {
  const [searchParams, setSearchParams] = useState<LogSearchParams>({ q: "", level: "" });
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState<Log[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLogs(targetPage = page) {
    setLoading(true);
    setError("");
    try {
      const data = await searchLogs(searchParams, targetPage);
      setLogs(data.logs);
      setTotal(data.total);
      setPage(data.page);
    } catch {
      setError("Couldn't load logs");
    } finally {
      setLoading(false);
    }
  }

  function handleSearchChange(params: LogSearchParams) {
    setSearchParams(params);
    setPage(1);
  }

  useEffect(() => {
    loadLogs(page);
  }, [searchParams, page]);

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Header onOpenSearchUp={loadLogs} />
      <main className="flex min-h-0 flex-1 gap-8 px-8 py-8">
        <div className="flex shrink-0 flex-col gap-4">
          <AddLogForm onLogAdded={loadLogs} />
          <AddRandomLogForm onLogAdded={loadLogs} />
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
          <LogSearchArea params={searchParams} onChange={handleSearchChange} />
          <LogList
            logs={logs}
            page={page}
            total={total}
            loading={loading}
            error={error}
            onPageChange={setPage}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
