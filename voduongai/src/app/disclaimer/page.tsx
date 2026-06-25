import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = { title: "Tuyên bố miễn trừ trách nhiệm" };

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Tuyên bố miễn trừ trách nhiệm"
      subtitle="Áp dụng cho toàn bộ nội dung liên quan đến tài sản số, crypto, trading, đầu tư cổ phần và các chương trình như DigiU trên website VO DUONG AI."
      updatedAt="23/06/2026"
      sections={[
        {
          heading: "1. Tính chất nội dung",
          body: [
            "Nội dung chỉ nhằm mục đích chia sẻ thông tin và trải nghiệm cá nhân, không phải lời khuyên đầu tư. Người dùng cần tự nghiên cứu và tự chịu trách nhiệm với quyết định của mình.",
          ],
        },
        {
          heading: "2. Phạm vi áp dụng",
          body: [
            "Tuyên bố này áp dụng cho mọi nội dung liên quan đến tài sản số, blockchain, tiền điện tử (crypto), giao dịch (trading), cổ phần/equity, và các chương trình hợp tác như DigiU được đề cập trên website hoặc trong Digital Assets Hub.",
          ],
        },
        {
          heading: "3. Không đảm bảo lợi nhuận",
          body: [
            "VO DUONG AI không đảm bảo, cam kết hoặc bảo chứng bất kỳ mức lợi nhuận, kết quả tài chính hoặc hiệu suất đầu tư nào. Mọi quyết định tài chính đều tiềm ẩn rủi ro và người dùng cần tự đánh giá trước khi tham gia.",
          ],
        },
        {
          heading: "4. Liên kết & đối tác bên thứ ba",
          body: [
            "Một số liên kết, công cụ hoặc nền tảng được giới thiệu trên website có thể là liên kết tiếp thị (affiliate). VO DUONG AI có thể nhận hoa hồng khi người dùng sử dụng các liên kết này, nhưng điều đó không ảnh hưởng đến tính khách quan của nội dung chia sẻ.",
          ],
        },
        {
          heading: "5. Trách nhiệm của người dùng",
          body: [
            "Người dùng cần tự nghiên cứu, tìm hiểu kỹ và chịu trách nhiệm hoàn toàn với mọi quyết định liên quan đến tài chính, đầu tư hoặc giao dịch sau khi tham khảo nội dung trên website.",
          ],
        },
      ]}
    />
  );
}
