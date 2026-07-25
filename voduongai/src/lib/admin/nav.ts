export type AdminNavItem = { label: string; href: string };
export type AdminNavGroup = { group: string | null; items: AdminNavItem[] };

/**
 * Nguồn sự thật cho AdminSidebar + AdminSearch. Chỉ liệt kê route THẬT SỰ
 * tồn tại — khung admin đang được dựng lại từng phần (xem docs kế hoạch),
 * thêm entry mới ở đây mỗi khi 1 collection có page.tsx riêng, không thêm
 * trước để tránh link chết trong chính sidebar.
 *
 * NGUYÊN TẮC BẮT BUỘC (audit menu, xem CLAUDE.md mục "Admin — Audit menu
 * điều hướng"): mỗi group (trừ `group: null`) ánh xạ 1:1 với ĐÚNG MỘT mục
 * trong menu Portal thật (`portalNavSections`, `src/lib/portal/hubs.ts`),
 * cùng tên gọi, cùng thứ tự Portal đang hiển thị:
 *   Trang chủ Học viện → Companion → Hệ tri thức AI (CKOS) → Học viện AI
 *   → AI Workspace → Dự án & Cơ hội → Premium → Hành trình của tôi →
 *   Sứ mệnh Companion → Cộng đồng.
 * KHÔNG được gộp 2 mục Portal khác nhau vào 1 group dù chúng dùng chung
 * file dữ liệu nguồn hay lý do kỹ thuật nào khác — dùng chung nguồn dữ
 * liệu là chi tiết triển khai, không phải lý do gộp menu. "Cộng đồng"
 * hiện CHƯA có route Admin nào — không tự thêm group giả, chỉ thêm khi có
 * page.tsx thật.
 */
