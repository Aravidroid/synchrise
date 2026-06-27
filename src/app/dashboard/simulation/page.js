"use client";

import { useEffect, useState } from "react";
import SimulationCard from "@/components/simulations/SimulationCard";
import Sidebar from "@/components/Sidebar";

export default function SimulationPage() {
  const [simulations, setSimulations] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/simulations/history");
      const data = await res.json();
      setSimulations(data);
    }

    load();
  }, []);

  return (
    <div className="flex bg-black text-white">
      <Sidebar />

      <main className="flex-1 min-h-screen bg-[radial-gradient(circle_at_top,#1a1a1a_0%,#000_50%)] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight">
              Impact Analysis
            </h1>
            <p className="text-zinc-400 mt-2">
              Preview every identity change before execution.
            </p>
          </div>

          <div className="space-y-6">
            {simulations.map((simulation) => (
              <SimulationCard
                key={simulation.simulationId}
                simulation={simulation}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}