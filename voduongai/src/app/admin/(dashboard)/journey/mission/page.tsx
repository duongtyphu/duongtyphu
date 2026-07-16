"use client";

import { useState } from "react";
import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { JOURNEY_COMMUNITY_SECTIONS } from "@/lib/admin/journeyCommunity/navigation";
import { useCollection } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import {
  MISSION_PRESENTATION_COLLECTION_KEY,
  MISSION_PRESENTATION_ID,
  MISSION_PRESENTATION_SEED,
  parseTripleLines,
  parseQuadLines,
  parseDualLines,
  objectsToLines,
  linesToArray,
  type MissionPresentation,
} from "@/lib/admin/journey/missionPresentation";

const textareaClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none";

/**
 * PMO-HARDENING-CONT Workstream 3 — Sứ mệnh Companion (Mission Presentation).
 * Trước sprint này 100% hardcode trong `/portal/su-menh-companion/page.tsx`.
 * Form dạng "mỗi dòng 1 mục, field cách nhau ` | `" thay vì UI thêm/xoá từng
 * field — đủ dùng cho nội dung danh sách cố định này, nhanh hơn nhiều so với
 * dựng UI nested add/remove cho 6 mảng khác nhau.
 */
export default function MissionPresentationPage() {
  const { items, ready, add, update } = useCollection<MissionPresentation>(
    MISSION_PRESENTATION_COLLECTION_KEY,
    MISSION_PRESENTATION_SEED
  );
  const { push } = useAdminToast();
  const record = items.find((r) => r.id === MISSION_PRESENTATION_ID) ?? null;

  const [localEdits, setLocalEdits] = useState<MissionPresentation | null>(null);
  const form = localEdits ?? record;

  if (!ready || !form) {
    return (
      <AdminWorkspaceShell title="Hành trình & Cộng đồng" description="" rootHref="/admin/journey" sections={JOURNEY_COMMUNITY_SECTIONS}>
        <div className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
      </AdminWorkspaceShell>
    );
  }

  function setForm(updater: (s: MissionPresentation) => MissionPresentation) {
    setLocalEdits(updater(form!));
  }

  function handleSave() {
    if (!form) return;
    const next = { ...form, updatedDate: new Date().toISOString().slice(0, 10) };
    if (record) update(MISSION_PRESENTATION_ID, next);
    else add(next);
    setLocalEdits(next);
    push("Đã lưu Sứ mệnh Companion.");
  }

  return (
    <AdminWorkspaceShell title="Hành trình & Cộng đồng" description="" rootHref="/admin/journey" sections={JOURNEY_COMMUNITY_SECTIONS}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-white">Sứ mệnh Companion</h1>
            <p className="mt-1 text-sm text-white/50">
              Nội dung <code>/portal/su-menh-companion</code> — Genome/Triết lý/Hiến chương/Sứ mệnh/Tiến hóa/Timeline.
              Cập nhật lần cuối: {form.updatedDate}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={form.status}
              onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as MissionPresentation["status"] }))}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white focus:border-brand-blue focus:outline-none"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
            <button onClick={handleSave} className="rounded-lg bg-brand-blue px-5 py-2 text-sm font-bold text-white hover:opacity-90">
              Lưu
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
            Companion Genome — mỗi dòng: key | Label | Ý nghĩa (12 gene)
          </label>
          <textarea
            rows={8}
            value={objectsToLines(form.genome, ["key", "label", "meaning"])}
            onChange={(e) =>
              setForm((s) => ({ ...s, genome: parseTripleLines(e.target.value, ["key", "label", "meaning"]) }))
            }
            className={textareaClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
            Triết lý — mỗi dòng: câu AI | câu Companion
          </label>
          <textarea
            rows={4}
            value={objectsToLines(form.philosophyPairs, ["ai", "companion"])}
            onChange={(e) => setForm((s) => ({ ...s, philosophyPairs: parseDualLines(e.target.value, ["ai", "companion"]) }))}
            className={textareaClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
              The Companion Constitution — mỗi dòng 1 điều luật
            </label>
            <textarea
              rows={10}
              value={form.constitution.join("\n")}
              onChange={(e) => setForm((s) => ({ ...s, constitution: linesToArray(e.target.value) }))}
              className={textareaClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
              Sứ mệnh — mỗi dòng 1 mục
            </label>
            <textarea
              rows={10}
              value={form.missionItems.join("\n")}
              onChange={(e) => setForm((s) => ({ ...s, missionItems: linesToArray(e.target.value) }))}
              className={textareaClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
            Logo Evolution — mỗi dòng: Stage | icon (seed/sprout/leaf/sparkles/infinity) | Ý nghĩa
          </label>
          <textarea
            rows={6}
            value={objectsToLines(form.evolution, ["stage", "icon", "meaning"])}
            onChange={(e) => setForm((s) => ({ ...s, evolution: parseTripleLines(e.target.value, ["stage", "icon", "meaning"]) }))}
            className={textareaClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
            Companion Timeline — mỗi dòng: Giai đoạn | Triết lý | Ý nghĩa | Điều học được
          </label>
          <textarea
            rows={8}
            value={objectsToLines(form.timeline, ["stage", "philosophy", "meaning", "lesson"])}
            onChange={(e) =>
              setForm((s) => ({
                ...s,
                timeline: parseQuadLines(e.target.value, ["stage", "philosophy", "meaning", "lesson"]),
              }))
            }
            className={textareaClass}
          />
        </div>

        <div className="flex justify-end">
          <button onClick={handleSave} className="rounded-lg bg-brand-blue px-5 py-2 text-sm font-bold text-white hover:opacity-90">
            Lưu
          </button>
        </div>
      </div>
    </AdminWorkspaceShell>
  );
}
