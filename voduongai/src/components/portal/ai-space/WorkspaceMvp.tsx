"use client";

/**
 * EPIC 02 — Sprint 02: `/portal/workspace` — nơi hội tụ (không thuộc Học
 * viện AI, AI Workspace hay Thư viện tri thức). Nhận context từ BẤT KỲ
 * module nào gọi `startCompanionWorkspace()` (Companion Desk, Work Need,
 * Workspace đề xuất, Workflow, Prompt Library, Toolbox, Học viện AI,
 * Thư viện tri thức...), hiển thị lại đúng context đó + một khung "Kết quả
 * sẽ hiển thị tại đây" + gợi ý quay lại module còn thiếu (Knowledge Loop).
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { readWorkspaceContext, type WorkspaceContext } from "@/lib/portal/companion-workspace";
import type { PortalModule } from "@/companion/agents/agent.types";

const SOURCE_LABEL: Record<string, string> = {
  "companion-desk": "Companion Desk",
  "work-need": "Theo nhu cầu công việc",
  "recommended-workspace": "Workspace đề xuất",
  "workflow": "AI Workflows",
  "prompt-library": "Prompt Library",
  "toolbox": "AI Toolbox",
  "learning-path": "Lộ trình học AI",
  "resource": "Tài nguyên AI",
  "task-entry": "Giao việc cho Companion",
  "academy-journey": "Hành trình Học viện AI",
  "academy-mission-pilot": "Mission — Học viện AI",
  "knowledge-exercise": "Bài tập — Thư viện tri thức",
  "knowledge-next-step": "Bước tiếp theo — Thư viện tri thức",
};

/** Module nào dẫn tới đây → route quay lại đúng module đó (breadcrumb + fallback link). */
const MODULE_ROUTE: Record<PortalModule, { label: string; href: string }> = {
  "khong-gian-ai": { label: "AI Workspace", href: "/portal/khong-gian-ai" },
  ckos: { label: "Thư viện tri thức", href: "/portal/library" },
  academy: { label: "Học viện AI", href: "/portal/academy" },
  opportunities: { label: "Dự án & Cơ hội", href: "/portal/opportunities" },
  premium: { label: "Premium", href: "/portal/premium" },
  "learning-journal": { label: "Nhật ký học tập", href: "/portal/news" },
  "my-journey": { label: "Hành trình của tôi", href: "/portal/journey" },
  "living-garden": { label: "Khu vườn của bạn", href: "/portal/khu-vuon-cua-ban" },
};

/** Knowledge Loop — nếu thiếu kiến thức, Companion gợi ý quay lại đúng module còn lại. */
const COMPANION_SUGGESTION: Partial<Record<PortalModule, { message: string; label: string; href: string }>> = {
  "khong-gian-ai": {
    message: "Nếu cần hiểu sâu hơn trước khi làm, mình nghĩ Học viện AI sẽ giúp bạn.",
    label: "Sang Học viện AI",
    href: "/portal/academy",
  },
  academy: {
    message: "Học xong phần này, hãy thực hành ngay để biến kiến thức thành kết quả thật.",
    label: "Sang AI Workspace",
    href: "/portal/khong-gian-ai",
  },
  ckos: {
    message: "Đã tra cứu xong? Companion có thể giúp bạn áp dụng ngay vào một việc thật.",
    label: "Sang AI Workspace",
    href: "/portal/khong-gian-ai",
  },
};

