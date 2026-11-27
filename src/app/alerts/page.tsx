"use client";

import React from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AlertsPage() {
  const { state, markAlertRead, markAllAlertsRead } = useApp();

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Alerts Center</h1>
          <p className="text-sm text-slate-500">
            Centralized notifications for expansion matches, CRM follow-ups, and map discoveries.
          </p>
        </div>
        <button
          onClick={markAllAlertsRead}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          <CheckCheck className="h-4 w-4" /> Mark All Read
        </button>
      </div>

      <div className="space-y-3">
        {state.alerts.map((alt) => (
          <div
            key={alt.id}
            className={`flex flex-col justify-between gap-3 rounded-xl border p-4 shadow-xs sm:flex-row sm:items-center ${
              alt.read
                ? "border-slate-200 bg-white"
                : "border-indigo-200 bg-indigo-50/40"
            }`}
          >
            <div className="flex items-start gap-3">
              <Bell
                className={`mt-0.5 h-4 w-4 shrink-0 ${
                  alt.severity === "Critical Opportunity"
                    ? "text-rose-600"
                    : "text-indigo-600"
                }`}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{alt.title}</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    {alt.module}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-600">{alt.message}</p>
                <p className="mt-1 text-[11px] text-slate-400">{alt.timestamp}</p>
              </div>
            </div>
            {!alt.read && (
              <button
                onClick={() => markAlertRead(alt.id)}
                className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Mark Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
