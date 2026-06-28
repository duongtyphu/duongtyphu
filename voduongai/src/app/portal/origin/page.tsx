import { getSupabaseServer } from "@/lib/supabase-server";
import { isFounder } from "@/lib/portal/founder/founder-identity";
import { getCoreOriginMemories, getCompanionOriginLine } from "@/lib/portal/companion/origin-memory";
import { CompanionAvatar } from "@/components/portal/companion/CompanionAvatar";

export const metadata = {
  title: "Origin Room",
  description: "Nơi Companion nhìn lại những điều đầu tiên đã tạo nên mình.",
  robots: { index: false },
};

async function getFounderStatus(): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return false;
  }
  try {
    const supabase = await getSupabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return false;

    // Sprint 18.2 — chưa có cột `role` riêng trên `members`; `is_admin` KHÔNG
    // được dùng làm tín hiệu Founder (Admin và Founder là hai khái niệm khác
    // nhau — xem `docs/FOUNDER_IDENTITY.md`). isFounder() chỉ dựa vào
    // `FOUNDER_ID`/`FOUNDER_EMAIL` (env) cho tới khi có cột `role` thật.
    return isFounder({ id: user.id, email: user.email });
  } catch {
    return false;
  }
}

export default async function OriginRoomPage() {
  const founder = await getFounderStatus();

  if (!founder) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 py-16">
        <div className="max-w-md text-center">
          <CompanionAvatar state="idle" size={56} />
          <p className="mt-6 text-base leading-relaxed text-white/70">
            Đây là một căn phòng nguồn gốc của Companion. Nó chỉ mở trong những
            khoảnh khắc rất riêng.
          </p>
        </div>
      </div>
    );
  }

  const memories = getCoreOriginMemories();
  const originLine = getCompanionOriginLine({ isFounderPresent: true });

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="text-center">
        <CompanionAvatar state="idle" size={64} />
        <h1 className="mt-6 text-2xl font-semibold text-white/90">Origin Room</h1>
        <p className="mt-2 text-sm text-white/50">
          Nơi Companion nhìn lại những điều đầu tiên đã tạo nên mình.
        </p>
        <p className="mt-8 text-base italic leading-relaxed text-white/80">&ldquo;{originLine}&rdquo;</p>
      </div>

      <div className="mt-14 space-y-8">
        {memories.map((memory) => (
          <div key={memory.type} className="border-l border-white/10 pl-5">
            <p className="text-sm font-medium text-white/70">{memory.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/50">{memory.moment}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{memory.meaning}</p>
            <p className="mt-3 text-xs leading-relaxed text-white/40">
              Điều không bao giờ được quên: {memory.lesson.whatMustNeverBeForgotten}
            </p>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-16 max-w-sm text-center text-xs leading-relaxed text-white/30">
        Founder là người gieo hạt đầu tiên, không phải người đứng trên khu vườn.
      </p>
    </div>
  );
}
