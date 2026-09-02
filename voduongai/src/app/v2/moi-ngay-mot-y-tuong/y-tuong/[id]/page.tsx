import { notFound } from "next/navigation";

import { getLiveMnytAdjacentTopics, getLiveMnytRelatedTopics, getLiveMnytTopicById } from "@/lib/portal/live-mnyt";
import { getMnytStateBundle } from "@/lib/portal/mnyt-sync";
import { MnytDetailClient } from "@/components/v2/mnyt/MnytDetailClient";

/**
 * `/v2/moi-ngay-mot-y-tuong/y-tuong/[id]` — view "Chi tiết ý tưởng" (2/10,
 * mockup dòng 697-913). `getLiveMnytTopicById()` SELECT đầy đủ `content`
 * jsonb (5 bước: khái niệm/prompt/trắc nghiệm/áp dụng/tổng kết) — đúng
 * README "chỉ tải content đầy đủ khi mở 1 ý tưởng", khác `MnytTopicSummary`
 * nhẹ dùng cho lưới/danh sách.
 */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = await getLiveMnytTopicById(id);
  return { title: topic ? `${topic.title} | Mỗi ngày một ý tưởng` : "Mỗi ngày một ý tưởng | VO DUONG AI" };
}

export default async function MnytDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { id } = await params;
  const sp = await searchParams;
  const quickMode = sp.mode === "quick";

  const topic = await getLiveMnytTopicById(id);
  if (!topic) notFound();

  const [state, adjacent, related] = await Promise.all([
    getMnytStateBundle(),
    getLiveMnytAdjacentTopics(topic.day),
    getLiveMnytRelatedTopics(topic.categoryKey, topic.id, 3),
  ]);

  return (
    <MnytDetailClient
      lang={state.prefs.lang}
      topic={topic}
      quickMode={quickMode}
      prevTopic={adjacent.prev}
      nextTopic={adjacent.next}
      relatedTopics={related}
      isFavorite={state.favoriteIds.includes(topic.id)}
      alreadyCompleted={state.completedIds.includes(topic.id)}
      initialJournal={state.journal[topic.id] ?? ""}
      initialChecklist={state.checklist[topic.id] ?? [false, false, false]}
      signedIn={state.signedIn}
    />
  );
}
