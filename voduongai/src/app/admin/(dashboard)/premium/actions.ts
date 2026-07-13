"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { PREMIUM_PROGRAMS } from "@/components/portal/premium/premium-programs";

export type Product = {
  id: number;
  title: string;
  description: string | null;
  type: string;
  icon: string | null;
  price: number;
  video_url: string | null;
  pdf_url: string | null;
  active: boolean;
  created_at: string;
};

export type ProductInput = {
  title: string;
  description: string;
  type: string;
  icon: string;
  price: number;
  video_url: string;
  pdf_url: string;
  active: boolean;
};

export async function listProducts(): Promise<{ products: Product[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { products: [], configured: false };

  const { data } = await supabase
    .from("products")
    .select("id, title, description, type, icon, price, video_url, pdf_url, active, created_at")
    .order("created_at", { ascending: false });

  return { products: data ?? [], configured: true };
}

export async function createProduct(input: ProductInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("products").insert({
    title: input.title,
    description: input.description || null,
    type: input.type,
    icon: input.icon || null,
    price: input.price,
    video_url: input.video_url || null,
    pdf_url: input.pdf_url || null,
    active: input.active,
  });
  if (error) return { error: "Không thể tạo sản phẩm, vui lòng thử lại." };

  revalidatePath("/admin/premium");
  return { error: null };
}

export async function updateProduct(id: number, input: ProductInput) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase
    .from("products")
    .update({
      title: input.title,
      description: input.description || null,
      type: input.type,
      icon: input.icon || null,
      price: input.price,
      video_url: input.video_url || null,
      pdf_url: input.pdf_url || null,
      active: input.active,
    })
    .eq("id", id);
  if (error) return { error: "Không thể lưu sản phẩm, vui lòng thử lại." };

  revalidatePath("/admin/premium");
  return { error: null };
}

export type ProgramRegistryRow = {
  key: string;
  name: string;
  matched: boolean;
  courseId: number | null;
  price: number | null;
  listPrice: number;
  status: string | null;
  lessonCount: number;
};

/**
 * Premium Program Registry (Task 2, PREMIUM-SPR-701) — đúng 6 chương
 * trình Founder xác nhận, đối chiếu trực tiếp với `courses` bằng cùng
 * logic khớp tên (`matchPatterns`) mà /portal/premium/page.tsx dùng để
 * hiển thị giá/trạng thái thật — không suy diễn.
 */
export async function listProgramRegistry(): Promise<{ programs: ProgramRegistryRow[]; configured: boolean }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { programs: [], configured: false };

  const { data } = await supabase.from("courses").select("id, name, status, price");
  const courses = data ?? [];

  const programs: ProgramRegistryRow[] = PREMIUM_PROGRAMS.map((p) => {
    const row = courses.find((c) => p.matchPatterns.some((pattern) => c.name.toLowerCase().includes(pattern)));
    return {
      key: p.key,
      name: p.name,
      matched: !!row,
      courseId: row?.id ?? null,
      price: row?.price ?? null,
      listPrice: p.listPrice,
      status: row?.status ?? null,
      lessonCount: p.lessonCount,
    };
  });

  return { programs, configured: true };
}

export async function deleteProduct(id: number) {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: "Không thể xoá sản phẩm, vui lòng thử lại." };

  revalidatePath("/admin/premium");
  return { error: null };
}
