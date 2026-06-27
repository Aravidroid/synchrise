"use client";

import { useState, useEffect } from "react";

// ── Provider metadata (icons + colors + log narratives) ───────────────────────

const PROVIDERS = {
  Slack: {
    label: "Slack",
    color: "text-[#E01E5A]",
    bg: "bg-[#4A154B]/30",
    border: "border-[#E01E5A]/40",
    glow: "shadow-[0_0_20px_rgba(224,30,90,0.2)]",
    dot: "bg-[#E01E5A]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
      </svg>
    ),
    logs: [
      "Connecting to Slack workspace API…",
      "Authenticating with OAuth token…",
      "Fetching user profile for deactivation…",
      "Removing user from all public channels…",
      "Removing user from all private channels…",
      "Deactivating Slack account…",
      "Revoking active sessions & tokens…",
    ],
  },
  GitHub: {
    label: "GitHub",
    color: "text-white",
    bg: "bg-zinc-700/40",
    border: "border-zinc-500/50",
    glow: "shadow-[0_0_20px_rgba(255,255,255,0.1)]",
    dot: "bg-white",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    logs: [
      "Connecting to GitHub API…",
      "Authenticating with organization token…",
      "Scanning organization member list…",
      "Locating user across repositories…",
      "Removing repository collaborator access…",
      "Revoking organization membership…",
      "Confirming user removal…",
    ],
  },
  "Google Workspace": {
    label: "Google Workspace",
    color: "text-[#4285F4]",
    bg: "bg-[#4285F4]/10",
    border: "border-[#4285F4]/40",
    glow: "shadow-[0_0_20px_rgba(66,133,244,0.2)]",
    dot: "bg-[#4285F4]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
    logs: [
      "Connecting to Google Admin SDK…",
      "Authenticating service account…",
      "Fetching user account in directory…",
      "Suspending Google account access…",
      "Revoking Gmail & Drive permissions…",
      "Transferring Drive ownership to manager…",
      "Removing from Google Groups…",
      "Disabling account login…",
    ],
  },
  Notion: {
    label: "Notion",
    color: "text-zinc-200",
    bg: "bg-zinc-800/60",
    border: "border-zinc-600/50",
    glow: "shadow-[0_0_20px_rgba(255,255,255,0.06)]",
    dot: "bg-zinc-300",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
      </svg>
    ),
    logs: [
      "Connecting to Notion API…",
      "Authenticating integration token…",
      "Fetching workspace member list…",
      "Locating user in workspace…",
      "Revoking page & database access…",
      "Removing from team spaces…",
      "Deactivating workspace membership…",
    ],
  },
  Jira: {
    label: "Jira",
    color: "text-[#0052CC]",
    bg: "bg-[#0052CC]/15",
    border: "border-[#0052CC]/40",
    glow: "shadow-[0_0_20px_rgba(0,82,204,0.2)]",
    dot: "bg-[#0052CC]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path
          d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.004-1.005z"
          fill="#2684FF"
        />
        <path
          d="M6.057 6.057H17.63a5.218 5.218 0 0 1-5.232 5.215H10.27V13.33a5.218 5.218 0 0 1-5.218 5.218V7.062a1.005 1.005 0 0 1 1.005-1.005z"
          fill="url(#jiraGrad1)"
        />
        <path
          d="M0.543.543H12.115a5.218 5.218 0 0 1-5.218 5.218H4.769V7.819A5.218 5.218 0 0 1-.45 13.037V1.548A1.005 1.005 0 0 1 .543.543z"
          fill="url(#jiraGrad2)"
        />
        <defs>
          <linearGradient id="jiraGrad1" x1="17.63" y1="9.653" x2="10.9" y2="14.39" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0052CC" />
            <stop offset="100%" stopColor="#2684FF" />
          </linearGradient>
          <linearGradient id="jiraGrad2" x1="12.115" y1="4.15" x2="5.384" y2="8.89" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0052CC" />
            <stop offset="100%" stopColor="#2684FF" />
          </linearGradient>
        </defs>
      </svg>
    ),
    logs: [
      "Connecting to Jira Cloud API…",
      "Authenticating with API token…",
      "Fetching user account details…",
      "Unassigning open issues…",
      "Removing project role memberships…",
      "Revoking board & backlog access…",
      "Deactivating Jira account…",
    ],
  },
};

const LOG_INTERVAL_MS  = 350;
const STEP_DURATION_MS = 2200;

// ── Sub-component: a single provider card ────────────────────────────────────

