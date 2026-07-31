import Link from "next/link";
import {
  Sparkles,
  Wand2,
  Bot,
  Rocket,
  Network,
  User,
  Users,
  BookOpen,
  Calendar,
  Newspaper,
  ArrowRight,
  MessageCircle,
  PlayCircle,
  Globe,
  Music2,
  Send,
  type LucideIcon,
} from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase-server";
import { getLiveUpdates } from "@/lib/portal/live-updates";
import { getLiveCommunityChannels } from "@/lib/portal/live-community";
import { CommunityGuides } from "@/components/portal/community/CommunityGuides";
import { CommunityMapPanel } from "@/components/portal/community/CommunityMapPanel";

/** Việc 8 — icon theo `platform` của bảng `community` (không có brand logo
 * chính thức trong lucide-react — dùng icon gợi ý chung, cùng tinh thần
 * Facebook/YouTube/Zalo trước đây cũng dùng icon chung (Globe/PlayCircle/
 * MessageCircle), không phải logo thật). */
const PLATFORM_ICON: Record<string, LucideIcon> = {
  Facebook: Globe,
  YouTube: PlayCircle,
  TikTok: Music2,
  Zalo: MessageCircle,
  Telegram: Send,
};

export const metadata = {
  title: "Cộng đồng",
  description: "Cộng đồng VO DUONG AI — nơi những người học tập, sáng tạo và trưởng thành cùng AI gặp nhau.",
};

/**
 * COMMUNITY CAMPUS RECONSTRUCTION (Product Owner approved).
 *
 * Community KHÔNG phải Facebook/Forum/Discord/News Feed/trang Portal
 * chung — là một "AI Campus" riêng biệt: khí quyển ban ngày ấm áp, KHÔNG
 * dùng nền caro/lưới chuẩn Portal (`.gemos-bg`) — trang full-bleed với
 * `.campus-bg` riêng để che hoàn toàn nền caro toàn cục, cùng cơ chế với
 * Premium/Companion/Journey.
 *
 * CONTENT AUDIT (thay cho nội dung `congdongai` cũ):
 * - PillarHero + khối "Bạn mới? Nên bắt đầu từ đây" (4 bước) + Rules +
 *   FAQ → ARCHIVE. Không nằm trong 10 khối được duyệt của brief này
 *   ("Do not add unrelated sections"), và không có khối nào trong 10
 *   khối là nơi hợp lý để giữ lại nguyên trạng.
 * - Khối "Các kênh cộng đồng" (Facebook/Zalo/YouTube, dữ liệu THẬT từ
 *   `siteConfig.community`) → KEEP + MOVE: đây là kênh cộng đồng đang
 *   hoạt động thật, nhưng brief cấm dùng Facebook/Telegram/Discord làm
 *   CTA CHÍNH ("Do not fake a Facebook... link" — không biến Community
 *   thành cổng redirect ra Facebook). Giữ lại như lối kết nối THỰC TẾ,
 *   phụ, ở cuối trang — CTA chính "Tham gia cộng đồng" dùng trạng thái
 *   coming-soon trung thực vì chưa có không gian cộng đồng sở hữu riêng.
 * - `/portal/student-success` (câu chuyện học viên BỊA — không có ảnh
 *   thật/xác thực) → ARCHIVE, không migrate nội dung (vi phạm
 *   NO-FAKE-DATA). Route redirect sang Community Stories, dùng empty
 *   state trung thực.
 * - `/portal/updates` (tin tức sản phẩm — nội dung THẬT, chỉ là mảng
 *   tĩnh chưa có CMS) → MOVE vào khối Community News bên dưới, giữ
 *   nguyên nội dung thật, route cũ redirect vào đây.
 * - `/portal/case-studies` (Supabase thật, đã có empty state trung
 *   thực) → KEEP nguyên trang (CKOS/Academy vẫn trỏ tới), Community
 *   Project Showcase đọc THÊM cùng bảng `case_studies` để hiển thị bản
 *   xem trước thật, không tạo bảng trùng lặp.
 *
 * KHÔNG có nguồn dữ liệu thật cho: Community Stories cá nhân, Workshops
 * & Events, vị trí thành viên trên bản đồ (bảng `members` không có cột
 * city/location) — cả ba dùng đúng empty state trung thực brief đã duyệt,
 * không suy diễn/bịa.
 *
 * VIỆC 8 (cập nhật, không sửa lịch sử ở trên) — 2/4 bảng Admin đã seed sẵn
 * (`community`, `updates`, `news`, `student_success_stories`) được nối vào
 * đây:
 * - `updates` (5 dòng) → thay mảng tĩnh `NEWS` ở khối Community News, đọc
 *   qua `getLiveUpdates()`.
 * - `community` (5 kênh) → thay 3 href tĩnh `siteConfig.community.*`/
 *   `siteConfig.links.youtube` ở khối "Kết nối ngay hôm nay", đọc qua
 *   `getLiveCommunityChannels()` (lọc `status="Active"` — TikTok là kênh
 *   thật chưa từng hiển thị trước đây, Telegram chưa có URL nên tự ẩn).
 * - `student_success_stories` (3 dòng) — dữ liệu Y HỆT 3 câu chuyện BỊA đã
 *   archive ở `/portal/student-success` (dòng 65-68 ở trên). Founder xác
 *   nhận: build Admin DataTable để tự dọn/nhập chuyện thật sau này, nhưng
 *   KHÔNG nối vào Community Stories ở việc này — mục đó VẪN giữ nguyên
 *   empty state trung thực, không đảo ngược quyết định NO-FAKE-DATA.
 * - `news` (1 dòng, dạng thông báo đơn lẻ) — audit xác nhận không có UI
 *   nào tiêu thụ bảng này ở bất kỳ đâu (không phải Community News, đó là
 *   `updates`). Founder xác nhận: bỏ qua hoàn toàn ở việc này, không build
 *   Admin, không nối Portal — quyết định sau nếu cần.
 */

