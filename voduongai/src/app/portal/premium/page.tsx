import Link from "next/link";
import { premiumProducts } from "@/data/premium";
import { getSupabaseServer } from "@/lib/supabase-server";
import { getPurchasedIds } from "@/lib/access";
import { CheckoutButton } from "@/components/portal/CheckoutModal";
import { PageHeader } from "@/components/portal/ui/PageHeader";
import { GemCard } from "@/components/portal/ui/GemCard";
import { GemLockedOverlay } from "@/components/portal/ui/GemLockedOverlay";
import { GemBadge } from "@/components/portal/ui/GemBadge";

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

  return (
    <div className="space-y-12">
      {/* Hero */}
      <PageHeader
        title="Premium"
        description="Khu vực học tập chuyên sâu dành cho thành viên VO DUONG AI."
      />

      {/* Companion Guide */}
      <section className="rounded-2xl border border-violet-100 bg-violet-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100">
            <svg className="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="mb-1 text-sm font-semibold text-violet-800">Premium dành cho ai?</p>
            <p className="text-sm leading-relaxed text-violet-700">
              Premium dành cho những ai đã dùng thử AI ở khu vực miễn phí và muốn đi xa hơn — xây một
              hệ thống làm việc thật với AI, có lộ trình rõ ràng, bài giảng chuyên sâu và sự đồng hành
              trực tiếp thay vì tự mò mẫm.
            </p>
          </div>
        </div>
      </section>

      {/* Premium Includes */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">Premium bao gồm</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PREMIUM_INCLUDES.map((item) => (
            <div key={item.title} className="gemos-gem-card rounded-2xl p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-violet-100 text-2xl">
                {item.emoji}
              </div>
              <h3 className="gemos-card-title mt-3 font-bold text-gray-900">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Path */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">Lộ trình học</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LEARNING_PATH.map((step, i) => (
            <div key={step.title} className="gemos-gem-card rounded-2xl p-5">
              <span className="text-xs font-semibold text-blue-600">Bước {i + 1}</span>
              <div className="mt-2 text-2xl">{step.emoji}</div>
              <h3 className="gemos-card-title mt-2 font-bold text-gray-900">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">{step.description}</p>
            </div>
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
          <Link
            href="/portal/vdai-academy"
            className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-blue-700 shadow transition hover:bg-blue-50"
          >
            Tham gia Premium
          </Link>
          <Link
            href="/portal/checkout"
            className="rounded-full border border-white/40 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Đi đến thanh toán
          </Link>
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
        <h2 className="mb-4 text-xl font-bold text-gray-900">Câu hỏi thường gặp</h2>
        <div className="space-y-3">
          {PREMIUM_FAQ.map((item) => (
            <div key={item.q} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="gemos-card-title font-bold text-gray-900">{item.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
