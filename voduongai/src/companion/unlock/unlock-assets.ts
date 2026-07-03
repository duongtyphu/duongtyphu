/**
 * EPIC 02 — Sprint 05: Unlockable Assets Registry.
 * Pilot thật cho Mission "Tạo Landing Page đầu tiên" — không placeholder,
 * nội dung dùng được ngay. Cấu trúc dạng dữ liệu để mở rộng sang CKOS/Dự
 * án/Premium sau này (thêm asset mới = thêm entry, không sửa engine).
 */

import type { UnlockableAsset } from "./unlock.types";

export const LANDING_PAGE_MISSION_ID = "mission-landing-page-first";
export const LANDING_PAGE_MISSION_TITLE = "Tạo Landing Page đầu tiên";

export const UNLOCK_ASSETS: UnlockableAsset[] = [
  {
    id: "asset-landing-page-prompt-pack",
    title: "Prompt Pack — Landing Page đầu tiên",
    type: "prompt_pack",
    description: "5 prompt viết trọn một Landing Page, từ Hero tới FAQ, dùng ngay với AI bạn đang có.",
    lockedPreview: "Trong Prompt Pack này có một prompt viết CTA mà mình nghĩ bạn sẽ dùng lại nhiều lần.",
    unlockCondition: { type: "mission-evidence-and-reflection", missionId: LANDING_PAGE_MISSION_ID },
    relatedMissionId: LANDING_PAGE_MISSION_ID,
    companionMessage: "Sau Reflection này, mình muốn gửi bạn một thứ hữu ích.",
    status: "locked",
    content: {
      prompts: [
        {
          label: "Prompt viết Hero",
          prompt:
            "Bạn là một copywriter chuyên viết Landing Page. Hãy viết phần Hero (tiêu đề chính + câu mô tả ngắn) cho sản phẩm/dịch vụ sau: [mô tả sản phẩm/dịch vụ của bạn]. Đối tượng khách hàng: [mô tả khách hàng]. Yêu cầu: tiêu đề dưới 12 từ, nêu rõ lợi ích chính, câu mô tả không quá 2 câu.",
        },
        {
          label: "Prompt viết vấn đề khách hàng",
          prompt:
            "Dựa trên sản phẩm/dịch vụ: [mô tả sản phẩm/dịch vụ]. Hãy viết đoạn 'Vấn đề khách hàng đang gặp' cho Landing Page — nêu đúng 1 nỗi đau lớn nhất, bằng ngôn ngữ khách hàng thật sự dùng (không phải ngôn ngữ marketing), tối đa 3 câu.",
        },
        {
          label: "Prompt viết lợi ích",
          prompt:
            "Dựa trên sản phẩm/dịch vụ: [mô tả sản phẩm/dịch vụ] và vấn đề khách hàng: [dán vấn đề vừa viết]. Hãy liệt kê 3 lợi ích cụ thể sản phẩm/dịch vụ giải quyết được, mỗi lợi ích 1 câu, bắt đầu bằng động từ hành động.",
        },
        {
          label: "Prompt viết CTA",
          prompt:
            "Dựa trên sản phẩm/dịch vụ: [mô tả sản phẩm/dịch vụ]. Hãy viết 3 phương án Call-to-Action (nút bấm chính) khác nhau, mỗi phương án dưới 5 từ, tạo cảm giác hành động ngay mà không dùng từ 'Mua ngay' theo kiểu ép buộc.",
        },
        {
          label: "Prompt viết FAQ",
          prompt:
            "Dựa trên sản phẩm/dịch vụ: [mô tả sản phẩm/dịch vụ]. Hãy viết 5 câu hỏi thường gặp (FAQ) mà khách hàng thật sự sẽ hỏi trước khi quyết định mua, kèm câu trả lời ngắn gọn, trung thực cho từng câu.",
        },
      ],
    },
  },
  {
    id: "asset-landing-page-checklist",
    title: "Checklist — Kiểm tra Landing Page",
    type: "checklist",
    description: "5 điểm kiểm tra trước khi công bố Landing Page — giúp bạn không bỏ sót phần quan trọng.",
    lockedPreview: "Trong Checklist này có một bước mà rất nhiều người mới hay bỏ qua — kiểm tra trên mobile.",
    unlockCondition: { type: "mission-evidence-and-reflection", missionId: LANDING_PAGE_MISSION_ID },
    relatedMissionId: LANDING_PAGE_MISSION_ID,
    companionMessage: "Mình giữ bộ công cụ này cho đúng thời điểm.",
    status: "locked",
    content: {
      items: [
        {
          label: "Kiểm tra tiêu đề",
          detail: "Tiêu đề Hero có nêu rõ lợi ích chính trong vòng 3 giây đọc đầu tiên không?",
        },
        {
          label: "Kiểm tra vấn đề",
          detail: "Đoạn mô tả vấn đề có dùng đúng ngôn ngữ khách hàng thật hay dùng, không phải ngôn ngữ nội bộ?",
        },
        {
          label: "Kiểm tra CTA",
          detail: "Có ít nhất 2 nút CTA trên trang (đầu và cuối), cùng dẫn tới một hành động rõ ràng?",
        },
        {
          label: "Kiểm tra bằng chứng",
          detail: "Có ít nhất một bằng chứng thật (đánh giá, số liệu, ảnh chụp thật) không dùng số liệu bịa?",
        },
        {
          label: "Kiểm tra mobile",
          detail: "Đã xem thử trang trên màn hình điện thoại thật, chữ không bị tràn, nút bấm đủ lớn để chạm?",
        },
      ],
    },
  },
  {
    id: "asset-landing-page-template",
    title: "Template — Bố cục Landing Page",
    type: "template",
    description: "3 template dàn ý sẵn để bạn không phải bắt đầu từ trang trắng.",
    lockedPreview: "Template này có sẵn khung Hero Section mà bạn chỉ cần điền nội dung của mình vào.",
    unlockCondition: { type: "mission-evidence-and-reflection", missionId: LANDING_PAGE_MISSION_ID },
    relatedMissionId: LANDING_PAGE_MISSION_ID,
    companionMessage: "Bây giờ bạn có thể dùng bộ này để làm tốt hơn.",
    status: "locked",
    content: {
      templates: [
        {
          label: "Landing Page Outline",
          body:
            "1. Hero (tiêu đề + mô tả ngắn + CTA chính)\n2. Vấn đề khách hàng đang gặp\n3. Giải pháp/sản phẩm của bạn\n4. 3 lợi ích chính\n5. Bằng chứng thật (đánh giá/số liệu/case study)\n6. Câu hỏi thường gặp (FAQ)\n7. CTA cuối trang + cam kết/bảo đảm (nếu có)",
        },
        {
          label: "Hero Section Template",
          body:
            "[Tiêu đề chính — nêu lợi ích lớn nhất, dưới 12 từ]\n[Câu mô tả ngắn — 1-2 câu, giải thích rõ hơn tiêu đề]\n[Nút CTA chính]\n[Ảnh/minh hoạ sản phẩm hoặc kết quả thật]",
        },
        {
          label: "CTA Section Template",
          body:
            "[Câu nhắc lại lợi ích chính một lần nữa, ngắn gọn]\n[Nút CTA — hành động rõ ràng, không mơ hồ]\n[Dòng phụ tạo an tâm: bảo đảm/hỗ trợ/không rủi ro, nếu có thật]",
        },
      ],
    },
  },
];

export function getAssetsForMission(missionId: string): UnlockableAsset[] {
  return UNLOCK_ASSETS.filter((asset) => asset.relatedMissionId === missionId);
}

export function getAssetById(id: string): UnlockableAsset | undefined {
  return UNLOCK_ASSETS.find((asset) => asset.id === id);
}
