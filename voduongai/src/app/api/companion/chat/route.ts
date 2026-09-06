import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import { providerManager } from "@/ai/providers/provider-manager";
import { COMPANION_MESSAGE_MAX_LENGTH, buildConversationTitle, type CompanionHistoryItem } from "@/lib/portal/companion-chat";
import { runCompanionRuntimeEngine } from "@/ai/runtime/companion-runtime-engine";
import { buildCompanionPrompt } from "@/ai/runtime/companion-prompt-builder";
import { buildPublicChatResponse } from "@/ai/runtime/public-chat-response";
import type { RuntimeConversation } from "@/ai/runtime/runtime-context";
import { publishedCatalogProvider } from "@/ai/catalog/catalog-provider";
import { getCompanionMissionContext } from "@/lib/portal/live-companion-mission";
import { COMPANION_PORTAL_KNOWLEDGE_V2 } from "@/ai/prompts/companion-portal-knowledge.prompt";
import { getCompanionLearnerMemory } from "@/lib/portal/companion/learner-memory";

/**
 * Companion Chat MVP — API DUY NHẤT gửi/nhận tin nhắn thật ở
 * `/portal/companion`. Khác hẳn `/api/ai/companion` (Companion Studio™,
 * viết nội dung cho Admin) — không liên quan, không tái dùng.
 *
 * SPRINT R01 — Runtime Integration: route.ts CHỈ còn 4 nhiệm vụ — validate
 * request, gọi `CompanionRuntimeEngine` (dựng `RuntimeContext` từ toàn bộ
 * Companion Brain A02-A06), gọi `ProviderManager`, trả response. Toàn bộ
 * Goal/Memory/Platform/Knowledge Logic đã chuyển vào
 * `src/ai/runtime/companion-runtime-engine.ts` — route.ts KHÔNG còn gọi
 * thẳng bất kỳ module `ai/mentor`/`ai/platform`/`ai/knowledge`/`ai/memory`
 * nào.
 *
 * SPRINT R01-FIX — Runtime Boundary & Public Response: `RuntimeContext`
 * (goal/strategy/learningPlan/knowledgeRouting/memory/reflection) và
 * `prompt` là DỮ LIỆU NỘI BỘ, không bao giờ đi vào response public. Response
 * cuối cùng luôn đi qua `buildPublicChatResponse()`
 * (`@/ai/runtime/public-chat-response`) — hàm đó không nhận
 * `RuntimeContext`/`RuntimeResponse` làm tham số nên không có đường nào rò
 * rỉ, kể cả vô ý. Contract public giữ nguyên đúng 4 field đã có từ trước
 * R01: `conversationId`, `userMessage`, `assistantMessage`, `isMock`.
 *
 * SPRINT R02 — CKOS & Platform Data Integration: Runtime Engine giờ trả
 * thêm `mentorContext` (tri thức Published/đã kiểm tra quyền, chỉ
 * metadata) — truyền vào `buildCompanionPrompt()` cùng `runtimeContext`.
 * route.ts KHÔNG tự đọc CKOS/Catalog/Supabase cho mục đích này.
 *
 * SPRINT FIX-R02 — Published Knowledge Adapter: route.ts giờ gọi
 * `publishedCatalogProvider.getCatalog()` (`ai/catalog/catalog-provider.ts`)
 * TRƯỚC khi gọi Engine — Catalog không còn luôn `[]` như giới hạn đã biết
 * ở R02. route.ts vẫn KHÔNG tự query Supabase cho việc này — Provider nội
 * bộ dùng lại các hàm `getLive*()` (Published/Live layer) đã có sẵn của dự
 * án, không phải 1 query mới do route.ts viết ra.
 *
 * Không streaming (kiến trúc Provider Layer hiện tại chỉ trả JSON đầy đủ,
 * không có SDK/stream nào cài sẵn — đúng phạm vi Sprint cho phép).
 *
 * PORTAL 2.0, GIAI ĐOẠN 2 — Sứ mệnh Companion vào system prompt: gọi thêm
 * `getCompanionMissionContext()` (song song với Catalog) rồi truyền vào
 * `buildCompanionPrompt()` làm tham số thứ 5 — Companion giờ "biết" đúng
 * Sứ mệnh/Triết lý/Điều lệ/Bộ gene/Hành trình tiến hoá/Dòng thời gian đã
 * Publish ở `/portal/su-menh-companion`, thay vì persona chung chung
 * trước đây. Ảnh hưởng CẢ `/portal/companion` (1.0) lẫn `/v2/companion`
 * (2.0) — cả 2 gọi chung route này (Single Source of Truth).
 *
 * PORTAL 2.0, GIAI ĐOẠN 9 — Companion nổi (Widget), "Companion phải nắm rõ
 * và hiểu rõ nhất để định hướng cho người dùng": truyền thêm hằng số tĩnh
 * `COMPANION_PORTAL_KNOWLEDGE_V2` (bản đồ route/tính năng THẬT đã xây ở
 * `/v2/*`, xem `ai/prompts/companion-portal-knowledge.prompt.ts`) làm tham
 * số thứ 6 của `buildCompanionPrompt()` — khác `missionContext` (đọc DB,
 * Admin-editable), khối này do người viết code duy trì, không đổi theo
 * từng request nên không cần round-trip Supabase riêng.
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

  if (!activeConversationId) {
    return NextResponse.json({ error: "Không thể xác định cuộc trò chuyện." }, { status: 500 });
  }

  // Runtime Engine: Conversation → Goal Detection → Learning Plan →
  // Conversation Strategy → Platform Intelligence → Knowledge Routing →
  // Memory Pipeline → Reflection → RuntimeContext (Companion Brain A02-A06).
  const runtimeConversation: RuntimeConversation = {
    turns: [...history, { role: "user", content: trimmedMessage }],
  };
  const [catalog, missionContext, learnerMemoryContext] = await Promise.all([
    publishedCatalogProvider.getCatalog(),
    getCompanionMissionContext(),
    getCompanionLearnerMemory(supabase, user.id),
  ]);
  const { context: runtimeContext, mentorContext } = runCompanionRuntimeEngine({
    conversationId: activeConversationId,
    conversation: runtimeConversation,
    catalog,
  });

  const { prompt } = buildCompanionPrompt(
    runtimeContext,
    mentorContext,
    history,
    trimmedMessage,
    missionContext,
    COMPANION_PORTAL_KNOWLEDGE_V2,
    learnerMemoryContext
  );

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

  // R01-FIX — response public đi qua đúng 1 ranh giới duy nhất, không
  // nhận RuntimeContext làm tham số nên không thể vô tình trả thêm field
  // nội bộ nào ra ngoài (xem `public-chat-response.ts`).
  //
  // GIAI ĐOẠN 2, mục 2a — chỉ tính SẴN 1 projection hẹp {content, type}
  // (KHÔNG cả `MemoryDecision`/`RuntimeContext`) ngay tại route.ts (nơi
  // DUY NHẤT được phép đọc `runtimeContext.memory`), rồi mới truyền vào
  // `buildPublicChatResponse()` qua đúng field đã khai báo tường minh.
  const memorySuggestion =
    runtimeContext.memory.decision.status === "keep" && runtimeContext.memory.decision.candidate
      ? {
          content: runtimeContext.memory.decision.candidate.content,
          type: runtimeContext.memory.decision.candidate.type,
        }
      : null;

  return NextResponse.json(
    buildPublicChatResponse({
      conversationId: activeConversationId,
      userMessage,
      assistantMessage,
      isMock,
      memorySuggestion,
    })
  );
}
