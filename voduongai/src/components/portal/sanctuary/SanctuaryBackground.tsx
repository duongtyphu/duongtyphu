/**
 * The Sanctuary of Companion™ — background riêng cho /portal/companion
 * và /portal/su-menh-companion. Mesh gradient nhẹ + floating light +
 * noise cực nhỏ (Global Visual Update: đã bỏ lớp grid caro chìm trước
 * đây). Không dùng ở bất kỳ trang Portal nào khác. Đặt bên trong một
 * wrapper `relative` để phủ toàn bộ nội dung bên dưới (position:
 * absolute, không phải fixed — chỉ che khu vực của chính trang này,
 * không ảnh hưởng Sidebar/Header).
 *
 * variant "default" — /portal/companion: Pearl White → Soft Blue →
 * Lavender → Warm Sunrise Orange → White.
 * variant "warm" — không còn trang nào đang dùng (trước đây là
 * /portal/hanh-trinh-cua-toi, nay đã archive) — giữ lại cho tương lai.
 */
export function SanctuaryBackground({ variant = "default" }: { variant?: "default" | "warm" }) {
  const bgClass = variant === "warm" ? "sanctuary-bg-warm" : "sanctuary-bg";
  const orbs =
    variant === "warm"
      ? [
          { top: "8%", left: "10%", width: 300, height: 300, background: "rgba(37,99,235,0.09)", delay: "0s" },
          { bottom: "10%", right: "8%", width: 340, height: 340, background: "rgba(255,122,0,0.08)", delay: "3s" },
        ]
      : [
          { top: "6%", left: "8%", width: 320, height: 320, background: "rgba(37,99,235,0.10)", delay: "0s" },
          { top: "22%", right: "6%", width: 380, height: 380, background: "rgba(124,58,237,0.09)", delay: "2.4s" },
          { bottom: "8%", left: "20%", width: 340, height: 340, background: "rgba(255,122,0,0.07)", delay: "4.8s" },
        ];

  return (
    <>
      <div className={bgClass} aria-hidden="true">
        {orbs.map(({ delay, ...pos }, i) => (
          <span
            key={i}
            className="sanctuary-orb"
            style={{ ...pos, animationDelay: delay } as React.CSSProperties}
          />
        ))}
      </div>
      <div className="sanctuary-noise" aria-hidden="true" />
    </>
  );
}
