const problems = [
  "Biết AI tồn tại nhưng không biết bắt đầu từ đâu.",
  "Dùng AI lặt vặt nhưng chưa biến nó thành hệ thống tạo ra giá trị.",
  "Muốn có thêm thu nhập online nhưng không biết chọn đúng hướng đi.",
  "Thông tin quá nhiều, không biết tin ai và làm theo lộ trình nào.",
];

export function Problem() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-extrabold text-brand-navy md:text-3xl">
          Bạn có đang gặp những vấn đề này?
        </h2>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {problems.map((p) => (
          <div
            key={p}
            className="flex items-start gap-3 rounded-2xl border border-brand-gray-200 bg-white p-5"
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