export const adminNavGroups: AdminNavGroup[] = [
  {
    group: null,
    items: [{ label: "Tổng quan", href: "/admin/dashboard" }],
  },
  {
    // Portal #1 — "Trang chủ Học viện" (/portal). Bảng `home-cards` là nội
    // dung duy nhất Admin quản được của trang chủ Portal.
    //
    // Nhóm 3 — thay VisualEditor cũ bằng Live-edit (Cách A): route giữ
    // nguyên href (không đổi để Dashboard/navIcons không cần sửa gì
    // thêm), NHƯNG page.tsx tại route này giờ render lại đúng
    // /portal/page.tsx thật (bọc EditModeProvider) thay vì form
    // VisualEditor tách biệt — sửa tại chỗ, xem trước y hệt Portal thật.
    group: "Trang chủ Học viện",
    items: [{ label: "Thẻ trang chủ (Live-edit)", href: "/admin/home-cards" }],
  },
  {
    // Portal #2 — "Companion" (/portal/companion, trải nghiệm AI Presence).
    // KHÔNG nhầm với "Sứ mệnh Companion" (/portal/su-menh-companion, triết
    // lý thương hiệu) — 2 mục Portal khác nhau, đã tách nhóm riêng.
    group: "Companion",
    items: [{ label: "Companion (CMS quản trị AI Mentor)", href: "/admin/companion" }],
  },
  {
    // Portal #3 — "Hệ tri thức AI (CKOS)" (/portal/ckos). Tên nhóm ĐÃ SỬA
    // để khớp đúng tên Portal (trước đây thiếu chữ "AI": "Hệ tri thức
    // (CKOS)"). Thứ tự items bám theo đúng thứ tự hiển thị của hub
    // /portal/ckos (getKnowledgeCategories()): Prompt, Workflow(SOP),
    // Resource — sau đó nối thêm Template/Ebook/Checklist (cùng họ schema
    // AdminResource, không có card riêng trên hub nhưng có bảng Supabase +
    // route quản lý riêng). UI language layer (Folder → Card → Content) —
    // chỉ đổi nhãn hiển thị, không đổi route/collectionKey/schema.
    group: "Hệ tri thức AI (CKOS)",
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
    // Portal #4 — "Học viện AI" (/portal/hocvienai). Việc 10 — WORK_NEEDS/
    // FAQ gốc từ src/data/portal/ai-workspace.ts, nhưng thuộc VỀ trang này
    // (xác nhận qua audit: WorkNeedSection/FAQ chỉ render ở
    // /portal/hocvienai) — xem CLAUDE.md mục "Việc 10 + Việc 11".
    group: "Học viện AI",
    items: [
      { label: "Theo nhu cầu công việc", href: "/admin/hocvienai/work-needs" },
      { label: "Câu hỏi thường gặp", href: "/admin/hocvienai/faq" },
    ],
  },
  {
    // Portal #5 — "AI Workspace" (/portal/aiworkspace). SỬA: "Công cụ AI"
    // (bảng `tools`) trước đây nằm lẫn trong nhóm "Nội dung" — đã xác nhận
    // qua CLAUDE.md ("Công cụ AI (tools): Full") bảng này nuôi trực tiếp
    // /portal/aiworkspace (AI Toolbox theo nhiệm vụ) + /portal/aiworkspace/
    // [slug], nên PHẢI thuộc nhóm này, không phải "Nội dung". Việc 11 —
    // RECOMMENDED_WORKSPACES/AI_WORKFLOWS cùng gốc ai-workspace.ts nhưng
    // thuộc trang này (xác nhận qua audit).
    group: "AI Workspace",
    items: [
      { label: "Công cụ AI", href: "/admin/tools" },
      { label: "Workspace đề xuất", href: "/admin/aiworkspace/recommended-workspace" },
      { label: "Quy trình AI (Workflow)", href: "/admin/aiworkspace/ai-workflow-sections" },
    ],
  },
  {
    // Portal #6 — "Dự án & Cơ hội" (/portal/duan-cohoi). SỬA: trước đây
    // nằm lẫn trong nhóm "Nội dung" — tách thành group riêng đúng tên
    // Portal.
    //
    // Nhóm 3 — Live-edit hub: `/admin/projects` (DataTable cũ) đã XOÁ,
    // thay bằng `/admin/duan-cohoi` (Cách A — render lại đúng trang hub
    // thật, sửa 9 field + kéo-thả đổi thứ tự qua ProjectCards.tsx).
    //
    // Nhóm 3, Phần D (mở rộng, theo yêu cầu riêng của Founder) — 5 trang
    // chi tiết hệ sinh thái [ecosystemSlug] giờ CÓ route Live-edit riêng
    // (CHỈ 2 field an toàn: tiêu đề/mô tả ngắn — không đụng highlights/
    // subProjects/marketingLinks/... phức tạp, vẫn tĩnh từ ecosystems.ts).
    // 1 route dynamic `/admin/duan-cohoi/[ecosystemSlug]` phục vụ cả 5,
    // liệt kê tường minh 5 slug thật ở đây (ổn định, không đổi thường
    // xuyên) thay vì chỉ có 1 link chung chung.
    //
    // Mở rộng riêng (sau khi Nhóm 3 đóng) — "Cập nhật thông tin mới" +
    // "Đánh giá" cấp DỰ ÁN CON: 1 route dynamic
    // `/admin/duan-cohoi/[ecosystemSlug]/[subProjectSlug]` phục vụ cả 5 dự
    // án con hiện có (3 DigiU + 2 SolarGroup) — liệt kê tường minh, cùng
    // cách làm với 5 trang chi tiết hệ sinh thái ở trên.
    group: "Dự án & Cơ hội",
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
    ],
  },
  {
    // Portal #7 — "Premium" (/portal/premium). SỬA: trước đây nằm lẫn
    // trong nhóm "Nội dung" dưới tên "Giá khoá học Premium" làm cả group
    // lẫn item — tách group riêng đúng tên Portal ("Premium"), giữ tên
    // item mô tả rõ nội dung quản lý.
    //
    // Course Builder (Bước 3): KHÔNG liệt kê 5 khoá riêng ở đây — route
    // builder có [courseId] động, vào qua nút "Quản lý nội dung" ở mỗi
    // dòng trong /admin/course-pricing (đã có), không cần entry sidebar
    // riêng cho từng khoá.
    //
    // Premium Dashboard (Live-edit, theo yêu cầu riêng của Founder) — thêm
    // MỚI bên cạnh "Giá khoá học Premium", KHÔNG thay thế/đổi route đó.
    // Chỉ quản chữ tĩnh an toàn (Hero/2 nhãn section/4 bước thanh toán/FAQ)
    // của /portal/premium — xem CLAUDE.md mục "Premium — Dashboard Live-edit".
    group: "Premium",
    items: [
      { label: "Giá khoá học Premium", href: "/admin/course-pricing" },
      { label: "Dashboard (Live-edit)", href: "/admin/premium/dashboard" },
    ],
  },
  {
    // Portal #8 — "Hành trình của tôi" (/portal/hanhtrinhcuatoi). Việc 9 —
    // 5 cửa, tách dần từng cửa. CHỈ static chrome — KHÔNG đụng dữ liệu
    // động (reflections/memory_capsules/growth-view.ts/localStorage) —
    // xem CLAUDE.md mục "Hành trình của tôi".
    //
    // Nhóm 3 — Mirror: gộp 2 route VisualEditor cũ (mirror-chrome,
    // mirror-questions) thành 1 route Live-edit duy nhất.
    group: "Hành trình của tôi",
    items: [
      { label: "Mirror (Live-edit)", href: "/admin/hanh-trinh-cua-toi/mirror" },
      { label: "Nhật ký học tập (Live-edit)", href: "/admin/hanh-trinh-cua-toi/journal" },
      { label: "My Story (Live-edit)", href: "/admin/hanh-trinh-cua-toi/story" },
      { label: "Bản đồ hành trình (Live-edit)", href: "/admin/hanh-trinh-cua-toi/map" },
      { label: "Khu vườn của bạn (Live-edit)", href: "/admin/hanh-trinh-cua-toi/garden" },
    ],
  },
  {
    // Portal #9 — "Sứ mệnh Companion" (/portal/su-menh-companion, triết lý
    // thương hiệu — KHÔNG phải mục #2 "Companion" ở trên). Việc 6 (Nhóm B)
    // — Founder xác nhận cần tự sửa 6 khối nội dung.
    //
    // Nhóm 3, Phần C — pilot inline-edit (Điều lệ + Bộ gene) đã mở rộng
    // thành Live-edit CHÍNH THỨC cho đủ 6 khối, gộp 6 route VisualEditor
    // cũ (Sứ mệnh/Triết lý/Điều lệ/Bộ gene/Hành trình tiến hoá/Dòng thời
    // gian) thành 1 route duy nhất. "Ảnh Companion" (Flipbook) GIỮ NGUYÊN
    // route riêng (VisualEditor) — carousel xem 1 trang/lần không phù hợp
    // kéo-thả qua Cách A, xem comment trong
    // `su-menh-companion/live-edit/page.tsx`.
    group: "Sứ mệnh Companion",
    items: [
      { label: "6 khối nội dung (Live-edit)", href: "/admin/su-menh-companion/live-edit" },
      { label: "Ảnh Companion (thứ tự & tiêu đề)", href: "/admin/su-menh-companion/flipbook" },
    ],
  },
  {
    // Portal #10 — "Cộng đồng" (/portal/congdongai). Việc 8 — lấp gap đã ghi
    // nhận ở đợt audit menu trước. "Câu chuyện học viên" CHƯA nối hiển thị
    // lên Portal (dữ liệu bịa trùng trang đã archive, chờ Founder nhập nội
    // dung thật) — chỉ để Founder tự quản qua Admin, xem CLAUDE.md mục
    // "Việc 8 — Cộng đồng". Bảng `news` (mồ côi, không consumer nào) CHỦ
    // ĐÍCH không có route ở đây — xem CLAUDE.md, không phải bỏ sót.
    group: "Cộng đồng",
    items: [
      { label: "Kênh cộng đồng", href: "/admin/community" },
      { label: "Tin tức cộng đồng", href: "/admin/updates" },
      { label: "Câu chuyện học viên (chưa hiển thị Portal)", href: "/admin/student-success-stories" },
    ],
  },
];
