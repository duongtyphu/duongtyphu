"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/requireAdmin";

// Schema v2, Bước 7 — bảng `knowledge_assets` (typed, không qua
// /api/admin/collections/[table] — content jsonb lồng nhiều tầng, "id" là
// slug-độc-lập uuid chứ không phải id client tự đặt như schema generic).
// CHỈ tầng dữ liệu ở đợt này (Bước 8) — chưa có page.tsx/editor cho
// `content` jsonb (dna/relationship/growth/system, xem
// supabase-phase34-knowledge-assets.sql) — việc đó cần 1 editor riêng
// cho cấu trúc lồng, ngoài phạm vi Bước 8. `updateKnowledgeAssetContent()`
// cho phép ghi thẳng object `content` đầy đủ (Admin/tool khác tự dựng
// form sau) mà không giả định trước hình dạng field nào.
//
// `slug` KHÔNG được sửa qua `updateKnowledgeAssetMeta()` — 69 điểm tham
// chiếu từ `knowledge_seeds.steps[].assetId` phụ thuộc trực tiếp vào giá
// trị này (xem đối chiếu ở supabase-phase34-knowledge-assets.sql); đổi
// slug là gãy liên kết Lesson→Asset. Muốn đổi slug là quyết định riêng,
// cần rà lại toàn bộ 69 tham chiếu trước.

const KNOWLEDGE_TYPES = [
  "ARTICLE", "GUIDE", "PROMPT", "CHECKLIST", "TEMPLATE", "FRAMEWORK",
  "SOP", "PLAYBOOK", "WORKFLOW", "CASE_STUDY", "VIDEO", "PDF", "FAQ",
  "EXERCISE", "REFLECTION", "ASSESSMENT", "CHEATSHEET", "MINDMAP",
] as const;

const KNOWLEDGE_STATUSES = ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"] as const;

export type KnowledgeAssetRow = {
  id: string;
  slug: string;
  type: string;
  title: string;
  summary: string | null;
  status: string;
  updated_at: string;
};

export type KnowledgeAssetDetail = KnowledgeAssetRow & { content: Record<string, unknown>; created_at: string };

export type KnowledgeAssetMetaInput = {
  type: string;
  title: string;
  summary: string;
  status: string;
};

export async function listKnowledgeAssets(): Promise<{ assets: KnowledgeAssetRow[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { assets: [], configured: false };
  const { data } = await supabase
    .from("knowledge_assets")
    .select("id, slug, type, title, summary, status, updated_at")
    .order("updated_at", { ascending: false });
  return { assets: data ?? [], configured: true };
}

export async function getKnowledgeAsset(id: string): Promise<{ asset: KnowledgeAssetDetail | null; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { asset: null, configured: false };
  const { data } = await supabase
    .from("knowledge_assets")
    .select("id, slug, type, title, summary, status, content, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();
  return { asset: data, configured: true };
}

export async function updateKnowledgeAssetMeta(id: string, input: KnowledgeAssetMetaInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };
  if (!input.title.trim()) return { error: "Vui lòng nhập tiêu đề." };
  if (!(KNOWLEDGE_TYPES as readonly string[]).includes(input.type)) return { error: "Loại tri thức không hợp lệ." };
  if (!(KNOWLEDGE_STATUSES as readonly string[]).includes(input.status)) return { error: "Trạng thái không hợp lệ." };

  const { error } = await supabase
    .from("knowledge_assets")
    .update({
      type: input.type,
      title: input.title.trim(),
      summary: input.summary.trim() || null,
      status: input.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { error: "Không thể lưu tri thức, vui lòng thử lại." };

  revalidatePath("/admin/ckos/knowledge-assets");
  revalidatePath("/portal/hetrithucai");
  return { error: null };
}

export async function updateKnowledgeAssetContent(id: string, content: Record<string, unknown>) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase
    .from("knowledge_assets")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: "Không thể lưu nội dung tri thức, vui lòng thử lại." };

  revalidatePath("/admin/ckos/knowledge-assets");
  revalidatePath("/portal/hetrithucai");
  return { error: null };
}
