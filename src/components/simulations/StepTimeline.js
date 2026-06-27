export default function StepTimeline({ steps }) {
  if (!steps || steps.length === 0) {
    return (
      <p className="text-zinc-600 text-sm italic">No steps defined.</p>
    );
  }

  const PROVIDER_COLORS = {
    GitHub:            "bg-zinc-700/50 border-zinc-600/60 text-white",
    Slack:             "bg-[#4A154B]/25 border-[#E01E5A]/30 text-[#E01E5A]",
    "Google Workspace":"bg-[#4285F4]/10 border-[#4285F4]/30 text-[#4285F4]",
    Notion:            "bg-zinc-800/60 border-zinc-600/40 text-zinc-300",
    Jira:              "bg-[#0052CC]/15 border-[#0052CC]/30 text-[#0052CC]",
  };

  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const chipClass = PROVIDER_COLORS[step.provider] || "bg-zinc-800 border-zinc-700 text-zinc-300";
        return (
          <div
            key={index}
            className="flex items-center justify-between rounded-xl bg-zinc-900/60 border border-zinc-800 p-4 gap-4"
          >
            {/* Left: index + provider chip + action */}
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs text-zinc-600 font-mono tabular-nums w-5 shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${chipClass} shrink-0`}>
                {step.provider}
              </span>
              <p className="text-sm text-zinc-300 truncate">{step.action}</p>
            </div>

            {/* Right: estimated time */}
            <span className="text-xs text-zinc-600 font-mono shrink-0">
              ~{step.estimatedSeconds}s
            </span>
          </div>
        );
      })}
    </div>
  );
}