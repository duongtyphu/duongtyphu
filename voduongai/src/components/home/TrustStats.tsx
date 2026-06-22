const stats = [
  { value: "10,000+", label: "Người theo dõi & học viên" },
  { value: "50+", label: "Tài liệu & công cụ AI chia sẻ" },
  { value: "12+", label: "Công cụ AI sử dụng thực tế" },
  { value: "3+", label: "Năm kinh nghiệm AI & Affiliate" },
];

export function TrustStats() {
  return (
    <section className="border-y border-brand-gray-200 bg-brand-gray-50">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 py-12 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-extrabold text-brand-navy md:text-3xl">
              {s.value}
            </p>
            <p className="mt-1 text-sm text-brand-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
