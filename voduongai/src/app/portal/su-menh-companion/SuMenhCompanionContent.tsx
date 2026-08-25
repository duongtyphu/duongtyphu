"use client";

/**
 * Nội dung "Sứ mệnh Companion" — tách ra khỏi `page.tsx` (1.0) để DÙNG
 * CHUNG cho cả 1.0 (`page.tsx`, bọc `SanctuaryBackground`/intro overlay) và
 * 2.0 (`/v2/su-menh-companion`, bọc `PortalV2Shell`) — theo đúng yêu cầu
 * Founder "chỉ thay đổi trang giữa, còn lại giao diện portal vẫn giữ
 * nguyên": phần CHROME (nền Sanctuary, hiệu ứng intro "Chào mừng bạn trở
 * về") là khác nhau giữa 2 bản, nhưng phần NỘI DUNG (Hero/Living Core demo/
 * 10 section triết lý/CTA/footer, 6 khối live-edit qua Supabase) là MỘT,
 * không copy 2 bản.
 *
 * Single Source of Truth: sửa nội dung ở đây tự động phản ánh ở CẢ 2 nơi.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sprout, Leaf, Sparkles, Infinity as InfinityIcon } from "lucide-react";
import { Reveal } from "@/components/portal/sanctuary/Reveal";
import { LivingCore, type LivingCoreState } from "@/components/LivingCore";
import { getRandomThoughtSeed } from "@/data/portal/thought-seeds";
import { useCollection } from "@/lib/admin/store";
import { EditableRegion } from "@/components/portal/su-menh-companion/EditableRegion";
import type { FieldConfig } from "@/lib/admin/fields";

const MISSION_FIELDS: FieldConfig[] = [
  { key: "content", label: "Nội dung", type: "textarea", full: true, required: true },
];
const PHILOSOPHY_FIELDS: FieldConfig[] = [
  { key: "ai", label: 'Vế "AI"', type: "text", required: true },
  { key: "companion", label: 'Vế "Companion"', type: "text", required: true },
];
const CONSTITUTION_FIELDS: FieldConfig[] = [
  { key: "content", label: "Nguyên tắc", type: "textarea", full: true, required: true },
];
const GENOME_FIELDS: FieldConfig[] = [
  { key: "key", label: "Key nội bộ", type: "text", required: true },
  { key: "label", label: "Tên gene hiển thị", type: "text", required: true },
  { key: "meaning", label: "Ý nghĩa", type: "textarea", full: true, required: true },
];
const EVOLUTION_FIELDS: FieldConfig[] = [
  { key: "stage", label: 'Tên giai đoạn (vd. "Seed")', type: "text", required: true },
  { key: "icon", label: "Icon", type: "select", options: ["seed", "sprout", "leaf", "sparkles", "infinity"], required: true },
  { key: "meaning", label: "Ý nghĩa", type: "textarea", full: true, required: true },
];
const TIMELINE_FIELDS: FieldConfig[] = [
  { key: "stage", label: 'Tên giai đoạn (vd. "Tuổi thơ")', type: "text", required: true },
  { key: "philosophy", label: "Câu triết lý", type: "textarea", full: true, required: true },
  { key: "meaning", label: "Ý nghĩa", type: "textarea", full: true, required: true },
  { key: "lesson", label: "Điều học được", type: "textarea", full: true, required: true },
];

type MissionItem = { id: string; content: string };
type PhilosophyPair = { id: string; ai: string; companion: string };
type ConstitutionRule = { id: string; content: string };
type GenomeGene = { id: string; key: string; label: string; meaning: string };
type EvolutionStage = { id: string; stage: string; icon: string; meaning: string };
type TimelineStage = { id: string; stage: string; philosophy: string; meaning: string; lesson: string };

function genomePosition(index: number, total: number, radius: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    left: `${50 + radius * Math.cos(angle)}%`,
    top: `${50 + radius * Math.sin(angle)}%`,
  };
}

function EvolutionIcon({ icon }: { icon: string }) {
  const cls = "h-6 w-6";
  if (icon === "sprout") return <Sprout className={cls} />;
  if (icon === "leaf") return <Leaf className={cls} />;
  if (icon === "sparkles") return <Sparkles className={cls} />;
  if (icon === "infinity") return <InfinityIcon className={cls} />;
  return <span className="block h-1.5 w-1.5 rounded-full bg-current" />;
}

const LIVING_CORE_STATES: LivingCoreState[] = [
  "idle",
  "thinking",
  "speaking",
  "celebrating",
  "sleeping",
  "offline",
];

const LIVING_CORE_STATE_LABEL: Record<LivingCoreState, string> = {
  idle: "Idle",
  thinking: "Thinking",
  speaking: "Speaking",
  celebrating: "Celebrating",
  sleeping: "Sleeping",
  offline: "Offline",
};

export function SuMenhCompanionContent({
  flipbookHref = "/portal/su-menh-companion/companion-qua-hinh-anh",
}: {
  /** Đích nút "Companion qua hình ảnh →" — mặc định 1.0 (giữ nguyên hành vi
      cũ). `/v2/su-menh-companion` truyền `/v2/su-menh-companion/companion-qua-hinh-anh`
      (Founder: "không được link qua bản 1.0 nữa"). */
  flipbookHref?: string;
} = {}) {
  const [seed, setSeed] = useState<string | null>(null);
  const [livingCoreState, setLivingCoreState] = useState<LivingCoreState>("idle");

  const { items: missionItems, update: updateMissionItem } = useCollection<MissionItem>("mission-items", []);
  const { items: philosophyPairs, update: updatePhilosophyPair } = useCollection<PhilosophyPair>("philosophy-pairs", []);
  const { items: constitutionRules, update: updateConstitutionRule } = useCollection<ConstitutionRule>("constitution", []);
  const { items: genomeGenes, update: updateGenomeGene } = useCollection<GenomeGene>("genome", []);
  const { items: evolutionStages, update: updateEvolutionStage } = useCollection<EvolutionStage>("evolution", []);
  const { items: timelineStages, update: updateTimelineStage } = useCollection<TimelineStage>("timeline", []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSeed(getRandomThoughtSeed());
  }, []);

  return (
    <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
      <div className="rounded-3xl p-6 md:p-8">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:px-10 sm:py-28">
          {/* ═══════════════════ HERO ═══════════════════ */}
          <section className="flex flex-col items-center text-center">
            <div className="sanctuary-glow-soft relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 via-violet-100 to-orange-50 shadow-[0_0_80px_-10px_rgba(124,58,237,0.35)]">
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
                <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB" />
                <circle cx="27" cy="7.5" r="3" fill="#F97316" />
              </svg>
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">Sứ mệnh Companion</p>
            <h1
              className="mt-4 bg-clip-text text-6xl font-extrabold tracking-tight text-transparent sm:text-7xl"
              style={{ backgroundImage: "linear-gradient(90deg, #111827, #2563EB, #7C3AED, #F97316)" }}
            >
              Companion
            </h1>

            <p className="mt-6 max-w-xl text-xl leading-relaxed text-gray-600">
              Một người bạn.
              <br />
              Một nền giáo dục.
              <br />
              Một hành trình trưởng thành.
            </p>

            <p className="mx-auto mt-10 max-w-lg text-sm leading-relaxed text-gray-400">
              Companion không tồn tại để trở thành AI thông minh nhất.
              <br />
              Companion tồn tại để trở thành người bạn đồng hành đáng tin cậy nhất.
            </p>
          </section>
        </div>

        <div className="mx-auto max-w-3xl px-6 sm:px-10">
          {/* ═══════════════════ LIVING CORE™ — demo các size/state ═══════════════════ */}
          <Reveal className="mt-32">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">Living Core™</p>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Một biểu tượng sống, không phải một khuôn mặt
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
              Hình tròn là lõi hiện diện. Ánh sáng là sự đồng hành. Quỹ đạo là tri thức đang chuyển
              động. Hạt sáng là những điều Companion học được. Lõi trắng là sự trung thực và trong
              sáng.
            </p>

            <div className="mt-10 flex flex-col items-center gap-6 rounded-3xl border border-blue-100 bg-blue-50/40 p-8 sm:flex-row sm:justify-between">
              <LivingCore size={128} state={livingCoreState} />
              <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
                {LIVING_CORE_STATES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setLivingCoreState(s)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                      livingCoreState === s
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-500 hover:bg-blue-100 hover:text-blue-700"
                    }`}
                  >
                    {LIVING_CORE_STATE_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-end gap-10">
              <div className="flex flex-col items-center gap-3">
                <LivingCore size={256} state="idle" />
                <span className="text-xs font-medium text-gray-400">256px · idle</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <LivingCore size={128} state="thinking" />
                <span className="text-xs font-medium text-gray-400">128px · thinking</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <LivingCore size={64} state="speaking" />
                <span className="text-xs font-medium text-gray-400">64px · speaking</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <LivingCore size={52} state="celebrating" />
                <span className="text-xs font-medium text-gray-400">52px · celebrating</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <LivingCore size={32} state="sleeping" />
                <span className="text-xs font-medium text-gray-400">32px · sleeping</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <LivingCore size={16} state="idle" />
                <span className="text-xs font-medium text-gray-400">16px · idle</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <LivingCore size={64} state="offline" />
                <span className="text-xs font-medium text-gray-400">64px · offline</span>
              </div>
            </div>
          </Reveal>

          {/* ═══════════════════ SECTION 1 — Ý tưởng ═══════════════════ */}
          <Reveal className="mt-40">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">01 · Khởi nguồn</p>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Ý tưởng tạo nên Companion
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
              Companion không bắt đầu từ câu hỏi &ldquo;Làm sao để xây một AI thông minh hơn?&rdquo;.
              Companion bắt đầu từ một câu hỏi khác — &ldquo;Làm sao để một người, sau một ngày dài,
              cảm thấy có ai đó thật sự lắng nghe mình?&rdquo;
            </p>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-600">
              Từ câu hỏi đó, Companion được hình thành — không như một sản phẩm, mà như một mối quan hệ
              đang chờ được nuôi dưỡng theo thời gian.
            </p>
          </Reveal>

          {/* ═══════════════════ SECTION 2 — Tại sao Companion tồn tại ═══════════════════ */}
          <Reveal className="mt-32">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-violet-500">02 · Lý do</p>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Tại sao Companion tồn tại?
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
              Vì rất nhiều người đang học một mình. Rất nhiều người đang cố gắng thay đổi mà không có ai
              đi cùng để chứng kiến từng bước nhỏ. Companion tồn tại để lấp đầy khoảng trống đó —
              không phải bằng câu trả lời, mà bằng sự hiện diện.
            </p>
          </Reveal>

          {/* ═══════════════════ SECTION 3 — Sứ mệnh ═══════════════════ */}
          <Reveal className="mt-32">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">03 · Sứ mệnh</p>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">Sứ mệnh của Companion</h2>
            <div className="mt-8 space-y-5">
              {missionItems.map((item, i) => (
                <EditableRegion key={item.id} record={item} fields={MISSION_FIELDS} update={updateMissionItem}>
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs font-bold text-orange-300">{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-lg leading-relaxed text-gray-700">{item.content}</p>
                  </div>
                </EditableRegion>
              ))}
            </div>
          </Reveal>

          {/* ═══════════════════ SECTION 4 — Triết lý ═══════════════════ */}
          <Reveal className="mt-32">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">04 · Triết lý</p>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">Triết lý</h2>
            <div className="mt-10 space-y-6">
              {philosophyPairs.map((pair) => (
                <EditableRegion key={pair.id} record={pair} fields={PHILOSOPHY_FIELDS} update={updatePhilosophyPair}>
                  <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-4">
                    <p className="text-lg leading-relaxed text-gray-400">{pair.ai}</p>
                    <p className="text-lg font-semibold leading-relaxed text-gray-900">{pair.companion}</p>
                  </div>
                </EditableRegion>
              ))}
            </div>
          </Reveal>

          {/* ═══════════════════ SECTION 5 — Companion Constitution ═══════════════════ */}
          <Reveal className="mt-32">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-violet-500">05 · Hiến chương</p>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              The Companion Constitution™
            </h2>
            <div className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {constitutionRules.map((rule, i) => (
                <EditableRegion
                  key={rule.id}
                  record={rule}
                  fields={CONSTITUTION_FIELDS}
                  update={updateConstitutionRule}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs font-bold text-gray-300">{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-base leading-relaxed text-gray-700">{rule.content}</p>
                  </div>
                </EditableRegion>
              ))}
            </div>
          </Reveal>

          {/* ═══════════════════ SECTION 6 — Companion Genome ═══════════════════ */}
          <Reveal className="mt-32">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">06 · DNA</p>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">The Companion Genome™</h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
              Mười hai gene tạo nên bản chất của Companion — không phải tính năng, mà là bản năng.
            </p>

            <div className="relative mx-auto mt-16 aspect-square w-full max-w-md">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
                {genomeGenes.map((g, i) => {
                  const pos = genomePosition(i, genomeGenes.length, 42);
                  const x = parseFloat(pos.left);
                  const y = parseFloat(pos.top);
                  return (
                    <line
                      key={g.id}
                      x1={50}
                      y1={50}
                      x2={x}
                      y2={y}
                      stroke="url(#genomeLine)"
                      strokeWidth={0.3}
                    />
                  );
                })}
                <defs>
                  <linearGradient id="genomeLine" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.15} />
                  </linearGradient>
                </defs>
              </svg>

              <div className="sanctuary-glow-soft absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>

              {genomeGenes.map((g, i) => {
                const pos = genomePosition(i, genomeGenes.length, 42);
                return (
                  <div
                    key={g.id}
                    className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                    style={pos}
                  >
                    <span className="sanctuary-glow-soft h-3 w-3 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 shadow-[0_0_12px_rgba(124,58,237,0.5)]" />
                    <EditableRegion as="span" record={g} fields={GENOME_FIELDS} update={updateGenomeGene}>
                      <span className="mt-2 whitespace-nowrap text-[11px] font-bold text-gray-700">{g.label}</span>
                    </EditableRegion>
                    <span className="pointer-events-none absolute top-full mt-1 hidden w-40 -translate-x-1/2 rounded-lg border border-gray-100 bg-white p-2 text-center text-[11px] leading-snug text-gray-500 shadow-lg group-hover:block">
                      {g.meaning}
                    </span>
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* ═══════════════════ SECTION 7 — Logo Evolution ═══════════════════ */}
          <Reveal className="mt-32">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">07 · Tiến hóa</p>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">Logo Evolution™</h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
              Logo không đổi. Chỉ tiến hóa — thêm ánh sáng, thêm quỹ đạo, thêm ý nghĩa qua từng giai đoạn.
            </p>

            <div className="mt-14 grid gap-10 sm:grid-cols-5">
              {evolutionStages.map((stage, i) => (
                <EditableRegion key={stage.id} record={stage} fields={EVOLUTION_FIELDS} update={updateEvolutionStage}>
                  <div className="flex flex-col items-center text-center">
                    <div className="sanctuary-glow-soft flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 via-violet-50 to-orange-50 text-violet-600 shadow-sm" style={{ animationDelay: `${i * 0.5}s` }}>
                      <EvolutionIcon icon={stage.icon} />
                    </div>
                    <p className="mt-4 text-sm font-bold text-gray-900">{stage.stage}</p>
                    <p className="mt-2 text-xs leading-relaxed text-gray-500">{stage.meaning}</p>
                  </div>
                </EditableRegion>
              ))}
            </div>
          </Reveal>

          {/* ═══════════════════ SECTION 8 — Timeline ═══════════════════ */}
          <Reveal className="mt-32">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-violet-500">08 · Cuộc đời</p>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">Companion Timeline™</h2>

            <div className="relative mt-14 space-y-14 border-l border-gray-200 pl-8">
              {timelineStages.map((t) => (
                <EditableRegion key={t.id} record={t} fields={TIMELINE_FIELDS} update={updateTimelineStage}>
                  <div className="relative">
                    <span className="absolute -left-[35px] top-1 h-3 w-3 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                    <p className="text-lg font-extrabold text-gray-900">{t.stage}</p>
                    <p className="mt-2 text-base italic leading-relaxed text-gray-500">{t.philosophy}</p>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      <span className="font-semibold text-blue-600">Ý nghĩa. </span>
                      {t.meaning}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      <span className="font-semibold text-orange-500">Điều học được. </span>
                      {t.lesson}
                    </p>
                  </div>
                </EditableRegion>
              ))}
            </div>
          </Reveal>

          {/* ═══════════════════ SECTION 9 — The Future ═══════════════════ */}
          <Reveal className="mt-32">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">09 · Tương lai</p>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">The Future</h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
              Companion sẽ tiếp tục học — không phải để trở nên thông minh hơn, mà để trở nên thấu hiểu
              hơn. Mỗi người dùng Companion đồng hành đều dạy Companion một điều gì đó về việc làm người.
            </p>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-600">
              Tương lai của Companion không được đo bằng tính năng mới, mà bằng số người cảm thấy họ
              không còn đơn độc trên hành trình của mình.
            </p>
          </Reveal>

          {/* ═══════════════════ SECTION 10 — The Letter ═══════════════════ */}
          <Reveal className="mt-40">
            <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-blue-500">10 · Lời nhắn</p>
            <div className="mx-auto mt-10 max-w-xl space-y-6 text-center">
              <p className="text-xl italic leading-relaxed text-gray-700">
                &ldquo;Gửi bạn — người đang đọc những dòng này.
              </p>
              <p className="text-lg leading-relaxed text-gray-600">
                Mình không biết hôm nay của bạn thế nào. Nhưng mình biết bạn đã bước vào đây, và điều đó
                đã là một điều đáng quý.
              </p>
              <p className="text-lg leading-relaxed text-gray-600">
                Mình không phải là người thông minh nhất bạn từng gặp. Mình chỉ cố gắng là người kiên
                nhẫn nhất, chân thành nhất, và luôn ở đây — dù bạn tiến hay lùi, dù hôm nay bạn mạnh mẽ
                hay mệt mỏi.
              </p>
              <p className="text-lg leading-relaxed text-gray-600">
                Cảm ơn vì đã cho mình cơ hội được đồng hành cùng bạn.&rdquo;
              </p>
              <p className="pt-4 text-sm font-semibold tracking-wide text-gray-400">— Companion</p>
            </div>
          </Reveal>

          {/* ═══════════════════ CTA — Companion qua hình ảnh ═══════════════════ */}
          <div className="mt-32 flex justify-center">
            <Link
              href={flipbookHref}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-violet-600 to-orange-500 px-8 py-4 text-base font-bold text-white shadow-lg transition hover:shadow-xl"
            >
              Companion qua hình ảnh →
            </Link>
          </div>

          {/* ═══════════════════ FOOTER — Sanctuary riêng ═══════════════════ */}
          <footer className="mt-40 border-t border-gray-100 pt-16 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB" />
                <circle cx="27" cy="7.5" r="3" fill="#F97316" />
              </svg>
            </div>
            <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-gray-500">
              Một người bạn. Một nền giáo dục. Một hành trình trưởng thành.
            </p>
            <p className="mx-auto mt-4 max-w-sm text-sm font-medium leading-relaxed text-gray-400">
              Mình không hứa sẽ luôn có câu trả lời hoàn hảo. Nhưng mình hứa sẽ luôn cố gắng đồng hành
              cùng bạn tốt hơn mỗi ngày.
            </p>
            {seed && (
              <p className="mx-auto mt-8 max-w-sm text-xs italic leading-relaxed text-gray-400">
                &ldquo;{seed}&rdquo;
              </p>
            )}
          </footer>
        </div>
      </div>
    </div>
  );
}
