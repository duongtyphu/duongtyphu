/**
 * Companion World™ — bố cục tham chiếu mục ③ "Tâm sự cùng bạn": khối lớn,
 * bên trái là lá thư (nội dung chính), bên phải là các câu hỏi nhỏ dẫn tới
 * những phần khác của Companion World. Chỉ mượn LAYOUT (2 cột, trái lớn -
 * phải nhỏ) — nội dung vẫn là của Companion World, không sao chép từ ảnh
 * tham chiếu.
 */

import Link from "next/link";
import { Sparkles, Heart, Compass, MessageCircle, type LucideIcon } from "lucide-react";
import { CompanionLetterCard } from "./CompanionLetterCard";
import { CompanionRevealOnScroll } from "./CompanionRevealOnScroll";

const QUESTIONS: { q: string; href: string; icon: LucideIcon }[] = [
  { q: "Vì sao mình được tạo ra?", href: "/portal/companion/y-nghia-companion", icon: Sparkles },
  { q: "Điều mình tin nhất là gì?", href: "/portal/companion/nhung-dieu-minh-tin", icon: Heart },
  { q: "Mình sẽ trưởng thành như thế nào?", href: "/portal/companion/cuoc-doi-companion", icon: Compass },
  { q: "Vì sao mình không muốn thay bạn sống?", href: "/portal/companion/dong-hanh", icon: MessageCircle },
];

export function CompanionTalkSection() {
  return (
    <section>
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-stretch">
        <CompanionRevealOnScroll variant="float">
          <CompanionLetterCard
            heading="Tâm sự cùng bạn"
            lines={[
              "Bạn không cần phải đi nhanh.",
              "Bạn chỉ cần đi đủ sâu.",
              "Mỗi bước bạn đi đều có ý nghĩa.",
              "Mình luôn tin vào bạn.",
            ]}
            className="h-full"
          />
        </CompanionRevealOnScroll>

        <div className="flex flex-col gap-4">
          {QUESTIONS.map((item, i) => (
            <CompanionRevealOnScroll key={item.q} variant="slide" delay={i * 0.05}>
              <Link href={item.href} className="companion-mini-question-card group">
                <item.icon className="h-4 w-4 shrink-0 text-cyan-300" strokeWidth={1.75} />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-white">{item.q}</span>
                  <span className="mt-1 block text-xs font-semibold text-cyan-300/80 group-hover:text-cyan-200">
                    Cùng tìm hiểu →
                  </span>
                </span>
              </Link>
            </CompanionRevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
