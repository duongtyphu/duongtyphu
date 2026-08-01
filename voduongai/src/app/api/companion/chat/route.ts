import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import { providerManager } from "@/ai/providers/provider-manager";
import { COMPANION_CHAT_SYSTEM_PROMPT_V1 } from "@/ai/prompts/companion-chat.system.prompt";
import {
  COMPANION_MESSAGE_MAX_LENGTH,
  buildConversationTitle,
  buildCompanionChatPrompt,
  type CompanionHistoryItem,
} from "@/lib/portal/companion-chat";

/**
 * Companion Chat MVP — API DUY NHẤT gửi/nhận tin nhắn thật ở
 * `/portal/companion`. Khác hẳn `/api/ai/companion` (Companion Studio™,
 * viết nội dung cho Admin) — không liên quan, không tái dùng.
 *
 * Không streaming (kiến trúc Provider Layer hiện tại chỉ trả JSON đầy đủ,
 * không có SDK/stream nào cài sẵn — đúng phạm vi Sprint cho phép).
 */

const FRIENDLY_AI_ERROR = "Companion chưa thể phản hồi lúc này. Vui lòng thử lại.";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 400 });
  }

  const { conversationId, message } = body as { conversationId?: string; message?: string };
  const trimmedMessage = typeof message === "string" ? message.trim() : "";

  if (!trimmedMessage) {
    return NextResponse.json({ error: "Nội dung tin nhắn không được để trống." }, { status: 400 });
  }
  if (trimmedMessage.length > COMPANION_MESSAGE_MAX_LENGTH) {
    return NextResponse.json(
      { error: `Tin nhắn quá dài — tối đa ${COMPANION_MESSAGE_MAX_LENGTH} ký tự.` },
      { status: 400 }
    );
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Companion chưa sẵn sàng lúc này. Vui lòng thử lại sau." }, { status: 503 });
  }

  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) {
    return NextResponse.json({ error: "Bạn cần đăng nhập để trò chuyện với Companion." }, { status: 401 });
  }

  // Xác định (hoặc tạo) conversation — luôn xác nhận quyền sở hữu qua RLS
  // (query lọc theo user.id từ session, KHÔNG tin conversationId/user_id
  // gửi từ client).
  let activeConversationId = conversationId;
  let history: CompanionHistoryItem[] = [];

  if (activeConversationId) {
    const { data: conversation, error: convError } = await supabase
      .from("companion_conversations")
      .select("id")
      .eq("id", activeConversationId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (convError || !conversation) {
      return NextResponse.json(
        { error: "Cuộc trò chuyện không tồn tại hoặc bạn không có quyền truy cập." },
        { status: 404 }
      );
    }

    const { data: pastMessages } = await supabase
      .from("companion_messages")
      .select("role, content")
      .eq("conversation_id", activeConversationId)
      .order("created_at", { ascending: true })
      .limit(40);

    history = (pastMessages ?? []).filter(
      (m): m is CompanionHistoryItem => m.role === "user" || m.role === "assistant"
    );
  } else {
    const { data: newConversation, error: createError } = await supabase
      .from("companion_conversations")
      .insert({ user_id: user.id, title: buildConversationTitle(trimmedMessage) })
      .select("id")
      .single();

    if (createError || !newConversation) {
      return NextResponse.json({ error: "Không thể tạo cuộc trò chuyện mới. Vui lòng thử lại." }, { status: 500 });
    }
    activeConversationId = newConversation.id;
  }

  const { data: userMessage, error: userMessageError } = await supabase
    .from("companion_messages")
    .insert({
      conversation_id: activeConversationId,
      user_id: user.id,
      role: "user",
      content: trimmedMessage,
      status: "completed",
    })
    .select("id, role, content, created_at")
    .single();

  if (userMessageError || !userMessage) {
    return NextResponse.json({ error: "Không thể lưu tin nhắn. Vui lòng thử lại." }, { status: 500 });
  }

  const prompt = buildCompanionChatPrompt({
    systemPrompt: COMPANION_CHAT_SYSTEM_PROMPT_V1,
    history,
    userMessage: trimmedMessage,
  });

  let replyText = "";
  let isMock = false;

  try {
    if (!providerManager.hasAvailableRealProvider()) {
      isMock = true;
      replyText =
        "[MOCK — chưa cấu hình AI Provider thật nào (vd ANTHROPIC_API_KEY/OPENAI_API_KEY/GEMINI_API_KEY...)] Mình đã nhận được câu hỏi của bạn, nhưng Companion chưa được kết nối AI thật để trả lời đầy đủ. Founder cần cấu hình ít nhất 1 API key trước.";
    } else {
      const result = await providerManager.execute({
        capability: "growth.goal-coaching",
        taskType: "companion-chat",
        input: { prompt },
      });
      replyText = result.raw.trim();
      isMock = result.isMock;
    }
  } catch {
    // Không lưu message assistant rỗng ở trạng thái completed — trả lỗi
    // thân thiện, tin nhắn user vẫn đã lưu ở trên (không mất dữ liệu).
    await supabase.from("companion_conversations").update({ updated_at: new Date().toISOString() }).eq("id", activeConversationId);
    return NextResponse.json(
      { error: FRIENDLY_AI_ERROR, conversationId: activeConversationId, userMessage },
      { status: 502 }
    );
  }

  if (!replyText) {
    await supabase.from("companion_conversations").update({ updated_at: new Date().toISOString() }).eq("id", activeConversationId);
    return NextResponse.json(
      { error: FRIENDLY_AI_ERROR, conversationId: activeConversationId, userMessage },
      { status: 502 }
    );
  }

  const { data: assistantMessage, error: assistantError } = await supabase
    .from("companion_messages")
    .insert({
      conversation_id: activeConversationId,
      user_id: user.id,
      role: "assistant",
      content: replyText,
      status: "completed",
    })
    .select("id, role, content, created_at")
    .single();

  await supabase
    .from("companion_conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", activeConversationId);

  if (assistantError || !assistantMessage) {
    return NextResponse.json(
      { error: "Companion đã trả lời nhưng chưa thể lưu lại. Vui lòng tải lại trang.", conversationId: activeConversationId, userMessage },
      { status: 500 }
    );
  }

  return NextResponse.json({
    conversationId: activeConversationId,
    userMessage,
    assistantMessage,
    isMock,
  });
}
