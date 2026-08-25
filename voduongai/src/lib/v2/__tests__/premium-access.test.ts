import { describe, it, expect, vi, beforeEach } from "vitest";

const getUserMock = vi.fn();
const membersMaybeSingleMock = vi.fn();
const ordersMaybeSingleMock = vi.fn();
const fromMock = vi.fn();

vi.mock("@/lib/supabase-server", () => ({
  getSupabaseServer: vi.fn(async () => ({
    auth: { getUser: getUserMock },
    from: fromMock,
  })),
  getCachedAuthUser: vi.fn(async () => (await getUserMock()).data.user),
}));

import { getPremiumStatus } from "@/lib/v2/premium-access";

beforeEach(() => {
  vi.clearAllMocks();
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

  fromMock.mockImplementation((table: string) => {
    if (table === "members") {
      return {
        select: () => ({
          eq: () => ({
            maybeSingle: membersMaybeSingleMock,
          }),
        }),
      };
    }
    if (table === "orders") {
      return {
        select: () => ({
          eq: () => ({
            eq: () => ({
              limit: () => ({
                maybeSingle: ordersMaybeSingleMock,
              }),
            }),
          }),
        }),
      };
    }
    throw new Error(`Bảng không mong đợi trong test: ${table}`);
  });
});

describe("getPremiumStatus — MỤC 1: mua đứt bất kỳ 1 trong 5 chương trình cũng mở Premium", () => {
  it("Premium khi premium_expires_at còn hạn — bất kể có đơn hàng hay không (không chạm bảng orders)", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "user-a", email: "a@test.com" } } });
    const future = new Date(Date.now() + 86_400_000).toISOString();
    membersMaybeSingleMock.mockResolvedValue({ data: { premium_expires_at: future } });

    const status = await getPremiumStatus();

    expect(status).toEqual({ isPremium: true, signedIn: true, email: "a@test.com", fullName: null });
    expect(ordersMaybeSingleMock).not.toHaveBeenCalled();
  });

  it("Premium qua fallback khi premium_expires_at NULL nhưng có đơn `confirmed` bất kỳ (không lọc theo sản phẩm)", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "user-b", email: "b@test.com" } } });
    membersMaybeSingleMock.mockResolvedValue({ data: { premium_expires_at: null } });
    ordersMaybeSingleMock.mockResolvedValue({ data: { id: 123 } });

    const status = await getPremiumStatus();

    expect(status).toEqual({ isPremium: true, signedIn: true, email: "b@test.com", fullName: null });
  });

  it("Free khi premium_expires_at NULL và không có đơn `confirmed` nào", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "user-c", email: "c@test.com" } } });
    membersMaybeSingleMock.mockResolvedValue({ data: { premium_expires_at: null } });
    ordersMaybeSingleMock.mockResolvedValue({ data: null });

    const status = await getPremiumStatus();

    expect(status).toEqual({ isPremium: false, signedIn: true, email: "c@test.com", fullName: null });
  });

  it("Free khi premium_expires_at đã qua hạn và không có đơn `confirmed` nào (vẫn thử fallback, không tự Premium)", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "user-d", email: "d@test.com" } } });
    const past = new Date(Date.now() - 86_400_000).toISOString();
    membersMaybeSingleMock.mockResolvedValue({ data: { premium_expires_at: past } });
    ordersMaybeSingleMock.mockResolvedValue({ data: null });

    const status = await getPremiumStatus();

    expect(status).toEqual({ isPremium: false, signedIn: true, email: "d@test.com", fullName: null });
  });

  it("FREE_STATUS khi chưa đăng nhập — không gọi tới bảng members/orders", async () => {
    getUserMock.mockResolvedValue({ data: { user: null } });

    const status = await getPremiumStatus();

    expect(status).toEqual({ isPremium: false, signedIn: false, email: null, fullName: null });
    expect(fromMock).not.toHaveBeenCalled();
  });
});
