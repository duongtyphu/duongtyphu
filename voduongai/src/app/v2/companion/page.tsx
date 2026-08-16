import { getLiveBlogPosts } from "@/lib/portal/live-blog";
import { getPremiumStatus } from "@/lib/v2/premium-access";
import { getConversationMessages, listConversations } from "@/app/portal/companion/actions";

import { CompanionClient } from "./CompanionClient";

export const metadata = { title: "Companion AI | VO DUONG AI" };

/**
 * `/v2/companion` — Bước F. Server Component: tải cuộc trò chuyện GẦN NHẤT
 * của user (nếu có, qua Server Action THẬT `listConversations()`/
 * `getConversationMessages()` đã có sẵn từ Companion Chat MVP 1.0 — tái sử
 * dụng nguyên vẹn, không viết lại tầng dữ liệu) + 2 bài viết mới nhất làm
 * gợi ý + trạng thái Premium.
 */
export default async function CompanionPage() {
  const [conversations, blogPosts, premium] = await Promise.all([
    listConversations(),
    getLiveBlogPosts(),
    getPremiumStatus(),
  ]);

  const latestConversationId = conversations[0]?.id ?? null;
  const initialMessages = latestConversationId ? await getConversationMessages(latestConversationId) : [];

  return (
    <CompanionClient
      premium={premium}
      initialConversationId={latestConversationId}
      initialMessages={initialMessages}
      suggestedPosts={blogPosts.slice(0, 2)}
    />
  );
}
