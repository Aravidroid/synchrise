import RiskBadge from "./RiskBadge";

// ── Compliance helper (same logic as SimulationCard) ──────────────────────────
function getComplianceImpact(providers) {
  const has = (p) => (providers || []).includes(p);
  if (has("GitHub") && has("Google Workspace")) {
    return { level: "Critical", color: "text-red-400" };
  }
  if (has("GitHub") || has("Google Workspace")) {
    return { level: "At Risk", color: "text-orange-400" };
  }
  return { level: "Compliant", color: "text-emerald-400" };
}

export default function ComparisonView({ baseSimulation, compareSimulation, onClose }) {
  if (!baseSimulation || !compareSimulation) return null;

  const baseSteps = baseSimulation.steps || [];
  const compareSteps = compareSimulation.steps || [];

  const baseStepMap = new Map(baseSteps.map((s) => [`${s.provider}:${s.action}`, s]));
  const compareStepMap = new Map(compareSteps.map((s) => [`${s.provider}:${s.action}`, s]));

  const allKeys = [...new Set([...baseStepMap.keys(), ...compareStepMap.keys()])];

  // ── Impact deltas ──────────────────────────────────────────────────────────
  const riskDelta = (compareSimulation.risk?.score ?? 0) - (baseSimulation.risk?.score ?? 0);
  const timeDelta = (compareSimulation.estimatedSeconds ?? 0) - (baseSimulation.estimatedSeconds ?? 0);
  const baseCompliance = getComplianceImpact(baseSimulation.providers);
  const compareCompliance = getComplianceImpact(compareSimulation.providers);

  // ── Risk factor diff ───────────────────────────────────────────────────────
  const baseFactorIds = new Set((baseSimulation.risk?.factors || []).map((f) => f.id));
  const compareFactorIds = new Set((compareSimulation.risk?.factors || []).map((f) => f.id));
  const allFactors = [
    ...(baseSimulation.risk?.factors || []),
    ...(compareSimulation.risk?.factors || []).filter((f) => !baseFactorIds.has(f.id)),
  ];

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-8 overflow-y-auto">
      <div className="bg-[#111113] border border-zinc-800 p-8 rounded-3xl w-full max-w-5xl my-auto">
        {/* ── Header ── */}
        <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-6">
          <div>
            <h2 className="text-3xl font-semibold text-white">Branch Comparison</h2>
            <p className="text-sm text-zinc-500 mt-1">
              Side-by-side impact analysis of offboarding paths.
            </p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>

        {/* ── Impact Summary Row ── */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Risk delta */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Risk Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-zinc-400">{baseSimulation.risk?.score ?? 0}</span>
              <span className="text-zinc-600">→</span>
              <span className={`text-lg font-bold ${
                riskDelta < 0 ? "text-emerald-400" : riskDelta > 0 ? "text-red-400" : "text-zinc-300"
              }`}>
                {compareSimulation.risk?.score ?? 0}
              </span>
              <span className={`text-xs font-mono font-medium ${
                riskDelta < 0 ? "text-emerald-400" : riskDelta > 0 ? "text-red-400" : "text-zinc-500"
              }`}>
                ({riskDelta > 0 ? "+" : ""}{riskDelta})
              </span>
            </div>
          </div>

          {/* Time delta */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Duration</p>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-zinc-400">{baseSimulation.estimatedSeconds}s</span>
              <span className="text-zinc-600">→</span>
              <span className="text-lg font-bold text-zinc-300">{compareSimulation.estimatedSeconds}s</span>
              <span className={`text-xs font-mono font-medium ${
                timeDelta < 0 ? "text-cyan-400" : timeDelta > 0 ? "text-orange-400" : "text-zinc-500"
              }`}>
                ({timeDelta > 0 ? "+" : ""}{timeDelta}s)
              </span>
            </div>
          </div>

          {/* Compliance delta */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Compliance</p>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${baseCompliance.color}`}>{baseCompliance.level}</span>
              <span className="text-zinc-600">→</span>
              <span className={`text-sm font-semibold ${compareCompliance.color}`}>{compareCompliance.level}</span>
            </div>
          </div>
        </div>

        {/* ── Side-by-side summary ── */}
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

        {/* ── Risk Factor Diff ── */}
        {allFactors.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-white mb-4">Risk Factor Analysis</h3>
            <div className="space-y-2">
              {allFactors.map((factor) => {
                const inBase = baseFactorIds.has(factor.id);
                const inCompare = compareFactorIds.has(factor.id);

                let tagText = "Unchanged";
                let tagClass = "bg-zinc-800/60 text-zinc-500";
                let rowBorder = "border-zinc-800/50";

                if (inBase && !inCompare) {
                  tagText = "✓ Risk Eliminated";
                  tagClass = "bg-emerald-500/10 text-emerald-400";
                  rowBorder = "border-emerald-500/20";
                } else if (!inBase && inCompare) {
                  tagText = "⚠ Risk Added";
                  tagClass = "bg-red-500/10 text-red-400";
                  rowBorder = "border-red-500/20";
                }

                return (
                  <div key={factor.id} className={`flex items-center justify-between p-3 rounded-lg border ${rowBorder} bg-zinc-900/30`}>
                    <div className="flex items-center gap-3">
                      <span className="text-base">{factor.icon}</span>
                      <div>
                        <span className="text-sm font-medium text-white">{factor.title}</span>
                        <span className="text-xs text-zinc-600 ml-2">+{factor.points} pts</span>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${tagClass}`}>
                      {tagText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Action Differences ── */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Action Differences</h3>
          <div className="space-y-3">
            {allKeys.map((key) => {
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
                  <div className={`font-medium text-sm px-3 py-1 rounded-full ${
                    inBase && !inCompare ? "bg-red-950 text-red-400" :
                    !inBase && inCompare ? "bg-green-950 text-green-400" :
                    "bg-black/20 text-zinc-400"
                  }`}>
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
