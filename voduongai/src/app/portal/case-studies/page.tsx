import { getSupabaseServer } from "@/lib/supabase-server";
import { KnowledgeJourneyStrip } from "@/components/portal/ui/KnowledgeJourneyStrip";
import { PortalBackLink } from "@/components/portal/ui/PortalBackLink";

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
      <PortalBackLink href="/portal/ckos" label="Hệ tri thức AI (CKOS)" tone="light" />
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Case Study</h1>
        <p className="mt-2 text-gray-900">Kết quả thực tế từ học viên và khách hàng đã triển khai hệ thống.</p>
      </div>

      {caseStudies.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-gray-50 p-10 text-center text-sm text-gray-700">
          <p className="font-semibold text-gray-900">Chưa có Case Study nào được đăng.</p>
          <p className="mx-auto mt-2 max-w-md">
            Không phải vì chưa ai đạt được kết quả — mỗi Case Study cần thời gian thu thập số liệu thật và
            sự đồng ý của người trong câu chuyện trước khi đăng công khai. Trong lúc chờ, Nhật ký học tập
            cũng ghi lại những kết quả thực tế, chỉ chưa được biên tập thành case study đầy đủ.
          </p>
          <a href="/portal/nhatkyhoctap" className="mt-4 inline-block text-sm font-semibold text-brand-blue hover:underline">
            Xem Nhật ký học tập →
          </a>
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

      {/* CKOS Navigation Audit — nhánh có dữ liệu trước đây không có gợi ý
       * bước tiếp theo ở cấp trang (chỉ có link ngoài tuỳ chọn per-card). */}
      {caseStudies.length > 0 && (
        <KnowledgeJourneyStrip
          title="Đọc xong Case Study, tiếp theo là gì?"
          steps={[
            { label: "Xem Lesson liên quan", description: "Học lại đúng kỹ năng đã tạo ra kết quả này.", href: "/portal/hetrithucai" },
            { label: "Thực hành ở Workspace", description: "Áp dụng cách làm tương tự vào việc của bạn.", href: "/portal/workspace" },
            { label: "Hỏi Companion", description: "Nhờ Companion gợi ý cách áp dụng vào tình huống của bạn.", href: "/portal/companion" },
          ]}
        />
      )}
    </div>
  );
}