type ShowcaseItem = {
  id: number;
  title: string;
  client_name: string | null;
  summary: string | null;
  result_metric: string | null;
  thumbnail_url: string | null;
  link_url: string | null;
};

async function getShowcaseItems(): Promise<ShowcaseItem[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];
  try {
    const supabase = await getSupabaseServer();
    const { data } = await supabase
      .from("case_studies")
      .select("id, title, client_name, summary, result_metric, thumbnail_url, link_url")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(3);
    return data ?? [];
  } catch {
    return [];
  }
}

const LEARNING_SPACES = [
  {
    key: "beginner",
    icon: Sparkles,
    title: "AI Beginner",
    purpose: "Làm quen AI từ số 0 — không thuật ngữ khó, không cần nền tảng kỹ thuật.",
    who: "Người mới bắt đầu, chưa từng dùng AI trong công việc.",
    cta: { label: "Vào Học viện AI", href: "/portal/hocvienai" },
    tint: "border-sky-200/70 bg-gradient-to-br from-sky-50/95 via-white/90 to-blue-50/70 hover:border-sky-300",
    chip: "bg-gradient-to-br from-sky-500 to-blue-600 text-white",
  },
  {
    key: "prompt",
    icon: Wand2,
    title: "Prompt Engineering",
    purpose: "Luyện cách viết Prompt hiệu quả, tái sử dụng được cho công việc thật.",
    who: "Người đã quen AI cơ bản, muốn ra kết quả tốt hơn mỗi lần hỏi.",
    cta: { label: "Mở Thư viện Prompt", href: "/portal/prompts" },
    tint: "border-violet-200/70 bg-gradient-to-br from-violet-50/95 via-white/90 to-indigo-50/70 hover:border-violet-300",
    chip: "bg-gradient-to-br from-violet-600 to-indigo-600 text-white",
  },
  {
    key: "automation",
    icon: Bot,
    title: "Automation",
    purpose: "Ghép nhiều công cụ AI thành một quy trình chạy tự động cho công việc lặp lại.",
    who: "Người đã có quy trình thủ công, muốn AI làm thay phần lặp lại.",
    cta: { label: "Khám phá AI Workspace", href: "/portal/aiworkspace" },
    tint: "border-emerald-200/70 bg-gradient-to-br from-emerald-50/95 via-white/90 to-green-50/70 hover:border-emerald-300",
    chip: "bg-gradient-to-br from-emerald-600 to-green-600 text-white",
  },
  {
    key: "affiliate",
    icon: Rocket,
    title: "Affiliate AI",
    purpose: "Dùng AI để nghiên cứu, tạo nội dung và vận hành hệ thống Affiliate.",
    who: "Người muốn xây thu nhập từ Affiliate Marketing bằng AI.",
    cta: { label: "Xem hệ sinh thái Affiliate", href: "/portal/duan-cohoi/lam-affilate" },
    tint: "border-amber-200/70 bg-gradient-to-br from-amber-50/95 via-white/90 to-orange-50/70 hover:border-amber-300",
    chip: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
  },
  {
    key: "openclaw",
    icon: Network,
    title: "OpenClaw",
    purpose: "Xây một hệ trợ lý AI thực chiến: lịch, thư, tài liệu, nội dung, khách hàng.",
    who: "Người muốn AI xử lý công việc thật, không phải demo.",
    cta: { label: "Xem Lớp học OpenClaw", href: "/portal/premium#premium-openclaw" },
    tint: "border-rose-200/70 bg-gradient-to-br from-rose-50/95 via-white/90 to-orange-50/70 hover:border-rose-300",
    chip: "bg-gradient-to-br from-rose-500 to-orange-500 text-white",
  },
  {
    key: "v-solo",
    icon: User,
    title: "V-Solo",
    purpose: "Một người vận hành toàn bộ hệ thống Affiliate bằng AI — từ nghiên cứu đến chuyển đổi.",
    who: "Người muốn tự vận hành, không cần đội nhóm.",
    cta: { label: "Xem V-Solo", href: "/portal/premium#premium-v-solo" },
    tint: "border-blue-200/70 bg-gradient-to-br from-blue-50/95 via-white/90 to-indigo-50/70 hover:border-blue-300",
    chip: "bg-gradient-to-br from-blue-600 to-indigo-600 text-white",
  },
  {
    key: "v-scale",
    icon: Users,
    title: "V-Scale",
    purpose: "Chuẩn hóa, nhân bản hệ thống và xây lộ trình leader kế thừa cho đội nhóm.",
    who: "Người đã có hệ thống chạy, giờ cần đội nhóm làm được như mình.",
    cta: { label: "Xem V-Scale", href: "/portal/premium#premium-v-scale" },
    tint: "border-cyan-200/70 bg-gradient-to-br from-cyan-50/95 via-white/90 to-teal-50/70 hover:border-cyan-300",
    chip: "bg-gradient-to-br from-cyan-600 to-teal-600 text-white",
  },
] as const;

