"use client";

import { useState } from "react";
import Image from "next/image";

const STATS = [
  { num: "100+", label: "Ebook & tài liệu miễn phí" },
  { num: "50+", label: "Khóa học chất lượng" },
  { num: "10K+", label: "Thành viên tin tưởng" },
  { num: "24/7", label: "Hỗ trợ từ Companion AI" },
];

export function LandingPreviewNewsletter() {
  const [sent, setSent] = useState(false);

  return (
    <section className="bg-[#F7F8FC] pb-24">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid items-center gap-10 md:grid-cols-[1.3fr_.7fr]">
          <div>
            <h2 className="text-[1.4rem] font-extrabold leading-[1.3] text-[#0B0F2E] md:text-[1.6rem]">
              Nhận tài liệu & cập nhật mới nhất từ VO DUONG AI
            </h2>
            <p className="mt-2.5 text-[.95rem] text-[#5B6B85]">
              Đăng ký để nhận ebook miễn phí, tài liệu chọn lọc và thông tin về khóa học, sự kiện mới nhất.
            </p>
            <form
              className="mt-[22px] flex flex-col gap-2.5 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                e.currentTarget.reset();
              }}
            >
              <input
                type="email"
                required
                placeholder="Nhập email của bạn..."
                aria-label="Email của bạn"
                className="flex-1 rounded-xl border-[1.5px] border-[#ECEDF5] px-[18px] py-[15px] text-[.95rem] outline-none focus:border-[#7C5CFC]"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#8B6BF2] to-[#5B21D6] px-[26px] py-[15px] text-[.95rem] font-bold text-white shadow-[0_8px_20px_rgba(91,33,214,.35)]"
              >
                Đăng ký nhận tài liệu
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2 11 13" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 2 15 22l-4-9-9-4 20-7Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
            {sent && (
              <p className="mt-2.5 text-sm font-bold text-[#5b21c9]">
                Cảm ơn bạn! Vui lòng kiểm tra email để nhận tài liệu.
              </p>
            )}
          </div>
          <div className="mx-auto max-w-[280px]">
            <Image
              src="/images/landing-preview/newsletter-giftbox.jpg"
              alt="Nhận ebook và tài liệu miễn phí từ VO DUONG AI"
              width={555}
              height={330}
              className="w-full"
            />
          </div>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-[#ECEDF5] bg-white px-4 py-[22px] text-center">
              <div className="text-[1.5rem] font-extrabold text-[#5b21c9]">{s.num}</div>
              <div className="mt-1 text-[.82rem] font-semibold text-[#5B6B85]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
