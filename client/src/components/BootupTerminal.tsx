import { useState, useEffect, useRef } from "react";

export function BootupTerminal() {
  const [logs, setLogs] = useState<string[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // In a deployed environment like Netlify, the backend server that handles
    // WebSocket connections might not be running on the same host as the
    // frontend. You can override the WebSocket URL by setting the
    // VITE_WS_URL environment variable.
    const wsUrl = import.meta.env.VITE_WS_URL || `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      setLogs((prevLogs) => [...prevLogs, "WebSocket connected"]);
    };

    ws.current.onmessage = (event) => {
      setLogs((prevLogs) => [...prevLogs, event.data]);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
      setLogs((prevLogs) => [...prevLogs, "WebSocket disconnected"]);
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setLogs((prevLogs) => [...prevLogs, "WebSocket error"]);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <div className="bg-black text-white font-mono text-sm p-4 rounded-lg h-full overflow-y-auto">
      <div className="animate-pulse">Connecting to server...</div>
      {logs.map((log, index) => (
        <div key={index} className="whitespace-pre-wrap">
          {log}
        </div>
      ))}
    </div>
  );
}
