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
  PanelLeftClose,
  PanelLeftOpen,
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const unreadCount = state.alerts.filter((a) => !a.read).length;

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex h-full w-64 flex-col bg-white text-slate-700 select-none">
      <div className="flex items-center justify-between border-b border-slate-200/80 px-4 py-3.5">
        <Link href="/" className="group flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-xs transition-transform duration-200 group-hover:scale-105">
            <svg viewBox="0 0 64 64" fill="none" className="h-5 w-5">
              <path
                d="M16 46V24L28 16V46"
                stroke="#FFFFFF"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M28 28L40 21V46"
                stroke="#DBEAFE"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M34 36H39L42 30L46 41L49 36H53"
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-slate-900 whitespace-nowrap">
              PropPulse AI
            </div>
            <div className="truncate text-[11px] font-medium text-blue-600 whitespace-nowrap">
              Real Estate CRM &amp; GIS
            </div>
          </div>
        </Link>
        {isMobile ? (
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="sidebar-scroll flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
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
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150 ${
                      active
                        ? "bg-blue-50 text-blue-700 font-semibold ring-1 ring-blue-200/80"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          active ? "text-blue-600" : "text-slate-400"
                        }`}
                      />
                      <span className="truncate whitespace-nowrap">
                        {item.label}
                      </span>
                    </span>
                    {item.href === "/alerts" && unreadCount > 0 && (
                      <span className="ml-2 shrink-0 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
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

      <div className="border-t border-slate-200/80 p-3">
        <button
          onClick={() => {
            if (confirm("Reset all demo data to initial defaults?")) {
              resetDemoData();
            }
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap"
        >
          <RotateCcw className="h-3.5 w-3.5 shrink-0" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Desktop Sidebar (Slides completely open/closed for full-width view) */}
      <aside
        className={`hidden shrink-0 overflow-hidden border-slate-200 bg-white transition-all duration-200 ease-out lg:block ${
          sidebarOpen ? "w-64 border-r" : "w-0 border-r-0"
        }`}
      >
        <div className="sticky top-0 h-screen w-64">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 shadow-xl">
            <SidebarContent isMobile />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 lg:inline-flex whitespace-nowrap"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {sidebarOpen ? (
                <>
                  <PanelLeftClose className="h-4 w-4 text-slate-500" />
                  <span>Hide Menu</span>
                </>
              ) : (
                <>
                  <PanelLeftOpen className="h-4 w-4 text-blue-600" />
                  <span>Open Menu</span>
                </>
              )}
            </button>
            <div className="hidden truncate text-xs font-medium text-slate-500 sm:block whitespace-nowrap">
              Ahmedabad &amp; Gujarat Corridor • Real Estate CRM + Market Intelligence
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            <Link
              href="/search"
              className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 sm:flex whitespace-nowrap"
            >
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span>Ask anything...</span>
            </Link>
            <Link
              href="/alerts"
              className="relative rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
              aria-label="Alerts"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1.5 pr-3 whitespace-nowrap">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
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
