import { Gauge, MessageSquare, Smile, Users } from "lucide-react";

import { Card, CardHead } from "@/components/v2/ui/Card";
import { Toggle } from "@/components/v2/ui/Controls";
import { Field, SelectField, TextareaField } from "@/components/v2/ui/Field";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { PageHead, SaveButton } from "@/components/v2/ui/PageHead";
import { formatDate } from "@/lib/v2/data/client";
import { listConversations } from "@/lib/v2/data/companion";

export const metadata = { title: "Companion AI — Admin" };

export default async function AdminCompanionPage() {
  const conversations = await listConversations();

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Nội dung Portal › Companion AI"
        title="Quản lý Companion AI"
        description="Cấu hình personality, bộ nhớ, giới hạn sử dụng và theo dõi hoạt động Companion."
        action={<SaveButton />}
      />

      <KpiGrid
        items={[
          { id: "convs", value: "142.850", label: "Cuộc trò chuyện (30 ngày)", icon: MessageSquare, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)", delta: "12,7%", trend: "up" },
          { id: "users", value: "9.240", label: "Người dùng hoạt động", icon: Users, gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)", delta: "6,9%", trend: "up" },
          { id: "latency", value: "2,4s", label: "Thời gian phản hồi TB", icon: Gauge, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)", delta: "0,3s", trend: "up" },
          { id: "csat", value: "94,6%", label: "Mức độ hài lòng", icon: Smile, gradient: "linear-gradient(145deg,#e2b23c,#a9660f)", delta: "1,2%", trend: "up" },
        ]}
      />

      <div className="grid grid-cols-1 gap-5 min-[1180px]:grid-cols-[1.3fr_1fr]">
        <Card padding="admin">
          <CardHead title="Cấu hình Personality" />
          <Field label="Tên hiển thị" defaultValue="Companion" />
          <TextareaField
            label="Lời chào mở đầu"
            rows={3}
            defaultValue="Xin chào! 👋 Mình là Companion, AI Mentor của bạn. Hôm nay bạn muốn học gì, làm gì, hay khám phá điều gì mới?"
          />
          <TextareaField
            label="Nguyên tắc ứng xử"
            rows={5}
            defaultValue={
              "Đồng hành, không phán xét. Trả lời dựa trên bối cảnh và mục tiêu người dùng đã chia sẻ. Không bịa số liệu; khi không chắc thì nói rõ là không chắc. Ưu tiên gợi ý hành động cụ thể hơn lời khuyên chung chung."
            }
          />
          <SelectField
            label="Giọng điệu"
            options={["Thân thiện — đồng hành", "Trung tính — chuyên nghiệp", "Ngắn gọn — đi thẳng vấn đề"]}
          />
        </Card>

        <div className="flex flex-col gap-5">
          <Card padding="admin">
            <CardHead title="Giới hạn sử dụng" />
            <Field label="Lượt hỏi / ngày (miễn phí)" defaultValue="20" />
            <Field label="Lượt hỏi / ngày (Premium)" defaultValue="Không giới hạn" />
            <Field label="Độ dài ngữ cảnh tối đa (token)" defaultValue="32000" />
          </Card>

          <Card padding="admin">
            <CardHead title="Tính năng & Quyền truy cập" />
            <Toggle label="Ghi nhớ dài hạn" description="Cho phép Companion lưu bộ nhớ cá nhân hoá." defaultOn />
            <Toggle label="Truy cập Hệ tri thức (CKOS)" description="Trả lời dựa trên tài liệu nội bộ." defaultOn />
            <Toggle label="Gợi ý lộ trình học" description="Chủ động đề xuất khoá học phù hợp." defaultOn />
            <Toggle label="Phân tích cảm xúc" description="Tính năng thử nghiệm, chưa mở rộng." />
          </Card>
        </div>
      </div>

      <Card padding="admin">
        <CardHead title="Nhật ký hoạt động gần đây" />
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className="flex items-center justify-between gap-4 border-b border-[var(--v2-line)] py-3 last:border-b-0"
          >
            <div className="min-w-0">
              <div className="truncate text-[13px] font-bold">{conversation.title}</div>
              <div className="truncate text-[11.5px] text-[var(--v2-muted)]">
                {conversation.summary}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[12px] font-bold">{conversation.messageCount} tin nhắn</div>
              <div className="text-[11px] text-[var(--v2-muted)]">
                {formatDate(conversation.lastMessageAt)}
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
