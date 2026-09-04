"use client";

/**
 * Context chia sẻ `prefs.soundOn` (đã quản lý ở `MnytShellClient.tsx`,
 * đọc/ghi qua `updateMnytPrefs()`) xuống MỌI route con (`children` của
 * shell) — cần thiết vì âm thanh khi hoàn thành bước (README mục "Sound")
 * phát ra ở `MnytDetailClient.tsx` (route `/y-tuong/[id]`, KHÔNG phải
 * component con trực tiếp của shell mà là `children` qua Next.js layout),
 * không có cách nào đọc `soundOn` nếu không qua Context.
 */

import { createContext, useContext } from "react";

const MnytSoundContext = createContext(true);

export function MnytSoundProvider({ soundOn, children }: { soundOn: boolean; children: React.ReactNode }) {
  return <MnytSoundContext.Provider value={soundOn}>{children}</MnytSoundContext.Provider>;
}

export function useMnytSoundOn(): boolean {
  return useContext(MnytSoundContext);
}
