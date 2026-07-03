import { getSupabaseServer } from "@/lib/supabase-server";
import { getPurchasedIds } from "@/lib/access";
import { CheckoutButton } from "@/components/portal/CheckoutModal";

/**
 * Academy Reset — Product Decision: gỡ bỏ toàn bộ UI khoá học/pricing-track
 * (V-SOLO/V-SCALE), A5 System, và danh sách bài học demo tĩnh (vdaiCourses).
 * Giữ nguyên logic checkout/mua bài học thật (CheckoutButton, getPurchasedIds)
 * vì đây là tính năng thương mại thật, không phải LMS demo content.
 */
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

export default async function VdaiAcademyPage() {
  const liveLessons = await getLiveLessons();
  const liveClasses = await getLiveClasses();
  const purchasedLessonIds = await getPurchasedIds("lesson_id");

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">VO DUONG AI Academy</h1>
        <p className="mt-2 text-gray-900">
          Buổi học và lớp học trực tiếp về Affiliate Marketing ứng dụng AI.
        </p>
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

      {liveClasses.length === 0 && liveLessons.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white/70 p-8 text-center text-sm text-gray-400">
          Chưa có lớp học hoặc buổi học nào đang mở — quay lại sau nhé.
        </div>
      )}
    </div>
  );
}
