"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SanctuaryBackground } from "@/components/portal/sanctuary/SanctuaryBackground";
import { LivingCore } from "@/components/LivingCore";
import { getRandomThoughtSeed } from "@/data/portal/thought-seeds";
import { getRecentActivity } from "@/lib/portal/foundation/growth-view";
import { CompanionTaskEntry } from "@/components/portal/companion/CompanionTaskEntry";

/**
 * Portal 4.0 Final Reconstruction — Companion Reconstruction.
 *
 * Đây KHÔNG phải một chatbot, không phải trợ lý kiểu ChatGPT, không phải
 * dashboard. Đây là nơi Companion HIỆN DIỆN — người dùng bước vào thế
 * giới của Companion, không phải mở một công cụ. "Sứ mệnh Companion"
 * (triết lý thương hiệu, Genome/Constitution/Timeline) đã chuyển hẳn sang
 * `/portal/su-menh-companion`, giữ nguyên 100% — không đụng vào.
 *
 * 7 khối, đúng như brief: Presence (Living Core), Today's Thought, Memory
 * (đọc growth-view thật, honest empty state — không phải chatbot lịch sử
 * trò chuyện), Conversation (CompanionTaskEntry có sẵn — giao việc bằng
 * lời của mình, không phải chọn Agent), Reflection (dẫn sang Journey),
 * Mission (liên kết lặng lẽ sang trang triết lý), Silence (một khoảng
 * lặng chủ đích, không CTA).
 */
export default function CompanionPresencePage() {
  const [thought, setThought] = useState<string | null>(null);
  const [memory, setMemory] = useState<string | null>(null);

  useEffect(() => {
    const [latest] = getRecentActivity(1);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of static content + browser-only localStorage, no SSR equivalent
    setThought(getRandomThoughtSeed());
    setMemory(latest ? `Lần gần nhất, bạn đã ${latest.label.toLowerCase()}.` : null);
  }, []);

  return (
    <div className="relative -mx-4 -my-6 md:-mx-8 md:-my-8">
      <SanctuaryBackground />

      <div className="relative z-10 mx-auto max-w-xl px-6 py-24 sm:px-10 sm:py-32">
        {/* Presence */}
        <section className="flex flex-col items-center text-center">
          <LivingCore size={128} state="idle" />
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-blue-500">Companion</p>
          <p className="mt-3 text-lg leading-relaxed text-gray-500">Mình đang ở đây, cùng bạn.</p>
        </section>

        {/* Today's Thought */}
        {thought && (
          <section className="mt-20 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-violet-500">Hôm nay</p>
            <p className="mx-auto mt-4 max-w-md text-xl italic leading-relaxed text-gray-700">
              &ldquo;{thought}&rdquo;
            </p>
          </section>
        )}

        {/* Memory — thật, không phải chatbot lịch sử */}
        <section className="mt-20 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">Trí nhớ</p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-500">
            {memory ?? "Companion chưa có gì để nhớ về bạn — điều đó sẽ bắt đầu từ lần đầu tiên bạn làm việc trong Workspace."}
          </p>
        </section>

        {/* Conversation — giao việc bằng lời của mình, không phải chatbot */}
        <section className="mt-20">
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-violet-500">Trò chuyện</p>
          <div className="mt-6">
            <CompanionTaskEntry
              module="my-journey"
              heading="Có điều gì bạn đang nghĩ tới?"
              placeholder="VD: Mình đang phân vân giữa hai việc, giúp mình nhìn rõ hơn..."
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
  );
}
