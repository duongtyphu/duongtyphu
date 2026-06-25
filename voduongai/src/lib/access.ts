import { getSupabaseServer } from "@/lib/supabase-server";

type OrderItemColumn = "lesson_id" | "product_id" | "course_id";

export async function getPurchasedIds(column: OrderItemColumn): Promise<Set<string>> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return new Set();
  }

  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email;
  if (!email) return new Set();

  const { data } = await supabase
    .from("orders")
    .select(column)
    .eq("member_email", email)
    .eq("status", "confirmed")
    .not(column, "is", null);

  return new Set((data ?? []).map((row) => String(row[column as keyof typeof row])));
}
