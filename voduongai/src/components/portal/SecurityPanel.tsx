"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export function SecurityPanel() {
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPw.length < 8) {
      setStatus({ type: "error", text: "Mật khẩu phải có ít nhất 8 ký tự." });
      return;
    }
    if (newPw !== confirmPw) {
      setStatus({ type: "error", text: "Mật khẩu xác nhận không khớp." });
      return;
    }
    setSaving(true);
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setSaving(false);
    if (error) {
      setStatus({ type: "error", text: "Không thể đổi mật khẩu, vui lòng thử lại." });
      return;
    }
    setNewPw("");
    setConfirmPw("");
    setStatus({ type: "success", text: "Đã đổi mật khẩu thành công!" });
  }

  async function handleSignOutAll() {
    if (!confirm("Đăng xuất khỏi tất cả thiết bị?")) return;
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut({ scope: "global" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleChangePassword} className="card-shine grid gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:grid-cols-2">
        <h3 className="col-span-full text-sm font-bold text-white">Đổi mật khẩu</h3>
        <input
          type="password"
          value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
          placeholder="Mật khẩu mới (tối thiểu 8 ký tự)"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
        />
        <input
          type="password"
          value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
          placeholder="Xác nhận mật khẩu mới"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
        />
        <div className="col-span-full flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full gradient-surface px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Đổi mật khẩu"}
          </button>
          {status && (
            <span className={`text-sm ${status.type === "success" ? "text-green-400" : "text-red-400"}`}>
              {status.text}
            </span>
          )}
        </div>
      </form>

      <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <h3 className="text-sm font-bold text-white">Phiên đăng nhập</h3>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <div>
            <p className="text-sm font-semibold text-white">Đăng xuất khỏi tất cả thiết bị</p>
            <p className="mt-0.5 text-xs text-white/60">Kết thúc tất cả phiên đăng nhập đang hoạt động.</p>
          </div>
          <button
            onClick={handleSignOutAll}
            className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white/70 hover:border-red-400/40 hover:text-red-300"
          >
            Đăng xuất tất cả
          </button>
        </div>
      </div>
    </div>
  );
}
