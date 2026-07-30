import { redirect } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Receipt, ShieldAlert, Users, Wallet, Zap } from "lucide-react";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { adminWorkspaces, flattenAdminNav } from "@/lib/admin/nav";
import { listCoursePricing } from "@/app/admin/(dashboard)/course-pricing/actions";
import { listCaseStudies } from "@/app/admin/(dashboard)/ckos/case-studies/actions";

export const metadata = { title: "Tổng quan · Admin" };

/**
 * KIẾN TRÚC ADMIN V2.0 — Trung tâm điều hành. Thay hẳn lưới "10 group cũ"
 * (Phần 2, audit menu Admin trước đây) bằng cấu trúc 5 lớp theo đúng yêu
 * cầu: (1) Tổng quan hệ thống, (2) Việc cần xử lý, (3) Quick Actions,
 * (4) 7 Workspace dạng card (không tính "Tổng quan" — chính là trang này),
 * (5) Hoạt động gần đây. KHÔNG hiển thị số liệu giả — mọi số đếm đọc thật
 * qua Supabase, mọi Quick Action trỏ route THẬT đã tồn tại.
 *
 * Không viết API mới — số dòng lấy qua đúng tầng dữ liệu mà
 * `/api/admin/collections/[table]` cũng dùng (`getSupabaseAdmin()` + tên
 * bảng thật), cùng cách CKOS Dashboard (`/admin/ckos`) đã làm.
 */

// href → tên bảng Supabase thật (đếm tổng số dòng, mọi trạng thái). Item
// không có ở đây (Live-edit render lại trang Portal thật, editor riêng
// nhiều bảng, hoặc "Sắp triển khai") hiển thị không kèm số đếm.
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
  "/admin/duan-cohoi/affiliate-hub-sections": "affiliate_hub_sections",
  "/admin/duan-cohoi/affiliate-products": "affiliate_products",
  "/admin/duan-cohoi/affiliate-hub-top-products": "affiliate_hub_top_products",
  "/admin/su-menh-companion/flipbook": "companion_flipbook_pages",
  "/admin/community": "community",
  "/admin/updates": "updates",
  "/admin/student-success-stories": "student_success_stories",
  "/admin/users": "members",
  // Vận hành — 3 route mới có dữ liệu thật (Admin v2.0).
  "/admin/van-hanh/don-hang": "orders",
  "/admin/van-hanh/khach-hang-tiem-nang": "leads",
  "/admin/van-hanh/ho-tro-khach-hang": "support_tickets",
  // Affiliate — chỉ "Referral" map 1:1 vào 1 bảng (referrals); các trang
  // khác trong Workspace này (Thành viên/Đơn hàng/Hoa hồng/Báo cáo) là góc
  // nhìn gộp/join từ cùng bảng đó, không đếm riêng để tránh 4 con số trùng.
  "/admin/affiliate/referral": "referrals",
};

// Workspace nào có 1 trang công khai đại diện thật sự (không phải Portal
// 10 mục lẻ) mới có nút "Xem trên...". Người dùng/Vận hành/Marketing/
// Thương hiệu & Media/Hệ thống không có URL công khai tương ứng — không
// gắn link giả.
const PUBLIC_URL_FOR_WORKSPACE: Record<string, { label: string; href: string }> = {
  website: { label: "Xem Landing Page", href: "/" },
  "hoc-vien": { label: "Xem trên Học viện", href: "/portal" },
  affiliate: { label: "Xem trang Affiliate của thành viên", href: "/portal/affiliate" },
};

const QUICK_ACTIONS = [
  { label: "Chỉnh sửa Landing Page", href: "/admin/landing" },
  { label: "Thêm nội dung CKOS", href: "/admin/ckos" },
  { label: "Thêm khoá học / bài học", href: "/admin/ckos/lessons" },
  { label: "Thêm bài viết (Dự án & Cơ hội)", href: "/admin/duan-cohoi/digiu" },
  { label: "Quản lý dự án", href: "/admin/duan-cohoi" },
  { label: "Xem đơn hàng", href: "/admin/van-hanh/don-hang" },
];

type CountRow = { href: string; count: number | null };
type ActivityRow = { key: string; label: string; href: string; at: string };

