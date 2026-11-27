"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Building2,
  Home,
  Handshake,
  Map as MapIcon,
  Radar,
  Target,
  Activity,
  Building,
  Newspaper,
  Search,
  Bell,
  Star,
  FileBarChart,
  Settings,
  Menu,
  X,
  RotateCcw,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface NavGroup {
  label: string;
  items: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/search", label: "Smart Search", icon: Search },
      { href: "/alerts", label: "Alerts Center", icon: Bell },
    ],
  },
  {
    label: "Real Estate CRM",
    items: [
      { href: "/leads", label: "Leads", icon: Users },
      { href: "/pipeline", label: "Opportunities", icon: TrendingUp },
      { href: "/projects", label: "Projects", icon: Building2 },
      { href: "/properties", label: "Properties", icon: Home },
      { href: "/crm", label: "Customers & Deals", icon: Handshake },
    ],
  },
  {
    label: "Market Intelligence",
    items: [
      { href: "/map", label: "Market GIS Map", icon: MapIcon },
      { href: "/companies", label: "Brands & SWOT", icon: Building },
      { href: "/competitors", label: "Competitor Radar", icon: Radar },
      { href: "/opportunities", label: "Opportunity Finder", icon: Target },
      { href: "/expansion-tracker", label: "Expansion & Leasing", icon: Activity },
      { href: "/news", label: "News & Discovery", icon: Newspaper },
      { href: "/watchlists", label: "Watchlists", icon: Star },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/reports", label: "Reports & Exports", icon: FileBarChart },
      { href: "/settings", label: "Settings & Masters", icon: Settings },
    ],
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, resetDemoData } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const unreadCount = state.alerts.filter((a) => !a.read).length;

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-slate-950 text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 ring-1 ring-teal-500/40 shadow-sm transition-transform duration-200 group-hover:scale-105">
            <svg viewBox="0 0 64 64" fill="none" className="h-6 w-6">
              <path d="M16 46V24L28 16V46" stroke="#14B8A6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M28 28L40 21V46" stroke="#F8FAFC" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M34 36H39L42 30L46 41L49 36H53" stroke="#2DD4BF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              PropPulse AI
            </div>
            <div className="text-[11px] font-medium text-teal-400/90">
              Real Estate CRM &amp; GIS
            </div>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="rounded-md p-1 text-slate-400 hover:bg-slate-800 lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                      active
                        ? "bg-teal-600/90 text-white shadow-xs"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </span>
                    {item.href === "/alerts" && unreadCount > 0 && (
                      <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-3">
        <button
          onClick={() => {
            if (confirm("Reset all demo data to initial defaults?")) {
              resetDemoData();
            }
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Demo Data
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-full">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden text-xs font-medium text-slate-500 sm:block">
              Ahmedabad & Gujarat Corridor • Unified Real Estate CRM + Market Intelligence
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 sm:flex"
            >
              <Search className="h-3.5 w-3.5" />
              Ask anything...
            </Link>
            <Link
              href="/alerts"
              className="relative rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Alerts"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1.5 pr-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">
                AD
              </div>
              <span className="text-xs font-medium text-slate-700">Admin</span>
            </div>
          </div>
        </header>

        <main className="animate-enter flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
