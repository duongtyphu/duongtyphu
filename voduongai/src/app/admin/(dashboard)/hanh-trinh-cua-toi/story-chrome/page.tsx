"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * Việc 9 — "Hành trình của tôi", cửa My Story. CHỈ static chrome — 1 dòng
 * duy nhất (id='story'). KHÔNG đụng JOURNEY_CHAPTER_NAMES (dùng chung 3
 * cửa, index gắn evidence sentence động) hay KIND_LABEL (enum map
 * MemoryCapsuleKind→label) — xem MyStoryBook.tsx (`/portal/story`).
 */
type StoryChrome = {
  id: string;
  title: string;
  subtitle: string;
  emptyStateLine1: string;
  emptyStateLine2: string;
  monthlyLetterLabel: string;
  momentsSectionLabel: string;
  turningPointsSectionLabel: string;
  lessonsSectionLabel: string;
  createdSectionLabel: string;
  createdEmptyLine: string;
  capsulesSectionLabel: string;
  storageNotReadyLine: string;
  writeNookSectionLabel: string;
  nextChapterPrompt: string;
  nextChapterCtaLabel: string;
  mirrorPromptPrefix: string;
  mirrorLinkLabel: string;
  writeNookNotReadyLine: string;
  thankYouLine: string;
  reflectionPlaceholder: string;
  saveReflectionCtaLabel: string;
  momentPrompt: string;
  momentPlaceholder: string;
  saveMomentCtaLabel: string;
  savedMomentLabel: string;
  noReflectionsLine: string;
  removeLabel: string;
  removeConfirmLabel: string;
  removeCtaLabel: string;
  keepCtaLabel: string;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "subtitle", label: "Câu phụ đề", type: "textarea", full: true, required: true },
  { key: "emptyStateLine1", label: "Trạng thái trống — dòng 1", type: "textarea", full: true, required: true },
  { key: "emptyStateLine2", label: "Trạng thái trống — dòng 2", type: "textarea", full: true, required: true },
  { key: "monthlyLetterLabel", label: "Tiền tố 'Lá thư tháng' (ghép với tên tháng)", type: "text", required: true },
  { key: "momentsSectionLabel", label: "Nhãn mục 'Những khoảnh khắc quan trọng'", type: "text", required: true },
  { key: "turningPointsSectionLabel", label: "Nhãn mục 'Bước ngoặt'", type: "text", required: true },
  { key: "lessonsSectionLabel", label: "Nhãn mục 'Những bài học đã thay đổi tôi'", type: "text", required: true },
  { key: "createdSectionLabel", label: "Nhãn mục 'Những gì tôi đã tạo ra'", type: "text", required: true },
  { key: "createdEmptyLine", label: "Dòng chữ khi chưa có tác phẩm nào", type: "textarea", full: true, required: true },
  { key: "capsulesSectionLabel", label: "Nhãn mục 'Những điều bạn tự gìn giữ'", type: "text", required: true },
  { key: "storageNotReadyLine", label: "Dòng chữ khi lưu trữ chưa sẵn sàng", type: "textarea", full: true, required: true },
  { key: "writeNookSectionLabel", label: "Nhãn mục 'Viết một trang mới'", type: "text", required: true },
  { key: "nextChapterPrompt", label: "Lời mời 'Chương tiếp theo...'", type: "textarea", full: true, required: true },
  { key: "nextChapterCtaLabel", label: "Nhãn nút 'Bắt đầu viết tiếp'", type: "text", required: true },
  { key: "mirrorPromptPrefix", label: "Tiền tố dòng mời mở Mirror", type: "text", required: true },
  { key: "mirrorLinkLabel", label: "Nhãn link 'Mở Mirror'", type: "text", required: true },
  { key: "writeNookNotReadyLine", label: "WriteNook — dòng khi khu lưu ký ức chưa sẵn sàng", type: "textarea", full: true, required: true },
  { key: "thankYouLine", label: "WriteNook — dòng cảm ơn sau khi đã suy ngẫm hôm nay", type: "textarea", full: true, required: true },
  { key: "reflectionPlaceholder", label: "WriteNook — placeholder ô suy ngẫm", type: "text", required: true },
  { key: "saveReflectionCtaLabel", label: "WriteNook — nhãn nút lưu suy ngẫm", type: "text", required: true },
  { key: "momentPrompt", label: "WriteNook — lời mời lưu khoảnh khắc khác", type: "text", required: true },
  { key: "momentPlaceholder", label: "WriteNook — placeholder ô khoảnh khắc", type: "text", required: true },
  { key: "saveMomentCtaLabel", label: "WriteNook — nhãn nút lưu khoảnh khắc", type: "text", required: true },
  { key: "savedMomentLabel", label: "WriteNook — nhãn nút sau khi đã lưu", type: "text", required: true },
  { key: "noReflectionsLine", label: "WriteNook — dòng khi chưa có suy ngẫm nào", type: "textarea", full: true, required: true },
  { key: "removeLabel", label: "Nhãn nút 'Gỡ khỏi cuốn sách'", type: "text", required: true },
  { key: "removeConfirmLabel", label: "Dòng xác nhận 'Chắc chắn?'", type: "text", required: true },
  { key: "removeCtaLabel", label: "Nhãn nút 'Xoá' (xác nhận gỡ)", type: "text", required: true },
  { key: "keepCtaLabel", label: "Nhãn nút 'Giữ lại' (huỷ gỡ)", type: "text", required: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminStoryChromePage() {
  return (
    <AdminAtmosphere atmosphereClassName="story-book-bg">
      <VisualEditor<StoryChrome>
        collectionKey="story-chrome"
        title="My Story — Nội dung tĩnh"
        itemNoun="mục"
        fields={fields}
        renderCard={(item) => (
          <div>
            <p className="text-sm font-bold text-gray-900">{item.title}</p>
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.subtitle}</p>
          </div>
        )}
      />
    </AdminAtmosphere>
  );
}
