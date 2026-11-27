"use client";

import React, { useState } from "react";
import { Plus, Handshake, Users } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/format";

export default function CrmPage() {
  const { state, addCustomer, addDeal } = useApp();
  const [tab, setTab] = useState<"customers" | "deals" | "questions">("customers");
  const [custModal, setCustModal] = useState(false);
  const [dealModal, setDealModal] = useState(false);

  const [custForm, setCustForm] = useState({
    name: "",
    mobile: "",
    email: "",
    customerType: "End User",
    profession: "",
    city: "Ahmedabad",
    totalDeals: 0,
  });

  const [dealForm, setDealForm] = useState({
    customerName: "",
    propertyTitle: "",
    transactionType: "Sale" as "Sale" | "Rent" | "Lease",
    dealValue: 10000000,
    commissionAmount: 200000,
    executive: "Aarav Patel",
    closedDate: "2026-11-27",
    status: "In Progress" as "Completed" | "In Progress" | "Pending Docs",
  });

  const saveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custForm.name.trim()) return;
    addCustomer(custForm);
    setCustModal(false);
    setCustForm({
      name: "",
      mobile: "",
      email: "",
      customerType: "End User",
      profession: "",
      city: "Ahmedabad",
      totalDeals: 0,
    });
  };

  const saveDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealForm.customerName.trim()) return;
    addDeal(dealForm);
    setDealModal(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">CRM — Customers &amp; Deals</h1>
          <p className="text-sm text-slate-500">
            Manage registered customers, closed/active deals, customer types, and qualification questions.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCustModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Plus className="h-3.5 w-3.5" /> Add Customer
          </button>
          <button
            onClick={() => setDealModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            <Plus className="h-3.5 w-3.5" /> Record Deal
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {[
          { id: "customers", label: `Customers (${state.customers.length})`, icon: Users },
          { id: "deals", label: `Deals (${state.deals.length})`, icon: Handshake },
          { id: "questions", label: "Property Questions", icon: Users },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
              tab === t.id
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "customers" && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Profession</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Deals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {state.customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{c.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{c.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {c.mobile} • {c.email}
                    </div>
                  </td>
                  <td className="px-4 py-3">{c.customerType}</td>
                  <td className="px-4 py-3">{c.profession || "—"}</td>
                  <td className="px-4 py-3">{c.city}</td>
                  <td className="px-4 py-3 font-semibold">{c.totalDeals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "deals" && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Deal ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Deal Value</th>
                <th className="px-4 py-3">Commission</th>
                <th className="px-4 py-3">Executive</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {state.deals.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{d.id}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{d.customerName}</td>
                  <td className="px-4 py-3">
                    {d.propertyTitle} ({d.transactionType})
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    {formatINR(d.dealValue)}
                  </td>
                  <td className="px-4 py-3 text-emerald-700 font-semibold">
                    {formatINR(d.commissionAmount)}
                  </td>
                  <td className="px-4 py-3">{d.executive}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "questions" && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <h2 className="text-sm font-semibold text-slate-900">
            Standard Property Qualification Questions
          </h2>
          <div className="mt-3 divide-y divide-slate-100 text-xs">
            {[
              { q: "Preferred possession timeline?", cat: "Residential", type: "Buyer" },
              { q: "Home loan pre-approved or self-funded?", cat: "Residential", type: "Buyer" },
              { q: "Minimum frontage & parking slots required?", cat: "Commercial", type: "Tenant" },
              { q: "Power load & fire NOC requirement?", cat: "Industrial", type: "Tenant" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <span className="font-medium text-slate-800">{item.q}</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                  {item.cat} • {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {custModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form onSubmit={saveCustomer} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-base font-bold text-slate-900">Add Customer</h2>
            <div className="mt-4 space-y-3 text-xs">
              <input
                required
                placeholder="Full Name *"
                value={custForm.name}
                onChange={(e) => setCustForm({ ...custForm, name: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
              <input
                required
                placeholder="Mobile *"
                value={custForm.mobile}
                onChange={(e) => setCustForm({ ...custForm, mobile: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
              <input
                placeholder="Email"
                value={custForm.email}
                onChange={(e) => setCustForm({ ...custForm, email: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
              <select
                value={custForm.customerType}
                onChange={(e) => setCustForm({ ...custForm, customerType: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              >
                {state.masters.customerTypes.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
              </select>
              <input
                placeholder="Profession"
                value={custForm.profession}
                onChange={(e) => setCustForm({ ...custForm, profession: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCustModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {dealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form onSubmit={saveDeal} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-base font-bold text-slate-900">Record New Deal</h2>
            <div className="mt-4 space-y-3 text-xs">
              <input
                required
                placeholder="Customer Name *"
                value={dealForm.customerName}
                onChange={(e) => setDealForm({ ...dealForm, customerName: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
              <input
                required
                placeholder="Property / Unit Title *"
                value={dealForm.propertyTitle}
                onChange={(e) => setDealForm({ ...dealForm, propertyTitle: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
              <input
                type="number"
                placeholder="Deal Value (₹)"
                value={dealForm.dealValue}
                onChange={(e) =>
                  setDealForm({ ...dealForm, dealValue: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
              <input
                type="number"
                placeholder="Commission Amount (₹)"
                value={dealForm.commissionAmount}
                onChange={(e) =>
                  setDealForm({ ...dealForm, commissionAmount: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDealModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white"
              >
                Save Deal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
