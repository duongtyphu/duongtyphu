import { getLiveBlogPosts } from "@/lib/portal/live-blog";
import { getPremiumStatus } from "@/lib/v2/premium-access";
import { getConversationMessages, listConversations } from "@/app/portal/companion/actions";
import { getCompanionFavoriteTools } from "@/lib/portal/live-companion-favorites";

import { CompanionClient } from "./CompanionClient";

export const metadata = { title: "Companion AI | VO DUONG AI" };

/**
 * `/v2/companion` — Bước F. Server Component: tải cuộc trò chuyện GẦN NHẤT
 * của user (nếu có, qua Server Action THẬT `listConversations()`/
 * `getConversationMessages()` đã có sẵn từ Companion Chat MVP 1.0 — tái sử
 * dụng nguyên vẹn, không viết lại tầng dữ liệu) + 2 bài viết mới nhất làm
 * gợi ý + trạng thái Premium.
 *
 * Giai đoạn 2, mục 2c: "Công cụ yêu thích" giờ động theo cuộc trò chuyện
 * gần nhất (`getCompanionFavoriteTools()`, xem docblock trong file đó) —
 * gọi SAU khi đã có `latestConversationId`/`initialMessages` nên không thể
 * gộp vào `Promise.all()` đầu tiên.
 */
export default async function CompanionPage() {
  const [conversations, blogPosts, premium] = await Promise.all([
    listConversations(),
    getLiveBlogPosts(),
    getPremiumStatus(),
  ]);

  const latestConversationId = conversations[0]?.id ?? null;
  const initialMessages = latestConversationId ? await getConversationMessages(latestConversationId) : [];
  const favoriteTools = await getCompanionFavoriteTools(latestConversationId, initialMessages);

  return (
    <CompanionClient
      premium={premium}
      initialConversationId={latestConversationId}
      initialMessages={initialMessages}
      suggestedPosts={blogPosts.slice(0, 2)}
      favoriteTools={favoriteTools}
    />
  );
}
