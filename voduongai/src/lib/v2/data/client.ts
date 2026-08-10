/**
 * Lớp truy cập dữ liệu cho Portal & Admin 2.0.
 *
 * Giai đoạn này toàn bộ nội dung là MOCK. Mọi hàm đọc dữ liệu đều `async` và
 * trả Promise ngay từ đầu, nên khi nối Supabase thật chỉ cần thay phần thân —
 * không component nào phải sửa.
 *
 * Quy ước: mock nằm trong từng module entity (`users.ts`, `courses.ts`, ...),
 * module đó export hàm `async` mang tên nghiệp vụ (`listUsers`, `getUser`),
 * component chỉ gọi hàm — không bao giờ import thẳng mảng mock.
 */

/** Bọc giá trị tĩnh thành Promise để chữ ký hàm giống hệt khi thay bằng query thật. */
export async function mockFetch<T>(value: T): Promise<T> {
  return value;
}

/** Định dạng số tiền VND: 1250000 -> "1.250.000 ₫" */
export function formatVnd(amount: number): string {
  return `${amount.toLocaleString("vi-VN")} ₫`;
}

/** Định dạng ngày ISO -> "10/08/2026" */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** Định dạng ngày giờ ISO -> "10/08/2026 14:32" */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${formatDate(iso)} ${d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}
