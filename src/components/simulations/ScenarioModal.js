import { useState } from "react";
import { buildSimulation } from "@/lib/simulation/buildSimulation";
import { calculateRisk } from "@/lib/simulation/calculateRisk";

export default function ScenarioModal({ simulation, nextVersion, onClose, onSuccess }) {
  const [scenarioName, setScenarioName] = useState("");
  const [excludedProviders, setExcludedProviders] = useState([]);

  const toggleProvider = (provider) => {
    setExcludedProviders((prev) =>
      prev.includes(provider) ? prev.filter((p) => p !== provider) : [...prev, provider]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!scenarioName.trim()) return;

    // Create frontend-only scenario
    // We recreate tasks from the original simulation's providers (or event if we had it, but we can just use the providers)
    // Wait, the original simulation has steps. `buildSimulation` expects `event` and `tasks`.
    // The `simulation` object we have here IS the event-based simulation. It has employeeName, employeeEmail, githubUsername, etc.
    const mockEvent = {
      employeeName: simulation.employeeName,
      employeeEmail: simulation.employeeEmail,
      githubUsername: simulation.githubUsername,
      id: simulation.simulationId,
    };
    
    const includedTasks = (simulation.providers || [])
      .filter((p) => !excludedProviders.includes(p))
      .map((tool) => ({ tool }));

    const newSimData = buildSimulation(mockEvent, includedTasks);
    const newRisk = calculateRisk(newSimData);

    const scenario = {
      scenarioId: crypto.randomUUID(),
      parentSimulationId: simulation.simulationId,
      scenarioName,
      version: nextVersion,
      excludedProviders,
      ...newSimData,
      risk: newRisk,
      status: "Draft",
      createdAt: new Date().toISOString(),
    };

    onSuccess(scenario);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#111113] border border-zinc-800 p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-white mb-6">Create Scenario</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Scenario Name</label>
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="e.g. No GitHub Access"
              className="w-full bg-[#18181b] border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-3">Include Systems</label>
            <div className="space-y-3">
              {(simulation.providers || []).map((provider) => {
                const isIncluded = !excludedProviders.includes(provider);
                return (
                  <label key={provider} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isIncluded}
                      onChange={() => toggleProvider(provider)}
                      className="w-5 h-5 accent-zinc-500 rounded border-zinc-700 bg-[#18181b]"
                    />
                    <span className={isIncluded ? "text-white" : "text-zinc-500"}>{provider}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-zinc-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!scenarioName.trim()}
              className="flex-1 bg-white text-black py-3 rounded-xl font-medium hover:bg-zinc-200 transition disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
