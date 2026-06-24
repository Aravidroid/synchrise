export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Integrations
      </h1>

      <div className="border rounded-xl p-6">
        <h2 className="font-semibold">
          GitHub
        </h2>

        <a
          href="/api/github/install"
          className="mt-4 inline-block bg-black text-white px-4 py-2 rounded"
        >
          Connect GitHub
        </a>
      </div>
    </div>
  );
}