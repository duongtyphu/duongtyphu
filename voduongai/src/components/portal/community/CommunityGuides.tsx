"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ArrowRight } from "lucide-react";

/**
 * COMMUNITY CAMPUS — mục 8: "Người đồng hành cùng bạn".
 *
 * Chỉ chứa NGƯỜI THẬT, hồ sơ thật — hiện tại là Founder (cùng dữ liệu
 * thật đã dùng ở `FounderSpotlight.tsx` của Premium, không bịa thêm
 * thành tựu/con số). Cấu trúc mảng `GUIDES` để sẵn sàng thêm Mentor/
 * Community Guide thật khi có (CMS-ready — chỉ cần thêm phần tử, không
 * cần đổi cấu trúc component).
 */

type Guide = {
  id: string;
  name: string;
  role: string;
  badge: string;
  photo: string;
  tags: string[];
  intro: string;
  expertise: string[];
  philosophy?: string;
};

const GUIDES: Guide[] = [
  {
    id: "vo-duong",
    name: "Võ Đương",
    role: "Nhà sáng lập VO DUONG AI",
    badge: "Nhà sáng lập",
    photo: "/images/founder-portrait.jpg",
    tags: ["AI ứng dụng", "Affiliate Marketing", "Automation", "AI Strategy"],
    intro:
      "Võ Đương là nhà sáng lập VO DUONG AI — nhà đầu tư và người ứng dụng AI thực chiến trong kinh doanh số. Anh xây VO DUONG AI thành một hệ sinh thái có lộ trình rõ ràng thay vì những thông tin rời rạc.",
    expertise: [
      "Ứng dụng AI trong kinh doanh số và Affiliate Marketing",
      "Xây dựng hệ thống tự động hóa quy trình vận hành",
      "Phát triển kênh nội dung và chiến lược phân phối",
    ],
    philosophy: "Học AI không phải để biết — mà để làm được ngay. Mỗi buổi học là một kết quả thực tế.",
  },
];

export function CommunityGuides() {
  const [openId, setOpenId] = useState<string | null>(null);
  const activeGuide = GUIDES.find((g) => g.id === openId) ?? null;

  useEffect(() => {
    if (!activeGuide) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenId(null);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeGuide]);

  return (
    <section>
      <div className="grid gap-4 sm:grid-cols-2">
        {GUIDES.map((guide) => (
          <div key={guide.id} className="campus-card relative overflow-hidden p-6">
            <div aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky-400 via-blue-500 to-orange-400" />
            <div className="flex items-start gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.35)]">
                <Image src={guide.photo} alt={`${guide.name} — ${guide.role}`} fill className="object-cover" sizes="80px" />
              </div>
              <div className="min-w-0">
                <span className="inline-flex rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  {guide.badge}
                </span>
                <h3 className="mt-1.5 text-base font-extrabold text-gray-900">{guide.name}</h3>
                <p className="text-sm font-semibold text-blue-600">{guide.role}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">{guide.intro}</p>
            <button
              type="button"
              onClick={() => setOpenId(guide.id)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-gray-900/10 bg-white/80 px-4 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-gray-900/25 hover:text-gray-900"
            >
              Xem hồ sơ <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {activeGuide && (
        <div role="dialog" aria-modal="true" aria-label={`Hồ sơ ${activeGuide.name}`} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Đóng hồ sơ"
            onClick={() => setOpenId(null)}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white bg-white shadow-2xl">
            <div aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky-400 via-blue-500 to-orange-400" />
            <button
              type="button"
              onClick={() => setOpenId(null)}
              aria-label="Đóng"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-6 md:p-8">
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.35)]">
                  <Image src={activeGuide.photo} alt={activeGuide.name} fill className="object-cover" sizes="96px" />
                </div>
                <div>
                  <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-600">
                    {activeGuide.badge}
                  </span>
                  <h3 className="mt-1.5 text-xl font-extrabold text-gray-900">{activeGuide.name}</h3>
                  <p className="text-sm font-semibold text-blue-600">{activeGuide.role}</p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-gray-600">{activeGuide.intro}</p>

              <div className="mt-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Lĩnh vực chuyên môn</p>
                <ul className="mt-2 space-y-1.5">
                  {activeGuide.expertise.map((e) => (
                    <li key={e} className="flex items-start gap-2 text-sm leading-relaxed text-gray-600">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blue-500" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>

              {activeGuide.philosophy && (
                <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Triết lý</p>
                  <p className="mt-1.5 text-sm font-medium italic leading-relaxed text-gray-700">
                    &ldquo;{activeGuide.philosophy}&rdquo;
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setOpenId(null)}
                className="mt-6 w-full rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
