const problems = [
  "AI quá nhiều, không biết bắt đầu từ đâu.",
  "Tool quá nhiều, không biết nên chọn cái gì.",
  "Affiliate quá rối, không biết theo lộ trình nào.",
  "Nội dung quá phân tán, không có nơi học tập trung.",
];

export function Problem() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-extrabold text-brand-navy md:text-3xl">
          Bạn không thiếu cơ hội. Bạn thiếu một hệ thống đúng.
        </h2>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {problems.map((p) => (
          <div
            key={p}
            className="flex items-start gap-3 rounded-[20px] border border-brand-gray-200 bg-white p-5"
          >
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-500">
              !
            </span>
            <p className="text-sm leading-relaxed text-brand-gray-700">{p}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
