import { validateExternalUrl } from "@/lib/urlSafety";

/**
 * Per-collection field-level validation hook for the generic collections API
 * (`/api/admin/collections/[table]`). Only `tools` needs this today — its
 * `link`/`affiliateUrl`/`videoUrl`/`ctaLink` fields are rendered as real
 * <a href> on the Portal, so a malicious or mistaken admin input must not be
 * able to store a javascript:/data: URL. Extend this map if other
 * collections gain user-facing URL fields.
 */
const URL_FIELDS_BY_COLLECTION: Record<string, string[]> = {
  tools: ["link", "affiliateUrl", "videoUrl", "ctaLink"],
};

export function validateAndNormalizeUrls(key: string, item: Record<string, unknown>): { error: string } | null {
  const fields = URL_FIELDS_BY_COLLECTION[key];
  if (!fields) return null;
  for (const field of fields) {
    if (!(field in item)) continue;
    const result = validateExternalUrl(item[field]);
    if (!result.ok) return { error: `${field}: ${result.error}` };
    item[field] = result.value;
  }
  return null;
}
