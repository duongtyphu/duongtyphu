"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/requireAdmin";

// Schema v2, Bước 3 — 4 bảng CKOS taxonomy (typed, KHÔNG phải schema
// generic id/data/status/order) nên không đi qua
// /api/admin/collections/[table] — Server Actions riêng, cùng pattern
// case-studies/actions.ts. CHỈ tầng dữ liệu ở đợt này (Bước 8) — chưa có
// page.tsx, xem CLAUDE.md "Course Builder Bước 2" cho tiền lệ.
//
// `ckos_folders` là dữ liệu SỞ HỮU BỞI USER (folder cá nhân trong
// saved_items) — Admin chỉ liệt kê để đối chiếu, KHÔNG có create/update/
// delete (đúng nguyên tắc "transactions CHỈ ĐỌC trong admin" đã áp dụng
// cho các bảng per-user khác).

export type CkosCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  href: string | null;
  order: number;
};

export type CkosCategoryInput = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  order: number;
};

export async function listCkosCategories(): Promise<{ categories: CkosCategory[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { categories: [], configured: false };
  const { data } = await supabase
    .from("ckos_categories")
    .select("id, slug, name, description, icon, href, order")
    .order("order", { ascending: true });
  return { categories: data ?? [], configured: true };
}

export async function createCkosCategory(input: CkosCategoryInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };
  if (!input.slug.trim() || !input.name.trim()) return { error: "Vui lòng nhập slug và tên." };

  const { error } = await supabase.from("ckos_categories").insert({
    slug: input.slug.trim(),
    name: input.name.trim(),
    description: input.description.trim() || null,
    icon: input.icon.trim() || null,
    href: input.href.trim() || null,
    order: input.order,
  });
  if (error) return { error: "Không thể tạo danh mục, vui lòng thử lại." };

  revalidatePath("/admin/ckos/taxonomy");
  revalidatePath("/portal/ckos");
  return { error: null };
}

export async function updateCkosCategory(id: string, input: CkosCategoryInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase
    .from("ckos_categories")
    .update({
      slug: input.slug.trim(),
      name: input.name.trim(),
      description: input.description.trim() || null,
      icon: input.icon.trim() || null,
      href: input.href.trim() || null,
      order: input.order,
    })
    .eq("id", id);
  if (error) return { error: "Không thể lưu danh mục, vui lòng thử lại." };

  revalidatePath("/admin/ckos/taxonomy");
  revalidatePath("/portal/ckos");
  return { error: null };
}

export async function deleteCkosCategory(id: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("ckos_categories").delete().eq("id", id);
  if (error) return { error: "Không thể xoá danh mục, vui lòng thử lại." };

  revalidatePath("/admin/ckos/taxonomy");
  revalidatePath("/portal/ckos");
  return { error: null };
}

export type CkosTag = { id: string; slug: string; name: string };
export type CkosTagInput = { slug: string; name: string };

export async function listCkosTags(): Promise<{ tags: CkosTag[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { tags: [], configured: false };
  const { data } = await supabase.from("ckos_tags").select("id, slug, name").order("name", { ascending: true });
  return { tags: data ?? [], configured: true };
}

export async function createCkosTag(input: CkosTagInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };
  if (!input.slug.trim() || !input.name.trim()) return { error: "Vui lòng nhập slug và tên." };

  const { error } = await supabase.from("ckos_tags").insert({ slug: input.slug.trim(), name: input.name.trim() });
  if (error) return { error: "Không thể tạo thẻ, vui lòng thử lại." };

  revalidatePath("/admin/ckos/taxonomy");
  return { error: null };
}

export async function updateCkosTag(id: string, input: CkosTagInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase
    .from("ckos_tags")
    .update({ slug: input.slug.trim(), name: input.name.trim() })
    .eq("id", id);
  if (error) return { error: "Không thể lưu thẻ, vui lòng thử lại." };

  revalidatePath("/admin/ckos/taxonomy");
  return { error: null };
}

