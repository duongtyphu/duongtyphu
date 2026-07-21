export type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

/**
 * Cơ chế thông báo lưu/lỗi dùng CHUNG cho Admin — trước đây bị lặp lại y hệt
 * ở SingletonEditor.tsx và LessonEditor.tsx (copy-paste 2 lần, không phải
 * import chung), tách ra đây để mọi editor mới (kể cả Case Study) đều dùng
 * đúng 1 component, không tạo thêm biến thể thứ 3.
 */
export function SaveStateBadge({ state, isDirty }: { state: SaveState; isDirty: boolean }) {
  if (state === "saving") return <Badge color="gray">Đang lưu...</Badge>;
  if (state === "error") return <Badge color="red">Lưu thất bại — thử lại</Badge>;
  if (isDirty) return <Badge color="amber">Có thay đổi chưa lưu</Badge>;
  if (state === "saved") return <Badge color="emerald">Đã lưu</Badge>;
  return null;
}

export function Badge({ color, children }: { color: "gray" | "red" | "amber" | "emerald"; children: React.ReactNode }) {
  const styles: Record<string, string> = {
    gray: "bg-gray-100 text-gray-600",
    red: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
  };
  return <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${styles[color]}`}>{children}</span>;
}
