"use client";

/* =============================================================================
 * Bộ nhớ & Cá nhân hoá 2.0 — chuyển 1:1 từ
 * `design_handoff_vo_duong_ai/Bo nho ca nhan hoa.html`.
 *
 * ---------------------------------------------------------------------------
 * NHỮNG CHỖ KHÁC bản tĩnh — bản thiết kế minh hoạ bằng "ký ức"/"chủ đề"/"hồ
 * sơ" HOÀN TOÀN BỊA (vd "Bạn muốn xây kênh YouTube...", "92% mức độ hiểu
 * bạn", "Lv.7 - Nhà kiến tạo") — không có hệ thống nào lưu lại cấu trúc này
 * thật. Đã audit `src/ai/memory/` (Runtime Engine — chỉ tính TRONG 1 lần gọi
 * chat, không lưu lại, không đọc được từ Portal) và
 * `src/lib/portal/foundation/memory-store.ts` (LƯU THẬT qua localStorage,
 * đồng bộ từ Reflection/Portfolio thật của AI Workspace sau khi hoàn thành 1
 * Output — 5 trường learning/reflection/knowledge/bestPractice/
 * capabilityImprovement lấy nguyên văn, không suy diễn).
 *
 * Quyết định: DÙNG `memory-store.ts` LÀM "KÝ ỨC" THẬT (đây đúng là những gì
 * Companion "ghi nhớ" được về hành trình học/làm của bạn, dù khác câu chữ ví
 * dụ trong bản thiết kế) — không bịa số liệu mới:
 *  1. "Ký ức gần đây" — `entry.learning` (fallback `entry.reflection`) +
 *     ngày thật + `entry.knowledge` làm nhãn chủ đề. BỎ hẳn tag "Quan
 *     trọng" (không có trường độ quan trọng nào trong dữ liệu thật này).
 *  2. "Ký ức quan trọng" (stat card 1) = SỐ ĐẾM thật `entries.length`.
 *  3. "Chủ đề bạn quan tâm" (stat card 2 + topic-row list) = số lượng
 *     `knowledge` KHÁC NHAU thật; thanh % trong topic-row = tỉ lệ THẬT
 *     (số ký ức thuộc chủ đề đó / chủ đề nhiều nhất) — không phải "điểm
 *     quan tâm" bịa.
 *  4. "Mục tiêu đang theo đuổi" (stat card 3) = số goal `active` thật, đọc
 *     `goal-runtime.ts` (cùng nguồn `/portal/goals` — dùng lại y hệt
 *     `/v2/companion` đã làm).
 *  5. "Mức độ hiểu bạn" (92%, stat card 4) — KHÔNG CÓ CƠ SỞ THẬT (không có
 *     điểm số "hiểu bạn" nào được tính) — đổi thành trạng thái trung thực
 *     "—" thay vì bịa %.
 *  6. "Tóm tắt hồ sơ của bạn" — "Vai trò"/"Cấp độ"/"Thời gian học trung
 *     bình" không có hệ thống phân loại/level/giờ học thật → bỏ 3 dòng này,
 *     giữ "Mục tiêu chính" (goal `active` đầu tiên, thật) + "Ngày tham gia"
 *     (`members.created_at`, thật — cùng cách `/v2/su-menh-companion`).
 *  7. "Ngữ cảnh hiện tại" (cột phải) — không có hệ thống theo dõi ngữ cảnh
 *     (dự án đang làm/ưu tiên/giờ rảnh/thiết bị/phong cách học) nào thật,
 *     và chưa có nơi Admin nào quản lý nội dung này → BỎ HẲN khối này (thay
 *     vì hiện trạng thái rỗng vĩnh viễn), theo yêu cầu Founder "mục nào
 *     không có nội dung thì loại bỏ".
 *  8. "Cá nhân hoá trải nghiệm" — RÚT còn 2 action-tile có đích thật:
 *     "Cập nhật mục tiêu" → `/portal/goals`, "Phản hồi cho Companion" →
 *     `/v2/companion`. Đã BỎ 2 ô "Cập nhật sở thích"/"Thiết lập ngữ cảnh"
 *     (không có trang đích thật ở 2.0, cùng lý do #7) — theo yêu cầu Founder,
 *     không giữ lại link cụt `href="#"` nào.
 * ========================================================================== */

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import { PortalSearchBox } from "@/components/v2/PortalSearchBox";
import type { GoalRecord } from "@/lib/portal/foundation/goal-runtime";
import { listGoals, hydrateGoalRuntime } from "@/lib/portal/foundation/goal-runtime";
import type { MemoryEntry } from "@/lib/portal/foundation/memory-store";
import { listMemoryEntries, hydrateMemoryStore } from "@/lib/portal/foundation/memory-store";
import type { PremiumStatus } from "@/lib/v2/premium-access";

import "../inter-gf.css";
import "./bo-nho-ca-nhan-hoa.css";

