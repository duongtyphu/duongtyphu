"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LivingCore } from "@/components/LivingCore";
import { OriginLineWhisper } from "@/components/portal/companion/OriginLineWhisper";
import { PortalBackLink } from "@/components/portal/ui/PortalBackLink";
import { getRandomThoughtSeed } from "@/data/portal/thought-seeds";
import { getGardenSummary, getRecentActivity, type ActivityEntry } from "@/lib/portal/foundation/growth-view";
import { todaysMirrorQuestion } from "@/lib/portal/growth-map/mirror-question";
import type { MirrorNarrativeLine } from "@/lib/portal/growth-map/mirror-narrative";
import type { ReflectionMoment } from "@/lib/portal/growth-map/growth-reflection-engine";
import type { FirstFootprintMirrorView } from "@/lib/portal/growth-map/first-footprint-mirror";
import { useCollection } from "@/lib/admin/store";
import { useEditMode } from "./EditModeContext";
import { EditableRegion } from "./EditableRegion";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * JOURNEY PLATFORM — Phase P4: Mirror, "Reflection Chamber".
 *
 * KHÔNG phải analytics/đánh giá AI/phân tích tính cách/dashboard/báo cáo.
 * Trả lời đúng một câu hỏi: "Tôi đang bắt đầu nhận ra điều gì về chính
 * mình?" — bằng ba nhịp: NHÌN LẠI (sự thật thuần tuý, không diễn giải) →
 * NHẬN RA (mẫu hình từ bằng chứng thật — engine growth-map có sẵn) →
 * TỰ HỎI (đúng MỘT câu hỏi, không câu trả lời). Companion gần như vô hình:
 * tối đa một lời mở, một câu hỏi khép — không phán xét, không dán nhãn,
 * không chẩn đoán, không tán dương.
 *
 * Thay thế hoàn toàn mô hình "ceremony 3 bước bấm Tiếp tục" cũ
 * (MirrorCeremony) bằng một dòng cuộn liên tục, khoảng trắng rộng, nhịp
 * đọc chậm — đúng tinh thần "large empty space, silence is part of the
 * design" thay vì một wizard.
 */

/** Việc 9 — static chrome đã tách khỏi hardcode, đọc live từ bảng
 * `mirror_chrome` (1 dòng, id='mirror'). Nhóm 3 (Live-edit): thêm
 * `id`/`status` để khớp đúng shape RAW `useCollection()` fetch thật khi
 * `enabled:true` (xem live-mirror.ts). */
export type MirrorChrome = {
  id: string;
  title: string;
  emptyStateLine1: string;
  emptyStateLine2: string;
  emptyStateCtaLabel: string;
  footer: string;
  status: string;
};

export type MirrorQuestionRow = {
  id: string;
  content: string;
  status: string;
};

const CHROME_TITLE_FIELDS: FieldConfig[] = [{ key: "title", label: "Tiêu đề (Mirror)", type: "text", required: true }];

const CHROME_EMPTY_STATE_FIELDS: FieldConfig[] = [
  { key: "emptyStateLine1", label: "Trạng thái trống — dòng 1", type: "textarea", full: true, required: true },
  { key: "emptyStateLine2", label: "Trạng thái trống — dòng 2", type: "textarea", full: true, required: true },
  { key: "emptyStateCtaLabel", label: "Nhãn nút CTA (trạng thái trống)", type: "text", required: true },
];

