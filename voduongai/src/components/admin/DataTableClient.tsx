"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useCollection } from "@/lib/admin/store";
import { DataTableRowPanel } from "@/components/admin/DataTableRowPanel";
import { isRowIncomplete, type ColumnConfig, type FieldConfig } from "@/lib/admin/fields";

type BaseItem = { id: string; status?: string };

/**
 * Phần hiển thị bảng — nhận `initialItems` từ DataTable (Server Component),
 * KHÔNG giữ bản sao state riêng ngoài props (tránh 2 nguồn sự thật). Sau khi
 * thêm/sửa/xoá, gọi router.refresh() để Server Component fetch lại và
 * DataTable truyền initialItems mới xuống.
 */
export function DataTableClient<T extends BaseItem>({
  collectionKey,
  title,
  columns,
  fields,
  initialItems,
}: {
  collectionKey: string;
  title: string;
  columns: ColumnConfig<T>[];
  fields: FieldConfig[];
  initialItems: T[];
}) {
  const router = useRouter();
  const { remove } = useCollection<T>(collectionKey, []);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);

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
    router.refresh();
  }

  function handleSaved() {
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-extrabold text-gray-900">{title}</h1>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-1.5 rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Thêm mới
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {initialItems.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-sm text-gray-500">
                  Chưa có dữ liệu nào. Bấm &quot;Thêm mới&quot; để tạo nội dung đầu tiên.
                </td>
              </tr>
            ) : (
              initialItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-gray-700">
                      {isRowIncomplete(col, item) ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                          {col.emptyLabel ?? "Thiếu thông tin"}
                        </span>
                      ) : col.render ? (
                        col.render(item)
                      ) : (
                        String((item as Record<string, unknown>)[col.key] ?? "")
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        aria-label="Sửa"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-brand-blue hover:text-brand-blue"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        aria-label="Xoá"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DataTableRowPanel
        open={panelOpen}
        collectionKey={collectionKey}
        title={title}
        fields={fields}
        item={editing}
        onClose={() => setPanelOpen(false)}
        onSaved={handleSaved}
      />
    </div>
  );
}
