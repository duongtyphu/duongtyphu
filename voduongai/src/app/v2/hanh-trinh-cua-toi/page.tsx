import { getPremiumStatus } from "@/lib/v2/premium-access";
import { getJourneyOverview } from "@/lib/portal/live-journey-overview";
import { getLearningLogData } from "@/lib/portal/live-learning-log";
import { getLiveStoryChrome } from "@/lib/portal/live-story";
import { getLiveMirrorChrome, getLiveMirrorQuestions } from "@/lib/portal/live-mirror";
import { getLiveMapChrome } from "@/lib/portal/live-map";
import { getStoryData } from "@/app/portal/story/page";
import { getMirrorProps } from "@/app/portal/mirror/page";
import { getMapData } from "@/app/portal/hanhtrinhcuatoi/ban-do/page";

import { HanhTrinhCuaToiClient } from "./HanhTrinhCuaToiClient";

export const metadata = { title: "Hành trình của tôi | VO DUONG AI" };

/**
 * `/v2/hanh-trinh-cua-toi` — Bước F ban đầu, GIAI ĐOẠN 8 (mid-turn Founder
 * yêu cầu): gộp 3 trang `/v2/nhat-ky-hoc-tap` + `/v2/hanh-trinh-cua-toi` +
 * `/v2/khu-vuon-cua-ban` (2 route đầu/cuối đã xoá — xem CLAUDE.md) thành 1
 * trang duy nhất, tên trang giữ "Hành trình của tôi". Nội dung gốc của
 * trang này (progress card/lộ trình/chuỗi ngày/thành tựu/liên kết nhanh)
 * GIỮ NGUYÊN 100% — chỉ THÊM 1 khối 5-tab mới bên dưới `page-head`, mỗi
 * tab render lại đúng nội dung/dữ liệu thật của 1 trong 5 "cửa" đã chốt ở
 * `vdaiportal2.0.html` mục "Giai đoạn 8 — Hành trình của tôi":
 *
 *  1. Nhật ký học tập — port nguyên `NhatKyHocTapTab.tsx` (trước là route
 *     riêng), đọc `getLearningLogData()`.
 *  2. Khu vườn của bạn — port nguyên `KhuVuonCuaBanTab.tsx`, đọc lại
 *     `journey` (đã fetch sẵn cho nội dung gốc, dùng chung).
 *  3. My Story — render lại NGUYÊN `MyStoryBook.tsx` (dùng chung với
 *     `/portal/story` 1.0, `getStoryData()` export từ chính page đó +
 *     `getLiveStoryChrome()`), bọc `.htct-native` (xem `v2-tokens.css`).
 *  4. Mirror — render lại NGUYÊN `MirrorChamber.tsx` (dùng chung
 *     `/portal/mirror`, `getMirrorProps()` export từ chính page đó +
 *     `getLiveMirrorChrome()`/`getLiveMirrorQuestions()`).
 *  5. Bản đồ hành trình — render lại NGUYÊN `JourneyMapAtlas.tsx` (dùng
 *     chung `/portal/hanhtrinhcuatoi/ban-do`, `getMapData()` export từ
 *     chính page đó + `getLiveMapChrome()`).
 *
 * Cả 3 component "cửa" (My Story/Mirror/Bản đồ) đều nhận thêm prop
 * `backHref={null}`/href override trỏ `/v2/*` — đúng NGUYÊN TẮC BẤT BIẾN
 * (không link ngược `/portal/*`), xem docblock từng component.
 */
export default async function HanhTrinhCuaToiPage() {
  const [premium, journey, log, storyChrome, storyData, mirrorChrome, mirrorQuestions, mirrorProps, mapChrome, mapData] =
    await Promise.all([
      getPremiumStatus(),
      getJourneyOverview(),
      getLearningLogData(),
      getLiveStoryChrome(),
      getStoryData(),
      getLiveMirrorChrome(),
      getLiveMirrorQuestions(),
      getMirrorProps(),
      getLiveMapChrome(),
      getMapData(),
    ]);

  return (
    <HanhTrinhCuaToiClient
      premium={premium}
      journey={journey}
      log={log}
      story={{ ...storyData, seedChrome: storyChrome }}
      mirror={{ ...mirrorProps, seedChrome: mirrorChrome, seedQuestions: mirrorQuestions }}
      map={{ ...mapData, seedChrome: mapChrome }}
    />
  );
}
