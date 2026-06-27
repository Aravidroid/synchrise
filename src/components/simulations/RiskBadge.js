export default function RiskBadge({ risk }) {
  const colors = {
    Low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    High: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    Critical: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const dotColors = {
    Low: "bg-emerald-400",
    Medium: "bg-yellow-400",
    High: "bg-orange-400",
    Critical: "bg-red-400",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-semibold text-sm border ${colors[risk.severity] || colors.Low}`}
    >
      <span className={`w-2 h-2 rounded-full ${dotColors[risk.severity] || dotColors.Low}`} />
      {risk.severity} · {risk.score}
    </div>
  );
}