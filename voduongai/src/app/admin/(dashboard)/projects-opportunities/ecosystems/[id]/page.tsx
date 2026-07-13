"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { PROJECTS_OPPORTUNITIES_SECTIONS } from "@/lib/admin/projectsOpportunities/navigation";
import { ConfirmDialog } from "@/components/admin/ui/Modal";
import { useCollection, genId } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import {
  ecosystemsSeed,
  ECOSYSTEMS_COLLECTION_KEY,
  STRUCTURE_TYPE_OPTIONS,
  POTENTIAL_ANALYSIS_STATUS_OPTIONS,
  DEFAULT_POTENTIAL_ANALYSIS,
  type Ecosystem,
  type EcosystemLink,
  type SubProject,
  type EcosystemFieldBox,
  type FaqItem,
  type PotentialAnalysisItem,
} from "@/data/portal/ecosystems";
import { digitalAssetArticles, digitalAssetCategories, type DigitalAssetArticle } from "@/data/digitalAssets";
import { ECOSYSTEM_ICON_OPTIONS, ECOSYSTEM_COLOR_OPTIONS } from "@/components/portal/opportunities/ecosystemVisuals";

const TABS = ["Cơ bản", "Nội dung", "CTA & Link", "Dự án con", "Hai mảng", "Tiêu chí đánh giá", "FAQ", "Bài viết liên quan", "SEO & Publish"] as const;
type Tab = (typeof TABS)[number];

