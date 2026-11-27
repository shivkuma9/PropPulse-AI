"use client";

import React, { useMemo, useState } from "react";
import { Building, CheckCircle2, Search } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { MarketCompany } from "@/types";

export default function CompaniesPage() {
  const { state } = useApp();
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const [selected, setSelected] = useState<MarketCompany>(state.companies[0]);

  const filtered = useMemo(() => {
    return state.companies.filter((c) => {
      if (sector !== "All" && c.sector !== sector) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [state.companies, sector, search]);

  const companyBranches = state.branches.filter((b) => b.companyId === selected?.id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          Company Intelligence, Industry Explorer &amp; AI SWOT
        </h1>
        <p className="text-sm text-slate-500">
          Track corporate brands, sector distribution, branch footprints, and 4-quadrant SWOT analysis.
        </p>
      </div>

      {/* Industry Sector Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          "Banking & Finance",
          "Retail & QSR",
          "Healthcare & Pharma",
          "Tech & Coworking",
        ].map((sec) => {
          const count = state.companies.filter((c) => c.sector === sec).length;
          const branches = state.companies
            .filter((c) => c.sector === sec)
            .reduce((s, c) => s + c.branchCount, 0);
          return (
            <button
              key={sec}
              onClick={() => setSector(sector === sec ? "All" : sec)}
              className={`rounded-xl border p-3.5 text-left transition ${
                sector === sec
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="text-[11px] font-semibold text-slate-500">{sec}</div>
              <div className="mt-1 text-lg font-bold text-slate-900">{count} Brands</div>
              <div className="text-[11px] text-slate-500">{branches} total branches</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Directory List */}
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brand..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-3 text-xs"
            />
          </div>
          <div className="space-y-2">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`w-full rounded-lg border p-3 text-left transition ${
                  selected?.id === c.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-100 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{c.name}</span>
                  <span className="text-[11px] font-semibold text-emerald-600">
                    {c.growthRate}
                  </span>
                </div>
                <div className="mt-0.5 text-[11px] text-slate-500">
                  {c.sector} • {c.branchCount} branches
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Company Profile + SWOT */}
        {selected && (
          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-slate-900">{selected.name}</h2>
                    {selected.verified && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {selected.sector} • HQ: {selected.hq} • {selected.city}
                  </p>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                  {selected.branchCount} Branches ({selected.growthRate})
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-600">{selected.description}</p>

              {/* 4-Quadrant AI SWOT */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3.5">
                  <div className="text-xs font-bold text-emerald-800">Strengths</div>
                  <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs text-emerald-900">
                    {selected.swot.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3.5">
                  <div className="text-xs font-bold text-amber-800">Weaknesses</div>
                  <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs text-amber-900">
                    {selected.swot.weaknesses.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-3.5">
                  <div className="text-xs font-bold text-blue-800">Opportunities</div>
                  <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs text-blue-900">
                    {selected.swot.opportunities.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-rose-200 bg-rose-50/60 p-3.5">
                  <div className="text-xs font-bold text-rose-800">Threats</div>
                  <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs text-rose-900">
                    {selected.swot.threats.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900">
                Mapped Branch Locations ({companyBranches.length})
              </h3>
              <div className="mt-3 divide-y divide-slate-100 text-xs">
                {companyBranches.length === 0 ? (
                  <p className="py-4 text-slate-400">
                    No individual branch pins loaded for this brand yet.
                  </p>
                ) : (
                  companyBranches.map((b) => (
                    <div key={b.id} className="flex items-center justify-between py-2.5">
                      <div>
                        <div className="font-semibold text-slate-900">{b.branchName}</div>
                        <div className="text-[11px] text-slate-500">{b.address}</div>
                      </div>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                        {b.source}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
