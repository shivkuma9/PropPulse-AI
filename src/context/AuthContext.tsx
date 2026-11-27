"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

export interface AuthUser {
  name: string;
  email: string;
  role: "Admin" | "Sales Manager" | "Sales Executive" | "Inventory Coordinator";
}

interface AuthContextValue {
  user: AuthUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginDemo: (role?: AuthUser["role"]) => void;
  logout: () => Promise<void>;
}

const AUTH_STORAGE_KEY = "proppulse_auth_user_v1";

const DEMO_USERS: Record<string, { password: string; user: AuthUser }> = {
  "admin@proppulse.ai": {
    password: "password123",
    user: { name: "Neha Mehta", email: "admin@proppulse.ai", role: "Admin" },
  },
  "manager@proppulse.ai": {
    password: "password123",
    user: { name: "Aarav Patel", email: "manager@proppulse.ai", role: "Sales Manager" },
  },
  "sales@proppulse.ai": {
    password: "password123",
    user: { name: "Priya Shah", email: "sales@proppulse.ai", role: "Sales Executive" },
  },
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved) as AuthUser);
      }
    } catch {
      // Ignore storage error
    } finally {
      setReady(true);
    }
  }, []);

  const persistUser = (u: AuthUser | null) => {
    setUser(u);
    try {
      if (u) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(u));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
  };

  const login = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const demo = DEMO_USERS[cleanEmail];
    if (demo && demo.password === password) {
      persistUser(demo.user);
      return { ok: true };
    }

    const sb = getSupabaseClient();
    if (sb && isSupabaseConfigured) {
      const { data, error } = await sb.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (!error && data.user) {
        persistUser({
          name:
            (data.user.user_metadata?.name as string) ||
            cleanEmail.split("@")[0],
          email: data.user.email || cleanEmail,
          role: "Admin",
        });
        return { ok: true };
      }
      return { ok: false, error: error?.message || "Invalid email or password" };
    }

    return { ok: false, error: "Invalid email or password" };
  };

  const loginDemo = (role: AuthUser["role"] = "Admin") => {
    const match =
      Object.values(DEMO_USERS).find((d) => d.user.role === role)?.user ||
      DEMO_USERS["admin@proppulse.ai"].user;
    persistUser(match);
  };

  const logout = async () => {
    const sb = getSupabaseClient();
    if (sb && isSupabaseConfigured) {
      await sb.auth.signOut();
    }
    persistUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, loginDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
