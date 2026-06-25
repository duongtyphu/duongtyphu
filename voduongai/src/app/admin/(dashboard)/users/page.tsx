import { listUsers } from "./actions";
import { UserRow } from "./UserRow";

export default async function UsersAdminPage() {
  const { users, configured } = await listUsers();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-extrabold text-white">Người dùng</h1>
        <p className="mt-1 text-sm text-white/50">
          Toàn bộ tài khoản đăng ký thật trên Portal (Supabase Auth) — khoá tài khoản nếu vi phạm.
        </p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5 text-sm text-white/80">
          Chưa cấu hình <code className="text-brand-orange">SUPABASE_SERVICE_ROLE_KEY</code> trong{" "}
          <code className="text-brand-orange">.env.local</code> — cần quyền service role (Auth Admin API) để đọc
          danh sách người dùng thật.
        </div>
      )}

      {configured && (
        <>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Tổng số người dùng</p>
            <p className="mt-2 text-2xl font-extrabold text-white">{users.length}</p>
            <p className="mt-2 text-xs text-white/40">
              Lưu ý: các chỉ số tương tác (tiến độ roadmap, prompt đã copy, tool đã click...) chưa được theo dõi
              trong hệ thống — cần xây tracking riêng nếu muốn hiển thị tại đây.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wide text-white/40">
                  <th className="px-3 py-3">Tên</th>
                  <th className="px-3 py-3">Email</th>
                  <th className="px-3 py-3">Mã giới thiệu</th>
                  <th className="px-3 py-3">Ngày đăng ký</th>
                  <th className="px-3 py-3">Đăng nhập gần nhất</th>
                  <th className="px-3 py-3">Trạng thái</th>
                  <th className="px-3 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <UserRow key={u.id} user={u} />
                ))}
              </tbody>
            </table>
            {users.length === 0 && <p className="p-5 text-sm text-white/40">Chưa có người dùng nào.</p>}
          </div>
        </>
      )}
    </div>
  );
}
