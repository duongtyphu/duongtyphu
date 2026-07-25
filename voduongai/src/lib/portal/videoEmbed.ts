/**
 * Chuyển URL YouTube (watch?v=/youtu.be) sang dạng nhúng được — mọi URL
 * khác (Vimeo, Loom, mp4 trực tiếp...) không đoán được cấu trúc nhúng
 * chung, fallback sang link mở tab mới ở nơi gọi. Tách ra dùng chung —
 * trước đó chỉ có 1 bản cục bộ trong `CourseLearnClient.tsx` (Premium),
 * giờ "Video dự án" (Dự án & Cơ hội) cũng cần đúng logic này.
 */
export function toYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "").replace(/^m\./, "");
    if (host === "youtube.com") {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\//, "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}
