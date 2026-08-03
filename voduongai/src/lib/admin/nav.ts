export type AdminNavItem = {
  label: string;
  href: string;
  /** Chưa có chức năng thật đứng sau — route vẫn tồn tại (trang mô tả phạm
   * vi + trạng thái "Sắp triển khai"), nhưng KHÔNG có CRUD/dữ liệu giả. */
  comingSoon?: boolean;
};

export type AdminNavSubGroup = { label: string; items: AdminNavItem[] };

export type AdminWorkspace = {
  id: string;
  label: string;
  /** Mục phẳng ngay dưới workspace (đa số workspace dùng dạng này). */
  items?: AdminNavItem[];
  /** Lồng 1 cấp nữa — CHỈ "Học viện" cần vì gộp lại đúng 10 mục Portal cũ. */
  subGroups?: AdminNavSubGroup[];
};

/**
 * KIẾN TRÚC ADMIN V2.0 — nguồn sự thật duy nhất cho AdminSidebar/AdminSearch/
 * Dashboard. 8 Workspace cấp cao, mỗi Workspace có 1 chủ sở hữu dữ liệu rõ
 * ràng (xem CLAUDE.md mục "Kiến trúc Admin v2.0" cho quy tắc đầy đủ):
 *
 *   1. Tổng quan          — trung tâm điều hành, không sở hữu dữ liệu nghiệp vụ.
 *   2. Người dùng         — Identity Hub (auth.users/members).
 *   3. Website             — Landing Page + nội dung trình bày website công khai.
 *   4. Học viện            — TOÀN BỘ nội dung Portal/Học viện (10 nhóm cũ, giữ
 *                            nguyên y hệt, chỉ lồng thêm 1 cấp Workspace).
 *   5. Vận hành            — đơn hàng, thanh toán, khách hàng, hỗ trợ.
 *   6. Marketing            — chiến dịch, chuyển đổi (chưa có chức năng thật).
 *   7. Thương hiệu & Media — brand asset, media, tài liệu (chưa có chức năng thật).
 *   8. Hệ thống             — cấu hình kỹ thuật (chưa có chức năng thật, KHÔNG
 *                            hiển thị secret/env value).
 *
 * NGUYÊN TẮC BẮT BUỘC:
 * - KHÔNG đổi URL của bất kỳ route đang hoạt động nào — mọi href trong nhóm
 *   "Học viện" (10 subGroups) và các route Live-edit/DataTable khác GIỮ
 *   NGUYÊN 100% so với `nav.ts` bản trước Admin v2.0 (chỉ đổi cách NHÓM
 *   hiển thị trong sidebar, không đổi đường dẫn).
 * - Module chưa có chức năng thật (`comingSoon: true`) trỏ tới 1 route thật
 *   SỰ TỒN TẠI (`WorkspacePlaceholder`, xem `src/components/admin/WorkspacePlaceholder.tsx`)
 *   mô tả phạm vi + lý do chưa làm — KHÔNG phải link chết, KHÔNG phải CRUD giả.
 * - Không để 2 mục sidebar cùng sở hữu 1 nguồn dữ liệu (vd. "Thanh toán"
 *   KHÔNG có trang riêng vì trạng thái thanh toán đã nằm trong "Đơn hàng").
 */
