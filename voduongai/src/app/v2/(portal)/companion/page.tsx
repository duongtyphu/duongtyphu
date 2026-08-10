import Link from "next/link";
import { Award, Bot, Check, Flame, Sparkles, Target } from "lucide-react";

import { V2_PORTAL_BASE } from "@/components/v2/nav/nav-config";
import { CompanionChat } from "@/components/v2/portal/CompanionChat";
import { Card, CardHead } from "@/components/v2/ui/Card";
import { ProgressBar } from "@/components/v2/ui/Display";
import { IcoBox } from "@/components/v2/ui/IcoBox";
import { getV2Session } from "@/lib/v2/auth";
import {
  getCompanionProfile,
  getCurrentGoal,
  listCompanionMessages,
  listCompanionRecos,
  listCompanionSuggestions,
} from "@/lib/v2/data/companion";

export const metadata = { title: "Companion AI" };

export default async function CompanionPage() {
  const [session, messages, suggestions, profile, goal, recos] = await Promise.all([
    getV2Session(),
    listCompanionMessages(),
    listCompanionSuggestions(),
    getCompanionProfile(),
    getCurrentGoal(),
    listCompanionRecos(),
  ]);

  return (
    <div className="flex items-start gap-[22px] px-7 py-6">
      <div className="flex min-w-0 flex-1 flex-col gap-[18px]">
        <div className="flex items-center justify-between gap-5">
          <div>
            <h1 className="flex items-center gap-[10px] text-[24px] font-extrabold">
              Companion AI
              <span className="rounded-[7px] bg-[var(--v2-violet-light)] px-[10px] py-[3px] text-[11.5px] font-bold text-[var(--v2-violet)]">
                AI Mentor của bạn
              </span>
            </h1>
            <p className="mt-[6px] text-[14px] text-[var(--v2-muted)]">
              Không chỉ trả lời, mà đồng hành cùng bạn trên hành trình học tập và phát triển.
            </p>
          </div>
          <IcoBox
            icon={Bot}
            size="xl"
            background="linear-gradient(145deg,#8b6bff,#5a37e6)"
            color="#fff"
            className="max-[900px]:hidden"
          />
        </div>

        <CompanionChat
          initialMessages={messages}
          suggestions={suggestions}
          userInitials={session?.initials ?? "VD"}
        />
      </div>

      <aside className="flex w-[320px] shrink-0 flex-col gap-[18px] max-[1100px]:hidden">
        <Card>
          <CardHead
            title="Hồ sơ của bạn"
            action={
              <Link href={`${V2_PORTAL_BASE}/hanh-trinh-cua-toi`} className="text-[12.5px] font-bold">
                Xem chi tiết
              </Link>
            }
          />
          <div className="flex items-center gap-4">
            <div
              className="flex h-[86px] w-[86px] shrink-0 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(var(--v2-violet) 0% 70%, var(--v2-violet-light) 70% 100%)`,
              }}
            >
              <div className="flex h-[70px] w-[70px] flex-col items-center justify-center rounded-full bg-[var(--v2-surface)]">
                <span className="text-[16px] font-extrabold">Lv.{profile.level}</span>
                <span className="text-[9.5px] text-[var(--v2-muted)]">{profile.levelName}</span>
              </div>
            </div>
            <div className="flex flex-col gap-[6px] text-[12.5px]">
              <span className="flex items-center gap-[6px]">
                <Sparkles className="h-[14px] w-[14px] text-[var(--v2-violet)]" aria-hidden="true" />
                <b>{profile.xp.toLocaleString("vi-VN")}</b> XP
              </span>
              <span className="flex items-center gap-[6px]">
                <Flame className="h-[14px] w-[14px] text-[#f97316]" aria-hidden="true" />
                <b>{profile.streakDays}</b> ngày liên tục
              </span>
              <span className="flex items-center gap-[6px]">
                <Award className="h-[14px] w-[14px] text-[var(--v2-gold)]" aria-hidden="true" />
                <b>{profile.badges}</b> huy hiệu
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHead
            title="Mục tiêu hiện tại"
            action={
              <Link href={`${V2_PORTAL_BASE}/chien-luoc-ca-nhan`} className="text-[12.5px] font-bold">
                Xem tất cả
              </Link>
            }
          />
          <div className="mb-3 flex items-start gap-[10px]">
            <IcoBox icon={Target} size="sm" />
            <div className="text-[13px] leading-[1.45] font-semibold">{goal.title}</div>
          </div>
          <ProgressBar value={goal.progress} label="Tiến độ mục tiêu" />
          <div className="mt-3 flex flex-col gap-2">
            {goal.steps.map((step) => (
              <div
                key={step.label}
                className={[
                  "flex items-center gap-2 text-[12.5px]",
                  step.done ? "text-[var(--v2-text)]" : "text-[var(--v2-muted)]",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border",
                    step.done
                      ? "border-[var(--v2-green)] bg-[var(--v2-green)] text-white"
                      : "border-[var(--v2-line)]",
                  ].join(" ")}
                >
                  {step.done ? <Check className="h-3 w-3" aria-hidden="true" /> : null}
                </span>
                {step.label}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHead title="Companion gợi ý cho bạn" />
          {recos.map((reco) => {
            const Icon = reco.icon;
            return (
              <div
                key={reco.id}
                className="flex items-center gap-[10px] border-b border-[var(--v2-line)] py-[10px] text-[12.5px] font-semibold last:border-b-0"
              >
                <Icon className="h-4 w-4 shrink-0 text-[var(--v2-violet)]" aria-hidden="true" />
                <span className="flex-1">{reco.label}</span>
                <span className="shrink-0 rounded-md bg-[var(--v2-violet-light)] px-2 py-[2px] text-[10.5px] font-bold text-[var(--v2-violet)]">
                  {reco.tag}
                </span>
              </div>
            );
          })}
          <Link
            href={`${V2_PORTAL_BASE}/he-tri-thuc`}
            className="mt-[10px] block text-center text-[12.5px] font-bold"
          >
            Xem thêm gợi ý →
          </Link>
        </Card>
      </aside>
    </div>
  );
}
