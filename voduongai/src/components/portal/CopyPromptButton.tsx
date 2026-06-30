"use client";

import { useState } from "react";

export function CopyPromptButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="mt-3 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-900 hover:border-brand-violet hover:text-brand-violet"
    >
      {copied ? "Đã copy!" : "Copy prompt"}
    </button>
  );
}