function ProviderCard({ tool, state, logs, index }) {
  const meta = PROVIDERS[tool] || {
    label: tool, color: "text-zinc-300", bg: "bg-zinc-800/60",
    border: "border-zinc-700", glow: "", dot: "bg-zinc-400",
    icon: <span className="text-xs font-bold">{tool[0]}</span>,
    logs: ["Connecting…", "Authenticating…", "Revoking access…"],
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-500 overflow-hidden animate-slide-in-card
        ${state === "running"  ? `${meta.border} ${meta.glow} bg-zinc-950` : ""}
        ${state === "success"  ? "border-emerald-500/30 bg-[#0a1a10]" : ""}
        ${state === "pending"  ? "border-zinc-800/60 bg-zinc-950/50 opacity-40" : ""}
      `}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Card header */}
      <div className="flex items-center gap-4 p-5">
        {/* Status dot */}
        <div className="shrink-0">
          {state === "pending" && (
            <div className="w-5 h-5 rounded-full border-2 border-zinc-700" />
          )}
          {state === "running" && (
            <div className={`w-5 h-5 rounded-full border-2 border-t-transparent animate-spin ${meta.border} ${meta.dot.replace("bg-", "border-")}`} />
          )}
          {state === "success" && (
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center animate-node-pop">
              <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth={2.5} className="w-3 h-3">
                <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>

        {/* Provider icon chip */}
        <div className={`w-10 h-10 rounded-xl ${meta.bg} border ${meta.border} flex items-center justify-center ${meta.color} shrink-0`}>
          {meta.icon}
        </div>

        {/* Provider name + action */}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold ${
            state === "running" ? meta.color :
            state === "success" ? "text-white" : "text-zinc-500"
          }`}>
            {meta.label}
          </p>
          <p className="text-xs text-zinc-600 mt-0.5">
            {state === "pending" ? "Waiting…"
            : state === "running" ? "Revoking access…"
            : "✓ Access revoked"}
          </p>
        </div>

        {/* Status badge */}
        {state === "running" && (
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${meta.border} ${meta.bg} ${meta.color}`}>
            Running
          </span>
        )}
        {state === "success" && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            Done
          </span>
        )}
      </div>

      {/* Log stream */}
      {(state === "running" || state === "success") && logs.length > 0 && (
        <div className="border-t border-zinc-800/60 px-5 py-3 space-y-1.5 bg-black/30 font-mono">
          {logs.map((line, i) => (
            <div key={i} className="flex items-start gap-2 animate-slide-in-card" style={{ animationDelay: `${i * 30}ms` }}>
              <span className="text-zinc-700 text-xs mt-px select-none">›</span>
              <span className={`text-xs leading-relaxed ${
                i === logs.length - 1 && state === "running"
                  ? meta.color
                  : "text-zinc-500"
              }`}>
                {line}
              </span>
              {i === logs.length - 1 && state === "running" && (
                <span className={`inline-block w-1.5 h-3.5 ${meta.dot} animate-pulse ml-0.5 mt-px`} />
              )}
            </div>
          ))}
          {state === "success" && (
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-zinc-700 text-xs select-none">›</span>
              <span className="text-xs text-emerald-400">✓ Completed successfully. Access has been revoked.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function OffboardingSimulator({ employeeName, tools, onDone }) {
  const [stepStates, setStepStates] = useState(tools.map(() => "pending"));
  const [stepLogs,   setStepLogs]   = useState(tools.map(() => []));
  const [started, setStarted]       = useState(false);
  const [isDone, setIsDone]         = useState(false);
  const successCount = stepStates.filter((s) => s === "success").length;
  const pct = tools.length > 0 ? Math.round((successCount / tools.length) * 100) : 0;

  // Auto-start immediately on mount
  useEffect(() => {
    if (started) return;
    setStarted(true);
    runAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runAll() {
    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      const logLines = (PROVIDERS[tool] || PROVIDERS["GitHub"]).logs;

      setStepStates((prev) => prev.map((s, idx) => idx === i ? "running" : s));

      let logIndex = 0;
      await new Promise((resolve) => {
        const logTimer = setInterval(() => {
          if (logIndex < logLines.length) {
            const snap = logIndex;
            setStepLogs((prev) =>
              prev.map((l, idx) => idx === i ? logLines.slice(0, snap + 1) : l)
            );
            logIndex++;
          }
        }, LOG_INTERVAL_MS);

        setTimeout(() => {
          clearInterval(logTimer);
          setStepLogs((prev) =>
            prev.map((l, idx) => idx === i ? logLines : l)
          );
          resolve();
        }, STEP_DURATION_MS);
      });

      setStepStates((prev) => prev.map((s, idx) => idx === i ? "success" : s));
      await new Promise((r) => setTimeout(r, 250));
    }
    setIsDone(true);
  }

  return (
    /* Full-screen backdrop */
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Modal panel */}
      <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border border-zinc-800 bg-[#0d0d10] shadow-2xl overflow-hidden animate-slide-in-card">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              {!isDone ? (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                </span>
              ) : (
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              )}
              <span className={`text-sm font-semibold ${isDone ? "text-emerald-400" : "text-cyan-400"}`}>
                {isDone ? "Offboarding Complete" : "Running Offboarding…"}
              </span>
            </div>
            <span className="text-xs text-zinc-500 tabular-nums font-mono">
              {successCount}/{tools.length} steps
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mt-2">
            {employeeName}
          </h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            {isDone
              ? `All ${tools.length} system${tools.length > 1 ? "s" : ""} have been offboarded.`
              : `Revoking access across ${tools.length} system${tools.length > 1 ? "s" : ""}…`}
          </p>

          {/* Progress bar */}
          <div className="mt-4 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ease-out rounded-full ${isDone ? "bg-emerald-400" : "bg-cyan-400"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Scrollable step list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {tools.map((tool, i) => (
            <ProviderCard
              key={tool}
              tool={tool}
              state={stepStates[i]}
              logs={stepLogs[i]}
              index={i}
            />
          ))}
        </div>

        {/* Footer */}
        {isDone && (
          <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path d="M3 8l4 4 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All systems revoked successfully
            </div>
            <button
              onClick={onDone}
              className="px-5 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
