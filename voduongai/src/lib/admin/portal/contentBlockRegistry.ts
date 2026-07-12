/**
 * Portal Content Block Registry — CRUD (PORTAL-SPR-301 Task 1-4).
 *
 * "Content" trong chuỗi Portal Area → Page → Child Page → Section →
 * Content → Workspace Owner (Objective của brief). MỖI Content Block có
 * ĐÚNG 1 `workspaceOwner` (Acceptance) — Registry này KHÔNG lưu dữ liệu
 * nghiệp vụ thật (không copy danh sách Tool/Prompt/Product...), chỉ lưu
 * `contentTypeNote` mô tả LOẠI nội dung xuất hiện trong Section đó và ai
 * sở hữu — đúng "Portal chỉ lưu reference và presentation context".
 *
 * Tên "Content Block" (không phải "Content") để tránh trùng khái niệm
 * với `/admin/portal/content` (Content Registry cũ, ADM-SPR-200 — trang
 * tổng hợp CHÉO mọi Registry Website/Brand đã có Consumer thật, khác vai
 * trò với Content Block ở đây — không gộp, không xoá trang cũ).
 */

import type { PortalStatus } from "@/lib/admin/portal/areaRegistry";

export type PortalContentBlock = {
  id: string;
  sectionId: string;
  title: string;
  contentTypeNote: string;
  /** Đúng 1 Workspace sở hữu — bắt buộc, không được để trống khi Active. */
  workspaceOwner: string;
  visible: boolean;
  sortOrder: number;
  status: PortalStatus;
  updatedDate: string;
};

export function emptyPortalContentBlock(sectionId: string): Omit<PortalContentBlock, "id"> {
  const today = new Date().toISOString().slice(0, 10);
  return { sectionId, title: "", contentTypeNote: "", workspaceOwner: "", visible: true, sortOrder: 0, status: "Draft", updatedDate: today };
}

export const PORTAL_CONTENT_BLOCKS_COLLECTION_KEY = "portal-mgmt-content";

/**
 * Seed — 1 Content Block / Section (33 Section thật ở `sectionRegistry.ts`).
 * `workspaceOwner` = owner của Page chứa Section đó (đã xác nhận ở
 * `pageRegistry.ts`), trừ 2 Section thuộc Trang chủ Học viện (Area không
 * có Owner) mang tính tổng hợp đa-Workspace thật — chọn Owner gần đúng
 * nhất + ghi rõ trong `contentTypeNote`, KHÔNG bịa 1 Owner chắc chắn khi
 * thực tế không có.
 */
