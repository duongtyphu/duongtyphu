import { KnowledgeLibrary } from "@/features/knowledge/workspace/KnowledgeLibrary";

export const metadata = {
  title: "Thư viện AI — Hệ tri thức AI (CKOS)",
  description: "Thư viện AI — một mục con của Hệ tri thức AI (CKOS), nơi Lesson được xếp lên kệ theo từng chủ đề, có thứ tự đọc rõ ràng.",
};

export default function KnowledgeLibraryPage() {
  return <KnowledgeLibrary />;
}
