"use client";

import React, { useMemo, useState } from "react";
import { Radar } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { haversineMeters } from "@/lib/format";

export default function CompetitorsPage() {
  const { state } = useApp();
  const [brandAId, setBrandAId] = useState(state.companies[0]?.id || "CMP-01");
  const [brandBId, setBrandBId] = useState(state.companies[1]?.id || "CMP-02");
  const [radiusMeters, setRadiusMeters] = useState(2000);

  const brandA = state.companies.find((c) => c.id === brandAId);
  const brandB = state.companies.find((c) => c.id === brandBId);

  const overlaps = useMemo(() => {
    const branchesA = state.branches.filter((b) => b.companyId === brandAId);
    const branchesB = state.branches.filter((b) => b.companyId === brandBId);
    const pairs: { a: string; b: string; distance: number; area: string }[] = [];

    branchesA.forEach((a) => {
      branchesB.forEach((b) => {
        const dist = haversineMeters(a.lat, a.lng, b.lat, b.lng);
        if (dist <= radiusMeters) {
          pairs.push({
            a: a.branchName,
            b: b.branchName,
            distance: dist,
            area: a.neighborhood,
          });
        }
      });
    });
    return pairs.sort((x, y) => x.distance - y.distance);
  }, [state.branches, brandAId, brandBId, radiusMeters]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Competitor Radar</h1>
        <p className="text-sm text-slate-500">
          Side-by-side brand benchmarking and Haversine spatial proximity overlap analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Brand A</label>
          <select
            value={brandAId}
            onChange={(e) => setBrandAId(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
          >
            {state.companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Brand B</label>
          <select
            value={brandBId}
            onChange={(e) => setBrandBId(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
          >
            {state.companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Overlap Radius
          </label>
          <select
            value={radiusMeters}
            onChange={(e) => setRadiusMeters(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
          >
            <option value={500}>500 metres</option>
            <option value={1000}>1 kilometre</option>
            <option value={2000}>2 kilometres</option>
            <option value={5000}>5 kilometres</option>
          </select>
        </div>
      </div>

      {brandA && brandB && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[brandA, brandB].map((b) => (
            <div
              key={b.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">{b.name}</h2>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                  {b.growthRate}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{b.sector}</p>
              <div className="mt-3 text-2xl font-bold text-slate-900">
                {b.branchCount} <span className="text-xs font-normal text-slate-500">branches</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2">
          <Radar className="h-4 w-4 text-rose-600" />
          <h2 className="text-sm font-bold text-slate-900">
            Proximity Overlap Pairs (within {radiusMeters}m)
          </h2>
        </div>
        <div className="mt-4 divide-y divide-slate-100 text-xs">
          {overlaps.length === 0 ? (
            <p className="py-6 text-center text-slate-400">
              No branch pairs found within {radiusMeters}m. Try increasing the radius.
            </p>
          ) : (
            overlaps.map((pair, idx) => (
              <div key={idx} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-semibold text-slate-900">
                    {pair.a} ↔ {pair.b}
                  </div>
                  <div className="text-[11px] text-slate-500">Corridor: {pair.area}</div>
                </div>
                <span className="rounded-full bg-rose-100 px-2.5 py-1 font-bold text-rose-700">
                  {pair.distance} m
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
