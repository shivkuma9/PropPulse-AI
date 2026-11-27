"use client";

import React, { useState } from "react";
import { Activity, Building2, Plus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ExpansionSignal, MarketSector } from "@/types";

export default function ExpansionTrackerPage() {
  const { state, addSignal } = useApp();
  const [tab, setTab] = useState<"signals" | "leasing">("signals");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Omit<ExpansionSignal, "id">>({
    companyId: "CMP-01",
    companyName: "HDFC Bank",
    sector: "Banking & Finance",
    signalType: "Lease Signed",
    confidence: "High",
    neighborhood: "SG Highway",
    city: "Ahmedabad",
    title: "",
    summary: "",
    sourceName: "Manual Entry",
    detectedAt: "",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    addSignal({
      ...form,
      detectedAt: form.detectedAt || new Date().toISOString().slice(0, 10),
    });
    setModal(false);
    setForm({ ...form, title: "", summary: "" });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Expansion Tracker &amp; Commercial Leasing Radar
          </h1>
          <p className="text-sm text-slate-500">
            Monitor active openings, lease signings, hiring surges, and Grade-A commercial hubs.
          </p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" /> Log Expansion Signal
        </button>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setTab("signals")}
          className={`rounded-lg px-4 py-2 text-xs font-semibold ${
            tab === "signals" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Expansion Signals ({state.signals.length})
        </button>
        <button
          onClick={() => setTab("leasing")}
          className={`rounded-lg px-4 py-2 text-xs font-semibold ${
            tab === "leasing" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Commercial Leasing Radar ({state.commercialHubs.length})
        </button>
      </div>

      {tab === "signals" && (
        <div className="space-y-3">
          {state.signals.map((sig) => (
            <div
              key={sig.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
                  <Activity className="h-4 w-4" />
                  {sig.companyName} • {sig.signalType} • {sig.sector}
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    sig.confidence === "High"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {sig.confidence} Confidence
                </span>
              </div>
              <h2 className="mt-2 text-sm font-bold text-slate-900">{sig.title}</h2>
              <p className="mt-1 text-xs text-slate-600">{sig.summary}</p>
              <div className="mt-3 text-[11px] text-slate-400">
                {sig.neighborhood}, {sig.city} • Source: {sig.sourceName} • {sig.detectedAt}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "leasing" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {state.commercialHubs.map((hub) => (
            <div
              key={hub.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-600">{hub.type}</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  {hub.leasingVelocity} Velocity
                </span>
              </div>
              <h2 className="mt-1 flex items-center gap-1.5 text-base font-bold text-slate-900">
                <Building2 className="h-4 w-4 text-slate-500" />
                {hub.name}
              </h2>
              <p className="text-xs text-slate-500">
                {hub.neighborhood} • {hub.totalSqFt.toLocaleString()} sq. ft.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Occupancy</div>
                  <div className="font-bold text-slate-900">{hub.occupancyPct}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Vacant Units</div>
                  <div className="font-bold text-amber-600">{hub.vacantUnits}</div>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-[11px] font-medium text-slate-500">Anchor Tenants</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {hub.anchorTenants.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form onSubmit={handleSave} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-base font-bold text-slate-900">Log Expansion Signal</h2>
            <div className="mt-4 space-y-3 text-xs">
              <input
                required
                placeholder="Company Name *"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
              <select
                value={form.sector}
                onChange={(e) =>
                  setForm({ ...form, sector: e.target.value as MarketSector })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              >
                {[
                  "Banking & Finance",
                  "Retail & QSR",
                  "Healthcare & Pharma",
                  "Tech & Coworking",
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                required
                placeholder="Signal Headline *"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
              <textarea
                rows={2}
                placeholder="Details / Space requirement..."
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white"
              >
                Save Signal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
