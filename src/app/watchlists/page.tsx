"use client";

import React, { useState } from "react";
import { Plus, Star, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { WatchlistItem } from "@/types";

export default function WatchlistsPage() {
  const { state, addWatchlist, removeWatchlist } = useApp();
  const [name, setName] = useState("");
  const [type, setType] = useState<WatchlistItem["type"]>("Neighborhood");
  const [target, setTarget] = useState("Sindhu Bhavan Road");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !target.trim()) return;
    addWatchlist({
      name,
      type,
      target,
      city: "Ahmedabad",
      alertsEnabled: true,
    });
    setName("");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Watchlists</h1>
        <p className="text-sm text-slate-500">
          Save priority brands, sectors, or neighborhoods for automated signal matching.
        </p>
      </div>

      <form
        onSubmit={handleAdd}
        className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 text-xs shadow-xs sm:grid-cols-4"
      >
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Watchlist Name (e.g. SBR Retail)"
          className="rounded-lg border border-slate-200 px-3 py-2"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as WatchlistItem["type"])}
          className="rounded-lg border border-slate-200 px-3 py-2"
        >
          <option value="Neighborhood">Neighborhood</option>
          <option value="Company">Company</option>
          <option value="Sector">Sector</option>
        </select>
        <input
          required
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Target value..."
          className="rounded-lg border border-slate-200 px-3 py-2"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-3.5 w-3.5" /> Add Watchlist
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {state.watchlists.map((w) => (
          <div
            key={w.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
          >
            <div className="flex items-start gap-3">
              <Star className="mt-0.5 h-4 w-4 text-amber-500" />
              <div>
                <div className="text-sm font-bold text-slate-900">{w.name}</div>
                <div className="text-xs text-slate-500">
                  {w.type}: {w.target} ({w.city})
                </div>
                <div className="mt-1 text-[11px] text-slate-400">Created {w.createdAt}</div>
              </div>
            </div>
            <button
              onClick={() => removeWatchlist(w.id)}
              className="rounded-md p-1.5 text-rose-500 hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
