"use client";

import { useEffect, useState } from "react";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);

  async function loadTasks() {
    const response = await fetch("/api/tasks");
    const data = await response.json();

    setTasks(data);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">
        Offboarding Tasks
      </h1>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.taskId}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
          >
            <div className="flex justify-between">
              <div>
                <h2 className="font-semibold">
                  {task.tool}
                </h2>

                <p className="text-zinc-400 text-sm">
                  Event ID: {task.eventId}
                </p>
              </div>

  <span className={`px-3 py-1 rounded-full ${
      task.status === "Completed"? "bg-green-500/20 text-green-400": "bg-yellow-500/20 text-yellow-400"
  }`}
>
  {task.status}
</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}