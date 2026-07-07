export type Prompt = {
  id: string;
  title: string;
  category: "Marketing" | "Affiliate" | "Viết nội dung bán hàng" | "Nghiên cứu" | "SEO" | "Website" | "Thiết kế" | "Video" | "Kinh doanh";
  preview: string;
  /** Portal 4.0 Phase 5 — CKOS Product Completion: khi nào dùng prompt này, không chỉ prompt là gì. */
  whenToUse: string;
  /** Bước tiếp theo cụ thể sau khi dùng xong prompt — không phải "khám phá thêm" chung chung. */
  nextStep: string;
};

export const prompts: Prompt[] = [
  {
    id: "p1",
    title: "Phân tích đối thủ Affiliate trong ngách",
    category: "Affiliate",
    preview: "Đóng vai chuyên gia phân tích thị trường, liệt kê 5 đối thủ mạnh nhất trong ngách [X]...",
    whenToUse: "Dùng khi bạn đã chọn được một ngách Affiliate nhưng chưa biết ai đang làm tốt trong đó, hoặc trước khi viết nội dung để tránh lặp lại góc nhìn người khác đã làm.",
    nextStep: "Sau khi có danh sách đối thủ, dùng prompt 'Nghiên cứu chân dung khách hàng' để hiểu ai đang mua hàng của họ.",
  },
  {
    id: "p2",
    title: "Viết caption bán hàng chuyển đổi cao",
    category: "Viết nội dung bán hàng",
    preview: "Viết 3 caption bán hàng theo công thức AIDA cho sản phẩm [X], giọng văn gần gũi...",
    whenToUse: "Dùng khi đã có sản phẩm cụ thể và cần đăng bài bán hàng ngay — không phù hợp khi bạn còn chưa rõ đối tượng khách hàng là ai.",
    nextStep: "Chọn 1 trong 3 caption, đưa vào Workspace để chỉnh sửa giọng văn cho đúng thương hiệu cá nhân của bạn.",
  },
  {
    id: "p3",
    title: "Lên kế hoạch content 30 ngày",
    category: "Marketing",
    preview: "Lập kế hoạch nội dung 30 ngày cho kênh [TikTok/Facebook] theo ngách [X]...",
    whenToUse: "Dùng khi bạn đã chọn ngách và kênh, nhưng đang đăng bài tuỳ hứng không có kế hoạch — không nên dùng nếu bạn chưa xác định ngách rõ ràng.",
    nextStep: "Sau khi có kế hoạch 30 ngày, dùng SOP 'sản xuất content hàng ngày' để không bị quá tải khi thực hiện.",
  },
  {
    id: "p4",
    title: "Nghiên cứu chân dung khách hàng",
    category: "Nghiên cứu",
    preview: "Xây chân dung khách hàng mục tiêu cho sản phẩm [X]: nhu cầu, nỗi đau, hành vi mua...",
    whenToUse: "Dùng ở giai đoạn đầu, trước khi viết bất kỳ nội dung bán hàng nào — bỏ qua bước này là nguyên nhân phổ biến khiến content không chuyển đổi.",
    nextStep: "Dùng chân dung khách hàng vừa có làm đầu vào cho prompt 'Viết caption bán hàng chuyển đổi cao'.",
  },
  {
    id: "p5",
    title: "Tối ưu SEO on-page cho bài blog",
    category: "SEO",
    preview: "Phân tích và tối ưu SEO on-page cho bài viết sau theo từ khoá chính [X]...",
    whenToUse: "Dùng sau khi đã viết xong bản nháp bài viết — không dùng để viết bài từ đầu, vì tối ưu quá sớm sẽ làm mất tự nhiên của câu chữ.",
    nextStep: "Sau khi tối ưu, đối chiếu lại với outline landing page nếu bài viết dẫn về một trang bán hàng cụ thể.",
  },
  {
    id: "p6",
    title: "Viết outline landing page chuyển đổi",
    category: "Website",
    preview: "Viết outline landing page bán [sản phẩm] gồm hero, lợi ích, social proof, CTA...",
    whenToUse: "Dùng khi đã có sản phẩm và ít nhất một minh chứng thực tế (số liệu/lời chứng thực) — outline không có social proof thật sẽ khó thuyết phục.",
    nextStep: "Đưa outline vào prompt 'Gợi ý bố cục thiết kế trang đích' để hình dung cách trình bày trực quan.",
  },
  {
    id: "p7",
    title: "Gợi ý bố cục thiết kế trang đích",
    category: "Thiết kế",
    preview: "Gợi ý bố cục (wireframe bằng văn bản) cho landing page ngách [X], ưu tiên mobile...",
    whenToUse: "Dùng sau khi đã có outline nội dung — dùng trước bước này sẽ khiến bố cục không khớp với thông điệp thật.",
    nextStep: "Mang wireframe vào Workspace để dựng bản nháp thật, thay vì chỉ đọc rồi để đó.",
  },
  {
    id: "p8",
    title: "Viết kịch bản video ngắn 30 giây",
    category: "Video",
    preview: "Viết kịch bản video ngắn 30s theo công thức hook-problem-solution-CTA cho [X]...",
    whenToUse: "Dùng khi bạn cần một kịch bản cụ thể để quay ngay — nếu chưa rõ vấn đề khách hàng đang gặp, hãy chạy prompt 'Nghiên cứu chân dung khách hàng' trước.",
    nextStep: "Sau khi quay xong, dùng lại phần hook trong caption đăng kèm để tăng tính nhất quán thông điệp.",
  },
  {
    id: "p9",
    title: "Phân tích mô hình kinh doanh Affiliate",
    category: "Kinh doanh",
    preview: "Phân tích mô hình kinh doanh Affiliate phù hợp với nguồn lực: 1 người, ít vốn...",
    whenToUse: "Dùng ở giai đoạn quyết định trước khi chọn ngách — giúp bạn thấy rõ mô hình nào khớp với thời gian/vốn thật của bạn, tránh chọn theo cảm tính.",
    nextStep: "Sau khi chọn được mô hình, dùng prompt 'Tìm ý tưởng ngách Affiliate mới' để thu hẹp xuống một ngách cụ thể.",
  },
  {
    id: "p10",
    title: "Viết email follow-up chăm sóc khách",
    category: "Marketing",
    preview: "Viết chuỗi 3 email follow-up cho khách đã quan tâm nhưng chưa mua [sản phẩm]...",
    whenToUse: "Dùng khi đã có danh sách khách để lại thông tin nhưng chưa mua — không phù hợp để gửi cho người chưa từng tương tác với bạn.",
    nextStep: "Theo dõi tỷ lệ mở/click từng email để biết email nào trong chuỗi cần viết lại.",
  },
  {
    id: "p11",
    title: "Tìm ý tưởng ngách Affiliate mới",
    category: "Affiliate",
    preview: "Gợi ý 10 ngách Affiliate tiềm năng năm nay phù hợp với người mới bắt đầu...",
    whenToUse: "Dùng khi bạn chưa chọn được ngách nào, hoặc đang cân nhắc đổi ngách — không dùng để thay thế việc tự trải nghiệm, chỉ là điểm bắt đầu.",
    nextStep: "Chọn 1-2 ngách tiềm năng nhất, chạy tiếp prompt 'Phân tích đối thủ Affiliate trong ngách' cho từng ngách trước khi quyết định.",
  },
  {
    id: "p12",
    title: "Viết tiêu đề bài viết thu hút click",
    category: "Viết nội dung bán hàng",
    preview: "Viết 10 tiêu đề thu hút cho bài viết về [chủ đề], tối ưu CTR mà không giật tít sai...",
    whenToUse: "Dùng sau khi bài viết đã có nội dung hoàn chỉnh — viết tiêu đề trước khi có nội dung thường dẫn đến tiêu đề hứa hẹn điều bài viết không có.",
    nextStep: "Test 2-3 tiêu đề khác nhau nếu kênh đăng cho phép, thay vì chỉ chọn tiêu đề nghe hay nhất theo cảm tính.",
  },
];
