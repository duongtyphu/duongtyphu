"use client";

import { useCollection } from "@/lib/admin/store";

type Capability = {
  id: string;
  label: string;
  readiness: string;
  description: string;
};

/**
 * Danh mục năng lực — CHỈ ĐỌC, không có nút Thêm/Sửa/Xoá. `readiness` phản
 * ánh đúng thực trạng kỹ thuật (đã rà soát toàn bộ codebase — hiện chưa có
 * tool-calling harness/chat runtime nào cho Companion end-user), không phải
 * thứ Admin có thể tự bật "Đã có" cho có vẻ hoàn thiện.
 */
export function CapabilitiesTab() {
  const { items, ready } = useCollection<Capability>("companion-capabilities", []);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Danh sách năng lực Companion có thể có trong tương lai — phản ánh đúng thực trạng kỹ thuật, chỉ đọc.
      </p>
      {!ready ? (
        <p className="text-sm text-gray-500">Đang tải...</p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500">
          Chưa có dữ liệu — cần chạy migration Phase 7 trước.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Năng lực</th>
                <th className="px-4 py-3">Mô tả</th>
                <th className="px-4 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 font-semibold text-gray-900">{item.label}</td>
                  <td className="px-4 py-3 text-gray-500">{item.description}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
                      {item.readiness}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
