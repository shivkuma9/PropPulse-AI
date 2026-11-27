"use client";

import React, { useMemo, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/format";
import { BusinessType, Opportunity } from "@/types";

const EMPTY_OPP: Omit<Opportunity, "id"> = {
  leadId: "",
  leadDate: "2026-11-27",
  qualifyDate: "2026-11-27",
  assignTo: "Aarav Patel",
  name: "",
  mobile: "",
  projectOrProperty: "",
  businessType: "Residential",
  estimatedValue: 10000000,
  status: "Open",
  stage: "Qualification",
  lostReason: "",
  nextFollowUp: "2026-11-27",
  specialNotes: "",
};

export default function PipelinePage() {
  const { state, addOpportunity, updateOpportunity, deleteOpportunity } = useApp();
  const [stageFilter, setStageFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Opportunity | null>(null);
  const [form, setForm] = useState<Omit<Opportunity, "id">>(EMPTY_OPP);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    return state.opportunities.filter((o) => {
      if (stageFilter !== "All" && o.stage !== stageFilter) return false;
      if (statusFilter !== "All" && o.status !== statusFilter) return false;
      return true;
    });
  }, [state.opportunities, stageFilter, statusFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_OPP);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (opp: Opportunity) => {
    setEditing(opp);
    const { id: _, ...rest } = opp;
    void _;
    setForm(rest);
    setError("");
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.status === "Lost" && !form.lostReason.trim()) {
      setError("Lost Reason is required when marking an opportunity as Lost.");
      return;
    }
    if (editing) {
      updateOpportunity({ ...form, id: editing.id });
    } else {
      addOpportunity(form);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Opportunity Pipeline</h1>
          <p className="text-sm text-slate-500">
            Track qualified prospects across stages, follow-ups, and win/loss outcomes.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          New Opportunity
        </button>
      </div>

      {/* Stage Summary Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {state.masters.opportunityStages.map((stage) => {
          const items = state.opportunities.filter((o) => o.stage === stage);
          const total = items.reduce((s, o) => s + o.estimatedValue, 0);
          return (
            <button
              key={stage}
              onClick={() => setStageFilter(stageFilter === stage ? "All" : stage)}
              className={`rounded-xl border p-3 text-left transition ${
                stageFilter === stage
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="text-[11px] font-semibold text-slate-500">{stage}</div>
              <div className="mt-1 text-lg font-bold text-slate-900">{items.length}</div>
              <div className="text-[11px] text-slate-500">{formatINR(total)}</div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {["All", "Open", "Won", "Lost", "On Hold"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
              statusFilter === st
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              <tr>
                <th className="px-4 py-3">Opp / Lead ID</th>
                <th className="px-4 py-3">Prospect</th>
                <th className="px-4 py-3">Project / Property</th>
                <th className="px-4 py-3">Est. Value</th>
                <th className="px-4 py-3">Stage &amp; Status</th>
                <th className="px-4 py-3">Assign To / Follow-Up</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((opp) => (
                <tr key={opp.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <div>{opp.id}</div>
                    <div className="text-[11px] text-slate-400">
                      {opp.leadId || "Direct"} • {opp.qualifyDate}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{opp.name}</div>
                    <div className="text-[11px] text-slate-500">{opp.mobile}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{opp.projectOrProperty}</div>
                    <div className="text-[11px] text-slate-500">{opp.businessType}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {formatINR(opp.estimatedValue)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{opp.stage}</div>
                    <span
                      className={`mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        opp.status === "Won"
                          ? "bg-emerald-100 text-emerald-700"
                          : opp.status === "Lost"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {opp.status}
                      {opp.lostReason ? ` (${opp.lostReason})` : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-700">{opp.assignTo}</div>
                    <div className="text-[11px] text-slate-400">Next: {opp.nextFollowUp}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => openEdit(opp)}
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteOpportunity(opp.id)}
                        className="rounded-md p-1.5 text-rose-500 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleSave}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-slate-900">
              {editing ? `Edit ${editing.id}` : "New Opportunity"}
            </h2>
            {error && (
              <div className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                {error}
              </div>
            )}
            <div className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-medium text-slate-700">Prospect Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Mobile *</label>
                <input
                  required
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block font-medium text-slate-700">Project / Property</label>
                <input
                  value={form.projectOrProperty}
                  onChange={(e) =>
                    setForm({ ...form, projectOrProperty: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Estimated Value (₹)</label>
                <input
                  type="number"
                  value={form.estimatedValue}
                  onChange={(e) =>
                    setForm({ ...form, estimatedValue: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Business Type</label>
                <select
                  value={form.businessType}
                  onChange={(e) =>
                    setForm({ ...form, businessType: e.target.value as BusinessType })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  {["Residential", "Commercial", "Industrial", "Land/Plot"].map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Pipeline Stage</label>
                <select
                  value={form.stage}
                  onChange={(e) =>
                    setForm({ ...form, stage: e.target.value as Opportunity["stage"] })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  {state.masters.opportunityStages.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as Opportunity["status"] })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  {["Open", "Won", "Lost", "On Hold"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              {form.status === "Lost" && (
                <div className="sm:col-span-2">
                  <label className="mb-1 block font-medium text-rose-700">Lost Reason *</label>
                  <select
                    value={form.lostReason}
                    onChange={(e) => setForm({ ...form, lostReason: e.target.value })}
                    className="w-full rounded-lg border border-rose-300 px-3 py-2"
                  >
                    <option value="">Select reason...</option>
                    {state.masters.lostReasons.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="mb-1 block font-medium text-slate-700">Assign To</label>
                <select
                  value={form.assignTo}
                  onChange={(e) => setForm({ ...form, assignTo: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  {state.employees.map((e) => (
                    <option key={e.id} value={e.name}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Next Follow-Up</label>
                <input
                  type="date"
                  value={form.nextFollowUp}
                  onChange={(e) => setForm({ ...form, nextFollowUp: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Save Opportunity
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
