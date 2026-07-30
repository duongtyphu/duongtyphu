import { DataTable } from "@/components/admin/DataTable";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { ColumnConfig, FieldConfig } from "@/lib/admin/fields";

export const metadata = { title: "Câu chuyện học viên · Admin" };

/**
 * Việc 8 (Phần 2) — quản bảng `student_success_stories` (3 dòng).
 *
 * QUAN TRỌNG — KHÔNG nối hiển thị lên Portal (quyết định Founder, Phần 1):
 * 3 dòng hiện có TRÙNG hệt nội dung đã archive ở
 * `/portal/student-success/page.tsx` (Minh Anh/Quốc Huy/Thanh Trúc) — dữ
 * liệu BỊA, không có ảnh/xác thực thật, vi phạm nguyên tắc NO-FAKE-DATA
 * của toàn dự án. Trang này CHỈ để Founder tự xoá 3 dòng bịa + nhập câu
 * chuyện thật (có ảnh/xác nhận thật) khi có — sau đó mới là việc RIÊNG để
 * nối vào /portal/congdongai (Community Stories vẫn dùng đúng empty state
 * trung thực hiện tại cho tới lúc đó).
 */
type AdminStudentSuccessStory = {
  id: string;
  studentName: string;
  title: string;
  result: string;
  shortDescription: string;
  content: string;
  toolsUsed: string[];
  relatedResource: string;
  featured: boolean;
  status: string;
};

const columns: ColumnConfig<AdminStudentSuccessStory>[] = [
  { key: "studentName", label: "Học viên" },
  { key: "title", label: "Tiêu đề" },
  { key: "status", label: "Trạng thái" },
];

const fields: FieldConfig[] = [
  { key: "studentName", label: "Tên học viên", type: "text", required: true },
  { key: "title", label: "Tiêu đề câu chuyện", type: "text", full: true, required: true },
  { key: "result", label: "Kết quả đạt được (câu ngắn)", type: "text", full: true, required: true },
  { key: "shortDescription", label: "Mô tả ngắn (hiển thị ở danh sách)", type: "textarea", full: true, required: true },
  { key: "content", label: "Nội dung đầy đủ", type: "textarea", full: true, required: true },
  { key: "toolsUsed", label: "Công cụ đã dùng (ngăn cách bằng dấu phẩy)", type: "tags" },
  { key: "relatedResource", label: "Liên kết tài nguyên liên quan (vd. /portal/prompts)", type: "text" },
  { key: "featured", label: "Nổi bật", type: "boolean" },
  { key: "status", label: "Trạng thái xuất bản", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminStudentSuccessStoriesPage() {
  return (
    <AdminAtmosphere atmosphereClassName="campus-bg">
      <DataTable<AdminStudentSuccessStory>
        collectionKey="student-success-stories"
        title="Câu chuyện học viên"
        columns={columns}
        fields={fields}
        itemNoun="Câu chuyện"
        addButtonLabel="+ Thêm câu chuyện"
        breadcrumb={[
          { label: "Học viện" },
          { label: "Cộng đồng", href: "/admin/community" },
          { label: "Câu chuyện học viên (chưa hiển thị Portal)" },
        ]}
      />
    </AdminAtmosphere>
  );
}
