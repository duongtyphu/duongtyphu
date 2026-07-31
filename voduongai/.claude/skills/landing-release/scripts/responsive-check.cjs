// Script mẫu audit responsive cho Landing Page VO DUONG AI.
// Copy sang scratchpad, chỉnh BASE_URL / RUNS / STOPS cho đúng phạm vi
// đợt audit cụ thể (route nào, section nào cần chụp), rồi chạy:
//   node responsive-check.cjs
//
// Yêu cầu: server đang chạy ở BASE_URL (npm run dev, hoặc npm run build
// + next start nếu muốn test đúng bundle production).
// Chromium dùng bản đã cài sẵn trong môi trường — KHÔNG chạy
// `playwright install`.

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:3000/";
const OUT_DIR = process.env.RESPONSIVE_CHECK_OUT || "./responsive-check-out";
const CHROMIUM_PATH = "/opt/pw-browsers/chromium";

// Mỗi entry = 1 tổ hợp breakpoint x theme cần audit.
const RUNS = [
  { label: "mobile-light", width: 375, height: 900, theme: "light" },
  { label: "mobile-dark", width: 375, height: 900, theme: "dark" },
  { label: "tablet-light", width: 768, height: 1024, theme: "light" },
  { label: "tablet-dark", width: 768, height: 1024, theme: "dark" },
  { label: "desktop-light", width: 1440, height: 900, theme: "light" },
  { label: "desktop-dark", width: 1440, height: 900, theme: "dark" },
];

// Mỗi entry = 1 điểm dừng để chụp ảnh trong lúc cuộn trang.
// selector: cuộn tới phần tử này (scrollIntoViewIfNeeded); dùng "top"/"bottom"
// để cuộn về đầu/cuối trang thay vì tới 1 phần tử cụ thể.
const STOPS = [
  { name: "hero", selector: "top" },
  { name: "ecosystem-pillars", selector: "#he-sinh-thai" },
  { name: "tools", selector: "#cong-cu-toi-dung" },
  { name: "quiz", selector: "#danh-gia-nang-luc-ai" },
  { name: "footer", selector: "bottom" },
];

async function scrollTo(page, selector) {
  if (selector === "top") {
    await page.evaluate(() => window.scrollTo(0, 0));
  } else if (selector === "bottom") {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  } else {
    await page.locator(selector).scrollIntoViewIfNeeded();
  }
  await page.waitForTimeout(400);
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROMIUM_PATH });
  const summary = [];

  for (const run of RUNS) {
    const context = await browser.newContext({
      viewport: { width: run.width, height: run.height },
    });
    await context.addCookies([
      { name: "vdai-landing-theme", value: run.theme, domain: "localhost", path: "/" },
    ]);
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", (e) => pageErrors.push(e.message));

    await page.goto(BASE_URL, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(800);

    for (const stop of STOPS) {
      await scrollTo(page, stop.selector);
      const file = path.join(OUT_DIR, `${run.label}__${stop.name}.png`);
      await page.screenshot({ path: file });
    }

    summary.push({ run: run.label, pageErrors: pageErrors.length, errors: pageErrors.slice(0, 3) });
    await context.close();
  }

  await browser.close();

  console.log(JSON.stringify(summary, null, 2));
  console.log(`\nẢnh đã lưu tại: ${OUT_DIR}`);
})();
