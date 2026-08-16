import { getPremiumStatus } from "@/lib/v2/premium-access";
import { getConversationMessages, listConversations } from "@/app/portal/companion/actions";

import { NhatKyHoiThoaiClient } from "./NhatKyHoiThoaiClient";

export const metadata = { title: "Nhật ký hội thoại | VO DUONG AI" };

/**
 * `/v2/nhat-ky-hoi-thoai` — Bước F. Danh sách hội thoại + nội dung hội thoại
 * đang chọn (query `?c=<id>`, cùng convention `/portal/companion` 1.0) đều
 * đọc qua đúng Server Action thật đã dùng ở `/v2/companion` — không viết
 * tầng dữ liệu mới.
 */
export default async function NhatKyHoiThoaiPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const requestedId = typeof params.c === "string" ? params.c : undefined;

  const [conversations, premium] = await Promise.all([listConversations(), getPremiumStatus()]);
  const activeId = requestedId ?? conversations[0]?.id ?? null;
  const messages = activeId ? await getConversationMessages(activeId) : [];

  return <NhatKyHoiThoaiClient premium={premium} conversations={conversations} activeId={activeId} initialMessages={messages} />;
}
