/**
 * Phủ đúng lớp khí quyển riêng của module Portal tương ứng (`*-atmosphere-bg`,
 * xem bảng tra cứu trong CLAUDE.md) lên trên GemBackground của AdminShell —
 * KHÔNG copy giá trị gradient ra viết tay, chỉ nhận tên class có sẵn trong
 * globals.css. `-m-6`/`p-6` khớp đúng padding `p-6` của `<main>` trong
 * AdminShell.tsx để lớp khí quyển tràn hết vùng nội dung (full-bleed), đúng
 * kỹ thuật /portal/page.tsx đang dùng cho `home-atmosphere-bg`.
 */
export function AdminAtmosphere({
  atmosphereClassName,
  children,
}: {
  atmosphereClassName: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative -m-6 min-h-full overflow-hidden">
      <div className={atmosphereClassName} aria-hidden />
      <div className="relative z-10 p-6">{children}</div>
    </div>
  );
}
