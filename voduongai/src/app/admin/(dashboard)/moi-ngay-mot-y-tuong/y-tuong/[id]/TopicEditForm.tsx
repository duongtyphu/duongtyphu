"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateMnytTopicAdmin, type MnytTopicFullRow } from "../actions";
import { SaveStateBadge, type SaveState } from "@/components/admin/SaveStateBadge";
import type { MnytQuiz } from "@/lib/portal/live-mnyt";

type FormValue = Omit<MnytTopicFullRow, "id">;
type Category = { key: string; name: string; name_en: string; color: string };

const inputClass = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none";
const taClass = `${inputClass} min-h-[90px] resize-y`;
const taSmall = `${inputClass} min-h-[140px] resize-y font-mono`;

const TABS = ["Cơ bản", "Nội dung (VI)", "Nội dung (EN)", "Câu hỏi (VI)", "Câu hỏi (EN)"] as const;
type Tab = (typeof TABS)[number];

function QuizEditor({ label, value, onChange }: { label: string; value: MnytQuiz; onChange: (v: MnytQuiz) => void }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <h3 className="mb-2 text-sm font-bold text-gray-900">{label}</h3>
      <input
        placeholder="Câu hỏi"
        value={value.question}
        onChange={(e) => onChange({ ...value, question: e.target.value })}
        className={`${inputClass} mb-2`}
      />
      <div className="grid gap-2 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <label key={i} className="flex items-center gap-2">
            <input
              type="radio"
              name={`${label}-correct`}
              checked={value.correct === i}
              onChange={() => onChange({ ...value, correct: i })}
              className="h-4 w-4 shrink-0"
              aria-label={`Đáp án đúng là lựa chọn ${i + 1}`}
            />
            <input
              placeholder={`Lựa chọn ${i + 1}`}
              value={value.options[i] ?? ""}
              onChange={(e) => {
                const options = [...value.options];
                options[i] = e.target.value;
                onChange({ ...value, options });
              }}
              className={inputClass}
            />
          </label>
        ))}
      </div>
      <textarea
        placeholder="Giải thích thêm (why — chỉ dùng ở bước Áp dụng, có thể để trống)"
        value={value.why ?? ""}
        onChange={(e) => onChange({ ...value, why: e.target.value })}
        className={`${inputClass} mt-2 min-h-[50px] resize-y`}
      />
    </div>
  );
}

