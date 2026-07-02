"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/portal/sanctuary/Reveal";
import { SanctuaryBackground } from "@/components/portal/sanctuary/SanctuaryBackground";
import { getRandomThoughtSeed } from "@/data/portal/thought-seeds";

export default function MyJourneySanctuaryPage() {
  const [seed, setSeed] = useState<string | null>(null);

  useEffect(() => {
    setSeed(getRandomThoughtSeed());
  }, []);

  return (
    <div className="relative -mx-4 -my-6 md:-mx-8 md:-my-8">
      <SanctuaryBackground variant="warm" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 sm:px-10 sm:py-28">
        {/* ═══════════════════ HERO ═══════════════════ */}
        <section className="flex flex-col items-center text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">Cùng Companion</p>
          <h1
            className="mt-6 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl"
            style={{ backgroundImage: "linear-gradient(90deg, #111827, #2563EB, #F97316)" }}
          >
            Hành trình của tôi
          </h1>
          <p className="mx-auto mt-8 max-w-lg text-xl leading-relaxed text-gray-600">
            Mỗi bước nhỏ hôm nay đều góp phần tạo nên phiên bản tốt hơn của chính bạn.
          </p>
        </section>

        {/* ═══════════════════ Bạn đang ở đâu? ═══════════════════ */}
        <Reveal className="mt-32">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">Điểm hiện tại</p>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">Bạn đang ở đâu?</h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            Không có điểm xuất phát nào là quá muộn, và không có vị trí nào là sai. Điều quan trọng
            không phải là bạn đang ở đâu, mà là bạn đang hướng về phía nào.
          </p>
        </Reveal>

        {/* ═══════════════════ Điều đã học ═══════════════════ */}
        <Reveal className="mt-28">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-violet-500">Nhìn lại</p>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">Điều đã học</h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            Mỗi bài học, dù nhỏ, đều là một viên gạch cho nền móng bạn đang xây. Đừng đánh giá thấp
            những điều tưởng như đơn giản mà bạn đã hiểu được.
          </p>
        </Reveal>

        {/* ═══════════════════ Điều đang luyện ═══════════════════ */}
        <Reveal className="mt-28">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">Hiện tại</p>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">Điều đang luyện</h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            Sự thành thạo không đến từ một lần cố gắng, mà từ việc quay lại luyện tập ngay cả khi kết
            quả chưa như ý. Bạn đang ở giữa quá trình đó — và điều đó hoàn toàn ổn.
          </p>
        </Reveal>

        {/* ═══════════════════ Companion Reflection ═══════════════════ */}
        <Reveal className="mt-28">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">Suy ngẫm cùng nhau</p>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">Companion Reflection</h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            Đôi khi điều bạn cần không phải là thêm một bài học, mà là một khoảng lặng để nhìn lại
            những gì đã đi qua. Hãy để một câu hỏi nhỏ dẫn bạn về với chính mình.
          </p>
        </Reveal>

        {/* ═══════════════════ Thành tựu ═══════════════════ */}
        <Reveal className="mt-28">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-violet-500">Ghi nhận</p>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">Thành tựu</h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            Không phải mọi thành tựu đều cần được đo bằng con số. Có những thành tựu chỉ bạn mới biết —
            như ngày bạn không bỏ cuộc, dù rất muốn.
          </p>
        </Reveal>

        {/* ═══════════════════ Companion gợi ý ═══════════════════ */}
        <Reveal className="mt-28">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">Định hướng</p>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">Companion gợi ý</h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            Dựa trên những gì bạn đã đi qua, Companion tin rằng bước tiếp theo phù hợp nhất là một
            điều nhỏ, cụ thể, và có thể làm ngay hôm nay — không phải một mục tiêu quá lớn.
          </p>
        </Reveal>

        {/* ═══════════════════ Tuần này bạn trưởng thành điều gì? ═══════════════════ */}
        <Reveal className="mt-28">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">Câu hỏi tuần này</p>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Tuần này bạn trưởng thành điều gì?
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            Không cần câu trả lời hoàn hảo. Chỉ cần một khoảnh khắc thành thật với chính mình — điều gì
            tuần này đã khiến bạn nhìn nhận một điều theo cách khác?
          </p>
        </Reveal>

        {/* ═══════════════════ Bước tiếp theo ═══════════════════ */}
        <Reveal className="mt-28">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-violet-500">Tiếp tục</p>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">Bước tiếp theo</h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            Hành trình không cần phải hoàn thành hôm nay. Nó chỉ cần được tiếp tục.
          </p>
          <Link
            href="/portal/journey"
            className="mt-8 inline-block text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Xem chi tiết hành trình học tập →
          </Link>
        </Reveal>

        {/* ═══════════════════ Thought Seed ═══════════════════ */}
        {seed && (
          <Reveal className="mt-40 border-t border-gray-100 pt-14 text-center">
            <p className="mx-auto max-w-sm text-sm italic leading-relaxed text-gray-400">&ldquo;{seed}&rdquo;</p>
          </Reveal>
        )}
      </div>
    </div>
  );
}
