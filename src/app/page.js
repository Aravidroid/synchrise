import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold mb-6">
        SyncHRise
      </h1>

      <p className="text-xl text-gray-600 mb-8">
        Employee Offboarding Automation Platform
      </p>

      <div className="flex gap-4">
        <Link
          href="/sign-up"
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Get Started
        </Link>

        <Link
          href="/sign-in"
          className="border px-6 py-3 rounded-lg"
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}