"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, ShieldCheck, MapPin, Edit2, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/format";
import { BusinessType, Project } from "@/types";

const EMPTY_PROJECT: Omit<Project, "id" | "createdAt"> = {
  name: "",
  developer: "",
  stage: "Under Construction",
  category: "Residential",
  segment: "Luxury Housing",
  specification: "",
  availability: "Available",
  totalArea: 100000,
  areaUnit: "Sq. Ft.",
  packagePrice: 10000000,
  packageContents: "",
  rateOfLand: 8000,
  loanAmount: 7500000,
  reraRegistered: true,
  reraNumber: "",
  developmentAuthority: "AUDA",
  electricityProvider: "Torrent Power",
  bankTieUp: "HDFC Bank, SBI",
  amenities: ["Clubhouse", "24x7 Security"],
  livability: "",
  city: "Ahmedabad",
  area: "SG Highway",
  address: "",
  lat: 23.0338,
  lng: 72.5082,
  commissionMethod: "Percentage",
  commissionValue: 2.0,
  bankDetails: [],
  shareEmail: true,
  shareSms: true,
  terms: "",
};

export default function ProjectsPage() {
  const { state, addProject, updateProject, deleteProject } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, "id" | "createdAt">>(EMPTY_PROJECT);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_PROJECT);
    setModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    const { id: _, createdAt: __, ...rest } = p;
    void _;
    void __;
    setForm(rest);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editing) {
      updateProject({ ...form, id: editing.id, createdAt: editing.createdAt });
    } else {
      addProject(form);
    }
    setModalOpen(false);
  };

  const toggleAmenity = (amenity: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Project Management</h1>
          <p className="text-sm text-slate-500">
            Manage real-estate projects, RERA compliance, specifications, amenities, commission &amp; bank details.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {state.projects.map((p) => {
          const unitCount = state.properties.filter((u) => u.projectId === p.id).length;
          return (
            <div
              key={p.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-600">
                      {p.id} • {p.category} • {p.stage}
                    </span>
                    <h2 className="mt-0.5 text-base font-bold text-slate-900">{p.name}</h2>
                    <p className="text-xs text-slate-500">by {p.developer}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      p.availability === "Available"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {p.availability}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-600">{p.specification}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400">Package Price</div>
                    <div className="font-bold text-slate-900">{formatINR(p.packagePrice)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Total Area</div>
                    <div className="font-semibold text-slate-800">
                      {p.totalArea.toLocaleString()} {p.areaUnit}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Authority / Power</div>
                    <div className="font-medium text-slate-700">
                      {p.developmentAuthority} • {p.electricityProvider}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Commission</div>
                    <div className="font-medium text-slate-700">
                      {p.commissionMethod === "Percentage"
                        ? `${p.commissionValue}%`
                        : formatINR(p.commissionValue)}
                    </div>
                  </div>
                </div>

                {p.reraRegistered && (
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">RERA: {p.reraNumber || "Registered"}</span>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-1">
                  {p.amenities.slice(0, 4).map((am) => (
                    <span
                      key={am}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600"
                    >
                      {am}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <Link
                  href="/map"
                  className="inline-flex items-center gap-1 font-medium text-emerald-600 hover:underline"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {p.area} ({unitCount} units)
                </Link>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(p)}
                    className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deleteProject(p.id)}
                    className="rounded-md p-1.5 text-rose-500 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={handleSave}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-slate-900">
              {editing ? `Edit Project ${editing.id}` : "Add New Project"}
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="mb-1 block font-medium text-slate-700">Project Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Developer</label>
                <input
                  value={form.developer}
                  onChange={(e) => setForm({ ...form, developer: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Category</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value as BusinessType })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  {["Residential", "Commercial", "Industrial", "Land/Plot"].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Stage</label>
                <select
                  value={form.stage}
                  onChange={(e) => setForm({ ...form, stage: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  {state.masters.projectStages.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Segment</label>
                <select
                  value={form.segment}
                  onChange={(e) => setForm({ ...form, segment: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  {state.masters.projectSegments.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Package Price (₹)</label>
                <input
                  type="number"
                  value={form.packagePrice}
                  onChange={(e) =>
                    setForm({ ...form, packagePrice: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Total Area</label>
                <input
                  type="number"
                  value={form.totalArea}
                  onChange={(e) =>
                    setForm({ ...form, totalArea: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Development Authority</label>
                <select
                  value={form.developmentAuthority}
                  onChange={(e) =>
                    setForm({ ...form, developmentAuthority: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  {state.masters.developmentAuthorities.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  id="reraCheck"
                  type="checkbox"
                  checked={form.reraRegistered}
                  onChange={(e) =>
                    setForm({ ...form, reraRegistered: e.target.checked })
                  }
                />
                <label htmlFor="reraCheck" className="font-medium text-slate-700">
                  RERA Registered
                </label>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block font-medium text-slate-700">RERA Number</label>
                <input
                  value={form.reraNumber}
                  onChange={(e) => setForm({ ...form, reraNumber: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Area / Locality</label>
                <select
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  {state.masters.areas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Commission Method</label>
                <select
                  value={form.commissionMethod}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      commissionMethod: e.target.value as "Percentage" | "Fixed",
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Fixed">Fixed (₹)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Commission Value</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.commissionValue}
                  onChange={(e) =>
                    setForm({ ...form, commissionValue: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="mb-1 block font-medium text-slate-700">Specification</label>
                <input
                  value={form.specification}
                  onChange={(e) => setForm({ ...form, specification: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="mb-1 block font-medium text-slate-700">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {state.masters.amenities.map((am) => (
                    <button
                      type="button"
                      key={am}
                      onClick={() => toggleAmenity(am)}
                      className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${
                        form.amenities.includes(am)
                          ? "bg-emerald-600 text-white"
                          : "border border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      {am}
                    </button>
                  ))}
                </div>
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
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Save Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
