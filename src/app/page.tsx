"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  Building2,
  Home,
  Radar,
  Target,
  Activity,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/format";
import { BusinessType } from "@/types";

const BUSINESS_TYPES: BusinessType[] = [
  "Residential",
  "Commercial",
  "Industrial",
  "Land/Plot",
];

export default function DashboardPage() {
  const { state } = useApp();
  const [selectedEmployee, setSelectedEmployee] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredLeads = useMemo(() => {
    return state.leads.filter((l) => {
      if (selectedEmployee !== "All" && l.assignTo !== selectedEmployee) return false;
      if (dateFrom && l.date < dateFrom) return false;
      if (dateTo && l.date > dateTo) return false;
      return true;
    });
  }, [state.leads, selectedEmployee, dateFrom, dateTo]);

  const filteredOpps = useMemo(() => {
    return state.opportunities.filter((o) => {
      if (selectedEmployee !== "All" && o.assignTo !== selectedEmployee) return false;
      if (dateFrom && o.qualifyDate < dateFrom) return false;
      if (dateTo && o.qualifyDate > dateTo) return false;
      return true;
    });
  }, [state.opportunities, selectedEmployee, dateFrom, dateTo]);

  const wonOpps = filteredOpps.filter((o) => o.status === "Won");
  const lostOpps = filteredOpps.filter((o) => o.status === "Lost");
  const openOpps = filteredOpps.filter((o) => o.status === "Open");
  const pipelineValue = openOpps.reduce((s, o) => s + o.estimatedValue, 0);

  const clearFilters = () => {
    setSelectedEmployee("All");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="space-y-6">
      {/* Welcome & ProBro Filter Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Welcome back, Admin
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            PropPulse AI — Real Estate CRM &amp; Market Intelligence Overview
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none"
            aria-label="Select Employee"
          >
            <option value="All">All Employees</option>
            {state.employees.map((emp) => (
              <option key={emp.id} value={emp.name}>
                {emp.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none"
            aria-label="From Date"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none"
            aria-label="To Date"
          />

          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear Filter
          </button>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/leads"
          className="card-interactive group rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-teal-400"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Leads
            </span>
            <span className="rounded-lg bg-teal-50 p-1.5 text-teal-700">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="tabular-nums text-2xl font-bold text-slate-900 whitespace-nowrap">
              {filteredLeads.length}
            </span>
            <span className="text-xs font-semibold text-teal-700 group-hover:underline whitespace-nowrap">
              View Leads →
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {filteredLeads.filter((l) => l.priority === "High").length} high-priority
          </p>
        </Link>

        <Link
          href="/pipeline"
          className="card-interactive group rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-emerald-400"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Open Pipeline
            </span>
            <span className="rounded-lg bg-emerald-50 p-1.5 text-emerald-700">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="tabular-nums text-2xl font-bold text-slate-900 whitespace-nowrap">
              {formatINR(pipelineValue)}
            </span>
            <span className="text-xs font-semibold text-emerald-700 group-hover:underline whitespace-nowrap">
              {openOpps.length} open →
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Won: {wonOpps.length} • Lost: {lostOpps.length}
          </p>
        </Link>

        <Link
          href="/properties"
          className="card-interactive group rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-amber-400"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Projects &amp; Inventory
            </span>
            <span className="rounded-lg bg-amber-50 p-1.5 text-amber-700">
              <Building2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="tabular-nums text-2xl font-bold text-slate-900 whitespace-nowrap">
              {state.projects.length} / {state.properties.length}
            </span>
            <span className="text-xs font-semibold text-amber-700 group-hover:underline whitespace-nowrap">
              Inventory →
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {state.properties.filter((p) => p.status === "Active").length} active units
          </p>
        </Link>

        <Link
          href="/expansion-tracker"
          className="card-interactive group rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-rose-400"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Market Signals
            </span>
            <span className="rounded-lg bg-rose-50 p-1.5 text-rose-700">
              <Radar className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="tabular-nums text-2xl font-bold text-slate-900 whitespace-nowrap">
              {state.signals.length}
            </span>
            <span className="text-xs font-semibold text-rose-700 group-hover:underline whitespace-nowrap">
              {state.companies.length} brands →
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {state.branches.length} tracked branches on GIS map
          </p>
        </Link>
      </div>

      {/* ProBro Summaries: Lead & Opportunity by Category + Win/Loss */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Lead Summary by Classification
            </h2>
            <Home className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-4 space-y-3">
            {BUSINESS_TYPES.map((type) => {
              const count = filteredLeads.filter((l) => l.businessType === type).length;
              const pct = filteredLeads.length
                ? Math.round((count / filteredLeads.length) * 100)
                : 0;
              return (
                <div key={type}>
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>{type}</span>
                    <span>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Opportunity &amp; Win/Loss Summary
            </h2>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {BUSINESS_TYPES.map((type) => {
              const count = filteredOpps.filter((o) => o.businessType === type).length;
              return (
                <div
                  key={type}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="text-xs text-slate-500">{type}</div>
                  <div className="mt-1 text-lg font-bold text-slate-900">{count}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-900 px-4 py-3 text-xs text-white">
            <span>Win Rate</span>
            <span className="font-bold">
              {wonOpps.length + lostOpps.length > 0
                ? `${Math.round((wonOpps.length / (wonOpps.length + lostOpps.length)) * 100)}%`
                : "N/A"}{" "}
              ({wonOpps.length}W / {lostOpps.length}L)
            </span>
          </div>
        </div>

        {/* MarketRadar Top Opportunity Neighborhoods */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Top Opportunity Corridors
            </h2>
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline"
            >
              Scorecard <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-4 space-y-2.5">
            {state.neighborhoods.slice(0, 4).map((nb) => (
              <div
                key={nb.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900">{nb.name}</div>
                  <div className="text-[11px] text-slate-500">
                    Avg Lease: ₹{nb.avgLeaseRateSqFt}/sq.ft • {nb.competitorCount} rivals
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                  <Target className="h-3 w-3" />
                  {nb.opportunityScore}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Signals & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              MarketRadar Expansion Signals
            </h2>
            <Link
              href="/expansion-tracker"
              className="text-xs font-medium text-indigo-600 hover:underline"
            >
              All Signals →
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {state.signals.map((sig) => (
              <div
                key={sig.id}
                className="rounded-lg border border-slate-100 p-3 hover:bg-slate-50"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-indigo-600">
                    {sig.companyName} • {sig.signalType}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      sig.confidence === "High"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {sig.confidence} Confidence
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-slate-900">{sig.title}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {sig.neighborhood} • {sig.detectedAt}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Recent CRM Follow-Ups &amp; Alerts
            </h2>
            <Link
              href="/alerts"
              className="text-xs font-medium text-indigo-600 hover:underline"
            >
              Alerts Center →
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {state.alerts.slice(0, 4).map((alt) => (
              <div
                key={alt.id}
                className="flex items-start gap-3 rounded-lg border border-slate-100 p-3"
              >
                <Activity className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-900">
                      {alt.title}
                    </span>
                    {!alt.read && (
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-600">{alt.message}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{alt.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
