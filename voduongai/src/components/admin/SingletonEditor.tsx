"use client";

import { useEffect, useMemo, useState } from "react";
import { useCollection } from "@/lib/admin/store";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { FieldInput } from "@/components/admin/FieldInput";
import { emptyFromFields, type FieldConfig } from "@/lib/admin/fields";

type BaseItem = { id: string; status?: string };

type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

/**
 * Form sửa TOÀN TRANG (không slide-over) cho collection chỉ có đúng 1 dòng
 * cố định (`id` truyền vào, vd. "current") — dùng cùng FieldInput/
 * emptyFromFields với DataTableRowPanel, không viết lại logic render field.
 * Dùng useCollection() trực tiếp (đã gọi đúng API add/update có sẵn).
 *
 * BẢO VỆ ACTIVE VERSION (PMO hardening): khi `status` khác "Draft" (tức
 * đang Review/Approved/Published/Archived), form chuyển CHỈ-ĐỌC — bấm "Tạo
 * bản nháp mới" (chỉ đổi status về Draft, KHÔNG đổi nội dung) mới sửa được
 * tiếp. Đảm bảo nội dung đã Published không bao giờ bị ghi đè âm thầm chỉ
 * vì Founder tiện tay sửa tiếp — khớp đúng yêu cầu "Không để chỉnh sửa
 * trực tiếp active version".
 */
export function SingletonEditor<T extends BaseItem>({
  collectionKey,
  id,
  title,
  description,
  fields,
}: {
  collectionKey: string;
  id: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
}) {
  const { items, ready, add, update } = useCollection<T>(collectionKey, []);
  const existing = items.find((item) => item.id === id) ?? null;
  const isLocked = Boolean(existing && existing.status && existing.status !== "Draft");

  const [form, setForm] = useState<Record<string, unknown>>(() => emptyFromFields(fields));
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [email, setEmail] = useState("admin");

  useEffect(() => {
    getSupabaseBrowser()
      .auth.getUser()
      .then(({ data }) => setEmail(data.user?.email ?? "admin"));
  }, []);

  useEffect(() => {
    // Nạp lại form khi dữ liệu thật từ Supabase về (lần đầu items rỗng do
    // chưa fetch xong) — không có tương đương render-time vì phụ thuộc
    // useCollection() tự fetch bất đồng bộ.
    if (existing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({ ...existing });
      setSaveState("idle");
    }
  }, [existing]);

  const isDirty = useMemo(() => {
    if (!existing) return Object.values(form).some(Boolean);
    return fields.some((f) => JSON.stringify(form[f.key] ?? null) !== JSON.stringify((existing as Record<string, unknown>)[f.key] ?? null));
  }, [form, existing, fields]);

  useEffect(() => {
    // Cảnh báo rời trang khi có thay đổi chưa lưu — không có tương đương
    // render-time (phải gắn/gỡ listener theo vòng đời component).
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirty && saveState !== "saving") {
        e.preventDefault();
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, saveState]);

  function setField(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaveState("dirty");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveState("saving");
    try {
      const patch = { ...form, status: "Draft", updatedBy: email, updatedAt: new Date().toISOString() };
      if (existing) {
        await update(id, patch as unknown as Partial<T>);
      } else {
        await add({ id, ...patch } as unknown as T);
      }
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  async function handleStartNewDraft() {
    await update(id, { status: "Draft" } as Partial<T>);
  }

  if (!ready) {
    return <p className="text-sm text-gray-500">Đang tải...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-gray-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        <SaveStateBadge state={saveState} isDirty={isDirty} />
      </div>

      {isLocked && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          <p>
            Nội dung này đang ở trạng thái <strong>{existing?.status}</strong> — không thể sửa trực tiếp để tránh
            ảnh hưởng phiên bản đang hoạt động.
          </p>
          <button
            type="button"
            onClick={handleStartNewDraft}
            className="mt-2 rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100"
          >
            Tạo bản nháp mới để chỉnh sửa
          </button>
        </div>
      )}

      <fieldset disabled={isLocked} className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:grid-cols-2 disabled:opacity-60">
        {fields.map((f) => (
          <div key={f.key} className={f.full ? "sm:col-span-2" : ""}>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              {f.label}
              {f.required && <span className="text-red-500"> *</span>}
            </label>
            <FieldInput field={f} value={form[f.key]} onChange={(value) => setField(f.key, value)} />
          </div>
        ))}
      </fieldset>

      {!isLocked && (
        <button
          type="submit"
          disabled={saveState === "saving" || !isDirty}
          className="rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-40"
        >
          {saveState === "saving" ? "Đang lưu..." : "Lưu bản nháp"}
        </button>
      )}
    </form>
  );
}

function SaveStateBadge({ state, isDirty }: { state: SaveState; isDirty: boolean }) {
  if (state === "saving") return <Badge color="gray">Đang lưu...</Badge>;
  if (state === "error") return <Badge color="red">Lưu thất bại — thử lại</Badge>;
  if (isDirty) return <Badge color="amber">Có thay đổi chưa lưu</Badge>;
  if (state === "saved") return <Badge color="emerald">Đã lưu</Badge>;
  return null;
}

function Badge({ color, children }: { color: "gray" | "red" | "amber" | "emerald"; children: React.ReactNode }) {
  const styles: Record<string, string> = {
    gray: "bg-gray-100 text-gray-600",
    red: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
  };
  return <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${styles[color]}`}>{children}</span>;
}
