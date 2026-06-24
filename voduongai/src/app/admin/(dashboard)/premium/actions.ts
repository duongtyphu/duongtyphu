"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

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

export async function deleteProduct(id: number) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY." };

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: "Không thể xoá sản phẩm, vui lòng thử lại." };

  revalidatePath("/admin/premium");
  return { error: null };
}
