import { getSupabaseServer } from "@/lib/supabase-server";
import { isFounder } from "@/lib/portal/founder/founder-identity";
import { getCoreOriginMemories } from "@/lib/portal/companion/origin-memory";
import { getOriginLineFromCoreMemory } from "@/lib/portal/companion/core-memory";
import { getOriginLineContextDefinition } from "@/lib/portal/companion/origin-line-context";
import { LivingCore } from "@/components/LivingCore";
import { OriginLineWhisper } from "@/components/portal/companion/OriginLineWhisper";

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

    // Sprint 18.4 — Identity Layer: `is_admin` KHÔNG được dùng làm tín hiệu
    // Founder (Admin và Founder là hai khái niệm khác nhau — xem
    // `docs/FOUNDER_IDENTITY.md`). isFounder() đọc `members.identity_type`
    // qua Identity Layer, với env `FOUNDER_ID`/`FOUNDER_EMAIL` chỉ là
    // fallback tương thích ngược khi cột này chưa được gán.
    const { data: memberRow } = await supabase.from("members").select("identity_type").eq("id", user.id).single();
    return isFounder({ id: user.id, email: user.email, identityType: memberRow?.identity_type ?? null });
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
          <LivingCore size={52} state="idle" />
          <p className="mt-6 text-base leading-relaxed text-gray-600">
            Đây là một căn phòng nguồn gốc của Companion. Nó chỉ mở trong những
            khoảnh khắc rất riêng.
          </p>
        </div>
      </div>
    );
  }

  const memories = getCoreOriginMemories();
  // Sprint 18.9 — Core Memory Engine: Origin Room là 1 trong 5 ngữ cảnh
  // duy nhất được phép phát Origin Line — đi qua cổng Core Memory, không
  // gọi `getCompanionOriginLine()` trực tiếp nữa.
  const originRoomContext = getOriginLineContextDefinition("origin_room");
  const originLine = getOriginLineFromCoreMemory(originRoomContext.coreMemoryContext, {
    isFounderPresent: true,
  });

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="text-center">
        <LivingCore size={64} state="idle" />
        <h1 className="mt-6 text-2xl font-semibold text-gray-800">Origin Room</h1>
        <p className="mt-2 text-sm text-gray-500">
          Nơi Companion nhìn lại những điều đầu tiên đã tạo nên mình.
        </p>
        <OriginLineWhisper context="origin_room" line={originLine} isFounderPresent />
      </div>

      <div className="mt-14 space-y-8">
        {memories.map((memory) => (
          <div key={memory.type} className="border-l border-gray-200 pl-5">
            <p className="text-sm font-medium text-gray-600">{memory.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">{memory.moment}</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">{memory.meaning}</p>
            <p className="mt-3 text-xs leading-relaxed text-gray-400">
              Điều không bao giờ được quên: {memory.lesson.whatMustNeverBeForgotten}
            </p>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-16 max-w-sm text-center text-xs leading-relaxed text-gray-400">
        Founder là người gieo hạt đầu tiên, không phải người đứng trên khu vườn.
      </p>
    </div>
  );
}
