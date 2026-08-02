"use client";

/**
 * Tab "Chat Runtime" (EPIC-CS-001) — lớp quản trị VẬN HÀNH Chat AI thật ở
 * `/portal/companion`, khác hẳn 10 tab CMS còn lại (những tab đó quản CẤU
 * HÌNH nội dung — persona/chiến lược hội thoại/tri thức..., không đọc dữ
 * liệu runtime nào). Không sửa/xoá dữ liệu hội thoại người dùng — CHỈ ĐỌC,
 * qua `runtime-actions.ts` (service-role, requireAdmin() gate).
 */

import { useEffect, useState } from "react";
import {
  getCompanionRuntimeOverview,
  listCompanionSessions,
  getCompanionProviderHealth,
  listCompanionExecutions,
  type CompanionRuntimeOverview,
  type CompanionSessionRow,
  type CompanionExecutionRow,
} from "@/app/admin/(dashboard)/companion/runtime-actions";
import type { ProviderHealth } from "@/ai/providers/types";

export function RuntimeTab() {
  const [overview, setOverview] = useState<CompanionRuntimeOverview | null>(null);
  const [sessions, setSessions] = useState<CompanionSessionRow[] | null>(null);
  const [health, setHealth] = useState<ProviderHealth[] | null>(null);
  const [executions, setExecutions] = useState<CompanionExecutionRow[] | null>(null);

  useEffect(() => {
    getCompanionRuntimeOverview().then(setOverview);
    listCompanionSessions().then(setSessions);
    getCompanionProviderHealth().then(setHealth);
    listCompanionExecutions().then(setExecutions);
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-sm font-bold text-gray-700">Tổng quan vận hành</h3>
        {!overview ? (
          <p className="mt-2 text-sm text-gray-500">Đang tải...</p>
        ) : (
          <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Trạng thái AI" value={overview.aiConfigured ? "Đã cấu hình" : "Chưa cấu hình"} />
            <StatCard label="Tổng hội thoại" value={String(overview.totalConversations)} />
            <StatCard label="Tổng tin nhắn" value={String(overview.totalMessages)} />
            <StatCard label="Tin nhắn 24 giờ qua" value={String(overview.messagesLast24h)} />
            <StatCard label="Lượt gọi AI thật" value={String(overview.realProviderExecutions)} />
            <StatCard label="Lượt gọi Mock" value={String(overview.mockProviderExecutions)} />
            <StatCard
              label="Lượt lỗi"
              value={String(overview.failedExecutions)}
              tone={overview.failedExecutions > 0 ? "warning" : "default"}
            />
          </div>
        )}
        <p className="mt-2 text-xs text-gray-400">
          &quot;Lượt gọi AI thật&quot;/&quot;Mock&quot;/&quot;Lượt lỗi&quot; đọc từ log thực thi Provider —
          lưu trong bộ nhớ tiến trình (process-local), có thể rỗng lại sau mỗi lần deploy/khởi động lại server —
          không phải audit log lâu dài.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-gray-700">Provider Health</h3>
        {!health ? (
          <p className="mt-2 text-sm text-gray-500">Đang tải...</p>
        ) : (
          <div className="mt-2 overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-3 py-2">Provider</th>
                  <th className="px-3 py-2">Trạng thái</th>
                  <th className="px-3 py-2">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {health.map((h) => (
                  <tr key={h.providerId}>
                    <td className="px-3 py-2 font-medium text-gray-800">{h.providerId}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                          h.available ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {h.available ? "Đã cấu hình" : "Chưa cấu hình"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-500">{h.reason ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h3 className="text-sm font-bold text-gray-700">Phiên hội thoại gần đây</h3>
        <p className="mt-1 text-xs text-gray-400">Tối đa 50 hội thoại mới cập nhật nhất, mọi người dùng. Chỉ đọc.</p>
        {!sessions ? (
          <p className="mt-2 text-sm text-gray-500">Đang tải...</p>
        ) : sessions.length === 0 ? (
          <p className="mt-2 text-sm text-gray-400">Chưa có hội thoại nào.</p>
        ) : (
          <div className="mt-2 max-h-80 overflow-y-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-3 py-2">Tiêu đề</th>
                  <th className="px-3 py-2">Người dùng</th>
                  <th className="px-3 py-2">Số tin nhắn</th>
                  <th className="px-3 py-2">Cập nhật gần nhất</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sessions.map((s) => (
                  <tr key={s.id}>
                    <td className="max-w-[220px] truncate px-3 py-2 text-gray-800">{s.title}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">{s.userEmail ?? "—"}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">{s.messageCount}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">{new Date(s.updatedAt).toLocaleString("vi-VN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h3 className="text-sm font-bold text-gray-700">Lỗi thực thi gần đây</h3>
        <p className="mt-1 text-xs text-gray-400">
          100 lượt gọi AI Provider gần nhất của Companion Chat — không log nội dung tin nhắn/prompt.
        </p>
        {!executions ? (
          <p className="mt-2 text-sm text-gray-500">Đang tải...</p>
        ) : executions.filter((e) => !e.success).length === 0 ? (
          <p className="mt-2 text-sm text-gray-400">Không có lỗi nào trong log hiện tại.</p>
        ) : (
          <div className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-red-200">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-red-50 text-xs font-semibold uppercase tracking-wide text-red-700">
                <tr>
                  <th className="px-3 py-2">Provider</th>
                  <th className="px-3 py-2">Lỗi</th>
                  <th className="px-3 py-2">Độ trễ</th>
                  <th className="px-3 py-2">Thời điểm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-100">
                {executions
                  .filter((e) => !e.success)
                  .map((e, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 font-medium text-gray-800">{e.providerId}</td>
                      <td className="max-w-[280px] truncate px-3 py-2 text-xs text-red-600">{e.error ?? "Không rõ"}</td>
                      <td className="px-3 py-2 text-xs text-gray-500">{e.latencyMs}ms</td>
                      <td className="px-3 py-2 text-xs text-gray-500">{new Date(e.at).toLocaleString("vi-VN")}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "warning" }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        tone === "warning" ? "border-amber-200 bg-amber-50" : "border-gray-200 bg-white"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`mt-1 truncate text-lg font-extrabold ${tone === "warning" ? "text-amber-700" : "text-gray-900"}`}>
        {value}
      </p>
    </div>
  );
}
