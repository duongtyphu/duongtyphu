import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";

export const metadata = { title: "Hồ sơ của tôi · Admin" };

type MemberProfile = {
  email: string;
  full_name: string | null;
  status: string;
  avatar_url: string | null;
  occupation: string | null;
  ai_goal: string | null;
  interests: string[] | null;
  created_at: string;
  onboarding_completed_at: string | null;
  is_admin: boolean;
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

/**
 * ADM-V2-01 — "Hồ sơ của tôi" (Người dùng). Hồ sơ CHÍNH tài khoản Admin
 * đang đăng nhập, đọc trực tiếp bảng `members` bằng đúng `id` của phiên
 * hiện tại (không phải trang sửa hồ sơ Portal `/portal/account` — trang đó
 * vẫn giữ nguyên, không đụng). CHỈ ĐỌC — không có nút Lưu ở đây; sửa hồ sơ
 * vẫn thực hiện qua `/portal/account` như trước.
 */
export default async function HoSoPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const supabase = getSupabaseAdmin();
  const { data } = supabase
    ? await supabase
        .from("members")
        .select("email, full_name, status, avatar_url, occupation, ai_goal, interests, created_at, onboarding_completed_at, is_admin")
        .eq("id", admin.id)
        .maybeSingle()
    : { data: null };

  const profile = data as MemberProfile | null;

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Người dùng", href: "/admin/users" }, { label: "Hồ sơ của tôi" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Hồ sơ của tôi</h1>
        <p className="mt-1 text-sm text-gray-500">
          Hồ sơ tài khoản Admin đang đăng nhập ({admin.email}). Sửa hồ sơ vẫn thực hiện tại{" "}
          <code className="text-gray-700">/portal/account</code> — trang này CHỈ ĐỌC.
        </p>
      </div>

      {!supabase && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — không thể đọc
          hồ sơ.
        </div>
      )}

      {supabase && !profile && (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          Không tìm thấy hồ sơ tương ứng trong bảng members.
        </div>
      )}

      {supabase && profile && (
        <div className="flex flex-wrap gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover" />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-400">
              {(profile.full_name ?? profile.email).slice(0, 1).toUpperCase()}
            </div>
          )}
          <dl className="grid flex-1 grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-gray-400">Họ tên</dt>
              <dd className="mt-0.5 text-sm text-gray-900">{profile.full_name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-gray-400">Email</dt>
              <dd className="mt-0.5 text-sm text-gray-900">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-gray-400">Vai trò</dt>
              <dd className="mt-0.5 text-sm text-gray-900">{profile.is_admin ? "Admin" : "User"}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-gray-400">Trạng thái</dt>
              <dd className="mt-0.5 text-sm text-gray-900">{profile.status}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-gray-400">Nghề nghiệp</dt>
              <dd className="mt-0.5 text-sm text-gray-900">{profile.occupation ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-gray-400">Mục tiêu AI</dt>
              <dd className="mt-0.5 text-sm text-gray-900">{profile.ai_goal ?? "—"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-bold uppercase tracking-wide text-gray-400">Sở thích</dt>
              <dd className="mt-0.5 text-sm text-gray-900">
                {profile.interests && profile.interests.length > 0 ? profile.interests.join(", ") : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-gray-400">Ngày tạo</dt>
              <dd className="mt-0.5 text-sm text-gray-900">{formatDate(profile.created_at)}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-gray-400">Hoàn tất Onboarding</dt>
              <dd className="mt-0.5 text-sm text-gray-900">{formatDate(profile.onboarding_completed_at)}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
