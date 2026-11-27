"use client";

import React, { useEffect, useState } from "react";
import { Palette, Check } from "lucide-react";

const THEMES = [
  { id: "royal", label: "Royal Blue", swatch: "#2563eb" },
  { id: "navy-gold", label: "Navy & Gold", swatch: "#d97706" },
  { id: "emerald", label: "Emerald", swatch: "#059669" },
  { id: "terracotta", label: "Terracotta", swatch: "#ea580c" },
  { id: "midnight", label: "Midnight Dark", swatch: "#18181b" },
];

const FONTS = [
  { id: "jakarta", label: "Plus Jakarta" },
  { id: "outfit", label: "Outfit" },
  { id: "dmsans", label: "DM Sans" },
  { id: "inter", label: "Inter" },
];

const MOTIONS = [
  { id: "smooth", label: "Smooth" },
  { id: "snappy", label: "Snappy" },
  { id: "minimal", label: "Minimal" },
];

export function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("royal");
  const [font, setFont] = useState("jakarta");
  const [motion, setMotion] = useState("smooth");

  useEffect(() => {
    const savedTheme = localStorage.getItem("pp_theme") || "royal";
    const savedFont = localStorage.getItem("pp_font") || "jakarta";
    const savedMotion = localStorage.getItem("pp_motion") || "smooth";
    setTheme(savedTheme);
    setFont(savedFont);
    setMotion(savedMotion);
    document.documentElement.setAttribute("data-theme", savedTheme);
    document.documentElement.setAttribute("data-font", savedFont);
    document.documentElement.setAttribute("data-motion", savedMotion);
  }, []);

  const applyTheme = (val: string) => {
    setTheme(val);
    localStorage.setItem("pp_theme", val);
    document.documentElement.setAttribute("data-theme", val);
  };

  const applyFont = (val: string) => {
    setFont(val);
    localStorage.setItem("pp_font", val);
    document.documentElement.setAttribute("data-font", val);
  };

  const applyMotion = (val: string) => {
    setMotion(val);
    localStorage.setItem("pp_motion", val);
    document.documentElement.setAttribute("data-motion", val);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 whitespace-nowrap"
        title="Customize Theme, Font & Animations"
      >
        <Palette className="h-3.5 w-3.5 theme-accent-text" />
        <span className="hidden md:inline">Theme</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-800 shadow-xl">
            <div className="font-bold text-slate-900">Customize Appearance</div>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Change colors, fonts, and animation style live.
            </p>

            <div className="mt-3">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Color Theme
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => applyTheme(t.id)}
                    className={`flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-left font-medium transition ${
                      theme === t.id
                        ? "border-blue-500 bg-blue-50/70 text-slate-900"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/10"
                        style={{ backgroundColor: t.swatch }}
                      />
                      {t.label}
                    </span>
                    {theme === t.id && <Check className="h-3.5 w-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3.5">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Font Family
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {FONTS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => applyFont(f.id)}
                    className={`rounded-lg border px-2.5 py-1.5 font-medium transition ${
                      font === f.id
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3.5">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Animation &amp; Effects
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {MOTIONS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => applyMotion(m.id)}
                    className={`rounded-lg border px-2 py-1.5 font-medium transition ${
                      motion === m.id
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
