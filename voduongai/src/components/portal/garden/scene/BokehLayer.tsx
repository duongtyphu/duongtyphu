const BOKEH_DOTS = [
  { top: "22%", left: "62%", size: 5, delay: "0s" },
  { top: "38%", left: "48%", size: 4, delay: "5s" },
  { top: "15%", left: "80%", size: 3, delay: "10s" },
];

/**
 * Bokeh Layer — bụi sáng trôi rất chậm, tinh tế. Ẩn trên mobile để nhẹ
 * máy (theo yêu cầu "Mobile giảm hiệu ứng").
 */
export function BokehLayer() {
  return (
    <>
      {BOKEH_DOTS.map((d, i) => (
        <span
          key={i}
          className="garden-bokeh hidden sm:block"
          style={{ top: d.top, left: d.left, width: d.size, height: d.size, animationDelay: d.delay }}
        />
      ))}
    </>
  );
}
