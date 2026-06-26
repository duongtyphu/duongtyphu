import { freeResources } from "@/data/resources";
import { getSupabaseServer } from "@/lib/supabase-server";
import { ResourceCard } from "@/components/portal/ResourceCard";

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
              <ResourceCard
                key={d.id}
                title={d.title}
                description={d.description ?? undefined}
                href={d.url}
                icon={d.icon}
                external
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-bold text-white">Thư viện tài nguyên</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {freeResources.map((r) => (
            <ResourceCard
              key={r.id}
              title={r.title}
              description={r.description}
              type={r.type}
              href={`/portal/resources/${r.id}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
