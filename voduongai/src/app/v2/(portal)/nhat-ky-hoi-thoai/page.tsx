import Link from "next/link";
import { ChevronRight, MessageSquare } from "lucide-react";

import { V2_PORTAL_BASE } from "@/components/v2/nav/nav-config";
import { Card, CardHead, SectionHead } from "@/components/v2/ui/Card";
import { IcoBox } from "@/components/v2/ui/IcoBox";
import { formatDateTime } from "@/lib/v2/data/client";
import { listConversations } from "@/lib/v2/data/companion";

export const metadata = { title: "Nhật ký hội thoại" };

export default async function NhatKyHoiThoaiPage() {
  const conversations = await listConversations();
  const totalMessages = conversations.reduce(
    (sum, conversation) => sum + conversation.messageCount,
    0,
  );

  return (
    <div className="flex items-start gap-[22px] px-7 py-6">
      <div className="flex min-w-0 flex-1 flex-col gap-[26px]">
        <div className="flex items-center justify-between gap-5">
          <div>
            <h1 className="text-[24px] font-extrabold">Nhật ký hội thoại</h1>
            <p className="mt-[6px] text-[14px] text-[var(--v2-muted)]">
              Toàn bộ cuộc trò chuyện với Companion, kèm tóm tắt để bạn tìm lại nhanh.
            </p>
          </div>
          <IcoBox
            icon={MessageSquare}
            size="xl"
            background="linear-gradient(145deg,#8b6bff,#5a37e6)"
            color="#fff"
            className="max-[900px]:hidden"
          />
        </div>

        <section>
          <SectionHead title={`${conversations.length} cuộc trò chuyện`} />
          <div className="flex flex-col gap-[14px]">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`${V2_PORTAL_BASE}/companion`}
                className="text-inherit"
              >
                <Card className="transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(109,74,255,.1)]">
                  <div className="flex items-start gap-3">
                    <IcoBox icon={MessageSquare} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-[14.5px] font-bold">{conversation.title}</h3>
                        <span className="text-[11.5px] text-[var(--v2-muted)]">
                          {formatDateTime(conversation.lastMessageAt)}
                        </span>
                      </div>
                      <p className="text-[13px] leading-[1.55] text-[var(--v2-muted)]">
                        {conversation.summary}
                      </p>
                      <div className="mt-2 text-[11.5px] font-bold text-[var(--v2-muted)]">
                        {conversation.messageCount} tin nhắn
                      </div>
                    </div>
                    <ChevronRight
                      className="mt-1 h-4 w-4 shrink-0 text-[var(--v2-muted)]"
                      aria-hidden="true"
                    />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <aside className="flex w-[320px] shrink-0 flex-col gap-[18px] max-[1100px]:hidden">
        <Card>
          <CardHead title="Thống kê" />
          <div className="grid grid-cols-2 gap-[10px]">
            {[
              { label: "Cuộc trò chuyện", value: String(conversations.length) },
              { label: "Tổng tin nhắn", value: String(totalMessages) },
              {
                label: "TB / cuộc",
                value: String(Math.round(totalMessages / conversations.length)),
              },
              { label: "Đã lưu", value: "2" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[10px] bg-[var(--v2-bg)] p-[10px] text-center">
                <div className="text-[15px] font-extrabold">{stat.value}</div>
                <div className="mt-[2px] text-[10.5px] text-[var(--v2-muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  );
}
