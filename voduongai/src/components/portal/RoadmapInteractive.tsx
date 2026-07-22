"use client";

import { useState } from "react";
import Link from "next/link";

type Step = {
  step: number;
  title: string;
  description: string;
  resource: { label: string; href: string };
  action: string;
};

const steps: Step[] = [
  {
    step: 1,
    title: "Làm quen AI",
    description: "Hiểu các công cụ AI phổ biến và cách viết prompt hiệu quả.",
    resource: { label: "Học viện AI", href: "/portal/hocvienai" },
    action: "Hoàn thành 4 bài học nền tảng trong Học viện AI.",
  },
  {
    step: 2,
    title: "Tạo nội dung",
    description: "Dùng AI để lên kế hoạch và sản xuất nội dung đều đặn.",
    resource: { label: "Thư viện Prompt", href: "/portal/prompts" },
    action: "Lập kế hoạch content 30 ngày bằng prompt có sẵn.",
  },
  {
    step: 3,
    title: "Xây thương hiệu cá nhân",
    description: "Định vị bản thân và xây hình ảnh nhất quán trên các kênh.",
    resource: { label: "Thương hiệu cá nhân", href: "/portal/hocvienai" },
    action: "Hoàn thành bài học định vị thương hiệu cá nhân.",
  },
  {
    step: 4,
    title: "Affiliate Marketing",
    description: "Chọn ngách, chọn sản phẩm và bắt đầu hệ thống Affiliate.",
    resource: { label: "Học viện Affiliate", href: "/portal/premium" },
    action: "Chọn ngách và 1 sản phẩm để bắt đầu giới thiệu.",
  },
  {
    step: 5,
    title: "Tạo sản phẩm số",
    description: "Đóng gói kiến thức/kinh nghiệm thành sản phẩm bán được.",
    resource: { label: "Sản phẩm số", href: "/portal/premium" },
    action: "Phác thảo 1 sản phẩm số đầu tiên (ebook/prompt pack/template).",
  },
  {
    step: 6,
    title: "Mở rộng hệ sinh thái",
    description: "Nhân bản hệ thống, xây đội nhóm, mở rộng quy mô.",
    resource: { label: "V-SCALE", href: "/portal/premium" },
    action: "Đánh giá hệ thống hiện tại và lên kế hoạch nhân bản.",
  },
];

export function RoadmapInteractive() {
  const [level, setLevel] = useState<"new" | "experienced" | null>(null);

  const visibleSteps = level === "experienced" ? steps.slice(3) : steps;

  return (
    <div className="space-y-6">
      {!level ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => setLevel("new")}
            className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-6 text-left transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30"
          >
            <p className="text-base font-bold text-gray-900">Tôi là người mới</p>
            <p className="mt-2 text-sm text-gray-600">
              Bắt đầu từ Bước 1 — làm quen AI từ căn bản.
            </p>
          </button>
          <button
            onClick={() => setLevel("experienced")}
            className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-6 text-left transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30"
          >
            <p className="text-base font-bold text-gray-900">Tôi đã có kinh nghiệm</p>
            <p className="mt-2 text-sm text-gray-600">
              Bỏ qua phần nền tảng, vào thẳng Bước 4 — Affiliate Marketing.
            </p>
          </button>
        </div>
      ) : (
        <button
          onClick={() => setLevel(null)}
          className="text-sm font-semibold text-brand-blue hover:underline"
        >
          ← Chọn lại điểm bắt đầu
        </button>
      )}

      {level && (
        <div className="space-y-4">
          {visibleSteps.map((s) => (
            <div
              key={s.step}
              className="card-shine flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex gap-4">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-blue/20 text-sm font-extrabold text-brand-blue">
                  {s.step}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{s.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{s.description}</p>
                  <p className="mt-2 text-xs font-semibold text-brand-violet">
                    Hành động: {s.action}
                  </p>
                </div>
              </div>
              <Link
                href={s.resource.href}
                className="shrink-0 rounded-full border border-white/15 px-4 py-2 text-center text-xs font-semibold text-gray-900 transition hover:border-brand-blue hover:text-brand-blue"
              >
                {s.resource.label} →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
