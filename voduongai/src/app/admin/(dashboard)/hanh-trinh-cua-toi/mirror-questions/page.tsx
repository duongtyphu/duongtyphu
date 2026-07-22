"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * Việc 9 — "Hành trình của tôi", cửa Mirror. Thay MIRROR_QUESTIONS
 * (src/lib/portal/growth-map/mirror-question.ts) — mỗi dòng 1 câu hỏi,
 * xoay vòng theo ngày qua todaysMirrorQuestion() (giữ nguyên logic, chỉ
 * đổi nguồn mảng — xem CLAUDE.md mục "Hành trình của tôi").
 */
type MirrorQuestion = {
  id: string;
  content: string;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "content", label: "Câu hỏi", type: "textarea", full: true, required: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminMirrorQuestionsPage() {
  return (
    <AdminAtmosphere atmosphereClassName="mirror-chamber-bg">
      <VisualEditor<MirrorQuestion>
        collectionKey="mirror-questions"
        title="Mirror — Câu hỏi (Tự hỏi)"
        itemNoun="câu"
        fields={fields}
        renderCard={(item) => <p className="text-sm text-gray-700">{item.content}</p>}
      />
    </AdminAtmosphere>
  );
}
