"use client";

import React from "react";
import { Target } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function OpportunitiesFinderPage() {
  const { state } = useApp();

  const sorted = [...state.neighborhoods].sort(
    (a, b) => b.opportunityScore - a.opportunityScore
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          Whitespace Opportunity Finder
        </h1>
        <p className="text-sm text-slate-500">
          Composite 0–100 neighborhood viability scoring based on residential density, commercial vitality, and competitor gap.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {sorted.map((nb) => (
          <div
            key={nb.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">{nb.name}</h2>
                <p className="text-xs text-slate-500">
                  {nb.city} • Avg Lease: ₹{nb.avgLeaseRateSqFt}/sq.ft • {nb.competitorCount}{" "}
                  competitors
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                  nb.opportunityScore >= 85
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                <Target className="h-3.5 w-3.5" />
                {nb.opportunityScore} / 100
              </span>
            </div>

            <p className="mt-3 text-xs text-slate-600">{nb.rationale}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Residential Density</span>
                  <span>{nb.residentialDensity}%</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: `${nb.residentialDensity}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Commercial Vitality</span>
                  <span>{nb.commercialVitality}%</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: `${nb.commercialVitality}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {nb.recommendedSectors.map((sec) => (
                <span
                  key={sec}
                  className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700"
                >
                  Recommended: {sec}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
