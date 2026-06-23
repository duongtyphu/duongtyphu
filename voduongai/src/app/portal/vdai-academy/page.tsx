import { vdaiCourses } from "@/data/courses";

export const metadata = { title: "VDAI Academy" };

const tracks = [
  {
    id: "solo",
    name: "VDAI SOLO",
    price: "300$",
    duration: "8 tuần",
    tagline:
      "Xây hệ thống Affiliate AI vận hành tinh gọn — một mình. Từ zero đến dòng tiền đầu tiên trong 8 tuần.",
    audience: [
      "Người mới bắt đầu hoặc đang làm Affiliate một mình",
      "Creator, KOC đang xây thương hiệu cá nhân",
      "Người có sản phẩm mới muốn ứng dụng Affiliate AI",
    ],
    outputs: [
      "Hệ thống Affiliate cá nhân hoàn chỉnh, vận hành được ngay",
      "Bộ trợ lý AI cá nhân hỗ trợ từ content đến chăm sóc khách hàng",
    ],
  },
  {
    id: "scale",
    name: "VDAI SCALE",
    price: "1000$",
    duration: null,
    tagline:
      "Nhân bản hệ thống Affiliate cùng đội nhóm. Tự động hoá toàn diện, mở rộng doanh thu không giới hạn.",
    audience: [
      "Leader đang có đội nhóm/cộng tác viên",
      "Người đã có kết quả ổn định, muốn mở rộng quy mô",
    ],
    outputs: [
      "Academy nội bộ, thư viện nội dung & prompt dùng chung cho team",
      "Bảng KPI team và lộ trình kế nhiệm leader để nhân bản hệ thống",
    ],
  },
];

const a5System = [
  { step: "Analyze", desc: "Thị trường, ngách, khách hàng, xu hướng, sản phẩm, đối thủ" },
  { step: "Attract", desc: "Thương hiệu, nội dung, video, cộng đồng, kênh tiếp cận khách hàng" },
  { step: "Activate", desc: "CTA, landing page, kịch bản bán hàng, nuôi dưỡng, remarketing" },
  { step: "Automate", desc: "Dùng AI và workflow để giảm việc lặp lại" },
  { step: "Amplify", desc: "Tiêu chuẩn hoá, đào tạo, KPI, phát triển đội nhóm" },
];

export default function VdaiAcademyPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-extrabold text-white">VDAI Academy</h1>
        <p className="mt-2 text-white">
          Hệ thống Affiliate Marketing ứng dụng AI — từ VDAI SOLO (một người)
          đến VDAI SCALE (mở rộng đội nhóm), cùng theo khung phương pháp A5
          System.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {tracks.map((t) => (
          <div
            key={t.id}
            className="card-shine flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-extrabold text-white">{t.name}</h2>
              <span className="text-xl font-extrabold text-brand-orange">{t.price}</span>
            </div>
            {t.duration && (
              <span className="mt-1 text-xs font-semibold text-brand-violet">
                Lộ trình {t.duration}
              </span>
            )}
            <p className="mt-3 text-sm leading-relaxed text-white/70">{t.tagline}</p>

            <div className="mt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">
                Phù hợp với
              </h3>
              <ul className="mt-2 space-y-1.5 text-sm text-white/80">
                {t.audience.map((a) => (
                  <li key={a}>• {a}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">
                Bạn nhận được
              </h3>
              <ul className="mt-2 space-y-1.5 text-sm text-white/80">
                {t.outputs.map((o) => (
                  <li key={o}>• {o}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-brand-violet">
          Phương pháp A5 System
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-5">
          {a5System.map((s) => (
            <div
              key={s.step}
              className="card-shine rounded-xl border border-white/10 bg-white/[0.04] p-4"
            >
              <p className="text-sm font-bold text-white">{s.step}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/60">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-brand-violet">
          Nội dung bài học
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {vdaiCourses.map((c) => (
            <div key={c.id} className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-sm font-bold text-white">{c.title}</h3>
              <p className="mt-2 text-sm text-white">{c.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
