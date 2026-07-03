"use client";

import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { LearningStatusIcon } from "./LearningStatusIcon";
import type { SeedWithStatus } from "../services/knowledge-collection.service";

/** Feature 01 — Learning Path: Seed 01 → Seed 02 → ... → Collection Complete. */
export function LearningPath({ seedsWithStatus }: { seedsWithStatus: SeedWithStatus[] }) {
  const allCompleted = seedsWithStatus.length > 0 && seedsWithStatus.every((s) => s.status === "completed");

  return (
    <div className="space-y-0">
      {seedsWithStatus.map(({ seed, status }, i) => (
        <div key={seed.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <LearningStatusIcon status={status} className="text-lg" />
            {i < seedsWithStatus.length - 1 && <div className="my-1 h-8 w-px bg-gray-200" />}
          </div>
          <Link
            href={`/portal/library/${seed.slug}`}
            className="mb-3 -mt-0.5 min-w-0 flex-1 rounded-lg px-2 py-1 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 hover:text-blue-600"
          >
            {seed.title}
          </Link>
        </div>
      ))}

      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
              allCompleted ? "bg-emerald-500 text-white" : "border border-dashed border-gray-300 text-gray-300"
            }`}
          >
            <PartyPopper className="h-3.5 w-3.5" />
          </span>
        </div>
        <p className={`text-sm font-bold ${allCompleted ? "text-emerald-600" : "text-gray-400"}`}>
          Collection Complete
        </p>
      </div>
    </div>
  );
}
