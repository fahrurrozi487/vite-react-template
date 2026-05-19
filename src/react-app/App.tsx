import { useEffect, useState } from "react";
import "./App.css";

type TouchData = {
  device: string;
  event: string;
  sensorName: string;
  gpio: number;
  touchValue: number;
  createdAt: string;
};

function App() {
  const [data, setData] = useState<TouchData | null>(null);
  const [status, setStatus] = useState("Menunggu data ESP32...");

  async function loadLatestTouch() {
    try {
      const response = await fetch("/api/touch/latest");
      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setStatus("Data diterima");
      } else {
        setStatus(result.message);
      }
    } catch (error) {
      setStatus("Gagal mengambil data dari API");
    }
  }

  useEffect(() => {
    loadLatestTouch();

    const interval = setInterval(() => {
      loadLatestTouch();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="container">
      <div className="card">
        <h1>ESP32-S3 Touch Dashboard</h1>
        <p className="status">{status}</p>

        <div className="data-box">
          <p>
            <strong>Device:</strong> {data?.device ?? "-"}
          </p>
          <p>
            <strong>Event:</strong> {data?.event ?? "-"}
          </p>
          <p>
            <strong>Sensor:</strong> {data?.sensorName ?? "-"}
          </p>
          <p>
            <strong>GPIO:</strong> {data?.gpio ?? "-"}
          </p>
          <p>
            <strong>Touch Value:</strong> {data?.touchValue ?? "-"}
          </p>
          <p>
            <strong>Waktu:</strong> {data?.createdAt ?? "-"}
          </p>
        </div>

        <button onClick={loadLatestTouch}>Refresh Manual</button>
      </div>
    </main>
  );
}

export default App;
