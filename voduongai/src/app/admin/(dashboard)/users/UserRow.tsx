"use client";

import { useState } from "react";
import { setUserBanned, type AdminUser } from "./actions";
import { useAdminToast } from "@/lib/admin/toast";

export function UserRow({ user }: { user: AdminUser }) {
  const [saving, setSaving] = useState(false);
  const { push } = useAdminToast();

  async function toggleBan() {
    if (!user.banned && !confirm(`Khoá tài khoản ${user.email}?`)) return;
    setSaving(true);
    const result = await setUserBanned(user.id, !user.banned);
    setSaving(false);
    if (result.error) push(result.error);
    else push(user.banned ? "Đã mở khoá tài khoản." : "Đã khoá tài khoản.");
  }

  return (
    <tr className="border-b border-white/5">
      <td className="px-3 py-3 text-sm text-white/80">{user.fullName ?? "—"}</td>
      <td className="px-3 py-3 text-sm text-white/80">{user.email}</td>
      <td className="px-3 py-3 text-xs text-white/40">{user.referralCode ?? "—"}</td>
      <td className="px-3 py-3 text-xs text-white/40">{new Date(user.createdAt).toLocaleDateString("vi-VN")}</td>
      <td className="px-3 py-3 text-xs text-white/40">
        {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString("vi-VN") : "Chưa đăng nhập"}
      </td>
      <td className="px-3 py-3">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            user.banned ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"
          }`}
        >
          {user.banned ? "Đã khoá" : "Hoạt động"}
        </span>
      </td>
      <td className="px-3 py-3">
        <button
          onClick={toggleBan}
          disabled={saving}
          className={`rounded-lg border px-2.5 py-1 text-xs font-semibold disabled:opacity-30 ${
            user.banned
              ? "border-green-400/20 text-green-400 hover:bg-green-500/10"
              : "border-red-400/20 text-red-400 hover:bg-red-500/10"
          }`}
        >
          {user.banned ? "Mở khoá" : "Khoá"}
        </button>
      </td>
    </tr>
  );
}
