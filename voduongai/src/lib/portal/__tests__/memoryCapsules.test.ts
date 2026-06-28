import { describe, it, expect, vi, beforeEach } from "vitest";

const deleteMock = vi.fn();
const eqMock = vi.fn();
const fromMock = vi.fn();
const getUserMock = vi.fn();

vi.mock("@/lib/supabase-browser", () => ({
  getSupabaseBrowser: () => ({
    auth: { getUser: getUserMock },
    from: fromMock,
  }),
}));

import { deleteMemoryCapsule } from "@/lib/portal/memoryCapsules";

beforeEach(() => {
  vi.clearAllMocks();
  // from("memory_capsules").delete().eq("id", id).eq("member_id", uid) -> { error }
  eqMock.mockReturnValue({ eq: eqMock });
  deleteMock.mockReturnValue({ eq: eqMock });
  fromMock.mockReturnValue({ delete: deleteMock });
});

describe("deleteMemoryCapsule", () => {
  it("xoá capsule khi đã đăng nhập, lọc theo member_id của chính người dùng", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "user-a" } } });
    eqMock.mockReturnValueOnce({ eq: eqMock }).mockReturnValueOnce({ error: null });

    const ok = await deleteMemoryCapsule("capsule-1");

    expect(ok).toBe(true);
    expect(fromMock).toHaveBeenCalledWith("memory_capsules");
    expect(eqMock).toHaveBeenCalledWith("id", "capsule-1");
    expect(eqMock).toHaveBeenCalledWith("member_id", "user-a");
  });

  it("không gọi delete và trả về false nếu chưa đăng nhập", async () => {
    getUserMock.mockResolvedValue({ data: { user: null } });

    const ok = await deleteMemoryCapsule("capsule-1");

    expect(ok).toBe(false);
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it("trả về false khi Supabase báo lỗi (ví dụ capsule không thuộc member này)", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "user-a" } } });
    eqMock.mockReturnValueOnce({ eq: eqMock }).mockReturnValueOnce({ error: { message: "not found" } });

    const ok = await deleteMemoryCapsule("capsule-of-user-b");

    expect(ok).toBe(false);
  });
});
