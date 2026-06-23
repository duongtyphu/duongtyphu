export type Prompt = {
  id: string;
  title: string;
  category: "Marketing" | "Affiliate" | "Viết nội dung bán hàng" | "Nghiên cứu" | "SEO" | "Website" | "Thiết kế" | "Video" | "Kinh doanh";
  preview: string;
};

export const prompts: Prompt[] = [
  { id: "p1", title: "Phân tích đối thủ Affiliate trong ngách", category: "Affiliate", preview: "Đóng vai chuyên gia phân tích thị trường, liệt kê 5 đối thủ mạnh nhất trong ngách [X]..." },
  { id: "p2", title: "Viết caption bán hàng chuyển đổi cao", category: "Viết nội dung bán hàng", preview: "Viết 3 caption bán hàng theo công thức AIDA cho sản phẩm [X], giọng văn gần gũi..." },
  { id: "p3", title: "Lên kế hoạch content 30 ngày", category: "Marketing", preview: "Lập kế hoạch nội dung 30 ngày cho kênh [TikTok/Facebook] theo ngách [X]..." },
  { id: "p4", title: "Nghiên cứu chân dung khách hàng", category: "Nghiên cứu", preview: "Xây chân dung khách hàng mục tiêu cho sản phẩm [X]: nhu cầu, nỗi đau, hành vi mua..." },
  { id: "p5", title: "Tối ưu SEO on-page cho bài blog", category: "SEO", preview: "Phân tích và tối ưu SEO on-page cho bài viết sau theo từ khoá chính [X]..." },
  { id: "p6", title: "Viết outline landing page chuyển đổi", category: "Website", preview: "Viết outline landing page bán [sản phẩm] gồm hero, lợi ích, social proof, CTA..." },
  { id: "p7", title: "Gợi ý bố cục thiết kế trang đích", category: "Thiết kế", preview: "Gợi ý bố cục (wireframe bằng văn bản) cho landing page ngách [X], ưu tiên mobile..." },
  { id: "p8", title: "Viết kịch bản video ngắn 30 giây", category: "Video", preview: "Viết kịch bản video ngắn 30s theo công thức hook-problem-solution-CTA cho [X]..." },
  { id: "p9", title: "Phân tích mô hình kinh doanh Affiliate", category: "Kinh doanh", preview: "Phân tích mô hình kinh doanh Affiliate phù hợp với nguồn lực: 1 người, ít vốn..." },
  { id: "p10", title: "Viết email follow-up chăm sóc khách", category: "Marketing", preview: "Viết chuỗi 3 email follow-up cho khách đã quan tâm nhưng chưa mua [sản phẩm]..." },
  { id: "p11", title: "Tìm ý tưởng ngách Affiliate mới", category: "Affiliate", preview: "Gợi ý 10 ngách Affiliate tiềm năng năm nay phù hợp với người mới bắt đầu..." },
  { id: "p12", title: "Viết tiêu đề bài viết thu hút click", category: "Viết nội dung bán hàng", preview: "Viết 10 tiêu đề thu hút cho bài viết về [chủ đề], tối ưu CTR mà không giật tít sai..." },
];
