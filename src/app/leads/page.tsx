"use client";

import React, { useMemo, useState } from "react";
import { Plus, Search, Filter, ArrowRightCircle, Trash2, Edit2, RotateCcw } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { BusinessType, Lead } from "@/types";

const EMPTY_LEAD: Omit<Lead, "id"> = {
  date: "2026-11-27",
  assignTo: "Aarav Patel",
  name: "",
  mobile: "",
  email: "",
  businessType: "Residential",
  category: "Residential",
  subcategory: "Apartment",
  residentialStructure: "3 BHK",
  budgetRange: "₹1.0 Cr – ₹1.5 Cr",
  projectRequirement: "",
  source: "Website Enquiry",
  status: "New",
  priority: "Medium",
  nextFollowUp: "2026-11-27",
  visitDone: false,
  dealDone: false,
  specialNotes: "",
};

export default function LeadsPage() {
  const { state, addLead, updateLead, deleteLead, convertLeadToOpportunity } = useApp();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [form, setForm] = useState<Omit<Lead, "id">>(EMPTY_LEAD);

  const filtered = useMemo(() => {
    return state.leads.filter((l) => {
      if (statusFilter !== "All" && l.status !== statusFilter) return false;
      if (typeFilter !== "All" && l.businessType !== typeFilter) return false;
      if (dateFilter && l.date !== dateFilter) return false;
      if (searchText) {
        const q = searchText.toLowerCase();
        const hay = `${l.id} ${l.name} ${l.mobile} ${l.projectRequirement} ${l.assignTo}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [state.leads, statusFilter, typeFilter, dateFilter, searchText]);

  const openCreate = () => {
    setEditingLead(null);
    setForm(EMPTY_LEAD);
    setModalOpen(true);
  };

  const openEdit = (lead: Lead) => {
    setEditingLead(lead);
    const { id: _, ...rest } = lead;
    void _;
    setForm(rest);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mobile.trim()) return;
    if (editingLead) {
      updateLead({ ...form, id: editingLead.id });
    } else {
      addLead(form);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Lead Management</h1>
          <p className="text-sm text-slate-500">
            Capture enquiries, assign executives, track follow-ups, and convert to opportunities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Filter className="h-3.5 w-3.5" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                  <tr>
                    <th className="px-4 py-3">Lead ID / Date</th>
                    <th className="px-4 py-3">Prospect</th>
                    <th className="px-4 py-3">Requirement &amp; Budget</th>
                    <th className="px-4 py-3">Assign To</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Follow-Up</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                        No leads match the current filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-medium text-slate-900">
                          <div>{lead.id}</div>
                          <div className="text-[11px] text-slate-400">{lead.date}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{lead.name}</div>
                          <div className="text-[11px] text-slate-500">{lead.mobile}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">
                            {lead.businessType} • {lead.residentialStructure}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {lead.projectRequirement} ({lead.budgetRange})
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{lead.assignTo}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              lead.status === "Converted"
                                ? "bg-emerald-100 text-emerald-700"
                                : lead.status === "Qualified" || lead.status === "Site Visit"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{lead.nextFollowUp}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            {lead.status !== "Converted" && (
                              <button
                                onClick={() => convertLeadToOpportunity(lead.id)}
                                title="Convert to Opportunity"
                                className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100"
                              >
                                <ArrowRightCircle className="h-3.5 w-3.5" />
                                Convert
                              </button>
                            )}
                            <button
                              onClick={() => openEdit(lead)}
                              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                              title="Edit"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => deleteLead(lead.id)}
                              className="rounded-md p-1.5 text-rose-500 hover:bg-rose-50"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="h-fit rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Search &amp; Filter
              </h2>
              <button
                onClick={() => {
                  setSearchText("");
                  setStatusFilter("All");
                  setTypeFilter("All");
                  setDateFilter("");
                }}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 hover:underline"
              >
                <RotateCcw className="h-3 w-3" />
                Clear
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-medium text-slate-600">Search</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Name, mobile, ID..."
                    className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-3 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-600">Lead Date</label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-600">Lead Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  {["New", "Contacted", "Qualified", "Site Visit", "Converted", "Closed"].map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-600">Business Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="All">All Types</option>
                  {state.masters.propertyCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Lead Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleSave}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-slate-900">
              {editingLead ? `Edit Lead ${editingLead.id}` : "Add New Lead"}
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
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
                <label className="mb-1 block font-medium text-slate-700">Mobile No. *</label>
                <input
                  required
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Assign To</label>
                <select
                  value={form.assignTo}
                  onChange={(e) => setForm({ ...form, assignTo: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  {state.employees.map((emp) => (
                    <option key={emp.id} value={emp.name}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Business Type</label>
                <select
                  value={form.businessType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      businessType: e.target.value as BusinessType,
                      category: e.target.value,
                    })
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
                <label className="mb-1 block font-medium text-slate-700">Structure</label>
                <select
                  value={form.residentialStructure}
                  onChange={(e) =>
                    setForm({ ...form, residentialStructure: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  {state.masters.residentialStructures.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Budget Range</label>
                <input
                  value={form.budgetRange}
                  onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
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
              <div>
                <label className="mb-1 block font-medium text-slate-700">Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as Lead["status"] })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  {["New", "Contacted", "Qualified", "Site Visit", "Converted", "Closed"].map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value as Lead["priority"] })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  {["High", "Medium", "Low"].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block font-medium text-slate-700">
                  Project / Property Requirement
                </label>
                <input
                  value={form.projectRequirement}
                  onChange={(e) =>
                    setForm({ ...form, projectRequirement: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block font-medium text-slate-700">Special Notes</label>
                <textarea
                  rows={2}
                  value={form.specialNotes}
                  onChange={(e) => setForm({ ...form, specialNotes: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Save Lead
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
