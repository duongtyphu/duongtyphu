"use client";

import Link from "next/link";
import { CheckCircle2, Circle, CircleDot } from "lucide-react";
import { GemCard } from "@/components/portal/ui/GemCard";
import type { TodayMission, MissionStatus } from "@/data/portal/gem-home";
import { useMissionStatus } from "@/lib/portal/missionStatus";
import { getSmallVictoryLine } from "@/lib/portal/small-victories";

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
  todo: "text-gray-400",
  "in-progress": "text-[#FBBF24]",
  done: "text-blue-600",
};

/**
 * Answers: "Người dùng có biết chính xác hôm nay nên làm gì và đã làm được bao nhiêu chưa?"
 */
export function TodayMissionCard({ missions }: { missions: TodayMission[] }) {
  const { ready, getStatus, cycleStatus, doneCount } = useMissionStatus(missions.map((m) => m.id));

  return (
    <GemCard>
      <div className="flex items-center justify-between">
        <h2 className="gemos-card-title text-sm font-bold text-gray-900">Hôm nay, vài điều nhỏ để đi tiếp</h2>
        <span className="text-xs font-semibold text-gray-500">
          {ready ? `${doneCount}/${missions.length} đã xong` : "…"}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-900/45">
        Không cần làm hết. Một điều thôi cũng đủ để hôm nay có ý nghĩa.
      </p>
      <ul className="mt-4 space-y-2.5">
        {missions.map((m) => {
          const status = getStatus(m.id);
          const Icon = STATUS_ICON[status];
          return (
            <li key={m.id} className="flex items-start gap-3 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-violet-50 p-3">
              <button
                type="button"
                onClick={() => cycleStatus(m.id)}
                className={`mt-0.5 shrink-0 transition ${STATUS_TONE[status]}`}
                aria-label={STATUS_LABEL[status]}
              >
                <Icon className="h-5 w-5" />
              </button>
              <div className="min-w-0 flex-1">
                <Link href={m.href} className="text-sm font-semibold text-gray-900 hover:text-blue-600">
                  {m.label}
                </Link>
                <p className="mt-0.5 text-xs text-gray-900/45">{m.description}</p>
              </div>
              <span className={`shrink-0 text-[10px] font-semibold ${STATUS_TONE[status]}`}>
                {STATUS_LABEL[status]}
              </span>
            </li>
          );
        })}
      </ul>
      {ready && doneCount > 0 && (
        <p className="mt-3 text-xs text-gray-500">{getSmallVictoryLine("didNotGiveUp", doneCount)}</p>
      )}
    </GemCard>
  );
}
