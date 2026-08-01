import { SanctuaryBackground } from "@/components/portal/sanctuary/SanctuaryBackground";
import { CompanionChatShell } from "@/components/portal/companion/chat/CompanionChatShell";
import { listConversations, getConversationMessages } from "./actions";

/**
 * Companion Chat MVP — nâng cấp `/portal/companion` từ trang giới thiệu
 * (Presence tĩnh) thành không gian trò chuyện AI thật. Giữ nguyên khí
 * quyển thật của trang (`SanctuaryBackground`) — chỉ thay nội dung bên
 * trong. Bản Presence cũ (today's thought/memory/musing) đã được thay
 * thế hoàn toàn theo đúng phạm vi Sprint "Companion Chat MVP".
 */
export default async function CompanionChatPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const activeId = typeof params.c === "string" ? params.c : undefined;

  const [conversations, initialMessages] = await Promise.all([
    listConversations(),
    activeId ? getConversationMessages(activeId) : Promise.resolve([]),
  ]);

  return (
    <div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">
      <SanctuaryBackground />
      <div className="relative z-10 flex h-[calc(100vh-4rem)] flex-col md:h-[calc(100vh-5rem)]">
        <CompanionChatShell
          conversations={conversations}
          initialConversationId={activeId ?? null}
          initialMessages={initialMessages}
        />
      </div>
    </div>
  );
}
