import { headers } from "next/headers";

/**
 * Base URL của chính deployment đang chạy — không hardcode domain nào.
 * Trên Vercel (Preview lẫn Production), `VERCEL_URL` luôn đúng domain thật
 * của deployment hiện tại, tự khác nhau giữa các môi trường. Fallback (local
 * `next dev`/`next start`, hoặc self-host ngoài Vercel) suy ra từ header của
 * chính request đang xử lý.
 */
async function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "production" ? "https" : "http");
  return `${proto}://${host}`;
}

/**
 * Server-side fetch tới /api/admin/collections/[table] — dùng trong
 * Server Component (vd. DataTable), forward cookie phiên đăng nhập để
 * requireMember() phía route nhận đúng session của request gốc.
 */
export async function fetchCollection<T = Record<string, unknown>>(collectionKey: string): Promise<T[]> {
  const [baseUrl, h] = await Promise.all([getBaseUrl(), headers()]);
  const cookie = h.get("cookie") ?? "";

  const res = await fetch(`${baseUrl}/api/admin/collections/${collectionKey}`, {
    headers: { cookie },
    cache: "no-store",
  });

  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json.items) ? json.items : [];
}
