"use client";

/**
 * Sprint CS-03 — Companion Studio: Provider Manifest Foundation.
 *
 * Tab RIÊNG (không sửa `InferenceTab.tsx`/`ProviderDetailPanel.tsx` của
 * CS-01/CS-02) — đọc metadata TỪ MANIFEST (`manifest-actions.ts` →
 * `src/ai/providers/manifest.ts`), KHÔNG gọi `listProviderMetadata()`
 * (CS-01, đọc Adapter) cho bất kỳ field nào Manifest đã có. Health vẫn
 * tái dùng `getCompanionProviderHealth()` có sẵn — không tạo Health Check
 * mới, đúng yêu cầu "Health vẫn đọc từ Runtime hiện tại".
 *
 * `registeredInRuntime: false` (hiện chỉ "groq") → không tra được Health
 * thật (Runtime không có Adapter) — hiển thị "Chưa có Adapter" trung
 * thực, không suy đoán trạng thái.
 */

import { useEffect, useState } from "react";
import { listCompanionProviderManifest } from "@/app/admin/(dashboard)/companion/manifest-actions";
import { getCompanionProviderHealth } from "@/app/admin/(dashboard)/companion/runtime-actions";
import type { ProviderManifestEntry, ManifestCapabilityFlag } from "@/ai/providers/manifest";
import type { ProviderHealth } from "@/ai/providers/types";
import { Badge } from "@/components/admin/SaveStateBadge";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium text-gray-900">{value}</span>
    </div>
  );
}

function NotCurated() {
  return <Badge color="gray">Chưa biên tập</Badge>;
}

