"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AUTH_KEY = "vdai_admin_auth";
const MOCK_ADMIN = { email: "duongvv.vn@gmail.com", password: "admin123" };

type AdminUser = { email: string; name: string };

type AdminAuthContextValue = {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

// Mock auth backed by localStorage. Swap this module's internals for
// Supabase Auth / Clerk / Auth.js later without touching consuming pages.
export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = window.localStorage.getItem(AUTH_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        window.localStorage.removeItem(AUTH_KEY);
      }
    }
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    if (email.trim().toLowerCase() !== MOCK_ADMIN.email || password !== MOCK_ADMIN.password) {
      return { ok: false, error: "Email hoặc mật khẩu không đúng." };
    }
    const sessionUser: AdminUser = { email: MOCK_ADMIN.email, name: "Quản trị viên" };
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { ok: true };
  }

  function logout() {
    window.localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }

  return (
    <AdminAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
