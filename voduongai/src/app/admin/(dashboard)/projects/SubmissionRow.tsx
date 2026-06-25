"use client";

import { useState } from "react";
import { gradeSubmission, type Submission } from "./actions";
import { useAdminToast } from "@/lib/admin/toast";

const statusLabel: Record<string, string> = {
  pending: "Đang chờ chấm",
  reviewed: "Đã chấm",
};

export function SubmissionRow({ submission }: { submission: Submission }) {
  const [feedback, setFeedback] = useState(submission.feedback ?? "");
  const [saving, setSaving] = useState(false);
  const { push } = useAdminToast();

  async function save(status: "pending" | "reviewed") {
    setSaving(true);
    const result = await gradeSubmission(submission.id, feedback, status);
    setSaving(false);
    if (result.error) {
      push(result.error);
      return;
    }
    push(status === "reviewed" ? "Đã chấm bài và gửi phản hồi." : "Đã lưu phản hồi.");
  }

  return (
    <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-white">{submission.title}</p>
          <p className="mt-0.5 text-xs text-white/40">
            {submission.member_email} — {new Date(submission.created_at).toLocaleDateString("vi-VN")}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            submission.status === "reviewed" ? "bg-green-500/10 text-green-400" : "bg-brand-orange/10 text-brand-orange"
          }`}
        >
          {statusLabel[submission.status] ?? submission.status}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-white/70">{submission.content}</p>

      {submission.link_url && (
        <a
          href={submission.link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs font-semibold text-brand-blue hover:underline"
        >
          Xem minh chứng →
        </a>
      )}

      <div className="mt-4">
        <label className="text-xs font-semibold uppercase tracking-wide text-white/40">Phản hồi cho học viên</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={3}
          className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
        />
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => save("reviewed")}
          disabled={saving}
          className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
        >
          Chấm xong & Gửi phản hồi
        </button>
        <button
          onClick={() => save("pending")}
          disabled={saving}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 disabled:opacity-50"
        >
          Lưu nháp
        </button>
      </div>
    </div>
  );
}
