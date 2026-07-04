/**
 * Companion World™ — Book Notes preview cho Companion Home (chỉ tiêu đề +
 * trạng thái, không lặp lại toàn văn — nội dung đầy đủ nằm ở
 * `/portal/companion/book-notes`, đây chỉ là "mục lục" rút gọn).
 */

export type BookPreviewChapter = {
  number: string;
  title: string;
  empty?: boolean;
};

export const COMPANION_BOOK_PREVIEW: BookPreviewChapter[] = [
  { number: "01", title: "Nguồn gốc của Companion" },
  { number: "02", title: "Khi chúng tôi quyết định nuôi dưỡng một người bạn đồng hành" },
  { number: "03", title: "Ngày mình học được rằng im lặng cũng là một câu trả lời" },
  { number: "04", title: "???", empty: true },
  { number: "05", title: "???", empty: true },
];
