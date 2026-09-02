import { getMnytStateBundle } from "@/lib/portal/mnyt-sync";
import {
  getLiveMnytCategories,
  getLiveMnytDifficulties,
  getLiveMnytToolNames,
  getLiveMnytTopicsCount,
  getLiveMnytTopicsPage,
} from "@/lib/portal/live-mnyt";
import { MnytArchiveClient } from "@/components/v2/mnyt/MnytArchiveClient";

export const metadata = { title: "Kho ý tưởng | Mỗi ngày một ý tưởng" };

/**
 * `/v2/moi-ngay-mot-y-tuong/kho-y-tuong` — view "Kho ý tưởng" (3/10, mockup
 * dòng 915-984). Server Component chỉ tải TRANG ĐẦU (60 dòng nhẹ, không
 * `content` đầy đủ) + danh mục lọc thật (lĩnh vực/công cụ/độ khó) — mọi lần
 * đổi bộ lọc/tải thêm sau đó, `MnytArchiveClient` tự gọi `/api/mnyt/topics`
 * (Giai đoạn 2, cùng `getLiveMnytTopicsPage()` dùng ở đây — Single Source
 * of Truth giữa SSR trang đầu và client-side fetch trang kế tiếp).
 *
 * Khối "Ý tưởng cộng đồng đề xuất" của mockup gốc — README/RLS
 * (`mnyt_submissions`, "member read own") xác nhận đây KHÔNG PHẢI feed
 * công khai: mỗi member chỉ đọc được ĐÚNG đề xuất của chính mình (Admin
 * duyệt riêng qua service role). Đổi tên hiển thị thành "Ý tưởng bạn đã đề
 * xuất" (đúng dữ liệu thật đọc được) thay vì bịa 1 feed cộng đồng không có
 * thật — xem `MnytArchiveClient.tsx`.
 */
export default async function MnytArchivePage() {
  const state = await getMnytStateBundle();

  const [categories, toolNames, difficulties, topicsCount, firstPage] = await Promise.all([
    getLiveMnytCategories(),
    getLiveMnytToolNames(),
    getLiveMnytDifficulties(),
    getLiveMnytTopicsCount(),
    getLiveMnytTopicsPage({ page: 1, pageSize: 60 }),
  ]);

  return (
    <MnytArchiveClient
      lang={state.prefs.lang}
      categories={categories}
      toolNames={toolNames}
      difficulties={difficulties}
      topicsCount={topicsCount}
      initialItems={firstPage.items}
      initialTotal={firstPage.total}
      completedIds={state.completedIds}
      favoriteIds={state.favoriteIds}
      submissions={state.submissions}
    />
  );
}
