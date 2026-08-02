"use client";

import { Fragment, useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Renderer markdown TỐI GIẢN, KHÔNG dùng `dangerouslySetInnerHTML` — an
 * toàn tuyệt đối theo thiết kế (không có đường nào render HTML thô), nên
 * không cần thêm dependency (react-markdown/dompurify...) cho Sprint này.
 * Hỗ trợ: code fence ```, inline code `, **đậm**, *nghiêng*, xuống dòng.
 * Không hỗ trợ bảng/heading/link markdown — đủ dùng cho phản hồi chat
 * ngắn, không phải trình soạn thảo nội dung dài (khác RichTextEditor).
 */
export function MarkdownLite({ text }: { text: string }) {
  const blocks = text.split(/```/);

  return (
    <>
      {blocks.map((block, i) =>
        i % 2 === 1 ? <CodeBlock key={i} raw={block} /> : <Fragment key={i}>{renderInline(block)}</Fragment>
      )}
    </>
  );
}

/** Code Block đẹp (EPIC-UX-001) — thanh tiêu đề + nút Sao chép, thay cho
    khối <pre> trần trước đây. */
function CodeBlock({ raw }: { raw: string }) {
  const [copied, setCopied] = useState(false);
  const code = raw.replace(/^\w*\n/, "");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard không khả dụng — bỏ qua, không có gì để báo lỗi thêm
    }
  }

  return (
    <div className="my-2.5 overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-800 px-3 py-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Code</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] font-medium text-gray-400 transition hover:text-white"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Đã sao chép" : "Sao chép"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-xs leading-relaxed text-gray-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function renderInline(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {renderInlineTokens(line)}
    </Fragment>
  ));
}

function renderInlineTokens(line: string) {
  const parts = line.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-gray-100 px-1.5 py-0.5 text-[0.85em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
