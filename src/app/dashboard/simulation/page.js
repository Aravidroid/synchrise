"use client";

import { useEffect, useState } from "react";
import SimulationCard from "@/components/simulations/SimulationCard";

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
    <div className="min-h-screen bg-[#0b0b0f] text-white p-8">

      <div className="mb-10">

        <h1 className="text-4xl font-bold tracking-tight">
          Simulations
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
  );
}