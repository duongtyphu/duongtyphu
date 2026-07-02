"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/portal/sanctuary/Reveal";
import { SanctuaryBackground } from "@/components/portal/sanctuary/SanctuaryBackground";
import { getRandomThoughtSeed } from "@/data/portal/thought-seeds";

const JOURNEY_STAGES = [
  "Mới bắt đầu",
  "Đang học",
  "Đang thực hành",
  "Đang trưởng thành",
  "Đang truyền lại",
] as const;

const CURRENT_STAGE_INDEX = 1;

const LEARNED_ITEMS = [
  "Bài đã đọc",
  "Tài liệu đã lưu",
  "Prompt đã áp dụng",
  "Kỹ năng đã thử",
] as const;

const PRACTICE_TRACKS = [
  { name: "AI Foundation", tone: "text-blue-600" },
  { name: "AI Office", tone: "text-violet-600" },
  { name: "AI Writing", tone: "text-orange-500" },
  { name: "AI Automation", tone: "text-blue-600" },
  { name: "AI Career", tone: "text-violet-600" },
] as const;

const REFLECTION_QUESTIONS = [
  "Tuần này bạn trưởng thành điều gì?",
  "Điều gì bạn muốn làm tốt hơn?",
  "Điều gì khiến bạn tự hào?",
  "Điều gì bạn muốn Companion đồng hành tiếp?",
] as const;

const LEGACY_SEEDS = [
  { name: "Seed of Learning", meaning: "Hạt giống của việc không ngừng tìm hiểu." },
  { name: "Seed of Patience", meaning: "Hạt giống của sự kiên nhẫn với chính mình." },
  { name: "Seed of Courage", meaning: "Hạt giống của việc dám bắt đầu dù chưa chắc chắn." },
  { name: "Seed of Responsibility", meaning: "Hạt giống của việc giữ lời hứa với chính mình." },
  { name: "Seed of Gratitude", meaning: "Hạt giống của việc biết ơn từng bước đã đi qua." },
] as const;

export default function MyJourneySanctuaryPage() {
  const [seed, setSeed] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSeed(getRandomThoughtSeed());
  }, []);

  return (
    <div className="relative -mx-4 -my-6 md:-mx-8 md:-my-8">
      <SanctuaryBackground variant="warm" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 sm:px-10 sm:py-28">
        {/* ═══════════════════ HERO ═══════════════════ */}
        <section className="flex flex-col items-center text-center">
          <h1
            className="bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl"
            style={{ backgroundImage: "linear-gradient(90deg, #111827, #2563EB, #F97316)" }}
          >
            Hành trình của tôi
          </h1>
          <p className="mx-auto mt-8 max-w-lg text-xl leading-relaxed text-gray-600">
            Mỗi bước nhỏ hôm nay đều góp phần tạo nên phiên bản tốt hơn của chính bạn.
          </p>
        </section>

        {/* ═══════════════════ Companion Reflection ═══════════════════ */}
        <Reveal className="mt-28">
          <div className="rounded-2xl border border-blue-100/70 bg-white/60 p-8 backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">Companion Reflection</p>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              Hôm nay mình muốn cùng bạn nhìn lại một chút: bạn đã học được gì, đang luyện điều gì, và
              bước tiếp theo nào có thể giúp bạn tiến thêm một bước.
            </p>
          </div>
        </Reveal>

        {/* ═══════════════════ Bạn đang ở đâu? ═══════════════════ */}
        <Reveal className="mt-28">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-violet-500">Điểm hiện tại</p>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">Bạn đang ở đâu?</h2>
          <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-4">
            {JOURNEY_STAGES.map((stage, i) => (
              <div key={stage} className="flex items-center gap-3">
                <span
                  className={
                    i === CURRENT_STAGE_INDEX
                      ? "rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm font-bold text-white shadow-sm"
                      : "rounded-full px-4 py-2 text-sm font-medium text-gray-400"
                  }
                >
                  {stage}
                </span>
                {i < JOURNEY_STAGES.length - 1 && <span className="text-gray-300">→</span>}
              </div>
            ))}
          </div>
        </Reveal>

        {/* ═══════════════════ Điều đã học ═══════════════════ */}
        <Reveal className="mt-28">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">Nhìn lại</p>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">Điều đã học</h2>
          <div className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {LEARNED_ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                <p className="text-base text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ═══════════════════ Điều đang luyện ═══════════════════ */}
        <Reveal className="mt-28">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">Hiện tại</p>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">Điều đang luyện</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {PRACTICE_TRACKS.map((track) => (
              <span
                key={track.name}
                className={`rounded-full border border-gray-200 bg-white/70 px-4 py-2 text-sm font-semibold ${track.tone}`}
              >
                {track.name}
              </span>
            ))}
          </div>
        </Reveal>

        {/* ═══════════════════ Companion gợi ý ═══════════════════ */}
        <Reveal className="mt-28">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-violet-500">Định hướng</p>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">Companion gợi ý</h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            Mình nghĩ bước tiếp theo phù hợp nhất với bạn là dành 10 phút hôm nay để thực hành một
            prompt bạn đã lưu — không cần nhiều, chỉ cần một điều cụ thể.
          </p>
        </Reveal>

        {/* ═══════════════════ Reflection ═══════════════════ */}
        <Reveal className="mt-28">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">Suy ngẫm</p>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">Reflection</h2>
          <div className="mt-8 space-y-5">
            {REFLECTION_QUESTIONS.map((q, i) => (
              <div key={q} className="flex items-baseline gap-4">
                <span className="text-xs font-bold text-gray-300">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-lg leading-relaxed text-gray-700">{q}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ═══════════════════ Legacy Seeds ═══════════════════ */}
        <Reveal className="mt-28">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">Di sản nhỏ</p>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">Legacy Seeds</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {LEGACY_SEEDS.map((s) => (
              <div key={s.name} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-orange-400" />
                <div>
                  <p className="text-base font-bold text-gray-900">{s.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">{s.meaning}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ═══════════════════ Bước tiếp theo ═══════════════════ */}
        <Reveal className="mt-32 text-center">
          <p className="text-xl font-semibold text-gray-900">Hôm nay, chỉ cần một bước nhỏ.</p>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-gray-500">
            Tiếp tục học · Đọc một tài liệu · Thực hành một prompt · Viết một reflection
          </p>
        </Reveal>

        {/* ═══════════════════ FOOTER — Sanctuary riêng ═══════════════════ */}
        <footer className="mt-32 border-t border-gray-100 pt-16 text-center">
          <p className="text-base font-semibold text-gray-800">Hôm nay bạn đã đi thêm một bước.</p>
          <p className="mt-2 text-sm text-gray-500">Ngày mai, Companion sẽ tiếp tục đồng hành cùng bạn.</p>
          {seed && (
            <p className="mx-auto mt-8 max-w-sm text-xs italic leading-relaxed text-gray-400">
              &ldquo;{seed}&rdquo;
            </p>
          )}
        </footer>
      </div>
    </div>
  );
}
