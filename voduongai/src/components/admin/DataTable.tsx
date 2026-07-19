import { fetchCollection } from "@/lib/admin/fetchCollection";
import { DataTableClient } from "@/components/admin/DataTableClient";
import type { ColumnConfig, FieldConfig } from "@/lib/admin/fields";

type BaseItem = { id: string; status?: string };

/**
 * Server Component — fetch dữ liệu bằng cách gọi thẳng
 * /api/admin/collections/[table] đã có sẵn (qua fetchCollection(), xem
 * src/lib/admin/fetchCollection.ts), rồi giao phần hiển thị/tương tác cho
 * DataTableClient. Generic cho MỌI collection trong SUPABASE_COLLECTIONS —
 * page.tsx của từng collection chỉ cần truyền collectionKey + columns/fields.
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
