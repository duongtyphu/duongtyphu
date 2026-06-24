import { getSupabaseServer } from "@/lib/supabase-server";

export const metadata = { title: "Chuyên gia" };

type Expert = {
  id: number;
  name: string;
  title: string | null;
  bio: string | null;
  avatar_url: string | null;
};

async function getExperts(): Promise<Expert[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("experts")
    .select("id, name, title, bio, avatar_url")
    .eq("active", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function ExpertsPage() {
  const experts = await getExperts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Chuyên gia</h1>
        <p className="mt-2 text-white">Đội ngũ chuyên gia & cố vấn đồng hành cùng VDAI Academy.</p>
      </div>

      {experts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-white">
          Chưa có thông tin chuyên gia nào được đăng.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {experts.map((e) => (
            <div key={e.id} className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center">
              {e.avatar_url ? (
                <img src={e.avatar_url} alt={e.name} className="mx-auto h-20 w-20 rounded-full object-cover" />
              ) : (
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-2xl">👤</div>
              )}
              <h3 className="mt-3 text-sm font-bold text-white">{e.name}</h3>
              {e.title && <p className="text-xs text-brand-violet">{e.title}</p>}
              {e.bio && <p className="mt-2 text-sm text-white/70">{e.bio}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
