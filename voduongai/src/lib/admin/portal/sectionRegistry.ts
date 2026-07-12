/**
 * Portal Section Registry — CRUD (PORTAL-SPR-301 Task 1-3).
 *
 * Section = khối nội dung thật bên trong 1 Portal Page (component JSX
 * top-level render trong `page.tsx` thật, VD `PillarHero`, `GemCard`,
 * `CompanionPresenceBand`...) — liệt kê bằng cách đọc trực tiếp JSX của
 * 10 `page.tsx` chính (1/Area), KHÔNG bịa. `ctaNote`/`mediaNote` là TEXT
 * tham chiếu (không phải liên kết cứng tới CTA/Media Registry thật —
 * "Portal Management chỉ lưu reference, không sao chép dữ liệu nghiệp
 * vụ").
 *
 * Không audit sâu Child Page (ngoài phạm vi thời gian hợp lý của 1
 * Sprint, không bắt buộc theo Task 2 — chỉ yêu cầu hiển thị đầy đủ
 * Sections cho Area/Page nói chung, đã có ở 10 Parent Page).
 */

import type { PortalStatus } from "@/lib/admin/portal/areaRegistry";

export type PortalSection = {
  id: string;
  pageId: string;
  name: string;
  visible: boolean;
  sortOrder: number;
  ctaNote: string;
  mediaNote: string;
  status: PortalStatus;
  updatedDate: string;
};

export function emptyPortalSection(pageId: string): Omit<PortalSection, "id"> {
  const today = new Date().toISOString().slice(0, 10);
  return { pageId, name: "", visible: true, sortOrder: 0, ctaNote: "", mediaNote: "", status: "Draft", updatedDate: today };
}

export const PORTAL_SECTIONS_COLLECTION_KEY = "portal-mgmt-sections";

/**
 * Seed — component JSX thật render trực tiếp trong từng `page.tsx`
 * (grep `<ComponentName` trên chính file, loại bỏ UI primitive dùng
 * chung — Link/Button/icon Lucide).
 */
