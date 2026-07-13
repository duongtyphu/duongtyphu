"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/requireAdmin";

// Phase F.2 — dedicated typed CRUD for `case_studies` (the table
// /portal/case-studies and the search index actually read), replacing the
// generic jsonb CrudPage/ContentManager path that was writing to the legacy
// `case_study` table instead. Pattern mirrors app/admin/(dashboard)/premium/actions.ts.

export type CaseStudy = {
  id: number;
  title: string;
  slug: string | null;
  client_name: string | null;
  summary: string | null;
  body: string | null;
  result_metric: string | null;
  thumbnail_url: string | null;
  link_url: string | null;
  active: boolean;
  featured: boolean;
  published_at: string | null;
  created_at: string;
};

export type CaseStudyInput = {
  title: string;
  slug: string;
  client_name: string;
  summary: string;
  body: string;
  result_metric: string;
  thumbnail_url: string;
  link_url: string;
  active: boolean;
  featured: boolean;
  published_at: string;
};

export async function listCaseStudies(): Promise<{ caseStudies: CaseStudy[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { caseStudies: [], configured: false };

  const { data } = await supabase
    .from("case_studies")
    .select("id, title, slug, client_name, summary, body, result_metric, thumbnail_url, link_url, active, featured, published_at, created_at")
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
    slug: input.slug.trim() || null,
    client_name: input.client_name.trim() || null,
    summary: input.summary.trim() || null,
    body: input.body.trim() || null,
    result_metric: input.result_metric.trim() || null,
    thumbnail_url: input.thumbnail_url.trim() || null,
    link_url: input.link_url.trim() || null,
    active: input.active,
    featured: input.featured,
    published_at: input.published_at || null,
  });
  if (error) return { error: "Không thể tạo case study, vui lòng thử lại." };

  revalidatePath("/admin/case-study");
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
      slug: input.slug.trim() || null,
      client_name: input.client_name.trim() || null,
      summary: input.summary.trim() || null,
      body: input.body.trim() || null,
      result_metric: input.result_metric.trim() || null,
      thumbnail_url: input.thumbnail_url.trim() || null,
      link_url: input.link_url.trim() || null,
      active: input.active,
      featured: input.featured,
      published_at: input.published_at || null,
    })
    .eq("id", id);
  if (error) return { error: "Không thể lưu case study, vui lòng thử lại." };

  revalidatePath("/admin/case-study");
  revalidatePath("/portal/case-studies");
  return { error: null };
}

export async function deleteCaseStudy(id: number) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("case_studies").delete().eq("id", id);
  if (error) return { error: "Không thể xoá case study, vui lòng thử lại." };

  revalidatePath("/admin/case-study");
  revalidatePath("/portal/case-studies");
  return { error: null };
}
