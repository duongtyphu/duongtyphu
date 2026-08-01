"use server";

import { getSupabaseServer } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

const MESSAGE_PAGE_SIZE = 50;
const TITLE_MAX_LENGTH = 100;

/** Guard giống `getAffiliateOverview()` (`live-affiliate.ts`) — sandbox/môi
    trường chưa cấu hình Supabase KHÔNG được làm crash cả trang, chỉ trả
    `null` (xử lý như "chưa đăng nhập" trung thực) thay vì throw. */
async function requireUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  return { supabase, user: data.user };
}

export type CompanionConversationSummary = {
  id: string;
  title: string;
  updatedAt: string;
};

export async function listConversations(): Promise<CompanionConversationSummary[]> {
  const session = await requireUser();
  if (!session) return [];
  const { supabase, user } = session;

  const { data } = await supabase
    .from("companion_conversations")
    .select("id, title, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (data ?? []).map((c) => ({ id: c.id, title: c.title, updatedAt: c.updated_at }));
}

export type CompanionMessageRow = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
};

export async function getConversationMessages(conversationId: string): Promise<CompanionMessageRow[]> {
  const session = await requireUser();
  if (!session || !conversationId) return [];
  const { supabase, user } = session;

  const { data } = await supabase
    .from("companion_messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(MESSAGE_PAGE_SIZE);

  return (data ?? []).map((m) => ({ id: m.id, role: m.role, content: m.content, createdAt: m.created_at }));
}

export async function renameConversation(conversationId: string, title: string): Promise<{ error: string | null }> {
  const session = await requireUser();
  if (!session) return { error: "Bạn cần đăng nhập." };
  const { supabase, user } = session;

  const clean = title.replace(/\s+/g, " ").trim().slice(0, TITLE_MAX_LENGTH);
  if (!clean) return { error: "Tên cuộc trò chuyện không được để trống." };

  const { error } = await supabase
    .from("companion_conversations")
    .update({ title: clean })
    .eq("id", conversationId)
    .eq("user_id", user.id);

  if (error) return { error: "Không thể đổi tên cuộc trò chuyện." };
  revalidatePath("/portal/companion");
  return { error: null };
}

export async function deleteConversation(conversationId: string): Promise<{ error: string | null }> {
  const session = await requireUser();
  if (!session) return { error: "Bạn cần đăng nhập." };
  const { supabase, user } = session;

  const { error } = await supabase
    .from("companion_conversations")
    .delete()
    .eq("id", conversationId)
    .eq("user_id", user.id);

  if (error) return { error: "Không thể xoá cuộc trò chuyện." };
  revalidatePath("/portal/companion");
  return { error: null };
}
