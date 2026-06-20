"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function AnalyticsPage() {
  const [compliance, setCompliance] = useState(null);

  async function loadCompliance() {
    const response = await fetch("/api/compliance");
    const data = await response.json();
    setCompliance(data);
  }

  useEffect(() => {
    loadCompliance();
  }, []);

  return (
    <div className="flex bg-black text-white">
      <Sidebar />

      <main className="flex-1 min-h-screen bg-[radial-gradient(circle_at_top,#1a1a1a_0%,#000_50%)] p-8">
        <h1 className="text-4xl font-bold mb-8">
          Analytics
        </h1>

        {compliance && (
          <div className="grid md:grid-cols-4 gap-6">

            <div className="bg-zinc-900 p-6 rounded-xl">
              <h2 className="text-zinc-400">
                Employees Completed
              </h2>

              <p className="text-4xl font-bold text-green-400 mt-2">
                {compliance.completedEmployees}
              </p>
            </div>

            <div className="bg-zinc-900 p-6 rounded-xl">
              <h2 className="text-zinc-400">
                Total Tasks
              </h2>

              <p className="text-4xl font-bold mt-2">
                {compliance.totalTasks}
              </p>
            </div>

            <div className="bg-zinc-900 p-6 rounded-xl">
              <h2 className="text-zinc-400">
                Completed Tasks
              </h2>

              <p className="text-4xl font-bold text-green-400 mt-2">
                {compliance.completedTasks}
              </p>
            </div>

            <div className="bg-zinc-900 p-6 rounded-xl">
              <h2 className="text-zinc-400">
                Audit Records
              </h2>

              <p className="text-4xl font-bold mt-2">
                {compliance.totalAuditLogs}
              </p>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}