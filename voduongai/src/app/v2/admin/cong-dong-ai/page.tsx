import { CalendarDays, FileText, ShieldAlert, Users } from "lucide-react";

import { DataTable } from "@/components/v2/ui/DataTable";
import type { TableRow } from "@/components/v2/ui/DataTable";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { PageHead, SaveButton } from "@/components/v2/ui/PageHead";
import { formatDate } from "@/lib/v2/data/client";
import { listCommunityPosts } from "@/lib/v2/data/catalog";

export const metadata = { title: "Cộng đồng AI — Admin" };

export default async function AdminCongDongPage() {
  const posts = await listCommunityPosts();

  const rows: TableRow[] = posts.map((post) => {
    // Bài chưa được ghim và tương tác rất thấp là bài đang chờ kiểm duyệt.
    const pending = !post.pinned && post.likes < 10;

    return {
      id: post.id,
      tags: [pending ? "pending" : "published", post.pinned ? "pinned" : "normal"],
      cells: [
        { t: "strong", v: post.title },
        {
          t: "user",
          initials: post.authorInitials,
          name: post.authorName,
          sub: `${post.likes} thích · ${post.comments} bình luận`,
        },
        {
          t: "tag",
          label: post.topic,
          background: "var(--v2-violet-light)",
          color: "var(--v2-violet)",
        },
        {
          t: "status",
          label: pending ? "Chờ kiểm duyệt" : post.pinned ? "Đã ghim" : "Đã đăng",
          color: pending ? "var(--v2-red)" : post.pinned ? "var(--v2-gold)" : "var(--v2-green)",
        },
        { t: "muted", v: formatDate(post.createdAt) },
      ],
    };
  });

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Nội dung Portal › Cộng đồng AI"
        title="Quản lý Cộng đồng AI"
        description="Kiểm duyệt bài viết, quản lý nhóm thảo luận và sự kiện cộng đồng."
        action={<SaveButton />}
      />

      <KpiGrid
        items={[
          { id: "posts", value: "18.240", label: "Bài viết đã đăng", icon: FileText, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)", delta: "9,2%", trend: "up" },
          { id: "groups", value: "9", label: "Nhóm thảo luận", icon: Users, gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)" },
          { id: "events", value: "6", label: "Sự kiện sắp diễn ra", icon: CalendarDays, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)" },
          { id: "pending", value: "14", label: "Bài chờ kiểm duyệt", icon: ShieldAlert, gradient: "linear-gradient(145deg,#ff9d52,#c2660a)", delta: "3,1%", trend: "down" },
        ]}
      />

      <DataTable
        title="Bài viết cộng đồng"
        headers={["Bài viết", "Tác giả", "Chủ đề", "Trạng thái", "Ngày đăng"]}
        rows={rows}
        totalLabel="bài viết"
        totalOverride={18240}
        searchPlaceholder="Tìm bài viết hoặc tác giả..."
        filterTabs={[
          { id: "all", label: "Tất cả" },
          { id: "pending", label: "Chờ kiểm duyệt", tag: "pending" },
          { id: "pinned", label: "Đã ghim", tag: "pinned" },
        ]}
      />
    </div>
  );
}
