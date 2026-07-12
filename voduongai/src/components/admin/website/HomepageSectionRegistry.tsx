"use client";

import { useMemo, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { Modal, ConfirmDialog } from "@/components/admin/ui/Modal";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import {
  HOMEPAGE_SECTION_STATUSES,
  HOMEPAGE_SECTIONS_COLLECTION_KEY,
  HOMEPAGE_SECTIONS_SEED,
  emptyHomepageSection,
  type HomepageSection,
} from "@/lib/admin/website/homepageSectionRegistry";
import { SHARED_SECTIONS_COLLECTION_KEY, SHARED_SECTIONS_SEED, type SharedSection } from "@/lib/admin/website/sharedSectionRegistry";

/**
 * Homepage Section Order (Task 3) — đúng thứ tự render THẬT của trang chủ
 * (11 section, khớp `src/app/page.tsx`). Reorder bằng ↑/↓ (swap sortOrder),
 * không kéo-thả. Visible tách riêng khỏi Status (đúng nguyên tắc đã áp
 * dụng cho Navigation Item, WEB-SPR-202).
 */
export function HomepageSectionRegistry() {
  const { items, ready, add, update, remove } = useCollection<HomepageSection>(
    HOMEPAGE_SECTIONS_COLLECTION_KEY,
    HOMEPAGE_SECTIONS_SEED
  );
  const { items: sharedSections } = useCollection<SharedSection>(SHARED_SECTIONS_COLLECTION_KEY, SHARED_SECTIONS_SEED);
  const { push } = useAdminToast();

  const sorted = useMemo(() => [...items].sort((a, b) => a.sortOrder - b.sortOrder), [items]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<HomepageSection | null>(null);
  const [form, setForm] = useState<HomepageSection>({ id: "", ...emptyHomepageSection() });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function sharedSectionLabel(id: string) {
    const s = sharedSections.find((s) => s.id === id);
    return s ? `${s.title} (${s.category})` : "—";
  }

  function moveSection(section: HomepageSection, direction: -1 | 1) {
    const idx = sorted.findIndex((s) => s.id === section.id);
    const neighbor = sorted[idx + direction];
    if (!neighbor) return;
    update(section.id, { sortOrder: neighbor.sortOrder });
    update(neighbor.id, { sortOrder: section.sortOrder });
  }
  function toggleVisible(section: HomepageSection) {
    update(section.id, { visible: !section.visible });
  }

  function openCreate() {
    setEditing(null);
    setForm({ id: "", ...emptyHomepageSection(), sortOrder: sorted.length + 1 });
    setModalOpen(true);
  }
  function openEdit(section: HomepageSection) {
    setEditing(section);
    setForm({ ...section });
    setModalOpen(true);
  }
  function handleSave() {
    if (!form.label.trim() || !form.componentName.trim()) {
      push('Vui lòng nhập "Component Name" và "Label"', "error");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    if (editing) {
      update(editing.id, { ...form, updatedDate: today });
      push("Đã lưu thay đổi.");
    } else {
      add({ ...form, id: genId(HOMEPAGE_SECTIONS_COLLECTION_KEY), updatedDate: today });
      push("Đã thêm Homepage Section mới.");
    }
    setModalOpen(false);
  }
  function handleDelete() {
    if (!deleteId) return;
    remove(deleteId);
    push("Đã xóa.", "info");
    setDeleteId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/40">{sorted.length} section — đúng thứ tự render thật trong src/app/page.tsx</p>
        <button
          onClick={openCreate}
          className="rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
        >
          + Thêm Section
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
        {!ready ? (
          <div className="space-y-2 p-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="p-10 text-center text-sm text-white/40">Chưa có Homepage Section nào.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Section</th>
                <th className="px-4 py-3 font-semibold">CTA</th>
                <th className="px-4 py-3 font-semibold">Nội dung (Shared Section)</th>
                <th className="px-4 py-3 font-semibold">Ẩn/Hiện</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((section) => (
                <tr key={section.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="px-4 py-3 text-white/40">{section.sortOrder}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(section)} className="text-left font-semibold text-white hover:text-brand-blue">
                      {section.label || "(chưa đặt tên)"}
                    </button>
                    <p className="mt-0.5 text-xs text-white/40">src/components/home/{section.componentName}.tsx</p>
                  </td>
                  <td className="px-4 py-3 text-white/60">{section.hasCta ? "Có" : "—"}</td>
                  <td className="px-4 py-3 text-white/60">{sharedSectionLabel(section.sharedSectionId)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleVisible(section)}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        section.visible ? "bg-emerald-500/15 text-emerald-300" : "bg-white/5 text-white/40"
                      }`}
                    >
                      {section.visible ? "Hiện" : "Ẩn"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[section.status] ?? "gray"}>{section.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => moveSection(section, -1)}
                      disabled={sorted[0]?.id === section.id}
                      title="Đưa lên trên"
                      className="mr-1 rounded-lg border border-white/10 px-2 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveSection(section, 1)}
                      disabled={sorted[sorted.length - 1]?.id === section.id}
                      title="Đưa xuống dưới"
                      className="mr-1.5 rounded-lg border border-white/10 px-2 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => openEdit(section)}
                      className="mr-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => setDeleteId(section.id)}
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

      <Modal open={modalOpen} title={editing ? "Sửa Homepage Section" : "Thêm Homepage Section mới"} onClose={() => setModalOpen(false)} width="max-w-lg">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
              Label <span className="text-brand-orange">*</span>
            </label>
            <input
              value={form.label}
              onChange={(e) => setForm((s) => ({ ...s, label: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
              Component Name (src/components/home/*.tsx) <span className="text-brand-orange">*</span>
            </label>
            <input
              value={form.componentName}
              onChange={(e) => setForm((s) => ({ ...s, componentName: e.target.value }))}
              placeholder="Hero"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Shared Section liên kết (tuỳ chọn)</label>
            <select
              value={form.sharedSectionId}
              onChange={(e) => setForm((s) => ({ ...s, sharedSectionId: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            >
              <option value="">— Không liên kết —</option>
              {sharedSections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.category})
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-white/80">
            <input
              type="checkbox"
              checked={form.hasCta}
              onChange={(e) => setForm((s) => ({ ...s, hasCta: e.target.checked }))}
              className="h-4 w-4 rounded border-white/20 bg-white/5"
            />
            Có CTA riêng trong section này
          </label>
          <label className="flex items-center gap-2 text-sm text-white/80">
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) => setForm((s) => ({ ...s, visible: e.target.checked }))}
              className="h-4 w-4 rounded border-white/20 bg-white/5"
            />
            Hiển thị (ẩn/hiện — tách riêng khỏi Status)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as HomepageSection["status"] }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              >
                {HOMEPAGE_SECTION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Sort Order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((s) => ({ ...s, sortOrder: Number(e.target.value) }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => setModalOpen(false)}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10"
          >
            Hủy
          </button>
          <button onClick={handleSave} className="rounded-lg bg-brand-blue px-5 py-2 text-sm font-bold text-white hover:opacity-90">
            Lưu
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Xóa Homepage Section này?"
        description="Hành động này không thể hoàn tác."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