export function TopicEditForm({
  topic,
  categories,
  deleteAction,
}: {
  topic: MnytTopicFullRow;
  categories: Category[];
  deleteAction: (id: string) => Promise<{ error: string | null }>;
}) {
  const router = useRouter();
  const { id, ...initial } = topic;
  const [value, setValue] = useState<FormValue>(initial);
  const [tab, setTab] = useState<Tab>("Cơ bản");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof FormValue>(key: K, v: FormValue[K]) {
    setValue((prev) => ({ ...prev, [key]: v }));
    setSaveState("dirty");
  }
  function setContent<K extends keyof FormValue["content"]>(key: K, v: FormValue["content"][K]) {
    setValue((prev) => ({ ...prev, content: { ...prev.content, [key]: v } }));
    setSaveState("dirty");
  }

  async function save() {
    setSaveState("saving");
    setError(null);
    const result = await updateMnytTopicAdmin(id, value);
    if (result.error) {
      setSaveState("error");
      setError(result.error);
      return;
    }
    setSaveState("saved");
  }

  async function remove() {
    if (!confirm(`Xoá hẳn ý tưởng "${value.title}"? Không thể hoàn tác.`)) return;
    const result = await deleteAction(id);
    if (result.error) {
      alert(result.error);
      return;
    }
    router.push("/admin/moi-ngay-mot-y-tuong/y-tuong");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">{value.title || "(chưa đặt tên)"}</h1>
          <p className="font-mono text-xs text-gray-400">{id} · ngày #{value.day}</p>
        </div>
        <div className="flex items-center gap-2">
          <SaveStateBadge state={saveState} isDirty={saveState === "dirty"} />
          <button onClick={save} disabled={saveState === "saving"} className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60">
            {saveState === "saving" ? "Đang lưu..." : "Lưu"}
          </button>
          <button onClick={remove} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Xoá</button>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-1 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-t-lg px-4 py-2 text-sm font-semibold transition ${tab === t ? "border-b-2 border-brand-blue text-brand-blue" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Cơ bản" && (
        <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-2">
          <input placeholder="Tiêu đề (VI)" value={value.title} onChange={(e) => set("title", e.target.value)} className={inputClass} />
          <input placeholder="Title (EN)" value={value.title_en} onChange={(e) => set("title_en", e.target.value)} className={inputClass} />
          <textarea placeholder="Câu mô tả ngắn / hook (VI)" value={value.hook} onChange={(e) => set("hook", e.target.value)} className={`${inputClass} min-h-[60px] resize-y`} />
          <textarea placeholder="Hook (EN)" value={value.hook_en} onChange={(e) => set("hook_en", e.target.value)} className={`${inputClass} min-h-[60px] resize-y`} />
          <select
            value={value.category_key}
            onChange={(e) => {
              const cat = categories.find((c) => c.key === e.target.value);
              if (!cat) return;
              setValue((prev) => ({ ...prev, category_key: cat.key, category_name: cat.name, category_name_en: cat.name_en, color: cat.color }));
              setSaveState("dirty");
            }}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c.key} value={c.key}>{c.name}</option>
            ))}
          </select>
          <select value={value.difficulty} onChange={(e) => set("difficulty", e.target.value)} className={inputClass}>
            <option value="Cơ bản">Cơ bản</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Nâng cao">Nâng cao</option>
          </select>
          <input type="number" placeholder="Số phút ước tính" value={value.est_minutes} onChange={(e) => set("est_minutes", Number(e.target.value))} className={inputClass} />
          <input type="number" placeholder="Số thứ tự (day, duy nhất 1-446+)" value={value.day} onChange={(e) => set("day", Number(e.target.value))} className={inputClass} />
          <input
            placeholder="Công cụ (cách nhau bởi dấu phẩy, VD: ChatGPT, Canva AI)"
            value={value.tools.join(", ")}
            onChange={(e) => set("tools", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            className={`${inputClass} sm:col-span-2`}
          />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={value.is_trending} onChange={(e) => set("is_trending", e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
            Đánh dấu &quot;Hot tuần này&quot; (trending)
          </label>
          <select value={value.status} onChange={(e) => set("status", e.target.value as FormValue["status"])} className={inputClass}>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Hidden">Hidden</option>
          </select>
        </div>
      )}

      {tab === "Nội dung (VI)" && (
        <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <label className="text-xs font-semibold text-gray-500">Khái niệm</label>
          <textarea value={value.content.concept} onChange={(e) => setContent("concept", e.target.value)} className={taClass} />
          <label className="text-xs font-semibold text-gray-500">Áp dụng thực tế</label>
          <textarea value={value.content.apply} onChange={(e) => setContent("apply", e.target.value)} className={taClass} />
          <label className="text-xs font-semibold text-gray-500">Cơ chế hoạt động</label>
          <textarea value={value.content.mechanism} onChange={(e) => setContent("mechanism", e.target.value)} className={taClass} />
          <label className="text-xs font-semibold text-gray-500">Rủi ro / lưu ý</label>
          <textarea value={value.content.risk} onChange={(e) => setContent("risk", e.target.value)} className={taClass} />
          <label className="text-xs font-semibold text-gray-500">Ghi nhớ (takeaway)</label>
          <textarea value={value.content.takeaway} onChange={(e) => setContent("takeaway", e.target.value)} className={taClass} />
          <label className="text-xs font-semibold text-gray-500">Prompt ví dụ (Bước 1 hiển thị)</label>
          <textarea value={value.content.promptExample} onChange={(e) => setContent("promptExample", e.target.value)} className={taSmall} />
          <label className="text-xs font-semibold text-gray-500">Prompt — Ngắn gọn</label>
          <textarea value={value.content.promptShort} onChange={(e) => setContent("promptShort", e.target.value)} className={taSmall} />
          <label className="text-xs font-semibold text-gray-500">Prompt — Chi tiết</label>
          <textarea value={value.content.promptDetailed} onChange={(e) => setContent("promptDetailed", e.target.value)} className={taSmall} />
          <label className="text-xs font-semibold text-gray-500">Prompt — Nâng cao</label>
          <textarea value={value.content.promptAdvanced} onChange={(e) => setContent("promptAdvanced", e.target.value)} className={taSmall} />
        </div>
      )}

      {tab === "Nội dung (EN)" && (
        <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <label className="text-xs font-semibold text-gray-500">Concept</label>
          <textarea value={value.content.conceptEn} onChange={(e) => setContent("conceptEn", e.target.value)} className={taClass} />
          <label className="text-xs font-semibold text-gray-500">Apply</label>
          <textarea value={value.content.applyEn} onChange={(e) => setContent("applyEn", e.target.value)} className={taClass} />
          <label className="text-xs font-semibold text-gray-500">Mechanism</label>
          <textarea value={value.content.mechanismEn} onChange={(e) => setContent("mechanismEn", e.target.value)} className={taClass} />
          <label className="text-xs font-semibold text-gray-500">Risk</label>
          <textarea value={value.content.riskEn} onChange={(e) => setContent("riskEn", e.target.value)} className={taClass} />
          <label className="text-xs font-semibold text-gray-500">Takeaway</label>
          <textarea value={value.content.takeawayEn} onChange={(e) => setContent("takeawayEn", e.target.value)} className={taClass} />
          <label className="text-xs font-semibold text-gray-500">Prompt — Short</label>
          <textarea value={value.content.promptShortEn} onChange={(e) => setContent("promptShortEn", e.target.value)} className={taSmall} />
          <label className="text-xs font-semibold text-gray-500">Prompt — Detailed</label>
          <textarea value={value.content.promptDetailedEn} onChange={(e) => setContent("promptDetailedEn", e.target.value)} className={taSmall} />
          <label className="text-xs font-semibold text-gray-500">Prompt — Advanced</label>
          <textarea value={value.content.promptAdvancedEn} onChange={(e) => setContent("promptAdvancedEn", e.target.value)} className={taSmall} />
        </div>
      )}

      {tab === "Câu hỏi (VI)" && (
        <div className="space-y-3">
          <QuizEditor label="Bước 3 · Thử thách nhỏ" value={value.content.quiz} onChange={(v) => setContent("quiz", v)} />
          <QuizEditor label="Tình huống (scenario)" value={value.content.scenarioQuiz} onChange={(v) => setContent("scenarioQuiz", v)} />
          <QuizEditor label="Bước 4 · Áp dụng" value={value.content.applyQuiz} onChange={(v) => setContent("applyQuiz", v)} />
        </div>
      )}

      {tab === "Câu hỏi (EN)" && (
        <div className="space-y-3">
          <QuizEditor label="Step 3 · Quick challenge" value={value.content.quizEn} onChange={(v) => setContent("quizEn", v)} />
          <QuizEditor label="Scenario" value={value.content.scenarioQuizEn} onChange={(v) => setContent("scenarioQuizEn", v)} />
          <QuizEditor label="Step 4 · Apply it" value={value.content.applyQuizEn} onChange={(v) => setContent("applyQuizEn", v)} />
        </div>
      )}
    </div>
  );
}
