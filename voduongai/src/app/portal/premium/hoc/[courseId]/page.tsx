import { getSupabaseServer } from "@/lib/supabase-server";
import { getSupabaseAdmin } from "@/lib/supabase";
import Link from "next/link";

/**
 * STABILIZATION-SPR-1101 Task 2 — trang xem nội dung khoá học thật đầu
 * tiên cho Premium (trước sprint này KHÔNG tồn tại route/component nào để
 * học viên xem bài học sau khi thanh toán thành công, chỉ có huy hiệu "Đã
 * sở hữu"). Đọc entitlement qua anon key (giống /portal/my-products), sau
 * đó fetch nội dung Module/Lesson qua service-role (KHÔNG cho RLS public
 * select course_lessons — tránh rò rỉ link video/pdf trả phí qua anon key).
 */

type Module = { id: number; title: string; sort_order: number };
type Lesson = {
  id: number;
  module_id: number;
  title: string;
  video_url: string | null;
  pdf_url: string | null;
  document_url: string | null;
  download_url: string | null;
  exercise_note: string | null;
  bonus_note: string | null;
  sort_order: number;
};

async function checkEntitlement(courseId: number): Promise<{ email: string | null; owns: boolean; courseName: string | null }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { email: null, owns: false, courseName: null };
  }
  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email ?? null;
  if (!email) return { email: null, owns: false, courseName: null };

  const { data: course } = await supabase.from("courses").select("name").eq("id", courseId).maybeSingle();

  const { data: orders } = await supabase
    .from("orders")
    .select("course_id, course_ref_id")
    .eq("member_email", email)
    .eq("status", "confirmed");

  const owns = (orders ?? []).some((o) => o.course_ref_id === courseId || o.course_id === String(courseId));
  return { email, owns, courseName: course?.name ?? null };
}

async function getContent(courseId: number): Promise<{ modules: Module[]; lessonsByModule: Record<number, Lesson[]> }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { modules: [], lessonsByModule: {} };

  const { data: modules } = await supabase
    .from("course_modules")
    .select("id, title, sort_order")
    .eq("course_id", courseId)
    .eq("visible", true)
    .order("sort_order", { ascending: true });

  const moduleIds = (modules ?? []).map((m) => m.id);
  const lessonsByModule: Record<number, Lesson[]> = {};
  if (moduleIds.length > 0) {
    const { data: lessons } = await supabase
      .from("course_lessons")
      .select("id, module_id, title, video_url, pdf_url, document_url, download_url, exercise_note, bonus_note, sort_order")
      .in("module_id", moduleIds)
      .eq("visible", true)
      .eq("status", "Published")
      .order("sort_order", { ascending: true });
    for (const l of lessons ?? []) {
      (lessonsByModule[l.module_id] ??= []).push(l);
    }
  }

  return { modules: modules ?? [], lessonsByModule };
}

export default async function CourseLearningPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId: courseIdParam } = await params;
  const courseId = Number(courseIdParam);

  if (!Number.isFinite(courseId)) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-gray-50 p-10 text-center text-sm text-gray-700">
        Khoá học không hợp lệ.
      </div>
    );
  }

  const { email, owns, courseName } = await checkEntitlement(courseId);

  if (!email) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-gray-50 p-10 text-center text-sm text-gray-700">
        Đăng nhập để xem nội dung khoá học.
      </div>
    );
  }

  if (!owns) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-gray-50 p-10 text-center text-sm text-gray-700">
        <p className="font-semibold text-gray-900">Bạn chưa sở hữu khoá học này.</p>
        <Link href="/portal/premium" className="mt-3 inline-block text-sm font-semibold text-brand-blue hover:underline">
          Xem các chương trình Premium →
        </Link>
      </div>
    );
  }

  const { modules, lessonsByModule } = await getContent(courseId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">{courseName ?? "Khoá học"}</h1>
        <p className="mt-2 text-sm text-gray-600">Nội dung học tập của bạn.</p>
      </div>

      {modules.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-gray-50 p-10 text-center text-sm text-gray-700">
          <p className="font-semibold text-gray-900">Chưa có bài học nào được đăng.</p>
          <p className="mt-2 text-gray-600">Founder đang chuẩn bị nội dung — bạn sẽ được thông báo khi có bài học mới.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {modules.map((m) => {
            const lessons = lessonsByModule[m.id] ?? [];
            return (
              <div key={m.id} className="space-y-3">
                <h2 className="text-lg font-bold text-gray-900">{m.title}</h2>
                {lessons.length === 0 ? (
                  <p className="text-sm text-gray-500">Chưa có bài học nào trong chương này.</p>
                ) : (
                  <div className="space-y-3">
                    {lessons.map((l) => (
                      <div key={l.id} className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
                        <h3 className="text-sm font-bold text-gray-900">{l.title}</h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {l.video_url && (
                            <a href={l.video_url} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-900 hover:border-brand-violet hover:text-brand-violet">
                              ▶ Video
                            </a>
                          )}
                          {l.pdf_url && (
                            <a href={l.pdf_url} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-900 hover:border-brand-violet hover:text-brand-violet">
                              📄 PDF
                            </a>
                          )}
                          {l.document_url && (
                            <a href={l.document_url} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-900 hover:border-brand-violet hover:text-brand-violet">
                              📁 Tài liệu
                            </a>
                          )}
                          {l.download_url && (
                            <a href={l.download_url} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-900 hover:border-brand-violet hover:text-brand-violet">
                              ⬇ Tải xuống
                            </a>
                          )}
                          {!l.video_url && !l.pdf_url && !l.document_url && !l.download_url && (
                            <span className="text-xs text-gray-400">Nội dung đang được chuẩn bị.</span>
                          )}
                        </div>
                        {l.exercise_note && (
                          <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">📝 {l.exercise_note}</p>
                        )}
                        {l.bonus_note && (
                          <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">🎁 {l.bonus_note}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
