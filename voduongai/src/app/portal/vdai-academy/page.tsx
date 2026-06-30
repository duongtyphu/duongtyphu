import { vdaiCourses } from "@/data/courses";
import { getSupabaseServer } from "@/lib/supabase-server";
import { getPurchasedIds } from "@/lib/access";
import { CheckoutButton } from "@/components/portal/CheckoutModal";

export const metadata = { title: "VO DUONG AI Academy" };

type LiveLesson = {
  id: number;
  title: string;
  description: string | null;
  video_url: string | null;
  pdf_url: string | null;
  price: number;
};

async function getLiveLessons(): Promise<LiveLesson[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("lessons")
    .select("id, title, description, video_url, pdf_url, price")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

type LiveClass = {
  id: number;
  course_name: string;
  start_date: string | null;
  end_date: string | null;
  schedule_text: string | null;
  meet_url: string | null;
  seats_total: number | null;
  seats_taken: number | null;
};

async function getLiveClasses(): Promise<LiveClass[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("course_schedules")
    .select("id, course_name, start_date, end_date, schedule_text, meet_url, seats_total, seats_taken")
    .eq("active", true)
    .order("start_date", { ascending: true });
  return data ?? [];
}

function formatDate(d: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("vi-VN");
}

type LiveCourse = { name: string; status: string; description: string | null; price: number | null };

const courseStatusLabel: Record<string, string> = {
  coming: "Sắp mở đăng ký",
  open: "Đang mở đăng ký",
  closed: "Đã đóng",
};

async function getLiveCourseStatuses(): Promise<Record<string, LiveCourse>> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {};
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase.from("courses").select("name, status, description, price");
  const map: Record<string, LiveCourse> = {};
  for (const c of data ?? []) {
    const key = c.name?.toUpperCase().includes("SCALE") ? "scale" : "solo";
    map[key] = c;
  }
  return map;
}

const tracks = [
  {
    id: "solo",
    name: "V-SOLO",
    price: 7_800_000,
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
    name: "V-SCALE",
    price: 26_000_000,
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

export default async function VdaiAcademyPage() {
  const liveLessons = await getLiveLessons();
  const liveClasses = await getLiveClasses();
  const liveCourseStatuses = await getLiveCourseStatuses();
  const purchasedLessonIds = await getPurchasedIds("lesson_id");

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">VO DUONG AI Academy</h1>
        <p className="mt-2 text-gray-900">
          Hệ thống Affiliate Marketing ứng dụng AI — từ V-SOLO (một người)
          đến V-SCALE (mở rộng đội nhóm), cùng theo khung phương pháp A5
          System.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {tracks.map((t) => {
          const live = liveCourseStatuses[t.id];
          const price = live?.price ?? t.price;
          return (
          <div
            key={t.id}
            className="card-shine flex flex-col rounded-2xl border border-gray-200 bg-white/[0.04] p-6"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-extrabold text-gray-900">{t.name}</h2>
              <span className="text-xl font-extrabold text-brand-orange">
                {price.toLocaleString("vi-VN")}đ
              </span>
            </div>
            {t.duration && (
              <span className="mt-1 text-xs font-semibold text-brand-violet">
                Lộ trình {t.duration}
              </span>
            )}
            {live && (
              <span className="mt-1 inline-flex w-fit rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-900">
                {courseStatusLabel[live.status] ?? live.status}
              </span>
            )}
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{live?.description || t.tagline}</p>

            <div className="mt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Phù hợp với
              </h3>
              <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
                {t.audience.map((a) => (
                  <li key={a}>• {a}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Bạn nhận được
              </h3>
              <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
                {t.outputs.map((o) => (
                  <li key={o}>• {o}</li>
                ))}
              </ul>
            </div>
          </div>
          );
        })}
      </div>

      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-brand-violet">
          Phương pháp A5 System
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-5">
          {a5System.map((s) => (
            <div
              key={s.step}
              className="card-shine rounded-xl border border-gray-200 bg-white/[0.04] p-4"
            >
              <p className="text-sm font-bold text-gray-900">{s.step}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {liveClasses.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-brand-violet">
            Lớp học trực tiếp
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {liveClasses.map((c) => {
              const seatsLeft = c.seats_total != null ? c.seats_total - (c.seats_taken ?? 0) : null;
              return (
                <div key={c.id} className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
                  <h3 className="text-sm font-bold text-gray-900">{c.course_name}</h3>
                  <div className="mt-2 space-y-1 text-xs text-gray-600">
                    {(c.start_date || c.end_date) && (
                      <p>
                        🗓 {formatDate(c.start_date)}
                        {c.end_date && ` — ${formatDate(c.end_date)}`}
                      </p>
                    )}
                    {c.schedule_text && <p>⏰ {c.schedule_text}</p>}
                    {seatsLeft != null && <p>👥 Còn {Math.max(seatsLeft, 0)} chỗ</p>}
                  </div>
                  {c.meet_url && (
                    <a
                      href={c.meet_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block rounded-full gradient-surface px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                    >
                      Vào lớp học →
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {liveLessons.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-brand-violet">
            Buổi học thật
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {liveLessons.map((l) => {
              const owned = l.price === 0 || purchasedLessonIds.has(String(l.id));
              return (
                <div key={l.id} className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-bold text-gray-900">{l.title}</h3>
                    <span className="shrink-0 rounded-full bg-brand-orange/10 px-2.5 py-0.5 text-xs font-semibold text-brand-orange">
                      {l.price > 0 ? (owned ? "Đã sở hữu" : `${l.price.toLocaleString("vi-VN")}đ`) : "Miễn phí"}
                    </span>
                  </div>
                  {l.description && <p className="mt-2 text-sm text-gray-600">{l.description}</p>}
                  {owned ? (
                    <div className="mt-3 flex flex-wrap gap-3">
                      {l.video_url && (
                        <a
                          href={l.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-brand-blue hover:underline"
                        >
                          Xem video buổi học →
                        </a>
                      )}
                      {l.pdf_url && (
                        <a
                          href={l.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-brand-blue hover:underline"
                        >
                          Tải tài liệu →
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="mt-3">
                      <CheckoutButton
                        target={{ itemType: "lesson", itemId: l.id, title: l.title, price: l.price }}
                        label="Mua ngay"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-brand-violet">
          Nội dung bài học
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {vdaiCourses.map((c) => (
            <div key={c.id} className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
              <h3 className="text-sm font-bold text-gray-900">{c.title}</h3>
              <p className="mt-2 text-sm text-gray-900">{c.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
