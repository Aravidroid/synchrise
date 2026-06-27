"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

// ── Icons (Matching the main dashboard & simulation cards) ───────────────────
const BRAND_ICONS = {
  GitHub: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  Slack: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </svg>
  ),
  GoogleWorkspace: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  ),
  Notion: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
    </svg>
  ),
  Jira: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.004-1.005z" fill="#2684FF" />
      <path d="M6.057 6.057H17.63a5.218 5.218 0 0 1-5.232 5.215H10.27V13.33a5.218 5.218 0 0 1-5.218 5.218V7.062a1.005 1.005 0 0 1 1.005-1.005z" fill="#2684FF" opacity="0.7" />
      <path d="M0.543.543H12.115a5.218 5.218 0 0 1-5.218 5.218H4.769V7.819A5.218 5.218 0 0 1-.45 13.037V1.548A1.005 1.005 0 0 1 .543.543z" fill="#2684FF" opacity="0.4" />
    </svg>
  ),
};

const INTEGRATION_LIST = [
  {
    id: "github",
    name: "GitHub",
    desc: "Revoke repository collaboration, organization memberships, and key accesses.",
    iconKey: "GitHub",
    isReal: true,
    accent: "border-t-zinc-400/80",
    color: "text-white",
  },
  {
    id: "slack",
    name: "Slack",
    desc: "Deactivate workspace accounts and automatically remove from all public and private channels.",
    iconKey: "Slack",
    isReal: false,
    accent: "border-t-[#E01E5A]/80",
    color: "text-[#E01E5A]",
  },
  {
    id: "google",
    name: "Google Workspace",
    desc: "Suspend domain accounts, revoke OAuth grants, and transfer Drive document ownership.",
    iconKey: "GoogleWorkspace",
    isReal: false,
    accent: "border-t-[#4285F4]/80",
    color: "text-[#4285F4]",
  },
  {
    id: "notion",
    name: "Notion",
    desc: "Deactivate workspace memberships and remove access to corporate team spaces.",
    iconKey: "Notion",
    isReal: false,
    accent: "border-t-zinc-600/80",
    color: "text-zinc-200",
  },
  {
    id: "jira",
    name: "Jira",
    desc: "Revoke project board access, unassign active issues, and close developer seats.",
    iconKey: "Jira",
    isReal: false,
    accent: "border-t-[#2684FF]/80",
    color: "text-[#2684FF]",
  },
];

export default function IntegrationsPage() {
  const [connections, setConnections] = useState({
    slack: false,
    google: false,
    notion: false,
    jira: false,
  });

  const toggleConnection = (id) => {
    setConnections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex bg-black text-white">
      <Sidebar />

      <main className="flex-1 min-h-screen bg-[radial-gradient(circle_at_top,#1a1a1a_0%,#000_50%)] p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Integrations
            </h1>
            <p className="text-zinc-400 mt-2">
              Configure app connectors for automated provisioning and security de-provisioning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INTEGRATION_LIST.map((app) => {
              const isConnected = app.isReal ? false : connections[app.id];
              return (
                <div
                  key={app.id}
                  className={`border border-zinc-800 border-t-4 ${app.accent} rounded-2xl p-6 bg-zinc-900/40 hover:border-zinc-700 transition duration-300 flex flex-col justify-between`}
                >
                  <div>
                    {/* Header: Icon + Name */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center ${app.color}`}>
                        {BRAND_ICONS[app.iconKey]}
                      </div>
                      <h2 className="font-semibold text-lg text-white">
                        {app.name}
                      </h2>
                    </div>

                    <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                      {app.desc}
                    </p>
                  </div>

                  <div>
                    {/* Action buttons */}
                    {app.isReal ? (
                      <a
                        href="/api/integrations/github/install"
                        className="w-full text-center inline-block bg-white text-black font-semibold px-4 py-2.5 rounded-xl hover:bg-zinc-200 transition"
                      >
                        Connect {app.name}
                      </a>
                    ) : (
                      <button
                        onClick={() => toggleConnection(app.id)}
                        className={`w-full font-semibold px-4 py-2.5 rounded-xl transition duration-300 flex items-center justify-center gap-2 border ${
                          isConnected
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 text-zinc-300"
                        }`}
                      >
                        {isConnected ? (
                          <>
                            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
                              <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Connected
                          </>
                        ) : (
                          `Connect ${app.name}`
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}