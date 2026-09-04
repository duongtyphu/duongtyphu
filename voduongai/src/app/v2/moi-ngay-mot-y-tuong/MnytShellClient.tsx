"use client";

/* =============================================================================
 * Shell "Mỗi ngày một ý tưởng" — Giai đoạn 5 (App shell), REWORK theo chỉ
 * đạo Founder (đợt tích hợp Portal 2.0): "Chỉ đưa vào trang giữa, còn Menu
 * và thanh header (tìm kiếm và cụm avata) vẫn giữ nguyên như các trang
 * khác trong portal 2.0."
 *
 * Trước đây trang này thay hẳn `PortalV2Shell` bằng header + bottom-nav TỰ
 * DỰNG riêng (mockup gốc có ngôn ngữ thị giác hoàn toàn khác — nền tối,
 * header ngang, bottom nav mobile). Giờ bọc THÊM `PortalV2Shell` (sidebar +
 * topbar CHUẨN dùng chung ~46 trang khác) BÊN NGOÀI `MnytHeader` — CSS mới
 * (`.mnyt .app/.sidebar/.topbar/...`, xem `moi-ngay-mot-y-tuong.css`) đảm
 * bảo sidebar/topbar hiện đúng màu SÁNG chuẩn dù nằm trong `.mnyt` (chỉ
 * đúng vùng nội dung — `.mnyt-shell` bên trong `.main-col` — mới mang nền
 * tối riêng của tính năng). `MnytHeader` (nav 10 view/streak/XP/badge/
 * toggle âm thanh-nhắc nhở-ngôn ngữ/nút "Gửi ý tưởng của bạn") GIỮ NGUYÊN
 * 100% — đây là điều hướng/chức năng RIÊNG của tính năng, không trùng với
 * Menu/topbar chuẩn (không có mục "Kho ý tưởng"/"Từ điển"/streak nào trong
 * sidebar/topbar chuẩn) nên không phải xoá/bịa thêm gì.
 *
 * `MnytBottomNav` (bottom-nav mobile riêng, đã xoá — xem lịch sử git) —
 * dư thừa sau khi có sidebar chuẩn (không trang `/v2/*` nào khác có bottom
 * nav mobile riêng lẫn với Menu chính).
 *
 * Quản lý `prefs` (lang/sound/calmMode/reminderOn) — đọc từ
 * `MnytStateBundle` (server, `getMnytStateBundle()`), lưu optimistic vào
 * state cục bộ + đồng bộ lên server qua `updateMnytPrefs()` (Server Action,
 * Giai đoạn 4), đồng thời cache vào `localStorage` (`mnyt_prefs_v1`, đúng
 * namespace README yêu cầu) làm lớp offline. `calmMode` còn hợp nhất với
 * `prefers-reduced-motion` của hệ điều hành (README: "Wire this to
 * prefers-reduced-motion in production").
 *
 * Streak/XP/badge/freeze hiển thị ở header đọc thẳng từ `initialState`
 * (server, luôn mới nhất mỗi lần điều hướng vì `page.tsx` mỗi route con
 * đều gọi lại `getMnytStateBundle()`) — không cần đồng bộ realtime ở tầng
 * shell, các Server Action ghi (Giai đoạn 4) tự làm mới qua điều hướng.
 * ========================================================================== */

import { useCallback, useEffect, useMemo, useState } from "react";

import type { MnytCategory } from "@/lib/portal/live-mnyt";
import type { MnytStateBundle } from "@/lib/portal/mnyt-sync";
import { updateMnytPrefs } from "@/lib/portal/mnyt-sync";
import type { PremiumStatus } from "@/lib/v2/premium-access";

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import { MnytHeader } from "@/components/v2/mnyt/MnytHeader";
import { MnytSoundProvider } from "@/components/v2/mnyt/MnytSoundContext";
import { MnytToastProvider, useMnytToast } from "@/components/v2/mnyt/MnytToastContext";
import { MnytTourModal } from "@/components/v2/mnyt/MnytTourModal";
import { MnytSubmitIdeaModal } from "@/components/v2/mnyt/MnytSubmitIdeaModal";

import "./moi-ngay-mot-y-tuong.css";

const PREFS_CACHE_KEY = "mnyt_prefs_v1";

function readCachedPrefs(): Partial<MnytStateBundle["prefs"]> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PREFS_CACHE_KEY);
    return raw ? (JSON.parse(raw) as Partial<MnytStateBundle["prefs"]>) : null;
  } catch {
    return null;
  }
}

