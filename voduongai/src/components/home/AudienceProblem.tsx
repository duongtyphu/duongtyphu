// Unified landing-page accent (orange). The 3 audience cards each get one
// of the site's existing brand colors (blue/violet/emerald) purely to tell
// them apart at a glance — not a departure from the orange accent, which
// stays the section's primary color (heading highlight, ✕ marks, the
// "VO DUONG AI" answer card).
const ACCENT = "#FF6B35";

const AUDIENCES = [
  {
    icon: "🧑‍🎓",
    label: "Người mới học AI",
    desc: "Bị quá tải bởi hàng nghìn video, bài viết, khoá học – không biết đâu là lộ trình đúng.",
    question: "Tôi nên bắt đầu từ đâu?",
    color: "#2563EB",
  },
  {
    icon: "💼",
    label: "Người đã biết AI cơ bản",
    desc: "Đã dùng ChatGPT, Canva, nhưng chưa biết ứng dụng AI vào công việc và kinh doanh thực tế.",
    question: "Làm sao để AI tạo ra giá trị?",
    color: "#8B5CF6",
  },
  {
    icon: "📈",
    label: "Người muốn xây Affiliate",
    desc: "",
    question: "Affiliate có dành cho người mới?",
    color: "#06D6A0",
  },
];

const PROBLEMS = [
  { lead: "AI quá nhiều", rest: "không biết bắt đầu từ đâu." },
  { lead: "Tool quá nhiều", rest: "không biết nên chọn cái gì." },
  { lead: "Affiliate quá rối", rest: "không có lộ trình rõ ràng." },
  { lead: "Nội dung phân tán", rest: "không có nơi học tập trung." },
];

const STRENGTHS = [
  "Lộ trình rõ ràng theo từng cấp độ — từ mới bắt đầu đến thực chiến.",
  "Công cụ AI được chọn lọc sẵn — không mất thời gian thử sai.",
  "Hệ thống Affiliate có hướng dẫn từng bước, kể cả người mới.",
  "Toàn bộ tài nguyên tập trung trong một Học viện duy nhất.",
  "Học đi đôi với hành — mỗi bước đều có sản phẩm/kết quả thật.",
];

export function AudienceProblem() {
  return (
    <section className="border-t border-white/5 py-9 text-white md:py-12">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/70 backdrop-blur-md">
            🎯 Đối tượng & vấn đề
          </span>
          <h2 className="mt-4 text-2xl font-bold sm:text-3xl md:text-4xl">
            Nếu bạn đang <span style={{ color: ACCENT }}>gặp những điều này</span>,
            <br />
            bạn đang ở đúng nơi.
          </h2>
        </div>

        {/* 3 audience banners */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {AUDIENCES.map((a) => (
            <div key={a.label} className="audience-card">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full text-xl"
                style={{ backgroundColor: `${a.color}26`, color: a.color }}
              >
                {a.icon}
              </span>
              <p className="mt-3 text-sm font-bold text-white">{a.label}</p>
              {a.desc && (
                <p className="mt-1.5 text-xs leading-relaxed text-white/55">
                  {a.desc}
                </p>
              )}
              <p className="audience-question">{a.question}</p>
            </div>
          ))}
        </div>

        {/* Problems vs. solution */}
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
              Những gì đang cản bạn lại
            </p>
            <ul className="mt-4 space-y-3.5">
              {PROBLEMS.map((p) => (
                <li key={p.lead} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: `${ACCENT}26`, color: ACCENT }}
                  >
                    ✕
                  </span>
                  <p className="text-sm leading-relaxed text-white/70">
                    <strong className="font-bold text-white">{p.lead}</strong> –{" "}
                    {p.rest}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="solution-card p-6">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-full text-xl"
              style={{ backgroundColor: `${ACCENT}26`, color: ACCENT }}
            >
              ✨
            </span>
            <p className="mt-3 text-lg font-extrabold" style={{ color: ACCENT }}>
              VO DUONG AI
            </p>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
              Cách của Võ Dương
            </p>
            <ul className="mt-4 space-y-3">
              {STRENGTHS.map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-[10px] font-bold text-emerald-400">
                    ✓
                  </span>
                  <p className="text-sm leading-relaxed text-white/75">{s}</p>
                </li>
              ))}
            </ul>
            <p
              className="mt-5 border-t pt-4 text-sm font-semibold"
              style={{ borderColor: `${ACCENT}33`, color: `${ACCENT}CC` }}
            >
              🚀 Kết quả: Tiết kiệm thời gian, có kết quả thật, xây dựng tài
              sản số.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
