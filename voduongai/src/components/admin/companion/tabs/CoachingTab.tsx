"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import type { FieldConfig } from "@/lib/admin/fields";

const STRATEGY_ID = "current";

type TrainingScenario = {
  id: string;
  title: string;
  situation: string;
  expectedResponse: string;
  reviewerNotes: string;
  status: string;
};

const strategyFields: FieldConfig[] = [
  { key: "coachingStrategy", label: "Chiến lược dẫn dắt (coaching)", type: "textarea", full: true },
  { key: "reflectionStrategy", label: "Chiến lược phản tư (reflection)", type: "textarea", full: true },
  { key: "reflectionQuestions", label: "Câu hỏi phản tư mẫu", type: "textarea", full: true },
  { key: "actionSuggestions", label: "Cách gợi ý hành động", type: "textarea", full: true },
  { key: "toolSuggestions", label: "Cách gợi ý công cụ", type: "textarea", full: true },
  { key: "courseSuggestions", label: "Cách gợi ý khoá học", type: "textarea", full: true },
  { key: "roadmapSuggestions", label: "Cách gợi ý lộ trình", type: "textarea", full: true },
  { key: "evaluationCriteria", label: "Tiêu chí đánh giá phản hồi", type: "textarea", full: true },
];

const scenarioFields: FieldConfig[] = [
  { key: "title", label: "Tên tình huống huấn luyện", type: "text", required: true },
  { key: "situation", label: "Tình huống", type: "textarea", full: true },
  { key: "expectedResponse", label: "Phản hồi mong đợi", type: "textarea", full: true },
  { key: "reviewerNotes", label: "Ghi chú của người đánh giá", type: "textarea", full: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published"], required: true },
];

export function CoachingTab() {
  return (
    <div className="space-y-8">
      <SingletonEditor
        collectionKey="companion-coaching-strategy"
        id={STRATEGY_ID}
        title="Chiến lược dẫn dắt & huấn luyện chung"
        description="Cách Companion đồng hành, phản tư và gợi ý bước tiếp theo cho người dùng."
        fields={strategyFields}
      />

      <div className="border-t border-gray-200 pt-6">
        <VisualEditor<TrainingScenario>
          collectionKey="companion-training-scenarios"
          title="Tình huống huấn luyện mẫu"
          itemNoun="tình huống"
          fields={scenarioFields}
          renderCard={(item) => (
            <div>
              <p className="text-sm font-bold text-gray-900">{item.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.situation}</p>
            </div>
          )}
        />
      </div>
    </div>
  );
}
