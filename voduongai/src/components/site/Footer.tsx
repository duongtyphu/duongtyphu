import Link from "next/link";
import { siteConfig } from "@/lib/site";

const columns = [
  {
    title: "Portal",
    links: [
      { label: "AI Academy", href: "/portal/ai-academy" },
      { label: "VDAI Academy", href: "/portal/vdai-academy" },
      { label: "Affiliate Hub", href: "/portal/affiliate-hub" },
      { label: "Thư viện Prompt", href: "/portal/prompts" },
      { label: "Thư viện Công cụ", href: "/portal/tools" },
    ],
  },
  {
    title: "Tài nguyên",
    links: [
      { label: "Bộ công cụ AI", href: "/portal/resources" },
      { label: "Blog", href: "/blog" },
      { label: "Ebook", href: "/portal/resources" },
      { label: "Tài nguyên miễn phí", href: "/portal/resources" },
      { label: "Tài nguyên Premium", href: "/portal/premium" },
    ],
  },
];

const socials = [
  {
    label: "Facebook",
    href: siteConfig.links.facebook,
    bg: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#fff">
        <path d="M14.5 8.5H16.8V5.7H14.5C12.4 5.7 10.7 7.4 10.7 9.5V11.3H8.6V14H10.7V19.5H13.4V14H15.7L16.1 11.3H13.4V9.7C13.4 9.04 13.84 8.5 14.5 8.5Z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: siteConfig.links.youtube,
    bg: "#FF0000",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#fff">
        <path d="M9.7 8.6 16 12l-6.3 3.4V8.6Z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: siteConfig.links.tiktok,
    bg: "#000000",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#fff">
        <path d="M16.5 3c.5 2 2 3.5 4 3.8v3a7 7 0 0 1-4-1.3v6.7a5.7 5.7 0 1 1-5-5.66v3.1a2.6 2.6 0 1 0 2 2.5V3h3Z" />
      </svg>
    ),
  },
  {
    label: "Zalo",
    href: siteConfig.links.zalo,
    bg: "#0068FF",
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
        <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">
          Z
        </text>
      </svg>
    ),
  },
  {
    label: "Email",
    href: `mailto:hello@${new URL(siteConfig.url).hostname}`,
    bg: "rgba(255,255,255,0.12)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
        <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="#fff" strokeWidth="1.4" />
        <path d="M4.5 7 12 12.5 19.5 7" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-blue/70 to-transparent shadow-[0_0_24px_2px_rgba(91,140,255,0.55)]" />
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <svg width="34" height="34" viewBox="0 0 32 32" fill="none" className="shrink-0">
                <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#5B8CFF" />
                <circle cx="27" cy="7.5" r="3" fill="#FF7A00" />
              </svg>
              <span className="text-base font-extrabold tracking-tight text-brand-orange">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider text-brand-violet">
              {siteConfig.tagline}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              Nơi học AI, xây hệ thống và tạo tài sản số hội tụ trong một hệ
              sinh thái duy nhất, đồng hành cùng bạn từ người mới đến nhà đầu
              tư thực chiến trong kỷ nguyên mới.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-violet">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="-mx-2 block rounded-lg px-2 py-1 text-sm text-white/50 transition hover:bg-white/10 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-violet">
              Kết nối
            </h4>
            <ul className="mt-4 space-y-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="flex items-center gap-2.5 text-sm text-white/50 transition hover:text-white"
                  >
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-full"
                      style={{ backgroundColor: s.bg }}
                    >
                      {s.icon}
                    </span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row">
          <span>
            Copyright © {new Date().getFullYear()} {siteConfig.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
