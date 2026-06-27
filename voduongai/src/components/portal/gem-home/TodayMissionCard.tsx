"use client";

import Link from "next/link";
import { CheckCircle2, Circle, CircleDot } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { TodayMission, MissionStatus } from "@/data/portal/gem-home";
import { useMissionStatus } from "@/lib/portal/missionStatus";

const STATUS_ICON: Record<MissionStatus, typeof Circle> = {
  todo: Circle,
  "in-progress": CircleDot,
  done: CheckCircle2,
};

const STATUS_LABEL: Record<MissionStatus, string> = {
  todo: "Chưa bắt đầu",
  "in-progress": "Đang thực hiện",
  done: "Đã xong",
};

const STATUS_TONE: Record<MissionStatus, string> = {
  todo: "text-white/40",
  "in-progress": "text-[#FBBF24]",
  done: "text-[#22D3EE]",
};

/**
 * Answers: "Người dùng có biết chính xác hôm nay nên làm gì và đã làm được bao nhiêu chưa?"
 */
export function TodayMissionCard({ missions }: { missions: TodayMission[] }) {
  const { ready, getStatus, cycleStatus, doneCount } = useMissionStatus(missions.map((m) => m.id));

  return (
    <GemCard>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white">Hôm nay, vài điều nhỏ để đi tiếp</h2>
        <span className="text-xs font-semibold text-white/50">
          {ready ? `${doneCount}/${missions.length} đã xong` : "…"}
        </span>
      </div>
      <p className="mt-1 text-xs text-white/45">
        Không cần làm hết. Một điều thôi cũng đủ để hôm nay có ý nghĩa.
      </p>
      <ul className="mt-4 space-y-2.5">
        {missions.map((m) => {
          const status = getStatus(m.id);
          const Icon = STATUS_ICON[status];
          return (
            <li key={m.id} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <button
                type="button"
                onClick={() => cycleStatus(m.id)}
                className={`mt-0.5 shrink-0 transition ${STATUS_TONE[status]}`}
                aria-label={STATUS_LABEL[status]}
              >
                <Icon className="h-5 w-5" />
              </button>
              <div className="min-w-0 flex-1">
                <Link href={m.href} className="text-sm font-semibold text-white hover:text-[#22D3EE]">
                  {m.label}
                </Link>
                <p className="mt-0.5 text-xs text-white/45">{m.description}</p>
              </div>
              <span className={`shrink-0 text-[10px] font-semibold ${STATUS_TONE[status]}`}>
                {STATUS_LABEL[status]}
              </span>
            </li>
          );
        })}
      </ul>
    </GemCard>
  );
}