export const adminWorkspaces: AdminWorkspace[] = [
  {
    id: "tong-quan",
    label: "Tổng quan",
    items: [
      { label: "Tổng quan", href: "/admin/dashboard" },
      { label: "Công việc", href: "/admin/tong-quan/cong-viec" },
      { label: "Thông báo", href: "/admin/tong-quan/thong-bao" },
      { label: "Hoạt động gần đây", href: "/admin/tong-quan/hoat-dong-gan-day" },
    ],
  },
  {
    id: "nguoi-dung",
    label: "Người dùng",
    items: [
      // Identity Hub v1.0 — danh sách thật (auth.users + members), chỉ đọc.
      { label: "Danh sách người dùng", href: "/admin/users" },
      { label: "Hồ sơ của tôi", href: "/admin/nguoi-dung/ho-so" },
      { label: "Vai trò & Phân quyền", href: "/admin/nguoi-dung/vai-tro-phan-quyen" },
      { label: "Thành viên", href: "/admin/nguoi-dung/thanh-vien" },
      { label: "Premium Membership", href: "/admin/nguoi-dung/premium-membership" },
      { label: "Phiên đăng nhập", href: "/admin/nguoi-dung/phien-dang-nhap" },
      { label: "Thiết bị", href: "/admin/nguoi-dung/thiet-bi" },
      { label: "Hoạt động người dùng", href: "/admin/nguoi-dung/hoat-dong-nguoi-dung" },
    ],
  },
  {
    id: "website",
    label: "Website",
    items: [
      // Landing Page CMS (Phase 25) — Live-edit Cách A, giữ nguyên 100%.
      { label: "Landing Page", href: "/admin/landing" },
      { label: "Nội dung Website", href: "/admin/website/noi-dung-website" },
      { label: "Điều hướng", href: "/admin/website/dieu-huong" },
      { label: "Header & Footer", href: "/admin/website/header-footer" },
      { label: "Popup & Banner", href: "/admin/website/popup-banner" },
      { label: "SEO Website", href: "/admin/website/seo-website" },
    ],
  },
  {
    id: "hoc-vien",
    label: "Học viện",
    // 10 subGroup dưới đây là ĐÚNG 10 mục Portal cũ (portalNavSections),
    // giữ nguyên 100% label/href — chỉ lồng thêm 1 cấp Workspace "Học viện".
    subGroups: [
      {
        label: "Trang chủ Học viện",
        items: [{ label: "Thẻ trang chủ (Live-edit)", href: "/admin/home-cards" }],
      },
      {
        label: "Companion",
        items: [{ label: "Companion (CMS quản trị AI Mentor)", href: "/admin/companion" }],
      },
      {
        label: "Hệ tri thức AI (CKOS)",
        items: [
          { label: "CKOS Dashboard", href: "/admin/ckos" },
          { label: "Prompt (Folder)", href: "/admin/ckos/prompts" },
          { label: "SOP / Workflow (Folder)", href: "/admin/ckos/sop" },
          { label: "Resource (Folder)", href: "/admin/ckos/resources" },
          { label: "Template (Folder)", href: "/admin/ckos/templates" },
          { label: "Ebook (Folder)", href: "/admin/ckos/ebooks" },
          { label: "Checklist (Folder)", href: "/admin/ckos/checklists" },
          { label: "Lesson (Folder)", href: "/admin/ckos/lessons" },
          { label: "Thư viện AI (Folder)", href: "/admin/ckos/knowledge-collections" },
          { label: "Câu chuyện thành công (Folder)", href: "/admin/ckos/case-studies" },
          { label: "Thực hành tốt (Folder)", href: "/admin/ckos/best-practices" },
        ],
      },
      {
        label: "Học viện AI",
        items: [
          { label: "Theo nhu cầu công việc", href: "/admin/hocvienai/work-needs" },
          { label: "Câu hỏi thường gặp", href: "/admin/hocvienai/faq" },
        ],
      },
      {
        label: "AI Workspace",
        items: [
          { label: "Công cụ AI", href: "/admin/tools" },
          { label: "Workspace đề xuất", href: "/admin/aiworkspace/recommended-workspace" },
          { label: "Quy trình AI (Workflow)", href: "/admin/aiworkspace/ai-workflow-sections" },
        ],
      },
      {
        label: "Dự án & Cơ hội",
        items: [
          { label: "Hệ sinh thái (Live-edit)", href: "/admin/duan-cohoi" },
          { label: "Chi tiết: DigiU (Live-edit)", href: "/admin/duan-cohoi/digiu" },
          { label: "  → Dự án con: Alphamind", href: "/admin/duan-cohoi/digiu/alphamind" },
          { label: "  → Dự án con: WebWisePay", href: "/admin/duan-cohoi/digiu/webwisepay" },
          { label: "  → Dự án con: Deposits", href: "/admin/duan-cohoi/digiu/deposits" },
          { label: "Chi tiết: SolarGroup (Live-edit)", href: "/admin/duan-cohoi/solargroup" },
          { label: "  → Dự án con: Sovelmash", href: "/admin/duan-cohoi/solargroup/sovelmash" },
          { label: "  → Dự án con: AERONOVA", href: "/admin/duan-cohoi/solargroup/aeronova" },
          { label: "Chi tiết: Blockchain & Crypto (Live-edit)", href: "/admin/duan-cohoi/blockchain-crypto" },
          { label: "Chi tiết: Affiliate (Live-edit)", href: "/admin/duan-cohoi/lam-affilate" },
          { label: "Chi tiết: Sàn giao dịch Crypto (Live-edit)", href: "/admin/duan-cohoi/sangiaodich" },
          // Affiliate Hub — 3 bảng generic có sẵn từ trước (seed thật),
          // lần đầu nối Admin UI + Portal (/portal/affiliate-hub). Khác
          // "Chi tiết: Affiliate" ở trên (đó là hệ sinh thái/cơ hội kinh
          // doanh Affiliate bên ngoài — Lazada/Shopee...); đây là hướng
          // dẫn thực chiến + công cụ đề xuất khi làm Affiliate.
          { label: "Affiliate Hub — Nội dung hướng dẫn", href: "/admin/duan-cohoi/affiliate-hub-sections" },
          { label: "Affiliate Hub — Sản phẩm đề xuất", href: "/admin/duan-cohoi/affiliate-products" },
          { label: "Affiliate Hub — Nổi bật tháng này", href: "/admin/duan-cohoi/affiliate-hub-top-products" },
        ],
      },
      {
        label: "Premium",
        items: [
          { label: "Giá khoá học Premium", href: "/admin/course-pricing" },
          { label: "Dashboard (Live-edit)", href: "/admin/premium/dashboard" },
        ],
      },
      {
        label: "Cộng đồng",
        items: [
          { label: "Kênh cộng đồng", href: "/admin/community" },
          { label: "Tin tức cộng đồng", href: "/admin/updates" },
          { label: "Câu chuyện học viên (chưa hiển thị Portal)", href: "/admin/student-success-stories" },
        ],
      },
      {
        label: "Hành trình của tôi",
        items: [
          { label: "Mirror (Live-edit)", href: "/admin/hanh-trinh-cua-toi/mirror" },
          { label: "Nhật ký học tập (Live-edit)", href: "/admin/hanh-trinh-cua-toi/journal" },
          { label: "My Story (Live-edit)", href: "/admin/hanh-trinh-cua-toi/story" },
          { label: "Bản đồ hành trình (Live-edit)", href: "/admin/hanh-trinh-cua-toi/map" },
          { label: "Khu vườn của bạn (Live-edit)", href: "/admin/hanh-trinh-cua-toi/garden" },
        ],
      },
      {
        label: "Sứ mệnh Companion",
        items: [
          { label: "6 khối nội dung (Live-edit)", href: "/admin/su-menh-companion/live-edit" },
          { label: "Ảnh Companion (thứ tự & tiêu đề)", href: "/admin/su-menh-companion/flipbook" },
        ],
      },
    ],
  },
  {
    id: "van-hanh",
    label: "Vận hành",
    items: [
      // Bảng `orders` đã có dữ liệu thật (checkout + webhook SePay).
      { label: "Đơn hàng", href: "/admin/van-hanh/don-hang" },
      // Trạng thái thanh toán đã hiển thị trong cột "status" của Đơn hàng ở
      // trên — không tạo trang thứ 2 cùng sở hữu 1 nguồn dữ liệu.
      { label: "Thanh toán", href: "/admin/van-hanh/thanh-toan" },
      // ADM-V2-03: đính chính — checkout ĐÃ đọc/ghi bảng `coupons` thật
      // (applyCoupon(), src/app/portal/checkout/actions.ts) — CRUD thật.
      { label: "Mã giảm giá", href: "/admin/van-hanh/ma-giam-gia" },
      // Bảng `leads` đã có dữ liệu thật (/api/leads).
      { label: "Khách hàng tiềm năng", href: "/admin/van-hanh/khach-hang-tiem-nang" },
      // "Tiếp thị liên kết" (bảng `referrals`) chuyển hẳn sang Workspace
      // "Affiliate" (mục Referral) — tránh 2 nơi cùng sở hữu 1 nguồn dữ
      // liệu (Single Ownership) khi Chương trình Affiliate được xây đầy đủ.
      // Route cũ /admin/van-hanh/tiep-thi-lien-ket redirect sang đó.
      // Bảng `support_tickets` đã có dữ liệu thật (/portal/support).
      { label: "Hỗ trợ khách hàng", href: "/admin/van-hanh/ho-tro-khach-hang" },
    ],
  },
  {
    id: "affiliate",
    label: "Affiliate",
    // Chương trình Affiliate chính thức VO DUONG AI — tái sử dụng
    // `members.referral_code`/`referrals` (đã tồn tại + đang chạy qua các
    // trigger `set_referral_code`/`on_member_referred`/
    // `handle_order_confirmed_commission`), mở rộng đúng 4 điểm audit xác
    // nhận còn thiếu (capture ref_code lúc đăng ký, cấu hình hoa hồng theo
    // sản phẩm, theo dõi lượt truy cập, yêu cầu thanh toán — xem
    // `supabase-phase27-affiliate-program.sql`, ĐỀ XUẤT, chưa apply).
    items: [
      { label: "Tổng quan", href: "/admin/affiliate" },
      { label: "Thành viên", href: "/admin/affiliate/thanh-vien" },
      { label: "Referral", href: "/admin/affiliate/referral" },
      { label: "Đơn hàng", href: "/admin/affiliate/don-hang" },
      { label: "Hoa hồng", href: "/admin/affiliate/hoa-hong" },
      { label: "Cấu hình hoa hồng theo sản phẩm", href: "/admin/affiliate/cau-hinh-hoa-hong" },
      { label: "Yêu cầu thanh toán", href: "/admin/affiliate/yeu-cau-thanh-toan" },
      { label: "Báo cáo", href: "/admin/affiliate/bao-cao" },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    items: [
      { label: "Chiến dịch", href: "/admin/marketing/chien-dich" },
      { label: "Email Marketing", href: "/admin/marketing/email-marketing" },
      { label: "CTA", href: "/admin/marketing/cta" },
      // ADM-V2-06: đọc thật — phễu chuyển đổi leads→khách mua hàng theo
      // nguồn (khớp email với orders.status=confirmed), không cần GA.
      { label: "Chuyển đổi", href: "/admin/marketing/chuyen-doi" },
      { label: "Phân tích Marketing", href: "/admin/marketing/phan-tich-marketing" },
    ],
  },
  {
    id: "thuong-hieu-media",
    label: "Thương hiệu & Media",
    items: [
      { label: "Brand Studio", href: "/admin/thuong-hieu-media/brand-studio" },
      { label: "Media Center", href: "/admin/thuong-hieu-media/media-center" },
      { label: "Logo & Nhận diện", href: "/admin/thuong-hieu-media/logo-nhan-dien" },
      { label: "Tài nguyên thương hiệu", href: "/admin/thuong-hieu-media/tai-nguyen-thuong-hieu" },
      // ADM-V2-04: đính chính — bảng `documents` (đọc thật ở
      // /portal/resources) là tài liệu tải xuống cho Portal, khác ý tưởng
      // gốc "đọc file Markdown docs/" (chưa từng có gì backing thật).
      { label: "Tài liệu", href: "/admin/thuong-hieu-media/tai-lieu" },
    ],
  },
  {
    id: "he-thong",
    label: "Hệ thống",
    items: [
      { label: "Cấu hình chung", href: "/admin/he-thong/cau-hinh-chung" },
      // ADM-V2-05: đọc thật AI Service Registry (checkAllProvidersHealth())
      // — chỉ boolean đã cấu hình/chưa, KHÔNG hiển thị giá trị secret.
      { label: "API & Tích hợp", href: "/admin/he-thong/api-tich-hop" },
      // Founder tự kéo-thả đổi thứ tự ưu tiên AI Provider (bảng
      // ai_provider_priority) — áp dụng ngay cho mọi lời gọi AI thật qua
      // providerManager.execute(), xem priority-store.ts.
      { label: "Ưu tiên AI Provider", href: "/admin/he-thong/uu-tien-ai" },
      // ADM-V2-05: đọc thật log AI Provider (provider-execution-log.ts,
      // process-local) — khác "log lỗi server chung" (vẫn chưa có).
      { label: "Nhật ký hệ thống", href: "/admin/he-thong/nhat-ky-he-thong" },
      { label: "Sao lưu", href: "/admin/he-thong/sao-luu" },
      // ADM-V2-05: boolean cấu hình hạ tầng lõi (Supabase) + NODE_ENV —
      // KHÔNG hiển thị giá trị biến môi trường nào.
      { label: "Môi trường", href: "/admin/he-thong/moi-truong" },
    ],
  },
];

export type FlatAdminNavEntry = {
  workspaceId: string;
  workspaceLabel: string;
  /** Tên nhóm hiển thị trong kết quả tìm kiếm — subGroup nếu có, ngược lại
   * chính là tên Workspace. */
  groupLabel: string;
  label: string;
  href: string;
  comingSoon?: boolean;
};

/** Làm phẳng `adminWorkspaces` — dùng cho AdminSearch + Dashboard. */
export function flattenAdminNav(): FlatAdminNavEntry[] {
  const out: FlatAdminNavEntry[] = [];
  for (const ws of adminWorkspaces) {
    for (const item of ws.items ?? []) {
      out.push({ workspaceId: ws.id, workspaceLabel: ws.label, groupLabel: ws.label, ...item });
    }
    for (const sg of ws.subGroups ?? []) {
      for (const item of sg.items) {
        out.push({ workspaceId: ws.id, workspaceLabel: ws.label, groupLabel: sg.label, ...item });
      }
    }
  }
  return out;
}
