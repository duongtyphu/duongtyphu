"use client";

/**
 * EPIC 02 — Sprint 01: `/portal/workspace` MVP.
 * Chưa cần AI thật, chưa gọi API, chưa có Agent thật — mục tiêu sprint
 * này là kiến trúc luồng: nhận context từ Companion Desk/Work Need/
 * Workspace đề xuất/Workflow/Prompt Library/Toolbox, hiển thị lại đúng
 * context đó + một khung "Kết quả sẽ hiển thị tại đây".
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { readWorkspaceContext, type WorkspaceContext } from "@/lib/portal/companion-workspace";

const SOURCE_LABEL: Record<string, string> = {
  "companion-desk": "Companion Desk",
  "work-need": "Theo nhu cầu công việc",
  "recommended-workspace": "Workspace đề xuất",
  "workflow": "AI Workflows",
  "prompt-library": "Prompt Library",
  "toolbox": "AI Toolbox",
  "learning-path": "Lộ trình học AI",
  "resource": "Tài nguyên AI",
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
      module: "ai-space",
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

  return (
    <div className="space-y-8 rounded-3xl p-6 md:p-8">
      <nav className="flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/portal" className="hover:text-gray-700 transition">Portal</Link>
        <span className="text-gray-300">/</span>
        <Link href="/portal/khong-gian-ai" className="hover:text-gray-700 transition">Không gian AI</Link>
        <span className="text-gray-300">/</span>
        <span className="font-medium text-gray-900">Workspace</span>
      </nav>

      <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600">
          <Sparkles className="h-4 w-4" />
          AI Workspace
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
              Không gian AI
            </Link>{" "}
            và nói cho Companion biết bạn muốn làm gì.
          </p>
        )}
      </section>

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
        href="/portal/khong-gian-ai"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại Không gian AI
      </Link>
    </div>
  );
}
