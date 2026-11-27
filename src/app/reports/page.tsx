"use client";

import React, { useState } from "react";
import { Download, FileJson, FileSpreadsheet } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { downloadCSV, downloadJSON, formatINR } from "@/lib/format";

type ReportType =
  | "lead_report"
  | "high_priority_leads"
  | "opportunity_report"
  | "inventory_report"
  | "property_added"
  | "market_dossier";

export default function ReportsPage() {
  const { state } = useApp();
  const [report, setReport] = useState<ReportType>("lead_report");

  const handleExportCSV = () => {
    if (report === "lead_report") {
      downloadCSV("probro_lead_report.csv", state.leads as unknown as Record<string, unknown>[]);
    } else if (report === "high_priority_leads") {
      downloadCSV(
        "probro_high_priority_leads.csv",
        state.leads.filter((l) => l.priority === "High") as unknown as Record<string, unknown>[]
      );
    } else if (report === "opportunity_report") {
      downloadCSV(
        "probro_opportunity_report.csv",
        state.opportunities as unknown as Record<string, unknown>[]
      );
    } else if (report === "inventory_report" || report === "property_added") {
      downloadCSV(
        "probro_inventory_report.csv",
        state.properties as unknown as Record<string, unknown>[]
      );
    } else {
      downloadCSV(
        "marketradar_dossier.csv",
        state.companies as unknown as Record<string, unknown>[]
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Reports &amp; Data Exports</h1>
          <p className="text-sm text-slate-500">
            ProBro operational reports (Lead, High-Priority, Opportunity, Inventory) &amp; MarketRadar Dossiers.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            <FileSpreadsheet className="h-4 w-4" /> Export CSV
          </button>
          <button
            onClick={() => downloadJSON("proppulse_ai_full_export.json", state)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <FileJson className="h-4 w-4" /> Full JSON
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: "lead_report", label: "Lead Report" },
          { id: "high_priority_leads", label: "High Priority Lead Report" },
          { id: "opportunity_report", label: "Opportunity Report" },
          { id: "inventory_report", label: "Inventory Report" },
          { id: "property_added", label: "Property Added Summary" },
          { id: "market_dossier", label: "MarketRadar Brand Dossier" },
        ].map((r) => (
          <button
            key={r.id}
            onClick={() => setReport(r.id as ReportType)}
            className={`rounded-lg px-3.5 py-2 text-xs font-semibold ${
              report === r.id
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          {report === "lead_report" && (
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Mobile</th>
                  <th className="px-4 py-3">Requirement</th>
                  <th className="px-4 py-3">Executive</th>
                  <th className="px-4 py-3">Visit / Deal</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Next Follow-Up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.leads.map((l) => (
                  <tr key={l.id}>
                    <td className="px-4 py-3">{l.date}</td>
                    <td className="px-4 py-3 font-semibold">{l.name}</td>
                    <td className="px-4 py-3">{l.mobile}</td>
                    <td className="px-4 py-3">{l.projectRequirement}</td>
                    <td className="px-4 py-3">{l.assignTo}</td>
                    <td className="px-4 py-3">
                      {l.visitDone ? "Visited" : "Pending"} / {l.dealDone ? "Done" : "Open"}
                    </td>
                    <td className="px-4 py-3">{l.status}</td>
                    <td className="px-4 py-3">{l.nextFollowUp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {report === "high_priority_leads" && (
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Lead ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Business Type</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.leads
                  .filter((l) => l.priority === "High")
                  .map((l) => (
                    <tr key={l.id}>
                      <td className="px-4 py-3 font-medium">{l.id}</td>
                      <td className="px-4 py-3 font-semibold">{l.name}</td>
                      <td className="px-4 py-3">{l.businessType}</td>
                      <td className="px-4 py-3">{l.budgetRange}</td>
                      <td className="px-4 py-3">{l.source}</td>
                      <td className="px-4 py-3">{l.status}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {report === "opportunity_report" && (
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Opp ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.opportunities.map((o) => (
                  <tr key={o.id}>
                    <td className="px-4 py-3 font-medium">{o.id}</td>
                    <td className="px-4 py-3 font-semibold">{o.name}</td>
                    <td className="px-4 py-3">{o.projectOrProperty}</td>
                    <td className="px-4 py-3 font-bold">{formatINR(o.estimatedValue)}</td>
                    <td className="px-4 py-3">{o.stage}</td>
                    <td className="px-4 py-3">{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {(report === "inventory_report" || report === "property_added") && (
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Property ID</th>
                  <th className="px-4 py-3">Project / Block</th>
                  <th className="px-4 py-3">Category / Structure</th>
                  <th className="px-4 py-3">Carpet Area</th>
                  <th className="px-4 py-3">Facing</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.properties.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-medium">{p.id}</td>
                    <td className="px-4 py-3 font-semibold">
                      {p.projectName} ({p.unitNo})
                    </td>
                    <td className="px-4 py-3">
                      {p.category} • {p.residentialStructure}
                    </td>
                    <td className="px-4 py-3">
                      {p.carpetArea} {p.areaUnit}
                    </td>
                    <td className="px-4 py-3">{p.doorFacing}</td>
                    <td className="px-4 py-3 font-bold">{formatINR(p.price)}</td>
                    <td className="px-4 py-3">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {report === "market_dossier" && (
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Brand</th>
                  <th className="px-4 py-3">Sector</th>
                  <th className="px-4 py-3">Branches</th>
                  <th className="px-4 py-3">Growth</th>
                  <th className="px-4 py-3">City</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.companies.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3 font-semibold">{c.name}</td>
                    <td className="px-4 py-3">{c.sector}</td>
                    <td className="px-4 py-3">{c.branchCount}</td>
                    <td className="px-4 py-3 text-emerald-700 font-semibold">{c.growthRate}</td>
                    <td className="px-4 py-3">{c.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Download className="h-3.5 w-3.5" />
        All exports include live edits made in your workspace.
      </div>
    </div>
  );
}
