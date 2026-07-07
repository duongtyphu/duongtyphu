// Portal 4.0 Content Reconstruction: đã xoá currentJourney/growthPathSteps/
// mission30Day/growthDetailDimensions/milestone/aiJourneyTip — toàn bộ là
// dữ liệu TĨNH/GIẢ (% cố định, ngày cố định) đã bị thay bằng dữ liệu thật
// từ `growth-view.ts` (xem PORTAL_CONTENT_RECONSTRUCTION_PLAN.md mục B.7).
// Chỉ giữ `relatedActions` — đây là danh sách link điều hướng tĩnh thật sự
// (không tự nhận là dữ liệu cá nhân hoá), vẫn hợp lệ.

export type RelatedAction = {
  id: string;
  label: string;
  href: string;
};

export const relatedActions: RelatedAction[] = [
  { id: "ra1", label: "Học bài tiếp theo", href: "/portal/hocvienai" },
  { id: "ra2", label: "Thực hành Prompt", href: "/portal/prompts" },
  { id: "ra3", label: "Ghi lại một điều bạn vừa học", href: "/portal/nhatkyhoctap" },
  { id: "ra4", label: "Tham gia thử thách", href: "/portal/practice" },
  { id: "ra5", label: "Xem cộng đồng", href: "/portal/congdongai" },
];
