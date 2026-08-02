"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, MessageCircle, ChevronDown } from "lucide-react";
import type { CompanionConversationSummary } from "@/app/portal/companion/actions";

type ConversationGroup = { label: string; items: CompanionConversationSummary[] };

/** Sidebar — Hôm nay/Hôm qua/Tuần này/Cũ hơn (EPIC-UX-001), thuần UI —
    không đổi dữ liệu/API, chỉ nhóm lại đúng mảng `conversations` đã có,
    giữ nguyên thứ tự `updatedAt` giảm dần bên trong mỗi nhóm. */
function groupConversations(conversations: CompanionConversationSummary[]): ConversationGroup[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const groups: ConversationGroup[] = [
    { label: "Hôm nay", items: [] },
    { label: "Hôm qua", items: [] },
    { label: "Tuần này", items: [] },
    { label: "Cũ hơn", items: [] },
  ];

  for (const c of conversations) {
    const updatedAt = new Date(c.updatedAt);
    if (updatedAt >= startOfToday) groups[0].items.push(c);
    else if (updatedAt >= startOfYesterday) groups[1].items.push(c);
    else if (updatedAt >= startOfWeek) groups[2].items.push(c);
    else groups[3].items.push(c);
  }

  return groups.filter((g) => g.items.length > 0);
}

/**
 * 4 nhóm "AI Mentor Workspace" (EPIC-UX-002) — THUẦN UI PLACEHOLDER, không
 * kết nối dữ liệu/API/Database nào. Mỗi nhóm gập/mở tại chỗ, khi mở hiện
 * đúng 1 dòng trạng thái trung thực (không bịa dữ liệu mục tiêu/bài học/
 * nhật ký/gợi ý nào — đúng nguyên tắc NO-FAKE-DATA của dự án) kèm nhãn
 * "Sắp ra mắt".
 */
const WORKSPACE_GROUPS: { key: string; emoji: string; label: string; placeholder: string }[] = [
  { key: "goals", emoji: "🎯", label: "Mục tiêu của tôi", placeholder: "Chưa có mục tiêu nào được thiết lập." },
  { key: "learning", emoji: "📚", label: "Đang học", placeholder: "Chưa có nội dung nào đang học." },
  { key: "journal", emoji: "📝", label: "Nhật ký học tập", placeholder: "Chưa có ghi chú nào trong nhật ký." },
  { key: "suggested", emoji: "⭐", label: "Gợi ý hôm nay", placeholder: "Chưa có gợi ý nào cho hôm nay." },
];

function WorkspaceGroupHeader({
  emoji,
  label,
  open,
  onToggle,
}: {
  emoji: string;
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50"
    >
      <span className="text-base leading-none" aria-hidden="true">
        {emoji}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
        Sắp ra mắt
      </span>
      <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
  );
}

export function CompanionSidebar({
  conversations,
  activeConversationId,
  onSelect,
  onNew,
  onRename,
  onDelete,
}: {
  conversations: CompanionConversationSummary[];
  activeConversationId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  function startEdit(c: CompanionConversationSummary) {
    setEditingId(c.id);
    setEditValue(c.title);
  }

  function commitEdit() {
    if (editingId && editValue.trim()) {
      onRename(editingId, editValue.trim());
    }
    setEditingId(null);
  }

  function toggleGroup(key: string) {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const groups = groupConversations(conversations);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="px-3 pb-3 pt-3">
        <button
          type="button"
          onClick={onNew}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Cuộc trò chuyện mới
        </button>
      </div>

      {/* AI Mentor Workspace — 4 nhóm placeholder (EPIC-UX-002) */}
      <div className="space-y-0.5 border-b border-gray-100 px-2 pb-2">
        {WORKSPACE_GROUPS.map((g) => {
          const open = !!openGroups[g.key];
          return (
            <div key={g.key}>
              <WorkspaceGroupHeader emoji={g.emoji} label={g.label} open={open} onToggle={() => toggleGroup(g.key)} />
              {open && <p className="px-2.5 pb-2 pl-9 text-xs leading-relaxed text-gray-400">{g.placeholder}</p>}
            </div>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        <p className="flex items-center gap-1.5 px-2.5 pb-1.5 pt-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
          <span aria-hidden="true">💬</span> Cuộc trò chuyện
        </p>
        {conversations.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs leading-relaxed text-gray-400">
            Chưa có cuộc trò chuyện nào. Gửi tin nhắn đầu tiên để bắt đầu.
          </p>
        ) : (
          groups.map((group) => (
            <div key={group.label} className="mb-1">
              <p className="px-2.5 pb-1.5 pt-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((c) => {
                  const isActive = c.id === activeConversationId;
                  return (
                    <li key={c.id}>
                      <div
                        className={`group flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm transition ${
                          isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {editingId === c.id ? (
                          <input
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={commitEdit}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitEdit();
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            className="min-w-0 flex-1 rounded-lg border border-blue-300 bg-white px-2 py-1 text-sm outline-none"
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => onSelect(c.id)}
                            className="flex min-w-0 flex-1 items-center gap-2 text-left"
                          >
                            <MessageCircle className="h-3.5 w-3.5 shrink-0 opacity-60" />
                            <span className="truncate">{c.title}</span>
                          </button>
                        )}
                        {editingId !== c.id && (
                          <div className="hidden shrink-0 items-center gap-0.5 group-hover:flex">
                            <button
                              type="button"
                              aria-label="Đổi tên"
                              onClick={() => startEdit(c)}
                              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              aria-label="Xoá cuộc trò chuyện"
                              onClick={() => {
                                if (window.confirm(`Xoá cuộc trò chuyện "${c.title}"? Không thể hoàn tác.`)) {
                                  onDelete(c.id);
                                }
                              }}
                              className="rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
