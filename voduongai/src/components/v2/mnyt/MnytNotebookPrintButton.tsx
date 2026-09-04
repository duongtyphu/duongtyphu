"use client";

/**
 * Nút nổi "📄 Lưu thành PDF" — 1:1 với `<div class="no-print">` gốc của
 * `So Tay Y Tuong.dc.html`. Tách thành Client Component riêng, tối thiểu
 * (chỉ mình `onClick={() => window.print()}`) — phần còn lại của trang là
 * Server Component thuần, đúng tinh thần "tài liệu tĩnh" của bản thiết kế.
 */
export function MnytNotebookPrintButton({ label }: { label: string }) {
  return (
    <div
      className="no-print"
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 9999,
        display: "flex",
        gap: 8,
        fontFamily: "var(--font-notebook-body, 'Manrope'), sans-serif",
      }}
    >
      <button
        type="button"
        onClick={() => window.print()}
        style={{
          background: "#7c3aed",
          border: "none",
          color: "#fff",
          fontFamily: "inherit",
          fontSize: 13,
          fontWeight: 700,
          padding: "11px 18px",
          borderRadius: 10,
          cursor: "pointer",
          boxShadow: "0 6px 18px rgba(124, 58, 237, 0.3)",
        }}
      >
        {label}
      </button>
    </div>
  );
}
