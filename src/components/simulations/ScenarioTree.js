"use client";

const RISK_BORDER = {
  Low:      "border-l-emerald-500/60",
  Medium:   "border-l-yellow-500/60",
  High:     "border-l-orange-500/60",
  Critical: "border-l-red-500/60",
};

const RISK_NODE_SHADOW = {
  Low:      "shadow-[0_0_10px_rgba(52,211,153,0.55)]",
  Medium:   "shadow-[0_0_10px_rgba(234,179,8,0.55)]",
  High:     "shadow-[0_0_10px_rgba(249,115,22,0.55)]",
  Critical: "shadow-[0_0_10px_rgba(239,68,68,0.55)]",
};

const RISK_NODE_COLOR = {
  Low:      "bg-emerald-400",
  Medium:   "bg-yellow-400",
  High:     "bg-orange-400",
  Critical: "bg-red-400",
};

export default function ScenarioTree({ parentSimulation, scenarios, onSelectToCompare }) {
  if (!scenarios || scenarios.length === 0) return null;

  // Compute risk range for subtitle
  const severities = scenarios.map((s) => s.risk?.severity ?? "Low");
  const severityOrder = { Low: 0, Medium: 1, High: 2, Critical: 3 };
  const sorted = [...new Set(severities)].sort((a, b) => severityOrder[a] - severityOrder[b]);
  const rangeText = sorted.length === 1 ? sorted[0] : `${sorted[0]} to ${sorted[sorted.length - 1]}`;

  const parentStepCount = (parentSimulation.steps || []).length;

  return (
    <div className="mt-8 p-6 bg-[#18181b] rounded-2xl border border-zinc-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-lg font-medium text-white">Identity Branches</h3>
          <p className="text-xs text-zinc-500 mt-1">
            {scenarios.length} branch{scenarios.length !== 1 ? "es" : ""} · {rangeText} risk
          </p>
        </div>
        <p className="text-sm text-zinc-400">
          Compare any branch with the original plan.
        </p>
      </div>

      <div className="space-y-4">
        {/* ── Parent / Root Node ── */}
        <div className="flex items-center gap-4 relative">
          <div className="relative flex items-center justify-center w-5 h-5 z-10 shrink-0">
            <div className="w-4 h-4 rounded-full bg-white animate-pulse-ring" />
          </div>

          <div className="flex-1 bg-zinc-900 border border-zinc-700 border-l-4 border-l-zinc-400 p-4 rounded-xl flex justify-between items-center">
            <div>
              <p className="font-medium text-white">
                {parentSimulation.scenarioName || "Original Plan"}
              </p>
              <p className="text-sm text-zinc-500">v1 · Base plan</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-400 text-sm">{parentStepCount} actions</span>
              {parentSimulation.risk && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  parentSimulation.risk.severity === "Critical" ? "bg-red-500/15 text-red-400" :
                  parentSimulation.risk.severity === "High" ? "bg-orange-500/15 text-orange-400" :
                  parentSimulation.risk.severity === "Medium" ? "bg-yellow-500/15 text-yellow-400" :
                  "bg-emerald-500/15 text-emerald-400"
                }`}>
                  {parentSimulation.risk.score}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Children ── */}
        <div className="pl-2 relative">
          <div
            className="absolute top-0 left-[9px] w-0.5 bg-gradient-to-b from-zinc-600 to-zinc-800 animate-draw-line"
            style={{ height: "100%", transformOrigin: "top" }}
          />

          <div className="space-y-4 pt-2">
            {scenarios.map((scen, index) => {
              const severity = scen.risk?.severity ?? "Low";
              const borderClass = RISK_BORDER[severity] ?? "border-l-cyan-500/60";
              const nodeShadow = RISK_NODE_SHADOW[severity] ?? "shadow-[0_0_10px_rgba(6,182,212,0.55)]";
              const nodeColor = RISK_NODE_COLOR[severity] ?? "bg-cyan-400";
              const scenStepCount = (scen.steps || []).length;
              const stepDelta = scenStepCount - parentStepCount;
              const stepDeltaText = stepDelta === 0 ? "same" : stepDelta > 0 ? `+${stepDelta}` : `${stepDelta}`;

              return (
                <div
                  key={scen.scenarioId}
                  className="flex items-center gap-4 relative animate-slide-in-card"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="w-6 border-b border-zinc-700 shrink-0" />

                  <div
                    className={`w-3 h-3 rounded-full ${nodeColor} ${nodeShadow} animate-node-pop animate-pulse-ring-cyan z-10 shrink-0 -ml-[22px]`}
                    style={{ animationDelay: `${index * 80}ms` }}
                  />

                  <div
                    className={`flex-1 bg-[#111113] border border-zinc-800 border-l-4 ${borderClass} p-4 rounded-xl
                      hover:-translate-y-0.5 hover:border-zinc-600 hover:shadow-[0_0_18px_rgba(6,182,212,0.1)]
                      transition-all duration-300 cursor-default`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white">{scen.scenarioName}</p>
                        <p className="text-sm text-zinc-500">
                          v{scen.version} ·{" "}
                          <span className={`font-medium ${
                            severity === "Low" ? "text-emerald-400" :
                            severity === "Medium" ? "text-yellow-400" :
                            severity === "High" ? "text-orange-400" :
                            "text-red-400"
                          }`}>
                            {severity} Risk
                          </span>
                        </p>
                        {/* Annotation tag */}
                        {scen.annotation && (
                          <span className={`inline-block text-xs mt-1.5 font-medium ${scen.annotationColor || "text-zinc-500"}`}>
                            {scen.annotation}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        {/* Step count + delta */}
                        <div className="text-right">
                          <span className="text-zinc-400 text-sm">{scenStepCount} actions</span>
                          <span className={`block text-xs font-mono ${
                            stepDelta < 0 ? "text-red-400" : stepDelta > 0 ? "text-emerald-400" : "text-zinc-600"
                          }`}>
                            {stepDeltaText} vs. original
                          </span>
                        </div>
                        {/* Risk score mini-badge */}
                        {scen.risk && (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            severity === "Critical" ? "bg-red-500/15 text-red-400" :
                            severity === "High" ? "bg-orange-500/15 text-orange-400" :
                            severity === "Medium" ? "bg-yellow-500/15 text-yellow-400" :
                            "bg-emerald-500/15 text-emerald-400"
                          }`}>
                            {scen.risk.score}
                          </span>
                        )}
                        <button
                          onClick={() => onSelectToCompare(scen)}
                          className="text-sm border border-zinc-700 px-4 py-2 rounded-lg hover:bg-zinc-800 hover:border-zinc-500 transition text-white"
                        >
                          Compare
                        </button>
                      </div>
                    </div>
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
