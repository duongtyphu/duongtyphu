import { Manrope, Space_Grotesk } from "next/font/google";

import { getMnytStateBundle } from "@/lib/portal/mnyt-sync";
import { getLiveMnytTopicById } from "@/lib/portal/live-mnyt";
import { MnytNotebookPrintButton } from "@/components/v2/mnyt/MnytNotebookPrintButton";

import "./so-tay-y-tuong.css";

export const metadata = { title: "Sổ tay ý tưởng | Mỗi ngày một ý tưởng" };

/**
 * `/v2/moi-ngay-mot-y-tuong/so-tay-y-tuong` — Giai đoạn 11 (REWORK).
 *
 * Bản build trước đây (Giai đoạn 7) tự nhận "không có mockup gốc riêng" —
 * SAI, chỉ vì tìm chưa đủ kỹ: gói thiết kế có 1 file RIÊNG cho đúng trang
 * này, `design_handoff_moi_ngay_1_y_tuong/So Tay Y Tuong.dc.html` — page
 * này giờ port LẠI 1:1 đúng file đó (font/màu/spacing/copy y hệt, không đổi
 * 1 giá trị nào), thay cho bản thiết kế tự nghĩ trước đây.
 *
 * Khác biệt cốt lõi so với bản cũ, đúng mockup thật:
 * 1. TÀI LIỆU ĐỘC LẬP — không app shell nào (kể cả Portal 2.0, xem route
 *    group `(app)` mới tách riêng ở `../layout.tsx`) — chỉ 1 nút nổi
 *    "📄 Lưu thành PDF" (`window.print()`, không thêm thư viện tạo PDF —
 *    dự án chưa có tiền lệ, trình duyệt đã có sẵn "Print → Save as PDF").
 *    Mở từ Hồ sơ (`MnytProfileClient.tsx`) trong TAB MỚI
 *    (`target="_blank"`) — đúng README + đúng bản chất "xuất tài liệu",
 *    không phải 1 view trong app.
 * 2. Font Space Grotesk (tiêu đề) + Manrope (nội dung) — ĐÚNG font mockup
 *    này dùng (khác Be Vietnam Pro mà 9 view còn lại của tính năng dùng) —
 *    nạp riêng ở đây, không qua layout chung.
 * 3. 2 MỤC RIÊNG BIỆT: "★ Ý tưởng đã lưu" (từ `favoriteIds`) VÀ
 *    "✓ Ý tưởng đã hoàn thành" (từ `completedIds`) — bản cũ chỉ có đúng 1
 *    mục (ý tưởng đã hoàn thành), thiếu hẳn mục yêu thích.
 * 4. Mỗi thẻ hiện `category`/`title`/`takeaway` (ưu tiên) hoặc `hook` (dự
 *    phòng) — bản cũ chỉ hiện `hook`. Cần nội dung ĐẦY ĐỦ (`content.takeaway`)
 *    nên gọi `getLiveMnytTopicById()` cho từng ý tưởng (khác các view khác
 *    dùng bản tóm tắt nhẹ `getLiveMnytTopicsByIds()` — đúng nguyên tắc
 *    README "không tải content đầy đủ cho danh sách", nhưng ở ĐÂY không
 *    phải danh sách 446 ý tưởng, chỉ đúng số ý tưởng người dùng đã lưu/
 *    hoàn thành — tập hợp luôn bị chặn nhỏ, tải đầy đủ an toàn).
 * 5. Ghi chú cá nhân (`Ghi chú: ...`) — đọc thật từ `state.journal`
 *    (`mnyt_journal_entries`, server-backed, KHÔNG phải `localStorage`
 *    `mnyt_journal_v1` như bản prototype gốc — đúng README "real
 *    implementation should read from server").
 * 6. Thẻ KHÔNG phải link — mockup gốc không bọc `<a>`/điều hướng nào (đây
 *    là tài liệu để IN, không phải trang duyệt) — bản cũ có bọc `<Link>`,
 *    đã bỏ.
 * 7. Đơn ngôn ngữ (tiếng Việt) — mockup gốc không có bất kỳ chuyển ngữ nào
 *    (không dùng field `*En`, không có công tắc ngôn ngữ) — bản cũ có 2
 *    ngôn ngữ, đã bỏ để khớp đúng thiết kế 100%, không tự thêm bản Anh ngữ
 *    không có trong mockup.
 * 8. `exportDate` — ĐÚNG định dạng mockup (`d/m/yyyy`, không có số 0 đệm,
 *    không tên tháng dài) — bản cũ dùng `toLocaleDateString` kiểu khác.
 */
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-notebook-display" });
const manrope = Manrope({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600", "700"], variable: "--font-notebook-body" });

type NotebookCard = {
  id: string;
  category: string;
  color: string;
  title: string;
  desc: string;
  hasNote: boolean;
  note: string;
};

export default async function MnytNotebookPage() {
  const state = await getMnytStateBundle();

  const uniqueIds = Array.from(new Set([...state.favoriteIds, ...state.completedIds]));
  const topics = (await Promise.all(uniqueIds.map((id) => getLiveMnytTopicById(id)))).filter((t): t is NonNullable<typeof t> => t !== null);
  const byId = new Map(topics.map((t) => [t.id, t]));

  const buildCard = (id: string): NotebookCard | null => {
    const t = byId.get(id);
    if (!t) return null;
    const note = state.journal[id] ?? "";
    return {
      id: t.id,
      category: t.categoryName,
      color: t.color || "#7c3aed",
      title: t.title,
      desc: t.content.takeaway || t.hook,
      hasNote: note.length > 0,
      note,
    };
  };

  const favCards = state.favoriteIds.map(buildCard).filter((c): c is NotebookCard => c !== null);
  const doneCards = state.completedIds.map(buildCard).filter((c): c is NotebookCard => c !== null);
  const savedIdsCount = state.favoriteIds.length + state.completedIds.length;
  const hasFavs = favCards.length > 0;
  const hasDone = doneCards.length > 0;
  const isEmpty = !hasFavs && !hasDone;

  const now = new Date();
  const exportDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

  const emptyMessage =
    savedIdsCount > 0
      ? `Bạn có ${savedIdsCount} ý tưởng đã lưu hoặc hoàn thành, nhưng dữ liệu chi tiết chưa có trên máy này. Mở lại từng ý tưởng trong ứng dụng rồi xuất sổ tay lần nữa.`
      : "Bạn chưa lưu hoặc hoàn thành ý tưởng nào. Quay lại ứng dụng để bắt đầu học!";

  return (
    <div className={`${spaceGrotesk.variable} ${manrope.variable}`}>
      <MnytNotebookPrintButton label="📄 Lưu thành PDF" />
      <div className="notebook-shell">
        <div className="notebook-doc" style={{ fontFamily: "var(--font-notebook-body), 'Manrope', sans-serif", color: "#1c1b26" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7c3aed", marginBottom: 6 }}>
            Mỗi Ngày 1 Ý Tưởng
          </div>
          <h1 style={{ fontFamily: "var(--font-notebook-display), 'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 700, margin: "0 0 6px" }}>
            Sổ tay ý tưởng của tôi
          </h1>
          <p style={{ fontSize: 12.5, color: "#6b6980", margin: "0 0 30px" }}>
            Xuất ngày {exportDate} · {favCards.length} ý tưởng đã lưu · {doneCards.length} ý tưởng đã hoàn thành
          </p>

          {hasFavs && (
            <>
              <h2
                style={{
                  fontFamily: "var(--font-notebook-display), 'Space Grotesk', sans-serif",
                  fontSize: 17,
                  fontWeight: 700,
                  borderBottom: "2px solid #ede9fe",
                  paddingBottom: 8,
                  margin: "26px 0 16px",
                }}
              >
                ★ Ý tưởng đã lưu
              </h2>
              {favCards.map((c) => (
                <NotebookCardRow key={c.id} card={c} />
              ))}
            </>
          )}

          {hasDone && (
            <>
              <h2
                style={{
                  fontFamily: "var(--font-notebook-display), 'Space Grotesk', sans-serif",
                  fontSize: 17,
                  fontWeight: 700,
                  borderBottom: "2px solid #ede9fe",
                  paddingBottom: 8,
                  margin: "26px 0 16px",
                }}
              >
                ✓ Ý tưởng đã hoàn thành
              </h2>
              {doneCards.map((c) => (
                <NotebookCardRow key={c.id} card={c} />
              ))}
            </>
          )}

          {isEmpty && <div style={{ textAlign: "center", padding: "60px 20px", color: "#9997a8", fontSize: 13.5 }}>{emptyMessage}</div>}
        </div>
      </div>
    </div>
  );
}

function NotebookCardRow({ card }: { card: NotebookCard }) {
  return (
    <div style={{ breakInside: "avoid", marginBottom: 20, padding: "14px 0", borderBottom: "1px solid #f1eff7" }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: card.color, marginBottom: 4 }}>
        {card.category}
      </div>
      <div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 5 }}>{card.title}</div>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: "#3f3d4d", margin: 0 }}>{card.desc}</p>
      {card.hasNote && <p style={{ fontSize: 12.5, lineHeight: 1.6, color: "#6b6980", margin: "8px 0 0", fontStyle: "italic" }}>Ghi chú: {card.note}</p>}
    </div>
  );
}
