import { OpportunitiesHubView } from "@/components/portal/opportunities/OpportunitiesHubView";

export const metadata = {
  title: "Dự án & Cơ hội",
  description: "VO DUONG AI chia sẻ các hệ sinh thái đang nghiên cứu, góc nhìn, bài học và cơ hội đồng hành — không phải nơi khuyến nghị đầu tư.",
};

/**
 * PROJECTS-SPR-602 (Founder Directive: Projects & Opportunities Canonical
 * Product) — trang này giờ là Server Component mỏng chỉ giữ `metadata`
 * tĩnh; toàn bộ render + đọc dữ liệu chuyển sang OpportunitiesHubView
 * ("use client", useCollection("ecosystems", ...)) vì 5 hệ sinh thái giờ
 * quản trị được qua Admin thật, không còn là mảng tĩnh trong file này.
 */
export default function OpportunitiesHubPage() {
  return <OpportunitiesHubView />;
}
