import Link from "next/link";

const vaultItems = [
  {
    icon: "🧰",
    title: "AI Toolkit",
    description: "Bộ công cụ AI cần thiết để bắt đầu học và làm việc với AI.",
    badge: "Free" as const,
    href: "/portal/resources",
  },
  {
    icon: "💬",
    title: "100+ Prompt ChatGPT",
    description: "Bộ prompt dùng ngay cho công việc, marketing và Affiliate.",
    badge: "Free" as const,
    href: "/portal/prompts",
  },
  {
    icon: "🗺️",
    title: "Affiliate Roadmap",
    description: "Lộ trình từng bước để bắt đầu Affiliate Marketing đúng hướng.",
    badge: "Portal" as const,
    href: "/portal/affiliate-hub",
  },
  {
    icon: "🧱",
    title: "Tool Library",
    description: "Danh sách công cụ AI tôi đã thử nghiệm và đang dùng thực tế.",
    badge: "Portal" as const,
    href: "/portal/tools",
  },
  {
    icon: "🌐",
    title: "Website Toolkit",
    description: "Bộ công cụ và mẫu để dựng website cá nhân nhanh chóng.",
    badge: "Free" as const,
    href: "/portal/resources",
  },
  {
    icon: "🗓️",
    title: "Content Calendar",
    description: "Lịch nội dung mẫu cho 30 ngày đầu xây kênh của bạn.",
    badge: "Free" as const,
    href: "/portal/resources",
  },
  {
    icon: "📘",
    title: "Free Ebook",
    description: "Hướng dẫn ứng dụng AI thực chiến vào công việc hàng ngày.",
    badge: "Free" as const,
    href: "/portal/resources",
  },
  {
    icon: "⭐",
    title: "Premium Resources",
    description: "Tài liệu và sản phẩm chuyên sâu cho người muốn đi xa hơn.",
    badge: "Premium" as const,
    href: "/portal/premium",
  },
];

const badgeStyle: Record<string, string> = {
  Free: "bg-brand-orange/10 text-brand-orange",
  Portal: "bg-brand-blue/10 text-brand-blue",
  Premium: "bg-brand-violet/15 text-brand-violet",
};

export function FreeResources() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-extrabold text-brand-navy md:text-3xl">
          Điều gì đang chờ bạn bên trong?
        </h2>
        <p className="mt-3 text-brand-gray-500">
          Tài nguyên, công cụ và lộ trình được sắp xếp sẵn trong Portal — bạn
          không cần tự mày mò từ đầu.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {vaultItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group flex flex-col rounded-[20px] border border-brand-gray-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-blue/10"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{item.icon}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${badgeStyle[item.badge]}`}
              >
                {item.badge}
              </span>
            </div>
            <h3 className="mt-4 text-sm font-bold text-brand-navy">
              {item.title}
            </h3>
            <p className="mt-1.5 flex-1 text-xs leading-relaxed text-brand-gray-500">
              {item.description}
            </p>
            <span className="mt-4 text-xs font-semibold text-brand-blue group-hover:underline">
              Mở trong Portal →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
