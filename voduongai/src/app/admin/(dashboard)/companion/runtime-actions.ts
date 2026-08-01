"use server";

/**
 * EPIC-CS-001 — Chat Runtime (lớp quản trị VẬN HÀNH Chat AI thật, khác
 * hẳn 10 tab CMS đã có ở `CompanionAdminShell.tsx` — những tab đó quản
 * CẤU HÌNH nội dung (persona/chiến lược hội thoại...), không đọc dữ liệu
 * runtime nào cả. File này CHỈ ĐỌC, không sửa/xoá dữ liệu hội thoại của
 * người dùng thật (`companion_conversations`/`companion_messages`).
 *
 * Dùng `getSupabaseAdmin()` (service-role) vì đây là góc nhìn ADMIN xem
 * TOÀN BỘ người dùng — khác hẳn `/portal/companion` (session client, RLS
 * `auth.uid() = user_id`, mỗi người chỉ thấy hội thoại của chính mình).
 */

import { requireAdmin } from "@/lib/admin/requireAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { checkAllProvidersHealth } from "@/ai/providers/provider-health-check";
import { listExecutions } from "@/ai/providers/provider-execution-log";
import { isAiConfigured } from "@/ai/agents/companion.agent";
import type { ProviderHealth } from "@/ai/providers/types";

const COMPANION_TASK_TYPE = "companion-chat";

export type CompanionRuntimeOverview = {
  aiConfigured: boolean;
  totalConversations: number;
  totalMessages: number;
  messagesLast24h: number;
  realProviderExecutions: number;
  mockProviderExecutions: number;
  failedExecutions: number;
};

export async function getCompanionRuntimeOverview(): Promise<CompanionRuntimeOverview | null> {
  const admin = await requireAdmin();
  if (!admin) return null;
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      aiConfigured: isAiConfigured(),
      totalConversations: 0,
      totalMessages: 0,
      messagesLast24h: 0,
      realProviderExecutions: 0,
      mockProviderExecutions: 0,
      failedExecutions: 0,
    };
  }

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [{ count: totalConversations }, { count: totalMessages }, { count: messagesLast24h }] = await Promise.all([
    supabase.from("companion_conversations").select("id", { count: "exact", head: true }),
    supabase.from("companion_messages").select("id", { count: "exact", head: true }),
    supabase.from("companion_messages").select("id", { count: "exact", head: true }).gte("created_at", since24h),
  ]);

  const executions = listExecutions().filter((e) => e.taskType === COMPANION_TASK_TYPE);

  return {
    aiConfigured: isAiConfigured(),
    totalConversations: totalConversations ?? 0,
    totalMessages: totalMessages ?? 0,
    messagesLast24h: messagesLast24h ?? 0,
    realProviderExecutions: executions.filter((e) => !e.isMock).length,
    mockProviderExecutions: executions.filter((e) => e.isMock).length,
    failedExecutions: executions.filter((e) => !e.success).length,
  };
}

export type CompanionSessionRow = {
  id: string;
  title: string;
  updatedAt: string;
  userEmail: string | null;
  messageCount: number;
};

const SESSION_PAGE_SIZE = 50;

export async function listCompanionSessions(): Promise<CompanionSessionRow[]> {
  const admin = await requireAdmin();
  if (!admin) return [];
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data: conversations } = await supabase
    .from("companion_conversations")
    .select("id, title, updated_at, user_id")
    .order("updated_at", { ascending: false })
    .limit(SESSION_PAGE_SIZE);
  if (!conversations || conversations.length === 0) return [];

  const userIds = Array.from(new Set(conversations.map((c) => c.user_id)));
  const { data: members } = await supabase.from("members").select("id, email").in("id", userIds);
  const emailById = new Map((members ?? []).map((m) => [m.id, m.email as string]));

  const conversationIds = conversations.map((c) => c.id);
  const { data: messageRows } = await supabase
    .from("companion_messages")
    .select("conversation_id")
    .in("conversation_id", conversationIds);
  const countByConversation = new Map<string, number>();
  for (const row of messageRows ?? []) {
    countByConversation.set(row.conversation_id, (countByConversation.get(row.conversation_id) ?? 0) + 1);
  }

  return conversations.map((c) => ({
    id: c.id,
    title: c.title,
    updatedAt: c.updated_at,
    userEmail: emailById.get(c.user_id) ?? null,
    messageCount: countByConversation.get(c.id) ?? 0,
  }));
}

export async function getCompanionProviderHealth(): Promise<ProviderHealth[]> {
  const admin = await requireAdmin();
  if (!admin) return [];
  return checkAllProvidersHealth();
}

export type CompanionExecutionRow = {
  providerId: string;
  success: boolean;
  isMock: boolean;
  latencyMs: number;
  error?: string;
  at: string;
};

export async function listCompanionExecutions(): Promise<CompanionExecutionRow[]> {
  const admin = await requireAdmin();
  if (!admin) return [];
  return listExecutions()
    .filter((e) => e.taskType === COMPANION_TASK_TYPE)
    .slice(-100)
    .reverse()
    .map((e) => ({ providerId: e.providerId, success: e.success, isMock: e.isMock, latencyMs: e.latencyMs, error: e.error, at: e.at }));
}
