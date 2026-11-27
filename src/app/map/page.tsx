"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useApp } from "@/context/AppContext";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[540px] items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-xs text-slate-500">
      Loading OpenStreetMap GIS Layer...
    </div>
  ),
});

export default function MarketMapPage() {
  const { state } = useApp();
  const [sector, setSector] = useState("All");
  const [layers, setLayers] = useState({
    projects: true,
    properties: true,
    branches: true,
    opportunities: true,
    hubs: true,
  });

  const filteredBranches = useMemo(() => {
    if (sector === "All") return state.branches;
    return state.branches.filter((b) => b.sector === sector);
  }, [state.branches, sector]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Unified Market GIS Map
          </h1>
          <p className="text-sm text-slate-500">
            View your ProBro Projects &amp; Properties alongside MarketRadar brand branches, commercial hubs, and opportunity zones.
          </p>
        </div>
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700"
        >
          <option value="All">All Market Sectors</option>
          {[
            "Banking & Finance",
            "Retail & QSR",
            "Healthcare & Pharma",
            "Tech & Coworking",
            "Real Estate & Developers",
          ].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Layer Controls & Legend */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 text-xs shadow-xs">
        {[
          { key: "projects", label: `ProBro Projects (${state.projects.length})`, dot: "bg-indigo-600" },
          { key: "properties", label: `ProBro Units (${state.properties.length})`, dot: "bg-emerald-500" },
          { key: "branches", label: `Market Branches (${filteredBranches.length})`, dot: "bg-rose-500" },
          { key: "hubs", label: `Commercial Hubs (${state.commercialHubs.length})`, dot: "bg-slate-700" },
          { key: "opportunities", label: "Opportunity Corridors", dot: "bg-amber-500" },
        ].map((item) => {
          const k = item.key as keyof typeof layers;
          return (
            <label
              key={item.key}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={layers[k]}
                onChange={() => setLayers((prev) => ({ ...prev, [k]: !prev[k] }))}
              />
              <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
              <span className="font-medium text-slate-700">{item.label}</span>
            </label>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xs">
        <LeafletMap
          projects={state.projects}
          properties={state.properties}
          branches={filteredBranches}
          neighborhoods={state.neighborhoods}
          hubs={state.commercialHubs}
          layers={layers}
        />
      </div>
    </div>
  );
}
