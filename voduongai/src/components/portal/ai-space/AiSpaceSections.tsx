"use client";

/**
 * EPIC 02 — Sprint 01: AI Workspace Foundation.
 * Các khối mới cho /portal/aiworkspace — mỗi khối đều dẫn về
 * `startCompanionWorkspace()` (điểm gọi duy nhất, xem
 * src/lib/portal/companion-workspace.ts), không mỗi nút một logic riêng.
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronRight, Copy, Check } from "lucide-react";
import { startCompanionWorkspace, type WorkspaceItemType } from "@/lib/portal/companion-workspace";
import { WORK_NEEDS, RECOMMENDED_WORKSPACES, AI_WORKFLOWS, AI_RESOURCES, type RecommendedWorkspace, type AiWorkflow, type AiResource } from "@/data/portal/ai-workspace";
import { RECOMMENDED_WORKSPACE_TO_MISSION } from "@/lib/portal/foundation/mission-catalog";
import { prompts, type Prompt } from "@/data/prompts";
import { useCollection } from "@/lib/admin/store";

function SectionHeader({ label, title, href, hrefLabel }: { label: string; title: string; href?: string; hrefLabel?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
          {hrefLabel ?? "Xem tất cả"} <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function usePracticeAction() {
  const router = useRouter();
  return function practice(input: {
    source: string;
    title?: string;
    itemId?: string;
    itemType?: WorkspaceItemType;
    expectedOutput?: string;
    userGoal?: string;
    missionId?: string;
  }) {
    router.push(startCompanionWorkspace(input));
  };
}

/** Section 4 — Companion Desk. Khối quan trọng nhất, ngay sau Hero. */
export function CompanionDesk() {
  const [goal, setGoal] = useState("");
  const practice = usePracticeAction();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = goal.trim();
    if (!trimmed) return;
    practice({ source: "companion-desk", userGoal: trimmed });
  }

  return (
    <section id="companion-desk" className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-blue-50 p-6 shadow-sm md:p-8">
      <h2 className="text-2xl font-extrabold text-gray-900">Hôm nay bạn muốn AI giúp điều gì?</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
        Không cần chọn công cụ trước — chỉ cần nói bạn muốn làm gì, Companion sẽ điều phối phần còn lại.
      </p>
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Ví dụ: viết bài Facebook, tạo banner, làm video, phân tích dữ liệu, viết email, lập kế hoạch…"
          className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        />
        <button
          type="submit"
          disabled={!goal.trim()}
          className="shrink-0 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Giao việc cho Companion
        </button>
      </form>
    </section>
  );
}

/**
 * Section — Theo nhu cầu công việc. Chuyển sang Học viện AI (khám phá "học AI
 * theo nhu cầu") — label/title/CTA có thể override theo trang gọi.
 */
