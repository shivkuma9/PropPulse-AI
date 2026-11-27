"use client";

import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/format";

const SAMPLE_QUERIES = [
  "3 BHK in Sindhu Bhavan",
  "HDFC SG Highway",
  "Commercial Lease",
  "Science City",
];

export default function SmartSearchPage() {
  const { state } = useApp();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const tokens = q.split(/\s+/).filter((t) => t.length > 1);
    const match = (text: string) => {
      const hay = text.toLowerCase();
      return tokens.some((t) => hay.includes(t));
    };

    return {
      leads: state.leads.filter((l) =>
        match(`${l.name} ${l.businessType} ${l.residentialStructure} ${l.projectRequirement}`)
      ),
      properties: state.properties.filter((p) =>
        match(`${p.projectName} ${p.category} ${p.transactionType} ${p.residentialStructure} ${p.area}`)
      ),
      companies: state.companies.filter((c) =>
        match(`${c.name} ${c.sector} ${c.description}`)
      ),
      neighborhoods: state.neighborhoods.filter((n) =>
        match(`${n.name} ${n.rationale} ${n.recommendedSectors.join(" ")}`)
      ),
    };
  }, [query, state]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          Natural Language Smart Search
        </h1>
        <p className="text-sm text-slate-500">
          Query across ProBro CRM inventory, leads, MarketRadar brands, and neighborhood scores.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try: '3 BHK Sindhu Bhavan', 'HDFC SG Highway', 'Commercial Lease'..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {SAMPLE_QUERIES.map((sq) => (
            <button
              key={sq}
              onClick={() => setQuery(sq)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {results && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900">
              Matching Properties ({results.properties.length})
            </h2>
            <div className="mt-2 divide-y divide-slate-100 text-xs">
              {results.properties.map((p) => (
                <div key={p.id} className="py-2.5">
                  <div className="font-semibold text-slate-900">
                    {p.projectName} ({p.unitNo}) — {formatINR(p.price)}
                  </div>
                  <div className="text-slate-500">
                    {p.transactionType} • {p.residentialStructure} • {p.area}
                  </div>
                </div>
              ))}
              {results.properties.length === 0 && (
                <p className="py-3 text-slate-400">No matching properties.</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900">
              Matching Leads ({results.leads.length})
            </h2>
            <div className="mt-2 divide-y divide-slate-100 text-xs">
              {results.leads.map((l) => (
                <div key={l.id} className="py-2.5">
                  <div className="font-semibold text-slate-900">
                    {l.name} ({l.id})
                  </div>
                  <div className="text-slate-500">
                    {l.businessType} • {l.projectRequirement}
                  </div>
                </div>
              ))}
              {results.leads.length === 0 && (
                <p className="py-3 text-slate-400">No matching leads.</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900">
              MarketRadar Brands ({results.companies.length})
            </h2>
            <div className="mt-2 divide-y divide-slate-100 text-xs">
              {results.companies.map((c) => (
                <div key={c.id} className="py-2.5">
                  <div className="font-semibold text-slate-900">{c.name}</div>
                  <div className="text-slate-500">
                    {c.sector} • {c.branchCount} branches
                  </div>
                </div>
              ))}
              {results.companies.length === 0 && (
                <p className="py-3 text-slate-400">No matching brands.</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900">
              Neighborhood Opportunities ({results.neighborhoods.length})
            </h2>
            <div className="mt-2 divide-y divide-slate-100 text-xs">
              {results.neighborhoods.map((n) => (
                <div key={n.id} className="py-2.5">
                  <div className="font-semibold text-slate-900">
                    {n.name} — Score {n.opportunityScore}/100
                  </div>
                  <div className="text-slate-500">{n.rationale}</div>
                </div>
              ))}
              {results.neighborhoods.length === 0 && (
                <p className="py-3 text-slate-400">No matching neighborhoods.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
