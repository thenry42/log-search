import { useEffect, useState } from "react";

export default function App() {
  const [status, setStatus] = useState("Checking backend…");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/`)
      .then((res) => res.json())
      .then((data) => setStatus(`Backend: ${data.status}`))
      .catch(() => setStatus("Backend: unavailable"));
  }, []);

  return (
    <div className="m-8 font-sans">
      <h1 className="text-2xl font-bold">log-search</h1>
      <p className="text-gray-600">{status}</p>
    </div>
  );
}
