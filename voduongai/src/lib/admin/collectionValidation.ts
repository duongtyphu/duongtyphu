import { validateExternalUrl } from "@/lib/urlSafety";

/**
 * Per-collection field-level validation hook for the generic collections API
 * (`/api/admin/collections/[table]`). `tools`'s `link`/`affiliateUrl`/
 * `videoUrl`/`ctaLink` and the 5 resource-family collections'
 * `fileUrl`/`downloadLink`/`thumbnail` are rendered as real <a href>/<img src>
 * on the Portal, so a malicious or mistaken admin input must not be able to
 * store a javascript:/data: URL. Extend this map if other collections gain
 * user-facing URL fields.
 */
const URL_FIELDS_BY_COLLECTION: Record<string, string[]> = {
  tools: ["link", "affiliateUrl", "videoUrl", "ctaLink"],
  templates: ["fileUrl", "downloadLink", "thumbnail"],
  ebooks: ["fileUrl", "downloadLink", "thumbnail"],
  checklists: ["fileUrl", "downloadLink", "thumbnail"],
  sop: ["fileUrl", "downloadLink", "thumbnail"],
  resources: ["fileUrl", "downloadLink", "thumbnail"],
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
