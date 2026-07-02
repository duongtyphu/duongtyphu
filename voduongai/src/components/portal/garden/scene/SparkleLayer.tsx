const SPARKLE_GLINTS = [
  { top: "18%", left: "70%", size: 5, delay: "0s" },
  { top: "45%", left: "30%", size: 4, delay: "4s" },
];

const FALLING_LEAVES = [
  { left: "22%", size: 9, color: "#86EFAC", opacity: 0.85, delay: "0s" },
  { left: "55%", size: 8, color: "#86EFAC", opacity: 0.8, delay: "8s" },
  { left: "78%", size: 9, color: "#A3E635", opacity: 0.8, delay: "16s" },
];

/**
 * Sparkle Layer — ánh sáng lấp lánh thoáng qua rồi biến mất, và vài
 * chiếc lá rơi rất chậm, thưa thớt (~8s một chiếc, so le nhau — không
 * liên tục). Đây là "Particle" của khu vườn: không phải trang trí ngẫu
 * nhiên mà là dấu hiệu khu vườn đang sống.
 */
export function SparkleLayer() {
  return (
    <>
      {SPARKLE_GLINTS.map((s, i) => (
        <span
          key={`glint-${i}`}
          className="garden-sparkle-glint"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: s.delay }}
        />
      ))}
      {FALLING_LEAVES.map((l, i) => (
        <span
          key={`fall-${i}`}
          className="garden-leaf-fall"
          style={{ left: l.left, top: 0, animationDuration: "24s", animationDelay: l.delay }}
        >
          <svg width={l.size} height={l.size * 1.3} viewBox="0 0 10 13" fill="none">
            <path d="M5 0C8 3 10 6 5 13C0 6 2 3 5 0Z" fill={l.color} opacity={l.opacity} />
          </svg>
        </span>
      ))}
    </>
  );
}
