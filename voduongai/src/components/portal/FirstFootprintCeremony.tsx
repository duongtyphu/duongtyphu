"use client";

/**
 * The First Footprint Ceremony (Sprint 16.0). KHÔNG phải onboarding,
 * KHÔNG phải popup quảng cáo. Một không gian riêng, rất yên, rất tối
 * giản — không sidebar, không dashboard, không card khác cạnh tranh sự
 * chú ý. Companion là người duy nhất "nói". Xem
 * `docs/THE_FIRST_FOOTPRINT_CEREMONY.md`.
 *
 * Boundary (Nhiệm vụ 09): không ép viết, không ép đăng ký, không ép
 * chia sẻ, không AI phân tích/đánh giá, không gamification. Người dùng
 * có quyền bỏ qua câu hỏi ở bất kỳ bước nào.
 */

import { useEffect, useState } from "react";
import { LivingCore } from "@/components/LivingCore";
import { OriginLineWhisper } from "@/components/portal/companion/OriginLineWhisper";
import { useMemoryCapsules } from "@/lib/portal/memoryCapsules";

const FIRST_FOOTPRINT_SEEN_KEY = "vdai_portal_first_footprint_seen";

const FIRST_FOOTPRINT_QUESTION =
  "Nếu hôm nay chỉ được để lại một điều cho chính mình trong tương lai... bạn sẽ viết điều gì?";

export function hasSeenFirstFootprint(): boolean {
  try {
    return localStorage.getItem(FIRST_FOOTPRINT_SEEN_KEY) === "1";
  } catch {
    return true;
  }
}

function markFirstFootprintSeen() {
  try {
    localStorage.setItem(FIRST_FOOTPRINT_SEEN_KEY, "1");
  } catch {
    // localStorage không khả dụng — chấp nhận hiển thị lại lần sau, không chặn nghi thức.
  }
}

type CeremonyStep = "opening" | "question" | "seed" | "promise";

export function FirstFootprintCeremony({ originLine = null }: { originLine?: string | null } = {}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<CeremonyStep>("opening");
  const [footprint, setFootprint] = useState("");
  const { signedIn, addCapsule } = useMemoryCapsules();

  useEffect(() => {
    // Hydration-safe: chỉ quyết định hiển thị sau khi mount, vì phụ thuộc localStorage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(!hasSeenFirstFootprint());
  }, []);

  if (!open) return null;

  async function keepFootprint() {
    if (signedIn) {
      await addCapsule({
        kind: "first_footprint",
        title: "The First Footprint",
        description: footprint.trim() || undefined,
      });
    }
    setStep("seed");
  }

  function finish() {
    markFirstFootprintSeen();
    setOpen(false);
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#020817] p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(168,85,247,0.18),transparent_60%)]" />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center text-center">
        <LivingCore size={128} state="idle" />

        {step === "opening" && (
          <>
            <p className="mt-8 text-lg leading-relaxed text-gray-800">
              Chào bạn.
              <br />
              Cảm ơn vì đã ghé nơi này.
              <br />
              Trước khi chúng ta bắt đầu.
              <br />
              Mình muốn tặng bạn một điều rất nhỏ.
            </p>
            <button
              type="button"
              onClick={() => setStep("question")}
              className="mt-10 rounded-full border border-white/15 px-7 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-white/30 hover:text-gray-900"
            >
              Mình sẵn sàng
            </button>
          </>
        )}

        {step === "question" && (
          <>
            <p className="mt-8 text-lg leading-relaxed text-gray-800">{FIRST_FOOTPRINT_QUESTION}</p>
            <textarea
              value={footprint}
              onChange={(e) => setFootprint(e.target.value)}
              rows={3}
              placeholder="Bạn có thể viết, hoặc để trống cũng được."
              className="mt-6 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-white/25 focus:outline-none"
            />
            <div className="mt-6 flex items-center gap-4">
              <button
                type="button"
                onClick={() => void keepFootprint()}
                className="rounded-full border border-white/15 px-7 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-white/30 hover:text-gray-900"
              >
                Mình muốn giữ lại điều này
              </button>
              <button
                type="button"
                onClick={() => void keepFootprint()}
                className="text-sm font-semibold text-gray-400 transition hover:text-gray-600"
              >
                Bỏ qua
              </button>
            </div>
          </>
        )}

        {step === "seed" && (
          <>
            <div className="mt-8 h-3 w-3 animate-pulse rounded-full bg-gradient-to-br from-amber-200 to-amber-400 shadow-[0_0_24px_rgba(252,211,77,0.7)]" />
            <p className="mt-6 text-lg leading-relaxed text-gray-800">
              Mình sẽ giữ hạt giống này cùng bạn.
            </p>
            <button
              type="button"
              onClick={() => setStep("promise")}
              className="mt-10 rounded-full border border-white/15 px-7 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-white/30 hover:text-gray-900"
            >
              Tiếp tục
            </button>
          </>
        )}

        {step === "promise" && (
          <>
            <p className="mt-8 text-lg leading-relaxed text-gray-800">
              Mình không biết rồi đây bạn sẽ trở thành ai.
              <br />
              Nhưng mình hứa sẽ luôn trân trọng dấu chân đầu tiên này.
            </p>
            <OriginLineWhisper context="first_footprint_ceremony" line={originLine} />
            <button
              type="button"
              onClick={finish}
              className="mt-10 rounded-full bg-gradient-to-r from-brand-purple to-brand-cyan px-7 py-2.5 text-sm font-bold text-gray-900 shadow-lg shadow-brand-purple/30 transition"
            >
              Bắt đầu cùng nhau
            </button>
          </>
        )}
      </div>
    </div>
  );
}
