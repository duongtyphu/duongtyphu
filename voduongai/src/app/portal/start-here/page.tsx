import Link from "next/link";

export const metadata = { title: "Bắt đầu tại đây" };

const STEPS = [
  {
    step: 1,
    title: "Làm quen với AI",
    description: "Hiểu các công cụ AI phổ biến và cách viết prompt hiệu quả.",
    resource: { label: "Học viện AI", href: "/portal/ai-academy" },
    tool: { label: "ChatGPT", href: "/portal/tools/chatgpt" },
  },
  {
    step: 2,
    title: "Học cách dùng Prompt",
    description: "Khai thác thư viện Prompt để áp dụng AI vào công việc hàng ngày.",
    resource: { label: "Thư viện Prompt", href: "/portal/prompts" },
    tool: { label: "Claude", href: "/portal/tools/claude" },
  },
  {
    step: 3,
    title: "Xây nội dung và thương hiệu cá nhân",
    description: "Lên kế hoạch nội dung, định vị và xây hình ảnh cá nhân nhất quán.",
    resource: { label: "Thương hiệu cá nhân", href: "/portal/personal-brand" },
    tool: { label: "Canva", href: "/portal/tools/canva" },
  },
  {
    step: 4,
    title: "Bắt đầu Affiliate Marketing",
    description: "Chọn ngách, chọn sản phẩm phù hợp và xây hệ thống Affiliate đầu tiên.",
    resource: { label: "Affiliate Hub", href: "/portal/affiliate-hub" },
    tool: { label: "Hostinger / Vercel", href: "/portal/tools/hostinger" },
  },
  {
    step: 5,
    title: "Tạo sản phẩm số và tài sản số",
    description: "Đóng gói kiến thức thành sản phẩm số, tích lũy tài sản số dài hạn.",
    resource: { label: "Sản phẩm số", href: "/portal/premium" },
    tool: { label: "Tài sản số", href: "/portal/digital-assets" },
  },
];

export default function StartHerePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Bắt đầu tại đây</h1>
        <p className="mt-2 text-white">
          Nếu bạn mới bước vào hệ sinh thái VO DUONG AI, hãy đi theo lộ trình đơn giản này để
          học AI, ứng dụng vào công việc và từng bước xây hệ thống tạo tài sản số.
        </p>
      </div>

      <div className="space-y-4">
        {STEPS.map((s) => (
          <div
            key={s.step}
            className="card-shine flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-blue/15 text-sm font-extrabold text-brand-blue">
              {s.step}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white">{s.title}</h3>
              <p className="mt-1 text-sm text-white/70">{s.description}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/50">
                <span>
                  Tài nguyên đề xuất:{" "}
                  <Link href={s.resource.href} className="font-semibold text-brand-blue hover:underline">
                    {s.resource.label}
                  </Link>
                </span>
                <span>·</span>
                <span>
                  Công cụ đề xuất:{" "}
                  <Link href={s.tool.href} className="font-semibold text-brand-blue hover:underline">
                    {s.tool.label}
                  </Link>
                </span>
              </div>
            </div>
            <Link
              href={s.resource.href}
              className="shrink-0 rounded-full bg-brand-blue px-5 py-2.5 text-center text-xs font-bold text-white transition hover:opacity-90"
            >
              Bắt đầu bước này →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