const inputClass = "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none";
const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function LinkListEditor({ links, onChange, showCategory }: { links: EcosystemLink[]; onChange: (next: EcosystemLink[]) => void; showCategory?: boolean }) {
  function update(id: string, patch: Partial<EcosystemLink>) {
    onChange(links.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }
  function remove(id: string) {
    onChange(links.filter((l) => l.id !== id));
  }
  function addRow() {
    onChange([...links, { id: genId("link"), label: "", url: "", category: showCategory ? "" : undefined, order: links.length + 1, visible: true }]);
  }

  return (
    <div className="space-y-2">
      {links.map((l) => (
        <div key={l.id} className="grid grid-cols-1 gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-3 sm:grid-cols-12 sm:items-center">
          <input value={l.label} onChange={(e) => update(l.id, { label: e.target.value })} placeholder="Nhãn CTA (VD: Đăng ký ngay)" className={`${inputClass} sm:col-span-3`} />
          <input value={l.url} onChange={(e) => update(l.id, { url: e.target.value })} placeholder="https:// (để trống nếu chưa có link thật)" className={`${inputClass} sm:col-span-4`} />
          {showCategory && (
            <input value={l.category ?? ""} onChange={(e) => update(l.id, { category: e.target.value })} placeholder="Danh mục (VD: Sàn TMĐT)" className={`${inputClass} sm:col-span-2`} />
          )}
          <input type="number" value={l.order} onChange={(e) => update(l.id, { order: Number(e.target.value) })} className={`${inputClass} ${showCategory ? "sm:col-span-1" : "sm:col-span-2"}`} />
          <label className="flex items-center gap-1.5 text-xs text-white/60 sm:col-span-1">
            <input type="checkbox" checked={l.visible} onChange={(e) => update(l.id, { visible: e.target.checked })} />
            Hiện
          </label>
          <button onClick={() => remove(l.id)} className="rounded-lg p-1.5 text-red-300 hover:bg-red-500/10 sm:col-span-1" aria-label="Xóa link">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button onClick={addRow} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10">
        + Thêm link
      </button>
    </div>
  );
}

function FaqListEditor({ items, onChange }: { items: FaqItem[]; onChange: (next: FaqItem[]) => void }) {
  function update(id: string, patch: Partial<FaqItem>) {
    onChange(items.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }
  function remove(id: string) {
    onChange(items.filter((f) => f.id !== id));
  }
  function addRow() {
    onChange([...items, { id: genId("faq"), question: "", answer: "", order: items.length + 1, visible: true }]);
  }

  return (
    <div className="space-y-3">
      {items.map((f) => (
        <div key={f.id} className="space-y-2 rounded-lg border border-white/10 bg-white/[0.02] p-3">
          <div className="flex items-center gap-2">
            <input value={f.question} onChange={(e) => update(f.id, { question: e.target.value })} placeholder="Câu hỏi" className={`${inputClass} flex-1`} />
            <label className="flex items-center gap-1.5 text-xs text-white/60">
              <input type="checkbox" checked={f.visible} onChange={(e) => update(f.id, { visible: e.target.checked })} />
              Hiện
            </label>
            <button onClick={() => remove(f.id)} className="rounded-lg p-1.5 text-red-300 hover:bg-red-500/10" aria-label="Xóa FAQ">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <textarea value={f.answer} onChange={(e) => update(f.id, { answer: e.target.value })} placeholder="Câu trả lời" rows={2} className={inputClass} />
        </div>
      ))}
      <button onClick={addRow} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10">
        + Thêm câu hỏi
      </button>
      {items.length === 0 && <p className="text-xs text-white/40">Chưa có FAQ nào cho hệ sinh thái này.</p>}
    </div>
  );
}

function PotentialAnalysisEditor({ items, onChange }: { items: PotentialAnalysisItem[]; onChange: (next: PotentialAnalysisItem[]) => void }) {
  function update(i: number, patch: Partial<PotentialAnalysisItem>) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function addRow() {
    onChange([...items, { criterion: "", status: "not-assessed", note: "" }]);
  }

  return (
    <div className="space-y-2">
      {items.length === 0 && (
        <button onClick={() => onChange(DEFAULT_POTENTIAL_ANALYSIS.map((it) => ({ ...it })))} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10">
          Dùng bộ tiêu chí mặc định (6 tiêu chí)
        </button>
      )}
      {items.map((it, i) => (
        <div key={i} className="grid grid-cols-1 gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-3 sm:grid-cols-12 sm:items-center">
          <input value={it.criterion} onChange={(e) => update(i, { criterion: e.target.value })} placeholder="Tiêu chí" className={`${inputClass} sm:col-span-5`} />
          <select value={it.status} onChange={(e) => update(i, { status: e.target.value as PotentialAnalysisItem["status"] })} className={`${inputClass} sm:col-span-2`}>
            {POTENTIAL_ANALYSIS_STATUS_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
          <input value={it.note ?? ""} onChange={(e) => update(i, { note: e.target.value })} placeholder="Ghi chú (tùy chọn)" className={`${inputClass} sm:col-span-4`} />
          <button onClick={() => remove(i)} className="rounded-lg p-1.5 text-red-300 hover:bg-red-500/10 sm:col-span-1" aria-label="Xóa tiêu chí">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      {items.length > 0 && (
        <button onClick={addRow} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10">
          + Thêm tiêu chí
        </button>
      )}
    </div>
  );
}

function SubProjectListEditor({ subProjects, onChange }: { subProjects: SubProject[]; onChange: (next: SubProject[]) => void }) {
  function update(id: string, patch: Partial<SubProject>) {
    onChange(subProjects.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }
  function remove(id: string) {
    onChange(subProjects.filter((p) => p.id !== id));
  }
  function addRow() {
    onChange([...subProjects, { id: genId("sub"), slug: "", name: "", shortDescription: "", colorIndex: subProjects.length % 8, links: [] }]);
  }

  return (
    <div className="space-y-4">
      {subProjects.map((p) => (
        <div key={p.id} className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
              <input value={p.name} onChange={(e) => update(p.id, { name: e.target.value })} placeholder="Tên dự án con" className={inputClass} />
              <input value={p.slug} onChange={(e) => update(p.id, { slug: e.target.value })} placeholder="Slug" className={inputClass} />
              <input type="number" min={0} max={7} value={p.colorIndex} onChange={(e) => update(p.id, { colorIndex: Number(e.target.value) })} placeholder="Màu (0-7)" className={inputClass} />
            </div>
            <button onClick={() => remove(p.id)} className="rounded-lg p-1.5 text-red-300 hover:bg-red-500/10" aria-label="Xóa dự án con">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <textarea value={p.shortDescription} onChange={(e) => update(p.id, { shortDescription: e.target.value })} placeholder="Mô tả ngắn" rows={2} className={inputClass} />
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/40">CTA / Link của dự án con</p>
            <LinkListEditor links={p.links} onChange={(next) => update(p.id, { links: next })} />
          </div>
        </div>
      ))}
      <button onClick={addRow} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10">
        + Thêm dự án con
      </button>
    </div>
  );
}

function FieldBoxEditor({ fields, onChange }: { fields: EcosystemFieldBox[]; onChange: (next: EcosystemFieldBox[]) => void }) {
  function update(id: string, patch: Partial<EcosystemFieldBox>) {
    onChange(fields.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }
  return (
    <div className="space-y-4">
      {fields.map((f) => (
        <div key={f.id} className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-sm font-bold text-white">{f.name}</p>
          <textarea value={f.description} onChange={(e) => update(f.id, { description: e.target.value })} rows={3} className={inputClass} />
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/40">CTA / Link của mảng {f.name}</p>
            <LinkListEditor links={f.links} onChange={(next) => update(f.id, { links: next })} />
          </div>
        </div>
      ))}
      {fields.length === 0 && <p className="text-xs text-white/40">Ecosystem này chưa có field box nào (chỉ áp dụng cho structureType &quot;two-field&quot;).</p>}
    </div>
  );
}

function ArticlePicker({ selectedIds, onChange }: { selectedIds: string[]; onChange: (next: string[]) => void }) {
  const { items: articles, ready } = useCollection<DigitalAssetArticle>("digital-asset-articles", digitalAssetArticles);
  const [query, setQuery] = useState("");
  const published = articles.filter((a) => a.status === "Published");
  const filtered = published.filter((a) => !query.trim() || a.title.toLowerCase().includes(query.trim().toLowerCase()));

  function toggle(id: string) {
    onChange(selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id]);
  }

  return (
    <div className="space-y-3">
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm bài viết đã Published..." className={inputClass} disabled={!ready} />
      <div className="max-h-80 space-y-1.5 overflow-y-auto rounded-lg border border-white/10 bg-white/[0.02] p-2">
        {!ready ? (
          <p className="p-3 text-xs text-white/40">Đang tải...</p>
        ) : filtered.length === 0 ? (
          <p className="p-3 text-xs text-white/40">Không tìm thấy bài viết Published nào.</p>
        ) : (
          filtered.map((a) => (
            <label key={a.id} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-white/80 hover:bg-white/5">
              <input type="checkbox" checked={selectedIds.includes(a.id)} onChange={() => toggle(a.id)} />
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/50">
                {digitalAssetCategories.find((c) => c.key === a.category)?.name ?? a.category}
              </span>
              {a.title}
            </label>
          ))
        )}
      </div>
      <p className="text-xs text-white/40">Đã chọn {selectedIds.length} bài viết. Để trống thì Portal tự lọc theo Danh mục của Ecosystem (cơ chế cũ).</p>
    </div>
  );
}

export default function EcosystemEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { items, ready, update, remove } = useCollection<Ecosystem>(ECOSYSTEMS_COLLECTION_KEY, ecosystemsSeed);
  const { push } = useAdminToast();
  const [tab, setTab] = useState<Tab>("Cơ bản");
  const [form, setForm] = useState<Ecosystem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const original = useMemo(() => items.find((e) => e.id === params.id), [items, params.id]);

  useEffect(() => {
    // Đồng bộ form khi collection tải xong lần đầu — không có nguồn thuần
    // render-time cho việc này (dữ liệu tới bất đồng bộ qua useCollection).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (original && !form) setForm({ ...original });
  }, [original, form]);

  function set<K extends keyof Ecosystem>(key: K, value: Ecosystem[K]) {
    setForm((s) => (s ? { ...s, [key]: value } : s));
  }

  function save() {
    if (!form) return;
    if (!form.name.trim() || !form.slug.trim()) {
      push("Vui lòng nhập Tên và Slug", "error");
      return;
    }
    update(form.id, form);
    push("Đã lưu Hệ sinh thái.");
  }

  function handleDelete() {
    remove(params.id);
    push("Đã xóa Hệ sinh thái.", "info");
    router.push("/admin/projects-opportunities/ecosystems");
  }

  if (!ready || !form) {
    return (
      <AdminWorkspaceShell title="Projects & Opportunities" description="" rootHref="/admin/projects-opportunities" sections={PROJECTS_OPPORTUNITIES_SECTIONS}>
        <div className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
      </AdminWorkspaceShell>
    );
  }

  const visibleTabs = TABS.filter((t) => {
    if (t === "Dự án con") return form.structureType === "sub-projects";
    if (t === "Hai mảng") return form.structureType === "two-field";
    return true;
  });

  return (
    <AdminWorkspaceShell title="Projects & Opportunities" description="" rootHref="/admin/projects-opportunities" sections={PROJECTS_OPPORTUNITIES_SECTIONS}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-white">{form.name || "(chưa đặt tên)"}</h1>
            <p className="mt-1 text-xs text-white/40">/portal/duan-cohoi/{form.slug || "…"}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setConfirmDelete(true)} className="rounded-lg border border-red-400/20 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10">
              Xóa
            </button>
            <button onClick={save} className="rounded-lg bg-brand-blue px-5 py-2 text-sm font-bold text-white hover:opacity-90">
              Lưu
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 border-b border-white/10 pb-3">
          {visibleTabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${tab === t ? "bg-brand-blue text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Cơ bản" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Tên">
              <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Slug">
              <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Mô tả ngắn">
              <input value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Trạng thái hiển thị (badge)">
              <input value={form.statusBadge} onChange={(e) => set("statusBadge", e.target.value as Ecosystem["statusBadge"])} className={inputClass} />
            </Field>
            <Field label="Icon">
              <select value={form.icon} onChange={(e) => set("icon", e.target.value as Ecosystem["icon"])} className={inputClass}>
                {ECOSYSTEM_ICON_OPTIONS.map((o) => (
                  <option key={o.key} value={o.key}>{o.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Màu">
              <select value={form.colorKey} onChange={(e) => set("colorKey", e.target.value as Ecosystem["colorKey"])} className={inputClass}>
                {ECOSYSTEM_COLOR_OPTIONS.map((o) => (
                  <option key={o.key} value={o.key}>{o.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Cấu trúc trang (structureType)">
              <select value={form.structureType} onChange={(e) => set("structureType", e.target.value as Ecosystem["structureType"])} className={inputClass}>
                {STRUCTURE_TYPE_OPTIONS.map((o) => (
                  <option key={o.key} value={o.key}>{o.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Danh mục Bài viết (fallback khi chưa chọn Bài viết liên quan)">
              <select value={form.articleCategory} onChange={(e) => set("articleCategory", e.target.value as Ecosystem["articleCategory"])} className={inputClass}>
                {digitalAssetCategories.map((c) => (
                  <option key={c.key} value={c.key}>{c.name}</option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {tab === "Nội dung" && (
          <div className="space-y-4">
            <Field label="Mô tả đầy đủ">
              <textarea value={form.fullIntro} onChange={(e) => set("fullIntro", e.target.value)} rows={4} className={inputClass} />
            </Field>
            <Field label="Điểm nổi bật (mỗi dòng 1 ý)">
              <textarea
                value={form.highlights.join("\n")}
                onChange={(e) => set("highlights", e.target.value.split("\n").filter((s) => s.trim()))}
                rows={3}
                className={inputClass}
              />
            </Field>
            <Field label="Ai phù hợp">
              <textarea value={form.whoFor} onChange={(e) => set("whoFor", e.target.value)} rows={2} className={inputClass} />
            </Field>
            <Field label="Ai chưa nên tham gia">
              <textarea value={form.whoNotReady} onChange={(e) => set("whoNotReady", e.target.value)} rows={2} className={inputClass} />
            </Field>
            <Field label="Kỳ vọng thực tế">
              <textarea value={form.expectedOutcome} onChange={(e) => set("expectedOutcome", e.target.value)} rows={2} className={inputClass} />
            </Field>
          </div>
        )}

        {tab === "CTA & Link" && (
          <LinkListEditor
            links={form.links}
            showCategory={form.structureType === "affiliate-list"}
            onChange={(next) => set("links", next)}
          />
        )}

        {tab === "Dự án con" && (
          <SubProjectListEditor subProjects={form.subProjects ?? []} onChange={(next) => set("subProjects", next)} />
        )}

        {tab === "Hai mảng" && (
          <FieldBoxEditor fields={form.fields ?? []} onChange={(next) => set("fields", next)} />
        )}

        {tab === "Tiêu chí đánh giá" && (
          <PotentialAnalysisEditor items={form.potentialAnalysis ?? []} onChange={(next) => set("potentialAnalysis", next)} />
        )}

        {tab === "FAQ" && <FaqListEditor items={form.faq} onChange={(next) => set("faq", next)} />}

        {tab === "Bài viết liên quan" && (
          <ArticlePicker selectedIds={form.relatedArticleIds} onChange={(next) => set("relatedArticleIds", next)} />
        )}

        {tab === "SEO & Publish" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="SEO Title">
              <input value={form.seoTitle ?? ""} onChange={(e) => set("seoTitle", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Thứ tự hiển thị">
              <input type="number" value={form.order} onChange={(e) => set("order", Number(e.target.value))} className={inputClass} />
            </Field>
            <Field label="SEO Description">
              <textarea value={form.seoDescription ?? ""} onChange={(e) => set("seoDescription", e.target.value)} rows={2} className={`${inputClass} sm:col-span-2`} />
            </Field>
            <Field label="Publish">
              <select value={form.status} onChange={(e) => set("status", e.target.value as Ecosystem["status"])} className={inputClass}>
                <option value="Draft">Draft — chưa công khai</option>
                <option value="Published">Published — hiển thị công khai</option>
                <option value="Hidden">Hidden — ẩn khỏi Portal</option>
              </select>
            </Field>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title={`Xóa hệ sinh thái "${form.name}"?`}
        description="Hành động này không thể hoàn tác — hệ sinh thái sẽ biến mất khỏi /portal/duan-cohoi."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />
    </AdminWorkspaceShell>
  );
}
