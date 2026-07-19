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
}: {
  collectionKey: string;
  title: string;
  columns: ColumnConfig<T>[];
  fields: FieldConfig[];
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
    />
  );
}
