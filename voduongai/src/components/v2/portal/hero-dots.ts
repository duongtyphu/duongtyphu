/**
 * 39 chấm sao trôi trong hero trang chủ.
 *
 * Toạ độ, kích thước, quãng đường và độ trễ lấy nguyên từ mockup
 * `Trang chu Portal.html` — KHÔNG sinh ngẫu nhiên lúc render, vì `Math.random()`
 * sẽ cho kết quả khác nhau giữa server và client và gây hydration mismatch.
 */
export type HeroDot = {
  top: number;
  left: number;
  size: number;
  dx: number;
  dy: number;
  duration: number;
  delay: number;
};

export const HERO_DOTS: HeroDot[] = [
  { top: 82.7, left: 78.9, size: 3.1, dx: 31, dy: 10, duration: 5.3, delay: 2.2 },
  { top: 7.9, left: 68.1, size: 2.8, dx: 34, dy: 45, duration: 5.1, delay: 1.3 },
  { top: 92.4, left: 86.0, size: 1.9, dx: 46, dy: -34, duration: 3.4, delay: 2.6 },
  { top: 42.8, left: 31.4, size: 2.4, dx: 6, dy: 26, duration: 5.0, delay: 0.2 },
  { top: 42.0, left: 71.0, size: 1.8, dx: -45, dy: 38, duration: 5.7, delay: 1.9 },
  { top: 19.8, left: 34.0, size: 2.8, dx: 67, dy: -31, duration: 3.9, delay: 0.1 },
  { top: 62.6, left: 90.7, size: 2.1, dx: -61, dy: -8, duration: 5.0, delay: 0.3 },
  { top: 73.4, left: 84.2, size: 2.2, dx: 62, dy: 11, duration: 4.5, delay: 0.6 },
  { top: 32.0, left: 52.3, size: 2.5, dx: 37, dy: 48, duration: 5.4, delay: 2.3 },
  { top: 44.7, left: 61.1, size: 2.1, dx: -43, dy: -1, duration: 4.9, delay: 2.3 },
  { top: 4.6, left: 5.7, size: 2.3, dx: 64, dy: -44, duration: 4.1, delay: 1.1 },
  { top: 31.4, left: 39.1, size: 2.4, dx: -56, dy: -3, duration: 4.7, delay: 0.8 },
  { top: 71.6, left: 28.6, size: 2.3, dx: 48, dy: 40, duration: 4.6, delay: 1.9 },
  { top: 8.1, left: 15.8, size: 2.1, dx: -51, dy: -35, duration: 4.4, delay: 3.0 },
  { top: 10.7, left: 80.4, size: 2.4, dx: 57, dy: 7, duration: 4.7, delay: 3.2 },
  { top: 45.8, left: 79.5, size: 2.5, dx: 61, dy: 5, duration: 3.8, delay: 2.6 },
  { top: 76.4, left: 12.6, size: 2.9, dx: -15, dy: 30, duration: 5.2, delay: 2.0 },
  { top: 52.2, left: 74.6, size: 2.3, dx: -56, dy: -31, duration: 4.9, delay: 1.4 },
  { top: 49.7, left: 17.9, size: 2.6, dx: -16, dy: -13, duration: 5.2, delay: 0.3 },
  { top: 21.9, left: 82.4, size: 3.0, dx: 21, dy: 41, duration: 3.1, delay: 1.8 },
  { top: 58.6, left: 13.7, size: 2.1, dx: 14, dy: -24, duration: 5.2, delay: 2.8 },
  { top: 76.0, left: 23.9, size: 2.5, dx: -54, dy: -23, duration: 5.6, delay: 2.5 },
  { top: 17.3, left: 29.1, size: 2.3, dx: 45, dy: -9, duration: 3.9, delay: 2.1 },
  { top: 22.2, left: 77.9, size: 3.1, dx: -26, dy: 18, duration: 5.4, delay: 3.3 },
  { top: 27.1, left: 89.8, size: 2.1, dx: -65, dy: -34, duration: 4.7, delay: 0.9 },
  { top: 55.0, left: 33.2, size: 2.3, dx: 46, dy: -29, duration: 4.3, delay: 2.4 },
  { top: 25.6, left: 71.4, size: 2.1, dx: -46, dy: -12, duration: 5.1, delay: 2.4 },
  { top: 75.4, left: 19.7, size: 2.7, dx: -61, dy: 47, duration: 5.4, delay: 3.1 },
  { top: 37.4, left: 86.6, size: 2.8, dx: 11, dy: -27, duration: 4.2, delay: 2.5 },
  { top: 61.3, left: 80.3, size: 2.1, dx: -59, dy: -22, duration: 4.2, delay: 3.8 },
  { top: 33.6, left: 87.7, size: 2.7, dx: -54, dy: 11, duration: 4.3, delay: 1.0 },
  { top: 47.2, left: 87.5, size: 2.1, dx: 69, dy: -11, duration: 3.2, delay: 2.0 },
  { top: 31.9, left: 2.9, size: 3.0, dx: 64, dy: -22, duration: 5.3, delay: 3.2 },
  { top: 74.0, left: 4.1, size: 2.0, dx: -54, dy: -50, duration: 4.2, delay: 2.0 },
  { top: 76.7, left: 28.2, size: 1.7, dx: 68, dy: 11, duration: 4.1, delay: 0.7 },
  { top: 19.7, left: 19.2, size: 3.1, dx: 30, dy: -20, duration: 5.3, delay: 0.3 },
  { top: 9.2, left: 43.0, size: 2.0, dx: 66, dy: -44, duration: 4.8, delay: 1.9 },
  { top: 28.5, left: 88.8, size: 3.0, dx: -3, dy: 29, duration: 3.7, delay: 2.1 },
  { top: 17.2, left: 27.5, size: 2.1, dx: -30, dy: -23, duration: 3.8, delay: 2.7 },];