export const PORTAL_CONTENT_BLOCKS_SEED: PortalContentBlock[] = [
  { id: "content_home_pillar_entrance", sectionId: "sec_home_pillar_entrance", title: "4 thẻ lối vào Pillar", contentTypeNote: "⚠️ Đa-Workspace thật (CKOS/Academy/AI Workspace/Projects & Opportunities) — chọn CKOS làm Owner gần đúng (Pillar đầu tiên), cần Founder xác nhận Owner chính thức.", workspaceOwner: "CKOS", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_home_companion_presence", sectionId: "sec_home_companion_presence", title: "Dải hiện diện Companion", contentTypeNote: "Trạng thái Companion thời gian thực.", workspaceOwner: "Companion Studio", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_home_companion_thought", sectionId: "sec_home_companion_thought", title: "Câu thoại Companion", contentTypeNote: "Text ngắn động theo trạng thái người dùng.", workspaceOwner: "Companion Studio", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_home_knowledge_journey", sectionId: "sec_home_knowledge_journey", title: "Dải tiến độ hành trình tri thức", contentTypeNote: "⚠️ Đa-Workspace thật (CKOS + Academy) — chọn CKOS làm Owner gần đúng, cần Founder xác nhận.", workspaceOwner: "CKOS", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },

  { id: "content_companion_sanctuary_bg", sectionId: "sec_companion_sanctuary_bg", title: "Nền hiệu ứng Sanctuary", contentTypeNote: "Hiệu ứng nền, không phải nội dung nghiệp vụ.", workspaceOwner: "Companion Studio", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_companion_living_core", sectionId: "sec_companion_living_core", title: "Nhân vật Companion sống", contentTypeNote: "Trạng thái/animation Companion theo persona.", workspaceOwner: "Companion Studio", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_companion_task_entry", sectionId: "sec_companion_task_entry", title: "Danh sách nhiệm vụ Companion", contentTypeNote: "Nhiệm vụ tương tác Companion.", workspaceOwner: "Companion Studio", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },

  { id: "content_ckos_hero", sectionId: "sec_ckos_hero", title: "Tiêu đề + mô tả CKOS", contentTypeNote: "Text giới thiệu Pillar CKOS.", workspaceOwner: "CKOS", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_ckos_quick_search", sectionId: "sec_ckos_quick_search", title: "Ô tìm kiếm nhanh CKOS", contentTypeNote: "Không có nội dung tĩnh — công cụ tìm kiếm.", workspaceOwner: "CKOS", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_ckos_gem_cards", sectionId: "sec_ckos_gem_cards", title: "Danh sách Tools/Prompts/Resources", contentTypeNote: "Dữ liệu Tools/Prompts/Resources thật — CKOS sở hữu, Registry này chỉ tham chiếu, không copy danh sách.", workspaceOwner: "CKOS", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_ckos_journey_status", sectionId: "sec_ckos_journey_status", title: "Trạng thái tiến độ CKOS", contentTypeNote: "Tính từ growth-view engine — CKOS.", workspaceOwner: "CKOS", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },

  { id: "content_hocvienai_hero", sectionId: "sec_hocvienai_hero", title: "Tiêu đề + mô tả Học viện AI", contentTypeNote: "Text giới thiệu Pillar Academy.", workspaceOwner: "Academy", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_hocvienai_work_need", sectionId: "sec_hocvienai_work_need", title: "Nhu cầu công việc gợi ý", contentTypeNote: "Gợi ý nội dung theo nhu cầu — Academy.", workspaceOwner: "Academy", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_hocvienai_journey_card", sectionId: "sec_hocvienai_journey_card", title: "Lộ trình + trạng thái tiến độ", contentTypeNote: "Lộ trình thành công (Academy).", workspaceOwner: "Academy", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_hocvienai_mission_pilot", sectionId: "sec_hocvienai_mission_pilot", title: "Nhiệm vụ hôm nay (Mission Pilot)", contentTypeNote: "Nhiệm vụ hôm nay (Academy).", workspaceOwner: "Academy", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },

  { id: "content_aiworkspace_workflow", sectionId: "sec_aiworkspace_workflow", title: "Danh sách Workflow AI", contentTypeNote: "Workflow gợi ý — AI Workspace (chưa xây CRUD nghiệp vụ, ngoài phạm vi Sprint này).", workspaceOwner: "AI Workspace", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_aiworkspace_prompt_library", sectionId: "sec_aiworkspace_prompt_library", title: "Thư viện Prompt gợi ý", contentTypeNote: "AI Workspace.", workspaceOwner: "AI Workspace", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_aiworkspace_recommended", sectionId: "sec_aiworkspace_recommended", title: "Workspace gợi ý", contentTypeNote: "AI Workspace.", workspaceOwner: "AI Workspace", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_aiworkspace_resource", sectionId: "sec_aiworkspace_resource", title: "Bài viết/Tool liên quan", contentTypeNote: "AI Workspace.", workspaceOwner: "AI Workspace", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_aiworkspace_companion_desk", sectionId: "sec_aiworkspace_companion_desk", title: "Companion hỗ trợ tại AI Workspace", contentTypeNote: "Companion xuất hiện tại đây nhưng nội dung do AI Workspace định nghĩa ngữ cảnh.", workspaceOwner: "AI Workspace", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },

  { id: "content_duancohoi_hero", sectionId: "sec_duancohoi_hero", title: "Tiêu đề + mô tả Dự án & Cơ hội", contentTypeNote: "Text giới thiệu Pillar.", workspaceOwner: "Projects & Opportunities", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_duancohoi_gem_cards", sectionId: "sec_duancohoi_gem_cards", title: "Danh sách Ecosystem đầu tư", contentTypeNote: "DigiU/SolarGroup/Crypto/Blockchain/Trading — Projects & Opportunities.", workspaceOwner: "Projects & Opportunities", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },

  { id: "content_premium_programs", sectionId: "sec_premium_programs", title: "Danh sách sản phẩm Premium", contentTypeNote: "Sản phẩm số/khoá học — Premium.", workspaceOwner: "Premium", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_premium_course_row", sectionId: "sec_premium_course_row", title: "Danh sách khoá học", contentTypeNote: "Premium.", workspaceOwner: "Premium", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_premium_advisor", sectionId: "sec_premium_advisor", title: "Tư vấn viên Premium", contentTypeNote: "Premium.", workspaceOwner: "Premium", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_premium_founder_spotlight", sectionId: "sec_premium_founder_spotlight", title: "Founder Spotlight", contentTypeNote: "Ảnh + nội dung Founder xuất hiện tại Premium — Media Center sở hữu asset, Premium sở hữu ngữ cảnh hiển thị.", workspaceOwner: "Premium", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },

  { id: "content_hanhtrinh_current_chapter", sectionId: "sec_hanhtrinh_current_chapter", title: "Chương hiện tại", contentTypeNote: "Journey.", workspaceOwner: "Journey", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_hanhtrinh_growth_activity", sectionId: "sec_hanhtrinh_growth_activity", title: "Hoạt động tăng trưởng", contentTypeNote: "Journey.", workspaceOwner: "Journey", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_hanhtrinh_companion_memory", sectionId: "sec_hanhtrinh_companion_memory", title: "Ký ức Companion theo hành trình", contentTypeNote: "Companion xuất hiện tại đây nhưng ngữ cảnh do Journey định nghĩa.", workspaceOwner: "Journey", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },

  { id: "content_sumenh_sanctuary_bg", sectionId: "sec_sumenh_sanctuary_bg", title: "Nền hiệu ứng Sanctuary", contentTypeNote: "Companion Studio.", workspaceOwner: "Companion Studio", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_sumenh_living_core", sectionId: "sec_sumenh_living_core", title: "Nhân vật Companion (Sứ mệnh)", contentTypeNote: "Companion Studio.", workspaceOwner: "Companion Studio", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_sumenh_companion_experience", sectionId: "sec_sumenh_companion_experience", title: "Trải nghiệm Sứ mệnh Companion", contentTypeNote: "Companion Studio.", workspaceOwner: "Companion Studio", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },

  { id: "content_congdong_guides", sectionId: "sec_congdong_guides", title: "Danh sách Guide cộng đồng", contentTypeNote: "Gồm Founder (FOUNDER.photo) — Community.", workspaceOwner: "Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_congdong_map", sectionId: "sec_congdong_map", title: "Bản đồ cộng đồng", contentTypeNote: "Community.", workspaceOwner: "Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_congdong_showcase", sectionId: "sec_congdong_showcase", title: "Danh sách Showcase", contentTypeNote: "Community.", workspaceOwner: "Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
];
