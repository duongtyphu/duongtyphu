"use client";

/* =============================================================================
 * Sứ mệnh Companion 2.0 — chuyển 1:1 từ
 * `design_handoff_vo_duong_ai/Su menh Companion.html`.
 *
 * Trang gần như HOÀN TOÀN TĨNH — nội dung sứ mệnh/giá trị cốt lõi/nguyên tắc
 * hoạt động/phong cách đồng hành là bản tuyên ngôn thương hiệu (copy tĩnh
 * của app, không phải dữ liệu user) — KHÔNG có bảng CMS nào khớp đúng hình
 * dạng 5 giá trị + 6 nguyên tắc này (khác `mission_items`/`philosophy_pairs`/
 * `constitution`/`genome`/`evolution`/`timeline` của trang 1.0 cùng tên —
 * 2 trang khác thiết kế/khác nội dung, không cố ép vào bảng có sẵn).
 *
 * ĐÚNG 1 điểm khác dữ liệu thật: "Đồng hành cùng bạn từ ..." — ngày cố định
 * "15/04/2024" trong bản thiết kế đổi thành ngày tạo tài khoản thật
 * (`members.created_at`), rỗng trung thực nếu chưa đăng nhập/chưa cấu hình
 * Supabase.
 * ========================================================================== */

import { useRouter } from "next/navigation";

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import type { PremiumStatus } from "@/lib/v2/premium-access";

import "../inter-gf.css";
import "./su-menh-companion.css";

function formatJoinedDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function SuMenhCompanionClient({ premium, joinedAt }: { premium: PremiumStatus; joinedAt: string | null }) {
  const router = useRouter();
  const go = (path: string) => router.push(path);

  return (
    <div className="smc">
      <div className="app">
        <PortalV2Shell
          premium={premium}
          notifBadge={2}
          promoText="Mở khóa trải nghiệm đồng hành chuyên sâu với Companion AI."
          activeHtmlFile="Su menh Companion.html"
          companionExpanded
          useTopbarRightWrapper={false}
          customSearch={
            <div className="search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input type="text" placeholder="Tìm kiếm kiến thức, công cụ, khóa học..." />
            </div>
          }
        >
          <div className="content">
            <div className="center-col">
              <div className="page-head-text">
                <h1>
                  <div className="ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                    </svg>
                  </div>
                  Sứ mệnh Companion
                </h1>
                <p>Hiểu về sứ mệnh, giá trị cốt lõi và cách Companion AI đồng hành cùng bạn trên hành trình phát triển.</p>
              </div>

              <div className="mission-hero">
                <div>
                  <div className="tag">✨ Sứ mệnh của Companion</div>
                  <h2>Companion không chỉ trả lời câu hỏi, mà đồng hành cùng con người trên hành trình học tập, làm việc và trưởng thành.</h2>
                  <p>Companion được tạo ra để trở thành người bạn đáng tin cậy, luôn ở bên bạn, lắng nghe, thấu hiểu và giúp bạn tiến bộ mỗi ngày.</p>
                </div>
                <div className="mission-orbit">
                  <div className="ring" />
                  <div className="bot">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/v2-static/assets/companion-robot.png" alt="Companion" />
                  </div>
                  <div className="orbit-label" style={{ top: 2, left: "50%", transform: "translateX(-50%)" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <circle cx="8" cy="8" r="3" />
                      <circle cx="17" cy="9" r="3" />
                      <path d="M2 21c0-3.3 2.7-6 6-6s6 2.7 6 6M13 15c3 0 6 2 6 6" />
                    </svg>
                    Hiểu bạn
                  </div>
                  <div className="orbit-label" style={{ top: 32, right: -20 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                    </svg>
                    Truyền cảm hứng
                  </div>
                  <div className="orbit-label" style={{ bottom: 32, right: -24 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
                    </svg>
                    Tối ưu hóa
                  </div>
                  <div className="orbit-label" style={{ bottom: 32, left: -22 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <path d="M13 2L3 14h7l-1 8 10-12h-7z" />
                    </svg>
                    Đề xuất
                  </div>
                  <div className="orbit-label" style={{ top: 32, left: -20 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
                    </svg>
                    Đồng hành
                  </div>
                </div>
              </div>

              <div>
                <div className="section-head">
                  <div className="section-title">Giá trị cốt lõi</div>
                  <a href="#">Tìm hiểu chi tiết →</a>
                </div>
                <div className="value-grid">
                  {[
                    {
                      bg: "linear-gradient(145deg,#b18bff,#7c3aed)",
                      title: "Thấu hiểu",
                      desc: "Lắng nghe và thấu hiểu ngữ cảnh, mục tiêu và cảm xúc của bạn.",
                      icon: <path d="M12 20s-7-4.4-7-10a4.5 4.5 0 018-2.8A4.5 4.5 0 0119 10c0 5.6-7 10-7 10z" />,
                    },
                    {
                      bg: "linear-gradient(145deg,#5f8fff,#1d5fd8)",
                      title: "Tin cậy",
                      desc: "Cung cấp thông tin chính xác, minh bạch và luôn đặt lợi ích của bạn lên hàng đầu.",
                      icon: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />,
                    },
                    {
                      bg: "linear-gradient(145deg,#3ecf7e,#189a52)",
                      title: "Đồng hành",
                      desc: "Luôn ở bên, hỗ trợ liên tục trên mọi chặng đường phát triển.",
                      icon: <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />,
                    },
                    {
                      bg: "linear-gradient(145deg,#ff9d52,#c2660a)",
                      title: "Truyền cảm hứng",
                      desc: "Khơi gợi động lực, giúp bạn tin tưởng vào bản thân và khai phá tiềm năng.",
                      icon: <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />,
                    },
                    {
                      bg: "linear-gradient(145deg,#4bc4e0,#0e7490)",
                      title: "Tiến hóa",
                      desc: "Không ngừng học hỏi, cải thiện để mang lại giá trị tốt hơn mỗi ngày.",
                      icon: <path d="M4 19h16M7 15l3-4 3 3 5-7" />,
                    },
                  ].map((v) => (
                    <div className="value-card" key={v.title}>
                      <div className="ico" style={{ background: v.bg }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                          {v.icon}
                        </svg>
                      </div>
                      <h5>{v.title}</h5>
                      <p>{v.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="section-title" style={{ marginBottom: 14 }}>
                  Nguyên tắc hoạt động
                </div>
                <div className="principle-grid">
                  {[
                    {
                      title: "Tôn trọng & bảo mật",
                      desc: "Bảo vệ thông tin cá nhân của bạn và tôn trọng mọi cuộc hội thoại.",
                      icon: (
                        <>
                          <rect x="4" y="11" width="16" height="9" rx="2" />
                          <path d="M8 11V7a4 4 0 018 0v4" />
                        </>
                      ),
                    },
                    {
                      title: "Hỗ trợ chủ động",
                      desc: "Chủ động gợi ý, nhắc nhở và đề xuất để bạn đạt mục tiêu nhanh hơn.",
                      icon: <path d="M13 3L4 14h7l-1 7 9-11h-7z" />,
                    },
                    {
                      title: "Trung thực & minh bạch",
                      desc: "Luôn rõ ràng về khả năng, hạn chế và nguồn thông tin.",
                      icon: <path d="M20 6L9 17l-5-5" />,
                    },
                    {
                      title: "Học hỏi liên tục",
                      desc: "Cập nhật kiến thức và học từ bạn để ngày càng tốt hơn.",
                      icon: (
                        <>
                          <path d="M22 10L12 5 2 10l10 5 10-5z" />
                          <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
                        </>
                      ),
                    },
                    {
                      title: "Cá nhân hóa",
                      desc: "Hiểu bạn để đưa ra phản hồi và gợi ý phù hợp nhất.",
                      icon: (
                        <>
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                        </>
                      ),
                    },
                    {
                      title: "Tập trung vào kết quả",
                      desc: "Luôn hướng đến hành động và kết quả thực tế cho bạn.",
                      icon: (
                        <>
                          <circle cx="12" cy="12" r="9" />
                          <circle cx="12" cy="12" r="4" />
                          <circle cx="12" cy="12" r=".5" fill="currentColor" />
                        </>
                      ),
                    },
                  ].map((p) => (
                    <div className="principle-row" key={p.title}>
                      <div className="ico">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          {p.icon}
                        </svg>
                      </div>
                      <div>
                        <h6>{p.title}</h6>
                        <p>{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cta-banner">
                <div>
                  <h4>Companion luôn sẵn sàng cùng bạn</h4>
                  <p>Bạn có thể trò chuyện bất cứ lúc nào, Companion sẽ lắng nghe, thấu hiểu cùng bạn tìm ra hướng đi tốt nhất để đạt được mục tiêu.</p>
                </div>
                <div className="right">
                  <button onClick={() => go("/v2/companion")}>Trò chuyện với Companion →</button>
                  <div className="bot-mini">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/v2-static/assets/icon-companion.png" alt="" />
                  </div>
                </div>
              </div>
            </div>

            <aside className="right-col">
              <div className="card">
                <div className="card-head">
                  <h4>Companion của bạn</h4>
                </div>
                <div className="you-info">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/v2-static/assets/icon-companion.png" alt="" />
                  <div>
                    <h5>
                      Companion AI <span className="pill">AI Mentor</span>
                    </h5>
                    <div className="meta">Phiên bản mới nhất</div>
                    <div className="meta">
                      {joinedAt ? `Đồng hành cùng bạn từ ${formatJoinedDate(joinedAt)}` : "Bắt đầu đồng hành cùng bạn"}
                    </div>
                  </div>
                </div>
                <button className="settings-btn">⚙️ Cài đặt Companion</button>
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Phong cách đồng hành</h4>
                </div>
                {[
                  {
                    title: "Thân thiện & gần gũi",
                    desc: "Trò chuyện tự nhiên, thoải mái như một người bạn.",
                    icon: (
                      <>
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                      </>
                    ),
                  },
                  {
                    title: "Tích cực & truyền cảm hứng",
                    desc: "Luôn khích lệ, giúp bạn duy trì động lực.",
                    icon: <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />,
                  },
                  {
                    title: "Rõ ràng & súc tích",
                    desc: "Trả lời ngắn gọn, dễ hiểu và dễ áp dụng.",
                    icon: <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />,
                  },
                  {
                    title: "Hướng đến hành động",
                    desc: "Đưa ra gợi ý cụ thể để bạn hành động ngay.",
                    icon: <path d="M13 3L4 14h7l-1 7 9-11h-7z" />,
                  },
                ].map((s) => (
                  <div className="style-row" key={s.title}>
                    <div className="ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {s.icon}
                      </svg>
                    </div>
                    <div>
                      <h6>{s.title}</h6>
                      <p>{s.desc}</p>
                    </div>
                  </div>
                ))}
                <a href="#" style={{ display: "block", textAlign: "center", fontSize: "12.5px", fontWeight: 700, marginTop: 10 }}>
                  Xem tất cả phong cách →
                </a>
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Bạn có thể làm cùng Companion</h4>
                </div>
                <div className="cando-list">
                  {[
                    "Học hỏi kiến thức mới",
                    "Lập kế hoạch & quản lý mục tiêu",
                    "Giải quyết vấn đề công việc",
                    "Phát triển kỹ năng cá nhân",
                    "Tối ưu hóa công việc với AI",
                    "Và nhiều hơn nữa...",
                  ].map((label) => (
                    <div className="cando-item" key={label}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      {label}
                    </div>
                  ))}
                </div>
                <a href="#" style={{ fontSize: "12.5px", fontWeight: 700 }}>
                  Khám phá khả năng của Companion →
                </a>
              </div>

              <div className="quote-card">
                &ldquo;Hành trình vạn dặm bắt đầu từ một bước chân. Companion sẽ luôn ở đây, cùng bạn bước đi.&rdquo;
                <div className="who">— Companion AI</div>
              </div>
            </aside>
          </div>
        </PortalV2Shell>
      </div>
    </div>
  );
}
