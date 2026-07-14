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

  { id: "content_companion_presence", sectionId: "sec_companion_presence", title: "Nền Sanctuary + Living Core", contentTypeNote: "Hiệu ứng nền + trạng thái/animation Companion theo persona (companion-identity.ts) — không phải file ảnh tĩnh.", workspaceOwner: "Companion Studio", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_companion_thought", sectionId: "sec_companion_thought", title: "Today's Thought", contentTypeNote: "Random 1/7 câu — companion-inner-life.ts → COMPANION_TODAY_THOUGHTS, hardcode.", workspaceOwner: "Companion Studio", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_companion_memory", sectionId: "sec_companion_memory", title: "Kỷ niệm gần nhất", contentTypeNote: "Tính từ getRecentActivity() (growth-view.ts) — dữ liệu thật của user, không hardcode.", workspaceOwner: "Companion Studio", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_companion_musing", sectionId: "sec_companion_musing", title: "Musing (đang nghĩ)", contentTypeNote: "Random 1/7 câu — companion-inner-life.ts → COMPANION_MUSINGS, hardcode.", workspaceOwner: "Companion Studio", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_companion_mission_suggestion", sectionId: "sec_companion_mission_suggestion", title: "Gợi ý một việc cho hôm nay", contentTypeNote: "Tính từ getJourneyProgress() (growth-view.ts) — dữ liệu thật, câu văn hardcode trong page.tsx.", workspaceOwner: "Companion Studio", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_companion_task_entry", sectionId: "sec_companion_task_entry", title: "Companion Task Entry", contentTypeNote: "Form nhập tự do — chuyển hướng /portal/workspace qua startCompanionWorkspace(), không phải danh sách nhiệm vụ có sẵn.", workspaceOwner: "Companion Studio", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_companion_reflection", sectionId: "sec_companion_reflection", title: "Lời mời xem hành trình", contentTypeNote: "Text tĩnh + link /portal/hanhtrinhcuatoi (Journey sở hữu nội dung đích).", workspaceOwner: "Companion Studio", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_companion_silence", sectionId: "sec_companion_silence", title: "Câu khoảng lặng", contentTypeNote: "1 câu tĩnh trong page.tsx.", workspaceOwner: "Companion Studio", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_companion_footer", sectionId: "sec_companion_footer", title: "Link Sứ mệnh Companion", contentTypeNote: "Text + link tĩnh → /portal/su-menh-companion.", workspaceOwner: "Companion Studio", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },

  { id: "content_ckos_hero", sectionId: "sec_ckos_hero", title: "Tiêu đề + mô tả CKOS", contentTypeNote: "Text giới thiệu Pillar CKOS.", workspaceOwner: "CKOS", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_ckos_quick_search", sectionId: "sec_ckos_quick_search", title: "Ô tìm kiếm nhanh CKOS", contentTypeNote: "Không có nội dung tĩnh — công cụ tìm kiếm.", workspaceOwner: "CKOS", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_ckos_gem_cards", sectionId: "sec_ckos_gem_cards", title: "Danh sách Tools/Prompts/Resources", contentTypeNote: "Dữ liệu Tools/Prompts/Resources thật — CKOS sở hữu, Registry này chỉ tham chiếu, không copy danh sách.", workspaceOwner: "CKOS", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_ckos_journey_status", sectionId: "sec_ckos_journey_status", title: "Trạng thái tiến độ CKOS", contentTypeNote: "Tính từ growth-view engine — CKOS.", workspaceOwner: "CKOS", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },

  { id: "content_hocvienai_hero", sectionId: "sec_hocvienai_hero", title: "Tiêu đề + mô tả Học viện AI", contentTypeNote: "Text giới thiệu Pillar Academy.", workspaceOwner: "Academy", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_hocvienai_work_need", sectionId: "sec_hocvienai_work_need", title: "Nhu cầu công việc gợi ý", contentTypeNote: "Gợi ý nội dung theo nhu cầu — Academy.", workspaceOwner: "Academy", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_hocvienai_journey_card", sectionId: "sec_hocvienai_journey_card", title: "Lộ trình + trạng thái tiến độ", contentTypeNote: "Lộ trình thành công (Academy).", workspaceOwner: "Academy", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_hocvienai_mission_pilot", sectionId: "sec_hocvienai_mission_pilot", title: "Nhiệm vụ hôm nay (Mission Pilot)", contentTypeNote: "Nhiệm vụ hôm nay (Academy).", workspaceOwner: "Academy", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },

  { id: "content_aiworkspace_hero", sectionId: "sec_aiworkspace_hero", title: "Tiêu đề + mô tả AI Workspace", contentTypeNote: "Text giới thiệu hardcode trực tiếp trong page.tsx — không phải dữ liệu quản lý được.", workspaceOwner: "AI Workspace", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_aiworkspace_companion_desk", sectionId: "sec_aiworkspace_companion_desk", title: "Companion hỗ trợ tại AI Workspace", contentTypeNote: "Form nhập mục tiêu tự do — không có danh sách nội dung để quản lý, chỉ có ngữ cảnh do AI Workspace định nghĩa.", workspaceOwner: "AI Workspace", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_aiworkspace_recommended", sectionId: "sec_aiworkspace_recommended", title: "Workspace gợi ý", contentTypeNote: "RECOMMENDED_WORKSPACES — 8 mục hardcode trong src/data/portal/ai-workspace.ts. Chưa có CRUD (AIWS-SPR-501, xem báo cáo).", workspaceOwner: "AI Workspace", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_aiworkspace_workflow", sectionId: "sec_aiworkspace_workflow", title: "Danh sách Workflow AI", contentTypeNote: "AI_WORKFLOWS — 4 mục hardcode trong src/data/portal/ai-workspace.ts. Chưa có CRUD (AIWS-SPR-501).", workspaceOwner: "AI Workspace", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_aiworkspace_prompt_library", sectionId: "sec_aiworkspace_prompt_library", title: "Thư viện Prompt gợi ý", contentTypeNote: "⚠️ Mảng `prompts` hardcode RIÊNG trong src/data/prompts.ts (10 mục) — KHÔNG phải bảng Supabase `prompts` do CKOS sở hữu (/admin/prompts). 2 nguồn Prompt trùng tên khác nhau. Chưa có CRUD cho mảng này (AIWS-SPR-501).", workspaceOwner: "AI Workspace", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_aiworkspace_toolbox", sectionId: "sec_aiworkspace_toolbox", title: "AI Toolbox theo nhiệm vụ", contentTypeNote: "AI_TOOLS — 82 mục hardcode trong src/data/khong-gian-ai/index.ts (hiển thị 10 mục featured). Chưa có CRUD (AIWS-SPR-501).", workspaceOwner: "AI Workspace", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_aiworkspace_resource", sectionId: "sec_aiworkspace_resource", title: "Tài nguyên thực hành", contentTypeNote: "AI_RESOURCES — 4 mục hardcode trong src/data/portal/ai-workspace.ts. Chưa có CRUD (AIWS-SPR-501).", workspaceOwner: "AI Workspace", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_aiworkspace_blog", sectionId: "sec_aiworkspace_blog", title: "Blog AI (bài viết nổi bật)", contentTypeNote: "AI_ARTICLES — 23 mục hardcode trong src/data/khong-gian-ai/index.ts (hiển thị mục featured); nội dung bài viết đọc qua getBlogPost() (src/data/blog.ts), cũng hardcode. Chưa có CRUD (AIWS-SPR-501).", workspaceOwner: "AI Workspace", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_aiworkspace_footer_cta", sectionId: "sec_aiworkspace_footer_cta", title: "CTA cuối trang", contentTypeNote: "Text + link tĩnh hardcode trong page.tsx.", workspaceOwner: "AI Workspace", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },

  { id: "content_duancohoi_hero", sectionId: "sec_duancohoi_hero", title: "Tiêu đề + mô tả Dự án & Cơ hội", contentTypeNote: "Text giới thiệu Pillar.", workspaceOwner: "Projects & Opportunities", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-12" },
  { id: "content_duancohoi_gem_cards", sectionId: "sec_duancohoi_gem_cards", title: "Danh sách Ecosystem đầu tư", contentTypeNote: "[ĐÃ XỬ LÝ — PROJECTS-SPR-602] Hết trùng lặp — page.tsx giờ đọc thẳng collection \"ecosystems\" (canonical, CRUD thật tại /admin/projects-opportunities/ecosystems), không còn mảng ECOSYSTEMS hardcode riêng.", workspaceOwner: "Projects & Opportunities", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_duancohoi_companion_marquee", sectionId: "sec_duancohoi_companion_marquee", title: "8 tile minh hoạ Companion đồng hành", contentTypeNote: "COMPANION_PLACEHOLDERS — hardcode trong page.tsx, chưa có CRUD.", workspaceOwner: "Projects & Opportunities", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_duancohoi_why_page_exists", sectionId: "sec_duancohoi_why_page_exists", title: "Nội dung \"Vì sao trang này tồn tại\"", contentTypeNote: "Text tĩnh trong page.tsx.", workspaceOwner: "Projects & Opportunities", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_duancohoi_criteria", sectionId: "sec_duancohoi_criteria", title: "4 tiêu chí chia sẻ", contentTypeNote: "CRITERIA — hardcode trong page.tsx, chưa có CRUD.", workspaceOwner: "Projects & Opportunities", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_duancohoi_faq", sectionId: "sec_duancohoi_faq", title: "3 câu hỏi thường gặp", contentTypeNote: "FAQ — hardcode trong page.tsx, chưa có CRUD (khác FAQ Scope brief yêu cầu — không có FAQ theo từng Ecosystem).", workspaceOwner: "Projects & Opportunities", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_duancohoi_companion_quotes", sectionId: "sec_duancohoi_companion_quotes", title: "5 câu Companion muốn nhắn gửi", contentTypeNote: "COMPANION_QUOTES — hardcode trong page.tsx, chưa có CRUD.", workspaceOwner: "Projects & Opportunities", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },

  { id: "content_premium_hero", sectionId: "sec_premium_hero", title: "Tiêu đề + mô tả Premium", contentTypeNote: "Text giới thiệu hardcode trong page.tsx.", workspaceOwner: "Premium", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_premium_advisor", sectionId: "sec_premium_advisor", title: "Companion Advisor", contentTypeNote: "Component PremiumAdvisor, nhận danh sách chương trình đã sở hữu (ownedProgramNames) — Premium.", workspaceOwner: "Premium", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_premium_programs", sectionId: "sec_premium_programs", title: "5 chương trình (⚠️ KHÔNG phải bảng products/\"Sản phẩm số\")", contentTypeNote: "⚠️ Đính chính PREMIUM-SPR-701: nội dung/curriculum (topics/description/badge/audience/outcome/lessonCount) 100% hardcode trong src/components/portal/premium/premium-programs.ts — CHƯA có CRUD (PREMIUM-SPR-701, xem báo cáo). Chỉ price/status đọc thật từ Supabase courses (/admin/course-pricing). Bảng `products` (\"Sản phẩm số\", /admin/premium) ĐÃ bị gỡ khỏi trang này theo yêu cầu Product Owner — 0 Consumer.", workspaceOwner: "Premium", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_premium_consult", sectionId: "sec_premium_consult", title: "Tư vấn 1:1 — SĐT + Zalo", contentTypeNote: "Hardcode trong PremiumConsult.tsx (không phải siteConfig dù comment gốc claim vậy) — không có giá/checkout/order, CHƯA có CRUD.", workspaceOwner: "Premium", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_premium_founder_spotlight", sectionId: "sec_premium_founder_spotlight", title: "Founder Spotlight", contentTypeNote: "Ảnh + nội dung Founder xuất hiện tại Premium — Media Center sở hữu asset, Premium sở hữu ngữ cảnh hiển thị.", workspaceOwner: "Premium", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_premium_payment_faq", sectionId: "sec_premium_payment_faq", title: "4 bước thanh toán + FAQ", contentTypeNote: "PAYMENT_STEPS + PREMIUM_FAQ, hardcode trong page.tsx — khối thông tin trấn an, không phải luồng thanh toán thật (luồng thật nằm ở từng card chương trình).", workspaceOwner: "Premium", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },

  { id: "content_hanhtrinh_gateway", sectionId: "sec_hanhtrinh_gateway", title: "Tiêu đề + mô tả Hub", contentTypeNote: "Text tĩnh hardcode trong page.tsx.", workspaceOwner: "Journey & Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_hanhtrinh_companion_memory", sectionId: "sec_hanhtrinh_companion_memory", title: "Ký ức Companion theo hành trình", contentTypeNote: "Dữ liệu thật (growth-view), Companion xuất hiện tại đây nhưng ngữ cảnh do Journey định nghĩa.", workspaceOwner: "Journey & Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_hanhtrinh_current_chapter", sectionId: "sec_hanhtrinh_current_chapter", title: "Chương hiện tại", contentTypeNote: "Tính từ dữ liệu thật (sở hữu Premium, Supabase).", workspaceOwner: "Journey & Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_hanhtrinh_five_doors", sectionId: "sec_hanhtrinh_five_doors", title: "Danh sách 5 cánh cửa", contentTypeNote: "DOORS — hardcode trong page.tsx (tiêu đề/mô tả/link), chưa có CRUD.", workspaceOwner: "Journey & Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_hanhtrinh_growth_activity", sectionId: "sec_hanhtrinh_growth_activity", title: "Hoạt động tăng trưởng", contentTypeNote: "Dữ liệu thật (growth-view/localStorage), không phải nội dung Founder biên tập.", workspaceOwner: "Journey & Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_hanhtrinh_reflection_question", sectionId: "sec_hanhtrinh_reflection_question", title: "Câu hỏi hôm nay", contentTypeNote: "todaysPrompt() — hardcode trong page.tsx, chưa có CRUD.", workspaceOwner: "Journey & Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_hanhtrinh_continue_cta", sectionId: "sec_hanhtrinh_continue_cta", title: "CTA tiếp tục hành trình", contentTypeNote: "Text + link tĩnh hardcode.", workspaceOwner: "Journey & Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },

  { id: "content_sumenh_sanctuary_bg", sectionId: "sec_sumenh_sanctuary_bg", title: "Nền hiệu ứng Sanctuary", contentTypeNote: "Hiệu ứng nền, không phải nội dung nghiệp vụ.", workspaceOwner: "Journey & Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_sumenh_living_core", sectionId: "sec_sumenh_living_core", title: "Nhân vật Companion (Sứ mệnh)", contentTypeNote: "Trạng thái/animation Companion — persona thật vẫn do companion-identity.ts (Companion Studio) định nghĩa, trang này chỉ hiển thị.", workspaceOwner: "Journey & Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_sumenh_companion_experience", sectionId: "sec_sumenh_companion_experience", title: "Trải nghiệm Sứ mệnh Companion (Genome/Philosophy/Constitution)", contentTypeNote: "GENOME (12 gene) + PHILOSOPHY_PAIRS (4) + CONSTITUTION + MISSION_ITEMS + EVOLUTION + TIMELINE — 100% hardcode trong page.tsx (560 dòng, không có <section> rõ ràng để tách nhỏ hơn), chưa có CRUD. ĐÍNH CHÍNH JOURNEY-SPR-901 Task 6: chuyển từ Companion Studio (Mentor Runtime) sang Journey & Community (Mission Presentation) — 2 khái niệm khác nhau, xem báo cáo.", workspaceOwner: "Journey & Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },

  { id: "content_ai_assistant_waiting_room", sectionId: "sec_ai_assistant_waiting_room", title: "Companion Waiting Room", contentTypeNote: "Text tự-bạch trung thực trong page.tsx: \"Companion đang được chuẩn bị để có thể trò chuyện cùng bạn\" — copy từ companion-conversation.ts (companionOpeners/companionPromise). Chưa có CRUD.", workspaceOwner: "Companion Studio", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },

  { id: "content_congdong_hero", sectionId: "sec_congdong_hero", title: "Tiêu đề + mô tả Campus", contentTypeNote: "Text tĩnh hardcode trong page.tsx.", workspaceOwner: "Journey & Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_congdong_stories", sectionId: "sec_congdong_stories", title: "Câu chuyện cộng đồng", contentTypeNote: "Empty state trung thực — chưa có dữ liệu thật, không bịa (Product Owner approved).", workspaceOwner: "Journey & Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_congdong_learning_spaces", sectionId: "sec_congdong_learning_spaces", title: "7 không gian học", contentTypeNote: "LEARNING_SPACES — hardcode trong page.tsx, chưa có CRUD.", workspaceOwner: "Journey & Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_congdong_showcase", sectionId: "sec_congdong_showcase", title: "Danh sách Showcase", contentTypeNote: "Đọc THÊM từ bảng case_studies (CKOS/Academy sở hữu) — không tạo bảng trùng lặp.", workspaceOwner: "Journey & Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_congdong_workshops", sectionId: "sec_congdong_workshops", title: "Sự kiện & Workshop", contentTypeNote: "Empty state trung thực — chưa có dữ liệu thật.", workspaceOwner: "Journey & Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_congdong_news", sectionId: "sec_congdong_news", title: "Tin tức cộng đồng", contentTypeNote: "⚠️ NEWS — mảng hardcode 5 mục trong page.tsx (di dời nguyên vẹn từ /portal/updates cũ, Phase F.2) — KHÔNG phải collection \"news\"/\"updates\" (Supabase, Consumer=0 cho trang này). Chưa có CRUD.", workspaceOwner: "Journey & Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_congdong_companion_corner", sectionId: "sec_congdong_companion_corner", title: "Câu nói Companion", contentTypeNote: "1 câu tĩnh hardcode.", workspaceOwner: "Journey & Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_congdong_guides", sectionId: "sec_congdong_guides", title: "Danh sách Guide cộng đồng", contentTypeNote: "Gồm Founder (FOUNDER.photo).", workspaceOwner: "Journey & Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_congdong_map", sectionId: "sec_congdong_map", title: "Bản đồ cộng đồng", contentTypeNote: "Không có nội dung tĩnh.", workspaceOwner: "Journey & Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
  { id: "content_congdong_final_cta", sectionId: "sec_congdong_final_cta", title: "CTA cuối trang + Kết nối ngay hôm nay", contentTypeNote: "⚠️ 3 external link (Facebook Group/Zalo Group/YouTube) trước JOURNEY-SPR-901 hardcode trong siteConfig.community/siteConfig.links (site.ts) — Consumer=0 cho collection \"community\" (/admin/community) dù seed data trùng khớp. Đã vá: đọc trực tiếp từ collection thật (Task 4).", workspaceOwner: "Journey & Community", visible: true, sortOrder: 1, status: "Active", updatedDate: "2026-07-13" },
];
