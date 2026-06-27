import RiskBadge from "./RiskBadge";

export default function ComparisonView({ baseSimulation, compareSimulation, onClose }) {
  if (!baseSimulation || !compareSimulation) return null;

  const baseSteps = baseSimulation.steps || [];
  const compareSteps = compareSimulation.steps || [];

  const baseStepMap = new Map(baseSteps.map(s => [`${s.provider}:${s.action}`, s]));
  const compareStepMap = new Map(compareSteps.map(s => [`${s.provider}:${s.action}`, s]));

  const allKeys = [...new Set([...baseStepMap.keys(), ...compareStepMap.keys()])];

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-8 overflow-y-auto">
      <div className="bg-[#111113] border border-zinc-800 p-8 rounded-3xl w-full max-w-5xl my-auto">
        <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-6">
          <h2 className="text-3xl font-semibold text-white">Scenario Comparison</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8 border-b border-zinc-800 pb-8">
          {/* Base */}
          <div className="bg-[#18181b] p-6 rounded-2xl border border-zinc-800">
            <h3 className="text-xl font-medium text-white mb-4">{baseSimulation.scenarioName || "Original"} (v1)</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Risk</span>
                <RiskBadge risk={baseSimulation.risk} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Est. Time</span>
                <span className="text-white font-medium">{baseSimulation.estimatedSeconds}s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Actions</span>
                <span className="text-white font-medium">{baseSteps.length}</span>
              </div>
            </div>
          </div>

          {/* Compare */}
          <div className="bg-[#18181b] p-6 rounded-2xl border border-zinc-800 relative">
            <h3 className="text-xl font-medium text-white mb-4">{compareSimulation.scenarioName} (v{compareSimulation.version})</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Risk</span>
                <RiskBadge risk={compareSimulation.risk} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Est. Time</span>
                <span className="text-white font-medium">{compareSimulation.estimatedSeconds}s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Actions</span>
                <span className="text-white font-medium">{compareSteps.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-medium text-white mb-6">Action Differences</h3>
          <div className="space-y-3">
            {allKeys.map(key => {
              const inBase = baseStepMap.has(key);
              const inCompare = compareStepMap.has(key);
              const step = baseStepMap.get(key) || compareStepMap.get(key);

              let statusClass = "bg-zinc-800/30 border-zinc-800 text-zinc-300";
              let statusText = "Unchanged";

              if (inBase && !inCompare) {
                statusClass = "bg-red-900/10 border-red-900/50 text-red-400";
                statusText = "Removed";
              } else if (!inBase && inCompare) {
                statusClass = "bg-green-900/10 border-green-900/50 text-green-400";
                statusText = "Added";
              }

              return (
                <div key={key} className={`flex justify-between items-center p-4 rounded-xl border transition-colors ${statusClass}`}>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium text-white">{step.provider}</p>
                      <p className="text-sm opacity-80">{step.action}</p>
                    </div>
                  </div>
                  <div className={`font-medium text-sm px-3 py-1 rounded-full ${inBase && !inCompare ? 'bg-red-950 text-red-400' : (!inBase && inCompare ? 'bg-green-950 text-green-400' : 'bg-black/20 text-zinc-400')}`}>
                    {statusText}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
