import Link from "next/link";
import { CalendarDays, MessageSquare, Pin, ThumbsUp, Users } from "lucide-react";

import { V2_PORTAL_BASE } from "@/components/v2/nav/nav-config";
import { Card, CardHead, SectionHead } from "@/components/v2/ui/Card";
import { Badge } from "@/components/v2/ui/Display";
import { IcoBox } from "@/components/v2/ui/IcoBox";
import { formatDate } from "@/lib/v2/data/client";
import { listCommunityPosts } from "@/lib/v2/data/catalog";

export const metadata = { title: "Cộng đồng AI" };

const GROUPS = [
  { id: "g1", name: "Người mới bắt đầu", members: 6240 },
  { id: "g2", name: "Prompt & Kỹ thuật", members: 3810 },
  { id: "g3", name: "Tự động hoá & Agent", members: 2470 },
  { id: "g4", name: "AI cho kinh doanh", members: 4120 },
  { id: "g5", name: "Chia sẻ kết quả thật", members: 1980 },
];

const EVENTS = [
  { id: "e1", name: "Webinar: AI Agent trong doanh nghiệp", date: "2026-08-14" },
  { id: "e2", name: "Workshop: Xây bộ prompt cho đội nhóm", date: "2026-08-21" },
  { id: "e3", name: "Hỏi đáp cùng Founder", date: "2026-08-28" },
];

export default async function CongDongAiPage() {
  const posts = await listCommunityPosts();
  const visible = posts.filter((post) => post.pinned || post.likes >= 10);

  return (
    <div className="flex items-start gap-[22px] px-7 py-6">
      <div className="flex min-w-0 flex-1 flex-col gap-[26px]">
        <div className="flex items-center justify-between gap-5">
          <div>
            <h1 className="text-[24px] font-extrabold">Cộng đồng AI</h1>
            <p className="mt-[6px] text-[14px] text-[var(--v2-muted)]">
              Nơi người học AI chia sẻ kết quả thật, hỏi đáp thật và đi cùng nhau đường dài.
            </p>
          </div>
          <IcoBox
            icon={Users}
            size="xl"
            background="linear-gradient(145deg,#8b6bff,#5a37e6)"
            color="#fff"
            className="max-[900px]:hidden"
          />
        </div>

        <section>
          <SectionHead title="Bài viết nổi bật" />
          <div className="flex flex-col gap-[14px]">
            {visible.map((post) => (
              <Card key={post.id}>
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8b7bde,#5f4bc9)] text-[13px] font-bold text-white">
                    {post.authorInitials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-bold">{post.authorName}</span>
                      <span className="text-[11.5px] text-[var(--v2-muted)]">
                        {formatDate(post.createdAt)}
                      </span>
                      <Badge>{post.topic}</Badge>
                      {post.pinned ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-[var(--v2-gold)]">
                          <Pin className="h-[12px] w-[12px]" aria-hidden="true" />
                          Đã ghim
                        </span>
                      ) : null}
                    </div>
                    <h3 className="text-[15px] leading-[1.35] font-bold">{post.title}</h3>
                    <p className="mt-1 text-[13px] leading-[1.5] text-[var(--v2-muted)]">
                      {post.excerpt}
                    </p>
                    <div className="mt-3 flex gap-4 text-[12px] text-[var(--v2-muted)]">
                      <span className="flex items-center gap-[6px]">
                        <ThumbsUp className="h-[14px] w-[14px]" aria-hidden="true" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-[6px]">
                        <MessageSquare className="h-[14px] w-[14px]" aria-hidden="true" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <aside className="flex w-[320px] shrink-0 flex-col gap-[18px] max-[1100px]:hidden">
        <Card>
          <CardHead title="Nhóm thảo luận" />
          {GROUPS.map((group) => (
            <Link
              key={group.id}
              href={`${V2_PORTAL_BASE}/cong-dong-ai`}
              className="flex items-center justify-between border-b border-[var(--v2-line)] py-[10px] text-inherit last:border-b-0"
            >
              <span className="text-[13px] font-semibold">{group.name}</span>
              <span className="text-[11.5px] text-[var(--v2-muted)]">
                {group.members.toLocaleString("vi-VN")}
              </span>
            </Link>
          ))}
        </Card>

        <Card>
          <CardHead title="Sự kiện sắp diễn ra" />
          {EVENTS.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-[10px] border-b border-[var(--v2-line)] py-[10px] last:border-b-0"
            >
              <CalendarDays
                className="mt-[2px] h-4 w-4 shrink-0 text-[var(--v2-violet)]"
                aria-hidden="true"
              />
              <div>
                <div className="text-[12.8px] font-semibold">{event.name}</div>
                <div className="text-[11px] text-[var(--v2-muted)]">{formatDate(event.date)}</div>
              </div>
            </div>
          ))}
        </Card>
      </aside>
    </div>
  );
}
