/**
 * Tiêu đề trang module dùng phối màu chữ theo phong cách "Companion"
 * (`/portal/companion`): gradient 4 điểm dừng đen→xanh dương→tím→cam
 * chạy qua toàn bộ chữ, RIÊNG chữ "AI" (nếu có, khớp nguyên từ) luôn
 * tô màu cam đặc (#F97316) — khác hẳn phần chữ còn lại — theo yêu cầu
 * chuẩn hoá màu tiêu đề cho: Hệ tri thức AI, Học viện AI, AI Workspace,
 * Dự án & Cơ hội, Premium, Cộng đồng, Nhật ký học tập, Hành trình của
 * tôi, Khu vườn của bạn.
 */

const TITLE_GRADIENT = "linear-gradient(90deg, #111827, #2563EB, #7C3AED, #F97316)";
const AI_COLOR = "#F97316";

export function GradientTitle({ text }: { text: string }) {
  const parts = text.split(/(\bAI\b)/g);
  return (
    <>
      {parts.map((part, i) =>
        part === "AI" ? (
          <span key={i} style={{ color: AI_COLOR }}>
            {part}
          </span>
        ) : (
          part && (
            <span key={i} className="bg-clip-text text-transparent" style={{ backgroundImage: TITLE_GRADIENT }}>
              {part}
            </span>
          )
        )
      )}
    </>
  );
}
