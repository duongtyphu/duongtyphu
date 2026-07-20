"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import type { FieldConfig } from "@/lib/admin/fields";

type TestCase = {
  id: string;
  title: string;
  question: string;
  expectedBehavior: string;
  passCriteria: string;
  importance: string;
  scenarioGroup: string;
  versionTested: string;
  result: string;
  reviewNotes: string;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "title", label: "Tên tình huống", type: "text", required: true },
  { key: "question", label: "Câu hỏi thử", type: "textarea", full: true, required: true },
  { key: "expectedBehavior", label: "Hành vi mong đợi", type: "textarea", full: true },
  { key: "passCriteria", label: "Tiêu chí đạt", type: "textarea", full: true },
  { key: "importance", label: "Mức độ quan trọng", type: "select", options: ["Thấp", "Trung bình", "Cao"] },
  { key: "scenarioGroup", label: "Nhóm tình huống", type: "text" },
  { key: "versionTested", label: "Phiên bản đã kiểm tra", type: "text", placeholder: "vd. v3 hoặc Bản nháp" },
  { key: "result", label: "Kết quả", type: "select", options: ["Chưa chạy", "Đạt", "Chưa đạt"] },
  { key: "reviewNotes", label: "Ghi chú đánh giá", type: "textarea", full: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published"], required: true },
];

/**
 * Tab "Kiểm tra Companion" — quản lý THƯ VIỆN test case (tái sử dụng được
 * qua nhiều lần kiểm tra), không phải log 1 lần dùng xong bỏ. CHƯA có Chat
 * runtime nào cho Companion end-user (đã xác nhận qua rà soát toàn bộ
 * codebase) nên KHÔNG giả lập phản hồi — Founder tự đánh giá "Kết quả" dựa
 * trên phán đoán riêng. Lưu vào companion-test-sessions — KHÔNG đụng
 * reflections/memory_capsules (bảng người dùng thật).
 */
export function TestTab() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>Chưa kết nối hệ thống trả lời.</strong> Companion hiện chưa có hệ thống trò chuyện/AI thật nào để
        tạo phản hồi — soạn test case ở đây trước, tự đánh giá Đạt/Chưa đạt bằng phán đoán riêng khi có hệ thống
        trả lời thật để chạy thử.
      </div>
      <VisualEditor<TestCase>
        collectionKey="companion-test-sessions"
        title="Test case"
        itemNoun="tình huống"
        fields={fields}
        renderCard={(item) => (
          <div>
            <p className="text-sm font-bold text-gray-900">{item.title}</p>
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.question}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  item.result === "Đạt"
                    ? "bg-emerald-100 text-emerald-700"
                    : item.result === "Chưa đạt"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {item.result || "Chưa chạy"}
              </span>
              {item.scenarioGroup && <span className="text-[11px] text-gray-400">{item.scenarioGroup}</span>}
            </div>
          </div>
        )}
      />
    </div>
  );
}
