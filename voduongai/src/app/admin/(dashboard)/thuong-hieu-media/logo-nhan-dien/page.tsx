import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { LogoSnippets } from "./LogoSnippets";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = { title: "Logo & Nhận diện · Admin" };

/**
 * ADM-V2-04 — "Logo & Nhận diện" (Thương hiệu & Media). Logo là quy ước
 * BẮT BUỘC ghi trong CLAUDE.md (mọi trang mới phải dùng đúng SVG này) —
 * KHÔNG cho sửa tự do qua UI generic (đây là chuẩn nhận diện cố định,
 * không phải nội dung tuỳ biến). Trang này CHỈ ĐỌC: xem trước + sao chép
 * đúng mã HTML/SVG chuẩn (copy verbatim từ CLAUDE.md, không tự chỉnh),
 * đỡ Founder/dev phải tra tay file CLAUDE.md khi tạo trang mới — đúng
 * phạm vi thật của nav item ("Xem trước.../Xuất mã SVG chuẩn").
 * Màu thương hiệu (primary/secondary/accent) đã quản qua "Header & Footer"
 * (Website) — không lặp lại ở đây.
 */
export default async function LogoNhanDienPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="max-w-3xl space-y-6">
      <AdminBreadcrumb trail={[{ label: "Thương hiệu & Media", href: "/admin/thuong-hieu-media/tai-lieu" }, { label: "Logo & Nhận diện" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Logo & Nhận diện</h1>
        <p className="mt-1 text-sm text-gray-500">
          Logo SVG chuẩn — quy ước bắt buộc cho mọi trang mới (ghi trong CLAUDE.md). CHỈ ĐỌC — logo là
          chuẩn nhận diện cố định, không sửa qua UI. Màu thương hiệu quản ở{" "}
          <Link href="/admin/website/header-footer" className="font-semibold text-brand-blue hover:underline">
            Header & Footer
          </Link>
          .
        </p>
      </div>

      <LogoSnippets />

      <Link
        href="/admin/website/header-footer"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:underline"
      >
        Sửa màu thương hiệu (primary/secondary/accent) <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
