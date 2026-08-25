import { getPremiumStatus } from "@/lib/v2/premium-access";
import { getConversationMessages, listConversations } from "@/app/portal/companion/actions";
import { getCompanionFavoriteTools } from "@/lib/portal/live-companion-favorites";
import { getAcademyProgress } from "@/lib/portal/live-academy";

import { CompanionClient } from "./CompanionClient";

export const metadata = { title: "Companion AI | VO DUONG AI" };

/**
 * `/v2/companion` — Bước F. Server Component: tải cuộc trò chuyện GẦN NHẤT
 * của user (nếu có, qua Server Action THẬT `listConversations()`/
 * `getConversationMessages()` đã có sẵn từ Companion Chat MVP 1.0 — tái sử
 * dụng nguyên vẹn, không viết lại tầng dữ liệu) + trạng thái Premium + tiến
 * độ học thật (`getAcademyProgress()`, dùng cho vòng tròn "Hồ sơ của bạn" —
 * task #60).
 *
 * Task #62 — "Companion gợi ý cho bạn" đổi từ 2 bài Blog AI (đã bỏ hẳn
 * `getLiveBlogPosts()`) sang gợi ý tĩnh tới các mục khác trong Portal 2.0
 * (xem `INTERNAL_SUGGESTIONS` trong `CompanionClient.tsx`) — không cần dữ
 * liệu server nào thêm.
 *
 * Giai đoạn 2, mục 2c: "Công cụ yêu thích" giờ động theo cuộc trò chuyện
 * gần nhất (`getCompanionFavoriteTools()`, xem docblock trong file đó) —
 * gọi SAU khi đã có `latestConversationId`/`initialMessages` nên không thể
 * gộp vào `Promise.all()` đầu tiên.
 */
export default async function CompanionPage() {
  const [conversations, premium, academyProgress] = await Promise.all([
    listConversations(),
    getPremiumStatus(),
    getAcademyProgress(),
  ]);

  const latestConversationId = conversations[0]?.id ?? null;
  const initialMessages = latestConversationId ? await getConversationMessages(latestConversationId) : [];
  const favoriteTools = await getCompanionFavoriteTools(latestConversationId, initialMessages);

  return (
    <CompanionClient
      premium={premium}
      initialConversationId={latestConversationId}
      initialMessages={initialMessages}
      academyProgress={academyProgress}
      favoriteTools={favoriteTools}
    />
  );
}
