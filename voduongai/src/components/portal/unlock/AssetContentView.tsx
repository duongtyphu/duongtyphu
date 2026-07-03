"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { UnlockableAsset } from "@/companion/unlock/unlock.types";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // bỏ qua nếu clipboard không khả dụng
        }
      }}
      className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-600 transition hover:border-blue-300 hover:text-blue-600"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
      {copied ? "Đã copy" : "Copy"}
    </button>
  );
}

/** Render nội dung thật của asset theo từng loại — không placeholder. */
export function AssetContentView({ asset }: { asset: UnlockableAsset }) {
  if (asset.type === "prompt_pack" && "prompts" in asset.content) {
    return (
      <div className="space-y-2.5">
        {asset.content.prompts.map((p) => (
          <div key={p.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-gray-800">{p.label}</p>
              <CopyButton text={p.prompt} />
            </div>
            <p className="text-xs leading-relaxed text-gray-600">{p.prompt}</p>
          </div>
        ))}
      </div>
    );
  }

  if (asset.type === "checklist" && "items" in asset.content) {
    return (
      <ul className="space-y-2">
        {asset.content.items.map((item) => (
          <li key={item.label} className="flex items-start gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
            <input type="checkbox" className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-blue-600" />
            <div>
              <p className="text-xs font-bold text-gray-800">{item.label}</p>
              <p className="text-[11px] leading-relaxed text-gray-500">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (asset.type === "template" && "templates" in asset.content) {
    return (
      <div className="space-y-2.5">
        {asset.content.templates.map((t) => (
          <div key={t.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-gray-800">{t.label}</p>
              <CopyButton text={t.body} />
            </div>
            <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-gray-600">{t.body}</pre>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
