import { Fragment } from "react";

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
        i % 2 === 1 ? (
          <pre
            key={i}
            className="my-2 overflow-x-auto rounded-lg bg-gray-900 p-3 text-xs leading-relaxed text-gray-100"
          >
            <code>{block.replace(/^\w*\n/, "")}</code>
          </pre>
        ) : (
          <Fragment key={i}>{renderInline(block)}</Fragment>
        )
      )}
    </>
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
