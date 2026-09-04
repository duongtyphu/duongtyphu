"use client";

/**
 * Modal "Gửi ý tưởng của bạn" (2/6 modal Giai đoạn 6) — 1:1 với mockup dòng
 * 1276-1296: form 3 trường (tên/lĩnh vực/mô tả), gọi
 * `submitMnytIdea()` (Server Action Giai đoạn 4, đã có sẵn — chỉ chưa có
 * UI). Mở từ nút "Gửi ý tưởng của bạn" ở dropdown "Khám phá" của
 * `MnytHeader.tsx` (`onOpenSubmit`, trước đó no-op).
 *
 * Sau khi gửi thành công: đóng modal, hiện toast ("Đã gửi đề xuất, cảm ơn
 * bạn!", đúng mockup dòng 2449) + `router.refresh()` — làm mới dữ liệu
 * Server Component của route ĐANG ĐỨNG (nếu đang ở Kho ý tưởng, khối "Ý
 * tưởng bạn đã đề xuất" — đã đọc `submissions` thật từ trước — hiện ngay
 * dòng vừa gửi, không cần tự điều hướng).
 */

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { MnytCategory } from "@/lib/portal/live-mnyt";
import { submitMnytIdea } from "@/lib/portal/mnyt-sync";
import { useMnytToast } from "@/components/v2/mnyt/MnytToastContext";

type Props = {
  lang: "vi" | "en";
  categories: MnytCategory[];
  onClose: () => void;
};

export function MnytSubmitIdeaModal({ lang, categories, onClose }: Props) {
  const isVi = lang === "vi";
  const router = useRouter();
  const showToast = useMnytToast();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]?.name ?? "");
  const [hook, setHook] = useState("");
  const [sending, setSending] = useState(false);

  const t = {
    title: isVi ? "Đề xuất ý tưởng của bạn" : "Suggest an idea",
    body: isVi
      ? "Gửi ý tưởng ứng dụng AI bạn nghĩ ra — đội ngũ sẽ xét duyệt và thêm vào kho."
      : "Send an AI use case you thought of — we review it and add it to the library.",
    titlePh: isVi ? "Tên ý tưởng" : "Idea name",
    categoryAria: isVi ? "Lĩnh vực" : "Field",
    hookPh: isVi ? "Mô tả ngắn ý tưởng này giúp ích điều gì" : "Briefly: what does this idea help with?",
    cancel: isVi ? "Huỷ" : "Cancel",
    send: isVi ? "Gửi đề xuất" : "Send suggestion",
    sending: isVi ? "Đang gửi…" : "Sending…",
    missingFields: isVi ? "Vui lòng nhập đủ tên và mô tả ý tưởng." : "Please fill in both the idea name and description.",
    success: isVi ? "Đã gửi đề xuất, cảm ơn bạn!" : "Suggestion sent, thank you!",
    genericError: isVi ? "Không gửi được — vui lòng thử lại." : "Couldn't send — please try again.",
  };

  const handleSubmit = async () => {
    if (!title.trim() || !hook.trim()) {
      showToast(t.missingFields);
      return;
    }
    setSending(true);
    const res = await submitMnytIdea({ title, category, hook });
    setSending(false);
    if (res.ok) {
      onClose();
      showToast(t.success);
      router.refresh();
    } else {
      showToast(res.error || t.genericError);
    }
  };

  return (
    <div className="mnyt-modal-backdrop" role="dialog" aria-modal="true">
      <div className="mnyt-submit-card">
        <h2 className="mnyt-submit-title">{t.title}</h2>
        <p className="mnyt-submit-body">{t.body}</p>
        <div className="mnyt-submit-fields">
          <input
            aria-label={t.titlePh}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.titlePh}
            className="mnyt-submit-input"
          />
          <select aria-label={t.categoryAria} value={category} onChange={(e) => setCategory(e.target.value)} className="mnyt-submit-select">
            {categories.map((c) => (
              <option key={c.key} value={isVi ? c.name : c.nameEn || c.name}>
                {isVi ? c.name : c.nameEn || c.name}
              </option>
            ))}
          </select>
          <textarea
            aria-label={t.hookPh}
            value={hook}
            onChange={(e) => setHook(e.target.value)}
            placeholder={t.hookPh}
            rows={3}
            className="mnyt-submit-textarea"
          />
        </div>
        <div className="mnyt-submit-actions">
          <button type="button" onClick={onClose} className="mnyt-submit-cancel-btn" disabled={sending}>
            {t.cancel}
          </button>
          <button type="button" onClick={handleSubmit} className="mnyt-submit-send-btn" disabled={sending}>
            {sending ? t.sending : t.send}
          </button>
        </div>
      </div>
    </div>
  );
}
