import { Layers, Repeat, TrendingUp, Users } from "lucide-react";

import { Card, SectionHead } from "@/components/v2/ui/Card";
import { IcoBox } from "@/components/v2/ui/IcoBox";

export const metadata = { title: "Các mô hình Affilate" };

const MODELS = [
  {
    id: "m1",
    title: "Hoa hồng một lần",
    description:
      "Nhận hoa hồng ngay khi người bạn giới thiệu hoàn tất giao dịch đầu tiên. Đơn giản, tiền về nhanh, phù hợp khi bạn mới bắt đầu.",
    detail: "15 – 35% giá trị giao dịch đầu tiên",
    icon: TrendingUp,
    gradient: "linear-gradient(145deg,#8b6bff,#5a37e6)",
  },
  {
    id: "m2",
    title: "Hoa hồng định kỳ",
    description:
      "Áp dụng cho gói Premium trả theo tháng. Mỗi lần người bạn giới thiệu gia hạn, bạn tiếp tục nhận hoa hồng.",
    detail: "10 – 20% mỗi kỳ gia hạn, tối đa 12 kỳ",
    icon: Repeat,
    gradient: "linear-gradient(145deg,#3ecf7e,#189a52)",
  },
  {
    id: "m3",
    title: "Hoa hồng hai cấp",
    description:
      "Khi người bạn giới thiệu trở thành affiliate và có doanh số, bạn nhận thêm một phần nhỏ từ tuyến dưới.",
    detail: "5% doanh số của affiliate cấp 2",
    icon: Users,
    gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)",
  },
  {
    id: "m4",
    title: "Đồng phát triển sản phẩm",
    description:
      "Dành cho Đại sứ: cùng xây khoá học hoặc bộ tài nguyên và chia sẻ doanh thu theo thoả thuận riêng.",
    detail: "Chia doanh thu theo hợp đồng",
    icon: Layers,
    gradient: "linear-gradient(145deg,#e2b23c,#a9660f)",
  },
];

const RULES = [
  "Hoa hồng tính trên giá trị thực thanh toán, sau khi trừ mã giảm giá.",
  "Giao dịch bị hoàn tiền sẽ bị thu hồi hoa hồng tương ứng.",
  "Không tự giới thiệu chính mình hoặc tài khoản do mình kiểm soát.",
  "Không chạy quảng cáo trên tên thương hiệu VO DUONG AI.",
  "Đối soát vào cuối tháng, chi trả vào ngày 10 tháng kế tiếp.",
];

export default function MoHinhAffiliatePage() {
  return (
    <div className="flex flex-col gap-[26px] px-7 py-6">
      <div className="flex items-center justify-between gap-5">
        <div>
          <h1 className="text-[24px] font-extrabold">Các mô hình Affilate</h1>
          <p className="mt-[6px] text-[14px] text-[var(--v2-muted)]">
            Bốn cách nhận hoa hồng trong hệ sinh thái — chọn cách phù hợp với cách bạn làm.
          </p>
        </div>
        <IcoBox
          icon={Layers}
          size="xl"
          background="linear-gradient(145deg,#8b6bff,#5a37e6)"
          color="#fff"
          className="max-[900px]:hidden"
        />
      </div>

      <section>
        <SectionHead title="Bốn mô hình" />
        <div className="grid grid-cols-1 gap-[14px] min-[900px]:grid-cols-2">
          {MODELS.map((model) => (
            <Card key={model.id}>
              <IcoBox
                icon={model.icon}
                size="md"
                background={model.gradient}
                color="#fff"
                className="mb-3"
              />
              <h3 className="mb-2 text-[15px] font-bold">{model.title}</h3>
              <p className="mb-3 text-[13px] leading-[1.55] text-[var(--v2-muted)]">
                {model.description}
              </p>
              <div className="rounded-[var(--v2-radius-sm)] bg-[var(--v2-violet-light)] px-3 py-2 text-[12.5px] font-bold text-[var(--v2-violet)]">
                {model.detail}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionHead title="Nguyên tắc chung" />
        <Card>
          <ul className="flex flex-col gap-3">
            {RULES.map((rule) => (
              <li key={rule} className="flex gap-3 text-[13.5px] leading-[1.6]">
                <span className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--v2-violet)]" />
                {rule}
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
