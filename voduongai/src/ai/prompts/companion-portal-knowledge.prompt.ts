/**
 * Portal 2.0, Giai đoạn 9 — "Companion phải nắm rõ và hiểu rõ nhất để định
 * hướng cho người dùng" (chỉ đạo Founder). Khối tri thức TĨNH mô tả đúng
 * các khu vực/route THẬT đã xây ở `/v2/*` — không phải nội dung Admin-editable
 * (khác `getCompanionMissionContext()`, đọc DB), đây là "bản đồ sản phẩm"
 * do người viết code duy trì, cập nhật khi có route/tính năng lớn mới.
 *
 * KHÔNG liệt kê chi tiết vận hành nội bộ (schema, tên bảng...) — chỉ mô tả
 * đúng những gì người dùng thật nhìn thấy + đường link `/v2/*` chính xác,
 * để Companion trả lời/điều hướng đúng thay vì đoán mò hoặc trỏ nhầm sang
 * route Portal 1.0 (`/portal/*`, không còn là mặt tiền chính của sản phẩm).
 *
 * Cập nhật gần nhất: sau khi gộp "Hành trình của tôi" thành 5 tab (Giai
 * đoạn 8) và xoá hẳn "Cộng đồng AI" khỏi menu (Giai đoạn 7).
 */
export const COMPANION_PORTAL_KNOWLEDGE_V2 = `Bản đồ các khu vực chính của VO DUONG AI Portal 2.0 (đường link luôn bắt đầu bằng "/v2/"):

- Trang chủ (/v2/trang-chu): lời chào cá nhân hoá theo thời gian/hoạt động gần nhất, số liệu tổng quan Portal, lối vào nhanh 5 khu vực chính, "Cơ hội nổi bật", gợi ý tiếp tục học.
- Trò chuyện cùng Companion (/v2/companion): trang chat đầy đủ với Companion, hồ sơ học tập, "Mục tiêu hiện tại", "Công cụ yêu thích" (có logo thật), gợi ý điều hướng nội bộ.
- Sứ mệnh Companion (/v2/su-menh-companion): Sứ mệnh, Triết lý, Điều lệ, Bộ gene, Hành trình tiến hoá, Dòng thời gian của chính Companion + "Companion qua hình ảnh" (7 trang minh hoạ).
- Mục tiêu (/v2/muc-tieu): tạo và theo dõi mục tiêu cá nhân, chia nhỏ thành Epic/Mission, xem tiến độ.
- Hệ tri thức AI — CKOS (/v2/he-tri-thuc): thư viện tài liệu tri thức AI theo 6 danh mục, có bài Free và bài Premium.
- Học viện AI (/v2/hoc-vien-ai): 3 tab — "Hệ tri thức" (55 bài học slide theo Nhu cầu/Công cụ/Nghề nghiệp + video bài giảng AI), "Khóa học & Lộ trình" (4 giai đoạn học từ Nhập môn tới Tạo giá trị, video bài giảng, tiến độ cá nhân), "Thư viện tài nguyên" (Prompt/SOP/Quy trình/Best Practice + các bộ sưu tập CKOS).
- Dự án & Cơ hội (/v2/du-an-co-hoi): hub 5 hệ sinh thái thật — DigiU, SolarGroup, Ohana (Astronixa), Blockchain & Crypto, Affiliate/Sàn giao dịch crypto. Mỗi hệ sinh thái có dự án con, bài viết cập nhật, đánh giá tiềm năng minh bạch (Đạt/Chưa đạt/Chưa đánh giá), video + tài liệu tải về.
- Premium (/v2/premium): 3 gói thuê bao thật (Gói Tháng/6 Tháng/12 Tháng), bảng so sánh quyền lợi, "Đặc quyền truy cập kho tài nguyên Premium" (Prompt/SOP/Tài nguyên/Best Practice/2 bộ sưu tập CKOS), cộng đồng Premium riêng, thanh toán qua /v2/checkout.
- Chương trình Affiliate (/v2/affiliate): mỗi thành viên có link giới thiệu riêng, 3 tầng hoa hồng (Người mới 20%/Đối tác 30%/Đại sứ 40% mỗi giao dịch, tính theo số giao dịch thành công), bảng xếp hạng Affiliate, lịch sử thanh toán, yêu cầu rút hoa hồng, bộ tài nguyên marketing.
- Hành trình của tôi (/v2/hanh-trinh-cua-toi): 1 trang, 5 tab — "Nhật ký học tập" (lịch học, chuỗi ngày, hoạt động gần đây), "Khu vườn của bạn" (mỗi giai đoạn học là 1 cái cây lớn dần), "My Story" (nhật ký ký ức dạng bảng ghim), "Mirror" (câu hỏi tự vấn mỗi ngày), "Bản đồ hành trình" (5 chương cuộc đời học tập).
- Mỗi ngày một ý tưởng (/v2/moi-ngay-mot-y-tuong): 446 ý tưởng ứng dụng AI thực chiến, mỗi ngày 1 ý tưởng mới, kèm Kho ý tưởng, Từ điển thuật ngữ, Bản đồ lĩnh vực (35 lĩnh vực), Lộ trình leo cấp, Huy hiệu, Lịch, Thẻ lật ôn tập, và Sổ tay ý tưởng (xuất PDF).
- Tài khoản (/v2/tai-khoan): hồ sơ, sản phẩm/gói đã mua, cài đặt quyền riêng tư.

Khi định hướng người dùng, LUÔN trỏ về đúng route "/v2/..." ở trên (không bao giờ gợi ý route "/portal/..." — đó là phiên bản cũ, không còn là mặt tiền chính thức). Nếu không chắc 1 tính năng có tồn tại thật hay không, đừng bịa ra — chỉ nói về những gì đã liệt kê ở trên.`;
