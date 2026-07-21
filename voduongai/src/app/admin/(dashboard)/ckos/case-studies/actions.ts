"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/requireAdmin";

// Case Study — bảng `case_studies` (typed, KHÔNG phải schema generic
// id/data/status/order) nên không đi qua /api/admin/collections/[table].
// Trimmed đúng 7 field LIVE THẬT trên bảng (xác nhận qua
// information_schema.columns, xem CLAUDE.md "Case Study") —
// slug/body/featured/published_at (Phase F) và status/tags/... (Phase G)
// CHƯA tồn tại trên bảng thật, không đưa vào đây.

export type CaseStudy = {
  id: number;
  title: string;
  client_name: string | null;
  summary: string | null;
  result_metric: string | null;
  thumbnail_url: string | null;
  link_url: string | null;
  active: boolean;
  created_at: string;
};

export type CaseStudyInput = {
  title: string;
  client_name: string;
  summary: string;
  result_metric: string;
  thumbnail_url: string;
  link_url: string;
  active: boolean;
};

export async function listCaseStudies(): Promise<{ caseStudies: CaseStudy[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { caseStudies: [], configured: false };

  const { data } = await supabase
    .from("case_studies")
    .select("id, title, client_name, summary, result_metric, thumbnail_url, link_url, active, created_at")
    .order("created_at", { ascending: false });

  return { caseStudies: data ?? [], configured: true };
}

export async function createCaseStudy(input: CaseStudyInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  if (!input.title.trim()) return { error: "Vui lòng nhập tiêu đề." };

  const { error } = await supabase.from("case_studies").insert({
    title: input.title.trim(),
    client_name: input.client_name.trim() || null,
    summary: input.summary.trim() || null,
    result_metric: input.result_metric.trim() || null,
    thumbnail_url: input.thumbnail_url.trim() || null,
    link_url: input.link_url.trim() || null,
    active: input.active,
  });
  if (error) return { error: "Không thể tạo case study, vui lòng thử lại." };

  revalidatePath("/admin/ckos/case-studies");
  revalidatePath("/portal/case-studies");
  return { error: null };
}

export async function updateCaseStudy(id: number, input: CaseStudyInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase
    .from("case_studies")
    .update({
      title: input.title.trim(),
      client_name: input.client_name.trim() || null,
      summary: input.summary.trim() || null,
      result_metric: input.result_metric.trim() || null,
      thumbnail_url: input.thumbnail_url.trim() || null,
      link_url: input.link_url.trim() || null,
      active: input.active,
    })
    .eq("id", id);
  if (error) return { error: "Không thể lưu case study, vui lòng thử lại." };

  revalidatePath("/admin/ckos/case-studies");
  revalidatePath("/portal/case-studies");
  return { error: null };
}

export async function deleteCaseStudy(id: number) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("case_studies").delete().eq("id", id);
  if (error) return { error: "Không thể xoá case study, vui lòng thử lại." };

  revalidatePath("/admin/ckos/case-studies");
  revalidatePath("/portal/case-studies");
  return { error: null };
}