function writeCachedPrefs(prefs: MnytStateBundle["prefs"]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFS_CACHE_KEY, JSON.stringify(prefs));
  } catch {
    // localStorage có thể bị chặn (chế độ ẩn danh/hết dung lượng) — bỏ qua,
    // server vẫn là nguồn sự thật.
  }
}

/**
 * `MnytShellClient` — thin wrapper cấp `MnytToastProvider` (toast dùng
 * chung); logic thật ở `MnytShellInner` (bên trong Provider, để gọi được
 * `useMnytToast()`).
 */
export function MnytShellClient({
  initialState,
  categories,
  premium,
  children,
}: {
  initialState: MnytStateBundle;
  categories: MnytCategory[];
  premium: PremiumStatus;
  children: React.ReactNode;
}) {
  return (
    <MnytToastProvider>
      <MnytShellInner initialState={initialState} categories={categories} premium={premium}>
        {children}
      </MnytShellInner>
    </MnytToastProvider>
  );
}

function MnytShellInner({
  initialState,
  categories,
  premium,
  children,
}: {
  initialState: MnytStateBundle;
  categories: MnytCategory[];
  premium: PremiumStatus;
  children: React.ReactNode;
}) {
  const [prefs, setPrefs] = useState<MnytStateBundle["prefs"]>(() => ({
    ...initialState.prefs,
    ...(readCachedPrefs() ?? {}),
  }));
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const showToast = useMnytToast();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const persistPrefs = useCallback((next: MnytStateBundle["prefs"]) => {
    setPrefs(next);
    writeCachedPrefs(next);
    void updateMnytPrefs(next);
  }, []);

  const onToggleSound = useCallback(() => {
    persistPrefs({ ...prefs, soundOn: !prefs.soundOn });
  }, [prefs, persistPrefs]);

  const onToggleReminder = useCallback(() => {
    const next = !prefs.reminderOn;
    persistPrefs({ ...prefs, reminderOn: next });
    showToast(
      next
        ? prefs.lang === "en"
          ? "Daily reminder enabled."
          : "Đã bật nhắc nhở mỗi ngày."
        : prefs.lang === "en"
          ? "Daily reminder turned off."
          : "Đã tắt nhắc nhở mỗi ngày.",
    );
  }, [prefs, persistPrefs, showToast]);

  const onToggleLang = useCallback(() => {
    persistPrefs({ ...prefs, lang: prefs.lang === "vi" ? "en" : "vi" });
  }, [prefs, persistPrefs]);

  const onOpenSubmit = useCallback(() => setShowSubmit(true), []);
  const onCloseSubmit = useCallback(() => setShowSubmit(false), []);

  const dismissTour = useCallback(() => {
    setTourStep(0);
    persistPrefs({ ...prefs, tourSeen: true });
  }, [prefs, persistPrefs]);

  const onNextTourStep = useCallback(() => {
    if (tourStep >= 3) {
      dismissTour();
      return;
    }
    setTourStep((s) => s + 1);
  }, [tourStep, dismissTour]);

  const calmMode = prefs.calmMode || systemReducedMotion;
  const rootClassName = useMemo(() => `mnyt${calmMode ? " calm-mode" : ""}`, [calmMode]);

  return (
    <div className={rootClassName} lang={prefs.lang}>
      <div className="app">
        <PortalV2Shell
          premium={premium}
          activeHtmlFile="Moi ngay mot y tuong.html"
          searchPlaceholder="Tìm kiếm ý tưởng, lĩnh vực, thuật ngữ..."
          promoText="Mở khoá toàn bộ 446 ý tưởng AI và lộ trình cá nhân hoá mỗi ngày."
        >
          <div className="mnyt-shell">
            <MnytHeader
              streak={initialState.streak}
              freezeCount={initialState.freezeCount}
              xp={initialState.xp}
              badgeCount={initialState.badges.length}
              soundOn={prefs.soundOn}
              reminderOn={prefs.reminderOn}
              lang={prefs.lang}
              onToggleSound={onToggleSound}
              onToggleReminder={onToggleReminder}
              onToggleLang={onToggleLang}
              onOpenSubmit={onOpenSubmit}
            />
            <MnytSoundProvider soundOn={prefs.soundOn}>{children}</MnytSoundProvider>
          </div>
        </PortalV2Shell>
      </div>
      {!prefs.tourSeen && <MnytTourModal lang={prefs.lang} step={tourStep} onNext={onNextTourStep} onSkip={dismissTour} />}
      {showSubmit && <MnytSubmitIdeaModal lang={prefs.lang} categories={categories} onClose={onCloseSubmit} />}
    </div>
  );
}
