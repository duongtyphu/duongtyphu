/**
 * Phủ đúng lớp khí quyển riêng của module Portal tương ứng lên trên
 * GemBackground của AdminShell — KHÔNG copy giá trị gradient ra viết tay.
 * `-m-6`/`p-6` khớp đúng padding `p-6` của `<main>` trong AdminShell.tsx để
 * lớp khí quyển tràn hết vùng nội dung (full-bleed), đúng kỹ thuật
 * /portal/page.tsx đang dùng cho `home-atmosphere-bg`.
 *
 * 2 cách truyền nền, tuỳ module Portal tương ứng dùng gì:
 * - `atmosphereClassName`: đa số module chỉ là 1 class trong globals.css
 *   (`*-atmosphere-bg`, xem bảng tra cứu trong CLAUDE.md).
 * - `atmosphere`: một số module (vd. Companion — `/portal/companion` dùng
 *   `<SanctuaryBackground/>`) có nền là hẳn 1 component (nhiều lớp/orbs),
 *   không rút gọn thành 1 class được — truyền thẳng component đó vào đây
 *   thay vì bịa 1 class mới.
 */
export function AdminAtmosphere({
  atmosphereClassName,
  atmosphere,
  children,
}: {
  atmosphereClassName?: string;
  atmosphere?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative -m-6 min-h-full overflow-hidden">
      {atmosphere ?? <div className={atmosphereClassName} aria-hidden />}
      <div className="relative z-10 p-6">{children}</div>
    </div>
  );
}
