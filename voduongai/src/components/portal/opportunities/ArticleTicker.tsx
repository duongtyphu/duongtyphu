import Image from "next/image";
import Link from "next/link";
import { GemCard } from "@/components/portal/ui/GemCard";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import type { EcosystemArticleRow } from "@/lib/portal/live-ecosystem-articles";

/**
 * "Cập nhật thông tin mới" — băng bài viết chạy liên tục phải→trái, dừng
 * lại khi chạm/hover (`.eco-article-marquee-track`, globals.css), bấm vào
 * 1 thẻ đi tới trang chi tiết. Component THUẦN HIỂN THỊ (không client hook
 * nào) — dùng chung cho cấp hệ sinh thái VÀ cấp dự án con, dùng chung cho
 * MỌI hệ sinh thái hiện có/tương lai qua `ecosystemSlug` (không hardcode).
 *
 * Danh sách được nhân đôi (`looped`) để loop liền mạch đúng animate
 * `-50%` — cùng kỹ thuật `.tools-marquee` (Landing) đã dùng.
 */
export function ArticleTicker({
  articles,
  ecosystemSlug,
  sectionId = "cap-nhat",
  eyebrow = "Bài viết",
  title = "Cập nhật thông tin mới",
}: {
  articles: EcosystemArticleRow[];
  ecosystemSlug: string;
  sectionId?: string;
  eyebrow?: string;
  title?: string;
}) {
  if (articles.length === 0) {
    return (
      <section id={sectionId}>
        <SectionHeader eyebrow={eyebrow} title={title} />
        <GemCard>
          <p className="text-sm text-gray-500">Chưa có bài viết nào ở đây, sẽ cập nhật khi có.</p>
        </GemCard>
      </section>
    );
  }

  const looped = articles.length > 1 ? [...articles, ...articles] : articles;

  return (
    <section id={sectionId}>
      <SectionHeader eyebrow={eyebrow} title={title} />
      <div className="eco-article-marquee">
        <div className="eco-article-marquee-track gap-4 py-1">
          {looped.map((a, i) => (
            <Link
              key={`${a.id}-${i}`}
              href={`/portal/duan-cohoi/${ecosystemSlug}/cap-nhat/${a.slug}`}
              className="group block w-64 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-token-sm transition hover:border-blue-300 hover:shadow-token-lg"
            >
              <div className="relative h-36 w-full bg-gray-100">
                {a.imageUrl ? (
                  <Image src={a.imageUrl} alt={a.title} fill sizes="256px" className="object-cover" />
                ) : null}
              </div>
              <div className="p-4">
                <p className="line-clamp-2 text-sm font-bold text-gray-900 transition group-hover:text-brand-blue">
                  {a.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
