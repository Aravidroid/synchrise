import RiskBadge from "./RiskBadge";
import StepTimeline from "./StepTimeline";

export default function SimulationCard({ simulation }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#111113] p-6 shadow-xl hover:border-zinc-700 transition">

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-2xl font-semibold text-white">
            {simulation.employeeName}
          </h2>

          <p className="text-zinc-400 mt-1">
            {simulation.employeeEmail}
          </p>

        </div>

        <RiskBadge risk={simulation.risk} />

      </div>

      <div className="grid grid-cols-3 gap-8 mt-8">

        <div>

          <p className="text-zinc-500 text-sm uppercase">
            Status
          </p>

          <p className="mt-2 font-medium">
            {simulation.status}
          </p>

        </div>

        <div>

          <p className="text-zinc-500 text-sm uppercase">
            Providers
          </p>

          <p className="mt-2">
            {simulation.providers.join(", ")}
          </p>

        </div>

        <div>

          <p className="text-zinc-500 text-sm uppercase">
            Estimated
          </p>

          <p className="mt-2">
            {simulation.estimatedSeconds}s
          </p>

        </div>

      </div>

      <div className="my-8 border-b border-zinc-800"></div>

      <StepTimeline
        steps={simulation.steps}
      />

      <div className="flex gap-4 mt-8">

        <button
          className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-zinc-200 transition"
        >
          Execute
        </button>

        <button
          className="border border-zinc-700 px-6 py-3 rounded-xl hover:bg-zinc-900 transition"
        >
          Replay
        </button>

      </div>

    </div>
  );
}