async function getRecentActivity(supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>): Promise<ActivityRow[]> {
  const [orders, leads, tickets] = await Promise.all([
    supabase.from("orders").select("id, customer_name, member_email, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("leads").select("id, email, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("support_tickets").select("id, subject, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const rows: ActivityRow[] = [
    ...(orders.data ?? []).map((o) => ({
      key: `order-${o.id}`,
      label: `Đơn hàng mới — ${o.customer_name ?? o.member_email}`,
      href: "/admin/van-hanh/don-hang",
      at: o.created_at as string,
    })),
    ...(leads.data ?? []).map((l) => ({
      key: `lead-${l.id}`,
      label: `Khách hàng tiềm năng mới — ${l.email}`,
      href: "/admin/van-hanh/khach-hang-tiem-nang",
      at: l.created_at as string,
    })),
    ...(tickets.data ?? []).map((t) => ({
      key: `ticket-${t.id}`,
      label: `Ticket hỗ trợ mới — ${t.subject}`,
      href: "/admin/van-hanh/ho-tro-khach-hang",
      at: t.created_at as string,
    })),
  ];

  return rows.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, 8);
}

function formatActivityDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

async function getGenericCounts(supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>): Promise<CountRow[]> {
  return Promise.all(
    Object.entries(TABLE_FOR_HREF).map(async ([href, table]) => {
      const { count, error } = await supabase.from(table).select("id", { count: "exact", head: true });
      return { href, count: error ? null : (count ?? 0) };
    }),
  );
}

type Kpis = {
  membersTotal: number | null;
  adminCount: number | null;
  ordersTotal: number | null;
  ordersConfirmed: number | null;
  revenueConfirmed: number | null;
  premiumMembersConfirmed: number | null;
};

type OperationalWarning = { key: string; label: string; count: number; href: string };

const STALE_ORDER_HOURS = 48;
const STALE_TICKET_HOURS = 72;

/**
 * ADM-V2-01 — KPI thật cho Dashboard (Người dùng/Premium/Đơn hàng/Doanh
 * thu) + tín hiệu "Cảnh báo vận hành" tính từ dữ liệu thật (KHÔNG bịa
 * ngưỡng cảnh báo tuỳ tiện — chỉ 3 tín hiệu khách quan: đơn hàng pending
 * quá 48h, ticket mở quá 72h, và chỉ có đúng 1 tài khoản Admin — điểm yếu
 * thật của mô hình phân quyền nhị phân hiện tại).
 */
async function getKpisAndWarnings(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
): Promise<{ kpis: Kpis; warnings: OperationalWarning[] }> {
  const staleOrderCutoff = new Date(Date.now() - STALE_ORDER_HOURS * 3600_000).toISOString();
  const staleTicketCutoff = new Date(Date.now() - STALE_TICKET_HOURS * 3600_000).toISOString();

  const [
    membersTotal,
    adminCount,
    ordersTotal,
    ordersConfirmed,
    confirmedAmounts,
    premiumConfirmed,
    staleOrders,
    staleTickets,
  ] = await Promise.all([
    supabase.from("members").select("id", { count: "exact", head: true }),
    supabase.from("members").select("id", { count: "exact", head: true }).eq("is_admin", true),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "confirmed"),
    supabase.from("orders").select("amount").eq("status", "confirmed"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "confirmed").not("course_id", "is", null),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending").lt("created_at", staleOrderCutoff),
    supabase.from("support_tickets").select("id", { count: "exact", head: true }).eq("status", "open").lt("created_at", staleTicketCutoff),
  ]);

  const revenueConfirmed = confirmedAmounts.error
    ? null
    : (confirmedAmounts.data ?? []).reduce((sum, o) => sum + (o.amount ?? 0), 0);

  const warnings: OperationalWarning[] = [];
  if ((staleOrders.count ?? 0) > 0) {
    warnings.push({
      key: "stale-orders",
      label: `${staleOrders.count} đơn hàng chờ xác nhận quá ${STALE_ORDER_HOURS} giờ`,
      count: staleOrders.count ?? 0,
      href: "/admin/van-hanh/don-hang",
    });
  }
  if ((staleTickets.count ?? 0) > 0) {
    warnings.push({
      key: "stale-tickets",
      label: `${staleTickets.count} ticket hỗ trợ mở quá ${STALE_TICKET_HOURS} giờ chưa trả lời`,
      count: staleTickets.count ?? 0,
      href: "/admin/van-hanh/ho-tro-khach-hang",
    });
  }
  if ((adminCount.count ?? 0) === 1) {
    warnings.push({
      key: "single-admin",
      label: "Chỉ có đúng 1 tài khoản Admin — không có phương án dự phòng nếu mất quyền truy cập",
      count: 1,
      href: "/admin/nguoi-dung/vai-tro-phan-quyen",
    });
  }

  return {
    kpis: {
      membersTotal: membersTotal.error ? null : (membersTotal.count ?? 0),
      adminCount: adminCount.error ? null : (adminCount.count ?? 0),
      ordersTotal: ordersTotal.error ? null : (ordersTotal.count ?? 0),
      ordersConfirmed: ordersConfirmed.error ? null : (ordersConfirmed.count ?? 0),
      revenueConfirmed,
      premiumMembersConfirmed: premiumConfirmed.error ? null : (premiumConfirmed.count ?? 0),
    },
    warnings,
  };
}

function formatMoney(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const supabase = getSupabaseAdmin();

  const [genericCounts, coursePricing, caseStudies, pendingOrders, openTickets, recentActivity, kpisAndWarnings] =
    await Promise.all([
      supabase ? getGenericCounts(supabase) : Promise.resolve([] as CountRow[]),
      listCoursePricing(),
      listCaseStudies(),
      supabase
        ? supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending")
        : Promise.resolve({ count: null }),
      supabase
        ? supabase.from("support_tickets").select("id", { count: "exact", head: true }).eq("status", "open")
        : Promise.resolve({ count: null }),
      supabase ? getRecentActivity(supabase) : Promise.resolve([] as ActivityRow[]),
      supabase
        ? getKpisAndWarnings(supabase)
        : Promise.resolve({ kpis: null as Kpis | null, warnings: [] as OperationalWarning[] }),
    ]);

  const { kpis, warnings } = kpisAndWarnings;

  const countByHref = new Map<string, number>(
    genericCounts.filter((c): c is { href: string; count: number } => c.count !== null).map((c) => [c.href, c.count]),
  );
  countByHref.set("/admin/course-pricing", coursePricing.courses.length);
  countByHref.set("/admin/ckos/case-studies", caseStudies.caseStudies.length);

  const pendingOrdersCount = pendingOrders.count ?? null;
  const openTicketsCount = openTickets.count ?? null;

  const flatNav = flattenAdminNav();
  const totalModules = flatNav.length;
  const comingSoonModules = flatNav.filter((e) => e.comingSoon).length;
  const activeModules = totalModules - comingSoonModules;

  // 7 Workspace card — bỏ "Tổng quan" (chính là trang này).
  const workspaces = adminWorkspaces.filter((w) => w.id !== "tong-quan");

  return (
    <div className="space-y-8">
      {/* Lớp 1 — Tổng quan hệ thống */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Tổng quan Admin</h1>
        <p className="mt-1 text-sm text-gray-500">
          Trung tâm điều hành VO DUONG AI — {activeModules} module đang hoạt động thật, {comingSoonModules}{" "}
          module đánh dấu &ldquo;Sắp triển khai&rdquo; trên tổng số {totalModules} mục trong 8 Workspace.
        </p>
        {!supabase && (
          <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-gray-700">
            Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — số liệu bên
            dưới có thể chưa chính xác.
          </div>
        )}
      </div>

      {/* Lớp KPI — số liệu thật (Người dùng/Premium/Đơn hàng/Doanh thu) */}
      {kpis && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wide">Người dùng</span>
            </div>
            <p className="mt-1.5 text-2xl font-extrabold text-gray-900">{kpis.membersTotal ?? "—"}</p>
            <p className="mt-0.5 text-xs text-gray-400">{kpis.adminCount ?? "—"} admin</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <ShieldAlert className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wide">Premium Membership</span>
            </div>
            <p className="mt-1.5 text-2xl font-extrabold text-gray-900">{kpis.premiumMembersConfirmed ?? "—"}</p>
            <p className="mt-0.5 text-xs text-gray-400">giao dịch đã xác nhận</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Receipt className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wide">Đơn hàng</span>
            </div>
            <p className="mt-1.5 text-2xl font-extrabold text-gray-900">{kpis.ordersTotal ?? "—"}</p>
            <p className="mt-0.5 text-xs text-gray-400">{kpis.ordersConfirmed ?? "—"} đã xác nhận</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Wallet className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wide">Doanh thu</span>
            </div>
            <p className="mt-1.5 text-2xl font-extrabold text-gray-900">
              {kpis.revenueConfirmed !== null ? formatMoney(kpis.revenueConfirmed) : "—"}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">từ đơn hàng đã xác nhận</p>
          </div>
        </div>
      )}

      {/* Cảnh báo vận hành — tín hiệu rủi ro tính từ dữ liệu thật, KHÁC khối
          "Việc cần xử lý" (đó là việc cần làm ngay; đây là rủi ro cần lưu ý). */}
      <div>
        <h2 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-400">
          <AlertTriangle className="h-3.5 w-3.5" /> Cảnh báo vận hành
        </h2>
        {warnings.length === 0 ? (
          <p className="mt-2 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
            Không có cảnh báo vận hành nào.
          </p>
        ) : (
          <div className="mt-2 space-y-2">
            {warnings.map((w) => (
              <Link
                key={w.key}
                href={w.href}
                className="flex items-center justify-between gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-gray-700 shadow-sm transition hover:border-orange-300"
              >
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-orange-500" />
                  {w.label}
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-orange-500" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Lớp 2 — Việc cần xử lý (chỉ số thật, không tự bịa) */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">Việc cần xử lý</h2>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <Link
            href="/admin/van-hanh/don-hang"
            className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-brand-blue/40"
          >
            <span className="text-sm font-semibold text-gray-700">Đơn hàng chờ xác nhận</span>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-orange-700">
              {pendingOrdersCount ?? "—"}
            </span>
          </Link>
          <Link
            href="/admin/van-hanh/ho-tro-khach-hang"
            className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-brand-blue/40"
          >
            <span className="text-sm font-semibold text-gray-700">Ticket hỗ trợ đang mở</span>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-orange-700">
              {openTicketsCount ?? "—"}
            </span>
          </Link>
        </div>
      </div>

      {/* Lớp 3 — Quick Actions (chỉ trỏ route thật đã tồn tại) */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">Thao tác nhanh</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((qa) => (
            <Link
              key={qa.href}
              href={qa.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:border-brand-blue/40 hover:text-brand-blue"
            >
              <Zap className="h-3.5 w-3.5" />
              {qa.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Lớp 4 — 7 Workspace dạng card */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">Workspace</h2>
        <div className="mt-2 grid gap-4 md:grid-cols-2">
          {workspaces.map((ws) => {
            const publicUrl = PUBLIC_URL_FOR_WORKSPACE[ws.id];
            // "Học viện" lồng subGroup — liệt kê tên 10 subGroup (gọn hơn 27
            // item lẻ). Workspace khác liệt kê thẳng item.
            const rows = ws.subGroups
              ? ws.subGroups.map((sg) => ({
                  label: sg.label,
                  href: sg.items[0]?.href ?? "#",
                  comingSoon: false,
                  count: sg.items.reduce((sum, it) => sum + (countByHref.get(it.href) ?? 0), 0) || null,
                }))
              : (ws.items ?? []).map((it) => ({
                  label: it.label,
                  href: it.href,
                  comingSoon: Boolean(it.comingSoon),
                  count: countByHref.get(it.href) ?? null,
                }));

            return (
              <div key={ws.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-gray-900">{ws.label}</h3>
                  {publicUrl && (
                    <Link
                      href={publicUrl.href}
                      target="_blank"
                      className="flex items-center gap-1 text-xs font-semibold text-brand-blue hover:underline"
                    >
                      {publicUrl.label} <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
                <div className="mt-3 space-y-1.5">
                  {rows.map((row) => (
                    <Link
                      key={row.href}
                      href={row.href}
                      className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm transition hover:bg-gray-50"
                    >
                      <span className="min-w-0 truncate text-gray-700">{row.label}</span>
                      {row.comingSoon ? (
                        <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                          Sắp ra mắt
                        </span>
                      ) : (
                        row.count !== null && (
                          <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                            {row.count}
                          </span>
                        )
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lớp 5 — Hoạt động gần đây (dữ liệu thật: đơn hàng/khách hàng tiềm
          năng/ticket hỗ trợ mới nhất, gộp theo created_at giảm dần). */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">Hoạt động gần đây</h2>
        <div className="mt-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
          {recentActivity.length === 0 ? (
            <p className="p-4 text-center text-sm text-gray-500">Chưa có hoạt động nào.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentActivity.map((a) => (
                <Link
                  key={a.key}
                  href={a.href}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm transition hover:bg-gray-50"
                >
                  <span className="min-w-0 truncate text-gray-700">{a.label}</span>
                  <span className="shrink-0 text-xs text-gray-400">{formatActivityDate(a.at)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
