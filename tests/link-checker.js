#!/usr/bin/env node
/**
 * VDAI Academy — Automated link checker
 *
 * Quét toàn bộ file .html trong repo và kiểm tra các nhóm liên kết:
 *   1. Menu (nav + mobile drawer)
 *   2. Footer
 *   3. CTA (button hành động trong nội dung chính)
 *   4. Logo (nav-logo / footer-brand-logo)
 *   5. Bài viết liên quan (.article-related — trang blog)
 *   6. Zalo / Facebook (mạng xã hội)
 *   7. Chính sách (privacy / terms / refund-policy)
 *   8. Đăng ký và đăng nhập (register.html / login.html)
 *   9. Liên kết ngoài (domain khác site, không phải Zalo/Facebook)
 *  10. Anchor trong cùng trang (#id)
 *
 * Cách chạy: node tests/link-checker.js
 * Output: in báo cáo ra console + exit code != 0 nếu có lỗi.
 */

const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const https = require("https");
const http = require("http");

const ROOT = path.resolve(__dirname, "..");
const SITE_DOMAIN = "v-academy-mauve.vercel.app";
const SKIP_DIRS = new Set(["node_modules", ".git", ".claude", "supabase", "google-apps-script", "docs"]);
// Trang thuộc khu vực học viên đã đăng nhập — logo được phép trỏ về portal.html (dashboard) thay vì index.html
const APP_PAGES = new Set(["profile.html"]);

// ──────────────────────────────────────────────────────────
// 1. Thu thập danh sách file HTML
// ──────────────────────────────────────────────────────────
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), out);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

const htmlFiles = walk(ROOT);

// ──────────────────────────────────────────────────────────
// 2. Phân loại 1 thẻ <a> theo ngữ cảnh + đích đến
// ──────────────────────────────────────────────────────────
function classifyLink($, el, href) {
  const $el = $(el);
  const inNav = $el.closest("nav, .nav-menu, .mobile-drawer, .nav-actions").length > 0;
  const inFooter = $el.closest("footer").length > 0;
  const isLogo = $el.hasClass("nav-logo") || $el.hasClass("footer-brand-logo");
  const inRelated = $el.closest(".article-related").length > 0;
  const isCta = !inNav && !inFooter && (
    $el.hasClass("btn") || $el.attr("data-track") || $el.hasClass("blog-card-cta")
  );

  if (isLogo) return "logo";
  if (inRelated) return "related_articles";
  if (/zalo\.me|facebook\.com/i.test(href)) return "social";
  if (/\/?(privacy|terms|refund-policy)\.html/i.test(href)) return "policy";
  if (/\/?(login|register)\.html/i.test(href)) return "auth";
  if (href.startsWith("#")) return "anchor";
  if (inNav) return "menu";
  if (inFooter) return "footer";
  if (isCta) return "cta";
  if (/^https?:\/\//i.test(href) && !href.includes(SITE_DOMAIN)) return "external";
  return "other";
}

// ──────────────────────────────────────────────────────────
// 3. Trích xuất tất cả link kèm phân loại, từ mọi file HTML
// ──────────────────────────────────────────────────────────
const allLinks = []; // { file, href, category, text }
const anchorIdsByFile = new Map(); // file -> Set(ids)

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf-8");
  const $ = cheerio.load(html);

  const ids = new Set();
  $("[id]").each((_, el) => ids.add($(el).attr("id")));
  anchorIdsByFile.set(file, ids);

  $("a[href]").each((_, el) => {
    const href = ($(el).attr("href") || "").trim();
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return;
    const category = classifyLink($, el, href);
    allLinks.push({ file, href, category, text: $(el).text().trim().slice(0, 60) });
  });

  // Mạng xã hội (Facebook/TikTok/YouTube/LinkedIn/Zalo) và zaloLink liên hệ
  // được VDAI_CONFIG render bằng JS lúc runtime (không nằm sẵn trong <a href>
  // tĩnh) — trích trực tiếp từ object "social: {...}" và "zaloLink:" trong
  // các <script>/config.js để vẫn kiểm thử được các liên kết này.
  const socialBlockMatch = html.match(/social:\s*\{([^}]*)\}/);
  if (socialBlockMatch) {
    const re = /(\w+):\s*["']([^"']*)["']/g;
    let m;
    while ((m = re.exec(socialBlockMatch[1]))) {
      const [, key, url] = m;
      if (url && url.startsWith("http")) {
        allLinks.push({
          file,
          href: url,
          category: /facebook|zalo/i.test(key) ? "social" : "external",
          text: `[VDAI_CONFIG.social.${key}]`,
        });
      }
    }
  }
  const zaloLinkMatch = html.match(/zaloLink:\s*["'](https?:\/\/[^"']+)["']/);
  if (zaloLinkMatch) {
    allLinks.push({ file, href: zaloLinkMatch[1], category: "social", text: "[VDAI_CONFIG.contact.zaloLink]" });
  }
}

// ──────────────────────────────────────────────────────────
// 4. Kiểm tra link nội bộ (file tồn tại + anchor tồn tại)
// ──────────────────────────────────────────────────────────
function resolveInternalPath(fromFile, href) {
  const [pathPart] = href.split("#");
  if (!pathPart) return path.dirname(fromFile); // pure anchor, same file
  if (pathPart.startsWith("/")) return path.join(ROOT, pathPart);
  return path.resolve(path.dirname(fromFile), pathPart);
}

