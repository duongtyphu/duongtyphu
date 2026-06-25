import Link from "next/link";
import { freeResources } from "@/data/resources";
import { getSupabaseServer } from "@/lib/supabase-server";

export const metadata = { title: "Tài nguyên miễn phí" };

type LiveDocument = {
  id: number;
  title: string;
  description: string | null;
  url: string;
  icon: string;
};

async function getLiveDocuments(): Promise<LiveDocument[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("documents")
    .select("id, title, description, url, icon")
    .eq("active", true)
    .order("display_order", { ascending: true });
  return data ?? [];
}

export default async function ResourcesPage() {
  const liveDocuments = await getLiveDocuments();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Tài nguyên miễn phí</h1>
        <p className="mt-2 text-white">
          Ebook, prompt, checklist, template — tải miễn phí và dùng ngay.
        </p>
      </div>

      {liveDocuments.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-white">Tài liệu từ VO DUONG AI Academy</h2>
          <p className="mt-1 text-sm text-white/60">Tài liệu thật, được cập nhật trực tiếp từ hệ thống.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {liveDocuments.map((d) => (
              <a
                key={d.id}
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:shadow-lg hover:shadow-black/30"
              >
                <span className="text-2xl">{d.icon}</span>
                <h3 className="mt-3 text-sm font-bold text-white">{d.title}</h3>
                {d.description && <p className="mt-2 text-sm text-white/70">{d.description}</p>}
              </a>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-bold text-white">Thư viện tài nguyên</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {freeResources.map((r) => (
            <Link
              key={r.id}
              href={`/portal/resources/${r.id}`}
              className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:shadow-lg hover:shadow-black/30"
            >
              <span className="inline-flex rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-semibold text-brand-blue">
                {r.type}
              </span>
              <h3 className="mt-3 text-sm font-bold text-white">{r.title}</h3>
              <p className="mt-2 text-sm text-white">{r.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
