import { LegalPage } from "@/components/legal/LegalPage";

const title = "Chính sách bảo mật";
const description = "Chính sách bảo mật của VO DUONG AI: cách thu thập, sử dụng và bảo vệ thông tin cá nhân của người dùng.";

export const metadata = {
  title,
  description,
  openGraph: { title, description },
  twitter: { title, description },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Chính sách bảo mật"
      subtitle="Cách VO DUONG AI thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn."
      updatedAt="23/06/2026"
      sections={[
        {
          heading: "1. Thông tin chúng tôi thu thập",
          body: [
            "Khi bạn sử dụng website, đăng ký nhận tài nguyên miễn phí hoặc tham gia Portal, VO DUONG AI có thể thu thập: họ tên, số điện thoại/Zalo, địa chỉ email khi bạn điền vào form trên website, cùng dữ liệu sử dụng cơ bản (trang đã xem, thời gian truy cập) để cải thiện trải nghiệm.",
          ],
        },
        {
          heading: "2. Mục đích sử dụng thông tin",
          body: [
            "Gửi tài nguyên miễn phí, nội dung học AI và thông tin về các sản phẩm/khoá học VDAI SOLO, VDAI SCALE phù hợp với bạn.",
            "Liên hệ tư vấn khi bạn chủ động yêu cầu, và cải thiện chất lượng nội dung, sản phẩm dựa trên hành vi sử dụng tổng hợp (không định danh cá nhân).",
          ],
        },
        {
          heading: "3. Chia sẻ thông tin với bên thứ ba",
          body: [
            "VO DUONG AI không bán, trao đổi hoặc cho thuê thông tin cá nhân của người dùng cho bất kỳ bên thứ ba nào ngoài mục đích đã nêu. Thông tin chỉ được chia sẻ với các công cụ/nền tảng kỹ thuật phục vụ vận hành (hệ thống tiếp nhận form, lưu trữ dữ liệu, email) — các đối tác này có nghĩa vụ bảo mật tương đương.",
          ],
        },
        {
          heading: "4. Cookie và công cụ theo dõi",
          body: [
            "Website có thể sử dụng cookie và công cụ theo dõi (Google Analytics, Meta Pixel) để đo lường hiệu quả nội dung. Các công cụ này chỉ hoạt động khi đã được cấu hình ID theo dõi hợp lệ. Bạn có thể tắt cookie qua cài đặt trình duyệt.",
          ],
        },
        {
          heading: "5. Lưu trữ và bảo vệ dữ liệu",
          body: [
            "Thông tin bạn cung cấp được lưu trữ trên hệ thống có kiểm soát truy cập, chỉ nhân sự liên quan của VO DUONG AI được phép truy cập để hỗ trợ và tư vấn. Chúng tôi áp dụng các biện pháp hợp lý để ngăn chặn truy cập, sử dụng hoặc tiết lộ trái phép.",
          ],
        },
        {
          heading: "6. Quyền của bạn",
          body: [
            "Bạn có quyền yêu cầu VO DUONG AI cung cấp lại, chỉnh sửa hoặc xoá thông tin cá nhân mà chúng tôi đang lưu trữ về bạn. Để thực hiện các quyền trên, vui lòng liên hệ qua email hoặc các kênh mạng xã hội ở Footer.",
          ],
        },
        {
          heading: "7. Thay đổi chính sách",
          body: [
            "VO DUONG AI có thể cập nhật Chính sách bảo mật theo thời gian. Phiên bản mới nhất sẽ luôn được công bố tại trang này kèm ngày cập nhật. Việc tiếp tục sử dụng website sau khi chính sách được cập nhật đồng nghĩa với việc bạn chấp nhận các thay đổi đó.",
          ],
        },
      ]}
    />
  );
}
