"use client";

import { useRef, useState } from "react";
import { submitSupportTicket } from "@/app/portal/support/actions";

export function SupportTicketForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(formData: FormData) {
    setStatus("sending");
    const result = await submitSupportTicket(formData);
    if (result.error) {
      setStatus("error");
      setErrorMsg(result.error);
      return;
    }
    setStatus("sent");
    formRef.current?.reset();
  }

  return (
    <form ref={formRef} action={handleSubmit} className="card-shine space-y-3 rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
      <h2 className="text-sm font-bold text-gray-900">Gửi yêu cầu hỗ trợ mới</h2>
      <input
        name="subject"
        placeholder="Tiêu đề"
        required
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
      />
      <textarea
        name="message"
        placeholder="Mô tả vấn đề của bạn..."
        required
        rows={4}
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full gradient-surface px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {status === "sending" ? "Đang gửi..." : "Gửi yêu cầu"}
        </button>
        {status === "sent" && <span className="text-sm text-green-400">Đã gửi! Chúng tôi sẽ phản hồi sớm.</span>}
        {status === "error" && <span className="text-sm text-red-400">{errorMsg}</span>}
      </div>
    </form>
  );
}
