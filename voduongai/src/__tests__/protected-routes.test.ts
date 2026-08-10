import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import {
  ADMIN_LOGIN_PATH,
  PROTECTED_ROUTE_PREFIXES,
  isAdminRoute,
  isProtectedRoute,
} from "@/lib/protected-routes";

/**
 * Portal & Admin 2.0 (`/v2`) chạy song song với 1.0. Cả hai đều dựa vào
 * `middleware.ts` làm lớp chặn CHÍNH — `redirect()` trong layout Server
 * Component chỉ tạo redirect "mềm" (meta-refresh + payload RSC) sau khi phần
 * đầu trang đã stream, không đủ chặn nội dung tới trình duyệt chưa đăng nhập.
 *
 * Bộ test này khoá lại đúng phần logic đó: một prefix mới thêm vào
 * `PROTECTED_ROUTE_PREFIXES` mà quên khai trong `config.matcher` sẽ khiến
 * middleware không bao giờ chạy cho route đó — lỗi im lặng, không có triệu
 * chứng nào cho tới khi dữ liệu thật bị lộ.
 */
describe("isProtectedRoute", () => {
  it("chặn cả Portal 1.0 và Portal 2.0", () => {
    expect(isProtectedRoute("/portal")).toBe(true);
    expect(isProtectedRoute("/portal/hocvienai")).toBe(true);
    expect(isProtectedRoute("/v2")).toBe(true);
    expect(isProtectedRoute("/v2/trang-chu")).toBe(true);
    expect(isProtectedRoute("/v2/admin/dashboard")).toBe(true);
  });

  it("không chạm tới trang công khai", () => {
    expect(isProtectedRoute("/")).toBe(false);
    expect(isProtectedRoute("/login")).toBe(false);
    expect(isProtectedRoute("/blogai")).toBe(false);
  });
});

describe("isAdminRoute", () => {
  it("nhận cả hai khu vực quản trị", () => {
    expect(isAdminRoute("/admin")).toBe(true);
    expect(isAdminRoute("/admin/dashboard")).toBe(true);
    expect(isAdminRoute("/v2/admin")).toBe(true);
    expect(isAdminRoute("/v2/admin/nguoi-dung")).toBe(true);
  });

  it("loại trừ trang đăng nhập quản trị (nếu không sẽ lặp redirect vô hạn)", () => {
    expect(isAdminRoute(ADMIN_LOGIN_PATH)).toBe(false);
  });

  it("không nhận nhầm route Portal thường", () => {
    expect(isAdminRoute("/v2/trang-chu")).toBe(false);
    expect(isAdminRoute("/portal/account")).toBe(false);
    // Không được khớp theo tiền tố chuỗi thuần: "/v2/administrator" không
    // phải khu vực quản trị.
    expect(isAdminRoute("/v2/administrator")).toBe(false);
    expect(isAdminRoute("/administrivia")).toBe(false);
  });
});

describe("middleware matcher", () => {
  it("khai đủ mọi tiền tố trong PROTECTED_ROUTE_PREFIXES", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src", "middleware.ts"),
      "utf8",
    );
    const matcher = source.slice(source.indexOf("matcher:"));

    for (const prefix of PROTECTED_ROUTE_PREFIXES) {
      // `/onboarding` là route đơn, các prefix còn lại khai dạng `:path*`.
      const declared =
        matcher.includes(`"${prefix}/:path*"`) || matcher.includes(`"${prefix}"`);
      expect(declared, `middleware matcher thiếu tiền tố ${prefix}`).toBe(true);
    }
  });
});
