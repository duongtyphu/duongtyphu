/**
 * Companion World™ — Hero bubble góc trên phải (bố cục tham chiếu, mục ①).
 * Khác với `CompanionGreetingBubble` (toast chào mừng có state/session của
 * hệ thống Portal-wide) — đây là một lời Companion tĩnh, trôi rất nhẹ,
 * đứng cố định trong bố cục Hero, không tự ẩn/không đóng được.
 */
export function CompanionHeroBubble({ text }: { text: string }) {
  return (
    <div
      className="companion-anim-text-settle companion-anim-float absolute right-0 top-0 hidden max-w-[15rem] sm:block"
      style={{ animationDelay: "1.8s" }}
    >
      <div className="companion-hero-bubble">
        <p className="text-sm font-medium leading-relaxed text-slate-100">&ldquo;{text}&rdquo;</p>
        <span aria-hidden="true" className="companion-hero-bubble-tail" />
      </div>
    </div>
  );
}
