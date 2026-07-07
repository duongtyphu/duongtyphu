import { Crown } from "lucide-react";
import { premiumProducts } from "@/data/premium";
import { getSupabaseServer } from "@/lib/supabase-server";
import { getPurchasedIds } from "@/lib/access";
import { CheckoutButton } from "@/components/portal/CheckoutModal";
import { CompanionGuide } from "@/components/portal/CompanionGuide";
import { GemCard } from "@/components/portal/ui/GemCard";
import { GemLockedOverlay } from "@/components/portal/ui/GemLockedOverlay";
import { GemBadge } from "@/components/portal/ui/GemBadge";
import { Button } from "@/components/portal/ui/Button";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { PillarHero } from "@/components/portal/ui/PillarHero";
import { getHumanFlowState } from "@/lib/portal/human-flow";
import { KnowledgeJourneyStrip } from "@/components/portal/ui/KnowledgeJourneyStrip";

export const metadata = { title: "Premium | VO DUONG AI" };

type LiveProduct = {
  id: number;
  title: string;
  description: string | null;
  type: string;
  icon: string;
  price: number;
  video_url: string | null;
  pdf_url: string | null;
};

async function getLiveProducts(): Promise<LiveProduct[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("products")
    .select("id, title, description, type, icon, price, video_url, pdf_url")
    .eq("active", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

const PREMIUM_INCLUDES = [
  {
    emoji: "🚀",
    title: "V-Solo",
    description: "Lộ trình xây dựng hệ thống làm việc một mình với AI — từ số 0 đến có doanh thu đầu tiên.",
  },
  {
    emoji: "📈",
    title: "V-Scale",
    description: "Nhân bản quy trình, xây đội nhóm và mở rộng hệ thống đã vận hành ổn định lên quy mô lớn hơn.",
  },
  {
    emoji: "🎥",
    title: "Bài giảng chuyên sâu",
    description: "Thư viện video bài giảng chi tiết theo từng chủ đề, học theo tốc độ của riêng bạn.",
  },
  {
    emoji: "🎓",
    title: "Masterclass",
    description: "Các buổi học chuyên đề chuyên sâu cùng chuyên gia, đi thẳng vào vấn đề thực chiến.",
  },
  {
    emoji: "🛠️",
    title: "Workshop Premium",
    description: "Workshop thực hành trực tiếp, làm cùng và nhận phản hồi ngay trong buổi học.",
  },
];

const LEARNING_PATH = [
  { emoji: "🌱", title: "Người mới bắt đầu", description: "Làm quen với AI, xây nền tảng tư duy và công cụ đúng ngay từ đầu." },
  { emoji: "🏗️", title: "Xây hệ thống", description: "Biến kiến thức thành quy trình làm việc lặp lại được, có kết quả đo lường được." },
  { emoji: "🔁", title: "Nhân bản quy trình", description: "Tối ưu và nhân bản quy trình đã chạy ổn định để tăng hiệu suất mà không tăng công sức." },
  { emoji: "👥", title: "Phát triển đội nhóm", description: "Chuyển giao quy trình cho đội nhóm, xây dựng hệ thống vận hành không phụ thuộc một người." },
];

const PREMIUM_FAQ = [
  {
    q: "Premium gồm những gì?",
    a: "Premium bao gồm V-Solo, V-Scale, thư viện bài giảng chuyên sâu, các buổi Masterclass và Workshop Premium — toàn bộ nội dung học chuyên sâu của VO DUONG AI.",
  },
  {
    q: "Tôi có thể học theo lộ trình nào?",
    a: "Bạn có thể chọn lộ trình phù hợp với giai đoạn hiện tại: Người mới bắt đầu, Xây hệ thống, Nhân bản quy trình, hoặc Phát triển đội nhóm.",
  },
  {
    q: "Sau khi tham gia tôi được mở khóa nội dung nào?",
    a: "Sau khi tham gia, bạn được mở khóa toàn bộ bài giảng, tài liệu, template và buổi học thuộc chương trình bạn đăng ký, cùng quyền truy cập các Workshop Premium định kỳ.",
  },
];

export default async function PremiumPage() {
  const [liveProducts, purchasedProductIds] = await Promise.all([
    getLiveProducts(),
    getPurchasedIds("product_id"),
  ]);
  const flow = getHumanFlowState("build");
  const ownedCount = purchasedProductIds.size;

  return (
    <div className="space-y-12">
      {/* Hero */}
      <PillarHero
        icon={Crown}
        tone="value"
        eyebrow="Premium — Bước sau khi đã thử"
        title="Miễn phí giúp bạn bắt đầu. Đây là phần giúp bạn không dừng lại"
        subtitle="Bạn đã thấy AI có thể giúp gì. Câu hỏi tiếp theo không phải là học thêm gì nữa, mà là ai đi cùng khi mọi thứ không như kế hoạch. Premium là lộ trình có người đồng hành thật, không phải thêm một chồng bài giảng để tự xem."
        quickActions={[
          { label: "Tham gia Premium", href: "/portal/vdai-academy" },
          { label: "Đi đến thanh toán", href: "/portal/checkout" },
        ]}
      />

      {/* Next Best Action */}
      <GemCard variant="action" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="gemos-card-title text-xs font-bold uppercase tracking-widest text-brand-blue">
            Bước tiếp theo
          </p>
          <p className="mt-2 text-sm font-semibold text-gray-900">{flow.nextBestAction}</p>
          <p className="mt-1 text-sm text-gray-600">{flow.reason}</p>
        </div>
        <Button href={flow.recommendedRoute} variant="primary" className="shrink-0">
          {flow.recommendedCTA}
        </Button>
      </GemCard>

      {/* Companion Guide */}
      <CompanionGuide
        message="Không cần chọn gói cao nhất để bắt đầu. Chọn đúng giai đoạn bạn đang ở — Người mới, Xây hệ thống, Nhân bản hay Đội nhóm — Companion sẽ điều chỉnh gợi ý theo đó."
        action={{ label: "Xem lộ trình học", href: "#lo-trinh" }}
      />

      {/* Value Experience — không hỏi "mua gói nào", mà trả lời "tôi nhận được giá trị gì tiếp theo?" */}
      <GemCard>
        <p className="gemos-card-title text-xs font-bold uppercase tracking-widest text-gray-400">
          Giá trị tiếp theo của bạn
        </p>
        {ownedCount > 0 ? (
          <p className="mt-2 text-sm text-gray-600">
            Bạn đã sở hữu <span className="font-semibold text-gray-900">{ownedCount}</span> sản phẩm Premium
            — giá trị tiếp theo bạn có thể mở khoá là một Workshop Premium hoặc Masterclass chuyên sâu hơn
            bên dưới.
          </p>
        ) : (
          <p className="mt-2 text-sm text-gray-500">
            Giá trị đầu tiên bạn nhận được khi tham gia: một lộ trình rõ ràng (V-Solo/V-Scale) thay vì tự
            mò mẫm — xem bên dưới để chọn đúng giai đoạn của bạn.
          </p>
        )}
      </GemCard>

      {/* Premium Includes */}
      <section>
        <SectionHeader title="Premium bao gồm" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PREMIUM_INCLUDES.map((item) => (
            <GemCard key={item.title}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-violet-100 text-2xl">
                {item.emoji}
              </div>
              <h3 className="gemos-card-title mt-3 font-bold text-gray-900">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">{item.description}</p>
            </GemCard>
          ))}
        </div>
      </section>

      {/* Learning Path */}
      <section id="lo-trinh">
        <SectionHeader title="Lộ trình học" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LEARNING_PATH.map((step, i) => (
            <GemCard key={step.title}>
              <span className="text-xs font-semibold text-blue-600">Bước {i + 1}</span>
              <div className="mt-2 text-2xl">{step.emoji}</div>
              <h3 className="gemos-card-title mt-2 font-bold text-gray-900">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">{step.description}</p>
            </GemCard>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 p-8 text-center">
        <h2 className="text-xl font-bold text-white">Sẵn sàng tham gia Premium?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-blue-100">
          Chọn chương trình phù hợp và bắt đầu hành trình xây hệ thống làm việc với AI ngay hôm nay.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href="/portal/vdai-academy" variant="inverse">
            Tham gia Premium
          </Button>
          <Button href="/portal/checkout" variant="inverse-ghost">
            Đi đến thanh toán
          </Button>
        </div>
      </section>

      {/* Sản phẩm đang mở bán (live, Supabase-backed) */}
      {liveProducts.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900">Sản phẩm đang mở bán</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {liveProducts.map((p) => {
              const owned = purchasedProductIds.has(String(p.id));
              return (
                <GemCard key={p.id} variant={owned ? "success" : "locked"}>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-2xl">{p.icon}</span>
                    {owned ? (
                      <GemBadge tone="free">Đã sở hữu</GemBadge>
                    ) : (
                      <GemBadge tone="premium">{`${p.price.toLocaleString("vi-VN")}đ`}</GemBadge>
                    )}
                  </div>
                  <h3 className="gemos-card-title mt-3 text-sm font-bold text-gray-900">{p.title}</h3>
                  {p.description && <p className="mt-2 text-sm text-gray-600">{p.description}</p>}
                  {owned ? (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {p.video_url && (
                        <a
                          href={p.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gemos-btn-primary rounded-full px-5 py-2 text-sm font-semibold text-white"
                        >
                          Xem video →
                        </a>
                      )}
                      {p.pdf_url && (
                        <a
                          href={p.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gemos-btn-secondary rounded-full px-5 py-2 text-sm font-semibold text-gray-900"
                        >
                          Tải tài liệu →
                        </a>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="mt-4">
                        <CheckoutButton
                          target={{ itemType: "product", itemId: p.id, title: p.title, price: p.price }}
                          label="Mua ngay"
                        />
                      </div>
                      <GemLockedOverlay />
                    </>
                  )}
                </GemCard>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-bold text-gray-900">Danh mục Premium</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {premiumProducts.map((p) => (
            <GemCard key={p.id} variant="locked">
              <GemBadge tone="locked">{p.type}</GemBadge>
              <h3 className="gemos-card-title mt-3 text-sm font-bold text-gray-900">{p.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{p.description}</p>
              <GemLockedOverlay />
            </GemCard>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <SectionHeader title="Câu hỏi thường gặp" />
        <div className="space-y-3">
          {PREMIUM_FAQ.map((item) => (
            <GemCard key={item.q}>
              <h3 className="gemos-card-title font-bold text-gray-900">{item.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.a}</p>
            </GemCard>
          ))}
        </div>
      </section>

      <KnowledgeJourneyStrip
        title="Chưa chắc Premium phù hợp?"
        steps={[
          { label: "Học thử miễn phí trước", description: "Bắt đầu từ Học viện AI — không cần trả phí để thử.", href: "/portal/hocvienai" },
          { label: "Xem Workspace", description: "Trải nghiệm cách Companion đồng hành trong một phiên làm việc thật.", href: "/portal/workspace" },
          { label: "Hỏi Companion", description: "Nhờ Companion tư vấn lộ trình phù hợp với bạn.", href: "/portal/companion" },
        ]}
      />
    </div>
  );
}
