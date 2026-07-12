"use client";

import { useState } from "react";
import { useCollection } from "@/lib/admin/store";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import { Modal } from "@/components/admin/ui/Modal";
import {
  PORTAL_AREAS_COLLECTION_KEY,
  PORTAL_AREAS_SEED,
  PORTAL_STATUSES,
  type PortalArea,
} from "@/lib/admin/portal/areaRegistry";
import { WORKSPACE_OWNERS } from "@/lib/admin/workspaceOwnership";

/**
 * Portal Area Table (Task 1-3) — 10 Area cố định, chỉ Edit (không Add/
 * Delete — xem ghi chú `areaRegistry.ts`). Founder đổi tên hiển thị/
 * ẩn-hiện/đổi thứ tự/chọn Workspace Owner qua modal, không sửa code.
 */
export function PortalAreaTable({ selectedId, onSelect }: { selectedId: string | null; onSelect: (id: string) => void }) {
  const { items, ready, update } = useCollection<PortalArea>(PORTAL_AREAS_COLLECTION_KEY, PORTAL_AREAS_SEED);
  const [editing, setEditing] = useState<PortalArea | null>(null);
  const [form, setForm] = useState<PortalArea | null>(null);

  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);

  function openEdit(area: PortalArea) {
    setEditing(area);
    setForm({ ...area });
  }
  function handleSave() {
    if (!form || !editing) return;
    update(editing.id, { ...form, updatedDate: new Date().toISOString().slice(0, 10) });
    setEditing(null);
    setForm(null);
  }
  function move(area: PortalArea, dir: -1 | 1) {
    const idx = sorted.findIndex((a) => a.id === area.id);
    const target = sorted[idx + dir];
    if (!target) return;
    update(area.id, { sortOrder: target.sortOrder });
    update(target.id, { sortOrder: area.sortOrder });
  }

  if (!ready) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-white/40">
            <th className="px-4 py-3 font-semibold">Portal Area</th>
            <th className="px-4 py-3 font-semibold">Href</th>
            <th className="px-4 py-3 font-semibold">Workspace Owner</th>
            <th className="px-4 py-3 font-semibold">Ẩn/Hiện</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((area, idx) => (
            <tr
              key={area.id}
              className={`border-b border-white/5 hover:bg-white/[0.03] ${selectedId === area.id ? "bg-brand-blue/10" : ""}`}
            >
              <td className="px-4 py-3">
                <button onClick={() => onSelect(area.id)} className="text-left font-semibold text-white hover:text-brand-blue">
                  {area.label}
                </button>
              </td>
              <td className="px-4 py-3 font-mono text-white/60">{area.href}</td>
              <td className="px-4 py-3 text-white/60">{area.ownerWorkspace || "Chưa xác định"}</td>
              <td className="px-4 py-3 text-white/60">{area.visible ? "Hiện" : "Ẩn"}</td>
              <td className="px-4 py-3">
                <Badge tone={STATUS_TONE[area.status] ?? "gray"}>{area.status}</Badge>
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <button onClick={() => move(area, -1)} disabled={idx === 0} className="mr-1 rounded-lg border border-white/10 px-2 py-1.5 text-xs text-white/70 hover:bg-white/10 disabled:opacity-30">
                  ↑
                </button>
                <button onClick={() => move(area, 1)} disabled={idx === sorted.length - 1} className="mr-1.5 rounded-lg border border-white/10 px-2 py-1.5 text-xs text-white/70 hover:bg-white/10 disabled:opacity-30">
                  ↓
                </button>
                <button onClick={() => openEdit(area)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10">
                  Sửa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {form && (
        <Modal open={!!editing} title={`Sửa Portal Area — ${editing?.label}`} onClose={() => setEditing(null)}>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Tên hiển thị</label>
              <input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Workspace Owner</label>
              <input
                list="workspace-owner-options"
                value={form.ownerWorkspace}
                onChange={(e) => setForm({ ...form, ownerWorkspace: e.target.value })}
                placeholder="Để trống nếu chưa xác định"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
              />
              <datalist id="workspace-owner-options">
                {WORKSPACE_OWNERS.map((w) => (
                  <option key={w.key} value={w.name} />
                ))}
              </datalist>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Trạng thái</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as PortalArea["status"] })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
                >
                  {PORTAL_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 pt-6 text-sm text-white/70">
                <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} />
                Hiện trên menu Portal
              </label>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={() => setEditing(null)} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10">
              Hủy
            </button>
            <button onClick={handleSave} className="rounded-lg bg-brand-blue px-5 py-2 text-sm font-bold text-white hover:opacity-90">
              Lưu
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
