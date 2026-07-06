import { Lock } from "lucide-react";
import type { UnlockableAsset } from "@/companion/unlock/unlock.types";

const TYPE_LABEL: Record<UnlockableAsset["type"], string> = {
  prompt_pack: "Prompt Pack",
  checklist: "Checklist",
  template: "Template",
};

/**
 * Trạng thái `locked` — blur nhẹ + icon khóa + teaser (bật mí 1 chi tiết
 * thật, xem DISCOVERY_STANDARD.md mục "Teaser nội dung file") + điều kiện
 * mở khóa bằng lời, không phải thanh tiến trình %.
 */
export function AssetLockedCard({ asset }: { asset: UnlockableAsset }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 backdrop-blur-[2px]" />
      <div className="relative">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {TYPE_LABEL[asset.type]}
            </p>
            <h3 className="text-sm font-bold text-gray-700">{asset.title}</h3>
          </div>
        </div>
        <p className="text-xs italic leading-relaxed text-gray-500">&ldquo;{asset.lockedPreview}&rdquo;</p>
        <p className="mt-3 text-[11px] text-gray-400">
          Mở sau khi bạn hoàn thành Nhiệm vụ và viết Chiêm nghiệm.
        </p>
      </div>
    </div>
  );
}
