"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { IdentityUserRow } from "@/lib/admin/identity-users";

const STATUS_LABEL: Record<IdentityUserRow["status"], string> = {
  confirmed: "Đã xác thực",
  unconfirmed: "Chưa xác thực",
  banned: "Bị khoá",
};

const STATUS_BADGE: Record<IdentityUserRow["status"], string> = {
  confirmed: "bg-green-50 text-green-700 border-green-200",
  unconfirmed: "bg-amber-50 text-amber-700 border-amber-200",
  banned: "bg-red-50 text-red-700 border-red-200",
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

export function UsersTable({ users }: { users: IdentityUserRow[] }) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | IdentityUserRow["status"]>("all");
  const [providerFilter, setProviderFilter] = useState<"all" | string>("all");

  const providers = useMemo(
    () => Array.from(new Set(users.map((u) => u.provider))).sort(),
    [users],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (q && !(u.email?.toLowerCase().includes(q) || u.fullName?.toLowerCase().includes(q))) return false;
      if (roleFilter === "admin" && !u.isAdmin) return false;
      if (roleFilter === "user" && u.isAdmin) return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (providerFilter !== "all" && u.provider !== providerFilter) return false;
      return true;
    });
  }, [users, query, roleFilter, statusFilter, providerFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo email hoặc tên..."
          className="min-w-[240px] flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand-blue"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand-blue"
        >
          <option value="all">Mọi vai trò</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand-blue"
        >
          <option value="all">Mọi trạng thái</option>
          <option value="confirmed">Đã xác thực</option>
          <option value="unconfirmed">Chưa xác thực</option>
          <option value="banned">Bị khoá</option>
        </select>
        <select
          value={providerFilter}
          onChange={(e) => setProviderFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand-blue"
        >
          <option value="all">Mọi provider</option>
          {providers.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <span className="text-xs text-gray-400">
          {filtered.length}/{users.length} người dùng
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Họ tên</th>
              <th className="px-4 py-3">Vai trò</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Onboarding</th>
              <th className="px-4 py-3">Ngày đăng ký</th>
              <th className="px-4 py-3">Lần đăng nhập gần nhất</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/users/${u.id}`} className="font-semibold text-brand-blue hover:underline">
                    {u.email ?? "—"}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600">{u.fullName ?? "—"}</td>
                <td className="px-4 py-3">
                  {u.isAdmin ? (
                    <span className="rounded-full border border-brand-blue/30 bg-brand-blue/10 px-2 py-0.5 text-xs font-semibold text-brand-blue">
                      Admin
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">User</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${STATUS_BADGE[u.status]}`}>
                    {STATUS_LABEL[u.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{u.provider}</td>
                <td className="px-4 py-3 text-gray-600">{u.onboardingCompleted ? "Đã xong" : "Chưa xong"}</td>
                <td className="px-4 py-3 text-gray-500">{formatDate(u.registeredAt)}</td>
                <td className="px-4 py-3 text-gray-500">{formatDate(u.lastSignInAt)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-sm text-gray-400">
                  Không tìm thấy người dùng phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
