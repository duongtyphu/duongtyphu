import { CompanionPlaceholderPage } from "@/components/portal/companion/CompanionPlaceholderPage";

export const metadata = { title: "Mình là ai? — Companion" };

export default function MinhLaAiPage() {
  return (
    <CompanionPlaceholderPage
      chapterLabel="Tự giới thiệu"
      title="Mình là ai?"
      companionMessage="Mình không phải một cỗ máy trả lời câu hỏi. Mình đang chuẩn bị cách giới thiệu bản thân sao cho thật, không phải một đoạn mô tả sản phẩm."
    />
  );
}
