"use client";

import { useEffect, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { getAllKnowledgeSeeds } from "@/features/knowledge";

type KnowledgeRef = {
  id: string;
  sourceCollection: string;
  sourceId: string;
  sourceLabel: string;
  priority: number;
  enabled: boolean;
  note: string;
  status: string;
};

type PickItem = { id: string; label: string };

const REAL_COLLECTION_SOURCES: { key: string; label: string }[] = [
  { key: "tools", label: "Công cụ AI" },
  { key: "prompts", label: "Prompt" },
  { key: "sop", label: "Workflow" },
  { key: "resources", label: "Resource" },
];

const SOURCE_LABELS: Record<string, string> = {
  tools: "Công cụ AI",
  prompts: "Prompt",
  sop: "Workflow",
  resources: "Resource",
  lesson: "Lesson",
  case_studies: "Case Study",
};

const UNAVAILABLE_SOURCES: { label: string; reason: string }[] = [
  {
    label: "Goals",
    reason: "Chưa có nguồn dữ liệu này trong hệ thống — cần bổ sung trước khi Companion tham chiếu được.",
  },
  {
    label: "Best Practice",
    reason: "Chưa có hệ thống lưu trữ cho loại tri thức này — bảng dự kiến chưa được triển khai trong production.",
  },
  {
    label: "FAQ",
    reason: "Chưa có nguồn dữ liệu này trong hệ thống — cần bổ sung trước khi Companion tham chiếu được.",
  },
];

/**
 * Tab "Tri thức" — CHỈ lưu tham chiếu {sourceCollection, sourceId} vào
 * companion-knowledge-refs, KHÔNG copy nội dung CKOS. 4 nguồn thật
 * (Tool/Prompt/Workflow/Resource) đọc trực tiếp qua useCollection() —
 * cùng cơ chế đã dùng ở /admin/ckos/*. Lesson đọc từ getAllKnowledgeSeeds()
 * (tĩnh, chỉ-đọc). Case Study đọc trực tiếp qua Supabase browser client
 * (bảng case_studies đã có RLS "public read khi active=true" từ trước,
 * không cần API mới). Goals/Best Practice/FAQ: không tồn tại trong hệ
 * thống thật — hiển thị đúng sự thật, không bịa dữ liệu.
 */
export function KnowledgeTab() {
  const { items: refs, ready, add, update, remove } = useCollection<KnowledgeRef>("companion-knowledge-refs", []);

  function findRef(sourceCollection: string, sourceId: string) {
    return refs.find((r) => r.sourceCollection === sourceCollection && r.sourceId === sourceId) ?? null;
  }

  async function toggleRef(sourceCollection: string, sourceId: string, sourceLabel: string) {
    const existing = findRef(sourceCollection, sourceId);
    if (existing) {
      await remove(existing.id);
    } else {
      await add({
        id: genId("companion-knowledge-refs"),
        sourceCollection,
        sourceId,
        sourceLabel,
        priority: 0,
        enabled: true,
        note: "",
        status: "Published",
      });
    }
  }

  async function sendToReviewQueue(sourceCollection: string, sourceId: string, sourceLabel: string) {
    await add({
      id: genId("companion-knowledge-refs"),
      sourceCollection,
      sourceId,
      sourceLabel,
      priority: 0,
      enabled: false,
      note: "Đề xuất — chờ duyệt",
      status: "Review",
    });
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Chọn những tri thức có sẵn trong Hệ tri thức (CKOS) mà Companion được phép tham chiếu. Chỉ lưu liên kết
        (ID), không sao chép nội dung — sửa nội dung gốc vẫn phải làm ở đúng trang quản lý CKOS tương ứng.
      </p>

      {!ready ? (
        <p className="text-sm text-gray-500">Đang tải...</p>
      ) : (
        <>
          {REAL_COLLECTION_SOURCES.map((source) => (
            <CollectionSourceSection
              key={source.key}
              sourceKey={source.key}
              sourceLabel={source.label}
              isSelected={(id) => Boolean(findRef(source.key, id))}
              onToggle={(id, label) => toggleRef(source.key, id, label)}
              onSendToReview={(id, label) => sendToReviewQueue(source.key, id, label)}
            />
          ))}

          <LessonSourceSection
            isSelected={(id) => Boolean(findRef("lesson", id))}
            onToggle={(id, label) => toggleRef("lesson", id, label)}
            onSendToReview={(id, label) => sendToReviewQueue("lesson", id, label)}
          />

          <CaseStudySourceSection
            isSelected={(id) => Boolean(findRef("case_studies", id))}
            onToggle={(id, label) => toggleRef("case_studies", id, label)}
            onSendToReview={(id, label) => sendToReviewQueue("case_studies", id, label)}
          />

          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5">
            <h3 className="text-sm font-bold text-gray-700">Nguồn chưa sẵn sàng</h3>
            <div className="mt-3 space-y-2">
              {UNAVAILABLE_SOURCES.map((s) => (
                <div key={s.label} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <p className="text-sm font-semibold text-gray-500">{s.label}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{s.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {refs.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-700">Đang tham chiếu ({refs.length})</h3>
              <div className="mt-2 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <th className="px-4 py-3">Nguồn</th>
                      <th className="px-4 py-3">Nội dung</th>
                      <th className="px-4 py-3">Trạng thái đề xuất</th>
                      <th className="px-4 py-3">Ưu tiên</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refs.map((r) => (
                      <tr key={r.id} className="border-b border-gray-100 last:border-0">
                        <td className="px-4 py-3 text-gray-500">{SOURCE_LABELS[r.sourceCollection] ?? r.sourceCollection}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{r.sourceLabel}</td>
                        <td className="px-4 py-3 text-gray-500">{r.status === "Review" ? "Chờ duyệt" : "Đang bật"}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={r.priority}
                            onChange={(e) => update(r.id, { priority: Number(e.target.value) } as Partial<KnowledgeRef>)}
                            className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-sm"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SourcePickerShell({
  title,
  items,
  loading,
  isSelected,
  onToggle,
  onSendToReview,
}: {
  title: string;
  items: PickItem[];
  loading: boolean;
  isSelected: (id: string) => boolean;
  onToggle: (id: string, label: string) => void;
  onSendToReview: (id: string, label: string) => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-bold text-gray-700">{title}</h3>
      {loading ? (
        <p className="mt-2 text-sm text-gray-500">Đang tải...</p>
      ) : items.length === 0 ? (
        <p className="mt-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
          Chưa có nội dung nào trong nguồn này.
        </p>
      ) : (
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {items.map((item) => {
            const selected = isSelected(item.id);
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between gap-2 rounded-xl border px-4 py-2.5 text-sm ${
                  selected ? "border-brand-blue bg-blue-50/40" : "border-gray-200 bg-white"
                }`}
              >
                <span className="truncate font-medium text-gray-900">{item.label}</span>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    onClick={() => onToggle(item.id, item.label)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                      selected ? "bg-brand-blue text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {selected ? "Đang bật" : "Bật"}
                  </button>
                  {!selected && (
                    <button
                      type="button"
                      onClick={() => onSendToReview(item.id, item.label)}
                      className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-50"
                    >
                      Đề xuất
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CollectionSourceSection({
  sourceKey,
  sourceLabel,
  isSelected,
  onToggle,
  onSendToReview,
}: {
  sourceKey: string;
  sourceLabel: string;
  isSelected: (id: string) => boolean;
  onToggle: (id: string, label: string) => void;
  onSendToReview: (id: string, label: string) => void;
}) {
  const { items, ready } = useCollection<{ id: string; name?: string; title?: string }>(sourceKey, []);
  const picks: PickItem[] = items.map((item) => ({ id: item.id, label: item.title ?? item.name ?? item.id }));
  return (
    <SourcePickerShell
      title={sourceLabel}
      items={picks}
      loading={!ready}
      isSelected={isSelected}
      onToggle={onToggle}
      onSendToReview={onSendToReview}
    />
  );
}

function LessonSourceSection({
  isSelected,
  onToggle,
  onSendToReview,
}: {
  isSelected: (id: string) => boolean;
  onToggle: (id: string, label: string) => void;
  onSendToReview: (id: string, label: string) => void;
}) {
  const picks: PickItem[] = getAllKnowledgeSeeds().map((seed) => ({ id: seed.id, label: seed.title }));
  return (
    <SourcePickerShell
      title="Lesson"
      items={picks}
      loading={false}
      isSelected={isSelected}
      onToggle={onToggle}
      onSendToReview={onSendToReview}
    />
  );
}

function CaseStudySourceSection({
  isSelected,
  onToggle,
  onSendToReview,
}: {
  isSelected: (id: string) => boolean;
  onToggle: (id: string, label: string) => void;
  onSendToReview: (id: string, label: string) => void;
}) {
  const [picks, setPicks] = useState<PickItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = getSupabaseBrowser();
      const { data } = await supabase.from("case_studies").select("id, title").order("id");
      if (!cancelled) {
        setPicks((data ?? []).map((row) => ({ id: String(row.id), label: row.title as string })));
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SourcePickerShell
      title="Case Study"
      items={picks}
      loading={loading}
      isSelected={isSelected}
      onToggle={onToggle}
      onSendToReview={onSendToReview}
    />
  );
}
