"use client";

import { useState } from "react";
import Link from "next/link";
import { HeartHandshake, ArrowRight } from "lucide-react";

/**
 * Companion Advisor cho Premium — KHÔNG bán hàng, chỉ giúp chọn đúng.
 * Người dùng tự chọn tình huống của họ (không đoán, không fake dữ liệu
 * người dùng); mỗi tình huống trỏ về đúng một chương trình hoặc Tư vấn 1:1.
 * Nếu có dữ liệu sở hữu thật (orders confirmed), server truyền
 * `ownedProgramNames` xuống để Companion ghi nhận trung thực.
 */

type Situation = {
  id: string;
  label: string;
  recommendation: string;
  targetLabel: string;
  targetHref: string;
};

const SITUATIONS: Situation[] = [
  {
    id: "new",
    label: "Tôi mới bắt đầu với AI",
    recommendation:
      "Nền tảng đúng quan trọng hơn tốc độ. Lớp học AI Cơ bản giúp bạn hiểu AI, hết sợ cái mới và tự tin dùng công cụ — trước khi nghĩ đến bất kỳ thứ gì nâng cao.",
    targetLabel: "Xem Lớp học AI Cơ bản",
    targetHref: "#premium-ai-coban",
  },
  {
    id: "basic-done",
    label: "Tôi đã biết AI cơ bản",
    recommendation:
      "Bạn đã qua giai đoạn làm quen — bước tiếp theo là biến AI thành công cụ làm việc chuyên nghiệp: tiếp thị, nội dung, quản lý, đàm phán. Đó chính là Lớp học AI Nâng cao.",
    targetLabel: "Xem Lớp học AI Nâng cao",
    targetHref: "#premium-ai-nangcao",
  },
  {
    id: "tool",
    label: "Tôi muốn thực hành một công cụ cụ thể",
    recommendation:
      "Nếu bạn học tốt nhất bằng cách LÀM, Lớp học OpenClaw đưa bạn vào một hệ trợ lý AI thực chiến: lịch, thư, tài liệu, nội dung, khách hàng — việc thật, không phải demo.",
    targetLabel: "Xem Lớp học OpenClaw",
    targetHref: "#premium-openclaw",
  },
  {
    id: "solo",
    label: "Tôi muốn làm Affiliate một mình",
    recommendation:
      "V-Solo được thiết kế cho đúng một người vận hành toàn bộ hệ thống Affiliate bằng AI — từ nghiên cứu đến chuyển đổi — không cần đội nhóm.",
    targetLabel: "Xem V-Solo",
    targetHref: "#premium-v-solo",
  },
  {
    id: "team",
    label: "Tôi muốn nhân bản cho đội nhóm",
    recommendation:
      "Khi hệ thống của bạn đã chạy và vấn đề là 'làm sao đội nhóm làm được như mình' — V-Scale giúp chuẩn hóa, nhân bản và xây lộ trình leader kế thừa.",
    targetLabel: "Xem V-Scale",
    targetHref: "#premium-v-scale",
  },
  {
    id: "unsure",
    label: "Tôi chưa chắc mình cần gì",
    recommendation:
      "Không sao cả — chưa chắc là một câu trả lời tốt. Đừng mua gì khi chưa rõ. Trao đổi trực tiếp 1:1 để xác định lộ trình trước, quyết định sau.",
    targetLabel: "Liên hệ Tư vấn 1:1",
    targetHref: "#tu-van-1-1",
  },
];

export function PremiumAdvisor({ ownedProgramNames }: { ownedProgramNames: string[] }) {
  const [selected, setSelected] = useState<Situation | null>(null);

  return (
    <section id="companion-advisor" className="scroll-mt-24">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur md:p-8">
        <div aria-hidden className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-blue-500/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg">
              <HeartHandshake className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">Companion Advisor</p>
              <h2 className="text-lg font-extrabold text-white">Bạn đang ở đâu trên hành trình?</h2>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
            Companion không bán hàng. Chọn đúng tình huống của bạn — Companion chỉ đường tới đúng một
            chương trình, hoặc khuyên bạn <em className="not-italic text-white/80">chưa nên mua gì cả</em>.
          </p>

          {ownedProgramNames.length > 0 && (
            <p className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-2.5 text-xs text-emerald-200/90">
              Companion ghi nhận: bạn đã sở hữu {ownedProgramNames.join(", ")} — các gợi ý dưới đây nên
              được đọc với điều đó trong đầu, không cần mua trùng.
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {SITUATIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelected(s)}
                aria-pressed={selected?.id === s.id}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  selected?.id === s.id
                    ? "border-blue-400/60 bg-blue-500/20 text-white"
                    : "border-white/15 bg-white/[0.03] text-white/70 hover:border-white/30 hover:text-white"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {selected && (
            <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.05] p-5">
              <p className="text-sm leading-relaxed text-white/80">{selected.recommendation}</p>
              <Link
                href={selected.targetHref}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
              >
                {selected.targetLabel} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
