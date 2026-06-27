"use client";

import { useState, useEffect } from "react";
import { buildSimulation } from "@/lib/simulation/buildSimulation";
import { calculateRisk } from "@/lib/simulation/calculateRisk";
import RiskBadge from "./RiskBadge";
import StepTimeline from "./StepTimeline";
import ScenarioTree from "./ScenarioTree";
import ComparisonView from "./ComparisonView";

// ── Provider icons for summary cards ─────────────────────────────────────────
const PROVIDER_ICONS = {
  GitHub: {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    bg: "bg-zinc-700/40",
    border: "border-zinc-500/40",
    text: "text-white",
  },
  Slack: {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
      </svg>
    ),
    bg: "bg-[#E01E5A]/15",
    border: "border-[#E01E5A]/30",
    text: "text-[#E01E5A]",
  },
  "Google Workspace": {
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    ),
    bg: "bg-[#4285F4]/10",
    border: "border-[#4285F4]/30",
    text: "text-[#4285F4]",
  },
  Notion: {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
      </svg>
    ),
    bg: "bg-zinc-700/30",
    border: "border-zinc-600/40",
    text: "text-zinc-200",
  },
  Jira: {
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4">
        <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.004-1.005z" fill="#2684FF" />
        <path d="M6.057 6.057H17.63a5.218 5.218 0 0 1-5.232 5.215H10.27V13.33a5.218 5.218 0 0 1-5.218 5.218V7.062a1.005 1.005 0 0 1 1.005-1.005z" fill="#2684FF" opacity="0.7" />
        <path d="M0.543.543H12.115a5.218 5.218 0 0 1-5.218 5.218H4.769V7.819A5.218 5.218 0 0 1-.45 13.037V1.548A1.005 1.005 0 0 1 .543.543z" fill="#2684FF" opacity="0.4" />
      </svg>
    ),
    bg: "bg-[#0052CC]/10",
    border: "border-[#0052CC]/30",
    text: "text-[#2684FF]",
  },
};

// ── What-if Scenario Templates ───────────────────────────────────────────────
const TEMPLATES = [
  {
    id: "protect-repos",
    label: "🛡️ Protect Repositories",
    name: "Protect Repositories",
    subtitle: "Keep code access active",
    annotation: "Security Risk ↑ · Disruption ↓",
    annotationColor: "text-orange-400",
    filter: (providers) => providers.filter((p) => p !== "GitHub"),
    isVisible: (providers) => providers.includes("GitHub"),
    transformSteps: null,
  },
  {
    id: "comms-lockdown",
    label: "💬 Comms-Only Lockdown",
    name: "Comms-Only Lockdown",
    subtitle: "Only revoke communication tools",
    annotation: "Security Risk ↓ · Disruption ↓",
    annotationColor: "text-emerald-400",
    filter: (providers) => providers.filter((p) => p === "Slack"),
    isVisible: (providers) => providers.includes("Slack"),
    transformSteps: null,
  },
  {
    id: "zero-delay",
    label: "⚡ Zero-Delay Terminate",
    name: "Zero-Delay Terminate",
    subtitle: "All systems, zero grace period",
    annotation: "Security Risk ↓ · Disruption ↑",
    annotationColor: "text-cyan-400",
    filter: (providers) => providers,
    isVisible: () => true,
    transformSteps: (steps) => steps.map((s) => ({ ...s, estimatedSeconds: 0 })),
  },
  {
    id: "standard-procedure",
    label: "📋 Standard Procedure",
    name: "Standard Procedure",
    subtitle: "Standard multi-system offboarding",
    annotation: "Balanced",
    annotationColor: "text-zinc-400",
    filter: (providers) => providers,
    isVisible: () => true,
    transformSteps: null,
  },
];

