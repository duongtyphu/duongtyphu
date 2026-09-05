/**
 * Dữ liệu icon (Lucide) cho banner Canvas 35 thẻ chủ đề "Mỗi ngày một ý tưởng".
 *
 * Trích trực tiếp từ `__iconNode` nội bộ của lucide-react (mỗi icon là mảng
 * [tag, attrs] — path/circle/rect/line trên lưới 24×24, stroke 2px) — KHÔNG
 * dùng component React của lucide-react (không render được lên <canvas>).
 * Copy tĩnh tại thời điểm build (lucide-react ^1.21.0) — nếu nâng cấp phiên
 * bản, cần đối chiếu lại các icon này còn đúng shape không.
 */

export type MnytBannerIconShape = { tag: string; attrs: Record<string, string | number> };

export const MNYT_BANNER_ICONS: Record<string, MnytBannerIconShape[]> = {
  "coffee": [
    { tag: "path", attrs: { "d": "M10 2v2" } },
    { tag: "path", attrs: { "d": "M14 2v2" } },
    { tag: "path", attrs: { "d": "M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" } },
    { tag: "path", attrs: { "d": "M6 2v2" } },
  ],
  "megaphone": [
    { tag: "path", attrs: { "d": "M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" } },
    { tag: "path", attrs: { "d": "M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" } },
    { tag: "path", attrs: { "d": "M8 6v8" } },
  ],
  "clipboard-check": [
    { tag: "rect", attrs: { "width": "8", "height": "4", "x": "8", "y": "2", "rx": "1", "ry": "1" } },
    { tag: "path", attrs: { "d": "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" } },
    { tag: "path", attrs: { "d": "m9 14 2 2 4-4" } },
  ],
  "trending-up": [
    { tag: "path", attrs: { "d": "M16 7h6v6" } },
    { tag: "path", attrs: { "d": "m22 7-8.5 8.5-5-5L2 17" } },
  ],
  "graduation-cap": [
    { tag: "path", attrs: { "d": "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" } },
    { tag: "path", attrs: { "d": "M22 10v6" } },
    { tag: "path", attrs: { "d": "M6 12.5V16a6 3 0 0 0 12 0v-3.5" } },
  ],
  "heart-pulse": [
    { tag: "path", attrs: { "d": "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" } },
    { tag: "path", attrs: { "d": "M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" } },
  ],
  "pen-tool": [
    { tag: "path", attrs: { "d": "M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z" } },
    { tag: "path", attrs: { "d": "m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18" } },
    { tag: "path", attrs: { "d": "m2.3 2.3 7.286 7.286" } },
    { tag: "circle", attrs: { "cx": "11", "cy": "11", "r": "2" } },
  ],
  "cog": [
    { tag: "path", attrs: { "d": "M11 10.27 7 3.34" } },
    { tag: "path", attrs: { "d": "m11 13.73-4 6.93" } },
    { tag: "path", attrs: { "d": "M12 22v-2" } },
    { tag: "path", attrs: { "d": "M12 2v2" } },
    { tag: "path", attrs: { "d": "M14 12h8" } },
    { tag: "path", attrs: { "d": "m17 20.66-1-1.73" } },
    { tag: "path", attrs: { "d": "m17 3.34-1 1.73" } },
    { tag: "path", attrs: { "d": "M2 12h2" } },
    { tag: "path", attrs: { "d": "m20.66 17-1.73-1" } },
    { tag: "path", attrs: { "d": "m20.66 7-1.73 1" } },
    { tag: "path", attrs: { "d": "m3.34 17 1.73-1" } },
    { tag: "path", attrs: { "d": "m3.34 7 1.73 1" } },
    { tag: "circle", attrs: { "cx": "12", "cy": "12", "r": "2" } },
    { tag: "circle", attrs: { "cx": "12", "cy": "12", "r": "8" } },
  ],
  "palette": [
    { tag: "path", attrs: { "d": "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" } },
    { tag: "circle", attrs: { "cx": "13.5", "cy": "6.5", "r": ".5", "fill": "currentColor" } },
    { tag: "circle", attrs: { "cx": "17.5", "cy": "10.5", "r": ".5", "fill": "currentColor" } },
    { tag: "circle", attrs: { "cx": "6.5", "cy": "12.5", "r": ".5", "fill": "currentColor" } },
    { tag: "circle", attrs: { "cx": "8.5", "cy": "7.5", "r": ".5", "fill": "currentColor" } },
  ],
  "shopping-cart": [
    { tag: "circle", attrs: { "cx": "8", "cy": "21", "r": "1" } },
    { tag: "circle", attrs: { "cx": "19", "cy": "21", "r": "1" } },
    { tag: "path", attrs: { "d": "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" } },
  ],
  "users": [
    { tag: "path", attrs: { "d": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" } },
    { tag: "path", attrs: { "d": "M16 3.128a4 4 0 0 1 0 7.744" } },
    { tag: "path", attrs: { "d": "M22 21v-2a4 4 0 0 0-3-3.87" } },
    { tag: "circle", attrs: { "cx": "9", "cy": "7", "r": "4" } },
  ],
  "scale": [
    { tag: "path", attrs: { "d": "M12 3v18" } },
    { tag: "path", attrs: { "d": "m19 8 3 8a5 5 0 0 1-6 0zV7" } },
    { tag: "path", attrs: { "d": "M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1" } },
    { tag: "path", attrs: { "d": "m5 8 3 8a5 5 0 0 1-6 0zV7" } },
    { tag: "path", attrs: { "d": "M7 21h10" } },
  ],
  "house": [
    { tag: "path", attrs: { "d": "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" } },
    { tag: "path", attrs: { "d": "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" } },
  ],
  "plane": [
    { tag: "path", attrs: { "d": "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" } },
  ],
  "stethoscope": [
    { tag: "path", attrs: { "d": "M11 2v2" } },
    { tag: "path", attrs: { "d": "M5 2v2" } },
    { tag: "path", attrs: { "d": "M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" } },
    { tag: "path", attrs: { "d": "M8 15a6 6 0 0 0 12 0v-3" } },
    { tag: "circle", attrs: { "cx": "20", "cy": "10", "r": "2" } },
  ],
  "sprout": [
    { tag: "path", attrs: { "d": "M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3" } },
    { tag: "path", attrs: { "d": "M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4" } },
    { tag: "path", attrs: { "d": "M5 21h14" } },
  ],
  "microscope": [
    { tag: "path", attrs: { "d": "M6 18h8" } },
    { tag: "path", attrs: { "d": "M3 22h18" } },
    { tag: "path", attrs: { "d": "M14 22a7 7 0 1 0 0-14h-1" } },
    { tag: "path", attrs: { "d": "M9 14h2" } },
    { tag: "path", attrs: { "d": "M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" } },
    { tag: "path", attrs: { "d": "M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" } },
  ],
  "shopping-bag": [
    { tag: "path", attrs: { "d": "M16 10a4 4 0 0 1-8 0" } },
    { tag: "path", attrs: { "d": "M3.103 6.034h17.794" } },
    { tag: "path", attrs: { "d": "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" } },
  ],
  "languages": [
    { tag: "path", attrs: { "d": "m5 8 6 6" } },
    { tag: "path", attrs: { "d": "m4 14 6-6 2-3" } },
    { tag: "path", attrs: { "d": "M2 5h12" } },
    { tag: "path", attrs: { "d": "M7 2h1" } },
    { tag: "path", attrs: { "d": "m22 22-5-10-5 10" } },
    { tag: "path", attrs: { "d": "M14 18h6" } },
  ],
  "lightbulb": [
    { tag: "path", attrs: { "d": "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" } },
    { tag: "path", attrs: { "d": "M9 18h6" } },
    { tag: "path", attrs: { "d": "M10 22h4" } },
  ],
  "music": [
    { tag: "path", attrs: { "d": "M9 18V5l12-2v13" } },
    { tag: "circle", attrs: { "cx": "6", "cy": "18", "r": "3" } },
    { tag: "circle", attrs: { "cx": "18", "cy": "16", "r": "3" } },
  ],
  "dumbbell": [
    { tag: "path", attrs: { "d": "M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z" } },
    { tag: "path", attrs: { "d": "m2.5 21.5 1.4-1.4" } },
    { tag: "path", attrs: { "d": "m20.1 3.9 1.4-1.4" } },
    { tag: "path", attrs: { "d": "M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z" } },
    { tag: "path", attrs: { "d": "m9.6 14.4 4.8-4.8" } },
  ],
  "factory": [
    { tag: "path", attrs: { "d": "M12 16h.01" } },
    { tag: "path", attrs: { "d": "M16 16h.01" } },
    { tag: "path", attrs: { "d": "M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" } },
    { tag: "path", attrs: { "d": "M8 16h.01" } },
  ],
  "truck": [
    { tag: "path", attrs: { "d": "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" } },
    { tag: "path", attrs: { "d": "M15 18H9" } },
    { tag: "path", attrs: { "d": "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" } },
    { tag: "circle", attrs: { "cx": "17", "cy": "18", "r": "2" } },
    { tag: "circle", attrs: { "cx": "7", "cy": "18", "r": "2" } },
  ],
  "shield-check": [
    { tag: "path", attrs: { "d": "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" } },
    { tag: "path", attrs: { "d": "m9 12 2 2 4-4" } },
  ],
  "landmark": [
    { tag: "path", attrs: { "d": "M10 18v-7" } },
    { tag: "path", attrs: { "d": "M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" } },
    { tag: "path", attrs: { "d": "M14 18v-7" } },
    { tag: "path", attrs: { "d": "M18 18v-7" } },
    { tag: "path", attrs: { "d": "M3 22h18" } },
    { tag: "path", attrs: { "d": "M6 18v-7" } },
  ],
  "hard-hat": [
    { tag: "path", attrs: { "d": "M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" } },
    { tag: "path", attrs: { "d": "M14 6a6 6 0 0 1 6 6v3" } },
    { tag: "path", attrs: { "d": "M4 15v-3a6 6 0 0 1 6-6" } },
    { tag: "rect", attrs: { "x": "2", "y": "15", "width": "20", "height": "4", "rx": "1" } },
  ],
  "leaf": [
    { tag: "path", attrs: { "d": "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" } },
    { tag: "path", attrs: { "d": "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" } },
  ],
  "gamepad-2": [
    { tag: "line", attrs: { "x1": "6", "x2": "10", "y1": "11", "y2": "11" } },
    { tag: "line", attrs: { "x1": "8", "x2": "8", "y1": "9", "y2": "13" } },
    { tag: "line", attrs: { "x1": "15", "x2": "15.01", "y1": "12", "y2": "12" } },
    { tag: "line", attrs: { "x1": "18", "x2": "18.01", "y1": "10", "y2": "10" } },
    { tag: "path", attrs: { "d": "M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" } },
  ],
  "sparkles": [
    { tag: "path", attrs: { "d": "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" } },
    { tag: "path", attrs: { "d": "M20 2v4" } },
    { tag: "path", attrs: { "d": "M22 4h-4" } },
    { tag: "circle", attrs: { "cx": "4", "cy": "20", "r": "2" } },
  ],
  "party-popper": [
    { tag: "path", attrs: { "d": "M5.8 11.3 2 22l10.7-3.79" } },
    { tag: "path", attrs: { "d": "M4 3h.01" } },
    { tag: "path", attrs: { "d": "M22 8h.01" } },
    { tag: "path", attrs: { "d": "M15 2h.01" } },
    { tag: "path", attrs: { "d": "M22 20h.01" } },
    { tag: "path", attrs: { "d": "m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" } },
    { tag: "path", attrs: { "d": "m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17" } },
    { tag: "path", attrs: { "d": "m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7" } },
    { tag: "path", attrs: { "d": "M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z" } },
  ],
  "heart-handshake": [
    { tag: "path", attrs: { "d": "M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762" } },
  ],
  "building-2": [
    { tag: "path", attrs: { "d": "M10 12h4" } },
    { tag: "path", attrs: { "d": "M10 8h4" } },
    { tag: "path", attrs: { "d": "M14 21v-3a2 2 0 0 0-4 0v3" } },
    { tag: "path", attrs: { "d": "M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" } },
    { tag: "path", attrs: { "d": "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" } },
  ],
  "briefcase": [
    { tag: "path", attrs: { "d": "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" } },
    { tag: "rect", attrs: { "width": "20", "height": "14", "x": "2", "y": "6", "rx": "2" } },
  ],
  "baby": [
    { tag: "path", attrs: { "d": "M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" } },
    { tag: "path", attrs: { "d": "M15 12h.01" } },
    { tag: "path", attrs: { "d": "M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" } },
    { tag: "path", attrs: { "d": "M9 12h.01" } },
  ],
};

/** Ánh xạ category.key (mnyt_categories) -> tên icon trong MNYT_BANNER_ICONS. */
export const MNYT_CATEGORY_ICON: Record<string, string> = {
  "cafe": "coffee",
  "marketing": "megaphone",
  "productivity": "clipboard-check",
  "finance": "trending-up",
  "education": "graduation-cap",
  "lifestyle": "heart-pulse",
  "content": "pen-tool",
  "automation": "cog",
  "design": "palette",
  "sales": "shopping-cart",
  "hr": "users",
  "legal": "scale",
  "realestate": "house",
  "travel": "plane",
  "health": "stethoscope",
  "agriculture": "sprout",
  "research": "microscope",
  "ecommerce": "shopping-bag",
  "language": "languages",
  "softskills": "lightbulb",
  "arts": "music",
  "fitness": "dumbbell",
  "manufacturing": "factory",
  "logistics": "truck",
  "insurance": "shield-check",
  "banking": "landmark",
  "construction": "hard-hat",
  "environment": "leaf",
  "gaming": "gamepad-2",
  "beauty": "sparkles",
  "events": "party-popper",
  "nonprofit": "heart-handshake",
  "govtech": "building-2",
  "freelance": "briefcase",
  "parenting": "baby"
};
