"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, MapPin, Edit2, Trash2, Search } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/format";
import { BusinessType, Property } from "@/types";

const EMPTY_PROP: Omit<Property, "id" | "createdAt"> = {
  projectId: "PRJ-3001",
  projectName: "Skyline Greens",
  transactionType: "Sale",
  category: "Residential",
  subcategory: "Apartment",
  propertyType: "High-Rise Flat",
  residentialStructure: "3 BHK",
  floor: "5th Floor",
  furnished: "Semi-Furnished",
  doorFacing: "East",
  unitNo: "",
  buildingBlock: "",
  carpetArea: 1200,
  superBuiltUpArea: 1800,
  areaUnit: "Sq. Ft.",
  price: 11500000,
  otherCharges: 250000,
  representative: "Aarav Patel",
  ownerName: "",
  ownerMobile: "",
  contactType: "Owner",
  country: "India",
  state: "Gujarat",
  city: "Ahmedabad",
  area: "SG Highway",
  address: "",
  landmark: "",
  pincode: "380054",
  lat: 23.034,
  lng: 72.508,
  possessionStatus: "Ready to Move",
  status: "Active",
  source: "Direct Owner",
  windowView: "Garden View",
  commissionMethod: "Percentage",
  commissionValue: 2,
  bankDetails: [],
  documents: [],
};

export default function PropertiesPage() {
  const { state, addProperty, updateProperty, deleteProperty } = useApp();
  const [search, setSearch] = useState("");
  const [txFilter, setTxFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [form, setForm] = useState<Omit<Property, "id" | "createdAt">>(EMPTY_PROP);

  const filtered = useMemo(() => {
    return state.properties.filter((p) => {
      if (txFilter !== "All" && p.transactionType !== txFilter) return false;
      if (catFilter !== "All" && p.category !== catFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${p.id} ${p.projectName} ${p.unitNo} ${p.area} ${p.ownerName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [state.properties, txFilter, catFilter, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_PROP);
    setModalOpen(true);
  };

  const openEdit = (prop: Property) => {
    setEditing(prop);
    const { id: _, createdAt: __, ...rest } = prop;
    void _;
    void __;
    setForm(rest);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const linked = state.projects.find((pr) => pr.id === form.projectId);
    const payload = {
      ...form,
      projectName: linked ? linked.name : form.projectName,
    };
    if (editing) {
      updateProperty({ ...payload, id: editing.id, createdAt: editing.createdAt });
    } else {
      addProperty(payload);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Property &amp; Inventory</h1>
          <p className="text-sm text-slate-500">
            Manage individual units for Sale, Rent, and Lease with location, owner, and document details.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search unit, project, area, owner..."
            className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-3 text-xs focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <select
          value={txFilter}
          onChange={(e) => setTxFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs"
        >
          <option value="All">All Transactions</option>
          <option value="Sale">Sale</option>
          <option value="Rent">Rent</option>
          <option value="Lease">Lease</option>
        </select>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs"
        >
          <option value="All">All Categories</option>
          {state.masters.propertyCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Property ID</th>
                <th className="px-4 py-3">Project &amp; Unit</th>
                <th className="px-4 py-3">Specs</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Price / Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-medium text-slate-900">{prop.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">
                      {prop.projectName} ({prop.unitNo || "Unit"})
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {prop.buildingBlock} • {prop.floor}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">
                      {prop.category} • {prop.residentialStructure}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Carpet: {prop.carpetArea} {prop.areaUnit} • {prop.doorFacing}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-800">{prop.area}</div>
                    <Link
                      href="/map"
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:underline"
                    >
                      <MapPin className="h-3 w-3" /> View on Map
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900">
                      {formatINR(prop.price)}
                      {prop.transactionType !== "Sale" ? "/mo" : ""}
                    </div>
                    <div className="text-[11px] text-slate-500">{prop.transactionType}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        prop.status === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {prop.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => openEdit(prop)}
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProperty(prop.id)}
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
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-slate-900">
              {editing ? `Edit Property ${editing.id}` : "Add Property Unit"}
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
              <div>
                <label className="mb-1 block font-medium text-slate-700">Project</label>
                <select
                  value={form.projectId}
                  onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  {state.projects.map((pr) => (
                    <option key={pr.id} value={pr.id}>
                      {pr.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Unit No. *</label>
                <input
                  required
                  value={form.unitNo}
                  onChange={(e) => setForm({ ...form, unitNo: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Transaction Type</label>
                <select
                  value={form.transactionType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      transactionType: e.target.value as Property["transactionType"],
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  <option value="Sale">Sale</option>
                  <option value="Rent">Rent</option>
                  <option value="Lease">Lease</option>
                </select>
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
                <label className="mb-1 block font-medium text-slate-700">Price (₹)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Carpet Area</label>
                <input
                  type="number"
                  value={form.carpetArea}
                  onChange={(e) =>
                    setForm({ ...form, carpetArea: Number(e.target.value) })
                  }
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
                <label className="mb-1 block font-medium text-slate-700">Door Facing</label>
                <select
                  value={form.doorFacing}
                  onChange={(e) => setForm({ ...form, doorFacing: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  {state.masters.doorFacings.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Owner / Contact</label>
                <input
                  value={form.ownerName}
                  onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Owner Mobile</label>
                <input
                  value={form.ownerMobile}
                  onChange={(e) => setForm({ ...form, ownerMobile: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as Property["status"] })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  {["Active", "Inactive", "Sold", "Rented"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
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
                Save Property
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