export default async function CommunityPage() {
  const [showcaseItems, updates, channels] = await Promise.all([
    getShowcaseItems(),
    getLiveUpdates(),
    getLiveCommunityChannels(),
  ]);

  return (
    <div className="relative -mx-4 -my-6 min-h-full overflow-hidden md:-mx-8 md:-my-8">
      <div className="campus-bg" aria-hidden />
      <div className="campus-glow-a" style={{ width: 340, height: 340, top: -100, right: -80 }} aria-hidden />
      <div className="campus-glow-b" style={{ width: 300, height: 300, bottom: 60, left: -100 }} aria-hidden />
      <div className="campus-glow-c" style={{ width: 240, height: 240, bottom: -60, right: 140 }} aria-hidden />

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
      {/* Content Gutter — cùng khung rounded-3xl p-6 md:p-8 với các trang
       * pillar khác (Home/CKOS/Academy/Projects/AI Workspace), lộ khí
       * quyển Campus ở viền ngoài thay vì nội dung chạm sát mép. */}
      <div className="rounded-3xl p-6 md:p-8">
      <div className="mx-auto max-w-5xl space-y-16 px-5 py-10 sm:px-8 md:py-14">
        {/* ── 1. Campus Hero ───────────────────────────────────────────── */}
        <section className="campus-hero p-8 text-center sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">Cộng đồng</p>
          <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
            Cộng đồng VO DUONG AI
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600">
            Những con người đang cùng nhau học tập, sáng tạo và trưởng thành cùng AI.
          </p>
          <p className="mx-auto mt-6 max-w-md text-sm italic leading-relaxed text-gray-500">
            Mỗi hành trình đều bắt đầu từ một người. Nhưng đôi khi, chính những người đồng hành sẽ giúp
            hành trình ấy đi xa hơn.
          </p>

          <div className="mx-auto mt-8 flex max-w-xs flex-col items-center gap-2">
            <span
              aria-disabled="true"
              className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-400"
            >
              Tham gia cộng đồng
            </span>
            <p className="text-xs text-gray-400">Không gian cộng đồng riêng đang được xây dựng — quay lại sớm nhé.</p>
          </div>
        </section>

        {/* ── 2. Community Stories ─────────────────────────────────────── */}
        <section>
          <SectionEyebrow icon={BookOpen} label="Câu chuyện" title="Community Stories" />
          <div className="campus-card mt-5 flex flex-col items-center gap-2 p-10 text-center">
            <p className="max-w-sm text-sm leading-relaxed text-gray-500">
              Câu chuyện đầu tiên của cộng đồng đang chờ được viết.
            </p>
          </div>
        </section>

        {/* ── 3. Learning Spaces ───────────────────────────────────────── */}
        <section>
          <SectionEyebrow icon={Sparkles} label="Nơi học cùng nhau" title="Learning Spaces" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEARNING_SPACES.map((space) => (
              <div key={space.key} className={`rounded-2xl border p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_24px_-16px_rgba(15,23,42,0.16)] backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 ${space.tint}`}>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${space.chip}`}>
                  <space.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-gray-900">{space.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-600">{space.purpose}</p>
                <p className="mt-2 text-[11px] text-gray-400">
                  <span className="font-semibold text-gray-500">Dành cho:</span> {space.who}
                </p>
                <Link
                  href={space.cta.href}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-gray-900/10 bg-white/80 px-4 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-gray-900/25 hover:text-gray-900"
                >
                  {space.cta.label} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. Community Project Showcase ────────────────────────────── */}
        <section>
          <SectionEyebrow icon={Rocket} label="Trưng bày" title="Community Project Showcase" />
          {showcaseItems.length === 0 ? (
            <div className="campus-card mt-5 flex flex-col items-center gap-2 p-10 text-center">
              <p className="max-w-sm text-sm leading-relaxed text-gray-500">
                Không gian này đang chờ sản phẩm đầu tiên từ cộng đồng.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {showcaseItems.map((item) => (
                  <div key={item.id} className="campus-card overflow-hidden">
                    <div className="flex h-32 w-full items-center justify-center bg-gradient-to-br from-sky-100 via-white to-emerald-50">
                      {item.thumbnail_url ? (
                        // eslint-disable-next-line @next/next/no-img-element -- ảnh do Admin nhập URL ngoài, không thuộc /public
                        <img src={item.thumbnail_url} alt={item.title} className="h-full w-full object-cover" />
                      ) : (
                        <Rocket className="h-8 w-8 text-sky-300" />
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                      {item.client_name && <p className="mt-1 text-xs text-gray-400">{item.client_name}</p>}
                      {item.summary && <p className="mt-2 text-xs leading-relaxed text-gray-600">{item.summary}</p>}
                      {item.result_metric && (
                        <p className="mt-2 inline-flex rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-600">
                          {item.result_metric}
                        </p>
                      )}
                      {item.link_url && (
                        <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="mt-3 block text-xs font-semibold text-blue-600 hover:underline">
                          Xem chi tiết →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/portal/case-studies" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline">
                Xem tất cả Case Study <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </section>

        {/* ── 5. Workshops & Events ────────────────────────────────────── */}
        <section>
          <SectionEyebrow icon={Calendar} label="Sự kiện" title="Workshops & Events" />
          <div className="campus-card mt-5 flex flex-col items-center gap-2 p-10 text-center">
            <p className="max-w-sm text-sm leading-relaxed text-gray-500">
              Sự kiện tiếp theo đang được chuẩn bị.
            </p>
          </div>
        </section>

        {/* ── 6. Community News ────────────────────────────────────────── */}
        <section id="tin-tuc" className="scroll-mt-24">
          <SectionEyebrow icon={Newspaper} label="Tin tức" title="Community News" />
          <div className="mt-5 space-y-2.5">
            {updates.map((n) => (
              <div key={n.id} className="campus-card flex items-start gap-4 p-4">
                <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
                  {n.type}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                  <p className="mt-1 text-xs text-gray-400">{new Date(n.date).toLocaleDateString("vi-VN")}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 7. Companion Corner ──────────────────────────────────────── */}
        <section className="campus-card p-6 text-center sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Companion</p>
          <p className="mx-auto mt-3 max-w-md text-base italic leading-relaxed text-gray-700">
            &ldquo;Một cộng đồng không mạnh vì có nhiều người. Một cộng đồng mạnh vì có nhiều người cùng
            giúp nhau trưởng thành.&rdquo;
          </p>
        </section>

        {/* ── 8. People Who Accompany You ──────────────────────────────── */}
        <section>
          <SectionEyebrow icon={Users} label="Đồng hành" title="Người đồng hành cùng bạn" />
          <div className="mt-5">
            <CommunityGuides />
          </div>
        </section>

        {/* ── 9. Community Map ─────────────────────────────────────────── */}
        <section>
          <SectionEyebrow icon={MessageCircle} label="Bản đồ" title="Community Map" />
          <div className="mt-5">
            <CommunityMapPanel />
          </div>
        </section>

        {/* ── 10. Final Join Community CTA ─────────────────────────────── */}
        <section className="campus-hero p-8 text-center sm:p-10">
          <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl">Cùng bắt đầu một câu chuyện</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-600">
            Cộng đồng đang lớn lên mỗi ngày — hành trình của bạn có thể là câu chuyện tiếp theo.
          </p>

          <div className="mx-auto mt-6 flex max-w-xs flex-col items-center gap-2">
            <span
              aria-disabled="true"
              className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-400"
            >
              Tham gia cộng đồng
            </span>
            <p className="text-xs text-gray-400">Không gian cộng đồng riêng đang được xây dựng — quay lại sớm nhé.</p>
          </div>

          <div className="mx-auto mt-8 max-w-sm border-t border-gray-100 pt-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Kết nối ngay hôm nay</p>
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              {channels.map((c) => {
                const Icon = PLATFORM_ICON[c.platform] ?? Globe;
                return (
                  <a
                    key={c.id}
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-blue-300 hover:text-blue-600"
                  >
                    <Icon className="h-3.5 w-3.5" /> {c.label}
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      </div>
      </div>
      </div>
    </div>
  );
}

function SectionEyebrow({ icon: Icon, label, title }: { icon: typeof BookOpen; label: string; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
        <Icon className="h-4 w-4 text-blue-600" />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
    </div>
  );
}
