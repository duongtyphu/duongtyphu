const STATS = [
  { value: "10K+", label: "Người theo dõi", sub: "Từ hoạt động thực" },
  { value: "50+", label: "Tài liệu & công cụ", sub: "Sử dụng được ngay" },
  { value: "12+", label: "Công cụ AI thực tế", sub: "Mỗi ngày" },
  { value: "3+", label: "Năm kinh nghiệm", sub: "Thực chiến" },
];

const TRUST_BADGES = ["⭐ 4.9/5 hài lòng", "🎯 97% học viên tiến bộ", "🛡️ Hoàn tiền 7 ngày"];

export function TrustStats() {
  return (
    <section className="border-t border-white/5 py-9 text-white md:py-12">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Left column */}
          <div>
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/70 backdrop-blur-md">
              🌐 Cộng đồng
            </span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl md:text-5xl">
              Bạn <span style={{ color: "#FF6B35" }}>không học một mình</span>
            </h2>
            <p className="mt-3 max-w-md text-sm text-white/50">
              Tham gia cộng đồng để học hỏi, chia sẻ và cập nhật cùng những
              người đang xây hệ thống AI & Affiliate.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {TRUST_BADGES.map((badge) => (
                <span key={badge} className="trust-badge">
                  {badge}
                </span>
              ))}
            </div>

            <p className="mt-6 text-xs text-white/15">
              📌 Cộng đồng đang phát triển cùng nhau mỗi ngày
            </p>
          </div>

          {/* Right column */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="community-stat-card text-center">
                <div className="stat-number">{s.value}</div>
                <p className="mt-2 text-xs text-white/50">{s.label}</p>
                <p className="mt-1 text-[10px] text-white/15">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
