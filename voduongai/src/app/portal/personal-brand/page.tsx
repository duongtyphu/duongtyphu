import { redirect } from "next/navigation";

/**
 * Academy Reset — Product Decision: gỡ bỏ danh sách bài học demo cũ. Route
 * giữ nguyên, chuyển hướng vào Academy Operating System mới tại /portal/academy.
 */
export default function PersonalBrandPage() {
  redirect("/portal/academy");
}
