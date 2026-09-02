import { getMnytStateBundle } from "@/lib/portal/mnyt-sync";
import { getLiveMnytTopicsByIds } from "@/lib/portal/live-mnyt";
import { MnytNotebookClient } from "@/components/v2/mnyt/MnytNotebookClient";

export const metadata = { title: "Sổ tay ý tưởng | Mỗi ngày một ý tưởng" };

/**
 * `/v2/moi-ngay-mot-y-tuong/so-tay-y-tuong` — Giai đoạn 7, "Trang in Sổ tay
 * ý tưởng". Đích của nút "📖 Xuất sổ tay ý tưởng" ở View Hồ sơ (trước đó
 * no-op) — không phải modal, mà 1 TRANG RIÊNG tối ưu để in/"Save as PDF"
 * qua hộp thoại in của trình duyệt (`window.print()` ở Client Component),
 * đúng nghĩa đen "Trang in" — không thêm thư viện tạo PDF mới (dự án chưa
 * có tiền lệ nào, và trình duyệt đã có sẵn "Print → Save as PDF").
 *
 * Nội dung: toàn bộ ý tưởng ĐÃ HOÀN THÀNH thật (`getLiveMnytTopicsByIds()`,
 * hàm nhẹ có sẵn — chỉ tải `SUMMARY_COLUMNS`, không tải `content` jsonb
 * đầy đủ cho tới 446 ý tưởng, đúng nguyên tắc hiệu năng README), sắp theo
 * `day` tăng dần (API `.in()` không đảm bảo thứ tự) — mỗi mục là 1 "trang"
 * nhật ký: ngày/lĩnh vực/tiêu đề/hook, đúng tinh thần "sổ tay" ghi lại
 * hành trình học, không phải bản sao nội dung đầy đủ từng bài (đã có ở
 * Chi tiết ý tưởng).
 */
export default async function MnytNotebookPage() {
  const state = await getMnytStateBundle();
  const topics = await getLiveMnytTopicsByIds(state.completedIds);
  const sortedTopics = [...topics].sort((a, b) => a.day - b.day);

  const generatedAtLabel = new Date().toLocaleDateString(state.prefs.lang === "en" ? "en-US" : "vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <MnytNotebookClient
      lang={state.prefs.lang}
      learnerName={state.prefs.learnerName}
      streak={state.streak}
      badgeCount={state.badges.length}
      generatedAtLabel={generatedAtLabel}
      topics={sortedTopics}
    />
  );
}