export function WorkspaceMvp() {
  const searchParams = useSearchParams();
  const [context, setContext] = useState<WorkspaceContext | null>(null);

  useEffect(() => {
    // Ưu tiên context đầy đủ từ sessionStorage; query params chỉ là bản
    // dự phòng tối thiểu (vẫn hoạt động khi mở link trực tiếp/chia sẻ).
    // Đọc storage/query chỉ có ở client sau mount nên phải set trong effect.
    const stored = readWorkspaceContext();
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setContext(stored);
      return;
    }
    const source = searchParams.get("source");
    if (!source) return;
    setContext({
      module: (searchParams.get("module") as PortalModule) ?? "khong-gian-ai",
      source,
      title: searchParams.get("title") ?? undefined,
      userGoal: searchParams.get("goal") ?? undefined,
      itemId: searchParams.get("itemId") ?? undefined,
      itemType: (searchParams.get("itemType") as WorkspaceContext["itemType"]) ?? undefined,
      expectedOutput: searchParams.get("expectedOutput") ?? undefined,
      routeFrom: searchParams.get("routeFrom") ?? "/portal/khong-gian-ai",
      timestamp: searchParams.get("ts") ?? new Date().toISOString(),
    });
  }, [searchParams]);

  const goal = context?.userGoal ?? context?.title ?? "Chưa xác định mục tiêu cụ thể";
  const sourceLabel = context ? (SOURCE_LABEL[context.source] ?? context.source) : "Không rõ nguồn";
  const originModule = context ? MODULE_ROUTE[context.module] : null;
  const suggestion = context ? COMPANION_SUGGESTION[context.module] : undefined;

  return (
    <div className="space-y-8 rounded-3xl p-6 md:p-8">
      <nav className="flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/portal" className="hover:text-gray-700 transition">Portal</Link>
        <span className="text-gray-300">/</span>
        <Link href={originModule?.href ?? "/portal/khong-gian-ai"} className="hover:text-gray-700 transition">
          {originModule?.label ?? "AI Workspace"}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="font-medium text-gray-900">Workspace</span>
      </nav>

      <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600">
          <Sparkles className="h-4 w-4" />
          Workspace
        </div>
        <h1 className="mt-3 text-2xl font-extrabold text-gray-900 md:text-3xl">{goal}</h1>
        <p className="mt-2 text-sm text-gray-500">
          Đến từ <span className="font-semibold text-gray-700">{sourceLabel}</span>
          {context?.routeFrom && (
            <>
              {" "}· route <span className="font-mono text-gray-600">{context.routeFrom}</span>
            </>
          )}
        </p>
        {context?.expectedOutput && (
          <p className="mt-3 text-sm text-gray-600">
            <span className="font-semibold text-gray-800">Kết quả mong đợi: </span>
            {context.expectedOutput}
          </p>
        )}
        {!context && (
          <p className="mt-4 text-sm text-gray-500">
            Chưa có thông tin công việc nào. Quay lại{" "}
            <Link href="/portal/khong-gian-ai" className="font-semibold text-blue-600 hover:underline">
              AI Workspace
            </Link>{" "}
            và nói cho Companion biết bạn muốn làm gì.
          </p>
        )}
      </section>

      {suggestion && (
        <section className="flex items-start gap-3 rounded-2xl border border-violet-100 bg-violet-50/60 p-5">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
          <div className="space-y-1.5">
            <p className="text-sm text-gray-700">{suggestion.message}</p>
            <Link href={suggestion.href} className="text-sm font-semibold text-violet-600 hover:underline">
              {suggestion.label} →
            </Link>
          </div>
        </section>
      )}

      {context && (
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-lg font-bold text-gray-900">Kế hoạch bước đầu</h2>
          <ol className="mt-4 space-y-3">
            {[
              "Companion phân tích mục tiêu và ngữ cảnh bạn vừa cung cấp.",
              "Chọn công cụ, prompt và quy trình phù hợp nhất với việc này.",
              "Thực hiện từng bước và tổng hợp kết quả về Workspace này.",
            ].map((step, i) => (
              <li key={step} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-sm font-semibold text-gray-500">Kết quả sẽ hiển thị tại đây</p>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-gray-400">
          Sprint này mới dựng kiến trúc luồng — chưa gọi AI thật, chưa có Agent thật. Kết quả xử lý
          của Companion sẽ xuất hiện ở khu vực này trong các sprint tiếp theo.
        </p>
      </section>

      <Link
        href={originModule?.href ?? "/portal/khong-gian-ai"}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại {originModule?.label ?? "AI Workspace"}
      </Link>
    </div>
  );
}
