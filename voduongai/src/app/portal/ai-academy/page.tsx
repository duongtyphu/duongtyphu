import { getSupabaseServer } from "@/lib/supabase-server";

const lessons = [
  { title: "AI là gì và vì sao bạn cần dùng nó", description: "Hiểu nền tảng AI và cách nó thay đổi cách làm việc." },
  { title: "Làm chủ ChatGPT, Claude, Gemini", description: "So sánh và sử dụng hiệu quả các AI phổ biến nhất." },
  { title: "Viết prompt hiệu quả", description: "Nguyên tắc viết prompt rõ ràng, ra kết quả đúng ý." },
  { title: "Ứng dụng AI vào công việc hàng ngày", description: "Tự động hoá các việc lặp lại bằng AI." },
];

export const metadata = { title: "AI Academy" };

type LiveLesson = {
  id: string;
  title: string;
  shortDescription: string | null;
  category: string | null;
  level: string | null;
  duration: string | null;
  tier: string | null;
  videoUrl: string | null;
};

async function getLiveLessons(): Promise<LiveLesson[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("ai_academy")
    .select("id, data, status, order")
    .eq("status", "Published")
    .order("order", { ascending: true });

  return (data ?? []).map((row) => {
    const d = row.data as Record<string, unknown>;
    return {
      id: row.id,
      title: String(d.title ?? ""),
      shortDescription: typeof d.shortDescription === "string" ? d.shortDescription : null,
      category: typeof d.category === "string" ? d.category : null,
      level: typeof d.level === "string" ? d.level : null,
      duration: typeof d.duration === "string" ? d.duration : null,
      tier: typeof d.tier === "string" ? d.tier : null,
      videoUrl: typeof d.videoUrl === "string" ? d.videoUrl : null,
    };
  });
}

export default async function AiAcademyPage() {
  const liveLessons = await getLiveLessons();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">AI Academy</h1>
        <p className="mt-2 text-gray-900">
          Lộ trình học AI từ nền tảng đến ứng dụng thực chiến trong công việc.
        </p>
      </div>

      {liveLessons.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-brand-violet">Bài học mới</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {liveLessons.map((l) => (
              <div key={l.id} className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold text-gray-900">{l.title}</h3>
                  {l.tier === "Premium" && (
                    <span className="shrink-0 rounded-full bg-brand-violet/15 px-2.5 py-0.5 text-xs font-semibold text-brand-violet">
                      Premium
                    </span>
                  )}
                </div>
                {(l.category || l.level || l.duration) && (
                  <p className="mt-1 text-xs text-gray-500">
                    {[l.category, l.level, l.duration].filter(Boolean).join(" · ")}
                  </p>
                )}
                {l.shortDescription && <p className="mt-2 text-sm text-gray-900">{l.shortDescription}</p>}
                {l.tier !== "Premium" && l.videoUrl && (
                  <a
                    href={l.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-xs font-semibold text-brand-blue hover:underline"
                  >
                    Xem bài học →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-brand-violet">Lộ trình nền tảng</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {lessons.map((l) => (
            <div key={l.title} className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
              <h3 className="text-sm font-bold text-gray-900">{l.title}</h3>
              <p className="mt-2 text-sm text-gray-900">{l.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
