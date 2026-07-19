"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import { SingletonEditor } from "@/components/admin/SingletonEditor";
import type { FieldConfig } from "@/lib/admin/fields";

const STRATEGY_ID = "current";

type ConversationExample = {
  id: string;
  title: string;
  situation: string;
  sampleReply: string;
  status: string;
};

const strategyFields: FieldConfig[] = [
  { key: "intentRecognition", label: "Cách nhận diện ý định", type: "textarea", full: true },
  { key: "clarifyingQuestions", label: "Cách hỏi làm rõ", type: "textarea", full: true },
  { key: "stepByStepGuidance", label: "Cách hướng dẫn từng bước", type: "textarea", full: true },
  { key: "whenUnsure", label: "Cách phản hồi khi không biết", type: "textarea", full: true },
  { key: "whenUserIsLost", label: "Cách xử lý khi người dùng mất phương hướng", type: "textarea", full: true },
  { key: "nextSuggestion", label: "Cách đưa ra gợi ý tiếp theo", type: "textarea", full: true },
];

const exampleFields: FieldConfig[] = [
  { key: "title", label: "Tên tình huống", type: "text", required: true },
  { key: "situation", label: "Tình huống / câu hỏi mẫu", type: "textarea", full: true },
  { key: "sampleReply", label: "Câu trả lời mẫu", type: "textarea", full: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published"], required: true },
];

export function ConversationTab() {
  return (
    <div className="space-y-8">
      <SingletonEditor
        collectionKey="companion-conversation-strategy"
        id={STRATEGY_ID}
        title="Chiến lược hội thoại chung"
        description="Cách Companion dẫn dắt một cuộc trò chuyện, áp dụng cho mọi tình huống."
        fields={strategyFields}
      />

      <div className="border-t border-gray-200 pt-6">
        <VisualEditor<ConversationExample>
          collectionKey="companion-conversation-examples"
          title="Mẫu hội thoại & tình huống đặc biệt"
          itemNoun="mẫu"
          fields={exampleFields}
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
