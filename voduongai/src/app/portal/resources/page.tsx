import { getSupabaseServer } from "@/lib/supabase-server";
import { getLiveResources } from "@/lib/portal/live-resources";
import { ResourceCard } from "@/components/portal/ResourceCard";
import { CompanionGuide } from "@/components/portal/CompanionGuide";
import { KnowledgeJourneyStrip } from "@/components/portal/ui/KnowledgeJourneyStrip";

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
  const resources = await getLiveResources();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Tài nguyên miễn phí</h1>
        <p className="mt-2 text-gray-900">
          Ebook, prompt, checklist, template — tải miễn phí và dùng ngay.
        </p>
      </div>

      {liveDocuments.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900">Tài liệu từ VO DUONG AI Academy</h2>
          <p className="mt-1 text-sm text-gray-500">Tài liệu thật, được cập nhật trực tiếp từ hệ thống.</p>
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
        <h2 className="text-lg font-bold text-gray-900">Thư viện tài nguyên</h2>
        <p className="mt-1 text-sm text-gray-500">
          Bộ tài nguyên biên tập sẵn của VO DUONG AI — mỗi mục có ghi rõ khi nào nên dùng, không chỉ mô tả nội dung.
        </p>
        {resources.length === 0 && (
          <p className="mt-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
            Chưa có tài nguyên nào được đăng.
          </p>
        )}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {resources.map((r) => (
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

      {/* CKOS Navigation Audit — trang này trước đây kết thúc ngay sau
       * lưới Tài nguyên, không có gợi ý bước tiếp theo (dead end thật). */}
      <CompanionGuide
        message="Một tài nguyên chỉ có giá trị khi bạn thật sự dùng nó cho một việc cụ thể. Nếu đã tải xong, mang nó vào Workspace ngay khi còn nhớ vì sao bạn cần nó."
        action={{ label: "Mở Workspace", href: "/portal/workspace" }}
      />

      <KnowledgeJourneyStrip
        title="Tải xong rồi, tiếp theo là gì?"
        steps={[
          { label: "Thực hành ở Workspace", description: "Dùng tài nguyên ngay trong một phiên làm việc thật.", href: "/portal/workspace" },
          { label: "Xem Prompt liên quan", description: "Nhiều tài nguyên đi kèm một Prompt phù hợp để bắt đầu.", href: "/portal/prompts" },
          { label: "Quay lại Hệ tri thức AI (CKOS)", description: "Xem toàn bộ 7 loại tri thức khác.", href: "/portal/ckos" },
        ]}
      />
    </div>
  );
}
