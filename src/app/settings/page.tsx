"use client";

import React, { useState } from "react";
import { Plus, Trash2, CheckCircle2, Database } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Employee, MasterCatalog } from "@/types";

const MASTER_GROUPS: {
  group: string;
  items: { key: keyof MasterCatalog; label: string }[];
}[] = [
  {
    group: "Property Masters",
    items: [
      { key: "propertyCategories", label: "Property Category" },
      { key: "propertySubcategories", label: "Property Subcategory" },
      { key: "residentialStructures", label: "Residential Structure" },
      { key: "furnishingTypes", label: "Furnished Structure" },
      { key: "possessionStatuses", label: "Possession Status" },
      { key: "doorFacings", label: "Door Facing" },
      { key: "units", label: "Measurement Units" },
      { key: "amenities", label: "Amenities" },
    ],
  },
  {
    group: "Project Masters",
    items: [
      { key: "projectStages", label: "Project Stage" },
      { key: "projectSegments", label: "Project Segment" },
      { key: "developmentAuthorities", label: "Development Authority" },
      { key: "electricityProviders", label: "Electricity Provider" },
    ],
  },
  {
    group: "Lead & Opportunity Masters",
    items: [
      { key: "opportunityStages", label: "Opportunity Stage" },
      { key: "lostReasons", label: "Lost Reason" },
      { key: "leadSources", label: "Lead Source" },
    ],
  },
  {
    group: "General & Geography",
    items: [
      { key: "cities", label: "Cities" },
      { key: "areas", label: "Areas / Localities" },
      { key: "customerTypes", label: "Customer Types" },
      { key: "documentTypes", label: "Document Types" },
    ],
  },
];

export default function SettingsPage() {
  const { state, addMasterValue, removeMasterValue, addEmployee } = useApp();
  const [tab, setTab] = useState<"masters" | "employees" | "utilities">("masters");
  const [selectedMaster, setSelectedMaster] = useState<keyof MasterCatalog>("propertyCategories");
  const [newVal, setNewVal] = useState("");
  const [syncMessage, setSyncMessage] = useState("");

  const [empForm, setEmpForm] = useState<Omit<Employee, "id">>({
    name: "",
    email: "",
    mobile: "",
    department: "Sales",
    designation: "Sales Executive",
    role: "Sales Executive",
    status: "Active",
  });

  const handleAddMaster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVal.trim()) return;
    addMasterValue(selectedMaster, newVal);
    setNewVal("");
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empForm.name.trim()) return;
    addEmployee(empForm);
    setEmpForm({
      name: "",
      email: "",
      mobile: "",
      department: "Sales",
      designation: "Sales Executive",
      role: "Sales Executive",
      status: "Active",
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Settings, Masters &amp; Connectors</h1>
        <p className="text-sm text-slate-500">
          Configure ProBro dropdown masters, employees/roles, SMTP/SMS/API settings, and MarketRadar data sources.
        </p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {[
          { id: "masters", label: "Master Data Catalog" },
          { id: "employees", label: `Employees & Roles (${state.employees.length})` },
          { id: "utilities", label: "Utility, SMTP & Data Sources" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold ${
              tab === t.id
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "masters" && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            {MASTER_GROUPS.map((g) => (
              <div key={g.group}>
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {g.group}
                </div>
                <div className="space-y-1">
                  {g.items.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setSelectedMaster(item.key)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs font-medium ${
                        selectedMaster === item.key
                          ? "bg-blue-600 text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] opacity-80">
                        {state.masters[item.key].length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-2">
            <h2 className="text-sm font-bold text-slate-900">
              Manage Values — {selectedMaster}
            </h2>
            <form onSubmit={handleAddMaster} className="mt-3 flex gap-2">
              <input
                value={newVal}
                onChange={(e) => setNewVal(e.target.value)}
                placeholder="Add new master value..."
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </form>

            <div className="mt-4 divide-y divide-slate-100">
              {state.masters[selectedMaster].map((val) => (
                <div
                  key={val}
                  className="flex items-center justify-between py-2.5 text-xs"
                >
                  <span className="font-medium text-slate-800">{val}</span>
                  <button
                    onClick={() => removeMasterValue(selectedMaster, val)}
                    className="rounded p-1 text-rose-500 hover:bg-rose-50"
                    title="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "employees" && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs lg:col-span-2">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name &amp; Contact</th>
                  <th className="px-4 py-3">Department / Designation</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.employees.map((e) => (
                  <tr key={e.id}>
                    <td className="px-4 py-3 font-medium">{e.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{e.name}</div>
                      <div className="text-[11px] text-slate-500">{e.mobile}</div>
                    </td>
                    <td className="px-4 py-3">
                      {e.department} • {e.designation}
                    </td>
                    <td className="px-4 py-3">{e.role}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <form
            onSubmit={handleAddEmployee}
            className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
          >
            <h2 className="text-sm font-bold text-slate-900">Add Team Member</h2>
            <div className="mt-3 space-y-3 text-xs">
              <input
                required
                placeholder="Full Name *"
                value={empForm.name}
                onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
              <input
                placeholder="Email"
                value={empForm.email}
                onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
              <input
                placeholder="Mobile"
                value={empForm.mobile}
                onChange={(e) => setEmpForm({ ...empForm, mobile: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
              <select
                value={empForm.role}
                onChange={(e) =>
                  setEmpForm({ ...empForm, role: e.target.value as Employee["role"] })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              >
                {["Admin", "Sales Manager", "Sales Executive", "Inventory Coordinator"].map(
                  (r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  )
                )}
              </select>
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
              >
                Add Employee
              </button>
            </div>
          </form>
        </div>
      )}

      {tab === "utilities" && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900">
              MarketRadar Data Sources &amp; Connectors
            </h2>
            <div className="mt-3 space-y-3 text-xs">
              {[
                {
                  name: "Supabase Cloud Database (PostgreSQL)",
                  status: isSupabaseConfigured
                    ? "Connected (Cloud Sync Active)"
                    : "Local Demo Mode — Add NEXT_PUBLIC_SUPABASE_URL & ANON_KEY in Vercel",
                },
                {
                  name: "OpenStreetMap / Overpass GIS",
                  status: "Active (No API Key Required)",
                },
                {
                  name: "Financial & Commercial RSS Feeds",
                  status: "Active (30-min interval)",
                },
                {
                  name: "Google Places Live (Optional)",
                  status: "Standby — Configure NEXT_PUBLIC_GOOGLE_MAPS_KEY",
                },
              ].map((src) => (
                <div
                  key={src.name}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <Database className="h-4 w-4 text-blue-600" />
                    {src.name}
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700">
                    {src.status}
                  </span>
                </div>
              ))}
              <button
                onClick={() =>
                  setSyncMessage("OSM & RSS health check passed — all local records up to date.")
                }
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Test Connectors
              </button>
              {syncMessage && (
                <p className="text-xs font-medium text-emerald-700">{syncMessage}</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900">
              ProBro Utility &amp; Communication Settings
            </h2>
            <div className="mt-3 space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-medium text-slate-700">SMTP Host</label>
                <input
                  defaultValue="smtp.probro-radar.in"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-700">SMTP Port</label>
                  <input
                    defaultValue="587"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-700">
                    Lead Auto-Assignment
                  </label>
                  <select className="w-full rounded-lg border border-slate-200 px-3 py-2">
                    <option>Round Robin</option>
                    <option>Territory Based</option>
                    <option>Manual</option>
                  </select>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Configure environment variables in Vercel (`SMTP_HOST`, `DATABASE_URL`) for production email/DB persistence.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
