import type { LucideIcon } from "lucide-react";
import { GradientTitle } from "./GradientTitle";

const TONE_GRADIENT: Record<string, string> = {
  blue: "from-blue-50 via-white to-white border-blue-100",
  violet: "from-violet-50 via-white to-white border-violet-100",
  orange: "from-orange-50 via-white to-white border-orange-100",
  green: "from-green-50 via-white to-white border-green-100",
};

const TONE_ICON_BG: Record<string, string> = {
  blue: "bg-blue-500/15 text-blue-600",
  violet: "bg-violet-500/15 text-violet-600",
  orange: "bg-orange-500/15 text-orange-600",
  green: "bg-green-500/15 text-green-600",
};

/**
 * Tiêu đề trang/module — hỗ trợ 2 kiểu dùng:
 * 1. Đơn giản (title/description/action) — dùng ở các trang phụ.
 * 2. Nổi bật (icon + tone + subtitle) — dùng cho trang module chính
 *    (IA & Route Localization Refactor v1.0, mục IX): icon lớn trong
 *    khối gradient nhẹ theo tông màu, subtitle mô tả chức năng rõ ràng.
 */
export function PageHeader({
  title,
  description,
  subtitle,
  action,
  icon: Icon,
  tone = "blue",
  titleGradient = false,
}: {
  title: string;
  description?: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: LucideIcon;
  tone?: "blue" | "violet" | "orange" | "green";
  /** Phối màu chữ tiêu đề theo phong cách Companion (gradient + "AI" tô
      cam riêng) — dùng cho các trang module chính. */
  titleGradient?: boolean;
}) {
  const titleNode = titleGradient ? <GradientTitle text={title} /> : title;

  if (!Icon) {
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{titleNode}</h1>
          {description && <p className="mt-2 text-sm text-gray-500 sm:text-base">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-6 md:p-8 ${TONE_GRADIENT[tone]}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${TONE_ICON_BG[tone]}`}>
            <Icon className="h-6 w-6" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 md:text-3xl">{titleNode}</h1>
            {subtitle && <p className="mt-1.5 max-w-xl text-sm font-semibold text-gray-700 md:text-base">{subtitle}</p>}
            {description && <p className="mt-2 max-w-xl text-sm text-gray-500">{description}</p>}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
