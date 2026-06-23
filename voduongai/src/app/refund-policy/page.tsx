import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = { title: "Chính sách hoàn phí" };

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Chính sách hoàn phí"
      subtitle="Quy định về bảo lưu và hoàn phí đối với các chương trình VDAI SOLO và VDAI SCALE."
      updatedAt="23/06/2026"
      sections={[
        {
          heading: "1. Phạm vi áp dụng",
          body: [
            "Chính sách này áp dụng cho các giao dịch đăng ký tham gia chương trình VDAI SOLO và VDAI SCALE thông qua tư vấn trực tiếp từ VO DUONG AI. Chính sách không áp dụng cho các dịch vụ/sản phẩm của bên thứ ba được giới thiệu trong quá trình học (nếu có).",
          ],
        },
        {
          heading: "2. Điều kiện bảo lưu",
          body: [
            "Học viên được bảo lưu khóa học 1 lần duy nhất, với điều kiện gửi yêu cầu bảo lưu trước ít nhất 3 ngày so với buổi học kế tiếp. Thời hạn bảo lưu tối đa là 3 tháng kể từ ngày được chấp thuận; sau thời hạn này, học viên cần đăng ký lại theo lịch khai giảng mới.",
          ],
        },
        {
          heading: "3. Điều kiện hoàn phí",
          body: [
            "Học viên được hoàn 100% học phí nếu gửi yêu cầu hoàn phí trong vòng 7 ngày kể từ ngày đăng ký/kích hoạt khóa học. Sau thời hạn 7 ngày, VO DUONG AI không áp dụng hoàn phí.",
          ],
        },
        {
          heading: "4. Trường hợp không áp dụng hoàn phí",
          body: [
            "Yêu cầu hoàn phí gửi sau thời hạn 7 ngày nêu tại Mục 3 sẽ không được chấp thuận. Học viên vi phạm điều khoản sử dụng (chia sẻ tài khoản, sao chép/phân phối lại nội dung khóa học) cũng không được hoàn phí.",
          ],
        },
        {
          heading: "5. Quy trình yêu cầu hoàn phí / bảo lưu",
          body: [
            "Học viên gửi yêu cầu hoàn phí hoặc bảo lưu qua email hoặc các kênh liên hệ ở Footer, kèm thông tin đăng ký (họ tên, số điện thoại, chương trình đã đăng ký) và lý do yêu cầu. VO DUONG AI xử lý và phản hồi trong vòng 3-5 ngày làm việc; nếu yêu cầu hoàn phí được chấp thuận, tiền sẽ được hoàn trong vòng 7 ngày làm việc kể từ ngày phản hồi chấp thuận.",
          ],
        },
        {
          heading: "6. Lưu ý quan trọng",
          body: [
            "VO DUONG AI không đảm bảo doanh thu hoặc kết quả kinh doanh cụ thể. Chính sách hoàn phí áp dụng cho việc tham gia chương trình đào tạo, không liên quan đến kết quả kinh doanh thực tế của học viên sau khi áp dụng kiến thức đã học.",
          ],
        },
      ]}
    />
  );
}
