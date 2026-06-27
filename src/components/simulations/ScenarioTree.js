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

  return (
    <div className="mt-8 p-6 bg-[#18181b] rounded-2xl border border-zinc-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
        <h3 className="text-lg font-medium text-white">Scenarios</h3>
        <p className="text-sm text-zinc-400">
          Select any scenario to compare with the original.
        </p>
      </div>

      <div className="space-y-4">
        {/* ── Parent / Root Node ── */}
        <div className="flex items-center gap-4 relative">
          {/* Pulsing white root dot */}
          <div className="relative flex items-center justify-center w-5 h-5 z-10 shrink-0">
            <div className="w-4 h-4 rounded-full bg-white animate-pulse-ring" />
          </div>

          {/* Root card */}
          <div className="flex-1 bg-zinc-900 border border-zinc-700 border-l-4 border-l-zinc-400 p-4 rounded-xl flex justify-between items-center">
            <div>
              <p className="font-medium text-white">
                {parentSimulation.scenarioName || "Original"}
              </p>
              <p className="text-sm text-zinc-500">v1 · Base plan</p>
            </div>
            <div className="text-zinc-400 text-sm">
              {(parentSimulation.steps || []).length} actions
            </div>
          </div>
        </div>

        {/* ── Children ── */}
        <div className="pl-2 relative">
          {/* Animated vertical connector line — grows downward */}
          <div
            className="absolute top-0 left-[9px] w-0.5 bg-gradient-to-b from-zinc-600 to-zinc-800 animate-draw-line"
            style={{ height: "100%", transformOrigin: "top" }}
          />

          <div className="space-y-4 pt-2">
            {scenarios.map((scen, index) => {
              const severity = scen.risk?.severity ?? "Low";
              const borderClass = RISK_BORDER[severity] ?? "border-l-cyan-500/60";
              const nodeShadow  = RISK_NODE_SHADOW[severity] ?? "shadow-[0_0_10px_rgba(6,182,212,0.55)]";
              const nodeColor   = RISK_NODE_COLOR[severity]  ?? "bg-cyan-400";

              return (
                <div
                  key={scen.scenarioId}
                  className="flex items-center gap-4 relative animate-slide-in-card"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {/* Horizontal branch line */}
                  <div className="w-6 border-b border-zinc-700 shrink-0" />

                  {/* Risk-tinted pulsing node */}
                  <div
                    className={`w-3 h-3 rounded-full ${nodeColor} ${nodeShadow} animate-node-pop animate-pulse-ring-cyan z-10 shrink-0 -ml-[22px]`}
                    style={{ animationDelay: `${index * 80}ms` }}
                  />

                  {/* Scenario card */}
                  <div
                    className={`flex-1 bg-[#111113] border border-zinc-800 border-l-4 ${borderClass} p-4 rounded-xl flex justify-between items-center
                      hover:-translate-y-0.5 hover:border-zinc-600 hover:shadow-[0_0_18px_rgba(6,182,212,0.1)]
                      transition-all duration-300 cursor-default`}
                  >
                    <div>
                      <p className="font-medium text-white">{scen.scenarioName}</p>
                      <p className="text-sm text-zinc-500">
                        v{scen.version} ·{" "}
                        <span className={`font-medium ${
                          severity === "Low"      ? "text-emerald-400" :
                          severity === "Medium"   ? "text-yellow-400"  :
                          severity === "High"     ? "text-orange-400"  :
                                                   "text-red-400"
                        }`}>
                          {severity} Risk
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="text-zinc-500 text-sm">
                        {(scen.steps || []).length} actions
                      </div>
                      <button
                        onClick={() => onSelectToCompare(scen)}
                        className="text-sm border border-zinc-700 px-4 py-2 rounded-lg hover:bg-zinc-800 hover:border-zinc-500 transition text-white"
                      >
                        Compare
                      </button>
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
