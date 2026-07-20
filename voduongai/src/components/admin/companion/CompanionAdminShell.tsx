"use client";

import { AdminTabs, type AdminTab, type AdminTabGroup } from "@/components/admin/AdminTabs";
import { OverviewTab } from "@/components/admin/companion/tabs/OverviewTab";
import { PersonaTab } from "@/components/admin/companion/tabs/PersonaTab";
import { ConversationTab } from "@/components/admin/companion/tabs/ConversationTab";
import { KnowledgeTab } from "@/components/admin/companion/tabs/KnowledgeTab";
import { MemoryTab } from "@/components/admin/companion/tabs/MemoryTab";
import { CoachingTab } from "@/components/admin/companion/tabs/CoachingTab";
import { CapabilitiesTab } from "@/components/admin/companion/tabs/CapabilitiesTab";
import { SafetyTab } from "@/components/admin/companion/tabs/SafetyTab";
import { TestTab } from "@/components/admin/companion/tabs/TestTab";
import { VersionsTab } from "@/components/admin/companion/tabs/VersionsTab";

function buildTabs(aiConfigured: boolean): AdminTab[] {
  return [
    { key: "overview", label: "Tổng quan", content: <OverviewTab aiConfigured={aiConfigured} /> },
    { key: "persona", label: "Nhân cách", content: <PersonaTab /> },
    { key: "conversation", label: "Hội thoại", content: <ConversationTab /> },
    { key: "knowledge", label: "Tri thức", content: <KnowledgeTab /> },
    { key: "memory", label: "Trí nhớ", content: <MemoryTab /> },
    { key: "coaching", label: "Dẫn dắt & Huấn luyện", content: <CoachingTab /> },
    { key: "capabilities", label: "Công cụ", content: <CapabilitiesTab /> },
    { key: "safety", label: "An toàn", content: <SafetyTab /> },
    { key: "test", label: "Kiểm tra Companion", content: <TestTab /> },
    { key: "versions", label: "Phiên bản & Xuất bản", content: <VersionsTab /> },
  ];
}

const TAB_GROUPS: AdminTabGroup[] = [
  { label: "Nền tảng", keys: ["overview", "persona", "conversation"] },
  { label: "Năng lực", keys: ["knowledge", "memory", "coaching", "capabilities"] },
  { label: "Quản trị", keys: ["safety", "test", "versions"] },
];

/**
 * 1 mục sidebar duy nhất ("Companion") chứa 10 tab — không tạo 10 route
 * riêng, không lộ thuật ngữ kỹ thuật (key nội bộ tiếng Anh, nhãn hiển thị
 * tiếng Việt). Mỗi tab tự đọc dữ liệu qua useCollection() của chính nó,
 * giống VisualEditor/DataTableClient đã làm — không cần prefetch server.
 * `aiConfigured` là giá trị thật từ isAiConfigured() (server-only, đọc biến
 * môi trường) — page.tsx tính sẵn rồi truyền xuống, Client Component không
 * tự đọc được process.env phía server.
 */
export function CompanionAdminShell({ aiConfigured }: { aiConfigured: boolean }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-extrabold text-gray-900">Companion</h1>
        <p className="mt-1 text-sm text-gray-500">
          Trung tâm quản trị và nuôi dưỡng AI Mentor của VO DUONG AI.
        </p>
      </div>
      <AdminTabs tabs={buildTabs(aiConfigured)} groups={TAB_GROUPS} />
    </div>
  );
}
