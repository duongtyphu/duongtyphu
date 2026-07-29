"use client";

import { useState, useTransition } from "react";
import { completeOnboarding } from "@/app/onboarding/actions";
import { INTEREST_OPTIONS, type InterestId } from "@/lib/portal/identity-onboarding";

const inputClass =
  "w-full rounded-[10.8px] border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#7C5CFC]";

export function OnboardingIdentityForm({
  next,
  initialFullName,
}: {
  next: string;
  initialFullName: string;
}) {
  const [fullName, setFullName] = useState(initialFullName);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [occupation, setOccupation] = useState("");
  const [aiGoal, setAiGoal] = useState("");
  const [interests, setInterests] = useState<InterestId[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggleInterest(id: InterestId) {
    setInterests((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await completeOnboarding(formData);
      // completeOnboarding chỉ trả về khi có lỗi — thành công thì redirect()
      // đã điều hướng đi trước khi tới được đây.
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="mt-8 space-y-4" noValidate>
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="full_name" className="mb-1.5 block text-xs font-semibold text-white/50">
          Họ và tên
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nguyễn Văn A"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="avatar_url" className="mb-1.5 block text-xs font-semibold text-white/50">
          Ảnh đại diện (không bắt buộc)
        </label>
        <input
          id="avatar_url"
          name="avatar_url"
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="Dán URL ảnh đã host sẵn"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="occupation" className="mb-1.5 block text-xs font-semibold text-white/50">
          Nghề nghiệp
        </label>
        <input
          id="occupation"
          name="occupation"
          type="text"
          required
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
          placeholder="Ví dụ: Nhân viên Marketing, Freelancer..."
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="ai_goal" className="mb-1.5 block text-xs font-semibold text-white/50">
          Mục tiêu học AI của bạn
        </label>
        <textarea
          id="ai_goal"
          name="ai_goal"
          required
          rows={3}
          value={aiGoal}
          onChange={(e) => setAiGoal(e.target.value)}
          placeholder="Ví dụ: Ứng dụng AI để tăng năng suất công việc hàng ngày"
          className={inputClass}
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-xs font-semibold text-white/50">
          Bạn muốn dùng AI cho việc gì? (chọn ít nhất 1)
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {INTEREST_OPTIONS.map((opt) => {
            const checked = interests.includes(opt.id);
            return (
              <label
                key={opt.id}
                className={`cursor-pointer rounded-[10.8px] border p-3 text-center text-xs font-semibold transition ${
                  checked
                    ? "border-[#7C5CFC] bg-[#7C5CFC]/15 text-white"
                    : "border-white/15 text-white/60 hover:border-[#7C5CFC]/50"
                }`}
              >
                <input
                  type="checkbox"
                  name="interests"
                  value={opt.id}
                  checked={checked}
                  onChange={() => toggleInterest(opt.id)}
                  className="sr-only"
                />
                {opt.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={isPending}
        className="card-shine w-full rounded-[10.8px] bg-gradient-to-br from-[#8B6BF2] to-[#5B21D6] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(91,33,214,.35)] transition disabled:opacity-60"
      >
        {isPending ? "Đang lưu..." : "Bắt đầu vào Học viện"}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </form>
  );
}
