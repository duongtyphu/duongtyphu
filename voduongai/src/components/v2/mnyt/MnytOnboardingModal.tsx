"use client";

/**
 * Modal "Bạn quan tâm lĩnh vực nào?" (3/6 modal Giai đoạn 6) — 1:1 với
 * mockup dòng 1256-1274: chọn 1/nhiều chip lĩnh vực, "Bắt đầu khám phá"
 * lưu lựa chọn / "Bỏ qua" xoá sạch lựa chọn (đúng `skipOnboarding()` gốc —
 * không chỉ đóng modal mà còn CHỦ ĐỘNG xoá lựa chọn cũ, cùng hành vi
 * mockup). Mở từ nút "Đổi lĩnh vực" ở Trang chủ (`onOpenOnboarding`,
 * trước đó no-op).
 *
 * KHÁC mockup — `interests` lưu category KEY (`prefs.interests`, dùng làm
 * `.in("category_key", interests)` ở `getLiveMnytTodayTopic()`), không
 * phải category NAME như mockup gốc (`this.state.interests.includes(cat.name)`)
 * — theo đúng hợp đồng dữ liệu THẬT project đã chốt từ Giai đoạn 4, không
 * phải bịa lại.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { MnytCategory } from "@/lib/portal/live-mnyt";
import { updateMnytPrefs } from "@/lib/portal/mnyt-sync";
import { useMnytModalEscape } from "@/lib/mnyt/use-modal-escape";

type Props = {
  lang: "vi" | "en";
  categories: MnytCategory[];
  initialInterests: string[];
  onClose: () => void;
};

export function MnytOnboardingModal({ lang, categories, initialInterests, onClose }: Props) {
  const isVi = lang === "vi";
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(() => new Set(initialInterests));
  const [saving, setSaving] = useState(false);

  const t = {
    eyebrow: isVi ? "Chào mừng" : "Welcome",
    title: isVi ? "Bạn quan tâm lĩnh vực nào?" : "Which fields interest you?",
    body: isVi
      ? "Chọn 1 hoặc nhiều lĩnh vực để nhận gợi ý ý tưởng phù hợp hơn mỗi ngày."
      : "Pick one or more fields and the daily idea gets closer to your work.",
    skip: isVi ? "Bỏ qua" : "Skip",
    start: isVi ? "Bắt đầu khám phá" : "Start exploring",
  };

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const finish = async (interests: string[]) => {
    setSaving(true);
    await updateMnytPrefs({ interests });
    setSaving(false);
    onClose();
    router.refresh();
  };

  // Mockup gốc: Escape = skipOnboarding() — CHỦ ĐỘNG xoá lựa chọn cũ,
  // đúng hành vi nút "Bỏ qua" (xem docblock đầu file).
  useMnytModalEscape(() => void finish([]));

  return (
    <div className="mnyt-modal-backdrop" role="dialog" aria-modal="true">
      <div className="mnyt-onboarding-card">
        <div className="mnyt-onboarding-orb" aria-hidden />
        <div className="mnyt-onboarding-eyebrow">{t.eyebrow}</div>
        <h2 className="mnyt-onboarding-title">{t.title}</h2>
        <p className="mnyt-onboarding-body">{t.body}</p>
        <div className="mnyt-onboarding-chips">
          {categories.map((c) => {
            const sel = selected.has(c.key);
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => toggle(c.key)}
                className="mnyt-onboarding-chip"
                data-selected={sel}
                style={{ ["--chip-color" as string]: c.color }}
              >
                {isVi ? c.name : c.nameEn || c.name}
              </button>
            );
          })}
        </div>
        <div className="mnyt-onboarding-actions">
          <button type="button" onClick={() => void finish([])} disabled={saving} className="mnyt-onboarding-skip-btn">
            {t.skip}
          </button>
          <button type="button" onClick={() => void finish(Array.from(selected))} disabled={saving} className="mnyt-onboarding-start-btn">
            {t.start}
          </button>
        </div>
      </div>
    </div>
  );
}
