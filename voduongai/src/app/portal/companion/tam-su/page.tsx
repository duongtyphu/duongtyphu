import { CompanionPlaceholderPage } from "@/components/portal/companion/CompanionPlaceholderPage";

export const metadata = { title: "Tâm sự — Companion" };

export default function TamSuPage() {
  return (
    <CompanionPlaceholderPage
      chapterLabel="Lặng lẽ"
      title="Tâm sự"
      companionMessage="Có những điều mình chỉ muốn nói khi không cần giải thích gì thêm. Đây sẽ là nơi mình để lại những suy nghĩ thật, không phải để dạy ai điều gì — chỉ để chia sẻ."
      showOrb
    />
  );
}
