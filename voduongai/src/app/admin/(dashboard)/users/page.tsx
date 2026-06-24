"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { usersSeed, type AdminUserRow } from "@/data/admin/people";

export default function UsersAdminPage() {
  return (
    <CrudPage<AdminUserRow>
      title="Người dùng"
      description="Danh sách học viên. Sửa để đổi vai trò, gói hoặc khoá tài khoản."
      collectionKey="users"
      seed={usersSeed}
      searchKeys={["name", "email"]}
      filterOptions={{ key: "status", label: "Trạng thái", options: ["Active", "Blocked"] }}
      columns={[
        { key: "name", label: "Tên" },
        { key: "email", label: "Email" },
        { key: "role", label: "Vai trò" },
        { key: "tier", label: "Gói" },
        { key: "registeredAt", label: "Ngày đăng ký" },
        { key: "roadmapProgress", label: "Tiến độ (%)" },
        { key: "selectedGoal", label: "Mục tiêu đã chọn" },
        { key: "lastLoginAt", label: "Đăng nhập gần nhất" },
        { key: "status", label: "Trạng thái" },
      ]}
      fields={[
        { key: "name", label: "Tên", type: "text", required: true },
        { key: "email", label: "Email", type: "text", required: true },
        { key: "role", label: "Vai trò", type: "select", options: ["Admin", "Member"] },
        { key: "tier", label: "Gói", type: "select", options: ["Free", "Premium"] },
        { key: "status", label: "Trạng thái", type: "select", options: ["Active", "Blocked"] },
        { key: "registeredAt", label: "Ngày đăng ký", type: "date" },
        { key: "roadmapProgress", label: "Tiến độ roadmap (mock %)", type: "number" },
        { key: "promptsCopied", label: "Prompt copied (mock)", type: "number" },
        { key: "toolsClicked", label: "Tools clicked (mock)", type: "number" },
        { key: "resourcesDownloaded", label: "Resources downloaded (mock)", type: "number" },
        { key: "selectedGoal", label: "Mục tiêu đã chọn (mock)", type: "text" },
        { key: "savedItemsCount", label: "Tài nguyên đã lưu (mock)", type: "number" },
        { key: "startHereProgress", label: "Tiến độ Start Here (mock %)", type: "number" },
        { key: "affiliateLinksClicked", label: "Affiliate links đã click (mock)", type: "number" },
        { key: "lastLoginAt", label: "Lần đăng nhập gần nhất", type: "date" },
      ]}
    />
  );
}
