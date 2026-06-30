import { getSupabaseServer } from "@/lib/supabase-server";

export const metadata = { title: "Case Study" };

type CaseStudy = {
  id: number;
  title: string;
  client_name: string | null;
  summary: string | null;
  result_metric: string | null;
  thumbnail_url: string | null;
  link_url: string | null;
};

async function getCaseStudies(): Promise<CaseStudy[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("case_studies")
    .select("id, title, client_name, summary, result_metric, thumbnail_url, link_url")
    .eq("active", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Case Study</h1>
        <p className="mt-2 text-gray-900">Kết quả thực tế từ học viên và khách hàng đã triển khai hệ thống.</p>
      </div>

      {caseStudies.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-gray-50 p-10 text-center text-sm text-gray-900">
          Chưa có case study nào được đăng. Quay lại sau nhé!
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {caseStudies.map((c) => (
            <div key={c.id} className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
              {c.thumbnail_url && (
                <img src={c.thumbnail_url} alt={c.title} className="mb-3 h-36 w-full rounded-lg object-cover" />
              )}
              <h3 className="text-sm font-bold text-gray-900">{c.title}</h3>
              {c.client_name && <p className="mt-1 text-xs text-gray-500">{c.client_name}</p>}
              {c.summary && <p className="mt-2 text-sm text-gray-600">{c.summary}</p>}
              {c.result_metric && (
                <p className="mt-2 inline-flex rounded-full bg-brand-orange/10 px-2.5 py-0.5 text-xs font-semibold text-brand-orange">
                  📈 {c.result_metric}
                </p>
              )}
              {c.link_url && (
                <a href={c.link_url} target="_blank" rel="noopener noreferrer" className="mt-3 block text-xs font-semibold text-brand-blue hover:underline">
                  Xem chi tiết →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
