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
}) {
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
      <div className="mirror-reflection-line" aria-hidden />

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
      {/* Content Gutter — giữ nguyên đúng khoảng cách trước đây, chỉ khí
       * quyển nền phía sau mới full-bleed. */}
      <div className="mx-auto max-w-xl px-5 py-14 sm:px-8 md:py-20">
        <PortalBackLink href="/portal/hanhtrinhcuatoi" label="Hành trình của tôi" tone="dark" />

        <header className="mt-10 text-center">
          <LivingCore size={52} state="idle" intensity="low" showParticles={false} className="mx-auto" />
          <h1 className="mt-8 text-2xl font-semibold tracking-tight text-white/90 sm:text-3xl">Mirror</h1>
          {invitation && (
            <p className="mx-auto mt-5 max-w-md text-base leading-loose text-white/60">{invitation}</p>
          )}
        </header>

        {isFullyQuiet ? (
          <div className="mt-24 text-center">
            <p className="mx-auto max-w-sm text-lg leading-loose text-white/70">
              Hôm nay chiếc gương vẫn còn rất yên tĩnh.
              <br />
              Nó sẽ phản chiếu những điều bạn thật sự sống.
            </p>
            {thoughtSeed && (
              <p className="mx-auto mt-8 max-w-xs text-sm italic leading-relaxed text-white/35">
                &ldquo;{thoughtSeed}&rdquo;
              </p>
            )}
            <OriginLineWhisper context="mirror_of_growth" line={originLine} />
            <Link
              href="/portal/hocvienai"
              className="mt-12 inline-flex items-center gap-1.5 text-sm font-medium text-violet-200/70 underline decoration-violet-200/25 underline-offset-4 transition hover:text-violet-100"
            >
              Bắt đầu để lại dấu chân đầu tiên <ArrowRight className="h-3.5 w-3.5" />
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
                {todaysMirrorQuestion()}
              </p>
              <Link
                href="/portal/story"
                className="mt-8 inline-flex items-center gap-1.5 text-xs font-medium text-violet-200/50 underline decoration-violet-200/20 underline-offset-4 transition hover:text-violet-200/80"
              >
                Viết câu trả lời trong My Story <ArrowRight className="h-3 w-3" />
              </Link>
            </section>
          </>
        )}

        <p className="mx-auto mt-28 max-w-xs text-center text-[11px] leading-relaxed text-white/20">
          Mirror không chấm điểm, không so sánh — chỉ phản chiếu đúng những gì bạn thật sự sống.
        </p>
      </div>
      </div>
    </div>
  );
}
