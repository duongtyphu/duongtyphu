"use client";

import Link from "next/link";
import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { JOURNEY_COMMUNITY_SECTIONS } from "@/lib/admin/journeyCommunity/navigation";

type Row = Record<string, string>;

function Table<T extends Row>({ columns, rows }: { columns: { key: keyof T; label: string; mono?: boolean }[]; rows: T[] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-white/40">
            {columns.map((c) => (
              <th key={String(c.key)} className="py-2 pr-4 font-semibold">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/5 align-top">
              {columns.map((c, ci) => (
                <td
                  key={String(c.key)}
                  className={`py-2 ${ci < columns.length - 1 ? "pr-4" : ""} ${
                    c.mono ? "font-mono text-xs text-white/60" : "text-xs text-white/60"
                  } ${ci === 0 ? "font-semibold text-white/80 whitespace-nowrap" : ""}`}
                >
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Portal Mapping (Task 1, JOURNEY-SPR-901) — đối chiếu trực tiếp 3 Portal
 * Area brief giao: Hành trình của tôi, Sứ mệnh Companion, Cộng đồng. Xem
 * `docs/admin/JOURNEY_COMMUNITY_MANAGEMENT_JOURNEY-SPR-901.md`.
 */
const AREA_MAPPING: Row[] = [
  { area: "1. Hành trình của tôi (/portal/hanhtrinhcuatoi)", source: "src/app/portal/hanhtrinhcuatoi/page.tsx", count: "7 section + 5 route con", note: "Đính chính từ 3 lên 7 section." },
  { area: "2. Sứ mệnh Companion (/portal/su-menh-companion)", source: "src/app/portal/su-menh-companion/page.tsx", count: "3 nhóm nội dung + 1 route con", note: "560 dòng, không có <section> rõ ràng — giữ nguyên 3 nhóm đã có, đổi Owner." },
  { area: "3. Cộng đồng (/portal/congdongai)", source: "src/app/portal/congdongai/page.tsx", count: "10 section", note: "Đính chính từ 3 lên 10 section (\"COMMUNITY CAMPUS RECONSTRUCTION\")." },
];

const JOURNEY_DOORS: Row[] = [
  { door: "Bản đồ hành trình", route: "/portal/hanhtrinhcuatoi/ban-do", source: "JourneyMapAtlas — reflections (Supabase) + growth-view (localStorage)", note: "Server component chỉ gom dữ liệu thật, không hardcode nội dung." },
  { door: "My Story", route: "/portal/story", source: "MyStoryBook — reflections + memory_capsules + growth-milestones (Supabase)", note: "\"Cuốn sách cá nhân\", không phải blog/timeline biên tập được." },
  { door: "Mirror", route: "/portal/mirror", source: "MirrorChamber — growth-signals + growth-milestones + Companion mirror-dialogue", note: "Không chấm điểm/phân tích — chỉ phản chiếu dữ liệu thật." },
  { door: "Nhật ký học tập", route: "/portal/nhatkyhoctap", source: "LearningJournalNotebook — reflections (Supabase) + phiên AI Workspace (localStorage)", note: "Product Owner DECISION: không bài viết Admin/blog nào render ở đây." },
  { door: "Khu vườn của bạn", route: "/portal/khuvuoncuaban", source: "GardenExperience — reflections + memory_capsules + growth-milestones (Supabase)", note: "\"Không thể tưới bằng dữ liệu giả\" (comment gốc)." },
];

const JOURNEY_MANAGEMENT: Row[] = [
  { item: "Journey Pages", status: "✅ Quản lý được", note: "Qua chức năng quản lý Trang trong Khu vực Portal (/admin/portal/areas) — visibility/publishStatus thật cho 6 trang (Hub + 5 cửa), đã có từ PORTAL-SPR-301." },
  { item: "CTA", status: "⚠️ Chỉ xem, chưa có chức năng thêm/sửa/xóa", note: "Nhãn/link 5 cửa (DOORS), câu hỏi Reflection (todaysPrompt()), CTA cuối trang — 100% hardcode trong page.tsx, chưa có dữ liệu quản lý riêng." },
  { item: "Visibility / Publish", status: "✅ Quản lý được", note: "Ở cấp Trang qua phần quản lý Trang (đã có). Không có khái niệm ẩn/hiện riêng cho từng khối bên trong 1 trang Journey." },
  { item: "Reflection", status: "❌ KHÔNG PHẢI content Founder tạo", note: "Bảng reflections (Supabase) — câu trả lời THẬT của từng học viên. Founder không \"quản lý\" nội dung này như CMS — quản lý sẽ là sửa/xoá dữ liệu người dùng, không tạo form sửa giả." },
  { item: "Milestone", status: "❌ KHÔNG PHẢI content Founder tạo", note: "detectGrowthMilestones() tính TOÁN từ hoạt động thật (reflections/memory_capsules) — không phải danh sách Founder soạn sẵn." },
  { item: "Story", status: "❌ KHÔNG PHẢI content Founder tạo", note: "My Story = cuốn sách CÁ NHÂN của từng học viên, dựng từ dữ liệu thật của chính họ — không phải 1 trang nội dung chung Founder biên tập." },
  { item: "Timeline", status: "❌ KHÔNG PHẢI content Founder tạo", note: "GrowthActivityPanel đọc thẳng Growth Event log (localStorage) thật — không có bảng \"Timeline\" nào để quản lý." },
];

const MISSION_MANAGEMENT: Row[] = [
  { item: "Hero", status: "⚠️ Hardcode, chưa sửa được trong Admin", note: "Living Core intro + tiêu đề — page.tsx, chưa quản lý bằng dữ liệu." },
  { item: "Core Message", status: "⚠️ Hardcode, chưa sửa được trong Admin", note: "MISSION_ITEMS (vòng tròn 6 sứ mệnh) — mảng hardcode." },
  { item: "Story Sections", status: "⚠️ Hardcode, chưa sửa được trong Admin", note: "GENOME (12 gene) + PHILOSOPHY_PAIRS (4 cặp) + CONSTITUTION + EVOLUTION + TIMELINE — toàn bộ mảng hardcode trong page.tsx (560 dòng)." },
  { item: "CTA", status: "⚠️ Hardcode, chưa sửa được trong Admin", note: "Link cuối trang, chưa quản lý bằng dữ liệu." },
  { item: "Publish", status: "✅ Quản lý được", note: "Ở cấp Trang qua phần quản lý Trang (publishStatus, đã có)." },
];

const FUTURE_FLEXIBILITY: Row[] = [
  { capability: "Thêm Journey Page mới", result: "❌ Cần sửa code", note: "Route Next.js mới (app/portal/...) + component riêng — phần quản lý Trang chỉ ghi nhận, không tự sinh route thật." },
  { capability: "Thêm Reflection", result: "➖ Không áp dụng", note: "Reflection do NGƯỜI DÙNG tạo qua hành động thật trên Portal — Founder không \"thêm\" Reflection thay người dùng (sẽ là dữ liệu giả)." },
  { capability: "Thêm Milestone", result: "➖ Không áp dụng", note: "Milestone là kết quả TÍNH TOÁN từ hoạt động thật — không phải bản ghi Founder tạo tay." },
  { capability: "Thêm Community Page mới", result: "❌ Cần sửa code", note: "Cùng lý do Journey Page — route Next.js thật, không phải bản ghi CMS." },
  { capability: "Thêm Story", result: "➖ Không áp dụng", note: "My Story là cuốn sách cá nhân hoá — không có khái niệm \"thêm 1 Story\" ở cấp Admin." },
  { capability: "Thêm CTA", result: "❌ Cần sửa code", note: "Mọi CTA hiện tại (Journey/Mission/Community) đều hardcode trong .tsx, chưa quản lý CTA bằng dữ liệu cho 3 khu vực này (khác khu vực Website, đã có kho Nội dung dùng chung riêng)." },
];

export default function JourneyAdminPage() {
  return (
    <AdminWorkspaceShell
      title="Hành trình & Cộng đồng"
      description="Hành trình + Cộng đồng + Sứ mệnh Companion — 3 khu vực Portal đối chiếu trực tiếp. Phần lớn nội dung Hành trình là dữ liệu thật của người dùng (không phải nội dung CMS); Sứ mệnh + phần lớn Cộng đồng đang hardcode trong code, chưa sửa được trong Admin."
      rootHref="/admin/journey"
      sections={JOURNEY_COMMUNITY_SECTIONS}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5">
          <h2 className="text-sm font-bold text-white">Đối chiếu Portal — 3 khu vực</h2>
          <Table
            columns={[
              { key: "area", label: "Khu vực Portal" },
              { key: "source", label: "Nguồn", mono: true },
              { key: "count", label: "Số lượng" },
              { key: "note", label: "Ghi chú" },
            ]}
            rows={AREA_MAPPING}
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Đối chiếu Portal — 5 cửa Hành trình (route con)</h2>
          <Table
            columns={[
              { key: "door", label: "Cửa" },
              { key: "route", label: "Route", mono: true },
              { key: "source", label: "Nguồn dữ liệu" },
              { key: "note", label: "Ghi chú" },
            ]}
            rows={JOURNEY_DOORS}
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Quản lý Hành trình</h2>
          <p className="mt-1 text-xs text-white/50">
            Reflection/Milestone/Story/Timeline KHÔNG phải đối tượng CMS — đây là dữ liệu thật của từng học viên (Supabase{" "}
            <code className="text-brand-orange">reflections</code>/<code className="text-brand-orange">memory_capsules</code>{" "}
            + tính toán từ hoạt động thật). Xây form quản lý cho các mục này sẽ là tạo dữ liệu giả — đúng Founder Directive
            &quot;không tạo dữ liệu giả&quot;.
          </p>
          <Table columns={[{ key: "item", label: "Hạng mục" }, { key: "status", label: "Trạng thái" }, { key: "note", label: "Ghi chú" }]} rows={JOURNEY_MANAGEMENT} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Quản lý Cộng đồng</h2>
          <p className="mt-2 text-sm text-white/60">
            <strong className="text-white/80">Community Landing</strong> (/portal/congdongai) — 10 section thật, xem Portal
            Mapping ở trên. <strong className="text-white/80">News</strong> — mảng <code className="text-brand-orange">NEWS</code> 5
            mục hardcode trong page.tsx (di dời nguyên vẹn từ /portal/updates cũ) — KHÔNG phải collection Supabase{" "}
            <code className="text-brand-orange">news</code>/<code className="text-brand-orange">updates</code> (Consumer = 0 cho
            trang này, dù 2 collection đó tồn tại thật ở nhóm nav Content). <strong className="text-white/80">Success Stories</strong> —
            section &quot;Community Stories&quot; hiện empty-state trung thực (Product Owner approved, không bịa dữ liệu).{" "}
            <strong className="text-white/80">CTA</strong> — &quot;Tham gia cộng đồng&quot; disabled có chủ đích (chưa có không
            gian cộng đồng riêng). <strong className="text-white/80">External Links</strong> — <strong className="text-emerald-400">đã vá</strong>:
            trước JOURNEY-SPR-901, 3 link Facebook Group/Zalo Group/YouTube hardcode trong <code className="text-brand-orange">siteConfig</code>{" "}
            (site.ts), trong khi trang quản lý thật (<Link href="/admin/community" className="text-brand-blue hover:underline">/admin/community</Link>, bảng{" "}
            <code className="text-brand-orange">community</code>) có Consumer = 0 — Founder sửa link ở Admin không ảnh hưởng Portal. Đã
            nối dây trang Portal đọc trực tiếp collection thật (xem <code className="text-brand-orange">CommunityExternalLinks.tsx</code>).{" "}
            <strong className="text-white/80">Community Section</strong> — 10 section đối chiếu ở Portal Mapping, 8/10 hardcode, 2/10 đọc
            dữ liệu thật (Showcase từ <code className="text-brand-orange">case_study</code>, External Links từ{" "}
            <code className="text-brand-orange">community</code>).
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Quản lý trang Sứ mệnh</h2>
          <p className="mt-1 text-xs text-white/50">
            Sứ mệnh Companion (/portal/su-menh-companion) — nhân cách và hệ thống AI thật (companion-identity.ts, danh mục
            Agent, quy tắc điều phối) vẫn do khu vực <strong className="text-white/80">Companion</strong> phụ trách —
            trang này chỉ TRÌNH BÀY câu chuyện/triết lý, không chứa hệ thống AI nào. Không tạo hệ thống AI mới ở đây (đúng
            Founder Directive).
          </p>
          <Table columns={[{ key: "item", label: "Hạng mục" }, { key: "status", label: "Trạng thái" }, { key: "note", label: "Ghi chú" }]} rows={MISSION_MANAGEMENT} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Nơi phụ trách</h2>
          <p className="mt-2 text-sm text-white/60">
            Hành trình & Cộng đồng chỉ phụ trách: trải nghiệm Hành trình (Hub + 5 cửa), trải nghiệm Cộng đồng (Campus + kênh cộng đồng),
            phần trình bày Sứ mệnh (trang Sứ mệnh Companion — KHÔNG bao gồm nhân cách/danh mục Agent/quy tắc điều phối, vẫn
            thuộc khu vực Companion). <strong className="text-white/80">Không phụ trách</strong>: Hệ tri thức AI (CKOS), Học viện AI,
            Premium, hệ thống AI Mentor (khu vực Companion — nhân cách/Agent/điều phối/trí nhớ),
            Media (Thư viện Media), Thương hiệu, Website. Community Project Showcase đọc THÊM từ
            bảng <code className="text-brand-orange">case_study</code> (CKOS/Academy sở hữu) — không tạo bảng trùng lặp,
            không sở hữu dữ liệu đó.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Khả năng mở rộng tương lai</h2>
          <Table
            columns={[
              { key: "capability", label: "Khả năng" },
              { key: "result", label: "Kết quả" },
              { key: "note", label: "Ghi chú" },
            ]}
            rows={FUTURE_FLEXIBILITY}
          />
        </div>
      </div>
    </AdminWorkspaceShell>
  );
}
