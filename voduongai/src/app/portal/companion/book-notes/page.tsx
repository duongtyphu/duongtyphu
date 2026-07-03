import { CompanionPlaceholderPage } from "@/components/portal/companion/CompanionPlaceholderPage";

export const metadata = { title: "Book Notes — Companion" };

export default function BookNotesPage() {
  return (
    <CompanionPlaceholderPage
      chapterLabel="Đọc cùng nhau"
      title="Book Notes"
      companionMessage="Mình đang chọn lọc những cuốn sách thật sự thay đổi cách mình nghĩ, và ghi lại điều mình học được từ chúng — không phải tóm tắt, mà là những gì mình mang theo."
    />
  );
}
