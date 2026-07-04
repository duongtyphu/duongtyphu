"use client";

/**
 * EPIC 03 — Sprint B2: AI Workspace Execution Engine.
 *
 * `/portal/workspace` — nơi hội tụ (không thuộc Học viện AI, AI Workspace
 * hay Thư viện tri thức). Nhận context từ BẤT KỲ module nào gọi
 * `startCompanionWorkspace()`. Từ Sprint B2, đây không còn là trang chỉ
 * hiển thị lại context — Workspace tạo một `WorkspaceSession` thật (Pause/
 * Resume/Complete), có Execution Timeline, Task Panel theo từng bước,
 * Output Panel cho phép lưu kết quả thật (nhiều Version, không ghi đè),
 * và lịch sử đầy đủ (`workspace-session-store.ts`) — vẫn CHƯA gọi AI
 * thật, CHƯA có Agent thật; người dùng tự viết/dán Output của mình.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Pause, Play, Sparkles } from "lucide-react";
import { readWorkspaceContext, type WorkspaceContext } from "@/lib/portal/companion-workspace";
import type { PortalModule } from "@/companion/agents/agent.types";
import {
  EXECUTION_TIMELINE,
  createSession,
  findResumableSession,
  pauseSession,
  resumeSession,
  advanceStep,
  completeSession,
  saveOutputVersion,
  startReview,
  markOutputReviewed,
  startReflection,
  submitReflection,
  type OutputType,
  type WorkspaceSessionRecord,
} from "@/lib/portal/foundation/workspace-session-store";
import {
  EXECUTION_STEP_TASKS,
  REFLECTION_QUESTIONS,
  getNextAction,
} from "@/lib/portal/foundation/execution-orchestrator";
import { promoteEligibleOutputs } from "@/lib/portal/foundation/portfolio-store";
import { computeCapabilityProfiles } from "@/lib/portal/foundation/capability-engine";
import { recordNewUnlocks } from "@/lib/portal/foundation/mission-unlock-runtime";

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

const OUTPUT_TYPE_OPTIONS: { value: OutputType; label: string }[] = [
  { value: "markdown", label: "Markdown" },
  { value: "word", label: "Word" },
  { value: "excel", label: "Excel" },
  { value: "prompt", label: "Prompt" },
  { value: "pdf", label: "PDF" },
  { value: "image", label: "Image (link)" },
  { value: "link", label: "Link" },
  { value: "code", label: "Code" },
  { value: "landing_page", label: "Landing Page" },
];

export function WorkspaceMvp() {
  const searchParams = useSearchParams();
  const [context, setContext] = useState<WorkspaceContext | null>(null);
  const [session, setSession] = useState<WorkspaceSessionRecord | null>(null);
  const [draftContent, setDraftContent] = useState("");
  const [outputType, setOutputType] = useState<OutputType>("markdown");
  const [activeOutputId, setActiveOutputId] = useState<string | undefined>(undefined);
  const [reflectionDraft, setReflectionDraft] = useState<string[]>(REFLECTION_QUESTIONS.map(() => ""));

  useEffect(() => {
    // Ưu tiên context đầy đủ từ sessionStorage; query params chỉ là bản
    // dự phòng tối thiểu (vẫn hoạt động khi mở link trực tiếp/chia sẻ).
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
      missionId: searchParams.get("missionId") ?? undefined,
    });
  }, [searchParams]);

  // Tìm Session đang làm dở (Resume) hoặc tạo Session mới — chỉ chạy khi
  // context đã sẵn sàng và chưa có session trong state.
  useEffect(() => {
    if (!context || session) return;
    const resumable = findResumableSession(context);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(resumable ?? createSession(context));
  }, [context, session]);

  const goal = context?.userGoal ?? context?.title ?? "Chưa xác định mục tiêu cụ thể";
  const sourceLabel = context ? (SOURCE_LABEL[context.source] ?? context.source) : "Không rõ nguồn";
  const originModule = context ? MODULE_ROUTE[context.module] : null;
  const suggestion = context ? COMPANION_SUGGESTION[context.module] : undefined;
  const currentStep = session ? EXECUTION_STEP_TASKS[session.currentStepId] : null;
  const currentStepIndex = session ? EXECUTION_TIMELINE.findIndex((s) => s.id === session.currentStepId) : -1;
  const nextAction = session ? getNextAction(session) : null;

  function handleAdvanceStep() {
    if (!session) return;
    const nextIndex = Math.min(currentStepIndex + 1, EXECUTION_TIMELINE.length - 1);
    const nextStep = EXECUTION_TIMELINE[nextIndex];
    if (nextStep.id === "completed") {
      setSession(completeSession(session.sessionId));
      // Phase 2 (B4 hoàn thiện) — Unlock Runtime: kiểm tra lại Mission nào
      // vừa đủ điều kiện mở khóa ngay khi Mission hiện tại hoàn thành.
      recordNewUnlocks();
    } else {
      setSession(advanceStep(session.sessionId, nextStep.id));
    }
  }

  function handleSaveOutput() {
    if (!session || !draftContent.trim()) return;
    const result = saveOutputVersion(session.sessionId, { outputId: activeOutputId, type: outputType, content: draftContent.trim() });
    if (!result) return;
    setSession(result.session);
    setActiveOutputId(result.output.outputId);
    setDraftContent("");
  }

  function handlePauseResume() {
    if (!session) return;
    if (session.status === "paused") setSession(resumeSession(session.sessionId));
    else setSession(pauseSession(session.sessionId));
  }

  // Companion Orchestrator (Sprint B3): Review Coordination — chưa AI
  // thật, chỉ chuẩn hóa luồng reviewStatus + phát Event (REVIEW_STARTED),
  // rồi mở luôn Reflection Flow đúng thứ tự Review → Reflection.
  function handleMarkReviewed(outputId: string) {
    if (!session) return;
    startReview(session.sessionId, outputId);
    const reviewed = markOutputReviewed(session.sessionId, outputId);
    if (!reviewed) return;
    const opened = startReflection(session.sessionId, outputId);
    setSession(opened?.session ?? reviewed.session);
  }

  function handleSubmitReflection(outputId: string) {
    if (!session) return;
    const answers = REFLECTION_QUESTIONS.map((question, i) => ({ question, answer: reflectionDraft[i]?.trim() ?? "" })).filter(
      (a) => a.answer.length > 0
    );
    if (answers.length === 0) return;
    const result = submitReflection(session.sessionId, outputId, answers);
    if (!result) return;
    setSession(result.session);
    setReflectionDraft(REFLECTION_QUESTIONS.map(() => ""));
    // Sprint B4 — Portfolio Engine: Output đủ điều kiện (đã Review + đã
    // Reflection) tự động vào Portfolio, không cần bước "lưu vào Portfolio" riêng.
    promoteEligibleOutputs(result.session.sessionId, result.session);
    // Sprint B5 — Capability Engine: tính lại Capability từ Evidence thật
    // (Output + Reflection) ngay khi có Evidence mới — không có UI hiển
    // thị kết quả này trong sprint B5 (đúng brief "không cần UI").
    computeCapabilityProfiles();
    // Phase 2 (B4 hoàn thiện) — Capability vừa đổi cũng có thể đủ điều
    // kiện mở khóa Mission theo requiresCapability, kiểm tra lại ngay.
    recordNewUnlocks();
  }

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
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600">
            <Sparkles className="h-4 w-4" />
            Workspace
          </div>
          {session && (
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                  session.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : session.status === "paused"
                      ? "bg-gray-100 text-gray-600"
                      : "bg-blue-100 text-blue-700"
                }`}
              >
                {session.status === "completed" ? "Hoàn thành" : session.status === "paused" ? "Đã tạm dừng" : "Đang làm"}
              </span>
              {session.status !== "completed" && (
                <button
                  type="button"
                  onClick={handlePauseResume}
                  className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 transition hover:border-blue-300 hover:text-blue-600"
                >
                  {session.status === "paused" ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                  {session.status === "paused" ? "Tiếp tục" : "Tạm dừng"}
                </button>
              )}
            </div>
          )}
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

      {session && (
        <>
          {/* Next Action — Companion chỉ gợi ý MỘT hành động tiếp theo. */}
          {nextAction && (
            <section className="flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm">
              <Sparkles className="h-4 w-4 shrink-0 text-blue-500" />
              <span className="text-gray-700">Companion gợi ý: </span>
              <span className="font-semibold text-blue-700">{nextAction.label}</span>
            </section>
          )}

          {/* Execution Timeline */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-lg font-bold text-gray-900">Tiến trình</h2>
            <ol className="mt-4 flex flex-wrap items-center gap-2">
              {EXECUTION_TIMELINE.map((step, i) => {
                const state = i < currentStepIndex ? "done" : i === currentStepIndex ? "current" : "upcoming";
                return (
                  <li key={step.id} className="flex items-center gap-2">
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                        state === "done"
                          ? "bg-green-50 text-green-700"
                          : state === "current"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-50 text-gray-400"
                      }`}
                    >
                      {state === "done" && <Check className="h-3 w-3" />}
                      {step.label}
                    </span>
                    {i < EXECUTION_TIMELINE.length - 1 && <span className="text-gray-300">→</span>}
                  </li>
                );
              })}
            </ol>
          </section>

          {/* Task Panel */}
          {currentStep && session.status !== "completed" && (
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-lg font-bold text-gray-900">Việc đang thực hiện</h2>
              <div className="mt-3 space-y-2 text-sm text-gray-700">
                <p><span className="font-semibold text-gray-900">Bước hiện tại: </span>{currentStep.doing}</p>
                <p><span className="font-semibold text-gray-900">Việc cần làm: </span>{currentStep.task}</p>
                <p><span className="font-semibold text-gray-900">Mục tiêu: </span>{goal}</p>
                {context?.expectedOutput && (
                  <p><span className="font-semibold text-gray-900">Kết quả mong đợi: </span>{context.expectedOutput}</p>
                )}
              </div>
              <button
                type="button"
                onClick={handleAdvanceStep}
                className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
              >
                {currentStepIndex >= EXECUTION_TIMELINE.length - 2 ? "Hoàn thành Mission" : "Bước tiếp theo →"}
              </button>
            </section>
          )}

          {/* Output Panel */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-lg font-bold text-gray-900">Output</h2>
            {session.outputs.length === 0 ? (
              <p className="mt-2 text-sm text-gray-400">Chưa có Output nào — viết/dán kết quả của bạn vào khung bên dưới.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {session.outputs.map((output) => (
                  <div key={output.outputId} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wide text-blue-600">{output.type}</span>
                      <span className="text-[10px] text-gray-400">
                        {output.reviewStatus === "reviewed" ? "Đã review" : "Chờ review"} · v{output.versions.length}
                      </span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700 line-clamp-3">
                      {output.versions[output.versions.length - 1]?.content}
                    </p>
                    <p className="mt-1 text-[10px] text-gray-400">
                      Cập nhật {new Date(output.updatedAt).toLocaleString("vi-VN")}
                    </p>

                    {output.versions.length > 1 && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-[10px] font-semibold text-gray-500 hover:text-gray-700">
                          Lịch sử phiên bản ({output.versions.length})
                        </summary>
                        <ol className="mt-1.5 space-y-1 border-l border-gray-200 pl-3">
                          {output.versions.map((v) => (
                            <li key={v.versionNumber} className="text-[10px] text-gray-500">
                              v{v.versionNumber}
                              {v.versionNumber === output.versions.length && output.reviewStatus === "reviewed" ? " · Final" : ""}
                              {" — "}
                              {new Date(v.editedAt).toLocaleString("vi-VN")}
                            </li>
                          ))}
                        </ol>
                      </details>
                    )}

                    {output.reviewStatus !== "reviewed" && (
                      <button
                        type="button"
                        onClick={() => handleMarkReviewed(output.outputId)}
                        className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
                      >
                        Review cùng Companion →
                      </button>
                    )}

                    {output.reviewStatus === "reviewed" && output.reflectionStatus !== "submitted" && (
                      <div className="mt-3 space-y-2 rounded-lg border border-violet-100 bg-violet-50/40 p-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-violet-600">Reflection</p>
                        {REFLECTION_QUESTIONS.map((question, i) => (
                          <div key={question} className="space-y-1">
                            <label className="text-xs text-gray-600">{question}</label>
                            <input
                              type="text"
                              value={reflectionDraft[i]}
                              onChange={(e) => setReflectionDraft((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))}
                              className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-900 outline-none focus:border-violet-400"
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleSubmitReflection(output.outputId)}
                          className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-violet-700"
                        >
                          Gửi Reflection
                        </button>
                      </div>
                    )}

                    {output.reflectionStatus === "submitted" && output.reflections.length > 0 && (
                      <div className="mt-3 space-y-1 rounded-lg border border-green-100 bg-green-50/40 p-3 text-xs text-gray-600">
                        {output.reflections.slice(-REFLECTION_QUESTIONS.length).map((r, i) => (
                          <p key={`${r.question}-${i}`}><span className="font-semibold text-gray-800">{r.question}</span> {r.answer}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {session.status !== "completed" && (
              <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="output-type" className="text-xs font-semibold text-gray-500">Loại Output</label>
                  <select
                    id="output-type"
                    value={outputType}
                    onChange={(e) => setOutputType(e.target.value as OutputType)}
                    className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-700"
                  >
                    {OUTPUT_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  placeholder="Viết hoặc dán nội dung Output thật của bạn vào đây…"
                  rows={6}
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={handleSaveOutput}
                  disabled={!draftContent.trim()}
                  className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Lưu phiên bản mới
                </button>
              </div>
            )}
          </section>

          {/* History */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-lg font-bold text-gray-900">Lịch sử</h2>
            <ol className="mt-3 space-y-2">
              {session.history.map((entry, i) => (
                <li key={`${entry.occurredAt}-${i}`} className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-medium text-gray-700">{entry.label}</span>
                  <span>{new Date(entry.occurredAt).toLocaleString("vi-VN")}</span>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}

      <Link
        href={originModule?.href ?? "/portal/khong-gian-ai"}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại {originModule?.label ?? "AI Workspace"}
      </Link>
    </div>
  );
}
