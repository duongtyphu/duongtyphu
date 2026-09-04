/**
 * Âm thanh trong bài học — mockup gốc `playTone()` (dòng ~1805-1816): Web
 * Audio API thuần (`AudioContext`/`OscillatorNode`+`GainNode`, sóng sine,
 * envelope `exponentialRampToValueAtTime` xuống gần 0). README mục
 * "Sound": "a short tone on step advance (520Hz, 0.1s). Must be mutable."
 * `soundOn` (prefs, `MnytShellClient.tsx`) đã có công tắc bật/tắt thật từ
 * trước — module này cấp phần THỰC SỰ PHÁT ÂM cho cả 4 lần mockup gốc gọi
 * `playTone()` trong luồng bài học `MnytDetailClient.tsx`: chuyển bước
 * tiến (520/0.1, dòng 2576), chọn đáp án quiz chính đúng/sai (740/0.16
 * hoặc 220/0.12, dòng 2583), hoàn thành bài học (660/0.18 + 880/0.22, dòng
 * 2633).
 *
 * 1 `AudioContext` module-level, tái dùng giữa các lần gọi (đúng mockup
 * gốc dùng `this._audioCtx` cache trên instance) — tránh giới hạn số
 * context đồng thời của trình duyệt nếu người dùng chuyển bước nhanh.
 */

let sharedCtx: AudioContext | null = null;

export function playMnytTone(freq: number, durationSec: number, soundOn: boolean): void {
  if (!soundOn || typeof window === "undefined") return;
  try {
    const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    const ctx = sharedCtx ?? (sharedCtx = new AudioCtor());
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationSec);
  } catch {
    // Web Audio có thể bị chặn (chính sách autoplay/quyền trình duyệt) —
    // im lặng bỏ qua, đúng try/catch rỗng của mockup gốc.
  }
}

/** Đúng tần số/thời lượng README chỉ định cho "chuyển bước tiến". */
export function playMnytStepAdvanceTone(soundOn: boolean): void {
  playMnytTone(520, 0.1, soundOn);
}

/**
 * Phản hồi chọn đáp án ở bước Trắc nghiệm CHÍNH (mockup `selectQuiz()`,
 * dòng 2583) — CHỈ áp dụng cho quiz chính của bước "Kiểm tra" (không áp
 * dụng cho quiz Áp dụng/Kịch bản — mockup gốc (`selectApply`/
 * `selectScenario`, dòng 2549-2550) không gọi `playTone` cho 2 quiz đó).
 */
export function playMnytQuizFeedbackTone(correct: boolean, soundOn: boolean): void {
  if (correct) playMnytTone(740, 0.16, soundOn);
  else playMnytTone(220, 0.12, soundOn);
}

/** Hoàn thành bài học (mockup `completeLesson()`, dòng 2633) — 2 âm liên tiếp. */
export function playMnytCompleteTone(soundOn: boolean): void {
  playMnytTone(660, 0.18, soundOn);
  playMnytTone(880, 0.22, soundOn);
}
