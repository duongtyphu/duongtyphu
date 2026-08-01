"use server";

/**
 * Sprint CS-03 — Companion Studio: Provider Manifest Foundation.
 *
 * File RIÊNG, không sửa `inference-actions.ts` (CS-01/CS-02) — chỉ đọc
 * `src/ai/providers/manifest.ts` (mới, độc lập khỏi Adapter/Registry).
 * Health vẫn dùng `getCompanionProviderHealth()` có sẵn (import lại, KHÔNG
 * sửa `runtime-actions.ts`).
 */

import { requireAdmin } from "@/lib/admin/requireAdmin";
import { listProviderManifest, type ProviderManifestEntry } from "@/ai/providers/manifest";

export async function listCompanionProviderManifest(): Promise<ProviderManifestEntry[]> {
  const admin = await requireAdmin();
  if (!admin) return [];
  return listProviderManifest();
}
