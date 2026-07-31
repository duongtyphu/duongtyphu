import { redirect } from "next/navigation";

/**
 * Chương trình Affiliate (bảng `referrals`) đã chuyển hẳn sang Workspace
 * "Affiliate" riêng (mục Referral) — tránh 2 nơi cùng sở hữu 1 nguồn dữ
 * liệu (Single Ownership). Giữ route cũ redirect để không tạo link chết
 * cho bất kỳ bookmark/tài liệu cũ nào còn trỏ tới đây.
 */
export default function TiepThiLienKetRedirect() {
  redirect("/admin/affiliate/referral");
}
