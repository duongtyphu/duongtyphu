"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/requireAdmin";

// "Tài liệu" — bảng `documents` (typed, KHÔNG phải schema generic
// id/data/status/order) nên không đi qua /api/admin/collections/[table] —
// cùng lý do/pattern với `case_studies`/`coupons`. ĐÍNH CHÍNH phạm vi so
// với ghi chú gốc của nav item này (từng mô tả "đọc lại file Markdown
// trong docs/ ngay trong Admin" — ý tưởng chưa từng có gì backing thật):
// audit phát hiện bảng `documents` (title/description/url/icon/bg_color/
// display_order/active) đã tồn tại + có DỮ LIỆU THẬT (4 dòng) + đã được
// `/portal/resources` ("Tài nguyên miễn phí" → khối "Tài liệu từ VO DUONG
// AI Academy") đọc thật — nhưng CHƯA từng có Admin UI. Vì đây là gap thật
// có giá trị cao hơn hẳn ý tưởng "đọc file Markdown", ưu tiên xây CRUD cho
// đúng bảng này thay vì ý tưởng gốc.

export type PortalDocument = {
  id: number;
  title: string;
  description: string | null;
  url: string | null;
  icon: string | null;
  bg_color: string | null;
  display_order: number;
  active: boolean;
  created_at: string;
};

export type PortalDocumentInput = {
  title: string;
  description: string;
  url: string;
  icon: string;
  bg_color: string;
  display_order: number;
  active: boolean;
};

export async function listDocuments(): Promise<{ documents: PortalDocument[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { documents: [], configured: false };

  const { data } = await supabase
    .from("documents")
    .select("id, title, description, url, icon, bg_color, display_order, active, created_at")
    .order("display_order", { ascending: true });

  return { documents: (data ?? []) as PortalDocument[], configured: true };
}

export async function createDocument(input: PortalDocumentInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };
  if (!input.title.trim()) return { error: "Vui lòng nhập tiêu đề." };

  const { error } = await supabase.from("documents").insert({
    title: input.title.trim(),
    description: input.description.trim() || null,
    url: input.url.trim() || "#",
    icon: input.icon.trim() || "📄",
    bg_color: input.bg_color.trim() || "#EEF4FF",
    display_order: input.display_order,
    active: input.active,
  });
  if (error) return { error: "Không thể tạo tài liệu, vui lòng thử lại." };

  revalidatePath("/admin/thuong-hieu-media/tai-lieu");
  revalidatePath("/portal/resources");
  return { error: null };
}

export async function updateDocument(id: number, input: PortalDocumentInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase
    .from("documents")
    .update({
      title: input.title.trim(),
      description: input.description.trim() || null,
      url: input.url.trim() || "#",
      icon: input.icon.trim() || "📄",
      bg_color: input.bg_color.trim() || "#EEF4FF",
      display_order: input.display_order,
      active: input.active,
    })
    .eq("id", id);
  if (error) return { error: "Không thể lưu tài liệu, vui lòng thử lại." };

  revalidatePath("/admin/thuong-hieu-media/tai-lieu");
  revalidatePath("/portal/resources");
  return { error: null };
}

export async function deleteDocument(id: number) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) return { error: "Không thể xoá tài liệu, vui lòng thử lại." };

  revalidatePath("/admin/thuong-hieu-media/tai-lieu");
  revalidatePath("/portal/resources");
  return { error: null };
}
