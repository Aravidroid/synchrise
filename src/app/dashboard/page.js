"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function Dashboard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [compliance, setCompliance] = useState(null);

  const tools = [
    "Slack",
    "GitHub",
    "Google Workspace",
    "Notion",
    "Jira",
  ];

async function loadEvents() {
  try {
    const response = await fetch("/api/offboard");
    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("API returned:", data);
      return;
    }

    setEvents(
      data.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
    );
  } catch (error) {
    console.error(error);
  }
}

useEffect(() => {
  loadEvents();
  loadCompliance();

  const interval = setInterval(() => {
    loadEvents();
    loadCompliance();
  }, 3000);

  return () => clearInterval(interval);
}, []);

  function toggleTool(tool) {
    if (selectedTools.includes(tool)) {
      setSelectedTools(
        selectedTools.filter((t) => t !== tool)
      );
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  }

  async function createEvent() {
    if (!name.trim() || !email.trim()) {
      alert("Please fill all fields");
      return;
    }

    if (selectedTools.length === 0) {
      alert("Select at least one application");
      return;
    }

    try {
      const response = await fetch("/api/offboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeName: name,
          employeeEmail: email,
          tools: selectedTools,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await loadEvents();
        await loadCompliance();

        setName("");
        setEmail("");
        setSelectedTools([]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function loadCompliance() {
  const response = await fetch("/api/compliance");
  const data = await response.json();

  setCompliance(data);
}

  const totalOffboardings = events.length;

  const pendingTasks = events.filter(
    (event) => event.status === "Pending"
  ).length;

  const completedTasks = events.filter(
    (event) => event.status === "Completed"
  ).length;

  return (
  <div className="flex bg-black text-white">
    <Sidebar />

    <main className="flex-1 min-h-screen bg-[radial-gradient(circle_at_top,#1a1a1a_0%,#000_50%)]">
      {/* Header */}
<div className="border-b border-zinc-800 px-8 py-5 flex justify-between items-center">
  <div>
    <h1 className="text-3xl font-bold">
      SyncHRise Dashboard
    </h1>

    <p className="text-zinc-400 mt-1">
      Employee Offboarding Management
    </p>
  </div>


</div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-zinc-400">
              Total Offboardings
            </h2>
            <p className="text-4xl font-bold mt-2">
              {totalOffboardings}
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-zinc-400">
              Pending Offboardings
            </h2>
            <p className="text-4xl font-bold mt-2">
              {pendingTasks}
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-zinc-400">
              Completed
            </h2>
            <p className="text-4xl font-bold mt-2">
              {completedTasks}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-5">
            Start Employee Offboarding
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Employee Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 outline-none focus:border-white"
            />

            <input
              type="email"
              placeholder="Employee Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 outline-none focus:border-white"
            />
          </div>

          {/* Tool Selection */}
          <div className="mt-6">
            <p className="text-zinc-300 mb-3">
              Select Applications
            </p>

            <div className="flex flex-wrap gap-3">
              {tools.map((tool) => (
                <button
                  key={tool}
                  type="button"
                  onClick={() =>
                    toggleTool(tool)
                  }
                  className={`px-4 py-2 rounded-lg border transition ${
                    selectedTools.includes(tool)
                      ? "bg-white text-black border-white"
                      : "bg-zinc-800 text-white border-zinc-700"
                  }`}
                >
                  {tool}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={createEvent}
            className="mt-6 bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-zinc-200 transition"
          >
            Create Offboarding Event
          </button>
        </div>

        {/* Events */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-5">
            Recent Events
          </h2>

          {events.length === 0 ? (
            <p className="text-zinc-400">
              No offboarding events yet.
            </p>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="border border-zinc-800 rounded-xl p-4 bg-zinc-950"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {event.employeeName}
                      </h3>

                      <p className="text-zinc-400">
                        {event.employeeEmail}
                      </p>

                      {event.tools?.length > 0 && (
                        <p className="text-blue-400 text-sm mt-2">
                          {event.tools.join(" • ")}
                        </p>
                      )}

                      <p className="text-zinc-500 text-sm mt-2">
                        {new Date(
                          event.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        event.status ===
                        "Completed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
    </div>
  );
}