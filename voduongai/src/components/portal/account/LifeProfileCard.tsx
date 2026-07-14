"use client";

/**
 * Life Profile Card (Sprint 18.3). Xem
 * `docs/product-bible/BOOK_LIFE_PROFILE.md`.
 *
 * Không phải required form — đây là một lời mời, người dùng có thể bỏ
 * qua hoàn toàn mà không ảnh hưởng gì đến trải nghiệm Portal. Khi đã
 * chia sẻ, người dùng luôn thấy rõ 3 lựa chọn: cập nhật, ẩn/hiện, xoá.
 */

import { useState } from "react";
import { shareDateOfBirth, hideDateOfBirth, deleteDateOfBirth } from "@/app/portal/account/life-profile-actions";
import type { LifeProfile } from "@/lib/portal/life-profile/life-profile";

export function LifeProfileCard({ lifeProfile }: { lifeProfile: LifeProfile }) {
  const entry = lifeProfile.dateOfBirth;
  const [dateValue, setDateValue] = useState(entry?.value ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleShare() {
    if (!dateValue) return;
    setStatus("saving");
    const result = await shareDateOfBirth(dateValue);
    setStatus(result.error ? "error" : "saved");
  }

  async function handleToggleHidden() {
    setStatus("saving");
    const result = await hideDateOfBirth(entry?.visibility !== "hidden");
    setStatus(result.error ? "error" : "saved");
  }

  async function handleDelete() {
    setStatus("saving");
    const result = await deleteDateOfBirth();
    if (!result.error) setDateValue("");
    setStatus(result.error ? "error" : "saved");
  }

  return (
    <div className="gemos-gem-card rounded-2xl p-5">
      <h3 className="gemos-card-title text-sm font-bold text-gray-900">Điều bạn muốn Companion nhớ</h3>

      {!entry && (
        <>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            Nếu bạn muốn, mình rất muốn biết ngày sinh của bạn — không phải để
            thu thập dữ liệu, mà để có thể cùng bạn trân trọng một ngày ý nghĩa
            mỗi năm. Bạn hoàn toàn có thể bỏ qua điều này.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <input
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900"
            />
            <button
              type="button"
              onClick={handleShare}
              disabled={!dateValue || status === "saving"}
              className="rounded-full gradient-surface px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              Chia sẻ với Companion
            </button>
          </div>
        </>
      )}

      {entry && (
        <>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            Cảm ơn vì bạn đã tin tưởng chia sẻ ngày này với mình.
            {entry.visibility === "hidden" && " Hiện bạn đang tạm ẩn — mình sẽ không nhắc đến nó."}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <input
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900"
            />
            <button
              type="button"
              onClick={handleShare}
              disabled={!dateValue || status === "saving"}
              className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-blue-300 disabled:opacity-50"
            >
              Cập nhật
            </button>
            <button
              type="button"
              onClick={handleToggleHidden}
              disabled={status === "saving"}
              className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-blue-300 disabled:opacity-50"
            >
              {entry.visibility === "hidden" ? "Hiện lại" : "Ẩn"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={status === "saving"}
              className="rounded-lg border border-gemos-danger/20 px-4 py-2 text-xs font-semibold text-gemos-danger/80 transition hover:border-gemos-danger/40 disabled:opacity-50"
            >
              Xoá
            </button>
          </div>
        </>
      )}

      {status === "error" && <p className="mt-2 text-xs text-gemos-danger">Có lỗi xảy ra, vui lòng thử lại.</p>}
    </div>
  );
}