export const PORTAL_SECTIONS_SEED: PortalSection[] = [
  // Trang chủ Học viện (src/app/portal/page.tsx)
  { id: "sec_home_pillar_entrance", pageId: "page_home", name: "Pillar Entrance Card (lối vào 4 Pillar)", visible: true, sortOrder: 1, ctaNote: "Link tới CKOS/Học viện AI/AI Workspace/Dự án & Cơ hội — không phải 1 CTA đơn.", mediaNote: "Icon từng Pillar, không phải ảnh/media thật.", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_home_companion_presence", pageId: "page_home", name: "Companion Presence Band", visible: true, sortOrder: 2, ctaNote: "Không có CTA riêng — dải hiện diện Companion.", mediaNote: "Companion Avatar Set (Media Center, folder_companion).", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_home_companion_thought", pageId: "page_home", name: "Companion Thought Line", visible: true, sortOrder: 3, ctaNote: "Không có.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_home_knowledge_journey", pageId: "page_home", name: "Knowledge Journey Strip", visible: true, sortOrder: 4, ctaNote: "Link tới CKOS/Học viện AI (theo tiến độ tri thức).", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },

  // Companion (src/app/portal/companion/page.tsx)
  { id: "sec_companion_sanctuary_bg", pageId: "page_companion", name: "Sanctuary Background", visible: true, sortOrder: 1, ctaNote: "Không có.", mediaNote: "Nền hiệu ứng, không phải file ảnh tĩnh trong Media Center.", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_companion_living_core", pageId: "page_companion", name: "Living Core (Companion sống)", visible: true, sortOrder: 2, ctaNote: "Không có CTA cố định — tương tác trực tiếp.", mediaNote: "Companion Avatar Set (Media Center).", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_companion_task_entry", pageId: "page_companion", name: "Companion Task Entry", visible: true, sortOrder: 3, ctaNote: "Lối vào nhiệm vụ Companion.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },

  // Hệ tri thức AI — CKOS (src/app/portal/ckos/page.tsx)
  { id: "sec_ckos_hero", pageId: "page_ckos", name: "Pillar Hero", visible: true, sortOrder: 1, ctaNote: "CTA vào Tools/Prompts.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_ckos_quick_search", pageId: "page_ckos", name: "CKOS Quick Search", visible: true, sortOrder: 2, ctaNote: "Không có.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_ckos_gem_cards", pageId: "page_ckos", name: "Gem Card List (Tools/Prompts/Resources)", visible: true, sortOrder: 3, ctaNote: "Link chi tiết từng Gem — dữ liệu thật từ CKOS.", mediaNote: "Vendor Tool Logos (Media Center, folder_tools_logos).", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_ckos_journey_status", pageId: "page_ckos", name: "Journey Status Card", visible: true, sortOrder: 4, ctaNote: "Không có.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },

  // Học viện AI (src/app/portal/hocvienai/page.tsx)
  { id: "sec_hocvienai_hero", pageId: "page_hocvienai", name: "Pillar Hero", visible: true, sortOrder: 1, ctaNote: "CTA vào Lộ trình/Nhiệm vụ.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_hocvienai_work_need", pageId: "page_hocvienai", name: "Work Need Section", visible: true, sortOrder: 2, ctaNote: "Không có.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_hocvienai_journey_card", pageId: "page_hocvienai", name: "Journey Card + Journey Status Card", visible: true, sortOrder: 3, ctaNote: "Link tiếp tục lộ trình (Academy).", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_hocvienai_mission_pilot", pageId: "page_hocvienai", name: "Landing Page Mission Pilot", visible: true, sortOrder: 4, ctaNote: "Không có.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },

  // AI Workspace (src/app/portal/aiworkspace/page.tsx)
  { id: "sec_aiworkspace_workflow", pageId: "page_aiworkspace", name: "AI Workflow Section", visible: true, sortOrder: 1, ctaNote: "Không có.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_aiworkspace_prompt_library", pageId: "page_aiworkspace", name: "Prompt Library Section", visible: true, sortOrder: 2, ctaNote: "Link chi tiết prompt.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_aiworkspace_recommended", pageId: "page_aiworkspace", name: "Recommended Workspace Section", visible: true, sortOrder: 3, ctaNote: "Không có.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_aiworkspace_resource", pageId: "page_aiworkspace", name: "Resource Section (Article/Tool Card)", visible: true, sortOrder: 4, ctaNote: "Link tới Article/Tool.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_aiworkspace_companion_desk", pageId: "page_aiworkspace", name: "Companion Desk", visible: true, sortOrder: 5, ctaNote: "Không có.", mediaNote: "Companion Avatar Set (Media Center).", status: "Active", updatedDate: "2026-07-12" },

  // Dự án & Cơ hội (src/app/portal/duan-cohoi/page.tsx)
  { id: "sec_duancohoi_hero", pageId: "page_duan_cohoi", name: "Pillar Hero", visible: true, sortOrder: 1, ctaNote: "Không có.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_duancohoi_gem_cards", pageId: "page_duan_cohoi", name: "Gem Card List (Ecosystem: DigiU/SolarGroup/Crypto/Blockchain/Trading)", visible: true, sortOrder: 2, ctaNote: "Link chi tiết Ecosystem/Sub-project.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },

  // Premium (src/app/portal/premium/page.tsx)
  { id: "sec_premium_programs", pageId: "page_premium", name: "Premium Program Card List", visible: true, sortOrder: 1, ctaNote: "CTA mua/xem chi tiết sản phẩm.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_premium_course_row", pageId: "page_premium", name: "Course Row", visible: true, sortOrder: 2, ctaNote: "Link khoá học.", mediaNote: "Course PDF (URL động, Media Center).", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_premium_advisor", pageId: "page_premium", name: "Premium Advisor + Premium Consult", visible: true, sortOrder: 3, ctaNote: "CTA tư vấn.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_premium_founder_spotlight", pageId: "page_premium", name: "Founder Spotlight", visible: true, sortOrder: 4, ctaNote: "Không có.", mediaNote: "founder-portrait.jpg (Media Center — đính chính route ở MEDIA-SPR-202).", status: "Active", updatedDate: "2026-07-12" },

  // Hành trình của tôi (src/app/portal/hanhtrinhcuatoi/page.tsx)
  { id: "sec_hanhtrinh_current_chapter", pageId: "page_hanhtrinh", name: "Current Chapter Card", visible: true, sortOrder: 1, ctaNote: "Không có.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_hanhtrinh_growth_activity", pageId: "page_hanhtrinh", name: "Growth Activity Panel", visible: true, sortOrder: 2, ctaNote: "Không có.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_hanhtrinh_companion_memory", pageId: "page_hanhtrinh", name: "Companion Memory Line", visible: true, sortOrder: 3, ctaNote: "Không có.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },

  // Sứ mệnh Companion (src/app/portal/su-menh-companion/page.tsx)
  { id: "sec_sumenh_sanctuary_bg", pageId: "page_su_menh_companion", name: "Sanctuary Background", visible: true, sortOrder: 1, ctaNote: "Không có.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_sumenh_living_core", pageId: "page_su_menh_companion", name: "Living Core", visible: true, sortOrder: 2, ctaNote: "Không có.", mediaNote: "Companion Avatar Set (Media Center).", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_sumenh_companion_experience", pageId: "page_su_menh_companion", name: "Companion Experience", visible: true, sortOrder: 3, ctaNote: "Không có.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },

  // Cộng đồng (src/app/portal/congdongai/page.tsx)
  { id: "sec_congdong_guides", pageId: "page_congdongai", name: "Community Guides", visible: true, sortOrder: 1, ctaNote: "Không có.", mediaNote: "founder-portrait.jpg (FOUNDER.photo, đính chính route ở MEDIA-SPR-202).", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_congdong_map", pageId: "page_congdongai", name: "Community Map Panel", visible: true, sortOrder: 2, ctaNote: "Không có.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },
  { id: "sec_congdong_showcase", pageId: "page_congdongai", name: "Showcase Item List", visible: true, sortOrder: 3, ctaNote: "Không có.", mediaNote: "Không có.", status: "Active", updatedDate: "2026-07-12" },
];
