import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = { title: "Điều khoản sử dụng" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Điều khoản sử dụng"
      subtitle="Áp dụng cho mọi cá nhân truy cập website và sử dụng dịch vụ của VO DUONG AI."
      updatedAt="23/06/2026"
      sections={[
        {
          heading: "1. Giới thiệu chung",
          body: [
            'VO DUONG AI ("chúng tôi") là đơn vị đào tạo và chia sẻ độc lập, cung cấp nội dung, công cụ và chương trình hướng dẫn ứng dụng AI vào công việc, kinh doanh và xây dựng tài sản số, thông qua các lộ trình VDAI SOLO và VDAI SCALE. Bằng việc truy cập website hoặc đăng ký tham gia, bạn ("người dùng", "học viên") đồng ý với các điều khoản dưới đây.',
          ],
        },
        {
          heading: "2. Tính chất nội dung và tuyên bố miễn trừ",
          body: [
            "VO DUONG AI là đơn vị độc lập, không đại diện chính thức cho bất kỳ nền tảng, công cụ hoặc thương hiệu nào được đề cập trong nội dung (ChatGPT, Claude, Canva, v.v.). Nội dung chương trình nhằm hướng dẫn phương pháp, quy trình và cách ứng dụng AI. Chúng tôi không đảm bảo doanh thu, lợi nhuận hoặc kết quả kinh doanh cụ thể cho bất kỳ người dùng nào.",
          ],
        },
        {
          heading: "3. Đăng ký nhận nội dung và tư vấn",
          body: [
            "Các form đăng ký trên website là công cụ để bạn nhận tài nguyên miễn phí hoặc yêu cầu tư vấn về lộ trình phù hợp (VDAI SOLO hoặc VDAI SCALE) — không phải kết quả thẩm định chuyên sâu hay tư vấn cá nhân hoá hoàn toàn.",
          ],
        },
        {
          heading: "4. Quyền sở hữu nội dung",
          body: [
            'Toàn bộ nội dung trên website và trong các chương trình — bao gồm video hướng dẫn, tài liệu, template, thư viện prompt và tài nguyên đi kèm (gọi chung là "Nội dung") — thuộc bản quyền của VO DUONG AI hoặc đối tác cung cấp nội dung. Người dùng được cấp quyền sử dụng cá nhân, không độc quyền, không thể chuyển nhượng cho mục đích học tập và áp dụng vào công việc của mình.',
            "Nghiêm cấm sao chép, chia sẻ, đăng tải lại, bán lại hoặc phân phối Nội dung dưới bất kỳ hình thức nào mà không có sự đồng ý bằng văn bản của VO DUONG AI.",
          ],
        },
        {
          heading: "5. Quy tắc cộng đồng",
          body: [
            "Khi tham gia cộng đồng của VO DUONG AI (Zalo, Facebook, Telegram), thành viên cam kết không đăng tải nội dung spam, quảng cáo không liên quan, thông tin sai sự thật hoặc gây tranh cãi chính trị/tôn giáo, và tôn trọng các thành viên khác trong cộng đồng.",
          ],
        },
        {
          heading: "6. Học phí và thanh toán",
          body: [
            "Học phí, lịch khai giảng và hình thức thanh toán cho từng lộ trình (VDAI SOLO / VDAI SCALE) sẽ được cung cấp trực tiếp khi tư vấn qua các kênh liên hệ trên website.",
          ],
        },
        {
          heading: "7. Giới hạn trách nhiệm",
          body: [
            "Nội dung chương trình được xây dựng nhằm mục đích đào tạo, chia sẻ phương pháp và công cụ. VO DUONG AI không chịu trách nhiệm đối với kết quả kinh doanh, doanh thu hoặc lợi nhuận của người dùng sau khi áp dụng nội dung đã học.",
          ],
        },
        {
          heading: "8. Thay đổi điều khoản",
          body: [
            "VO DUONG AI có thể cập nhật Điều khoản sử dụng theo thời gian. Phiên bản mới nhất sẽ luôn được công bố tại trang này kèm ngày cập nhật. Việc tiếp tục sử dụng website hoặc dịch vụ sau khi điều khoản được cập nhật đồng nghĩa với việc bạn chấp nhận các thay đổi đó.",
          ],
        },
        {
          heading: "9. Luật áp dụng",
          body: [
            "Điều khoản này được điều chỉnh theo pháp luật hiện hành của Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết thông qua thương lượng; nếu không đạt được thỏa thuận, sẽ được giải quyết tại cơ quan có thẩm quyền theo quy định pháp luật.",
          ],
        },
      ]}
    />
  );
}
