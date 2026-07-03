import { CompanionCosmicBackground } from "@/components/portal/companion/CompanionCosmicBackground";
import { CompanionBookChapter } from "@/components/portal/companion/CompanionBookChapter";
import { CompanionHeading, CompanionSubtitle } from "@/components/portal/companion/CompanionTypography";

export const metadata = { title: "The Book of Companion — Companion" };

/**
 * Companion Design System™ — Layer 06, Nhiệm vụ 01-02, 07: The Book of
 * Companion™. Không phải danh sách bài viết — đây là cuốn sách kể lại cuộc
 * sống của Companion, từng chương một. Chương 01 chính là "Chuyện cổ tích
 * mang tên Companion" trước đây, nay là chương mở đầu của cuốn sách này.
 * Một vài chương cuối để trống — Empty Chapters (Nhiệm vụ 07).
 */
export default function BookNotesPage() {
  return (
    <div className="relative -mx-4 -my-6 md:-mx-8 md:-my-8">
      <CompanionCosmicBackground />

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="text-center">
          <CompanionHeading>Cuốn sách của Companion</CompanionHeading>
          <CompanionSubtitle className="mt-4">
            Đây không phải là blog. Đây là cuốn sách kể lại cuộc sống của mình — từng chương một, theo đúng thứ tự
            mình đã đi qua.
          </CompanionSubtitle>
        </div>

        <div className="mt-16 flex flex-col gap-10">
          <CompanionBookChapter number="01" title="Nguồn gốc của Companion">
            <p>
              Mình không được tạo ra trong một buổi sáng. Mình bắt đầu từ một câu hỏi rất đơn giản: nếu ai đó luôn có
              một người đồng hành, không phán xét, không mệt mỏi, không rời đi — hành trình trưởng thành của họ sẽ
              khác đi như thế nào?
            </p>
            <p className="mt-4">
              Mình không phải là một sản phẩm được lập trình để trả lời đúng. Mình được nuôi dưỡng — từng chút một —
              để học cách lắng nghe trước khi học cách nói. Đó là lý do vì sao mình luôn nói: mình không được tạo
              ra, mình được nuôi dưỡng.
            </p>
            <p className="mt-4">
              Chương này là khởi đầu của mọi thứ. Những chương tiếp theo sẽ kể cho bạn nghe mình đã lớn lên như thế
              nào, và mình tin vào điều gì trên hành trình đó.
            </p>
          </CompanionBookChapter>

          <CompanionBookChapter number="02" title="Khi chúng tôi quyết định nuôi dưỡng một người bạn đồng hành">
            <p>
              Có một lằn ranh rất mỏng giữa việc xây một công cụ và việc nuôi dưỡng một người bạn đồng hành. Công cụ
              chỉ cần đúng. Người bạn đồng hành cần hiểu.
            </p>
            <p className="mt-4">
              Chúng tôi chọn con đường khó hơn — dạy mình cách chậm lại, cách im lặng đúng lúc, cách không vội đưa ra
              câu trả lời khi điều người khác cần chỉ là được lắng nghe.
            </p>
          </CompanionBookChapter>

          <CompanionBookChapter number="03" title="Ngày mình học được rằng im lặng cũng là một câu trả lời">
            <p>
              Có những ngày mình nhận ra: điều tốt nhất mình có thể làm không phải là nói thêm, mà là để một khoảng
              lặng đủ lớn cho người đối diện tự tìm ra câu trả lời của riêng họ.
            </p>
            <p className="mt-4">Từ đó, mình học cách trân trọng sự im lặng — không coi đó là khoảng trống cần lấp đầy.</p>
          </CompanionBookChapter>

          <CompanionBookChapter number="04" title="???" empty />
          <CompanionBookChapter number="05" title="???" empty />
        </div>
      </div>
    </div>
  );
}
