"use client";

import { useState } from "react";
import { Check, Download, Sparkles } from "lucide-react";
import type { AssetWithRuntimeStatus } from "@/companion/unlock/unlock-engine";
import { assetToPlainText, fileNameForAsset } from "@/companion/unlock/asset-text";
import { AssetContentView } from "./AssetContentView";

const TYPE_LABEL: Record<AssetWithRuntimeStatus["type"], string> = {
  prompt_pack: "Prompt Pack",
  checklist: "Checklist",
  template: "Template",
};

function downloadAsFile(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Trạng thái `available`/`unlocked`/`completed` — Companion message + nội
 * dung thật + Copy/Save/Use. `available` chỉ hiện lời Companion + nút "Xem"
 * (chuyển sang `unlocked`, mở nội dung đầy đủ) — giữ đúng nhịp "Companion
 * đưa trước, người dùng chủ động mở ra", không tự động phơi bày hết.
 */
export function AssetUnlockedCard({
  asset,
  onView,
  onUse,
}: {
  asset: AssetWithRuntimeStatus;
  onView: () => void;
  onUse: () => void;
}) {
  const [saved, setSaved] = useState(false);

  if (asset.runtimeStatus === "available") {
    return (
      <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5">
        <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-blue-700">
          <Sparkles className="h-3.5 w-3.5" />
          {asset.companionMessage}
        </p>
        <p className="mb-3 text-sm font-bold text-gray-900">{asset.title}</p>
        <button
          type="button"
          onClick={onView}
          className="rounded-full gradient-surface px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
        >
          Xem
        </button>
      </div>
    );
  }

  const isCompleted = asset.runtimeStatus === "completed";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{TYPE_LABEL[asset.type]}</p>
          <h3 className="text-sm font-bold text-gray-900">{asset.title}</h3>
          <p className="mt-0.5 text-xs text-gray-500">{asset.description}</p>
        </div>
        {isCompleted && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
            <Check className="h-3 w-3" />
            Đã dùng
          </span>
        )}
      </div>

      <AssetContentView asset={asset} />

      <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
        <button
          type="button"
          onClick={() => {
            downloadAsFile(fileNameForAsset(asset), assetToPlainText(asset));
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-blue-300 hover:text-blue-600"
        >
          <Download className="h-3.5 w-3.5" />
          {saved ? "Đã lưu" : "Lưu"}
        </button>
        {!isCompleted && (
          <button
            type="button"
            onClick={onUse}
            className="rounded-full gradient-surface px-4 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
          >
            Dùng ngay
          </button>
        )}
      </div>
    </div>
  );
}
