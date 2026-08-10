import { Card, CardHead } from "@/components/v2/ui/Card";
import { Toggle } from "@/components/v2/ui/Controls";
import { DataTable } from "@/components/v2/ui/DataTable";
import type { TableRow } from "@/components/v2/ui/DataTable";
import { Field, FieldRow2, SelectField, TextareaField } from "@/components/v2/ui/Field";
import { PageHead, SaveButton } from "@/components/v2/ui/PageHead";

export const metadata = { title: "Cấu hình hệ thống — Admin" };

/** Ma trận phân quyền: mỗi module × 4 vai trò. */
const PERMISSIONS = [
  { id: "pm1", module: "Nội dung Portal", superAdmin: "Toàn quyền", editor: "Sửa & xuất bản", moderator: "Chỉ xem", user: "Không" },
  { id: "pm2", module: "Người dùng", superAdmin: "Toàn quyền", editor: "Chỉ xem", moderator: "Chỉ xem", user: "Không" },
  { id: "pm3", module: "Thanh toán", superAdmin: "Toàn quyền", editor: "Không", moderator: "Không", user: "Không" },
  { id: "pm4", module: "Cộng đồng", superAdmin: "Toàn quyền", editor: "Sửa", moderator: "Kiểm duyệt", user: "Đăng bài" },
  { id: "pm5", module: "Hỗ trợ & Ticket", superAdmin: "Toàn quyền", editor: "Không", moderator: "Xử lý", user: "Tạo ticket" },
  { id: "pm6", module: "Tích hợp & API", superAdmin: "Toàn quyền", editor: "Không", moderator: "Không", user: "Không" },
  { id: "pm7", module: "Cấu hình hệ thống", superAdmin: "Toàn quyền", editor: "Không", moderator: "Không", user: "Không" },
];

const AUDIT_LOG = [
  { id: "al1", time: "10/08/2026 09:42", actor: "Võ Dương", action: "Cập nhật cấu hình Companion", module: "Companion AI", ip: "113.161.xx.xx" },
  { id: "al2", time: "10/08/2026 08:15", actor: "Võ Dương", action: "Xuất bản khoá học mới", module: "Học viện AI", ip: "113.161.xx.xx" },
  { id: "al3", time: "09/08/2026 21:30", actor: "Trần Thị Mai", action: "Kiểm duyệt 3 bài viết", module: "Cộng đồng AI", ip: "27.72.xx.xx" },
  { id: "al4", time: "09/08/2026 16:05", actor: "Võ Dương", action: "Thêm API key mới", module: "Tích hợp & API", ip: "113.161.xx.xx" },
  { id: "al5", time: "08/08/2026 11:20", actor: "Hoàng Nam", action: "Duyệt hoa hồng affiliate", module: "Affiliate", ip: "42.115.xx.xx" },
];

export default function AdminCauHinhPage() {
  const permissionRows: TableRow[] = PERMISSIONS.map((row) => ({
    id: row.id,
    cells: [
      { t: "strong", v: row.module },
      { t: "text", v: row.superAdmin },
      { t: "text", v: row.editor },
      { t: "text", v: row.moderator },
      { t: "muted", v: row.user },
    ],
  }));

  const auditRows: TableRow[] = AUDIT_LOG.map((row) => ({
    id: row.id,
    cells: [
      { t: "muted", v: row.time },
      { t: "strong", v: row.actor },
      { t: "text", v: row.action },
      {
        t: "tag",
        label: row.module,
        background: "var(--v2-violet-light)",
        color: "var(--v2-violet)",
      },
      { t: "muted", v: row.ip },
    ],
  }));

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Quản trị hệ thống › Cấu hình hệ thống"
        title="Cấu hình hệ thống"
        description="Quản lý thông tin thương hiệu, vai trò truy cập và trạng thái vận hành toàn hệ sinh thái."
        action={<SaveButton label="Lưu cấu hình" />}
      />

      <div className="grid grid-cols-1 gap-5 min-[1180px]:grid-cols-2">
        <Card padding="admin">
          <CardHead title="Thông tin thương hiệu" />
          <FieldRow2>
            <Field label="Tên hệ thống" defaultValue="VO DUONG AI" />
            <Field label="Tên miền chính" defaultValue="voduongai.com" />
          </FieldRow2>
          <TextareaField
            label="Mô tả ngắn"
            rows={3}
            defaultValue="Hệ sinh thái học tập AI giúp bạn học đúng, thực hành đúng và từng bước xây dựng hệ thống làm việc, tài sản số bền vững."
          />
          <FieldRow2>
            <Field label="Email liên hệ" type="email" defaultValue="duongvv.vn@gmail.com" />
            <Field label="Hotline" defaultValue="1900 xxxx" />
          </FieldRow2>
        </Card>

        <Card padding="admin">
          <CardHead title="Vận hành" />
          <Toggle
            label="Chế độ bảo trì"
            description="Chặn truy cập Portal và hiển thị trang thông báo bảo trì."
          />
          <Toggle label="Cho phép đăng ký mới" description="Tắt để tạm dừng nhận thành viên mới." defaultOn />
          <Toggle label="Bắt buộc xác thực email" description="Người dùng phải xác thực trước khi vào Portal." defaultOn />
          <Toggle label="Ghi nhật ký hành động quản trị" description="Lưu lại mọi thao tác trong khu vực Admin." defaultOn />
          <SelectField
            label="Múi giờ hệ thống"
            options={["(GMT+7) Hà Nội / TP. Hồ Chí Minh", "(GMT+0) UTC", "(GMT+9) Tokyo"]}
          />
        </Card>
      </div>

      <DataTable
        title="Ma trận phân quyền theo vai trò"
        headers={["Module", "Super Admin", "Quản trị nội dung", "Kiểm duyệt viên", "Người dùng"]}
        rows={permissionRows}
        pageSize={8}
      />

      <DataTable
        title="Nhật ký hành động quản trị"
        headers={["Thời gian", "Người dùng", "Hành động", "Module", "IP"]}
        rows={auditRows}
        totalLabel="hành động"
        searchPlaceholder="Tìm theo người dùng hoặc hành động..."
      />
    </div>
  );
}
