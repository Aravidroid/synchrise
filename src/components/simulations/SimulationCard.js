"use client";

import { useState, useEffect } from "react";

import { buildSimulation } from "@/lib/simulation/buildSimulation";
import { calculateRisk } from "@/lib/simulation/calculateRisk";
import RiskBadge from "./RiskBadge";
import StepTimeline from "./StepTimeline";
import ScenarioTree from "./ScenarioTree";
import ComparisonView from "./ComparisonView";

// ── Template definitions ──────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: "exclude-github",
    label: "🚫 Exclude GitHub",
    name: "Exclude GitHub",
    /** Returns the providers to include for this template */
    filter: (providers) => providers.filter((p) => p !== "GitHub"),
    /** Hide template when GitHub is not present */
    isVisible: (providers) => providers.includes("GitHub"),
    /** No timing override */
    transformSteps: null,
  },
  {
    id: "slack-only",
    label: "💬 Slack Only",
    name: "Slack Only",
    filter: (providers) => providers.filter((p) => p === "Slack"),
    isVisible: (providers) => providers.includes("Slack"),
    transformSteps: null,
  },
  {
    id: "instant-lockdown",
    label: "⚡ Instant Lockdown",
    name: "Instant Lockdown",
    filter: (providers) => providers,
    isVisible: () => true,
    /** Zero out all timing */
    transformSteps: (steps) => steps.map((s) => ({ ...s, estimatedSeconds: 0 })),
  },
  {
    id: "full-offboarding",
    label: "📋 Full Offboarding",
    name: "Full Offboarding",
    filter: (providers) => providers,
    isVisible: () => true,
    transformSteps: null,
  },
];

