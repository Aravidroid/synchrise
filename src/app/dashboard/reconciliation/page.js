"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

const GITHUB_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export default function ReconciliationPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  const handleRunReconciliation = async () => {
    setIsScanning(true);
    setError(null);
    try {
      const res = await fetch("/api/reconciliation/github", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setScanResult(data);
      } else {
        setError(data.error || "Failed to run reconciliation");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex bg-black text-white">
      <Sidebar />

      <main className="flex-1 min-h-screen bg-[radial-gradient(circle_at_top,#1a1a1a_0%,#000_50%)] p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Access Reconciliation
              </h1>
              <p className="text-zinc-400 mt-2 max-w-xl leading-relaxed">
                Verify that offboarded users have actually been removed from downstream providers by comparing the expected state to the live API state.
              </p>
            </div>
            
            <button
              onClick={handleRunReconciliation}
              disabled={isScanning}
              className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px]"
            >
              {isScanning ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Running...
                </div>
              ) : (
                "Run Reconciliation"
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}

          {scanResult && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Live Members</p>
                <span className="text-3xl font-bold text-white tabular-nums">{scanResult.membersCount}</span>
              </div>
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Findings Checked</p>
                <span className="text-3xl font-bold text-white tabular-nums">{scanResult.findings.length}</span>
              </div>
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Organization</p>
                <span className="text-xl font-bold text-white">{scanResult.organization}</span>
              </div>
            </div>
          )}

          <div className="bg-[#111113] border border-zinc-800 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/50 border-b border-zinc-800 text-xs text-zinc-400 uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Provider</th>
                    <th className="px-6 py-4 font-medium">Username</th>
                    <th className="px-6 py-4 font-medium">Rule</th>
                    <th className="px-6 py-4 font-medium">Expected State</th>
                    <th className="px-6 py-4 font-medium">Actual State</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {!scanResult ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 italic">
                        Click "Run Reconciliation" to fetch live data.
                      </td>
                    </tr>
                  ) : scanResult.findings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-emerald-400 font-medium">
                        ✓ All access records are reconciled perfectly.
                      </td>
                    </tr>
                  ) : (
                    scanResult.findings.map((finding) => (
                      <tr key={finding.id} className="hover:bg-zinc-900/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center shrink-0">
                              {GITHUB_ICON}
                            </div>
                            <span className="font-medium text-zinc-200">{finding.provider}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-zinc-300 font-mono text-sm">{finding.username}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-zinc-400 text-sm">{finding.type}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm px-2.5 py-1 rounded-full font-medium bg-zinc-800/60 text-zinc-300`}>
                            {finding.expectedState}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm px-2.5 py-1 rounded-full font-medium ${
                            finding.actualState === "Active" 
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                          }`}>
                            {finding.actualState}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {finding.verificationStatus === "Verified" ? (
                            <div className="flex items-center gap-2 text-emerald-400">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <span className="text-sm font-semibold">Verified</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-red-400">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                              <span className="text-sm font-semibold">Mismatch</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
