"use client";

/**
 * Sprint CS-02 — Companion Studio: Inference Provider Detail.
 *
 * Component THUẦN HIỂN THỊ (không state riêng, không gọi mạng, không
 * Server Action) — nhận toàn bộ dữ liệu qua props từ `InferenceTab.tsx`
 * (CS-01), tái dùng ĐÚNG state/health/config CS-01 đã có, không tạo
 * nguồn sự thật thứ 2 cho Enabled/Priority/Default Provider. Dùng CHUNG
 * 1 component cho cả 10 Provider (Gemini/Groq/Claude/OpenAI/DeepSeek/
 * Grok/Mistral/Ollama/Perplexity/Cohere/Mock — 11 Provider thật đang có,
 * "Groq" chưa tồn tại trong Registry, xem ghi chú ở mục Models bên dưới).
 *
 * 6 nhóm đúng yêu cầu CS-02 — mọi ô KHÔNG có dữ liệu thật trong metadata
 * hiện có đều hiển thị "Chưa có trong metadata" (badge xám trung tính),
 * KHÔNG suy đoán/hardcode theo hiểu biết chung về vendor (đúng nguyên tắc
 * NO-FAKE-DATA đã áp dụng xuyên suốt dự án — xem `CapabilitiesTab.tsx`
 * cùng nguyên tắc cho danh mục năng lực Companion).
 */

import type { ProviderMetadata } from "@/app/admin/(dashboard)/companion/inference-actions";
import type { ProviderHealth } from "@/ai/providers/types";

type ConfigSummary = {
  enabled: boolean;
  priority: number;
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium text-gray-900">{value}</span>
    </div>
  );
}

function UnknownBadge() {
  return <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-500">Chưa có trong metadata</span>;
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
      <h5 className="text-xs font-bold uppercase tracking-wide text-gray-500">{title}</h5>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function ProviderDetailPanel({
  provider,
  health,
  configSummary,
  isDefault,
}: {
  provider: ProviderMetadata;
  health: ProviderHealth | undefined;
  configSummary: ConfigSummary;
  isDefault: boolean;
}) {
  const defaultModel = provider.modelRegistry[0];

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 lg:grid-cols-2">
      {/* 1. Overview */}
      <SectionCard title="1. Overview">
        <InfoRow label="Provider Name" value={provider.name} />
        <InfoRow
          label="Description"
          value={
            defaultModel?.description ? (
              <span className="font-normal text-gray-700">{defaultModel.description}</span>
            ) : (
              <UnknownBadge />
            )
          }
        />
        <InfoRow label="Tier" value={provider.tier} />
        <InfoRow label="Provider Type" value={provider.providerType} />
        <InfoRow
          label="Current Status"
          value={
            <span className={health?.available ? "text-emerald-700" : "text-gray-500"}>
              {health?.available ? "Đã cấu hình" : health?.reason ?? "Chưa cấu hình"}
            </span>
          }
        />
        {defaultModel?.description ? (
          <p className="mt-2 text-[11px] italic text-gray-400">
            * Description đọc từ mô tả model (không có field mô tả riêng cấp Provider trong hệ thống).
          </p>
        ) : null}
      </SectionCard>

      {/* 2. Models */}
      <SectionCard title="2. Models">
        {provider.modelRegistry.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có model nào đăng ký.</p>
        ) : (
          <div className="space-y-2">
            {provider.modelRegistry.map((model, i) => (
              <div key={model.modelId} className="rounded-lg border border-gray-200 bg-white p-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">{model.modelId}</span>
                  {i === 0 && (
                    <span className="rounded-full bg-brand-blue/10 px-2 py-0.5 text-[11px] font-bold text-brand-blue">
                      Model mặc định
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">{model.description || "Chưa có mô tả."}</p>
                <p className="mt-1 text-[11px] text-gray-400">Context window: {model.contextWindow.toLocaleString("vi-VN")} token</p>
              </div>
            ))}
          </div>
        )}
        <p className="mt-2 text-[11px] italic text-gray-400">* Chỉ đọc — không có ô chỉnh sửa, không lưu.</p>
      </SectionCard>

      {/* 3. Capabilities */}
      <SectionCard title="3. Capabilities">
        <p className="mb-2 text-[11px] text-gray-400">
          Hệ thống hiện chưa khai báo field capability kỹ thuật (vision/embedding/function calling/structured output/
          streaming) trong hợp đồng Provider — chỉ hiển thị đúng những gì có thật, không suy đoán theo vendor.
        </p>
        <InfoRow
          label="Chat"
          value={
            provider.providerType === "llm" ? (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">Có</span>
            ) : (
              <UnknownBadge />
            )
          }
        />
        <InfoRow label="Vision" value={<UnknownBadge />} />
        <InfoRow label="Embedding" value={<UnknownBadge />} />
        <InfoRow label="Function Calling" value={<UnknownBadge />} />
        <InfoRow label="Structured Output" value={<UnknownBadge />} />
        <InfoRow label="Streaming" value={<UnknownBadge />} />
      </SectionCard>

      {/* 4. Connection */}
      <SectionCard title="4. Connection">
        <InfoRow
          label="API Key Status"
          value={
            provider.envVar ? (
              <span className={health?.available ? "text-emerald-700" : "text-gray-500"}>
                {health?.available ? "Đã cấu hình" : "Chưa cấu hình"}
              </span>
            ) : (
              "Không cần"
            )
          }
        />
        <InfoRow label="Base URL" value={provider.optionalEnvVar ? `Biến: ${provider.optionalEnvVar} (local runtime)` : "Không áp dụng"} />
        <InfoRow label="Environment Variable Name" value={provider.envVar || "—"} />
        <p className="mt-2 text-[11px] italic text-gray-400">* Chỉ hiển thị trạng thái — không hiển thị giá trị key, không có ô nhập.</p>
      </SectionCard>

      {/* 5. Health */}
      <SectionCard title="5. Health">
        <InfoRow
          label="Trạng thái"
          value={
            health ? (
              <span className={health.available ? "text-emerald-700" : "text-red-600"}>
                {health.available ? "Healthy" : "Unhealthy"}
              </span>
            ) : (
              "Đang tải..."
            )
          }
        />
        <InfoRow label="Last Check" value={health ? new Date(health.checkedAt).toLocaleString("vi-VN") : "—"} />
        <InfoRow label="Provider Version" value={<UnknownBadge />} />
        {health?.reason && <InfoRow label="Ghi chú" value={health.reason} />}
        <p className="mt-2 text-[11px] italic text-gray-400">
          * Tái sử dụng `checkAllProvidersHealth()` có sẵn (Chat Runtime tab) — không tạo Health Check mới.
        </p>
      </SectionCard>

      {/* 6. Configuration */}
      <SectionCard title="6. Configuration">
        <InfoRow label="Enabled" value={configSummary.enabled ? "Đang bật" : "Đã tắt"} />
        <InfoRow label="Priority" value={configSummary.priority} />
        <InfoRow label="Default Provider" value={isDefault ? "Đúng" : "Không"} />
        <p className="mt-2 text-[11px] italic text-gray-400">
          * Chỉnh 3 giá trị này ở khối điều khiển phía trên (Sprint CS-01) — chỉ state cục bộ, chưa ghi Database/Supabase/ENV.
        </p>
      </SectionCard>
    </div>
  );
}
