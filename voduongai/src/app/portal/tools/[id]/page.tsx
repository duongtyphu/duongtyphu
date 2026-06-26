"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { useCollection } from "@/lib/admin/store";
import { toolsAdminSeed, type AdminTool } from "@/data/admin/tools";
import { logoUrl } from "@/lib/logo";
import { isSafeUrl } from "@/lib/urlSafety";
import { SaveButton } from "@/components/portal/SaveButton";

export default function ToolDetailPage() {
  const { id: slug } = useParams<{ id: string }>();
  const { items, ready } = useCollection<AdminTool>("tools", toolsAdminSeed);

  const tool = items.find((t) => t.slug === slug && t.status === "Published");

  if (ready && !tool) notFound();
  if (!tool) return null;

  const primaryUrl = tool.affiliateUrl || tool.link;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/portal/tools" className="text-sm font-semibold text-brand-blue hover:underline">
          ← Thư viện công cụ
        </Link>
        <SaveButton item={{ id: `tool_${tool.id}`, kind: "tool", title: tool.name, href: `/portal/tools/${tool.slug}`, meta: tool.category }} />
      </div>

      <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-8">
        <div className="flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/90 p-2">
            <img
              src={logoUrl(tool.id)}
              alt={`${tool.name} logo`}
              width={40}
              height={40}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex items-center gap-2">
            {tool.badge === "Tôi đang dùng" ? (
              <span className="rounded-full bg-brand-violet/10 px-3 py-1 text-xs font-semibold text-brand-violet">
                Tôi đang dùng
              </span>
            ) : (
              <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">
                {tool.badge}
              </span>
            )}
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white">
              {tool.pricing}
            </span>
          </div>
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-white">{tool.name}</h1>
        <p className="mt-1 text-sm text-white">{tool.category}</p>
        <p className="mt-4 leading-relaxed text-white">{tool.longDescription || tool.shortDescription}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-white">
              Dùng để làm gì
            </p>
            <p className="mt-1 text-sm text-white">{tool.useCase}</p>
          </div>
          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-white">
              Phù hợp với ai
            </p>
            <p className="mt-1 text-sm text-white">{tool.audience}</p>
          </div>
        </div>

        {(tool.pros?.length || tool.cons?.length) ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {tool.pros && tool.pros.length > 0 && (
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-white">Ưu điểm</p>
                <ul className="mt-2 space-y-1.5 text-sm text-white/80">
                  {tool.pros.map((p) => <li key={p}>• {p}</li>)}
                </ul>
              </div>
            )}
            {tool.cons && tool.cons.length > 0 && (
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-white">Nhược điểm</p>
                <ul className="mt-2 space-y-1.5 text-sm text-white/80">
                  {tool.cons.map((c) => <li key={c}>• {c}</li>)}
                </ul>
              </div>
            )}
          </div>
        ) : null}

        {tool.workflow && (
          <div className="mt-4 rounded-xl border border-brand-violet/20 bg-brand-violet/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-violet">Workflow thực tế</p>
            <p className="mt-1 text-sm text-white/80">{tool.workflow}</p>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Video hướng dẫn</p>
          {tool.videoUrl && isSafeUrl(tool.videoUrl) ? (
            <a href={tool.videoUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm font-semibold text-brand-blue hover:underline">
              Xem video hướng dẫn →
            </a>
          ) : (
            <p className="mt-1 text-sm text-white/50">Sắp cập nhật — chưa có video hướng dẫn thật cho công cụ này.</p>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {isSafeUrl(primaryUrl) && (
            <a
              href={primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full gradient-surface px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Truy cập {tool.name}
            </a>
          )}
          {isSafeUrl(tool.link) && tool.link !== primaryUrl && (
            <a
              href={tool.link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-semibold text-white transition hover:border-brand-violet hover:text-brand-violet"
            >
              Website chính thức
            </a>
          )}
        </div>
      </div>

      <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h3 className="text-base font-bold text-white">Muốn áp dụng {tool.name} hiệu quả hơn?</h3>
        <p className="mt-2 text-sm text-white/70">
          Xem thêm các công cụ và workflow thực chiến khác trong Thư viện công cụ, hoặc tìm hiểu lộ trình V-SOLO để biết cách kết hợp công cụ vào hệ thống của bạn.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/portal/tools" className="text-sm font-semibold text-brand-violet hover:underline">
            Xem thêm công cụ →
          </Link>
          <Link href="/portal/vdai-academy" className="text-sm font-semibold text-brand-violet hover:underline">
            Tìm hiểu V-SOLO →
          </Link>
        </div>
      </div>
    </div>
  );
}
