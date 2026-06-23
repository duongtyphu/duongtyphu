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
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          d="M14 9h2.5V6.5H14C12.34 6.5 11 7.84 11 9.5V11H9v2.5h2V19h2.5v-5.5h2.1l.4-2.5h-2.5v-1.2c0-.5.3-.8.8-.8Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: siteConfig.links.youtube,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <rect x="3" y="6.5" width="18" height="11" rx="3" stroke="currentColor" strokeWidth="1.3" />
        <path d="M10.5 9.5 15 12l-4.5 2.5v-5Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: siteConfig.links.tiktok,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          d="M14 4v9.5a3 3 0 1 1-2.4-2.94"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M14 4c.3 2 1.8 3.5 3.8 3.7"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Zalo",
    href: siteConfig.links.zalo,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: `mailto:hello@${new URL(siteConfig.url).hostname}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.3" />
        <path d="M4.5 7 12 12.5 19.5 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="mesh-navy border-t border-white/10 text-white/60">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="shrink-0">
                <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#FF7A00" />
                <circle cx="27" cy="7.5" r="3" fill="#5B8CFF" />
              </svg>
              <span className="text-lg font-extrabold tracking-tight text-brand-orange">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              Hệ sinh thái AI, Affiliate Marketing và tài sản số dành cho
              những người muốn học nhanh hơn, xây hệ thống hiệu quả hơn và
              tạo giá trị bền vững trong thời đại AI.
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
                      className="text-sm text-white/50 transition hover:text-white"
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
                    className="flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
                  >
                    {s.icon}
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}. Bảo lưu mọi quyền.
          </span>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
            <span>Xây dựng hệ sinh thái AI từ 2024</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
