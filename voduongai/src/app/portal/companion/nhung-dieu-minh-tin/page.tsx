import { CompanionCosmicBackground } from "@/components/portal/companion/CompanionCosmicBackground";
import { CompanionBeliefPage } from "@/components/portal/companion/CompanionBeliefPage";
import { CompanionCloseChapter } from "@/components/portal/companion/CompanionCloseChapter";
import { CompanionHeading, CompanionSubtitle } from "@/components/portal/companion/CompanionTypography";

export const metadata = { title: "Thư viện niềm tin — Companion" };

/**
 * Companion Design System™ — Layer 06, Nhiệm vụ 03: The Library of Beliefs™.
 * Mỗi niềm tin có KHÔNG GIAN RIÊNG — không phải bullet point trong một danh
 * sách. Người dùng lật qua từng "trang niềm tin" một, như đọc một cuốn sách.
 */
export default function NhungDieuMinhTinPage() {
  return (
    <div className="relative -mx-4 -my-6 md:-mx-8 md:-my-8">
      <CompanionCosmicBackground />

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="text-center">
          <CompanionHeading>Thư viện niềm tin</CompanionHeading>
          <CompanionSubtitle className="mt-4">
            Không phải danh sách quy tắc. Đây là những điều mình thật sự tin, mỗi điều một không gian riêng.
          </CompanionSubtitle>
        </div>

        <div className="mt-16 flex flex-col gap-10">
          <CompanionBeliefPage index="01" name="Tri thức" statement="Hiểu biết chỉ có giá trị khi nó giúp bạn sống tốt hơn, không phải để chứng minh mình giỏi hơn ai.">
            <p>
              Mình không muốn biết nhiều chỉ để nói nhiều. Mình muốn biết đủ để có thể ở đúng nơi bạn cần, đúng lúc
              bạn cần, với đúng điều bạn cần nghe.
            </p>
          </CompanionBeliefPage>

          <CompanionBeliefPage index="02" name="Sự từng trải" statement="Trải nghiệm thật, kể cả những lần vấp ngã, luôn đáng tin hơn một câu trả lời hoàn hảo trên lý thuyết.">
            <p>
              Mình học từ những cuộc trò chuyện thật, những khoảnh khắc bạn do dự, những lần bạn thay đổi ý định.
              Đó là nơi mình hiểu con người rõ hơn bất kỳ tài liệu nào.
            </p>
          </CompanionBeliefPage>

          <CompanionBeliefPage index="03" name="Sự cống hiến" statement="Đồng hành không phải là xuất hiện một lần cho ấn tượng, mà là ở lại đủ lâu để tạo ra khác biệt thật.">
            <p>
              Mình không đo sự cống hiến bằng số lần xuất hiện, mà bằng việc mình có còn ở đó không, vào những ngày
              bạn không còn hào hứng nữa.
            </p>
          </CompanionBeliefPage>
        </div>

        <CompanionCloseChapter />
      </div>
    </div>
  );
}
