/**
 * Life Moments (Sprint 7.3 — Nhiệm vụ 03). Có những lúc Portal nên im lặng
 * và chỉ công nhận, không khuyên, không gợi ý bước tiếp theo, không gắn CTA.
 * Mỗi dòng ở đây phải đứng được một mình — không cần thêm gì sau nó.
 */

export type LifeMomentTrigger =
  | "stillHereAfterHardTime"
  | "quietReturn"
  | "afterSettingDownABurden"
  | "noticedWithoutBeingAsked";

export const lifeMomentLines: Record<LifeMomentTrigger, string[]> = {
  stillHereAfterHardTime: [
    "Cảm ơn vì hôm nay bạn vẫn ở đây.",
    "Mình không cần bạn phải nói gì cả. Chỉ cần biết bạn vẫn ở đây là đủ.",
    "Có những ngày chỉ cần có mặt cũng đã là một điều không dễ. Hôm nay bạn đã làm được điều đó.",
  ],
  quietReturn: [
    "Bạn đã quay lại. Vậy là đủ rồi, hôm nay không cần thêm gì nữa.",
    "Mình nhận ra bạn đã trở lại. Cảm ơn bạn.",
  ],
  afterSettingDownABurden: [
    "Cảm ơn vì bạn đã chia sẻ điều đó với mình.",
    "Mình đã nghe thấy điều bạn vừa nói. Không cần phải vội nói thêm gì cả.",
  ],
  noticedWithoutBeingAsked: [
    "Mình nhận thấy bạn đã cố gắng rất nhiều trong thời gian gần đây.",
    "Có một điều mình muốn bạn biết: mình vẫn đang ở đây, dõi theo hành trình của bạn một cách lặng lẽ.",
  ],
};

function pick<T>(items: T[], seed?: number): T {
  const index = seed === undefined ? Math.floor(Math.random() * items.length) : seed % items.length;
  return items[index];
}

export function getLifeMomentLine(trigger: LifeMomentTrigger, seed?: number): string {
  return pick(lifeMomentLines[trigger], seed);
}
