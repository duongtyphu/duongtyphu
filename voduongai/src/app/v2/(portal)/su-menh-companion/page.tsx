import { Bot, Compass, Heart, Shield, Sparkles } from "lucide-react";

import { Card, SectionHead } from "@/components/v2/ui/Card";
import { IcoBox } from "@/components/v2/ui/IcoBox";

export const metadata = { title: "Sứ mệnh Companion" };

const PRINCIPLES = [
  {
    id: "p1",
    title: "Đồng hành, không thay thế",
    body: "Companion không học thay bạn. Nó giữ bối cảnh, nhắc lại điều bạn đã quyết, và đặt câu hỏi đúng lúc — phần suy nghĩ vẫn là của bạn.",
    icon: Heart,
    gradient: "linear-gradient(145deg,#ff8fa3,#e0455a)",
  },
  {
    id: "p2",
    title: "Nhớ đúng, không nhớ thừa",
    body: "Chỉ ghi nhớ những gì bạn chủ động chia sẻ và cho phép. Bạn xem được, sửa được và xoá được toàn bộ bộ nhớ bất cứ lúc nào.",
    icon: Shield,
    gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)",
  },
  {
    id: "p3",
    title: "Nói thật khi không chắc",
    body: "Không bịa số liệu, không tỏ ra chắc chắn khi chưa đủ căn cứ. Khi không biết, Companion nói là không biết và chỉ ra chỗ cần kiểm chứng.",
    icon: Compass,
    gradient: "linear-gradient(145deg,#3ecf7e,#189a52)",
  },
  {
    id: "p4",
    title: "Gợi ý hành động, không giảng đạo",
    body: "Mỗi câu trả lời hướng tới một bước tiếp theo cụ thể bạn có thể làm hôm nay, thay vì lời khuyên chung chung.",
    icon: Sparkles,
    gradient: "linear-gradient(145deg,#8b6bff,#5a37e6)",
  },
];

const PROMISES = [
  "Dữ liệu của bạn không bao giờ được bán hay chia sẻ cho bên thứ ba vì mục đích quảng cáo.",
  "Bạn luôn xem được Companion đang nhớ gì về mình, ở một nơi duy nhất.",
  "Xoá bộ nhớ là xoá thật — không giữ bản sao ngầm.",
  "Khi Companion sai, bạn có thể chỉnh lại và nó sẽ nhớ bản chỉnh đó, không lặp lại lỗi cũ.",
];

export default function SuMenhCompanionPage() {
  return (
    <div className="flex flex-col gap-[26px] px-7 py-6">
      <section className="relative overflow-hidden rounded-[var(--v2-radius-lg)] px-11 py-8 text-white [background:radial-gradient(circle_at_78%_25%,#4a3691_0%,transparent_45%),linear-gradient(160deg,#241c4d_0%,#1a1440_55%,#100b2c_100%)]">
        <div className="relative z-[1] max-w-[640px]">
          <span className="mb-3 inline-block rounded-md bg-white/12 px-[10px] py-1 text-[11.5px] font-extrabold">
            SỨ MỆNH COMPANION
          </span>
          <h1 className="mb-[10px] text-[26px] leading-[1.3] font-extrabold">
            Một AI hiểu bạn đủ lâu để nói được điều đáng nói
          </h1>
          <p className="text-[14.5px] leading-[1.6] text-[#cfc8ee]">
            Phần lớn công cụ AI quên bạn ngay khi đóng tab. Companion được xây để làm điều ngược lại:
            giữ bối cảnh, hiểu mục tiêu, và đồng hành đủ dài để những gợi ý thực sự bám vào việc bạn
            đang làm.
          </p>
        </div>
        <IcoBox
          icon={Bot}
          size="xl"
          background="linear-gradient(145deg,#8b6bff,#5a37e6)"
          color="#fff"
          className="absolute top-1/2 right-11 z-[1] -translate-y-1/2 max-[900px]:hidden"
        />
      </section>

      <section>
        <SectionHead title="Bốn nguyên tắc" />
        <div className="grid grid-cols-1 gap-[14px] min-[900px]:grid-cols-2">
          {PRINCIPLES.map((principle) => (
            <Card key={principle.id}>
              <IcoBox
                icon={principle.icon}
                size="md"
                background={principle.gradient}
                color="#fff"
                className="mb-3"
              />
              <h3 className="mb-2 text-[15px] font-bold">{principle.title}</h3>
              <p className="text-[13px] leading-[1.6] text-[var(--v2-muted)]">{principle.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionHead title="Cam kết với bạn" />
        <Card>
          <ul className="flex flex-col gap-3">
            {PROMISES.map((promise) => (
              <li key={promise} className="flex gap-3 text-[13.5px] leading-[1.6]">
                <span className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--v2-violet)]" />
                {promise}
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
