"use client";

import { useRef, useState } from "react";
import { submitPracticeWork } from "@/app/portal/practice/actions";

export function PracticeSubmissionForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(formData: FormData) {
    setStatus("sending");
    const result = await submitPracticeWork(formData);
    if (result.error) {
      setStatus("error");
      setErrorMsg(result.error);
      return;
    }
    setStatus("sent");
    formRef.current?.reset();
  }

  return (
    <form ref={formRef} action={handleSubmit} className="card-shine space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h2 className="text-sm font-bold text-white">Nộp bài thực hành mới</h2>
      <input
        name="title"
        placeholder="Tiêu đề bài nộp"
        required
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
      />
      <textarea
        name="content"
        placeholder="Mô tả những gì bạn đã làm..."
        required
        rows={4}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
      />
      <input
        name="link_url"
        placeholder="Link minh chứng (nếu có)"
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full gradient-surface px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {status === "sending" ? "Đang nộp..." : "Nộp bài"}
        </button>
        {status === "sent" && <span className="text-sm text-green-400">Đã nộp! Chờ admin chấm bài.</span>}
        {status === "error" && <span className="text-sm text-red-400">{errorMsg}</span>}
      </div>
    </form>
  );
}
