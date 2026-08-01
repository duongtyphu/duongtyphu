"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, MessageCircle } from "lucide-react";
import type { CompanionConversationSummary } from "@/app/portal/companion/actions";

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

  return (
    <div className="flex h-full w-full flex-col">
      <div className="px-3 pb-3 pt-1">
        <p className="mb-2 px-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-500">Companion</p>
        <button
          type="button"
          onClick={onNew}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Cuộc trò chuyện mới
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {conversations.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs leading-relaxed text-gray-400">
            Chưa có cuộc trò chuyện nào. Gửi tin nhắn đầu tiên để bắt đầu.
          </p>
        ) : (
          <ul className="space-y-1">
            {conversations.map((c) => {
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
        )}
      </div>
    </div>
  );
}
