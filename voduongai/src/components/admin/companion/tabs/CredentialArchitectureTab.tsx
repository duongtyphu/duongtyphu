"use client";

/**
 * Sprint CS-04 — Companion Studio: Credential Architecture (Foundation).
 *
 * Tab RIÊNG, KHÔNG sửa `InferenceTab.tsx`/`ProviderDetailPanel.tsx`
 * (CS-01/CS-02) hay `ManifestTab.tsx` (CS-03). Component THUẦN HIỂN THỊ:
 * KHÔNG gọi Server Action nào, KHÔNG fetch dữ liệu, KHÔNG đọc
 * `process.env`/Adapter/Registry/ProviderManager/Health Check nào —
 * toàn bộ nội dung là hằng số tĩnh từ `credential-architecture.ts` +
 * 2 dòng ví dụ minh hoạ GENERIC (không gắn tên Provider thật nào, tránh
 * gây hiểu nhầm là dữ liệu thật của Gemini/OpenAI/...).
 *
 * Thuật ngữ: dùng "Credential" xuyên suốt tab này (KHÔNG dùng "API Key")
 * — đây là chuẩn hoá thuật ngữ CHO LỚP MỚI này; nhãn "API Key" ở
 * `InferenceTab.tsx`/`ProviderDetailPanel.tsx` (CS-01/CS-02) giữ nguyên,
 * không đổi lại (đúng "Không sửa các Sprint trước").
 */

import {
  CREDENTIAL_SOURCES,
  CREDENTIAL_RESOLUTION_ORDER,
  CREDENTIAL_STATUSES,
  CREDENTIAL_METADATA_FIELDS,
  type CredentialSourceType,
} from "@/ai/providers/credential-architecture";
import { Badge } from "@/components/admin/SaveStateBadge";

const SOURCE_LABEL: Record<CredentialSourceType, string> = {
  environment: "Environment",
  database: "Database",
  "secret-manager": "Secret Manager",
  "local-runtime": "Local Runtime",
  disabled: "Disabled",
};

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <h4 className="text-sm font-bold text-gray-800">{title}</h4>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function CredentialArchitectureTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-gray-700">Credential Architecture (Foundation)</h3>
        <p className="mt-1 text-xs text-gray-500">
          Sprint CS-04 — kiến trúc quản lý Credentials. Đây KHÔNG phải nơi lưu Credential thật, không đọc Secret, không
          đọc biến môi trường thật, không kết nối bất kỳ nguồn nào — chỉ hiển thị thiết kế.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
        <p className="font-bold">Foundation thuần hiển thị — chưa có logic nào chạy thật.</p>
        <p className="mt-1">
          Không có Server Action nào trong tab này (khác Chat Runtime/Inference/Manifest — tự nguyên tắc CS-04 yêu cầu
          &quot;Không đọc API Key. Không kết nối Environment. Không kết nối Secret Manager.&quot;). Runtime thật
          (`ProviderManager`/`selectAdapter()`) vẫn đọc thẳng `process.env` như hiện tại, không đổi gì. Thuật ngữ
          &quot;Credential&quot; dùng thay &quot;API Key&quot; CHỈ trong phạm vi tab này — nhãn cũ ở tab &quot;Nhà cung
          cấp AI (Inference)&quot; (CS-01/CS-02) giữ nguyên, không sửa lại.
        </p>
      </div>

      {/* 1. Credential Sources */}
      <Group title="1. Credential Sources">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="py-2 pr-4">Source</th>
                <th className="py-2">Ý nghĩa</th>
              </tr>
            </thead>
            <tbody>
              {CREDENTIAL_SOURCES.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-2 pr-4 font-semibold text-gray-900">{s.label}</td>
                  <td className="py-2 text-gray-600">{s.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] italic text-gray-400">* Chỉ metadata mô tả khái niệm — không kết nối nguồn nào.</p>
      </Group>

      {/* 2. Credential Resolver */}
      <Group title="2. Credential Resolver">
        <p className="text-xs text-gray-500">Resolution Order (thiết kế — chưa implement):</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {CREDENTIAL_RESOLUTION_ORDER.map((id, i) => (
            <div key={id} className="flex items-center gap-2">
              <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700">
                {SOURCE_LABEL[id]}
              </span>
              {i < CREDENTIAL_RESOLUTION_ORDER.length - 1 && <span className="text-gray-300">→</span>}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] italic text-gray-400">
          * Chỉ hiển thị thứ tự dự kiến — chưa có hàm `resolveCredential()` nào tồn tại, `ProviderManager`/
          `selectAdapter()` không đổi hành vi.
        </p>
      </Group>

      {/* 3. Credential Status */}
      <Group title="3. Credential Status">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CREDENTIAL_STATUSES.map((s) => (
            <div key={s.id} className="rounded-lg border border-gray-100 bg-gray-50/60 p-2.5">
              <Badge color={s.id === "available" ? "emerald" : s.id === "missing" ? "red" : s.id === "disabled" ? "amber" : "gray"}>
                {s.label}
              </Badge>
              <p className="mt-1.5 text-xs text-gray-600">{s.description}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs font-semibold text-gray-600">Ví dụ minh hoạ (dữ liệu giả lập, không phải Provider thật):</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="py-2 pr-4">Provider mẫu</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 text-gray-500">Nhà cung cấp mẫu A</td>
                <td className="py-2">
                  <Badge color="gray">Unknown</Badge>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-gray-500">Nhà cung cấp mẫu B</td>
                <td className="py-2">
                  <Badge color="gray">Unknown</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] italic text-gray-400">
          * Không đọc Secret, không đọc ENV thật — mọi Status hiện tại đều là &quot;Unknown&quot; theo thiết kế
          Foundation, không phải trạng thái thật của bất kỳ Provider nào.
        </p>
      </Group>

      {/* 4. Credential Metadata */}
      <Group title="4. Credential Metadata">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="py-2 pr-4">Field</th>
                <th className="py-2 pr-4">Ý nghĩa</th>
                <th className="py-2">Ví dụ minh hoạ</th>
              </tr>
            </thead>
            <tbody>
              {CREDENTIAL_METADATA_FIELDS.map((f) => (
                <tr key={f.field} className="border-b border-gray-100 last:border-0">
                  <td className="py-2 pr-4 font-semibold text-gray-900">{f.label}</td>
                  <td className="py-2 pr-4 text-gray-600">{f.description}</td>
                  <td className="py-2 italic text-gray-400">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] italic text-gray-400">* Chỉ placeholder metadata — chưa có giá trị thật nào được lưu ở bất kỳ đâu.</p>
      </Group>
    </div>
  );
}
