const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

/**
 * Server-side guard for any user-supplied URL that will later be rendered as
 * a real `href`/`src` (Tool website/affiliate/video links, etc). Rejects
 * dangerous schemes (javascript:, data:, vbscript:, file:) and normalizes a
 * bare domain (missing protocol) to https:// rather than silently treating
 * it as relative.
 */
export function validateExternalUrl(raw: unknown): { ok: true; value: string } | { ok: false; error: string } {
  if (raw === undefined || raw === null) return { ok: true, value: "" };
  if (typeof raw !== "string") return { ok: false, error: "URL phải là chuỗi văn bản." };
  const value = raw.trim();
  if (!value) return { ok: true, value: "" };

  const candidate = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value) ? value : `https://${value}`;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return { ok: false, error: `URL không hợp lệ: "${value}"` };
  }
  if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
    return { ok: false, error: `URL không hợp lệ — chỉ cho phép http/https: "${value}"` };
  }
  return { ok: true, value: url.toString() };
}

/** Client-side render guard — only render an <a href> if it's an already-normalized http(s) URL. */
export function isSafeUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    return ALLOWED_PROTOCOLS.has(new URL(value).protocol);
  } catch {
    return false;
  }
}
