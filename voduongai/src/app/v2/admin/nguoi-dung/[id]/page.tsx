import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Crown, Lock, Share2 } from "lucide-react";

import { V2_ADMIN_BASE } from "@/components/v2/nav/nav-config";
import { Card, CardHead } from "@/components/v2/ui/Card";
import { Toggle } from "@/components/v2/ui/Controls";
import { Field, FieldRow2, SelectField } from "@/components/v2/ui/Field";
import { SaveButton } from "@/components/v2/ui/PageHead";
import { formatDate, formatVnd } from "@/lib/v2/data/client";
import { PLAN_LABEL, STATUS_COLOR, STATUS_LABEL, getUser } from "@/lib/v2/data/users";

export const metadata = { title: "Chi tiết người dùng — Admin" };

const RECENT_LOG = [
  {
    id: "log1",
    title: 'Hoàn thành khoá "ChatGPT từ A đến Z"',
    time: "1 ngày trước",
    icon: BookOpen,
    background: "#e6f7ed",
    color: "#189a52",
  },
  {
    id: "log2",
    title: "Giới thiệu thành công 1 người dùng mới",
    time: "3 ngày trước",
    icon: Share2,
    background: "var(--v2-violet-light)",
    color: "var(--v2-violet)",
  },
  {
    id: "log3",
    title: "Nâng cấp lên gói Premium",
    time: "28/11/2025",
    icon: Crown,
    background: "#fdf1e0",
    color: "#a9822c",
  },
];

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser(id);
  if (!user) notFound();

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <div className="flex items-start justify-between gap-6">
        <div className="text-[12px] text-[var(--v2-muted)]">
          <Link href={`${V2_ADMIN_BASE}/nguoi-dung`}>Admin › Người dùng</Link> › Chi tiết
        </div>
        <div className="flex shrink-0 gap-[10px]">
          <button
            type="button"
            className="flex items-center gap-2 rounded-[10px] border border-[var(--v2-line)] bg-[var(--v2-surface)] px-4 py-[11px] text-[13px] font-bold text-[var(--v2-red)] hover:bg-[#fdeef0]"
          >
            <Lock className="h-[14px] w-[14px]" aria-hidden="true" />
            {user.status === "suspended" ? "Mở khoá tài khoản" : "Khoá tài khoản"}
          </button>
          <SaveButton label="Lưu thay đổi" />
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-[var(--v2-radius-card)] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-[22px]">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8b7bde,#5f4bc9)] text-[22px] font-bold text-white">
          {user.initials}
        </span>
        <div>
          <h2 className="flex flex-wrap items-center gap-[10px] text-[20px] font-extrabold">
            {user.fullName}
            <span
              className="rounded-md px-[9px] py-[3px] text-[11px] font-extrabold"
              style={{
                background: user.status === "active" ? "#e6f7ed" : "#fdf1e0",
                color: STATUS_COLOR[user.status],
              }}
            >
              {STATUS_LABEL[user.status]}
            </span>
          </h2>
          <p className="mt-1 text-[13px] text-[var(--v2-muted)]">
            {user.email} · Tham gia {formatDate(user.joinedAt)} · Mã giới thiệu{" "}
            {user.referralCode}
          </p>
          <div className="mt-2 flex flex-wrap gap-[6px]">
            <span className="rounded-md bg-[#fdf1e0] px-[9px] py-[3px] text-[11.5px] font-bold text-[#a9822c]">
              {PLAN_LABEL[user.plan]}
            </span>
            {user.isAdmin ? (
              <span className="rounded-md bg-[#e6f0ff] px-[9px] py-[3px] text-[11.5px] font-bold text-[#1d5fd8]">
                Quản trị viên
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 min-[1180px]:grid-cols-[1.4fr_1fr]">
        <Card padding="admin">
          <CardHead title="Thông tin tài khoản" />
          <FieldRow2>
            <Field label="Họ và tên" defaultValue={user.fullName} />
            <Field label="Email" type="email" defaultValue={user.email} />
          </FieldRow2>
          <FieldRow2>
            <Field label="Mã giới thiệu" defaultValue={user.referralCode} />
            <SelectField
              label="Vai trò"
              options={["Người dùng", "Cộng tác viên", "Quản trị viên"]}
              defaultValue={user.isAdmin ? "Quản trị viên" : "Người dùng"}
            />
          </FieldRow2>
          <FieldRow2>
            <SelectField
              label="Gói hiện tại"
              options={["Miễn phí", "Premium", "Premium 12T"]}
              defaultValue={PLAN_LABEL[user.plan]}
            />
            <Field label="Ngày tham gia" defaultValue={formatDate(user.joinedAt)} />
          </FieldRow2>

          <CardHead title="Quyền & trạng thái" className="mt-4" />
          <Toggle
            label="Truy cập Premium"
            description="Cho phép truy cập nội dung và công cụ Premium."
            defaultOn={user.plan !== "free"}
          />
          <Toggle
            label="Tham gia chương trình Affiliate"
            description="Có thể tạo liên kết giới thiệu và nhận hoa hồng."
            defaultOn
          />
          <Toggle
            label="Nhận email marketing"
            description="Nhận thông báo khuyến mãi và nội dung mới."
          />
        </Card>

        <div className="flex flex-col gap-[18px]">
          <Card padding="admin">
            <CardHead title="Thống kê sử dụng" />
            {[
              { label: "Khoá học đã tham gia", value: String(user.coursesEnrolled) },
              { label: "Cuộc trò chuyện Companion", value: "342" },
              { label: "Giới thiệu Affiliate", value: "142" },
              { label: "Tổng chi tiêu", value: formatVnd(user.totalSpent) },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between border-b border-[var(--v2-line)] py-[10px] text-[12.8px] last:border-b-0"
              >
                <span className="text-[var(--v2-muted)]">{stat.label}</span>
                <b className="font-extrabold">{stat.value}</b>
              </div>
            ))}
          </Card>

          <Card padding="admin">
            <CardHead title="Hoạt động gần đây" />
            {RECENT_LOG.map((log) => {
              const Icon = log.icon;
              return (
                <div
                  key={log.id}
                  className="flex items-center gap-[11px] border-b border-[var(--v2-line)] py-[10px] last:border-b-0"
                >
                  <span
                    className="v2-ico flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg"
                    style={{ background: log.background, color: log.color }}
                  >
                    <Icon className="h-[14px] w-[14px]" aria-hidden="true" />
                  </span>
                  <div>
                    <h6 className="text-[12.8px] font-bold">{log.title}</h6>
                    <span className="text-[11px] text-[var(--v2-muted)]">{log.time}</span>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
}