function checkInternalLink(link) {
  const { file, href } = link;
  const [pathPart, anchorPart] = href.split("#");

  let targetFile = file;
  if (pathPart) {
    targetFile = resolveInternalPath(file, href);
    if (!fs.existsSync(targetFile)) {
      return { ok: false, reason: `File không tồn tại: ${path.relative(ROOT, targetFile)}` };
    }
  }

  if (anchorPart) {
    const ids = anchorIdsByFile.get(targetFile);
    if (!ids) {
      return { ok: false, reason: `Không đọc được id của file đích: ${path.relative(ROOT, targetFile)}` };
    }
    if (!ids.has(anchorPart)) {
      return { ok: false, reason: `Không tìm thấy id="${anchorPart}" trong ${path.relative(ROOT, targetFile)}` };
    }
  }

  return { ok: true };
}

// ──────────────────────────────────────────────────────────
// 5. Kiểm tra link ngoài (HTTP request thật)
// ──────────────────────────────────────────────────────────
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

function requestOnce(url, method) {
  return new Promise((resolve) => {
    const lib = url.startsWith("https:") ? https : http;
    const req = lib.request(
      url,
      { method, timeout: 8000, headers: { "User-Agent": BROWSER_UA } },
      (res) => {
        resolve({ statusCode: res.statusCode });
        res.resume();
      }
    );
    req.on("timeout", () => { req.destroy(); resolve({ error: "Timeout" }); });
    req.on("error", (err) => resolve({ error: err.message }));
    req.end();
  });
}

// Một số trang (TikTok, Facebook...) chặn HEAD nhưng vẫn trả 200 cho GET
// (chống bot bằng cách khác) -> thử HEAD trước, nếu lỗi 4xx thì thử lại bằng GET.
async function checkExternalLink(url) {
  const head = await requestOnce(url, "HEAD");
  if (head.error) return { ok: false, reason: head.error };
  if (head.statusCode < 400) return { ok: true };

  const get = await requestOnce(url, "GET");
  if (get.error) return { ok: false, reason: get.error };
  if (get.statusCode < 400) return { ok: true };
  return { ok: false, reason: `HTTP ${get.statusCode} (HEAD: ${head.statusCode})` };
}

// ──────────────────────────────────────────────────────────
// 6. Chạy kiểm thử theo từng nhóm
// ──────────────────────────────────────────────────────────
const CATEGORY_LABELS = {
  menu: "1. Liên kết menu",
  footer: "2. Footer",
  cta: "3. CTA",
  logo: "4. Logo",
  related_articles: "5. Bài viết liên quan",
  social: "6. Zalo/Facebook",
  policy: "7. Chính sách",
  auth: "8. Đăng ký và đăng nhập",
  external: "9. Liên kết ngoài",
  anchor: "10. Anchor trong cùng trang",
  other: "Khác (không thuộc 10 nhóm trên)",
};

async function run() {
  const results = {}; // category -> { total, failed: [] }
  for (const key of Object.keys(CATEGORY_LABELS)) results[key] = { total: 0, failed: [] };

  // Cache để không gọi HTTP nhiều lần cho cùng 1 URL
  const externalCache = new Map();

  for (const link of allLinks) {
    const bucket = results[link.category];
    bucket.total++;

    const isExternalHttp = /^https?:\/\//i.test(link.href) && !link.href.includes(SITE_DOMAIN);

    if (isExternalHttp) {
      if (!externalCache.has(link.href)) {
        externalCache.set(link.href, checkExternalLink(link.href));
      }
      const res = await externalCache.get(link.href);
      if (!res.ok) {
        bucket.failed.push({ ...link, reason: res.reason });
      }
    } else {
      // Logo phải trỏ về "trang chủ" của khu vực hiện tại:
      // - Trang marketing công khai → index.html
      // - Trang trong khu vực học viên đã đăng nhập (profile.html...) → portal.html (dashboard) được phép
      if (link.category === "logo") {
        const isIndexLink = /(^|\/)index\.html$/.test(link.href) || link.href === "/";
        const isPortalLink = /(^|\/)portal\.html$/.test(link.href);
        const isAppPage = APP_PAGES.has(path.basename(link.file));
        const ok = isIndexLink || (isAppPage && isPortalLink);
        if (!ok) {
          bucket.failed.push({ ...link, reason: `Logo không trỏ về trang chủ hợp lệ (index.html, hoặc portal.html nếu là trang trong khu vực học viên): "${link.href}"` });
          continue;
        }
      }

      const res = checkInternalLink(link);
      if (!res.ok) bucket.failed.push({ ...link, reason: res.reason });
    }
  }

  return results;
}

run().then((results) => {
  let hasFailure = false;
  console.log("════════════════════════════════════════════════════════");
  console.log(" VDAI ACADEMY — BÁO CÁO KIỂM THỬ LIÊN KẾT TỰ ĐỘNG");
  console.log("════════════════════════════════════════════════════════");
  console.log(`Tổng số file HTML quét: ${htmlFiles.length}`);
  console.log(`Tổng số link tìm thấy: ${allLinks.length}\n`);

  for (const [key, label] of Object.entries(CATEGORY_LABELS)) {
    const { total, failed } = results[key];
    const status = failed.length === 0 ? "✅ PASS" : "❌ FAIL";
    console.log(`${status}  ${label} — ${total} link, ${failed.length} lỗi`);
    if (failed.length > 0) {
      hasFailure = true;
      for (const f of failed) {
        console.log(`    - [${path.relative(ROOT, f.file)}] href="${f.href}" (text: "${f.text}")`);
        console.log(`      → ${f.reason}`);
      }
    }
  }

  console.log("\n════════════════════════════════════════════════════════");
  if (hasFailure) {
    console.log("KẾT QUẢ: CÓ LỖI — xem chi tiết phía trên.");
    process.exit(1);
  } else {
    console.log("KẾT QUẢ: TẤT CẢ LIÊN KẾT HỢP LỆ.");
    process.exit(0);
  }
});
