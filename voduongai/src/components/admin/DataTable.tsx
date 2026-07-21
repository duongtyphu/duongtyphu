import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { fetchCollection } from "@/lib/admin/fetchCollection";
import { DataTableClient } from "@/components/admin/DataTableClient";
import type { ColumnConfig, FieldConfig } from "@/lib/admin/fields";

type BaseItem = { id: string; status?: string };

/**
 * Server Component — đọc dữ liệu qua fetchCollection() (gọi thẳng Supabase,
 * không self-fetch HTTP — xem src/lib/admin/fetchCollection.ts), rồi giao
 * phần hiển thị/tương tác cho DataTableClient. Generic cho MỌI collection
 * trong SUPABASE_COLLECTIONS — page.tsx của từng collection chỉ cần truyền
 * collectionKey + columns/fields.
 *
 * Tự gọi requireAdmin() độc lập ở đây, không dựa hoàn toàn vào
 * (dashboard)/layout.tsx đã gate — do Partial Rendering, layout dùng chung
 * KHÔNG re-render trên mỗi lần điều hướng client-side giữa các trang cùng
 * layout, nên requireAdmin() ở layout không chắc đã chạy lại cho request
 * dựng ra DataTable này. Giữ đúng tinh thần "2 lớp phòng hộ" như middleware +
 * layout đã áp dụng.
 */
export async function DataTable<T extends BaseItem>({
  collectionKey,
  title,
  columns,
  fields,
  itemNoun,
  addButtonLabel,
  panelLabel,
}: {
  collectionKey: string;
  title: string;
  columns: ColumnConfig<T>[];
  fields: FieldConfig[];
  /** Nhãn số nhiều hiển thị cạnh tiêu đề (vd. "Knowledge Card") — bỏ trống
   * giữ nguyên hành vi cũ (không hiện số đếm). Tuỳ chọn, riêng cho từng
   * page.tsx — KHÔNG đổi hành vi mặc định của các collection khác. */
  itemNoun?: string;
  /** Nhãn nút thêm mới (vd. "+ Thêm Card") — bỏ trống dùng "Thêm mới". */
  addButtonLabel?: string;
  /** Nhãn khu vực chỉnh trong slide-over (vd. "Nội dung tri thức") — bỏ
   * trống dùng "Sửa"/"Thêm mới" như cũ. */
  panelLabel?: string;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const items = await fetchCollection<T>(collectionKey);

  return (
    <DataTableClient
      collectionKey={collectionKey}
      title={title}
      columns={columns}
      fields={fields}
      initialItems={items}
      itemNoun={itemNoun}
      addButtonLabel={addButtonLabel}
      panelLabel={panelLabel}
    />
  );
}
