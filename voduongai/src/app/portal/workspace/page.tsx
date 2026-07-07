import { Suspense } from "react";
import { Rocket } from "lucide-react";
import { WorkspaceMvp } from "@/components/portal/ai-space/WorkspaceMvp";
import { PillarHero } from "@/components/portal/ui/PillarHero";
import { GemCard } from "@/components/portal/ui/GemCard";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";

const OPERATING_STEPS = [
  { step: "1. Mang theo một mục tiêu cụ thể", detail: "Không phải \"tôi muốn học AI\" — mà \"tôi cần viết một email từ chối khách hàng lịch sự\"." },
  { step: "2. Chọn đúng bối cảnh", detail: "Bắt đầu từ CKOS/Academy nếu cần tra cứu trước, hoặc bắt đầu thẳng ở đây nếu đã rõ việc cần làm." },
  { step: "3. Làm ra một bản nháp", detail: "Đừng chờ hoàn hảo — Output đầu tiên luôn là bản nháp để chỉnh sửa, không phải bản cuối." },
  { step: "4. Dừng lại ở một kết quả dùng được", detail: "Một phiên kết thúc khi bạn có thứ để dùng ngay hoặc gửi đi — không phải khi bạn thấy \"đủ rồi\"." },
];

const WORKSPACE_TEMPLATES = [
  { title: "Nháp nội dung", use: "Viết email, bài đăng, kịch bản — khi bạn có ý nhưng chưa có câu chữ." },
  { title: "Tóm tắt & phân tích", use: "Rút gọn tài liệu dài hoặc phân tích một tình huống trước khi quyết định." },
  { title: "Lập kế hoạch bước", use: "Chia một việc lớn thành các bước nhỏ có thể làm ngay hôm nay." },
];

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
      {/* Portal 4.0 Content Creation — Workspace trước đây chỉ có khung
       * session, chưa giải thích một phiên làm việc thật nên vận hành ra
       * sao. Nội dung giáo dục thật, không phải trạng thái/dữ liệu bịa. */}
      <section>
        <SectionHeader eyebrow="Vận hành" title="Một phiên Workspace hoạt động thế nào" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OPERATING_STEPS.map((s) => (
            <GemCard key={s.step}>
              <p className="gemos-card-title text-sm font-bold text-gray-900">{s.step}</p>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">{s.detail}</p>
            </GemCard>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader eyebrow="Bắt đầu nhanh" title="Ba việc thường làm nhất ở đây" />
        <div className="grid gap-4 sm:grid-cols-3">
          {WORKSPACE_TEMPLATES.map((t) => (
            <GemCard key={t.title}>
              <p className="gemos-card-title text-sm font-bold text-gray-900">{t.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">{t.use}</p>
            </GemCard>
          ))}
        </div>
      </section>

      <Suspense fallback={null}>
        <WorkspaceMvp />
      </Suspense>
    </div>
  );
}
