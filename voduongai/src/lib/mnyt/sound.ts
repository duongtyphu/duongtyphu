/**
 * Âm thanh khi hoàn thành bước — mockup gốc `playTone()` (dòng ~1805-1816):
 * Web Audio API thuần (`AudioContext`/`OscillatorNode`+`GainNode`, sóng
 * sine, envelope `exponentialRampToValueAtTime` xuống gần 0), gọi
 * `playTone(520, 0.1)` đúng lúc chuyển bước tiến (`nextStep()`, dòng 2576)
 * — README mục "Sound": "a short tone on step advance (520Hz, 0.1s). Must
 * be mutable." `soundOn` (prefs, `MnytShellClient.tsx`) đã có công tắc bật/
 * tắt thật từ trước — hàm này chỉ còn thiếu phần THỰC SỰ PHÁT ÂM, nay đã
 * nối vào `MnytDetailClient.tsx`.
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
