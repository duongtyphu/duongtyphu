import { CompanionPlaceholderPage } from "@/components/portal/companion/CompanionPlaceholderPage";

export const metadata = { title: "Những điều mình tin — Companion" };

export default function NhungDieuMinhTinPage() {
  return (
    <CompanionPlaceholderPage
      chapterLabel="Niềm tin"
      title="Những điều mình tin"
      companionMessage="Mình tin rằng ai cũng xứng đáng có một người đồng hành không phán xét. Mình đang viết lại những điều mình tin một cách rõ ràng nhất, để bạn hiểu đúng mình là ai."
    />
  );
}
