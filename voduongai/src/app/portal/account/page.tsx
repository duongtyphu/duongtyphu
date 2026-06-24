import { getSupabaseServer } from "@/lib/supabase-server";
import { LogoutButton } from "@/components/portal/LogoutButton";
import { ProfileForm } from "@/components/portal/ProfileForm";

export const metadata = { title: "Tài khoản" };

async function getUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export default async function AccountPage() {
  const user = await getUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Tài khoản</h1>
        <p className="mt-2 text-white">Thông tin đăng nhập của bạn trên Portal.</p>
      </div>

      {user ? (
        <>
          <div className="card-shine flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Email</p>
              <p className="mt-1 text-sm font-bold text-white">{user.email}</p>
            </div>
            <LogoutButton />
          </div>

          <ProfileForm meta={user.user_metadata ?? {}} />
        </>
      ) : (
        <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm text-white">
            Portal đang ở chế độ truy cập công khai (chưa yêu cầu đăng nhập).
          </p>
        </div>
      )}
    </div>
  );
}
