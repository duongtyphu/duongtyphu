"use client";

/* =============================================================================
 * `/v2/he-tri-thuc/bai-hoc/[slug]` — trang chi tiết Bài học (Lesson), KHÔNG
 * có mockup riêng (xem docblock ở `page.tsx`). Sidebar/topbar/màu-font chép
 * NGUYÊN VĂN từ `CkosDocumentClient.tsx` (page-shell duplication, đúng tiền
 * lệ đã dùng cho mọi trang không-có-mockup trong `he-tri-thuc.css`).
 *
 * Nội dung trung tâm dùng lại đúng hệ class `.doc-article`/`.doc-body`
 * (h2/h3/p/ul/ol) đã có sẵn cho trang tài liệu CKOS — mỗi phần của
 * "Companion Content Standard"/"Knowledge Experience Content" (14 phần) ánh
 * xạ thành 1 khối `<h2>` + nội dung, KHÔNG tạo class CSS mới. Field rỗng
 * (Admin/1.0 để trống) tự ẩn khối tương ứng — không hiện tiêu đề trống.
 * ========================================================================== */

import Link from "next/link";
import { useRouter } from "next/navigation";

import type { KnowledgeCollection } from "@/features/knowledge/types/knowledge-collection.types";
import type { KnowledgeSeed } from "@/features/knowledge/types/knowledge-seed.types";
import { Difficulty } from "@/features/knowledge/types/knowledge.types";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import { ProfileMenu } from "@/components/v2/ProfileMenu";
import { NotificationBell } from "@/components/v2/NotificationBell";
import { PortalSearchBox } from "@/components/v2/PortalSearchBox";

import "../../../inter-gf.css";
import "../../he-tri-thuc.css";

const HREF_MAP: Record<string, string> = {
  "Trang chu Portal.html": "/v2/trang-chu",
  "Companion.html": "/v2/companion",
  "He tri thuc CKOS.html": "/v2/hoc-vien-ai",
  "Hoc vien AI.html": "/v2/hoc-vien-ai",
  "AI Workspace.html": "/v2/hoc-vien-ai",
  "Du an Co hoi.html": "/v2/du-an-co-hoi",
  "Premium.html": "/v2/premium",
  "Chuong trinh Affilate.html": "/v2/affiliate",
  "Nhat ky hoc tap.html": "/v2/nhat-ky-hoc-tap",
  "Hanh trinh cua toi.html": "/v2/hanh-trinh-cua-toi",
  "Khu vuon cua ban.html": "/v2/khu-vuon-cua-ban",
};

const DIFFICULTY_LABEL: Record<string, string> = {
  [Difficulty.BEGINNER]: "Người mới bắt đầu",
  [Difficulty.INTERMEDIATE]: "Trung cấp",
  [Difficulty.ADVANCED]: "Nâng cao",
};

const SPARKLE_PATH = "M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z";
const CROWN_SPARKLES: React.CSSProperties[] = [
  { top: -8, left: -10, width: 12, height: 12, animationDelay: "0s" },
  { top: 4, right: -14, width: 9, height: 9, animationDelay: ".7s" },
  { bottom: -6, left: 6, width: 8, height: 8, animationDelay: "1.4s" },
  { top: 22, left: -16, width: 7, height: 7, animationDelay: ".3s" },
  { bottom: 2, right: -10, width: 8, height: 8, animationDelay: "1s" },
  { top: -14, left: 20, width: 6, height: 6, animationDelay: "1.8s" },
  { bottom: -10, right: 14, width: 7, height: 7, animationDelay: "2.1s" },
  { top: 30, right: 2, width: 6, height: 6, animationDelay: ".5s" },
  { top: -4, left: 36, width: 7, height: 7, animationDelay: "1.1s" },
  { bottom: 20, left: -14, width: 6, height: 6, animationDelay: "1.6s" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h2>{title}</h2>
      {children}
    </>
  );
}

