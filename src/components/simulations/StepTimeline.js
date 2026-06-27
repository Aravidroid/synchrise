export default function StepTimeline({ steps }) {

  return (

    <div className="space-y-4">

      {steps.map((step, index) => (

        <div
          key={index}
          className="flex justify-between items-center rounded-xl bg-[#18181b] border border-zinc-800 p-4"
        >

          <div className="flex items-center gap-4">

            <div className="w-3 h-3 rounded-full bg-cyan-400"></div>

            <div>

              <p className="font-medium">
                {step.provider}
              </p>

              <p className="text-zinc-400 text-sm">
                {step.action}
              </p>

            </div>

          </div>

          <div className="text-zinc-500">
            {step.estimatedSeconds}s
          </div>

        </div>

      ))}

    </div>

  );

}