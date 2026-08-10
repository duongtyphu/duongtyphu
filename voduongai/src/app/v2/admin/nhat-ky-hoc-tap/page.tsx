import { BookMarked, MessageSquare, NotebookPen, Tags, Users } from "lucide-react";

import { DataTable } from "@/components/v2/ui/DataTable";
import type { TableRow } from "@/components/v2/ui/DataTable";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { PageHead, SaveButton } from "@/components/v2/ui/PageHead";
import { formatDate } from "@/lib/v2/data/client";
import { listJournalEntries } from "@/lib/v2/data/catalog";
import { listConversations } from "@/lib/v2/data/companion";

export const metadata = { title: "Nhật ký học tập — Admin" };

export default async function AdminNhatKyPage() {
  const [entries, conversations] = await Promise.all([
    listJournalEntries(),
    listConversations(),
  ]);

  const entryRows: TableRow[] = entries.map((entry) => ({
    id: entry.id,
    cells: [
      { t: "strong", v: entry.title },
      {
        t: "tag",
        label: entry.tags[0] ?? "Khác",
        background: "var(--v2-violet-light)",
        color: "var(--v2-violet)",
      },
      { t: "muted", v: entry.mood },
      { t: "text", v: `${entry.minutesLearned} phút` },
      { t: "muted", v: formatDate(entry.date) },
    ],
  }));

  const convRows: TableRow[] = conversations.map((conversation) => ({
    id: conversation.id,
    cells: [
      { t: "strong", v: conversation.title },
      { t: "muted", v: conversation.summary },
      { t: "text", v: `${conversation.messageCount} tin nhắn` },
      { t: "muted", v: formatDate(conversation.lastMessageAt) },
    ],
  }));

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Tiện ích nhanh › Nhật ký học tập"
        title="Quản lý Nhật ký học tập"
        description="Quản lý các mục nhật ký mẫu, thẻ phân loại hiển thị trên Portal."
        action={<SaveButton />}
      />

      <KpiGrid
        columns={5}
        items={[
          { id: "entries", value: "86.420", label: "Tổng mục nhật ký", icon: NotebookPen, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)", delta: "9,1%", trend: "up" },
          { id: "writers", value: "5.840", label: "Người dùng ghi nhật ký", icon: Users, gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)", delta: "6,3%", trend: "up" },
          { id: "tags", value: "12", label: "Thẻ phân loại", icon: Tags, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)" },
          { id: "avg", value: "14,8", label: "Mục / người dùng (TB)", icon: BookMarked, gradient: "linear-gradient(145deg,#e2b23c,#a9660f)", delta: "1,2", trend: "up" },
          { id: "convs", value: "214.860", label: "Tổng cuộc hội thoại", icon: MessageSquare, gradient: "linear-gradient(145deg,#ff9d52,#c2660a)", delta: "12,7%", trend: "up" },
        ]}
      />

      <DataTable
        title="Mục nhật ký mẫu"
        headers={["Mục nhật ký", "Thẻ", "Cảm xúc", "Thời lượng", "Ngày"]}
        rows={entryRows}
        totalLabel="mục"
        totalOverride={86420}
        searchPlaceholder="Tìm mục nhật ký..."
      />

      <DataTable
        title="Nhật ký hội thoại Companion"
        headers={["Tiêu đề", "Tóm tắt", "Tin nhắn", "Cập nhật"]}
        rows={convRows}
        totalLabel="hội thoại"
        totalOverride={214860}
        pageSize={6}
      />
    </div>
  );
}
