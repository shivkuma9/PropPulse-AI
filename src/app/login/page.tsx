"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, ready, login, loginDemo } = useAuth();
  const [email, setEmail] = useState("admin@proppulse.ai");
  const [password, setPassword] = useState("password123");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && user) {
      router.replace("/");
    }
  }, [ready, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);
    if (res.ok) {
      router.replace("/");
    } else {
      setError(res.error || "Sign in failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f7f5] p-4">
      <div className="w-full max-w-md rounded-2xl border border-emerald-100 bg-white p-7 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 shadow-xs">
            <svg viewBox="0 0 64 64" fill="none" className="h-6 w-6">
              <path
                d="M16 46V24L28 16V46"
                stroke="#FFFFFF"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M28 28L40 21V46"
                stroke="#D1FAE5"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M34 36H39L42 30L46 41L49 36H53"
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">PropPulse AI</h1>
            <p className="text-xs font-medium text-emerald-700">
              Real Estate CRM &amp; Market Intelligence
            </p>
          </div>
        </div>

        <h2 className="mt-6 text-base font-bold text-slate-900">
          Sign in to your workspace
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Enter your team credentials or use quick demo access below.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-xs focus:border-emerald-500 focus:outline-none"
                placeholder="admin@proppulse.ai"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type={showPw ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-9 text-xs focus:border-emerald-500 focus:outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                aria-label="Toggle password"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign In"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Quick Demo Access (1-Click)
          </div>
          <div className="mt-2.5 grid grid-cols-3 gap-2 text-[11px]">
            {(["Admin", "Sales Manager", "Sales Executive"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  loginDemo(role);
                  router.replace("/");
                }}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