export async function deleteCkosTag(id: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("ckos_tags").delete().eq("id", id);
  if (error) return { error: "Không thể xoá thẻ, vui lòng thử lại." };

  revalidatePath("/admin/ckos/taxonomy");
  return { error: null };
}

export type CkosContentTag = { id: string; tag_id: string; content_type: string; content_id: string };
export type CkosContentTagInput = { tag_id: string; content_type: string; content_id: string };

export async function listCkosContentTags(contentType?: string): Promise<{ links: CkosContentTag[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { links: [], configured: false };
  let query = supabase.from("ckos_content_tags").select("id, tag_id, content_type, content_id");
  if (contentType) query = query.eq("content_type", contentType);
  const { data } = await query;
  return { links: data ?? [], configured: true };
}

export async function assignCkosTag(input: CkosContentTagInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };
  if (!input.tag_id || !input.content_type.trim() || !input.content_id.trim()) {
    return { error: "Vui lòng chọn đủ thẻ, loại nội dung và nội dung." };
  }

  const { error } = await supabase.from("ckos_content_tags").insert({
    tag_id: input.tag_id,
    content_type: input.content_type.trim(),
    content_id: input.content_id.trim(),
  });
  if (error) return { error: "Không thể gắn thẻ, vui lòng thử lại." };

  revalidatePath("/admin/ckos/taxonomy");
  return { error: null };
}

export async function removeCkosTagAssignment(id: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("ckos_content_tags").delete().eq("id", id);
  if (error) return { error: "Không thể gỡ thẻ, vui lòng thử lại." };

  revalidatePath("/admin/ckos/taxonomy");
  return { error: null };
}

export type CkosOccupation = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  order: number;
};

export type CkosOccupationInput = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  order: number;
};

export async function listCkosOccupations(): Promise<{ occupations: CkosOccupation[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { occupations: [], configured: false };
  const { data } = await supabase
    .from("ckos_occupations")
    .select("id, slug, name, description, icon, order")
    .order("order", { ascending: true });
  return { occupations: data ?? [], configured: true };
}

export async function createCkosOccupation(input: CkosOccupationInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };
  if (!input.slug.trim() || !input.name.trim()) return { error: "Vui lòng nhập slug và tên nghề nghiệp." };

  const { error } = await supabase.from("ckos_occupations").insert({
    slug: input.slug.trim(),
    name: input.name.trim(),
    description: input.description.trim() || null,
    icon: input.icon.trim() || null,
    order: input.order,
  });
  if (error) return { error: "Không thể tạo nghề nghiệp, vui lòng thử lại." };

  revalidatePath("/admin/ckos/taxonomy");
  return { error: null };
}

export async function updateCkosOccupation(id: string, input: CkosOccupationInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase
    .from("ckos_occupations")
    .update({
      slug: input.slug.trim(),
      name: input.name.trim(),
      description: input.description.trim() || null,
      icon: input.icon.trim() || null,
      order: input.order,
    })
    .eq("id", id);
  if (error) return { error: "Không thể lưu nghề nghiệp, vui lòng thử lại." };

  revalidatePath("/admin/ckos/taxonomy");
  return { error: null };
}

export async function deleteCkosOccupation(id: string) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("ckos_occupations").delete().eq("id", id);
  if (error) return { error: "Không thể xoá nghề nghiệp, vui lòng thử lại." };

  revalidatePath("/admin/ckos/taxonomy");
  return { error: null };
}

export type CkosFolder = { id: string; user_id: string; name: string; created_at: string };

export async function listCkosFolders(): Promise<{ folders: CkosFolder[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { folders: [], configured: false };
  const { data } = await supabase
    .from("ckos_folders")
    .select("id, user_id, name, created_at")
    .order("created_at", { ascending: false });
  return { folders: data ?? [], configured: true };
}
