import { Bell, MousePointerClick, Send, Smartphone } from "lucide-react";

import { Card, CardHead } from "@/components/v2/ui/Card";
import { Toggle } from "@/components/v2/ui/Controls";
import { DataTable } from "@/components/v2/ui/DataTable";
import type { TableRow } from "@/components/v2/ui/DataTable";
import { Field, SelectField, TextareaField } from "@/components/v2/ui/Field";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { PageHead } from "@/components/v2/ui/PageHead";
import { listNotificationTemplates } from "@/lib/v2/data/ops";

export const metadata = { title: "Thông báo — Admin" };

export default async function AdminThongBaoPage() {
  const templates = await listNotificationTemplates();

  const rows: TableRow[] = templates.map((template) => ({
    id: template.id,
    cells: [
      { t: "strong", v: template.title },
      {
        t: "tag",
        label: template.channel,
        background: "var(--v2-violet-light)",
        color: "var(--v2-violet)",
      },
      { t: "muted", v: template.audience },
      { t: "text", v: template.sentCount.toLocaleString("vi-VN") },
      { t: "strong", v: template.openRate },
    ],
  }));

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Quản trị hệ thống › Thông báo"
        title="Trung tâm Thông báo"
        description="Soạn và gửi thông báo in-app, email, push tới người dùng Portal."
      />

      <KpiGrid
        items={[
          { id: "sent", value: "1.842", label: "Đã gửi (30 ngày)", icon: Send, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)", delta: "6,8%", trend: "up" },
          { id: "open", value: "68,4%", label: "Tỷ lệ mở", icon: Bell, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)", delta: "2,3%", trend: "up" },
          { id: "click", value: "24,7%", label: "Tỷ lệ click", icon: MousePointerClick, gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)", delta: "1,1%", trend: "up" },
          { id: "push", value: "42.180", label: "Đăng ký nhận push", icon: Smartphone, gradient: "linear-gradient(145deg,#e2b23c,#a9660f)", delta: "4,5%", trend: "up" },
        ]}
      />

      <div className="grid grid-cols-1 gap-5 min-[1180px]:grid-cols-[1.4fr_1fr]">
        <Card padding="admin">
          <CardHead title="Soạn thông báo mới" />
          <Field label="Tiêu đề" placeholder="Ví dụ: Khoá học mới đã lên sóng" />
          <TextareaField label="Nội dung" rows={4} />
          <SelectField
            label="Đối tượng nhận"
            options={[
              "Toàn bộ người dùng",
              "Người dùng miễn phí",
              "Thành viên Premium",
              "Premium sắp hết hạn",
              "Affiliate đang hoạt động",
            ]}
          />
          <Field label="Đường dẫn khi bấm vào" placeholder="/v2/hoc-vien-ai" />
          <button
            type="button"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-[var(--v2-radius-sm)] bg-[var(--v2-violet)] p-[11px] text-[13px] font-bold text-white hover:brightness-110"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            Gửi thông báo
          </button>
        </Card>

        <Card padding="admin">
          <CardHead title="Cài đặt kênh gửi" />
          <Toggle label="Thông báo trong ứng dụng" description="Hiện ở chuông thông báo trên Portal." defaultOn />
          <Toggle label="Email" description="Gửi qua địa chỉ email đã xác thực." defaultOn />
          <Toggle label="Push trên trình duyệt" description="Yêu cầu người dùng đã cấp quyền." defaultOn />
          <Toggle label="Zalo OA" description="Kênh thử nghiệm, chưa mở cho toàn bộ người dùng." />
        </Card>
      </div>

      <DataTable
        title="Mẫu thông báo"
        headers={["Thông báo", "Kênh", "Đối tượng", "Đã gửi", "Tỷ lệ mở"]}
        rows={rows}
        totalLabel="mẫu"
        searchPlaceholder="Tìm mẫu thông báo..."
      />
    </div>
  );
}