const TOPIC_STYLE = [
  { bg: "linear-gradient(145deg,#b18bff,#7c3aed)", icon: <path d="M9 2a4 4 0 00-4 4 3 3 0 00-2 5 3 3 0 002 5 4 4 0 004 4h6a4 4 0 004-4 3 3 0 002-5 3 3 0 00-2-5 4 4 0 00-4-4z" /> },
  { bg: "linear-gradient(145deg,#ff5f5f,#c62828)", icon: <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" /> },
  { bg: "linear-gradient(145deg,#3ecf7e,#189a52)", icon: <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" /> },
  { bg: "linear-gradient(145deg,#ff9d52,#c2660a)", icon: <path d="M13 3L4 14h7l-1 7 9-11h-7z" /> },
  { bg: "linear-gradient(145deg,#4bc4e0,#0e7490)", icon: <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" /> },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function BoNhoCaNhanHoaClient({ premium, joinedAt }: { premium: PremiumStatus; joinedAt: string | null }) {
  const router = useRouter();
  const go = (path: string) => router.push(path);

  const [entries, setEntries] = useState<MemoryEntry[]>([]);
  const [goals, setGoals] = useState<GoalRecord[]>([]);
  useEffect(() => {
    // Phase 40 — hydrate cache từ Supabase (member_id thật) trước khi đọc,
    // thay cho localStorage per-browser cũ (cùng pattern `/v2/companion`).
    (async () => {
      await Promise.all([hydrateMemoryStore(), hydrateGoalRuntime()]);
       
      setEntries(listMemoryEntries());
      setGoals(listGoals());
    })();
  }, []);

  const activeGoals = goals.filter((g) => g.status === "active");
  const activeGoal = activeGoals[0] ?? goals[0] ?? null;

  const topicCounts = new Map<string, number>();
  for (const e of entries) {
    const topic = e.knowledge.trim();
    if (!topic) continue;
    topicCounts.set(topic, (topicCounts.get(topic) ?? 0) + 1);
  }
  const topics = Array.from(topicCounts.entries()).sort((a, b) => b[1] - a[1]);
  const maxTopicCount = topics[0]?.[1] ?? 0;

  return (
    <div className="bnc">
      <div className="app">
        <PortalV2Shell
          premium={premium}
          searchPlaceholder="Tìm kiếm kiến thức, công cụ, prompt, bài học..."
          useTopbarRightWrapper={false}
          promoText="Mở khóa toàn bộ tính năng nâng cao của Companion AI và Học viện."
          activeHtmlFile="Bo nho ca nhan hoa.html"
          companionExpanded
          customSearch={
            <PortalSearchBox placeholder="Tìm kiếm kiến thức, công cụ, prompt, bài học..." variant="bare" />
          }
        >
          <div className="content">
            <div className="center-col">
              <div className="page-head">
                <div className="ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 2a4 4 0 00-4 4 3 3 0 00-2 5 3 3 0 002 5 4 4 0 004 4h6a4 4 0 004-4 3 3 0 002-5 3 3 0 00-2-5 4 4 0 00-4-4z" />
                  </svg>
                </div>
                <div>
                  <h1>Bộ nhớ & Cá nhân hoá</h1>
                  <p>Companion ghi nhớ, hiểu bạn và cá nhân hoá trải nghiệm đồng hành tốt nhất.</p>
                </div>
              </div>

              <div>
                <div className="section-title">Companion hiểu bạn</div>
                <div className="stat-row">
                  <div className="stat-card">
                    <div className="ico" style={{ background: "linear-gradient(145deg,#b18bff,#7c3aed)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="n">{entries.length}</div>
                      <div className="l">Ký ức đã ghi nhận</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="ico" style={{ background: "linear-gradient(145deg,#5f8fff,#1d5fd8)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.5 8.5 0 01-8.5 8.5 8.4 8.4 0 01-3.9-.94L3 21l1.5-4.5A8.4 8.4 0 013.5 12 8.5 8.5 0 0112 3.5a8.5 8.5 0 019 8z" />
                      </svg>
                    </div>
                    <div>
                      <div className="n">{topics.length}</div>
                      <div className="l">Chủ đề bạn quan tâm</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="ico" style={{ background: "linear-gradient(145deg,#3ecf7e,#189a52)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="12" cy="12" r=".5" fill="#fff" />
                      </svg>
                    </div>
                    <div>
                      <div className="n">{activeGoals.length}</div>
                      <div className="l">Mục tiêu đang theo đuổi</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="ico" style={{ background: "linear-gradient(145deg,#ff9d52,#c2660a)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="n">—</div>
                      <div className="l">Mức độ hiểu bạn</div>
                    </div>
                  </div>
                  <div className="heart-card" style={{ flex: 1.4 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/v2-static/assets/icon-companion.png" alt="" />
                    <h5>Bộ nhớ là trái tim của sự đồng hành</h5>
                    <p>Càng trò chuyện, Companion càng hiểu bạn hơn để đưa ra gợi ý, kế hoạch phù hợp hơn.</p>
                  </div>
                </div>
              </div>

              <div className="two-col">
                <div className="card">
                  <div className="card-head">
                    <h4>Ký ức gần đây</h4>
                  </div>
                  {entries.length === 0 ? (
                    <div className="empty-hint">Chưa có ký ức nào — hoàn thành 1 dự án trong AI Workspace để Companion bắt đầu ghi nhớ.</div>
                  ) : (
                    entries
                      .slice(-5)
                      .reverse()
                      .map((e) => (
                        <div className="memory-row" key={e.memoryId}>
                          <div className="ico">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
                            </svg>
                          </div>
                          <div className="txt">
                            &ldquo;{e.learning || e.reflection}&rdquo;
                            <div className="meta">
                              {formatDate(e.createdAt)} · Chủ đề: {e.knowledge || "Chưa phân loại"}
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>

                <div className="card">
                  <div className="card-head">
                    <h4>Chủ đề bạn quan tâm</h4>
                  </div>
                  {topics.length === 0 ? (
                    <div className="empty-hint">Chưa có chủ đề nào được ghi nhận.</div>
                  ) : (
                    topics.slice(0, 5).map(([topic, count], i) => {
                      const style = TOPIC_STYLE[i % TOPIC_STYLE.length];
                      const pct = maxTopicCount > 0 ? Math.round((count / maxTopicCount) * 100) : 0;
                      return (
                        <div className="topic-row" key={topic}>
                          <div className="topic-top">
                            <div className="ico" style={{ background: style.bg }}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                                {style.icon}
                              </svg>
                            </div>
                            {topic}
                            <span className="pct">{count}</span>
                          </div>
                          <div className="topic-track">
                            <div className="topic-fill" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="personalize-card" style={{ flexDirection: "column", alignItems: "stretch" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "center" }}>
                  <div>
                    <div className="section-title" style={{ margin: 0 }}>
                      Cá nhân hoá trải nghiệm của bạn
                    </div>
                    <p>Giúp Companion hiểu bạn hơn để đưa ra gợi ý và đồng hành hiệu quả hơn.</p>
                  </div>
                  <div className="brain-visual">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.6}>
                      <path d="M9 2a4 4 0 00-4 4 3 3 0 00-2 5 3 3 0 002 5 4 4 0 004 4h6a4 4 0 004-4 3 3 0 002-5 3 3 0 00-2-5 4 4 0 00-4-4z" />
                    </svg>
                  </div>
                </div>
                <div className="action-grid">
                  <div className="action-tile" onClick={() => go("/portal/goals")}>
                    <div className="ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="9" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="12" cy="12" r=".5" fill="currentColor" />
                      </svg>
                    </div>
                    <div>
                      <h6>Cập nhật mục tiêu</h6>
                      <p>Điều chỉnh mục tiêu của bạn.</p>
                    </div>
                  </div>
                  <div className="action-tile" onClick={() => go("/v2/companion")}>
                    <div className="ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.5 8.5 0 01-8.5 8.5 8.4 8.4 0 01-3.9-.94L3 21l1.5-4.5A8.4 8.4 0 013.5 12 8.5 8.5 0 0112 3.5a8.5 8.5 0 019 8z" />
                      </svg>
                    </div>
                    <div>
                      <h6>Phản hồi cho Companion</h6>
                      <p>Giúp Companion hiểu bạn hơn.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="right-col">
              <div className="card">
                <div className="card-head">
                  <h4>Tóm tắt hồ sơ của bạn</h4>
                </div>
                <div className="summary-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="12" cy="12" r=".5" fill="currentColor" />
                  </svg>
                  <div>
                    <span className="l">Mục tiêu chính</span>
                    <span className="v">{activeGoal ? activeGoal.title : "Chưa đặt mục tiêu"}</span>
                  </div>
                </div>
                <div className="summary-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M8 2v4M16 2v4M3 10h18" />
                  </svg>
                  <div>
                    <span className="l">Ngày tham gia</span>
                    <span className="v">{joinedAt ? formatDate(joinedAt) : "—"}</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Quyền riêng tư & kiểm soát</h4>
                </div>
                <div className="privacy-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="11" width="16" height="9" rx="2" />
                    <path d="M8 11V7a4 4 0 018 0v4" />
                  </svg>
                  Companion chỉ ghi nhớ khi bạn đồng ý.
                </div>
                <div className="privacy-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Bạn có toàn quyền xem, chỉnh sửa hoặc xóa ký ức.
                </div>
                <div className="privacy-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="11" width="16" height="9" rx="2" />
                    <path d="M8 11V7a4 4 0 018 0v4" />
                  </svg>
                  Dữ liệu của bạn được bảo mật tuyệt đối.
                </div>
                <a
                  onClick={() => go("/portal/account")}
                  style={{
                    display: "block",
                    textAlign: "center",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    marginTop: 10,
                    background: "var(--violet-light)",
                    color: "var(--violet-dark)",
                    borderRadius: 9,
                    padding: 9,
                    cursor: "pointer",
                  }}
                >
                  Quản lý quyền riêng tư →
                </a>
              </div>
            </aside>
          </div>
        </PortalV2Shell>
      </div>
    </div>
  );
}