export function LessonDetailClient({
  seed,
  collection,
  premium,
}: {
  seed: KnowledgeSeed;
  collection: KnowledgeCollection | null;
  premium: PremiumStatus;
}) {
  const router = useRouter();
  const go = (htmlFile: string) => {
    const target = HREF_MAP[htmlFile];
    if (target) router.push(target);
  };

  return (
    <div className="ckos">
      <div className="app">
        <aside className="sidebar">
          <div className="brand">
            <div className="mark">
              <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
                <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#3B82F6" />
                <circle cx="27" cy="7.5" r="3" fill="#F97316" />
              </svg>
            </div>
            <div className="name">
              <span className="vo">VO DUONG</span> <span className="ai">AI</span>
            </div>
          </div>

          <nav className="main">
            <button className="nav-item" onClick={() => go("Trang chu Portal.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 10l9-7 9 7v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Trang chủ
            </button>
            <button className="nav-item" onClick={() => go("Companion.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
              </svg>
              Companion AI
            </button>
            <button className="nav-item active" onClick={() => go("Hoc vien AI.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10L12 5 2 10l10 5 10-5z" />
                <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
              </svg>
              Học viện AI
            </button>
            <button className="nav-item" onClick={() => go("Du an Co hoi.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7l9-4 9 4-9 4-9-4z" />
                <path d="M3 17l9 4 9-4M3 12l9 4 9-4" />
              </svg>
              Dự án &amp; Cơ hội
            </button>
            <button className="nav-item" onClick={() => go("Premium.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
              </svg>
              Premium
            </button>
            <button className="nav-item" onClick={() => go("Chuong trinh Affilate.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M8.6 10.6l6.9-4M8.6 13.4l6.9 4" />
              </svg>
              Chương trình Affilate
            </button>
          </nav>

          <div className="side-label">TIỆN ÍCH NHANH</div>
          <nav className="main">
            <button className="nav-item" onClick={() => go("Nhat ky hoc tap.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5z" />
              </svg>
              Nhật ký học tập
            </button>
            <button className="nav-item" onClick={() => go("Hanh trinh cua toi.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
              Hành trình của tôi
            </button>
            <button className="nav-item" onClick={() => go("Khu vuon cua ban.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
              </svg>
              Khu vườn của bạn
            </button>
          </nav>

          {!premium.isPremium && (
            <div className="promo">
              <div
                className="crown"
                style={{ background: "none", boxShadow: "none", width: 54, height: 54, overflow: "visible" }}
              >
                {CROWN_SPARKLES.map((style, i) => (
                  <svg key={i} className="crown-sparkle" style={style} viewBox="0 0 24 24" fill="currentColor">
                    <path d={SPARKLE_PATH} />
                  </svg>
                ))}
                {/* eslint-disable-next-line @next/next/no-img-element -- ảnh minh hoạ tĩnh
                    của bản thiết kế, kích thước cố định 58.5px; dùng <img> để giữ đúng
                    markup gốc (next/image chèn thêm wrapper làm lệch bố cục). */}
                <img
                  src="/v2-static/assets/icon-premium.png"
                  alt=""
                  style={{ width: 58.5, height: 58.5, objectFit: "contain", position: "relative", zIndex: 1 }}
                />
              </div>
              <h4>Nâng cấp Premium</h4>
              <p>Mở khóa toàn bộ tính năng nâng cao của Companion AI và Học viện.</p>
              <button onClick={() => go("Premium.html")}>Nâng cấp ngay</button>
            </div>
          )}
        </aside>

        <div className="main-col">
          <div className="topbar">
            <PortalSearchBox placeholder="Tìm kiếm tri thức, chủ đề, công cụ..." variant="box" />
            <div className="topbar-right">
              {!premium.isPremium && (
                <button className="upgrade-btn" onClick={() => go("Premium.html")}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                  </svg>
                  Nâng cấp Premium
                </button>
              )}
              <NotificationBell />
              <ProfileMenu premium={premium} />
            </div>
          </div>

          <div className="content">
            <div className="center-col" style={{ maxWidth: 760 }}>
              <Link href="/v2/hoc-vien-ai" className="doc-back-link">
                ← Hệ tri thức (CKOS)
              </Link>

              <article className="card doc-article">
                <div className="doc-article-meta">
                  <span className="doc-tag">{collection?.title ?? "Bài học lẻ"}</span>
                  {seed.difficulty ? (
                    <>
                      <span className="doc-article-sep">·</span>
                      <span>{DIFFICULTY_LABEL[seed.difficulty] ?? seed.difficulty}</span>
                    </>
                  ) : null}
                  {seed.estimatedTime ? (
                    <>
                      <span className="doc-article-sep">·</span>
                      <span>{seed.estimatedTime}</span>
                    </>
                  ) : null}
                </div>

                <h1 className="doc-article-title">{seed.title}</h1>
                {seed.summary ? <p className="doc-article-summary">{seed.summary}</p> : null}

                {seed.goal.length > 0 || seed.persona.length > 0 ? (
                  <div className="doc-article-tags">
                    {seed.goal.map((g) => (
                      <span className="doc-tag" key={`goal-${g}`}>
                        {g}
                      </span>
                    ))}
                    {seed.persona.map((p) => (
                      <span className="doc-tag" key={`persona-${p}`}>
                        {p}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="doc-body">
                  {seed.whatYouWillGain.length > 0 ? (
                    <Section title="Bạn sẽ đạt được gì">
                      <ul>
                        {seed.whatYouWillGain.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </Section>
                  ) : null}

                  {seed.whyMatters ? (
                    <Section title="Vì sao điều này quan trọng">
                      <p>{seed.whyMatters}</p>
                    </Section>
                  ) : null}

                  {seed.problem ? (
                    <Section title="Vấn đề">
                      <p>{seed.problem}</p>
                    </Section>
                  ) : null}

                  {seed.coreIdea ? (
                    <Section title="Ý tưởng cốt lõi">
                      <p>{seed.coreIdea}</p>
                    </Section>
                  ) : null}

                  {seed.guideSteps.length > 0 ? (
                    <Section title="Hướng dẫn từng bước">
                      <ol>
                        {seed.guideSteps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </Section>
                  ) : (
                    seed.guide ? (
                      <Section title="Hướng dẫn">
                        <p>{seed.guide}</p>
                      </Section>
                    ) : null
                  )}

                  {seed.samplePrompt ? (
                    <Section title="Prompt mẫu">
                      <p>{seed.samplePrompt}</p>
                      {seed.promptTips.length > 0 ? (
                        <ul>
                          {seed.promptTips.map((tip) => (
                            <li key={tip}>{tip}</li>
                          ))}
                        </ul>
                      ) : null}
                      {seed.promptExampleInput ? <p>Đầu vào mẫu: {seed.promptExampleInput}</p> : null}
                      {seed.promptExampleOutput ? <p>Kết quả mẫu: {seed.promptExampleOutput}</p> : null}
                    </Section>
                  ) : null}

                  {seed.prompts.length > 0 ? (
                    <Section title="Prompt Pack">
                      <ul>
                        {seed.prompts.map((prompt) => (
                          <li key={prompt}>{prompt}</li>
                        ))}
                      </ul>
                    </Section>
                  ) : null}

                  {seed.example ? (
                    <Section title="Ví dụ thực tế">
                      <p>{seed.example}</p>
                    </Section>
                  ) : null}

                  {seed.commonMistakes.length > 0 ? (
                    <Section title="Sai lầm thường gặp">
                      <ul>
                        {seed.commonMistakes.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </Section>
                  ) : null}

                  {seed.checklist.length > 0 ? (
                    <Section title="Checklist">
                      <ul>
                        {seed.checklist.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </Section>
                  ) : null}

                  {seed.exercise ? (
                    <Section title="Bài tập thực hành">
                      <p>{seed.exercise}</p>
                    </Section>
                  ) : null}

                  {seed.reflectionQuestions.length > 0 ? (
                    <Section title="Câu hỏi suy ngẫm">
                      <ul>
                        {seed.reflectionQuestions.map((q) => (
                          <li key={q}>{q}</li>
                        ))}
                      </ul>
                    </Section>
                  ) : null}

                  {seed.companionNote ? (
                    <Section title="Ghi chú từ Companion">
                      <p>{seed.companionNote}</p>
                    </Section>
                  ) : null}

                  {seed.nextStep ? (
                    <Section title="Bước tiếp theo">
                      <p>{seed.nextStep}</p>
                    </Section>
                  ) : null}
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
