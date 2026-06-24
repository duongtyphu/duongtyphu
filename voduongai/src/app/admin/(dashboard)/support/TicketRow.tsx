"use client";

import { useState } from "react";
import { replyTicket, type Ticket } from "./actions";
import { useAdminToast } from "@/lib/admin/toast";

const statusLabel: Record<string, string> = {
  open: "Đang chờ",
  replied: "Đã phản hồi",
  closed: "Đã đóng",
};

export function TicketRow({ ticket }: { ticket: Ticket }) {
  const [reply, setReply] = useState(ticket.reply ?? "");
  const [saving, setSaving] = useState(false);
  const { push } = useAdminToast();

  async function save(status: "open" | "replied" | "closed") {
    setSaving(true);
    const result = await replyTicket(ticket.id, reply, status);
    setSaving(false);
    if (result.error) {
      push(result.error);
      return;
    }
    push(status === "closed" ? "Đã đóng ticket." : "Đã gửi phản hồi.");
  }

  return (
    <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-white">{ticket.subject}</p>
          <p className="mt-0.5 text-xs text-white/40">
            {ticket.member_email} — {new Date(ticket.created_at).toLocaleDateString("vi-VN")}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            ticket.status === "closed"
              ? "bg-white/5 text-white/40"
              : ticket.status === "replied"
                ? "bg-green-500/10 text-green-400"
                : "bg-brand-orange/10 text-brand-orange"
          }`}
        >
          {statusLabel[ticket.status] ?? ticket.status}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-white/70">{ticket.message}</p>

      <div className="mt-4">
        <label className="text-xs font-semibold uppercase tracking-wide text-white/40">Phản hồi</label>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={3}
          className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
        />
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => save("replied")}
          disabled={saving}
          className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
        >
          Gửi phản hồi
        </button>
        <button
          onClick={() => save("closed")}
          disabled={saving}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 disabled:opacity-50"
        >
          Đóng ticket
        </button>
      </div>
    </div>
  );
}
