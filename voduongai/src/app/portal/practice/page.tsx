import { getSupabaseServer } from "@/lib/supabase-server";
import { PracticeSubmissionForm } from "@/components/portal/PracticeSubmissionForm";

export const metadata = { title: "Dự án thực chiến" };

type Submission = {
  id: number;
  title: string;
  content: string;
  link_url: string | null;
  feedback: string | null;
  status: string;
  created_at: string;
};

const statusLabel: Record<string, string> = {
  pending: "Đang chờ chấm",
  reviewed: "Đã chấm",
};

async function getSubmissions(): Promise<{ email: string | null; submissions: Submission[] }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { email: null, submissions: [] };
  }
  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email ?? null;
  if (!email) return { email: null, submissions: [] };

  const { data } = await supabase
    .from("submissions")
    .select("id, title, content, link_url, feedback, status, created_at")
    .eq("member_email", email)
    .order("created_at", { ascending: false });

  return { email, submissions: data ?? [] };
}

export default async function PracticePage() {
  const { email, submissions } = await getSubmissions();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Dự án thực chiến</h1>
        <p className="mt-2 text-gray-900">
          Nộp dự án thực chiến sau mỗi buổi học để được admin chấm và phản hồi.
        </p>
      </div>

      {!email ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-gray-50 p-10 text-center text-sm text-gray-900">
          Đăng nhập để nộp bài và xem lịch sử bài đã nộp.
        </div>
      ) : (
        <>
          <PracticeSubmissionForm />

          <div>
            <h2 className="text-lg font-bold text-gray-900">Bài đã nộp</h2>
            {submissions.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">Bạn chưa nộp bài thực hành nào.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {submissions.map((s) => (
                  <div key={s.id} className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-bold text-gray-900">{s.title}</h3>
                      <span className="shrink-0 rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-semibold text-gray-900">
                        {statusLabel[s.status] ?? s.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{s.content}</p>
                    {s.link_url && (
                      <a href={s.link_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs font-semibold text-brand-blue hover:underline">
                        Xem minh chứng →
                      </a>
                    )}
                    {s.feedback && (
                      <div className="mt-3 rounded-xl border border-brand-blue/20 bg-brand-blue/5 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Phản hồi của admin</p>
                        <p className="mt-1 text-sm text-gray-700">{s.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
