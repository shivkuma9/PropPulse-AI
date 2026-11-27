"use client";

import React, { useState } from "react";
import { Newspaper, Inbox, Check, X, GitMerge } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function NewsAndDiscoveryPage() {
  const { state, updateDiscoveryStatus } = useApp();
  const [tab, setTab] = useState<"news" | "discovery">("news");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          News Intelligence &amp; Discovery Inbox
        </h1>
        <p className="text-sm text-slate-500">
          Automated media monitoring with sentiment/brand tags and Overpass/RSS lead triage.
        </p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setTab("news")}
          className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold ${
            tab === "news" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Newspaper className="h-3.5 w-3.5" />
          News Intelligence ({state.news.length})
        </button>
        <button
          onClick={() => setTab("discovery")}
          className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold ${
            tab === "discovery"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Inbox className="h-3.5 w-3.5" />
          Discovery Inbox ({state.discoveries.filter((d) => d.status === "Pending").length} pending)
        </button>
      </div>

      {tab === "news" && (
        <div className="space-y-3">
          {state.news.map((n) => (
            <div
              key={n.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-blue-600">
                  {n.source} • {n.sector}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    n.sentiment === "Positive"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {n.sentiment}
                </span>
              </div>
              <h2 className="mt-1.5 text-sm font-bold text-slate-900">{n.title}</h2>
              <p className="mt-1 text-xs text-slate-600">{n.summary}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                <span>{n.publishedAt}</span>
                {n.brands.map((b) => (
                  <span
                    key={b}
                    className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "discovery" && (
        <div className="space-y-3">
          {state.discoveries.map((d) => (
            <div
              key={d.id}
              className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{d.name}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                    {d.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  {d.sector} • {d.address} ({d.neighborhood})
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Source: {d.source} • Confidence: {d.confidence}
                </p>
              </div>
              {d.status === "Pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateDiscoveryStatus(d.id, "Approved")}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => updateDiscoveryStatus(d.id, "Merged")}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <GitMerge className="h-3.5 w-3.5" /> Merge
                  </button>
                  <button
                    onClick={() => updateDiscoveryStatus(d.id, "Rejected")}
                    className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100"
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
