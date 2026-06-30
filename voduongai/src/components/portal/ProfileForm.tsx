"use client";

import { useState } from "react";
import { updateProfile } from "@/app/portal/account/actions";

type ProfileMeta = {
  full_name?: string;
  phone?: string;
  birthday?: string;
  gender?: string;
  fb_url?: string;
  occupation?: string;
  bio?: string;
  goal?: string;
};

export function ProfileForm({ meta }: { meta: ProfileMeta }) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSubmit(formData: FormData) {
    setStatus("saving");
    const result = await updateProfile(formData);
    setStatus(result.error ? "error" : "saved");
  }

  return (
    <form action={handleSubmit} className="card-shine grid gap-3 rounded-2xl border border-gray-200 bg-white/[0.04] p-5 sm:grid-cols-2">
      <h2 className="col-span-full text-sm font-bold text-gray-900">Thông tin cá nhân</h2>

      <input name="full_name" defaultValue={meta.full_name} placeholder="Họ và tên" className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400" />
      <input name="phone" defaultValue={meta.phone} placeholder="Số điện thoại" className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400" />
      <input name="birthday" type="date" defaultValue={meta.birthday} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400" />
      <select name="gender" defaultValue={meta.gender ?? ""} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900">
        <option value="">Giới tính</option>
        <option value="male">Nam</option>
        <option value="female">Nữ</option>
        <option value="other">Khác</option>
      </select>
      <input name="fb_url" type="url" defaultValue={meta.fb_url} placeholder="Link Facebook" className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400" />
      <input name="occupation" defaultValue={meta.occupation} placeholder="Nghề nghiệp" className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400" />
      <textarea name="bio" defaultValue={meta.bio} placeholder="Giới thiệu ngắn về bạn..." rows={3} className="col-span-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400" />
      <input name="goal" defaultValue={meta.goal} placeholder="Mục tiêu khi học VO DUONG AI Academy" className="col-span-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400" />

      <div className="col-span-full flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-full gradient-surface px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {status === "saving" ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
        {status === "saved" && <span className="text-sm text-green-400">Đã lưu!</span>}
        {status === "error" && <span className="text-sm text-red-400">Có lỗi xảy ra, vui lòng thử lại.</span>}
      </div>
    </form>
  );
}
