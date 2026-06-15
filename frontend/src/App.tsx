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
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLogs() {
    setLoading(true);
    setError("");
    try {
      const data = await searchLogs(searchParams);
      setLogs(data);
    } catch {
      setError("Couldn't load logs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, [searchParams]);

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex min-h-0 flex-1 gap-8 px-8 py-8">
        <div className="flex shrink-0 flex-col gap-4">
          <AddLogForm onLogAdded={loadLogs} />
          <AddRandomLogForm onLogAdded={loadLogs} />
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
          <LogSearchArea params={searchParams} onChange={setSearchParams} />
          <LogList logs={logs} loading={loading} error={error} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