export function WorkNeedSection({
  label = "Bắt đầu từ công việc",
  title = "Theo nhu cầu công việc",
  ctaLabel = "Thực hành cùng Companion",
}: {
  label?: string;
  title?: string;
  ctaLabel?: string;
}) {
  const practice = usePracticeAction();
  return (
    <section className="space-y-4">
      <SectionHeader label={label} title={title} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {WORK_NEEDS.map((need) => (
          <button
            key={need.id}
            type="button"
            onClick={() => practice({ source: "work-need", itemId: need.id, itemType: "work_need", title: need.title })}
            className="group flex cursor-pointer flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-2xl">{need.icon}</div>
            <div>
              <p className="font-semibold text-gray-900">{need.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">{need.description}</p>
            </div>
            <span className="mt-auto flex items-center gap-1 text-xs font-semibold text-blue-600 transition group-hover:text-blue-700">
              {ctaLabel} <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

/**
 * Section 6 — Workspace đề xuất. PMO-HARDENING-CONT Workstream 1: đọc từ
 * collection Admin thật (`ai-workspace-recommended`), seed = nguyên văn
 * RECOMMENDED_WORKSPACES cũ — Founder sửa được qua Admin, không cần sửa code.
 */
export function RecommendedWorkspaceSection() {
  const practice = usePracticeAction();
  const { items } = useCollection<RecommendedWorkspace>("ai-workspace-recommended", RECOMMENDED_WORKSPACES);
  return (
    <section className="space-y-4">
      <SectionHeader label="Đề xuất cho bạn" title="Workspace đề xuất cho bạn" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map((ws) => (
          <button
            key={ws.id}
            type="button"
            onClick={() =>
              practice({
                source: "recommended-workspace",
                itemId: ws.id,
                itemType: "workspace",
                title: ws.title,
                expectedOutput: ws.expectedOutput,
                missionId: RECOMMENDED_WORKSPACE_TO_MISSION[ws.id],
              })
            }
            className="group flex cursor-pointer flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
          >
            <p className="font-semibold text-gray-900">{ws.title}</p>
            <p className="text-xs leading-relaxed text-gray-500">{ws.goal}</p>
            <div className="mt-1 flex flex-wrap gap-1.5 text-[10px] text-gray-400">
              <span className="rounded-full bg-gray-50 px-2 py-0.5">⏱ {ws.estimatedTime}</span>
              <span className="rounded-full bg-gray-50 px-2 py-0.5">🎯 {ws.expectedOutput}</span>
            </div>
            <p className="text-[10px] text-gray-400">Công cụ gợi ý: {ws.suggestedTools.join(", ")}</p>
            <span className="mt-auto flex items-center gap-1 text-xs font-semibold text-blue-600 transition group-hover:text-blue-700">
              Bắt đầu Workspace <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

/**
 * Section 7 — AI Workflows. PMO-HARDENING-CONT Workstream 1: đọc từ
 * collection Admin thật (`ai-workspace-workflow`).
 */
export function AiWorkflowSection() {
  const practice = usePracticeAction();
  const { items } = useCollection<AiWorkflow>("ai-workspace-workflow", AI_WORKFLOWS);
  return (
    <section className="space-y-4">
      <SectionHeader label="Quy trình" title="Quy trình AI theo công việc" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((flow) => (
          <button
            key={flow.id}
            type="button"
            onClick={() => practice({ source: "workflow", itemId: flow.id, itemType: "workflow", title: flow.title })}
            className="group flex cursor-pointer flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
          >
            <p className="font-semibold text-gray-900">{flow.title}</p>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
              {flow.steps.map((step, i) => (
                <span key={step} className="flex items-center gap-1.5">
                  <span className="rounded-full bg-gray-50 px-2 py-1 font-medium">{step}</span>
                  {i < flow.steps.length - 1 && <ChevronRight className="h-3 w-3 text-gray-300" />}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-gray-400">AI gợi ý: {flow.suggestedTools.join(", ")}</p>
            <span className="mt-auto flex items-center gap-1 text-xs font-semibold text-blue-600 transition group-hover:text-blue-700">
              Thực hành quy trình này <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

/**
 * Section 8 — Prompt Library. PMO-HARDENING-CONT Workstream 1: đọc từ
 * collection Admin thật (`ai-workspace-prompts`) — collection RIÊNG, không
 * trộn với bảng `prompts` (CKOS, `/admin/prompts`) hay `AI_PROMPTS`
 * (khong-gian-ai/index.ts) — 2 nguồn Prompt trùng tên khác đã tồn tại từ
 * trước (STABILIZATION-SPR-1101 Task 4 đếm được 4 nguồn), tạo thêm 1 CRUD
 * ghi đè lên 1 trong 2 nguồn cũ rủi ro hỏng dữ liệu — giữ tách biệt, ghi rõ
 * trong báo cáo thay vì tự ý hợp nhất.
 */
export function PromptLibrarySection() {
  const practice = usePracticeAction();
  const { items: promptItems } = useCollection<Prompt>("ai-workspace-prompts", prompts);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCopy(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 2000);
    } catch {
      // Clipboard không khả dụng (trình duyệt chặn) — bỏ qua an toàn.
    }
  }

  return (
    <section className="space-y-4">
      <SectionHeader label="Thư viện Prompt" title="Prompt Library" href="/portal/prompts" hrefLabel="Xem tất cả Prompt" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {promptItems.slice(0, 9).map((prompt) => (
          <div key={prompt.id} className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
            <span className="w-fit rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
              {prompt.category}
            </span>
            <p className="font-semibold text-gray-900">{prompt.title}</p>
            <p className="line-clamp-2 text-xs leading-relaxed text-gray-500">{prompt.preview}</p>
            <div className="mt-auto flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => practice({ source: "prompt-library", itemId: prompt.id, itemType: "prompt", title: prompt.title })}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                Dùng Prompt này <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleCopy(prompt.id, prompt.preview)}
                aria-label="Copy prompt"
                className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600 transition"
              >
                {copiedId === prompt.id ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Section 11 — Tài nguyên AI. PMO-HARDENING-CONT Workstream 1: đọc từ
 * collection Admin thật (`ai-workspace-resource`).
 */
export function ResourceSection() {
  const practice = usePracticeAction();
  const { items } = useCollection<AiResource>("ai-workspace-resource", AI_RESOURCES);
  return (
    <section className="space-y-4">
      <SectionHeader label="Tài nguyên" title="Tài nguyên thực hành" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {items.map((resource) => (
          <div key={resource.id} className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
            <span className="w-fit rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
              {resource.type}
            </span>
            <p className="font-semibold text-gray-900">{resource.title}</p>
            <div className="mt-auto flex flex-col gap-1.5 pt-1">
              <Link href={resource.href} className="text-xs font-semibold text-gray-700 hover:text-gray-900 transition">
                Mở →
              </Link>
              <button
                type="button"
                onClick={() => practice({ source: "resource", itemId: resource.id, itemType: "resource", title: resource.title })}
                className="text-left text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                Thực hành với tài nguyên này
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