export default function SimulationCard({ simulation: initialSimulation }) {
  const [simulation, setSimulation] = useState(initialSimulation);
  const [isExecuting, setIsExecuting] = useState(simulation.status === "Running");
  const [showReplay, setShowReplay] = useState(false);
  const [replayEvents, setReplayEvents] = useState([]);
  const [isLoadingReplay, setIsLoadingReplay] = useState(false);

  // Frontend-only scenarios state
  const [scenarios, setScenarios] = useState([]);
  const [compareTarget, setCompareTarget] = useState(null);
  const [recentTemplate, setRecentTemplate] = useState(null);

  const handleQuickCreate = (template) => {
    const providers = simulation.providers || [];
    const includedProviders = template.filter(providers);
    // Note: we intentionally allow empty includedProviders (e.g. "Exclude GitHub"
    // when GitHub is the only provider) — this creates a valid "no actions" scenario.

    const mockEvent = {
      employeeName: simulation.employeeName,
      employeeEmail: simulation.employeeEmail,
      githubUsername: simulation.githubUsername,
      id: simulation.simulationId,
    };

    const includedTasks = includedProviders.map((tool) => ({ tool }));
    const newSimData = buildSimulation(mockEvent, includedTasks);

    // Apply step transform if defined (e.g. instant lockdown zeroes timings)
    if (template.transformSteps) {
      newSimData.steps = template.transformSteps(newSimData.steps);
      newSimData.estimatedSeconds = newSimData.steps.reduce(
        (sum, s) => sum + s.estimatedSeconds,
        0
      );
    }

    const newRisk = calculateRisk(newSimData);
    const scenario = {
      scenarioId: crypto.randomUUID(),
      parentSimulationId: simulation.simulationId,
      scenarioName: template.name,
      version: scenarios.length + 2,
      ...newSimData,
      risk: newRisk,
      status: "Draft",
      createdAt: new Date().toISOString(),
    };

    setScenarios((prev) => [...prev, scenario]);
    setRecentTemplate(template.id);
    // Flash the "added" indicator then clear it
    setTimeout(() => setRecentTemplate(null), 1800);
  };

  // Computed Progress
  const executedStepsCount = replayEvents.filter(ev => ev.eventName === "Step Executed").length;
  const totalSteps = simulation.steps?.length || 1;
  const progressPercent = Math.min(100, Math.round((executedStepsCount / totalSteps) * 100));

  useEffect(() => {
    let interval;
    if (isExecuting) {
      // Poll for timeline updates during execution
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/simulations/replay?id=${simulation.simulationId}`);
          const data = await res.json();
          if (data.success) {
            setReplayEvents(data.timeline);
            
            // Check for completion
            const terminalEvent = data.timeline.find(
              ev => ev.eventName === "Simulation Completed" || ev.eventName === "Simulation Failed"
            );
            
            if (terminalEvent) {
              setIsExecuting(false);
              const finalStatus = terminalEvent.eventName === "Simulation Completed" ? "Completed" : "Failed";
              setSimulation(prev => ({ ...prev, status: finalStatus }));
            }
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isExecuting, simulation.simulationId]);

  const handleExecute = async () => {
    setIsExecuting(true);
    setSimulation((prev) => ({ ...prev, status: "Running" }));
    setShowReplay(true); // Automatically show timeline during execution
    
    try {
      const res = await fetch("/api/simulations/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ simulationId: simulation.simulationId }),
      });
      const data = await res.json();
      
      if (!data.success) {
        setSimulation((prev) => ({ ...prev, status: "Failed" }));
        setIsExecuting(false);
      }
    } catch (e) {
      setSimulation((prev) => ({ ...prev, status: "Failed" }));
      setIsExecuting(false);
    }
  };

  const handleReplay = async () => {
    if (showReplay) {
      setShowReplay(false);
      return;
    }
    
    setShowReplay(true);
    setIsLoadingReplay(true);
    
    try {
      const res = await fetch(`/api/simulations/replay?id=${simulation.simulationId}`);
      const data = await res.json();
      if (data.success) {
        setReplayEvents(data.timeline);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingReplay(false);
    }
  };

  return (
    <div className={`rounded-2xl border ${isExecuting ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'border-zinc-800'} bg-[#111113] p-6 transition-all duration-500`}>
      
      {isExecuting && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-cyan-400 mb-2 font-medium">
            <span>Executing Plan...</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-400 transition-all duration-700 ease-out" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      )}

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
          <p className="text-zinc-500 text-sm uppercase">Status</p>
          <p className={`mt-2 font-medium ${simulation.status === 'Completed' ? 'text-green-400' : simulation.status === 'Running' ? 'text-cyan-400' : simulation.status === 'Failed' ? 'text-red-400' : 'text-white'}`}>
            {simulation.status}
          </p>
        </div>
        <div>
          <p className="text-zinc-500 text-sm uppercase">Providers</p>
          <p className="mt-2 text-zinc-300">
            {simulation.providers?.join(", ") || "None"}
          </p>
        </div>
        <div>
          <p className="text-zinc-500 text-sm uppercase">Estimated</p>
          <p className="mt-2 text-zinc-300">
            {simulation.estimatedSeconds}s
          </p>
        </div>
      </div>

      <div className="my-8 border-b border-zinc-800"></div>

      <StepTimeline steps={simulation.steps || []} />

      <div className="flex gap-4 mt-8">
        <button
          onClick={handleExecute}
          disabled={isExecuting || simulation.status === "Completed"}
          className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
        >
          {isExecuting ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          ) : simulation.status === "Completed" ? (
            "Completed"
          ) : (
            "Execute"
          )}
        </button>

        <button
          onClick={handleReplay}
          className="border border-zinc-700 px-6 py-3 rounded-xl hover:bg-zinc-900 transition text-zinc-300 hover:text-white"
        >
          {showReplay ? "Hide Timeline" : "View Timeline"}
        </button>


      </div>

      {/* ── Quick-Create Template Pills ── */}
      {!isExecuting && (simulation.providers || []).length > 0 && (
        <div className="mt-6 pt-5 border-t border-zinc-800/60">
          <p className="text-xs uppercase tracking-widest text-zinc-600 mb-3 font-medium">
            Quick Scenarios
          </p>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.filter((t) => t.isVisible(simulation.providers || [])).map(
              (template) => {
                const isJustAdded = recentTemplate === template.id;
                return (
                  <button
                    key={template.id}
                    onClick={() => handleQuickCreate(template)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                      isJustAdded
                        ? "border-cyan-500 bg-cyan-500/15 text-cyan-300 scale-95"
                        : "border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800 hover:text-white hover:scale-105 active:scale-95"
                    }`}
                  >
                    {isJustAdded ? "✓ Added" : template.label}
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}

      <ScenarioTree
        parentSimulation={simulation}
        scenarios={scenarios}
        onSelectToCompare={(scen) => setCompareTarget(scen)}
      />

      {compareTarget && (
        <ComparisonView
          baseSimulation={simulation}
          compareSimulation={compareTarget}
          onClose={() => setCompareTarget(null)}
        />
      )}

      {showReplay && (
        <div className="mt-8 p-5 bg-zinc-900/50 rounded-xl border border-zinc-800/80">
          <h3 className="text-lg font-medium text-white mb-4">Execution Timeline</h3>
          {isLoadingReplay ? (
            <p className="text-zinc-400 flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></span> Loading...
            </p>
          ) : replayEvents.length === 0 ? (
            <p className="text-zinc-500 italic">Timeline is empty.</p>
          ) : (
            <div className="space-y-4">
              {replayEvents.map((ev, i) => {
                const isSuccess = ev.details?.success !== false;
                return (
                  <div key={i} className={`flex flex-col border-l-2 pl-4 py-1 transition-all duration-300 animate-in slide-in-from-left-2 fade-in ${isSuccess ? 'border-zinc-700' : 'border-red-500/50'}`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${isSuccess ? 'text-zinc-200' : 'text-red-400'}`}>{ev.eventName}</span>
                      <span className="text-xs text-zinc-500 font-mono">{new Date(ev.createdAt).toLocaleTimeString()}</span>
                    </div>
                    {ev.action && (
                      <p className="text-sm text-zinc-400 mt-1">{ev.action}</p>
                    )}
                  </div>
                );
              })}
              {isExecuting && (
                <div className="flex items-center gap-3 text-cyan-400/80 text-sm italic py-2 pl-4 border-l-2 border-cyan-500/30">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                  </span>
                  Processing next step...
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}