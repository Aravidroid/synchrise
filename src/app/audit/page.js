"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function AuditPage() {
  const [logs, setLogs] = useState([]);

  async function loadLogs() {
    try {
      const response = await fetch("/api/audit");
      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error("Invalid audit data:", data);
        return;
      }

      setLogs(
        data.sort(
          (a, b) =>
            new Date(b.timestamp) -
            new Date(a.timestamp)
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadLogs();

    const interval = setInterval(
      loadLogs,
      3000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex bg-black text-white">
      <Sidebar />

      <main className="flex-1 min-h-screen bg-[radial-gradient(circle_at_top,#1a1a1a_0%,#000_50%)] p-8">
        <h1 className="text-4xl font-bold mb-8">
          Audit Trail
        </h1>

        {logs.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-400">
              No audit records found.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.auditId}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
              >
                <h2 className="font-semibold text-lg">
                  {log.employeeName || "Unknown Employee"}
                </h2>

                <p className="text-green-400 mt-1">
                  {log.employeeName || "Employee"} → {log.action}
                </p>

                <p className="text-zinc-500 text-sm mt-2">
                  {new Date(
                    log.timestamp
                  ).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}