"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SanctuaryBackground } from "@/components/portal/sanctuary/SanctuaryBackground";
import { LivingCore } from "@/components/LivingCore";
import { getRandomTodayThought, getRandomMusing } from "@/data/portal/companion-inner-life";
import { getRecentActivity, getJourneyProgress } from "@/lib/portal/foundation/growth-view";
import { CompanionTaskEntry } from "@/components/portal/companion/CompanionTaskEntry";

/**
 * Portal 4.0 Companion Experience V2 — Experience Evolution, không phải
 * redesign. Core/whitespace/atmosphere/silence/Mission page giữ nguyên
 * 100% (đã duyệt). Thay đổi là NHỊP CẢM XÚC của trang, đúng thứ tự:
 * Presence → Thought → Memory → Thinking → Conversation → Reflection →
 * Silence — và GIỌNG: Companion có suy nghĩ riêng (ngôi thứ nhất, đôi khi
 * bỏ lửng/không chắc chắn) thay vì trích một câu triết lý; Memory kể một
 * kỷ niệm chung thay vì mô tả một sự kiện hệ thống; Conversation là một
 * lời mời, không phải một form.
 */
export default function CompanionPresencePage() {
  const [todayThought, setTodayThought] = useState<string | null>(null);
  const [memory, setMemory] = useState<string | null>(null);
  const [musing, setMusing] = useState<string | null>(null);
  const [mission, setMission] = useState<string | null>(null);

  useEffect(() => {
    const [latest] = getRecentActivity(1);
    const unfinished = getJourneyProgress().find((j) => !j.isCompleted);

    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time picks from static lists + browser-only localStorage, no SSR equivalent
    setTodayThought(getRandomTodayThought());
    setMusing(getRandomMusing());
    setMemory(latest ? `Mình vẫn nhớ — lần cuối, chúng ta cùng ${latest.label.toLowerCase()}.` : null);
    setMission(
      unfinished
        ? `Nếu hôm nay chỉ làm một điều, mình nghĩ nên quay lại với "${unfinished.missionGoal}" — mình vẫn nhớ nó đang dang dở.`
        : "Nếu hôm nay chỉ làm một điều, mình nghĩ nên thử 15 phút đầu tiên ở Workspace — không cần chuẩn bị gì cả."
    );
  }, []);

  return (
    <div className="relative -mx-4 -my-6 md:-mx-8 md:-my-8">
      <SanctuaryBackground />

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
      {/* Content Gutter — cùng khung rounded-3xl p-6 md:p-8 với các trang
       * pillar khác, lộ khí quyển Sanctuary ở viền ngoài. */}
      <div className="rounded-3xl p-6 md:p-8">
      <div className="mx-auto max-w-xl px-6 py-24 sm:px-10 sm:py-32">
        {/* Presence — Core thở chậm, không chớp/không hiệu ứng gaming */}
        <section className="flex flex-col items-center text-center">
          <div className="companion-presence-breathe">
            <LivingCore size={128} state="idle" />
          </div>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-blue-500">Companion</p>
          <p className="mt-3 text-lg leading-relaxed text-gray-500">Mình đang ở đây, cùng bạn.</p>
        </section>

        {/* Thought — suy nghĩ của CHÍNH Companion, không trích dẫn ai */}
        {todayThought && (
          <section className="mt-20 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-violet-500">Hôm nay</p>
            <p className="mx-auto mt-4 max-w-md text-xl leading-relaxed text-gray-700">{todayThought}</p>
          </section>
        )}

        {/* Memory — một kỷ niệm chung, thật, không phải log hệ thống */}
        <section className="mt-20 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">Trí nhớ</p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-500">
            {memory ?? "Mình chưa có kỷ niệm nào giữa mình và bạn cả — điều đó sẽ bắt đầu từ lần đầu tiên chúng ta cùng làm việc trong Workspace."}
          </p>
        </section>

        {/* Thinking — suy nghĩ chưa xong, được phép không chắc chắn */}
        {musing && (
          <section className="mt-20 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-violet-500">Mình đang nghĩ...</p>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-gray-500">{musing}</p>
          </section>
        )}

        {/* Today's Mission — một gợi ý duy nhất, nhẹ nhàng, không phải nhiệm vụ */}
        {mission && (
          <section className="mt-20 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">Một gợi ý cho hôm nay</p>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-600">{mission}</p>
          </section>
        )}

        {/* Conversation — một lời mời, không phải một cái form */}
        <section className="mt-20">
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-violet-500">Trò chuyện</p>
          <div className="mt-6">
            <CompanionTaskEntry
              module="my-journey"
              heading="Bạn đang nghĩ gì vậy?"
              placeholder="Kể mình nghe xem, dù chỉ là một ý chưa rõ ràng..."
              submitLabel="Nói cho Companion nghe"
            />
          </div>
        </section>

        {/* Reflection */}
        <section className="mt-20 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">Chiêm nghiệm</p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-500">
            Nếu bạn muốn nhìn lại quãng đường đã đi, thay vì nói tiếp — Companion có thể chờ ở đó.
          </p>
          <Link
            href="/portal/hanhtrinhcuatoi"
            className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:underline"
          >
            Xem hành trình của bạn →
          </Link>
        </section>

        {/* Silence — khoảng lặng chủ đích, không CTA */}
        <section className="mt-24 text-center">
          <p className="mx-auto max-w-sm text-sm italic leading-relaxed text-gray-400">
            Đôi khi không cần làm gì cả. Ở lại một chút cũng là một hình thức đồng hành.
          </p>
        </section>

        {/* Mission — liên kết lặng lẽ, không phải CTA chính */}
        <footer className="mt-24 border-t border-gray-100 pt-10 text-center">
          <Link
            href="/portal/su-menh-companion"
            className="text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-gray-600"
          >
            Sứ mệnh Companion →
          </Link>
        </footer>
      </div>
      </div>
      </div>
    </div>
  );
}
