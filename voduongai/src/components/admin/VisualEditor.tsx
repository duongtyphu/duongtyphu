"use client";

import { useState } from "react";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { useCollection } from "@/lib/admin/store";
import { DataTableRowPanel } from "@/components/admin/DataTableRowPanel";
import type { FieldConfig } from "@/lib/admin/fields";

type BaseItem = { id: string; status?: string };

/**
 * Hover-to-edit + kéo-thả — dùng riêng cho collection có thứ tự hiển thị
 * quan trọng (home-cards, projects). Toàn client, dùng thẳng
 * useCollection().items/reorder/remove (đã gọi đúng API PUT bulk-replace/
 * DELETE có sẵn, không viết Server Action mới). Form sửa chi tiết tái dùng
 * DataTableRowPanel — không viết form riêng lần 2.
 */
export function VisualEditor<T extends BaseItem>({
  collectionKey,
  title,
  itemNoun = "mục",
  fields,
  renderCard,
}: {
  collectionKey: string;
  title: string;
  itemNoun?: string;
  fields: FieldConfig[];
  renderCard: (item: T) => React.ReactNode;
}) {
  const { items, ready, add, update, remove, reorder } = useCollection<T>(collectionKey, []);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function openCreate() {
    setEditing(null);
    setPanelOpen(true);
  }

  function openEdit(item: T) {
    setEditing(item);
    setPanelOpen(true);
  }

  async function handleDelete(item: T) {
    if (!window.confirm(`Xoá "${item.id}"? Không thể hoàn tác.`)) return;
    await remove(item.id);
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }
    const next = [...items];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    reorder(next);
    setDragIndex(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-extrabold text-gray-900">
          {title}
          {ready ? ` — ${items.length} ${itemNoun}` : ""}
        </h1>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
        >
          Thêm mới
        </button>
      </div>

      {!ready ? (
        <p className="text-sm text-gray-500">Đang tải...</p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500">
          Chưa có dữ liệu nào. Bấm &quot;Thêm mới&quot; để tạo nội dung đầu tiên.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
              className="group relative flex items-start gap-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-brand-blue/40"
            >
              <GripVertical className="mt-0.5 h-4 w-4 shrink-0 cursor-grab text-gray-300" />
              <div className="min-w-0 flex-1">{renderCard(item)}</div>
              <div className="flex shrink-0 flex-col gap-1 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  aria-label="Sửa"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-brand-blue hover:text-brand-blue"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  aria-label="Xoá"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DataTableRowPanel
        open={panelOpen}
        collectionKey={collectionKey}
        title={title}
        fields={fields}
        item={editing}
        onClose={() => setPanelOpen(false)}
        mutators={{ add, update }}
      />
    </div>
  );
}
