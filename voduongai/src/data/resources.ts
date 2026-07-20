/**
 * @deprecated Từ Bước C (migrate Resource sang Supabase) — cả
 * `/portal/resources` lẫn `/portal/resources/[id]` giờ đọc từ bảng
 * `resources` (Supabase), không còn dùng `freeResources` bên dưới. Giữ
 * nguyên mảng này 1-2 tuần phòng hờ rollback nhanh (đổi 2 file đó quay lại
 * import `freeResources` từ đây thay vì phải khôi phục từ git history).
 * Xoá hẳn sau khi xác nhận nguồn Supabase ổn định.
 */
export type FreeResource = {
  id: string;
  title: string;
  type: "Ebook" | "Danh sách kiểm tra" | "Mẫu" | "Bộ Prompt" | "Lộ trình" | "Mẫu tham khảo";
  description: string;
  /** Portal 4.0 Phase 5 — CKOS Product Completion: khi nào nên dùng tài nguyên này. */
  whenToUse: string;
  /** Portal 4.0 Phase 4.2 — Knowledge Object Completion: khi nào KHÔNG nên dùng. */
  whenNotToUse: string;
  /** Chỉ gán khi tài nguyên thật sự liên quan tới Dự án & Cơ hội — không ép mọi mục đều có. */
  relatedProjectHref?: string;
};

export const freeResources: FreeResource[] = [
  {
    id: "r1",
    title: "AI Toolkit cho người mới",
    type: "Ebook",
    description: "Tổng hợp công cụ AI cần thiết để bắt đầu học và làm việc với AI.",
    whenToUse: "Đọc trước khi thử bất kỳ công cụ AI nào — giúp bạn không mất thời gian thử sai công cụ không phù hợp với việc bạn đang làm.",
    whenNotToUse: "Không cần đọc lại nếu bạn đã dùng thành thạo 2-3 công cụ AI rồi — lúc đó nên xem Prompt/Workflow thay vì tài liệu tổng quan.",
  },
  {
    id: "r2",
    title: "100 Prompt ChatGPT thực chiến",
    type: "Bộ Prompt",
    description: "Bộ prompt dùng ngay cho công việc, marketing và Affiliate.",
    whenToUse: "Dùng khi bạn đã biết việc cần làm nhưng chưa biết diễn đạt yêu cầu với AI thế nào cho hiệu quả.",
    whenNotToUse: "Không dùng để tìm ý tưởng việc cần làm — bộ này giúp diễn đạt tốt hơn, không giúp bạn quyết định nên làm gì.",
  },
  {
    id: "r3",
    title: "Affiliate Checklist khởi đầu",
    type: "Danh sách kiểm tra",
    description: "Danh sách việc cần làm trước khi bắt đầu Affiliate Marketing.",
    whenToUse: "Dùng trước khi tham gia bất kỳ chương trình Affiliate nào.",
    whenNotToUse: "Không dùng sau khi đã bắt đầu — mục đích là chuẩn bị trước, đọc lại lúc đó sẽ không còn giá trị phòng ngừa.",
    relatedProjectHref: "/portal/duan-cohoi",
  },
  {
    id: "r4",
    title: "Website Toolkit",
    type: "Mẫu",
    description: "Bộ công cụ và mẫu để dựng website cá nhân nhanh chóng.",
    whenToUse: "Dùng khi bạn đã có nội dung/sản phẩm cụ thể và cần một nơi để giới thiệu.",
    whenNotToUse: "Không cần nếu bạn chỉ đang thử nghiệm ý tưởng — dựng website quá sớm khiến bạn tốn công cho một ý tưởng chưa được xác nhận.",
  },
  {
    id: "r5",
    title: "Content Calendar 30 ngày",
    type: "Mẫu",
    description: "Lịch nội dung mẫu cho 30 ngày đầu xây kênh.",
    whenToUse: "Dùng khi bạn đã chọn được kênh và ngách, cần một khung sườn để không phải nghĩ chủ đề mỗi ngày từ đầu.",
    whenNotToUse: "Không dùng nếu chưa chọn ngách — lịch sẽ đầy chủ đề không nhất quán, giống 12 Prompt ở đây cũng cần có ngách trước.",
  },
  {
    id: "r6",
    title: "AI Ebook: Ứng dụng AI vào công việc",
    type: "Ebook",
    description: "Hướng dẫn ứng dụng AI thực chiến vào công việc hàng ngày.",
    whenToUse: "Đọc khi bạn đã dùng thử AI vài lần nhưng thấy kết quả chưa như mong đợi.",
    whenNotToUse: "Không cần đọc nếu bạn chưa từng thử AI lần nào — hãy bắt đầu với 'AI Toolkit cho người mới' trước.",
  },
  {
    id: "r7",
    title: "Roadmap học AI 90 ngày",
    type: "Lộ trình",
    description: "Lộ trình từng bước học và ứng dụng AI trong 90 ngày.",
    whenToUse: "Dùng khi bạn muốn học có hệ thống thay vì học lắt nhắt từng chủ đề rời rạc.",
    whenNotToUse: "Không phù hợp nếu bạn chỉ cần giải quyết một việc cụ thể ngay — lộ trình 90 ngày sẽ chậm hơn nhiều so với việc dùng ngay một Prompt phù hợp.",
  },
  {
    id: "r8",
    title: "Swipe File tiêu đề bán hàng",
    type: "Mẫu tham khảo",
    description: "Tuyển tập tiêu đề bán hàng hiệu quả để tham khảo và biến tấu.",
    whenToUse: "Dùng khi đã có nội dung nhưng đang bí tiêu đề.",
    whenNotToUse: "Không dùng để copy nguyên văn — tiêu đề sao chép y hệt dễ vi phạm bản quyền và không khớp giọng văn của bạn.",
  },
  {
    id: "r9",
    title: "Checklist chọn ngách Affiliate",
    type: "Danh sách kiểm tra",
    description: "Bộ tiêu chí giúp chọn đúng ngách Affiliate phù hợp với bạn.",
    whenToUse: "Dùng khi đang phân vân giữa nhiều ngách.",
    whenNotToUse: "Không cần dùng nếu bạn đã chọn ngách và đang vận hành ổn — lúc này nên xem SOP/Prompt thực thi thay vì checklist chọn ngách.",
    relatedProjectHref: "/portal/duan-cohoi",
  },
  {
    id: "r10",
    title: "Template landing page đơn giản",
    type: "Mẫu",
    description: "Mẫu cấu trúc landing page tối giản, dễ tuỳ biến.",
    whenToUse: "Dùng khi cần ra mắt trang bán hàng nhanh với nguồn lực hạn chế.",
    whenNotToUse: "Không thay thế cho việc có outline nội dung rõ ràng trước — một template đẹp với nội dung yếu vẫn không chuyển đổi.",
  },
];
