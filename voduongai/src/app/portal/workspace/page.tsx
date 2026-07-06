import { Suspense } from "react";
import { Rocket } from "lucide-react";
import { WorkspaceMvp } from "@/components/portal/ai-space/WorkspaceMvp";
import { PillarHero } from "@/components/portal/ui/PillarHero";

export const metadata = { title: "Workspace — VO DUONG AI" };

/**
 * EPIC 02 — Sprint 01: `/portal/workspace` MVP. Nhận context từ mọi hành
 * động "Thực hành cùng Companion" ở /portal/aiworkspace qua
 * `startCompanionWorkspace()`. Chưa gọi AI thật — chỉ hiển thị lại context
 * + kế hoạch bước đầu tĩnh, mục tiêu sprint là kiến trúc luồng.
 *
 * Portal 3.0 Wave 3 — Execution Experience: Workspace không phải "nơi lưu",
 * mà là nơi hành động — hero đóng khung ngay từ đầu trang, trước khi vào
 * session/context thật bên dưới (WorkspaceMvp giữ nguyên logic, chỉ thêm
 * khung mở đầu).
 */
export default function WorkspacePage() {
  return (
    <div className="space-y-8">
      <PillarHero
        icon={Rocket}
        tone="opportunity"
        eyebrow="Workspace · Execution-first"
        title="Bạn đang làm việc, không phải lưu trữ"
        subtitle="Đây là nơi một ý tưởng trở thành kết quả cụ thể — Companion cùng bạn đi qua từng bước, bạn viết/tạo ra Output thật, không phải chỉ ghi chú lại rồi bỏ đó."
        quickActions={[
          { label: "Bắt đầu từ CKOS", href: "/portal/ckos" },
          { label: "Bắt đầu từ Academy", href: "/portal/hocvienai" },
        ]}
      />
      <Suspense fallback={null}>
        <WorkspaceMvp />
      </Suspense>
    </div>
  );
}