// ── Compliance Impact helper ─────────────────────────────────────────────────
function getComplianceImpact(providers) {
  const has = (p) => (providers || []).includes(p);
  if (has("GitHub") && has("Google Workspace")) {
    return { level: "Critical", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", desc: "Code + Email access requires immediate action" };
  }
  if (has("GitHub") || has("Google Workspace")) {
    return { level: "At Risk", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", desc: "High-privilege system requires prompt revocation" };
  }
  return { level: "Compliant", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", desc: "No critical compliance concerns" };
}

// ── Replay timeline event icon ───────────────────────────────────────────────
function TimelineEventIcon({ ev }) {
  const isSuccess = ev.details?.success !== false;
  const isTerminal = ev.eventName === "Simulation Completed" || ev.eventName === "Simulation Failed";
  const isStart = ev.eventName === "Simulation Started";

  if (isStart) {
    return (
      <div className="w-6 h-6 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 12 12" fill="currentColor" className="w-2.5 h-2.5 text-cyan-400"><path d="M3 2l7 4-7 4V2z" /></svg>
      </div>
    );
  }
  if (isTerminal) {
    const ok = ev.eventName === "Simulation Completed";
    return (
      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${ok ? "bg-emerald-500" : "bg-red-500"}`}>
        {ok ? (
          <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth={2.5} className="w-3 h-3"><path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        ) : (
          <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth={2.5} className="w-3 h-3"><path d="M3 3l6 6M9 3l-6 6" strokeLinecap="round" /></svg>
        )}
      </div>
    );
  }
  // Step executed
  return (
    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isSuccess ? "bg-emerald-500/20 border border-emerald-500/50" : "bg-red-500/20 border border-red-500/50"}`}>
      {isSuccess ? (
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3 text-emerald-400"><path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ) : (
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3 text-red-400"><path d="M3 3l6 6M9 3l-6 6" strokeLinecap="round" /></svg>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function SimulationCard({ simulation: initialSimulation }) {
  const [simulation, setSimulation] = useState(initialSimulation);
  const [isExecuting, setIsExecuting] = useState(simulation.status === "Running");
  const [showReplay, setShowReplay] = useState(false);
  const [replayEvents, setReplayEvents] = useState([]);
  const [isLoadingReplay, setIsLoadingReplay] = useState(false);

  // Scenarios state
  const [scenarios, setScenarios] = useState([]);
  const [compareTarget, setCompareTarget] = useState(null);
  const [recentTemplate, setRecentTemplate] = useState(null);

  // Risk factors panel
  const [showFactors, setShowFactors] = useState(false);

  // Replay detail expansion
  const [expandedEvent, setExpandedEvent] = useState(null);

  // ── Quick-create handler ─────────────────────────────────────────────────
  const handleQuickCreate = (template) => {
    const providers = simulation.providers || [];
    const includedProviders = template.filter(providers);

    const mockEvent = {
      employeeName: simulation.employeeName,
      employeeEmail: simulation.employeeEmail,
      githubUsername: simulation.githubUsername,
      id: simulation.simulationId,
    };

    const includedTasks = includedProviders.map((tool) => ({ tool }));
    const newSimData = buildSimulation(mockEvent, includedTasks);

    if (template.transformSteps) {
      newSimData.steps = template.transformSteps(newSimData.steps);
      newSimData.estimatedSeconds = newSimData.steps.reduce(
        (sum, s) => sum + s.estimatedSeconds, 0
      );
    }

    const newRisk = calculateRisk(newSimData);
    const scenario = {
      scenarioId: crypto.randomUUID(),
      parentSimulationId: simulation.simulationId,
      scenarioName: template.name,
      annotation: template.annotation,
      annotationColor: template.annotationColor,
      version: scenarios.length + 2,
      ...newSimData,
      risk: newRisk,
      status: "Draft",
      createdAt: new Date().toISOString(),
    };

    setScenarios((prev) => [...prev, scenario]);
    setRecentTemplate(template.id);
    setTimeout(() => setRecentTemplate(null), 1800);
  };

  // ── Computed values ──────────────────────────────────────────────────────
  const executedStepsCount = replayEvents.filter((ev) => ev.eventName === "Step Executed").length;
  const totalSteps = simulation.steps?.length || 1;
  const progressPercent = Math.min(100, Math.round((executedStepsCount / totalSteps) * 100));
  const compliance = getComplianceImpact(simulation.providers);

  // ── Polling effect ───────────────────────────────────────────────────────
  useEffect(() => {
    let interval;
    if (isExecuting) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/simulations/replay?id=${simulation.simulationId}`);
          const data = await res.json();
          if (data.success) {
            setReplayEvents(data.timeline);
            const terminalEvent = data.timeline.find(
              (ev) => ev.eventName === "Simulation Completed" || ev.eventName === "Simulation Failed"
            );
            if (terminalEvent) {
              setIsExecuting(false);
              const finalStatus = terminalEvent.eventName === "Simulation Completed" ? "Completed" : "Failed";
              setSimulation((prev) => ({ ...prev, status: finalStatus }));
            }
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isExecuting, simulation.simulationId]);

  // ── Execute handler ──────────────────────────────────────────────────────
  const handleExecute = async () => {
    setIsExecuting(true);
    setSimulation((prev) => ({ ...prev, status: "Running" }));
    setShowReplay(true);
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

  // ── Replay handler ───────────────────────────────────────────────────────
  const handleReplay = async () => {
    if (showReplay) { setShowReplay(false); return; }
    setShowReplay(true);
    setIsLoadingReplay(true);
    try {
      const res = await fetch(`/api/simulations/replay?id=${simulation.simulationId}`);
      const data = await res.json();
      if (data.success) setReplayEvents(data.timeline);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingReplay(false);
    }
  };

  // ── Compute the replay start time for relative timestamps ────────────────
  const replayStartTime = replayEvents.length > 0 ? new Date(replayEvents[0].createdAt).getTime() : 0;

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className={`rounded-2xl border ${isExecuting ? "border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]" : "border-zinc-800"} bg-[#111113] p-6 transition-all duration-500`}>

      {/* ── Execution progress bar ────────────────────────────────────────── */}
      {isExecuting && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-cyan-400 mb-2 font-medium">
            <span>Executing Plan...</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      )}

      {/* ── Header: Name + Risk Badge ─────────────────────────────────────── */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold text-white">{simulation.employeeName}</h2>
          <p className="text-zinc-400 mt-1">{simulation.employeeEmail}</p>
        </div>
        <RiskBadge risk={simulation.risk} />
      </div>

      {/* ── 4 Premium Summary Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4 mt-7">
        {/* 1. Risk Score */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-3">Risk Score</p>
          <div className="flex items-end gap-2">
            <span className={`text-3xl font-bold tabular-nums ${
              simulation.risk.severity === "Critical" ? "text-red-400" :
              simulation.risk.severity === "High" ? "text-orange-400" :
              simulation.risk.severity === "Medium" ? "text-yellow-400" :
              "text-emerald-400"
            }`}>
              {simulation.risk.score}
            </span>
            <span className="text-zinc-600 text-sm mb-1">/100</span>
          </div>
          {simulation.risk.factors && simulation.risk.factors.length > 0 && (
            <button
              onClick={() => setShowFactors(!showFactors)}
              className="text-xs text-zinc-500 hover:text-white mt-2 transition flex items-center gap-1"
            >
              <span>{showFactors ? "▾" : "▸"}</span>
              Why is this {simulation.risk.severity}?
            </button>
          )}
        </div>

        {/* 2. Systems Affected */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-3">Systems Affected</p>
          <div className="flex flex-wrap gap-2">
            {(simulation.providers || []).map((provider) => {
              const meta = PROVIDER_ICONS[provider];
              if (!meta) {
                return (
                  <span key={provider} className="px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-xs text-zinc-300">
                    {provider}
                  </span>
                );
              }
              return (
                <div
                  key={provider}
                  className={`w-8 h-8 rounded-lg ${meta.bg} border ${meta.border} flex items-center justify-center ${meta.text}`}
                  title={provider}
                >
                  {meta.icon}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-zinc-600 mt-2">{(simulation.providers || []).length} system{(simulation.providers || []).length !== 1 ? "s" : ""}</p>
        </div>

        {/* 3. Estimated Duration */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-3">Estimated Duration</p>
          <div className="flex items-end gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-zinc-500">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" strokeLinecap="round" />
            </svg>
            <span className="text-2xl font-bold text-white tabular-nums">{simulation.estimatedSeconds}s</span>
          </div>
          <p className="text-xs text-zinc-600 mt-2">{(simulation.steps || []).length} sequential action{(simulation.steps || []).length !== 1 ? "s" : ""}</p>
        </div>

        {/* 4. Compliance Impact */}
        <div className={`bg-zinc-900/70 border rounded-xl p-4 ${compliance.border}`}>
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-3">Compliance Impact</p>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              compliance.level === "Compliant" ? "bg-emerald-400" :
              compliance.level === "At Risk" ? "bg-orange-400" : "bg-red-400"
            }`} />
            <span className={`text-lg font-semibold ${compliance.color}`}>{compliance.level}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2">{compliance.desc}</p>
        </div>
      </div>

      {/* ── Risk Factors Panel (collapsible) ──────────────────────────────── */}
      {showFactors && simulation.risk.factors && (
        <div className="mt-4 bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 space-y-3 animate-slide-in-card">
          <p className="text-xs uppercase tracking-widest text-zinc-600 font-medium">Risk Factor Breakdown</p>
          {simulation.risk.factors.map((factor) => (
            <div key={factor.id} className="flex items-start gap-3 bg-zinc-900/50 border border-zinc-800/60 rounded-lg p-3">
              <span className="text-lg shrink-0 mt-0.5">{factor.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-white">{factor.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    factor.severity === "High" ? "bg-orange-500/15 text-orange-400" :
                    factor.severity === "Medium" ? "bg-yellow-500/15 text-yellow-400" :
                    "bg-zinc-800 text-zinc-400"
                  }`}>
                    {factor.severity}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">{factor.desc}</p>
              </div>
              <span className="text-xs font-mono text-zinc-600 shrink-0">+{factor.points}</span>
            </div>
          ))}
        </div>
      )}

      <div className="my-7 border-b border-zinc-800" />

      {/* ── Step Timeline (display) ───────────────────────────────────────── */}
      <StepTimeline steps={simulation.steps || []} />

      {/* ── Action Buttons ────────────────────────────────────────────────── */}
      <div className="flex gap-4 mt-8">
        {simulation.status !== "Completed" && (
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
          >
            {isExecuting ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              "Execute"
            )}
          </button>
        )}

        <button
          onClick={handleReplay}
          className="border border-zinc-700 px-6 py-3 rounded-xl hover:bg-zinc-900 transition text-zinc-300 hover:text-white"
        >
          {showReplay ? "Hide Timeline" : "View Timeline"}
        </button>
      </div>

      {/* ── Rich Replay Timeline ──────────────────────────────────────────── */}
      {showReplay && (
        <div className="mt-8 p-5 bg-zinc-950/70 rounded-xl border border-zinc-800/80">
          <h3 className="text-lg font-medium text-white mb-5">Execution Timeline</h3>
          {isLoadingReplay ? (
            <p className="text-zinc-400 flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
              Loading timeline…
            </p>
          ) : replayEvents.length === 0 ? (
            <p className="text-zinc-500 italic">Timeline is empty.</p>
          ) : (
            <div className="relative">
              {/* Vertical guide rail */}
              <div className="absolute top-0 left-[11px] w-px h-full bg-gradient-to-b from-zinc-700 via-zinc-800 to-transparent" />

              <div className="space-y-0">
                {replayEvents.map((ev, i) => {
                  const isSuccess = ev.details?.success !== false;
                  const absTime = new Date(ev.createdAt).toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
                  const relMs = new Date(ev.createdAt).getTime() - replayStartTime;
                  const relSec = (relMs / 1000).toFixed(1);
                  const isExpanded = expandedEvent === i;
                  const hasDetails = ev.details && Object.keys(ev.details).length > 0;
                  const providerName = ev.details?.step?.provider;
                  const providerMeta = providerName ? PROVIDER_ICONS[providerName] : null;

                  return (
                    <div key={i} className="relative pl-10 pb-4 group">
                      {/* Icon */}
                      <div className="absolute left-0 top-0">
                        <TimelineEventIcon ev={ev} />
                      </div>

                      {/* Content card */}
                      <div
                        className={`rounded-lg border p-3 transition-all duration-200 ${
                          hasDetails ? "cursor-pointer hover:border-zinc-600" : ""
                        } ${isSuccess ? "border-zinc-800/60 bg-zinc-900/30" : "border-red-900/30 bg-red-950/10"}`}
                        onClick={() => hasDetails && setExpandedEvent(isExpanded ? null : i)}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            {/* Provider icon chip (inline) */}
                            {providerMeta && (
                              <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${providerMeta.bg} ${providerMeta.text}`}>
                                {providerMeta.icon}
                              </div>
                            )}
                            <span className={`text-sm font-medium truncate ${isSuccess ? "text-zinc-200" : "text-red-400"}`}>
                              {ev.eventName}
                            </span>
                            {hasDetails && (
                              <span className="text-zinc-700 text-xs">{isExpanded ? "▾" : "▸"}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs text-zinc-500 font-mono tabular-nums">{absTime}</span>
                            <span className="text-xs text-zinc-700 font-mono tabular-nums">+{relSec}s</span>
                          </div>
                        </div>
                        {ev.action && (
                          <p className="text-xs text-zinc-500 mt-1 pl-7">{ev.action}</p>
                        )}

                        {/* Expanded details */}
                        {isExpanded && hasDetails && (
                          <div className="mt-3 pt-3 border-t border-zinc-800/60">
                            <pre className="text-xs text-zinc-500 font-mono overflow-x-auto whitespace-pre-wrap bg-black/30 rounded-lg p-3 max-h-48">
                              {JSON.stringify(ev.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Active step indicator */}
                {isExecuting && (
                  <div className="relative pl-10 pb-2">
                    <div className="absolute left-0 top-0">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-cyan-400/70 italic py-1">Processing next step…</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Identity Branching · What-if Scenarios ────────────────────────── */}
      {!isExecuting && (simulation.providers || []).length > 0 && (
        <div className="mt-6 pt-5 border-t border-zinc-800/60">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
              Identity Branching · What-if Scenarios
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              Explore different offboarding paths and compare their risk impact.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.filter((t) => t.isVisible(simulation.providers || [])).map((template) => {
              const isJustAdded = recentTemplate === template.id;
              return (
                <button
                  key={template.id}
                  onClick={() => handleQuickCreate(template)}
                  className={`text-left px-4 py-3 rounded-xl border transition-all duration-300 ${
                    isJustAdded
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-900"
                  }`}
                >
                  {isJustAdded ? (
                    <span className="text-sm font-medium text-cyan-300">✓ Branch created</span>
                  ) : (
                    <>
                      <span className="text-sm font-medium text-white">{template.label}</span>
                      <span className="block text-xs text-zinc-500 mt-0.5">{template.subtitle}</span>
                      <span className={`block text-xs mt-1.5 font-medium ${template.annotationColor}`}>
                        {template.annotation}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Scenario Tree ─────────────────────────────────────────────────── */}
      <ScenarioTree
        parentSimulation={simulation}
        scenarios={scenarios}
        onSelectToCompare={(scen) => setCompareTarget(scen)}
      />

      {/* ── Comparison View Modal ─────────────────────────────────────────── */}
      {compareTarget && (
        <ComparisonView
          baseSimulation={simulation}
          compareSimulation={compareTarget}
          onClose={() => setCompareTarget(null)}
        />
      )}
    </div>
  );
}