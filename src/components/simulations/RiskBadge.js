export default function RiskBadge({ risk }) {

  const colors = {
    Low: "bg-emerald-500/20 text-emerald-400",

    Medium: "bg-yellow-500/20 text-yellow-400",

    High: "bg-orange-500/20 text-orange-400",

    Critical: "bg-red-500/20 text-red-400",
  };

  return (
    <div
      className={`px-4 py-2 rounded-full font-semibold ${colors[risk.severity]}`}
    >
      {risk.severity} • {risk.score}
    </div>
  );
}