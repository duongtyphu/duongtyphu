import Link from "next/link";
import { siteConfig } from "@/lib/site";

function LogoMark() {
  return (
    <span className="inline-flex items-center gap-2">
      <svg width="40" height="40" viewBox="0 0 32 32" fill="none" className="shrink-0">
        <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB" />
        <circle cx="27" cy="7.5" r="3" fill="#F97316" />
      </svg>
      <span className="flex flex-col leading-none">
        <b className="text-[18px] font-extrabold tracking-[1.5px] text-[#0B0F2E]">VO DUONG</b>
        <small className="text-[9px] font-semibold tracking-[3px] text-[#94A3B8]">AI</small>
      </span>
    </span>
  );
}

const EXPLORE_LINKS = [
  { label: "Học viện AI", href: "#hoc-vien-ai" },
  { label: "Companion AI", href: "#companion-ai" },
  { label: "Hệ tri thức AI (CKOS)", href: "#ckos" },
  { label: "AI Workspace", href: "#ai-workspace" },
  { label: "Dự án & Cơ hội", href: "#du-an-co-hoi" },
  { label: "Premium", href: "#premium" },
  { label: "Cộng đồng", href: "#cong-dong" },
];

const PERSONAL_LINKS = [
  { label: "Nhật ký học tập", href: "/portal" },
  { label: "Hành trình của tôi", href: "/portal" },
  { label: "Khu vườn của bạn", href: "/portal" },
  { label: "Chiến lược cá nhân", href: "/portal" },
];

const ABOUT_LINKS = [
  { label: "Sứ mệnh & Giá trị", href: "#gia-tri" },
  { label: "Câu chuyện", href: "/about" },
  { label: "Blog & Tin tức", href: "/blogai" },
  { label: "Liên hệ", href: "#lien-he" },
];

export function LandingPreviewFooter() {
  return (
    <footer className="border-t border-[#ECEDF5] bg-white pt-16">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid grid-cols-1 gap-8 pb-11 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <Link href="#top" className="inline-flex no-underline">
              <LogoMark />
            </Link>
            <p className="mt-3.5 max-w-[280px] text-[.88rem] leading-[1.7] text-[#5B6B85]">
              Hệ sinh thái AI toàn diện giúp người Việt học AI, ứng dụng thực tế và tạo giá trị bền vững.
            </p>
            <div className="mt-4 flex gap-2.5">
              <a
                href={siteConfig.links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(124,92,252,.12)] text-[#5b21c9] transition-colors hover:bg-[#7C5CFC] hover:text-white"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
                </svg>
              </a>
              <a
                href={siteConfig.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(124,92,252,.12)] text-[#5b21c9] transition-colors hover:bg-[#7C5CFC] hover:text-white"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
                </svg>
              </a>
              <a
                href={siteConfig.links.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(124,92,252,.12)] text-[#5b21c9] transition-colors hover:bg-[#7C5CFC] hover:text-white"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M16.6 5.82a4.28 4.28 0 0 1-4.29-4.28h-3.4v14.61a2.6 2.6 0 1 1-1.84-2.49V10.3a6 6 0 1 0 5.24 5.95V9.4a7.65 7.65 0 0 0 4.29 1.31V7.31a4.27 4.27 0 0 1 0-1.49Z" />
                </svg>
              </a>
              <a
                href={siteConfig.links.zalo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zalo"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(124,92,252,.12)] text-[#5b21c9] transition-colors hover:bg-[#7C5CFC] hover:text-white"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <text x="12" y="16" fontSize="9" textAnchor="middle" fill="#fff" fontWeight="800">
                    Za
                  </text>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[.95rem] font-extrabold text-[#0B0F2E]">Khám phá</h4>
            <ul className="flex flex-col gap-[11px]">
              {EXPLORE_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-[.88rem] text-[#5B6B85] transition-colors hover:text-[#5b21c9]">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[.95rem] font-extrabold text-[#0B0F2E]">Cá nhân</h4>
            <ul className="flex flex-col gap-[11px]">
              {PERSONAL_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[.88rem] text-[#5B6B85] transition-colors hover:text-[#5b21c9]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[.95rem] font-extrabold text-[#0B0F2E]">Về chúng tôi</h4>
            <ul className="flex flex-col gap-[11px]">
              {ABOUT_LINKS.map((l) => (
                <li key={l.label}>
                  {l.href.startsWith("#") ? (
                    <a href={l.href} className="text-[.88rem] text-[#5B6B85] transition-colors hover:text-[#5b21c9]">
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className="text-[.88rem] text-[#5B6B85] transition-colors hover:text-[#5b21c9]">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div id="lien-he">
            <h4 className="mb-4 text-[.95rem] font-extrabold text-[#0B0F2E]">Liên hệ</h4>
            <div className="mb-3 flex items-center gap-2.5 text-[.86rem] text-[#5B6B85]">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[rgba(124,92,252,.12)] text-[#5b21c9]">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {siteConfig.contact.email}
            </div>
            <div className="mb-3 flex items-center gap-2.5 text-[.86rem] text-[#5B6B85]">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[rgba(124,92,252,.12)] text-[#5b21c9]">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 2Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              (+84) {siteConfig.contact.phone}
            </div>
            <div className="flex items-center gap-2.5 text-[.86rem] text-[#5B6B85]">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[rgba(124,92,252,.12)] text-[#5b21c9]">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              TP. Hồ Chí Minh, Việt Nam
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#ECEDF5] py-[22px] text-[.82rem] text-[#94A3B8]">
          <div>© {new Date().getFullYear()} VO DUONG AI. Đã đăng ký bản quyền nội dung.</div>
          <div className="flex flex-wrap gap-[22px]">
            <Link href="/privacy" className="hover:text-[#5b21c9]">
              Chính sách bảo mật
            </Link>
            <Link href="/terms" className="hover:text-[#5b21c9]">
              Điều khoản sử dụng
            </Link>
            <Link href="/refund-policy" className="hover:text-[#5b21c9]">
              Quy định cộng đồng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
