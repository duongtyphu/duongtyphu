"use client";

/**
 * Sprint CS-01 — Companion Studio: Inference Layer (Foundation).
 *
 * Khung UI + kiến trúc quản trị AI Provider — KHÔNG lưu API key thật,
 * KHÔNG kết nối vào Runtime thật. Mọi ràng buộc đã xác nhận trước khi
 * xây (không đổi):
 * - `ProviderManager`/`selectAdapter()`/`registry.ts`/10 Provider Adapter —
 *   0 dòng nào bị sửa.
 * - `/api/companion/chat/route.ts`, Companion Chat UI, Conversation
 *   (`companion_conversations`/`companion_messages`) — 0 dòng nào bị sửa.
 * - Tab "Chat Runtime" (EPIC-CS-001) — file riêng, không đụng, tiếp tục
 *   hoạt động y hệt trước; tab này CHỈ tái dùng `getCompanionProviderHealth()`
 *   (hàm CHỈ ĐỌC đã có sẵn trong `runtime-actions.ts`) để hiển thị đúng
 *   Health Check thật — không viết lại logic kiểm tra key.
 *
 * Toàn bộ Enable/Disable, Priority, Default Provider, API Key input ở
 * đây là STATE CỤC BỘ (React state, KHÔNG gọi mạng, KHÔNG ghi Supabase) —
 * mất khi tải lại trang. Đây đúng là ý nghĩa "Foundation": dựng sẵn luồng
 * thao tác Admin sẽ dùng, chưa nối phần lưu trữ/Runtime thật (Sprint sau).
 */

import { useEffect, useState } from "react";
import { listProviderMetadata, type ProviderMetadata } from "@/app/admin/(dashboard)/companion/inference-actions";
import { getCompanionProviderHealth } from "@/app/admin/(dashboard)/companion/runtime-actions";
import type { ProviderHealth } from "@/ai/providers/types";

type LocalProviderConfig = {
  enabled: boolean;
  priority: number;
  apiKeyDraft: string;
  committedLast4: string | null;
};

const TIER_LABEL: Record<ProviderMetadata["tier"], string> = {
  core: "Core",
  recommended: "Recommended",
  specialized: "Specialized",
  development: "Development",
};

const TIER_STYLE: Record<ProviderMetadata["tier"], string> = {
  core: "bg-blue-100 text-blue-700",
  recommended: "bg-emerald-100 text-emerald-700",
  specialized: "bg-purple-100 text-purple-700",
  development: "bg-gray-100 text-gray-600",
};

