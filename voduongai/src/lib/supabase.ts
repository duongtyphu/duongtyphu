import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

/**
 * Client anon-key, KHÔNG phụ thuộc cookies() (`next/headers`) — dùng cho
 * đọc công khai (RLS "public read published") ở những nơi không có request
 * context thật, vd. generateStaticParams() (chạy lúc build, không phải
 * trong 1 request). getSupabaseServer() gọi cookies() nên sẽ crash nếu gọi
 * từ generateStaticParams — dùng hàm này thay thế cho mọi đọc công khai
 * không cần phiên đăng nhập người dùng.
 */
export function getSupabasePublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}
