import Link from "next/link";
import { Image as ImageIcon, Type, Palette, Sparkles, Shapes, Share2, Library, Settings } from "lucide-react";
import { BrandWorkspaceShell } from "@/components/admin/brand/BrandWorkspaceShell";

// Mock data (Task 2 — "Brand Dashboard (Mock Data)"), theo đúng chỉ thị
// của brief. Khác với Website Dashboard (WEB-SPR-001 mock → nối dữ liệu
// thật ở WEB-SPR-006 audit sau 4 sprint xây Registry), Brand Studio xây
// toàn bộ Registry ngay trong CÙNG sprint này — nhưng Task 2 vẫn yêu cầu
// rõ Mock Data cho Dashboard, nên KHÔNG tự ý nối vào Registry thật ở đây.
// Số liệu cập nhật theo BRAND-SPR-201: 13 Brand Asset (7 category), 11
// Color Token, 6 Typography Token.
const MOCK_OVERVIEW = { totalAssets: 13, colorTokens: 11, typographyTokens: 6, themeProfiles: 2 };

const QUICK_ACTIONS = [
  { label: "Logo", href: "/admin/brand/logo", icon: ImageIcon },
  { label: "Wordmark", href: "/admin/brand/wordmark", icon: Type },
  { label: "Typography", href: "/admin/brand/typography", icon: Type },
  { label: "Color Palette", href: "/admin/brand/color-palette", icon: Palette },
  { label: "Theme", href: "/admin/brand/theme", icon: Sparkles },
  { label: "Icons", href: "/admin/brand/icons", icon: Shapes },
  { label: "Open Graph", href: "/admin/brand/open-graph", icon: Share2 },
  { label: "Brand Assets Registry", href: "/admin/brand/assets", icon: Library },
  { label: "Global Brand Settings", href: "/admin/brand/settings", icon: Settings },
];

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-1.5 text-2xl font-extrabold text-white">{value}</p>
    </div>
  );
}

export default function BrandDashboardPage() {
  return (
    <BrandWorkspaceShell>
      <div className="space-y-6">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/40">
            Brand Overview
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold normal-case text-white/40">
              Dữ liệu mẫu (Task 2) — số liệu thật xem trực tiếp ở từng Registry bên dưới
            </span>
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Brand Assets" value={MOCK_OVERVIEW.totalAssets} />
            <StatCard label="Color Tokens" value={MOCK_OVERVIEW.colorTokens} />
            <StatCard label="Typography Tokens" value={MOCK_OVERVIEW.typographyTokens} />
            <StatCard label="Theme Profiles" value={MOCK_OVERVIEW.themeProfiles} />
          </div>
        </div>

        <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5">
          <h2 className="text-sm font-bold text-white">⚠️ Phát hiện cần Founder xác nhận</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-white/70">
            <li>
              • <strong>Brand Orange có 2 mã màu khác nhau</strong> đang tồn tại song song (#FF7A00 đang dùng thật vs
              #F97316 theo quy ước CLAUDE.md) — xem Color Palette.
            </li>
            <li>
              • <strong>Portal/Admin dùng theme tối hardcode</strong>, không qua token — xem Theme.
            </li>
            <li>
              • <strong>Chưa có Open Graph Image mặc định</strong> nào cho toàn site — xem Open Graph.
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-white/40">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {QUICK_ACTIONS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center transition hover:border-brand-blue/40 hover:bg-white/[0.05]"
              >
                <Icon className="h-5 w-5 text-brand-blue" />
                <span className="text-xs font-semibold text-white/80">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </BrandWorkspaceShell>
  );
}
