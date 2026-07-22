import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { adminNavGroups } from "@/lib/admin/nav";
import { listCoursePricing } from "@/app/admin/(dashboard)/course-pricing/actions";
import { listCaseStudies } from "@/app/admin/(dashboard)/ckos/case-studies/actions";

export const metadata = { title: "Tổng quan · Admin" };

/**
 * Phần 2 (audit menu Admin) — Dashboard tổng quan tại route gốc /admin
 * (`/admin` redirect thẳng vào đây). Hiển thị lại ĐÚNG cấu trúc 10 group
 * đã audit/sửa ở Phần 1 (`adminNavGroups`, nguồn sự thật duy nhất — không
 * định nghĩa lại danh sách module ở đây) kèm số dòng dữ liệu nhanh cho
 * từng mục, và 1 link "Xem trên Portal" mỗi group để Founder đối chiếu
 * ngay module Admin ↔ trang Portal thật tương ứng.
 *
 * KHÔNG viết API mới — số dòng lấy qua đúng tầng dữ liệu mà
 * `/api/admin/collections/[table]` cũng dùng (`getSupabaseAdmin()` +
 * `tableForCollection()`, xem `src/lib/admin/fetchCollection.ts`'s comment
 * riêng: tự fetch() HTTP vào route của chính app đã xác nhận không đáng
 * tin cậy trên serverless — CKOS Dashboard (`/admin/ckos`) cũng dùng đúng
 * cách này). 2 bảng typed (`courses`, `case_studies`) tái dùng thẳng
 * `listCoursePricing()`/`listCaseStudies()` đã có sẵn — không viết Server
 * Action mới.
 *
 * Chỉ đếm TỔNG số dòng (không tách Published/Draft như CKOS Dashboard) —
 * đúng mức "không cần biểu đồ phức tạp" Founder yêu cầu; muốn xem chi
 * tiết trạng thái, bấm vào từng module.
 */

// Ánh xạ tên group (đúng `adminNavGroups`) → href Portal thật tương ứng
// (`portalNavSections`, src/lib/portal/hubs.ts) — cùng nguyên tắc 1:1 đã
// chốt ở Phần 1. Việc 8: đã thêm "Cộng đồng" (group Admin mới nay đã có).
const PORTAL_HREF_FOR_GROUP: Record<string, string> = {
  "Trang chủ Học viện": "/portal",
  Companion: "/portal/companion",
  "Hệ tri thức AI (CKOS)": "/portal/ckos",
  "Học viện AI": "/portal/hocvienai",
  "AI Workspace": "/portal/aiworkspace",
  "Dự án & Cơ hội": "/portal/duan-cohoi",
  Premium: "/portal/premium",
  "Hành trình của tôi": "/portal/hanhtrinhcuatoi",
  "Sứ mệnh Companion": "/portal/su-menh-companion",
  "Cộng đồng": "/portal/congdongai",
};

// href Admin → tên bảng Supabase generic thật (khớp collectionKey trong
// supabaseCollections.ts). Item không có ở đây (Companion CMS - nhiều tab
// nội bộ riêng, CKOS Dashboard - trang tổng hợp) hiển thị không kèm số
// đếm. Cả 5 module "Hành trình của tôi" (Mirror/Nhật ký học tập/My Story/
// Bản đồ hành trình/Khu vườn của bạn) và "6 khối nội dung" của Sứ mệnh
// Companion (Live-edit, Nhóm 3) cũng không có ở đây dù có collection thật
// đứng sau (Mirror/Journal: 2 bảng; 6 khối Companion: 6 bảng; 3 module
// Hành trình còn lại: 1 bảng mỗi module) — 1 route giờ quản lý qua render
// lại trang Portal thật, không map 1-1 được vào cấu trúc Record<href, 1
// table> đơn giản này.
const TABLE_FOR_HREF: Record<string, string> = {
  "/admin/home-cards": "home_cards",
  "/admin/ckos/prompts": "prompts",
  "/admin/ckos/sop": "sop",
  "/admin/ckos/resources": "resources",
  "/admin/ckos/templates": "templates",
  "/admin/ckos/ebooks": "ebooks",
  "/admin/ckos/checklists": "checklists",
  "/admin/ckos/lessons": "knowledge_seeds",
  "/admin/ckos/knowledge-collections": "knowledge_collections",
  "/admin/ckos/best-practices": "best_practices",
  "/admin/hocvienai/work-needs": "work_needs",
  "/admin/hocvienai/faq": "hocvienai_faq",
  "/admin/tools": "tools",
  "/admin/aiworkspace/recommended-workspace": "recommended_workspace",
  "/admin/aiworkspace/ai-workflow-sections": "ai_workflow_sections",
  "/admin/duan-cohoi": "projects",
  "/admin/su-menh-companion/flipbook": "companion_flipbook_pages",
  "/admin/community": "community",
  "/admin/updates": "updates",
  "/admin/student-success-stories": "student_success_stories",
};

type ItemCount = { href: string; count: number | null };

async function getGenericCounts(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
): Promise<ItemCount[]> {
  return Promise.all(
    Object.entries(TABLE_FOR_HREF).map(async ([href, table]) => {
      const { count, error } = await supabase.from(table).select("id", { count: "exact", head: true });
      return { href, count: error ? null : (count ?? 0) };
    }),
  );
}

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const supabase = getSupabaseAdmin();

  const [genericCounts, coursePricing, caseStudies] = await Promise.all([
    supabase ? getGenericCounts(supabase) : Promise.resolve([] as ItemCount[]),
    listCoursePricing(),
    listCaseStudies(),
  ]);

  const countByHref = new Map<string, number>(
    genericCounts.filter((c): c is { href: string; count: number } => c.count !== null).map((c) => [c.href, c.count]),
  );
  countByHref.set("/admin/course-pricing", coursePricing.courses.length);
  countByHref.set("/admin/ckos/case-studies", caseStudies.caseStudies.length);

  // "Tổng quan" (group null) là chính trang này — bỏ qua khi liệt kê,
  // chỉ render 9 group thật còn lại theo đúng thứ tự adminNavGroups.
  const groups = adminNavGroups.filter((g) => g.group !== null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Tổng quan Admin</h1>
        <p className="mt-1 text-sm text-gray-500">
          Mỗi khối dưới đây là 1 mục trong menu Portal thật — bấm &ldquo;Xem trên Portal&rdquo; để đối chiếu ngay,
          hoặc bấm thẳng vào từng module để sửa. Số hiển thị là tổng số dòng dữ liệu hiện có (mọi trạng thái).
        </p>
        {!supabase && (
          <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-gray-700">
            Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — số dòng dữ liệu
            hiển thị dưới đây có thể chưa chính xác.
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((group) => {
          const groupName = group.group as string;
          const portalHref = PORTAL_HREF_FOR_GROUP[groupName];
          return (
            <div key={groupName} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-gray-900">{groupName}</h2>
                {portalHref && (
                  <Link
                    href={portalHref}
                    target="_blank"
                    className="flex items-center gap-1 text-xs font-semibold text-brand-blue hover:underline"
                  >
                    Xem trên Portal <ArrowUpRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
              <div className="mt-3 space-y-1.5">
                {group.items.map((item) => {
                  const count = countByHref.get(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm transition hover:bg-gray-50"
                    >
                      <span className="min-w-0 truncate text-gray-700">{item.label}</span>
                      {count !== undefined && (
                        <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                          {count}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
