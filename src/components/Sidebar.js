"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Tasks", href: "/tasks" },
    { name: "Audit Logs", href: "/audit" },
    { name: "Access Reconciliation", href: "/dashboard/reconciliation" },
    { name: "Impact Analysis", href: "/dashboard/simulation" },
    { name: "Integrations", href: "/dashboard/integrations" }
  ];

  return (
    <aside className="w-64 min-h-screen bg-zinc-950 border-r border-zinc-800 p-6">
      <h1 className="text-2xl font-bold mb-8">
        SyncHRise
      </h1>

      <nav className="space-y-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-3 rounded-lg transition ${
              pathname === link.href
                ? "bg-zinc-900 border border-zinc-700"
                : "hover:bg-zinc-900"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}