function CapabilityBadge({ flag }: { flag: ManifestCapabilityFlag }) {
  if (flag === "yes") return <Badge color="emerald">Có</Badge>;
  if (flag === "no") return <Badge color="red">Không</Badge>;
  return <NotCurated />;
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
      <h5 className="text-xs font-bold uppercase tracking-wide text-gray-500">{title}</h5>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function ManifestTab() {
  const [manifest, setManifest] = useState<ProviderManifestEntry[] | null>(null);
  const [health, setHealth] = useState<ProviderHealth[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    listCompanionProviderManifest().then((rows) => {
      if (!cancelled) setManifest(rows);
    });
    getCompanionProviderHealth().then((rows) => {
      if (!cancelled) setHealth(rows);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const healthByProvider = new Map((health ?? []).map((h) => [h.providerId, h]));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-gray-700">Provider Manifest (Foundation)</h3>
        <p className="mt-1 text-xs text-gray-500">
          Sprint CS-03 — nguồn metadata QUẢN TRỊ độc lập khỏi AI Adapter (mô tả/category/URL/vai trò model/capabilities/
          giới hạn/kiểu xác thực). Adapter chỉ còn chịu trách nhiệm inference.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
        <p className="font-bold">Foundation — phần lớn field hiện &quot;Chưa biên tập&quot;.</p>
        <p className="mt-1">
          Manifest này KHÔNG suy đoán nội dung theo hiểu biết chung về vendor (description/category/URL tài liệu-trang
          chủ-giá/vai trò Reasoning-Vision-Embedding Model/6 trong 7 cờ Capabilities) — chỉ những sự thật kỹ thuật đã
          xác nhận trong chính dự án (tên biến ENV, model đã đăng ký, context window, tier) mới được điền. Founder/PMO
          cần xác nhận nội dung thật cho các ô &quot;Chưa biên tập&quot; ở Sprint sau.
        </p>
      </div>

      {!manifest ? (
        <p className="text-sm text-gray-500">Đang tải Manifest...</p>
      ) : (
        <div className="space-y-3">
          {manifest.map((p) => {
            const h = p.registeredInRuntime ? healthByProvider.get(p.providerId) : undefined;
            return (
              <details key={p.providerId} className="rounded-2xl border border-gray-200 bg-white p-4">
                <summary className="flex cursor-pointer flex-wrap items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500">
                    {p.logoPlaceholder}
                  </span>
                  <span className="font-semibold text-gray-900">{p.displayName}</span>
                  <span className="text-xs text-gray-400">({p.providerId})</span>
                  {!p.registeredInRuntime && <Badge color="amber">Chưa có Adapter</Badge>}
                  {p.registeredInRuntime && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        h?.available ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {h?.available ? "Đã cấu hình" : h?.reason ?? "Chưa cấu hình"}
                    </span>
                  )}
                </summary>

                <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 lg:grid-cols-2">
                  <Group title="Overview">
                    <Field label="Provider ID" value={p.providerId} />
                    <Field label="Display Name" value={p.displayName} />
                    <Field label="Description" value={p.description ?? <NotCurated />} />
                    <Field label="Category" value={p.category ?? <NotCurated />} />
                    <Field label="Tier" value={p.tier ?? <NotCurated />} />
                    <Field label="Logo/Icon" value={<span className="italic text-gray-400">{p.logoPlaceholder} (placeholder)</span>} />
                    <Field label="Documentation URL" value={p.documentationUrl ?? <NotCurated />} />
                    <Field label="Website URL" value={p.websiteUrl ?? <NotCurated />} />
                    <Field label="Pricing URL" value={p.pricingUrl ?? <NotCurated />} />
                  </Group>

                  <Group title="Models">
                    <Field label="Chat Model" value={p.models.chatModel ?? <NotCurated />} />
                    <Field label="Reasoning Model" value={p.models.reasoningModel ?? <NotCurated />} />
                    <Field label="Vision Model" value={p.models.visionModel ?? <NotCurated />} />
                    <Field label="Embedding Model" value={p.models.embeddingModel ?? <NotCurated />} />
                  </Group>

                  <Group title="Capabilities">
                    <Field label="Chat" value={<CapabilityBadge flag={p.capabilities.chat} />} />
                    <Field label="Vision" value={<CapabilityBadge flag={p.capabilities.vision} />} />
                    <Field label="Embedding" value={<CapabilityBadge flag={p.capabilities.embedding} />} />
                    <Field label="Streaming" value={<CapabilityBadge flag={p.capabilities.streaming} />} />
                    <Field label="Function Calling" value={<CapabilityBadge flag={p.capabilities.functionCalling} />} />
                    <Field label="Structured Output" value={<CapabilityBadge flag={p.capabilities.structuredOutput} />} />
                    <Field label="JSON Mode" value={<CapabilityBadge flag={p.capabilities.jsonMode} />} />
                  </Group>

                  <Group title="Limits">
                    <Field label="Context Window" value={p.limits.contextWindow != null ? p.limits.contextWindow.toLocaleString("vi-VN") + " token" : <NotCurated />} />
                    <Field label="Max Output" value={p.limits.maxOutput ?? <NotCurated />} />
                    <Field label="Recommended Use" value={p.limits.recommendedUse ?? <NotCurated />} />
                  </Group>

                  <Group title="Connection">
                    <Field label="Authentication Type" value={p.connection.authenticationType ?? <NotCurated />} />
                    <Field label="Environment Variable Name" value={p.connection.environmentVariableName ?? "—"} />
                    <Field label="Supports Base URL" value={p.connection.supportsBaseUrl ? "Có" : "Không"} />
                    <Field label="Supports Local Runtime" value={p.connection.supportsLocalRuntime ? "Có" : "Không"} />
                    <p className="mt-2 text-[11px] italic text-gray-400">* Không lưu Secret — chỉ hiển thị trạng thái/tên biến.</p>
                  </Group>

                  <Group title="Health (tái sử dụng Runtime)">
                    {!p.registeredInRuntime ? (
                      <p className="text-sm text-gray-500">Chưa có Adapter trong Registry — không kiểm tra được Health thật.</p>
                    ) : !h ? (
                      <p className="text-sm text-gray-500">Đang tải...</p>
                    ) : (
                      <>
                        <Field label="Trạng thái" value={h.available ? <Badge color="emerald">Healthy</Badge> : <Badge color="red">Unhealthy</Badge>} />
                        <Field label="Last Check" value={new Date(h.checkedAt).toLocaleString("vi-VN")} />
                        {h.reason && <Field label="Ghi chú" value={h.reason} />}
                      </>
                    )}
                  </Group>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
