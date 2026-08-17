import Link from "next/link";

/**
 * Khung nội dung dùng CHUNG cho các trang `/v2/admin/*` thuộc nhóm "khớp
 * trực quan Portal" (theo đúng lệnh: Admin phải khớp hình ảnh trực quan
 * với trang Portal 2.0 tương ứng, không phải chỉ khớp mockup Admin riêng).
 *
 * Mỗi trang Portal 2.0 tự chứa sidebar/topbar + CSS riêng (prefix class
 * riêng, vd. `.ckos`/`.hva`/`.aiw`) — khung Admin đã có sẵn AdminSidebar/
 * Topbar (`src/app/v2/admin/layout.tsx`) nên component này CHỈ mượn đúng
 * 4 class-token dùng CHUNG XUYÊN SUỐT mọi CSS 2.0 (`content`/`page-head`/
 * `card`/`card-head`, xác nhận qua đối chiếu 10 file CSS — cùng token màu
 * `--violet`/`--muted`/`--line`/`--text`), không phụ thuộc bất kỳ class
 * bespoke nào chỉ tồn tại ở 1 file riêng (vd. `.help-link-btn` của
 * `du-an-co-hoi.css`) — an toàn tái sử dụng cho mọi trang.
 *
 * Từng trang gọi component này TRUYỀN VÀO `prefix` đúng class-root CSS của
 * chính trang Portal đó + tự `import` file CSS gốc — component không tự
 * import CSS (mỗi trang 1 file CSS riêng biệt).
 */
export type AdminMirrorStat = { label: string; value: string };
export type AdminMirrorLink = { label: string; href: string };

export function AdminPortalMirror({
  prefix,
  title,
  description,
  stats,
  note,
  links,
}: {
  prefix: string;
  title: string;
  description: string;
  stats: AdminMirrorStat[];
  note?: string;
  links: AdminMirrorLink[];
}) {
  return (
    <div className={prefix}>
      <div className="content" style={{ flexDirection: "column", gap: 18 }}>
        <div className="page-head">
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <div className="card">
          <div className="card-head">
            <h4>Tổng quan dữ liệu thật</h4>
          </div>
          {stats.length === 0 ? (
            <p style={{ fontSize: 12.5, color: "var(--muted)" }}>Chưa có dữ liệu thật nào.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14 }}>
              {stats.map((s) => (
                <div key={s.label}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text)" }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {note ? (
          <div className="card">
            <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.65 }}>{note}</p>
          </div>
        ) : null}

        {links.length > 0 ? (
          <div className="card">
            <div className="card-head">
              <h4>Quản lý nội dung</h4>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "9px 12px",
                    borderRadius: 9,
                    border: "1px solid var(--line)",
                    background: "#fff",
                    color: "var(--violet, #6d4aff)",
                    fontWeight: 700,
                    fontSize: 13,
                    textDecoration: "none",
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
