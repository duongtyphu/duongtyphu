import sanitizeHtml from "sanitize-html";

/**
 * "NỘI DUNG ĐẦY ĐỦ" của bài viết (ecosystem_articles.content) — Founder
 * yêu cầu trình soạn thảo có thanh công cụ chuyên nghiệp (đậm/nghiêng/
 * cỡ chữ/canh giữa/chèn ảnh...) thay vì textarea thuần — đã build
 * `RichTextEditor.tsx` (TipTap), lưu `content` dưới dạng HTML thay vì
 * plain text `\n\n`-separated như trước.
 *
 * TƯƠNG THÍCH NGƯỢC: các bài viết đã có từ trước (3 bài DigiU seed thật +
 * bất kỳ bài nào Admin đã tạo bằng textarea cũ) vẫn là plain text, KHÔNG
 * có thẻ HTML nào — `looksLikeHtml()` phân biệt 2 dạng bằng cách kiểm tra
 * có thẻ mở đầu hợp lệ hay không (`<p`, `<h`, `<ul`... — không chỉ tìm
 * ký tự `<` bất kỳ, vì nội dung thuần có thể chứa `<` không có ý nghĩa
 * HTML, ví dụ "a < b"). `plainTextToHtml()` chuyển plain text cũ (đoạn
 * cách nhau bằng dòng trống) sang HTML tương đương để nạp đúng vào
 * `RichTextEditor` khi Admin mở sửa 1 bài cũ — escape ký tự đặc biệt
 * trước khi bọc `<p>` để không vô tình tạo thẻ HTML từ nội dung cũ.
 */
export function looksLikeHtml(content: string): boolean {
  return /^\s*<(p|h[1-6]|ul|ol|blockquote|div|img|table)[\s/>]/i.test(content);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function plainTextToHtml(content: string): string {
  return content
    .split("\n\n")
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para) => `<p>${escapeHtml(para).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

/** Nạp đúng nội dung vào `RichTextEditor` dù bài cũ (plain text) hay mới
 * (HTML) — luôn trả về HTML hợp lệ. */
export function toEditableHtml(content: string): string {
  if (!content) return "";
  return looksLikeHtml(content) ? content : plainTextToHtml(content);
}

/** Khử độc HTML trước khi render qua `dangerouslySetInnerHTML` trên
 * Portal — dù nội dung do Admin tự viết qua `RichTextEditor` (không phải
 * người dùng công khai), vẫn chặn HTML/script lạ có thể lọt vào qua paste
 * (đúng nguyên tắc an toàn khi render HTML thô). Cho phép đúng các
 * thẻ/attribute `RichTextEditor` (TipTap) có thể tạo ra — `style` cần
 * giữ lại cho màu chữ/cỡ chữ (`Color`/`FontSize` extension render qua
 * inline style, không phải class).
 *
 * BUG THẬT đã xảy ra trên Preview (Founder báo "Link các bài viết ... bị
 * lỗi" — cả 3 bài Published đều lỗi 500, kể cả 2 bài plain text không hề
 * gọi hàm này): dùng `isomorphic-dompurify` (bọc `jsdom`, phụ thuộc native/
 * dynamic require) trước đây — import module này ở ĐẦU FILE là
 * unconditional, nên riêng việc `import` lỗi trên môi trường serverless
 * của Vercel (khác `next dev` cục bộ, nơi vẫn chạy được) đã sập TOÀN BỘ
 * route `cap-nhat/[articleSlug]` (vì import cả `looksLikeHtml` từ file
 * này) — không riêng bài có nội dung HTML. Đổi sang `sanitize-html` — pure
 * JS, không phụ thuộc `jsdom`/native, an toàn cho serverless. Đã verify
 * lại hành vi chặn XSS (thẻ `<script>` bị xoá, `<strong>/<em>/<h2>/<ul>`
 * giữ nguyên) tương đương bản DOMPurify cũ. */
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "strong", "em", "u", "s", "mark", "a", "img",
      "h2", "h3", "ul", "ol", "li", "blockquote", "hr", "span", "code", "pre",
    ],
    allowedAttributes: {
      "*": ["style", "class"],
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
    },
  });
}
