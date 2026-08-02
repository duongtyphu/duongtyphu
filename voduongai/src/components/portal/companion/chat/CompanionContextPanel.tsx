/**
 * Context Panel (EPIC-UX-002) — cột phải Desktop, chuẩn bị không gian
 * hiển thị bối cảnh học tập của người dùng ("Hôm nay: Goal/Đang học/Gợi
 * ý/Ghi chú"). THUẦN UI PLACEHOLDER — không kết nối dữ liệu/API/Database
 * nào, mỗi mục hiện đúng 1 dòng trạng thái trung thực (NO-FAKE-DATA).
 *
 * Chỉ dùng cho `variant="full"` (`/portal/companion`), ẩn hẳn trên Mobile
 * và trên panel nổi (`variant="compact"`, quá hẹp để chứa cột thứ 3) — xem
 * `CompanionChatShell.tsx`.
 */
const CONTEXT_ITEMS: { emoji: string; label: string; placeholder: string }[] = [
  { emoji: "🎯", label: "Mục tiêu", placeholder: "Chưa có mục tiêu nào được thiết lập." },
  { emoji: "📚", label: "Đang học", placeholder: "Chưa có nội dung nào đang học." },
  { emoji: "⭐", label: "Gợi ý", placeholder: "Chưa có gợi ý nào." },
  { emoji: "📝", label: "Ghi chú", placeholder: "Chưa có ghi chú nào." },
];

export function CompanionContextPanel() {
  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 py-4">
      <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Hôm nay</p>
      <div className="mt-3 space-y-3">
        {CONTEXT_ITEMS.map((item) => (
          <div key={item.label} className="rounded-2xl border border-gray-200 bg-white px-3.5 py-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-base leading-none" aria-hidden="true">
                {item.emoji}
              </span>
              <span className="text-sm font-semibold text-gray-800">{item.label}</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-gray-400">{item.placeholder}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
