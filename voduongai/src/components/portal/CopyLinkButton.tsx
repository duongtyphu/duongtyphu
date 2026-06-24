"use client";

import { useState } from "react";

export function CopyLinkButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 rounded-lg bg-brand-blue px-4 py-2 text-xs font-bold text-white transition hover:opacity-90"
    >
      {copied ? "Đã copy!" : "Copy link"}
    </button>
  );
}
