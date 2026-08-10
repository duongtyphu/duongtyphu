import { redirect } from "next/navigation";

import { V2_PORTAL_BASE } from "@/components/v2/nav/nav-config";

/**
 * `/v2` không phải một màn hình trong bộ thiết kế — trang chủ Portal nằm ở
 * `/v2/trang-chu`. Chuyển hướng để truy cập thẳng `/v2` không rơi vào 404.
 */
export default function V2IndexPage() {
  redirect(`${V2_PORTAL_BASE}/trang-chu`);
}
