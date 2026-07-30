"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const NAV_SNIPPET = `<a href="index.html" class="nav-logo" style="display:inline-flex;align-items:center;text-decoration:none">
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="display:inline-block;flex-shrink:0"><path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB"/><circle cx="27" cy="7.5" r="3" fill="#F97316"/></svg><span style="display:inline-flex;flex-direction:column;line-height:1;margin-left:7px"><b style="font-size:15px;font-weight:800;color:#fff;letter-spacing:1.5px;font-family:Inter,system-ui,sans-serif">VDAI</b><small style="font-size:8px;font-weight:600;color:#94a3b8;letter-spacing:3px;font-family:Inter,system-ui,sans-serif">ACADEMY</small></span>
</a>`;

const FOOTER_SNIPPET = `<a href="index.html" class="footer-brand-logo" style="display:inline-flex;align-items:center;text-decoration:none">
  <svg width="40" height="40" viewBox="0 0 32 32" fill="none" style="display:inline-block;flex-shrink:0"><path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB"/><circle cx="27" cy="7.5" r="3" fill="#F97316"/></svg><span style="display:inline-flex;flex-direction:column;line-height:1;margin-left:8px"><b style="font-size:18px;font-weight:800;color:#fff;letter-spacing:1.5px;font-family:Inter,system-ui,sans-serif">VDAI</b><small style="font-size:9px;font-weight:600;color:#94a3b8;letter-spacing:3px;font-family:Inter,system-ui,sans-serif">ACADEMY</small></span>
</a>`;

function SnippetBlock({ label, code }: { label: string; code: string }) {
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
        <div dangerouslySetInnerHTML={{ __html: code }} />
      </div>
      <pre className="mt-3 overflow-x-auto rounded-xl bg-gray-900 p-4 text-xs text-gray-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function LogoSnippets() {
  return (
    <div className="space-y-4">
      <SnippetBlock label="Nav (Header)" code={NAV_SNIPPET} />
      <SnippetBlock label="Footer" code={FOOTER_SNIPPET} />
    </div>
  );
}
