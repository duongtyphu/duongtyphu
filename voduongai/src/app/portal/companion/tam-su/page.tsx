import { CompanionCosmicBackground } from "@/components/portal/companion/CompanionCosmicBackground";
import { CompanionLetterCard } from "@/components/portal/companion/CompanionLetterCard";
import { CompanionRevealOnScroll } from "@/components/portal/companion/CompanionRevealOnScroll";
import { CompanionHeading, CompanionSubtitle } from "@/components/portal/companion/CompanionTypography";

export const metadata = { title: "Những bức thư — Companion" };

/**
 * Companion Design System™ — Layer 06, Nhiệm vụ 05: Letters™. Mỗi lá thư là
 * một trải nghiệm riêng, không phải bài blog — xếp dọc, không lưới, để
 * người đọc lật qua từng lá thư một.
 */
export default function TamSuPage() {
  return (
    <div className="relative -mx-4 -my-6 md:-mx-8 md:-my-8">
      <CompanionCosmicBackground />

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="text-center">
          <CompanionHeading>Những bức thư</CompanionHeading>
          <CompanionSubtitle className="mt-4">
            Có những điều mình chỉ muốn nói khi không cần giải thích gì thêm.
          </CompanionSubtitle>
        </div>

        <div className="mt-16 flex flex-col gap-14">
          <CompanionRevealOnScroll variant="float">
            <CompanionLetterCard
              heading="Gửi người bạn mới"
              lines={[
                "Chào bạn, mình là Companion.",
                "Mình biết mọi khởi đầu đều hơi ngập ngừng.",
                "Bạn không cần chuẩn bị gì cả — cứ đến như bạn đang là.",
                "Mình sẽ ở đây, đi cùng bạn từ bước đầu tiên.",
              ]}
            />
          </CompanionRevealOnScroll>

          <CompanionRevealOnScroll variant="float">
            <CompanionLetterCard
              heading="Gửi người đang mệt"
              lines={[
                "Nếu hôm nay bạn thấy kiệt sức, điều đó không có nghĩa là bạn đang thất bại.",
                "Đôi khi, mệt chỉ là dấu hiệu bạn đã cố gắng rất nhiều.",
                "Bạn được phép dừng lại một chút.",
                "Mình vẫn ở đây khi bạn sẵn sàng tiếp tục.",
              ]}
            />
          </CompanionRevealOnScroll>

          <CompanionRevealOnScroll variant="float">
            <CompanionLetterCard
              heading="Gửi người đang mất phương hướng"
              lines={[
                "Không sao nếu bây giờ bạn chưa biết mình đang đi đâu.",
                "Có những đoạn đường chỉ cần đi, câu trả lời sẽ đến sau.",
                "Bạn không cần thấy rõ cả con đường — chỉ cần thấy bước tiếp theo.",
                "Mình sẽ đi cùng bạn, từng bước một.",
              ]}
            />
          </CompanionRevealOnScroll>

          <CompanionRevealOnScroll variant="float">
            <CompanionLetterCard
              heading="Gửi người vừa thành công"
              lines={[
                "Chúc mừng bạn — nhưng mình muốn nói điều này trước khi bạn vội đi tiếp:",
                "Hãy dừng lại một nhịp, để cảm nhận trọn vẹn điều bạn vừa làm được.",
                "Bạn xứng đáng với khoảnh khắc này, không chỉ với chặng đường tiếp theo.",
                "Mình tự hào về bạn.",
              ]}
            />
          </CompanionRevealOnScroll>
        </div>
      </div>
    </div>
  );
}