const CHROME_FOOTER_FIELDS: FieldConfig[] = [
  { key: "footer", label: "Chân trang", type: "textarea", full: true, required: true },
  { key: "status", label: "Trạng thái xuất bản", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

const QUESTION_FIELDS: FieldConfig[] = [
  { key: "content", label: "Câu hỏi", type: "textarea", full: true, required: true },
  { key: "status", label: "Trạng thái xuất bản", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export function MirrorChamber({
  invitation,
  narrativeLines,
  reflectionMoments,
  firstFootprint,
  quietSeasonLine,
  originLine,
  reflectionCount,
  capsuleCount,
  premiumCount,
  seedChrome,
  seedQuestions,
  backHref = "/portal/hanhtrinhcuatoi",
  academyHref = "/portal/hocvienai",
  storyHref = "/portal/story",
  onOpenStory,
  storyInviteLabel = "Viết câu trả lời trong My Story",
}: {
  invitation: string | null;
  narrativeLines: MirrorNarrativeLine[];
  reflectionMoments: ReflectionMoment[];
  firstFootprint: FirstFootprintMirrorView | null;
  quietSeasonLine: string | null;
  originLine: string | null;
  reflectionCount: number;
  capsuleCount: number;
  premiumCount: number;
  seedChrome: MirrorChrome;
  seedQuestions: MirrorQuestionRow[];
  /** Đích nút "← Hành trình của tôi" — `null` để ẩn hẳn (khi nhúng làm 1
      tab bên trong `/v2/hanh-trinh-cua-toi`). */
  backHref?: string | null;
  /** Đích CTA trạng thái trống ("Bắt đầu ở Học viện AI"). */
  academyHref?: string;
  /** Đích link "Viết câu trả lời trong My Story" — bỏ qua khi có
      `onOpenStory`. */
  storyHref?: string;
  /** Khi có — "Viết câu trả lời trong My Story" đổi từ `<Link>` điều
      hướng route sang `<button>` gọi callback này (dùng khi nhúng làm
      tab, chuyển sang tab My Story ngay tại chỗ thay vì rời trang). */
  onOpenStory?: () => void;
  /** Nội dung link cuối trang — mặc định giữ nguyên câu 1.0. Nhúng làm
      tab đổi câu mời (chuyển tab tại chỗ, không phải rời trang). */
  storyInviteLabel?: string;
}) {
  const editMode = useEditMode();
  const { items: chromeItems, update: updateChrome } = useCollection<MirrorChrome>("mirror-chrome", [seedChrome], {
    enabled: editMode,
  });
  const { items: questionItems, update: updateQuestion } = useCollection<MirrorQuestionRow>(
    "mirror-questions",
    seedQuestions,
    { enabled: editMode },
  );
  const chrome = chromeItems[0] ?? seedChrome;
  const publishedQuestions = questionItems.filter((q) => q.status === "Published").map((q) => q.content);

  const [clientFacts, setClientFacts] = useState<{ activity: ActivityEntry[]; outputCount: number } | null>(null);
  const [thoughtSeed, setThoughtSeed] = useState<string | null>(null);

  useEffect(() => {
    const summary = getGardenSummary();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- đọc localStorage chỉ có ở client sau mount
    setClientFacts({ activity: getRecentActivity(2), outputCount: summary.totalOutputs });
    setThoughtSeed(getRandomThoughtSeed());
  }, []);

  if (clientFacts === null) {
    return <div className="mirror-chamber-bg min-h-[70vh] rounded-3xl" aria-hidden />;
  }

  const hasReflectionMaterial =
    narrativeLines.length > 0 || reflectionMoments.length > 0 || !!firstFootprint || !!quietSeasonLine;
  const hasRealFacts =
    reflectionCount > 0 || capsuleCount > 0 || premiumCount > 0 || clientFacts.activity.length > 0 || clientFacts.outputCount > 0;
  const isFullyQuiet = !hasReflectionMaterial && !hasRealFacts;

  return (
    <div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">
      <div className="mirror-chamber-bg" aria-hidden />
      <div className="mirror-glass-veil" aria-hidden />
      <div
        className="mirror-ripple"
        style={{ width: 260, height: 260, left: "50%", top: "46%", marginLeft: -130, marginTop: -130 }}
        aria-hidden
      />
      <div
        className="mirror-ripple"
        style={{ width: 260, height: 260, left: "50%", top: "46%", marginLeft: -130, marginTop: -130, animationDelay: "4.5s" }}
        aria-hidden
      />
      <div className="mirror-particle" style={{ width: 2, height: 2, left: "22%", top: "30%", animationDelay: ".5s" }} aria-hidden />
      <div className="mirror-particle" style={{ width: 1.5, height: 1.5, left: "70%", top: "22%", animationDelay: "3s" }} aria-hidden />
      <div className="mirror-particle" style={{ width: 2, height: 2, left: "34%", top: "64%", animationDelay: "1.8s" }} aria-hidden />
      <div className="mirror-particle" style={{ width: 1.5, height: 1.5, left: "78%", top: "58%", animationDelay: "5s" }} aria-hidden />
      <div className="mirror-reflection-line" aria-hidden />

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
      {/* Content Gutter — giữ nguyên đúng khoảng cách trước đây, chỉ khí
       * quyển nền phía sau mới full-bleed. */}
      <div className="mx-auto max-w-xl px-5 py-14 sm:px-8 md:py-20">
        {backHref !== null && <PortalBackLink href={backHref} label="Hành trình của tôi" tone="dark" />}

        {/* Nhóm 3, Live-edit — panel LUÔN hiện khi editMode, không phụ
         * thuộc trạng thái động thật (isFullyQuiet chỉ đúng khi tài
         * khoản admin đang test tình cờ "trống" — không thể dùng làm
         * điều kiện duy nhất để chạm tới 3 field trạng thái trống, và
         * mirror_questions chỉ hiện ĐÚNG 1 câu xoay vòng mỗi ngày nên
         * cần 1 nơi luôn thấy đủ cả 7 câu để quản lý). Portal thật
         * (editMode=false) — khối này hoàn toàn không render, 0 ảnh
         * hưởng DOM. */}
        {editMode && (
          <section className="mt-8 space-y-3 rounded-2xl border border-dashed border-white/20 bg-white/5 p-5 text-left">
            <p className="text-xs font-bold uppercase tracking-wide text-white/50">Live-edit — Nội dung Mirror</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <EditableRegion record={chrome} fields={CHROME_TITLE_FIELDS} update={updateChrome}>
                <p className="text-sm text-white/70">Tiêu đề: {chrome.title}</p>
              </EditableRegion>
              <EditableRegion record={chrome} fields={CHROME_FOOTER_FIELDS} update={updateChrome}>
                <p className="text-sm text-white/70">Chân trang: {chrome.footer}</p>
              </EditableRegion>
              <EditableRegion record={chrome} fields={CHROME_EMPTY_STATE_FIELDS} update={updateChrome} className="sm:col-span-2">
                <p className="text-sm text-white/70">
                  Trạng thái trống: {chrome.emptyStateLine1} / {chrome.emptyStateLine2} / &ldquo;{chrome.emptyStateCtaLabel}&rdquo;
                </p>
              </EditableRegion>
            </div>
            <div>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-white/40">
                7 câu hỏi &quot;Tự hỏi&quot; (xoay vòng theo ngày)
              </p>
              <div className="mt-2 space-y-1.5">
                {questionItems.map((q) => (
                  <EditableRegion key={q.id} record={q} fields={QUESTION_FIELDS} update={updateQuestion}>
                    <p className="text-sm text-white/70">{q.content}</p>
                  </EditableRegion>
                ))}
              </div>
            </div>
          </section>
        )}

        <header className="mt-10 text-center">
          <LivingCore size={52} state="idle" intensity="low" showParticles={false} className="mx-auto" />
          <h1 className="mt-8 text-2xl font-semibold tracking-tight text-white/90 sm:text-3xl">{chrome.title}</h1>
          {invitation && (
            <p className="mx-auto mt-5 max-w-md text-base leading-loose text-white/60">{invitation}</p>
          )}
        </header>

        {isFullyQuiet ? (
          <div className="mt-24 text-center">
            <p className="mx-auto max-w-sm text-lg leading-loose text-white/70">
              {chrome.emptyStateLine1}
              <br />
              {chrome.emptyStateLine2}
            </p>
            {thoughtSeed && (
              <p className="mx-auto mt-8 max-w-xs text-sm italic leading-relaxed text-white/35">
                &ldquo;{thoughtSeed}&rdquo;
              </p>
            )}
            <OriginLineWhisper context="mirror_of_growth" line={originLine} />
            <Link
              href={academyHref}
              className="mt-12 inline-flex items-center gap-1.5 text-sm font-medium text-violet-200/70 underline decoration-violet-200/25 underline-offset-4 transition hover:text-violet-100"
            >
              {chrome.emptyStateCtaLabel} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <>
            {/* ── 1. NHÌN LẠI — sự thật thuần tuý, không diễn giải ────────── */}
            {hasRealFacts && (
              <section className="mt-24">
                <p className="text-center text-[11px] font-medium uppercase tracking-[0.35em] text-white/30">
                  Nhìn lại
                </p>
                <div className="mx-auto mt-6 max-w-sm space-y-3 text-center">
                  {reflectionCount > 0 && (
                    <p className="text-sm leading-loose text-white/55">
                      Bạn đã viết {reflectionCount} suy ngẫm.
                    </p>
                  )}
                  {capsuleCount > 0 && (
                    <p className="text-sm leading-loose text-white/55">
                      Bạn đã giữ lại {capsuleCount} ký ức.
                    </p>
                  )}
                  {clientFacts.outputCount > 0 && (
                    <p className="text-sm leading-loose text-white/55">
                      Bạn đã tạo ra {clientFacts.outputCount} kết quả thật trong Workspace.
                    </p>
                  )}
                  {premiumCount > 0 && (
                    <p className="text-sm leading-loose text-white/55">
                      Bạn đang đồng hành cùng {premiumCount} chương trình Premium.
                    </p>
                  )}
                  {clientFacts.activity[0] && (
                    <p className="text-sm leading-loose text-white/55">
                      Gần đây nhất: {clientFacts.activity[0].label.toLowerCase()}.
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* ── 2. NHẬN RA — mẫu hình từ bằng chứng thật ────────────────── */}
            {hasReflectionMaterial && (
              <section className="mt-24">
                <p className="text-center text-[11px] font-medium uppercase tracking-[0.35em] text-white/30">
                  Nhận ra
                </p>
                <div className="mx-auto mt-6 max-w-md space-y-6 text-center">
                  {firstFootprint && (
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">
                        {firstFootprint.companionLine}
                      </p>
                      {firstFootprint.footprint && (
                        <p className="mt-2 text-base leading-loose text-white/70">
                          &ldquo;{firstFootprint.footprint}&rdquo;
                        </p>
                      )}
                    </div>
                  )}
                  {narrativeLines.map((line) => (
                    <p key={line.id} className="text-base leading-loose text-white/70">
                      {line.line}
                    </p>
                  ))}
                  {reflectionMoments.map((moment) => (
                    <p key={moment.id} className="text-base leading-loose text-white/70">
                      {moment.line}
                    </p>
                  ))}
                  {quietSeasonLine && (
                    <p className="text-base italic leading-loose text-white/50">{quietSeasonLine}</p>
                  )}
                </div>
              </section>
            )}

            {/* ── 3. TỰ HỎI — đúng một câu hỏi, không câu trả lời ─────────── */}
            <section className="mt-24 text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/30">Tự hỏi</p>
              <p className="mx-auto mt-6 max-w-sm text-lg italic leading-loose text-white/80">
                {todaysMirrorQuestion(publishedQuestions)}
              </p>
              {onOpenStory ? (
                <button
                  type="button"
                  onClick={onOpenStory}
                  className="mt-8 inline-flex items-center gap-1.5 text-xs font-medium text-violet-200/50 underline decoration-violet-200/20 underline-offset-4 transition hover:text-violet-200/80"
                >
                  {storyInviteLabel} <ArrowRight className="h-3 w-3" />
                </button>
              ) : (
                <Link
                  href={storyHref}
                  className="mt-8 inline-flex items-center gap-1.5 text-xs font-medium text-violet-200/50 underline decoration-violet-200/20 underline-offset-4 transition hover:text-violet-200/80"
                >
                  Viết câu trả lời trong My Story <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </section>
          </>
        )}

        <p className="mx-auto mt-28 max-w-xs text-center text-[11px] leading-relaxed text-white/20">
          {chrome.footer}
        </p>
      </div>
      </div>
    </div>
  );
}
