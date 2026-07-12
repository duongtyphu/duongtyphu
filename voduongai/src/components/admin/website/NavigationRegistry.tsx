"use client";

import { useMemo, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { Modal, ConfirmDialog } from "@/components/admin/ui/Modal";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import {
  NAVIGATION_LOCATIONS,
  NAVIGATION_STATUSES,
  NAVIGATION_GROUPS_COLLECTION_KEY,
  NAVIGATION_ITEMS_COLLECTION_KEY,
  NAVIGATION_GROUPS_SEED,
  NAVIGATION_ITEMS_SEED,
  VISIBILITY_RULES,
  emptyNavigationGroup,
  emptyNavigationItem,
  type NavigationGroup,
  type NavigationItem,
  type NavigationLocation,
} from "@/lib/admin/website/navigationRegistry";

/**
 * Navigation Registry (WEB-SPR-003 Task 1/2/3) — Groups (Task 2) ở bảng
 * trên, Items (Task 3) của Group đang chọn ở bảng dưới. Sắp xếp bằng field
 * số `sortOrder` nhập tay — KHÔNG có kéo-thả (Không xây Drag & Drop, theo
 * brief). Không lồng cấp con cho Item (không Mega Menu Builder).
 */
export function NavigationRegistry() {
  const groupsCollection = useCollection<NavigationGroup>(NAVIGATION_GROUPS_COLLECTION_KEY, NAVIGATION_GROUPS_SEED);
  const itemsCollection = useCollection<NavigationItem>(NAVIGATION_ITEMS_COLLECTION_KEY, NAVIGATION_ITEMS_SEED);
  const { push } = useAdminToast();

  const { items: groups, ready: groupsReady, add: addGroup, update: updateGroup, remove: removeGroup } = groupsCollection;
  const { items: allItems, ready: itemsReady, add: addItem, update: updateItem, remove: removeItem, set: setItems } = itemsCollection;

  const [explicitSelectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const sortedGroups = useMemo(() => [...groups].sort((a, b) => a.sortOrder - b.sortOrder), [groups]);
  // Không dùng useEffect để đồng bộ state này — chọn Group đầu tiên làm mặc
  // định ngay trong lúc render khi chưa có lựa chọn tường minh nào, tránh
  // setState trong effect gây cascading render.
  const selectedGroupId = explicitSelectedGroupId ?? sortedGroups[0]?.id ?? null;
  const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? null;
  const groupItems = useMemo(
    () => allItems.filter((it) => it.groupId === selectedGroupId).sort((a, b) => a.sortOrder - b.sortOrder),
    [allItems, selectedGroupId]
  );
  const itemCountFor = (groupId: string) => allItems.filter((it) => it.groupId === groupId).length;

  // ── Group modal state ──
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<NavigationGroup | null>(null);
  const [groupForm, setGroupForm] = useState<NavigationGroup>({ id: "", ...emptyNavigationGroup() });
  const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null);

  function openCreateGroup() {
    setEditingGroup(null);
    setGroupForm({ id: "", ...emptyNavigationGroup() });
    setGroupModalOpen(true);
  }
  function openEditGroup(group: NavigationGroup) {
    setEditingGroup(group);
    setGroupForm({ ...group });
    setGroupModalOpen(true);
  }
  function handleSaveGroup() {
    if (!groupForm.name.trim()) {
      push('Vui lòng nhập "Tên Group"', "error");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    if (editingGroup) {
      updateGroup(editingGroup.id, { ...groupForm, updatedDate: today });
      push("Đã lưu thay đổi.");
    } else {
      const id = genId(NAVIGATION_GROUPS_COLLECTION_KEY);
      addGroup({ ...groupForm, id, updatedDate: today });
      setSelectedGroupId(id);
      push("Đã thêm Navigation Group mới.");
    }
    setGroupModalOpen(false);
  }
  function handleDeleteGroup() {
    if (!deleteGroupId) return;
    removeGroup(deleteGroupId);
    setItems(allItems.filter((it) => it.groupId !== deleteGroupId));
    if (selectedGroupId === deleteGroupId) setSelectedGroupId(null);
    push("Đã xóa Group và toàn bộ Item bên trong.", "info");
    setDeleteGroupId(null);
  }

  // ── Item modal state ──
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [itemForm, setItemForm] = useState<NavigationItem>({ id: "", ...emptyNavigationItem(selectedGroupId ?? "") });
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  function openCreateItem() {
    if (!selectedGroupId) return;
    setEditingItem(null);
    setItemForm({ id: "", ...emptyNavigationItem(selectedGroupId) });
    setItemModalOpen(true);
  }
  function openEditItem(item: NavigationItem) {
    setEditingItem(item);
    setItemForm({ ...item });
    setItemModalOpen(true);
  }
  function handleSaveItem() {
    if (!itemForm.label.trim()) {
      push('Vui lòng nhập "Label"', "error");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    if (editingItem) {
      updateItem(editingItem.id, { ...itemForm, updatedDate: today });
      push("Đã lưu thay đổi.");
    } else {
      addItem({ ...itemForm, id: genId(NAVIGATION_ITEMS_COLLECTION_KEY), updatedDate: today });
      push("Đã thêm Navigation Item mới.");
    }
    setItemModalOpen(false);
  }
  function handleDeleteItem() {
    if (!deleteItemId) return;
    removeItem(deleteItemId);
    push("Đã xóa.", "info");
    setDeleteItemId(null);
  }

  return (
    <div className="space-y-6">
      {/* Groups */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Navigation Group</h3>
          <button
            onClick={openCreateGroup}
            className="rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
          >
            + Thêm Group
          </button>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
          {!groupsReady ? (
            <div className="space-y-2 p-5">
              {[1, 2].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-white/5" />
              ))}
            </div>
          ) : sortedGroups.length === 0 ? (
            <div className="p-10 text-center text-sm text-white/40">Chưa có Navigation Group nào.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="px-4 py-3 font-semibold">Tên Group</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Sort Order</th>
                  <th className="px-4 py-3 font-semibold">Items</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {sortedGroups.map((group) => (
                  <tr
                    key={group.id}
                    className={`border-b border-white/5 hover:bg-white/[0.03] ${
                      selectedGroupId === group.id ? "bg-brand-blue/10" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedGroupId(group.id)}
                        className="text-left font-semibold text-white hover:text-brand-blue"
                      >
                        {group.name || "(chưa đặt tên)"}
                      </button>
                      {group.description && <p className="mt-0.5 text-xs text-white/40">{group.description}</p>}
                    </td>
                    <td className="px-4 py-3 text-white/60">{group.location}</td>
                    <td className="px-4 py-3">
                      <Badge tone={STATUS_TONE[group.status] ?? "gray"}>{group.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-white/60">{group.sortOrder}</td>
                    <td className="px-4 py-3 text-white/60">{itemCountFor(group.id)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedGroupId(group.id)}
                        className="mr-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                      >
                        Quản lý Item
                      </button>
                      <button
                        onClick={() => openEditGroup(group)}
                        className="mr-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => setDeleteGroupId(group.id)}
                        className="rounded-lg border border-red-400/20 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/10"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Items of selected group */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            Navigation Item {selectedGroup ? <span className="font-normal text-white/40">— {selectedGroup.name}</span> : null}
          </h3>
          <button
            onClick={openCreateItem}
            disabled={!selectedGroup}
            className="rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            + Thêm Item
          </button>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
          {!selectedGroup ? (
            <div className="p-10 text-center text-sm text-white/40">Chọn một Navigation Group ở trên để quản lý Item.</div>
          ) : !itemsReady ? (
            <div className="space-y-2 p-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-white/5" />
              ))}
            </div>
          ) : groupItems.length === 0 ? (
            <div className="p-10 text-center text-sm text-white/40">Group này chưa có Item nào.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="px-4 py-3 font-semibold">Label</th>
                  <th className="px-4 py-3 font-semibold">URL</th>
                  <th className="px-4 py-3 font-semibold">Visibility Rule</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Sort Order</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {groupItems.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                    <td className="px-4 py-3">
                      <button onClick={() => openEditItem(item)} className="text-left font-semibold text-white hover:text-brand-blue">
                        {item.label || "(chưa đặt label)"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-white/60">{item.url || "—"}</td>
                    <td className="px-4 py-3 text-white/60">{item.visibilityRule}</td>
                    <td className="px-4 py-3">
                      <Badge tone={STATUS_TONE[item.status] ?? "gray"}>{item.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-white/60">{item.sortOrder}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEditItem(item)}
                        className="mr-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => setDeleteItemId(item.id)}
                        className="rounded-lg border border-red-400/20 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/10"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <p className="text-xs text-white/40">
          Visibility Rule ở đây chỉ là metadata mô tả ý định hiển thị — chưa có Permission Engine thực thi (ngoài phạm vi
          Foundation này).
        </p>
      </div>

      {/* Group modal */}
      <Modal
        open={groupModalOpen}
        title={editingGroup ? "Sửa Navigation Group" : "Thêm Navigation Group mới"}
        onClose={() => setGroupModalOpen(false)}
        width="max-w-lg"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
              Tên Group <span className="text-brand-orange">*</span>
            </label>
            <input
              value={groupForm.name}
              onChange={(e) => setGroupForm((s) => ({ ...s, name: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Location</label>
            <select
              value={groupForm.location}
              onChange={(e) => setGroupForm((s) => ({ ...s, location: e.target.value as NavigationLocation }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            >
              {NAVIGATION_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Mô tả</label>
            <textarea
              value={groupForm.description}
              onChange={(e) => setGroupForm((s) => ({ ...s, description: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Sort Order</label>
              <input
                type="number"
                value={groupForm.sortOrder}
                onChange={(e) => setGroupForm((s) => ({ ...s, sortOrder: Number(e.target.value) }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Status</label>
              <select
                value={groupForm.status}
                onChange={(e) => setGroupForm((s) => ({ ...s, status: e.target.value as NavigationGroup["status"] }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              >
                {NAVIGATION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => setGroupModalOpen(false)}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10"
          >
            Hủy
          </button>
          <button onClick={handleSaveGroup} className="rounded-lg bg-brand-blue px-5 py-2 text-sm font-bold text-white hover:opacity-90">
            Lưu
          </button>
        </div>
      </Modal>

      {/* Item modal */}
      <Modal
        open={itemModalOpen}
        title={editingItem ? "Sửa Navigation Item" : "Thêm Navigation Item mới"}
        onClose={() => setItemModalOpen(false)}
        width="max-w-lg"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
              Label <span className="text-brand-orange">*</span>
            </label>
            <input
              value={itemForm.label}
              onChange={(e) => setItemForm((s) => ({ ...s, label: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">URL</label>
            <input
              value={itemForm.url}
              onChange={(e) => setItemForm((s) => ({ ...s, url: e.target.value }))}
              placeholder="/portal/..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Visibility Rule</label>
            <select
              value={itemForm.visibilityRule}
              onChange={(e) => setItemForm((s) => ({ ...s, visibilityRule: e.target.value as NavigationItem["visibilityRule"] }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            >
              {VISIBILITY_RULES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Sort Order</label>
              <input
                type="number"
                value={itemForm.sortOrder}
                onChange={(e) => setItemForm((s) => ({ ...s, sortOrder: Number(e.target.value) }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Status</label>
              <select
                value={itemForm.status}
                onChange={(e) => setItemForm((s) => ({ ...s, status: e.target.value as NavigationItem["status"] }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              >
                {NAVIGATION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => setItemModalOpen(false)}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10"
          >
            Hủy
          </button>
          <button onClick={handleSaveItem} className="rounded-lg bg-brand-blue px-5 py-2 text-sm font-bold text-white hover:opacity-90">
            Lưu
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteGroupId}
        title="Xóa Navigation Group này?"
        description="Toàn bộ Item bên trong Group cũng sẽ bị xóa. Hành động này không thể hoàn tác."
        onCancel={() => setDeleteGroupId(null)}
        onConfirm={handleDeleteGroup}
      />
      <ConfirmDialog
        open={!!deleteItemId}
        title="Xóa Navigation Item này?"
        description="Hành động này không thể hoàn tác."
        onCancel={() => setDeleteItemId(null)}
        onConfirm={handleDeleteItem}
      />
    </div>
  );
}
