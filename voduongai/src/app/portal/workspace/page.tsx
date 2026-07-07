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
        eyebrow="Workspace — Nơi việc thật sự xong"
        title="Ý tưởng chỉ có giá trị khi trở thành một thứ xong việc"
        subtitle="Không phải ghi chú để đọc lại sau. Ở đây, mỗi phiên làm việc kết thúc bằng một Output thật — một bản nháp, một kế hoạch, một sản phẩm — mà bạn có thể dùng ngay hoặc gửi đi, không phải một ý tưởng nằm im trong hộp lưu trữ."
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