export function InferenceTab() {
  const [providers, setProviders] = useState<ProviderMetadata[] | null>(null);
  const [health, setHealth] = useState<ProviderHealth[] | null>(null);
  const [config, setConfig] = useState<Record<string, LocalProviderConfig>>({});
  const [defaultProviderId, setDefaultProviderId] = useState<string | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listProviderMetadata().then((metaRows) => {
      if (cancelled) return;
      setProviders(metaRows);
      setConfig((prev) => {
        const next = { ...prev };
        metaRows.forEach((p, index) => {
          if (!next[p.providerId]) {
            next[p.providerId] = { enabled: true, priority: index + 1, apiKeyDraft: "", committedLast4: null };
          }
        });
        return next;
      });
      setDefaultProviderId((prev) => prev ?? metaRows.find((p) => p.providerId !== "mock")?.providerId ?? null);
    });
    getCompanionProviderHealth().then((healthRows) => {
      if (!cancelled) setHealth(healthRows);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function refreshHealth() {
    setCheckingHealth(true);
    const rows = await getCompanionProviderHealth();
    setHealth(rows);
    setCheckingHealth(false);
  }

  function updateConfig(providerId: string, patch: Partial<LocalProviderConfig>) {
    setConfig((prev) => ({ ...prev, [providerId]: { ...prev[providerId], ...patch } }));
  }

  function commitApiKeyDraft(providerId: string) {
    const draft = config[providerId]?.apiKeyDraft ?? "";
    const last4 = draft.trim().length >= 4 ? draft.trim().slice(-4) : null;
    updateConfig(providerId, { committedLast4: last4, apiKeyDraft: "" });
  }

  const healthByProvider = new Map((health ?? []).map((h) => [h.providerId, h]));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-gray-700">Companion Studio — Inference Layer (Foundation)</h3>
        <p className="mt-1 text-xs text-gray-500">
          Sprint CS-01 — khung quản trị AI Provider. Chưa lưu API Key vào hệ thống, chưa kết nối vào Companion Chat thật.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
        <p className="font-bold">Đây là bản Foundation — chưa ảnh hưởng Companion Chat thật.</p>
        <p className="mt-1">
          Bật/tắt, độ ưu tiên, chọn mặc định, và API Key nhập bên dưới chỉ lưu <b>tạm trong phiên duyệt web này</b> (React
          state) — <b>không ghi vào Supabase</b>, mất khi tải lại trang, và <b>không ảnh hưởng</b> tới
          `ProviderManager`/`selectAdapter()` đang chạy thật. Companion Chat ở `/portal/companion` vẫn hoạt động y hệt
          trước — kiến trúc chọn Provider thật (đọc biến môi trường Vercel) giữ nguyên 100%. Việc lưu key thật + nối vào
          Runtime là phạm vi Sprint sau.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          {providers ? `${providers.length} Provider đã đăng ký trong hệ thống (đọc trực tiếp từ Provider Registry).` : "Đang tải..."}
        </p>
        <button
          type="button"
          onClick={refreshHealth}
          disabled={checkingHealth}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {checkingHealth ? "Đang kiểm tra..." : "Kiểm tra lại (Health Check)"}
        </button>
      </div>

      {!providers ? (
        <p className="text-sm text-gray-500">Đang tải danh sách Provider...</p>
      ) : (
        <div className="space-y-3">
          {providers
            .slice()
            .sort((a, b) => (config[a.providerId]?.priority ?? 0) - (config[b.providerId]?.priority ?? 0))
            .map((provider) => {
              const cfg = config[provider.providerId];
              const providerHealth = healthByProvider.get(provider.providerId);
              const isDefault = defaultProviderId === provider.providerId;
              if (!cfg) return null;

              return (
                <div key={provider.providerId} className="rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{provider.name}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${TIER_STYLE[provider.tier]}`}>
                          {TIER_LABEL[provider.tier]}
                        </span>
                        {isDefault && (
                          <span className="rounded-full bg-brand-blue/10 px-2 py-0.5 text-[11px] font-bold text-brand-blue">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {provider.providerId} · loại {provider.providerType} · model {provider.supportedModels.join(", ") || "—"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        providerHealth?.available ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {providerHealth?.available ? "Đã cấu hình" : providerHealth?.reason ?? "Chưa cấu hình"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-gray-600">Kích hoạt</span>
                      <button
                        type="button"
                        onClick={() => updateConfig(provider.providerId, { enabled: !cfg.enabled })}
                        className={`w-fit rounded-full px-3 py-1 text-xs font-bold transition ${
                          cfg.enabled ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {cfg.enabled ? "Đang bật" : "Đã tắt"}
                      </button>
                    </label>

                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-gray-600">Độ ưu tiên</span>
                      <input
                        type="number"
                        min={1}
                        value={cfg.priority}
                        onChange={(e) => updateConfig(provider.providerId, { priority: Number(e.target.value) || 1 })}
                        className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-sm"
                      />
                    </label>

                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-gray-600">Provider mặc định</span>
                      <button
                        type="button"
                        onClick={() => setDefaultProviderId(provider.providerId)}
                        className={`w-fit rounded-full px-3 py-1 text-xs font-bold transition ${
                          isDefault ? "bg-brand-blue text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {isDefault ? "Đang là mặc định" : "Đặt làm mặc định"}
                      </button>
                    </label>
                  </div>

                  <div className="mt-4">
                    <span className="text-xs font-semibold text-gray-600">API Key ({provider.envVar || "không cần"})</span>
                    {provider.envVar ? (
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <input
                          type="password"
                          value={cfg.apiKeyDraft}
                          onChange={(e) => updateConfig(provider.providerId, { apiKeyDraft: e.target.value })}
                          placeholder={cfg.committedLast4 ? `••••${cfg.committedLast4}` : "Dán key để xem trước giao diện..."}
                          className="w-64 rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => commitApiKeyDraft(provider.providerId)}
                          disabled={!cfg.apiKeyDraft}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                        >
                          Ghi tạm trong phiên
                        </button>
                        {cfg.committedLast4 && (
                          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
                            Đã ghi tạm ••••{cfg.committedLast4} — chưa lưu hệ thống
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="mt-1 text-xs text-gray-400">
                        {provider.optionalEnvVar
                          ? `Provider local runtime — dùng ${provider.optionalEnvVar} (Base URL), không phải API key.`
                          : "Không gọi mạng — không cần key."}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
