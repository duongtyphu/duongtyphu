"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

/**
 * ĐÃ CẬP NHẬT — bản trước copy nguyên mẫu logo tĩnh của website HTML CŨ
 * (`duongtyphu/`, ngoài phạm vi Admin CMS Next.js này), lệch hẳn với logo
 * THẬT đang chạy trên Landing Page/Portal (`HeaderClient.tsx`/`Footer.tsx`):
 * cam `#F97316` (cũ) → `#FF7A00` (thật); chữ tĩnh "VDAI"/"ACADEMY" xếp
 * chồng (cũ) → tên site tách `brandMain`/`brandAccent` từ `settings.siteName`
 * thật (đọc live ở "Header & Footer"), màu accent tím `#5B21D6` (nền
 * sáng)/trắng (nền tối) thay vì luôn trắng. Snippet dưới đây copy ĐÚNG JSX
 * thật từ 2 file trên (không phải HTML tĩnh — dự án này là Next.js/React,
 * dán JSX vào component mới, không phải file `.html`).
 */
const HEADER_SNIPPET = `<Link href="/" className="flex items-center gap-2">
  <svg width="34" height="34" viewBox="0 0 32 32" fill="none" className="shrink-0">
    <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB" />
    <circle cx="27" cy="7.5" r="3" fill="#FF7A00" />
  </svg>
  <span className="flex flex-col leading-tight">
    <span className="text-sm font-extrabold tracking-tight">
      <span className="text-[#2563EB]">{brandMain(siteName)}</span>
      <span className={isLight ? "text-[#5B21D6]" : "text-white"}>{brandAccent(siteName)}</span>
    </span>
    <span className={\`hidden text-[9px] font-semibold uppercase tracking-wider sm:block \${isLight ? "text-[#5B21D6]" : "text-white"}\`}>
      {slogan}
    </span>
  </span>
</Link>`;

const FOOTER_SNIPPET = `<Link href="/" className="flex items-center gap-2">
  <svg width="34" height="34" viewBox="0 0 32 32" fill="none" className="shrink-0">
    <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB" />
    <circle cx="27" cy="7.5" r="3" fill="#FF7A00" />
  </svg>
  <span className="text-base font-extrabold tracking-tight">
    <span className="text-[#2563EB]">{brandMain(settings.siteName)}</span>
    <span className={isLight ? "text-[#5B21D6]" : "text-white"}>{brandAccent(settings.siteName)}</span>
  </span>
</Link>`;

const HEADER_PREVIEW_HTML = `<a href="/" style="display:inline-flex;align-items:center;gap:8px;text-decoration:none">
  <svg width="34" height="34" viewBox="0 0 32 32" fill="none" style="flex-shrink:0"><path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB"/><circle cx="27" cy="7.5" r="3" fill="#FF7A00"/></svg>
  <span style="display:flex;flex-direction:column;line-height:1.2">
    <span style="font-size:14px;font-weight:800;letter-spacing:-0.01em;font-family:Inter,system-ui,sans-serif"><span style="color:#2563EB">VO DUONG </span><span style="color:#fff">AI</span></span>
    <span style="font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#fff;font-family:Inter,system-ui,sans-serif">Học AI • Xây hệ thống • Tạo tài sản số</span>
  </span>
</a>`;

const FOOTER_PREVIEW_HTML = `<a href="/" style="display:inline-flex;align-items:center;gap:8px;text-decoration:none">
  <svg width="34" height="34" viewBox="0 0 32 32" fill="none" style="flex-shrink:0"><path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB"/><circle cx="27" cy="7.5" r="3" fill="#FF7A00"/></svg>
  <span style="font-size:16px;font-weight:800;letter-spacing:-0.01em;font-family:Inter,system-ui,sans-serif"><span style="color:#2563EB">VO DUONG </span><span style="color:#fff">AI</span></span>
</a>`;

function SnippetBlock({
  label,
  previewHtml,
  code,
  note,
}: {
  label: string;
  previewHtml: string;
  code: string;
  note?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-gray-900">{label}</h3>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Đã sao chép" : "Sao chép mã"}
        </button>
      </div>
      <div className="mt-4 flex items-center rounded-xl bg-[#0f172a] p-4">
        <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
      </div>
      {note && <p className="mt-2 text-xs text-gray-400">{note}</p>}
      <pre className="mt-3 overflow-x-auto rounded-xl bg-gray-900 p-4 text-xs text-gray-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function LogoSnippets() {
  return (
    <div className="space-y-4">
      <SnippetBlock
        label="Header (JSX thật — HeaderClient.tsx)"
        previewHtml={HEADER_PREVIEW_HTML}
        code={HEADER_SNIPPET}
        note='Xem trước dùng tên site mặc định "VO DUONG AI" + slogan mặc định, ở chế độ nền tối (mặc định mọi trang trừ trang chủ). Tên site/slogan thật đọc live từ "Header & Footer" (settings.siteName/slogan) — sửa ở đó, không sửa cứng ở đây.'
      />
      <SnippetBlock
        label="Footer (JSX thật — Footer.tsx)"
        previewHtml={FOOTER_PREVIEW_HTML}
        code={FOOTER_SNIPPET}
        note="Footer luôn hiện đúng logo + tên site này, không rút gọn khi thu nhỏ màn hình."
      />
    </div>
  );
}
