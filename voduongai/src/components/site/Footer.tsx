import Link from "next/link";
import { siteConfig } from "@/lib/site";

const columns = [
  {
    title: "Hệ sinh thái",
    links: [
      { label: "Portal", href: "/portal" },
      { label: "AI Academy", href: "/portal/ai-academy" },
      { label: "VDAI Academy", href: "/portal/vdai-academy" },
      { label: "Affiliate Hub", href: "/portal/affiliate-hub" },
    ],
  },
  {
    title: "Tài nguyên",
    links: [
      { label: "Tool Library", href: "/portal/tools" },
      { label: "Prompt Library", href: "/portal/prompts" },
      { label: "Free Resources", href: "/portal/resources" },
      { label: "Premium Resources", href: "/portal/premium" },
    ],
  },
  {
    title: "Khác",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-brand-navy text-white/60">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg gradient-surface text-sm font-bold text-white">
                VĐ
              </span>
              <span className="text-base font-extrabold text-white">
                {siteConfig.name}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              {siteConfig.taglineSecondary}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white">{col.title}</h4>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs md:flex-row">
          <span>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</span>
          <div className="flex gap-4">
            <a href={siteConfig.links.facebook} className="hover:text-white">Facebook</a>
            <a href={siteConfig.links.youtube} className="hover:text-white">YouTube</a>
            <a href={siteConfig.links.tiktok} className="hover:text-white">TikTok</a>
            <a href={siteConfig.links.zalo} className="hover:text-white">Zalo</a>
            <a href={siteConfig.links.telegram} className="hover:text-white">Telegram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
