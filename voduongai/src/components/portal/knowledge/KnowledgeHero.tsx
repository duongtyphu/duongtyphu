import { Button } from "@/components/portal/ui/Button";
import { GemCard } from "@/components/portal/ui/GemCard";

/**
 * Answers: "Điều gì mình cần hiểu để thay đổi?"
 */
export function KnowledgeHero() {
  return (
    <GemCard variant="featured" className="!p-7 sm:!p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Tri thức</p>
      <h1 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">Hệ Tri Thức của bạn</h1>
      <p className="mt-2 max-w-xl text-sm text-gray-600 sm:text-base">
        Điều gì mình cần hiểu để thay đổi? Học không phải để biết nhiều hơn —
        mà để hiểu đúng nguyên lý, áp dụng đúng việc, và lưu giữ đúng điều đáng nhớ.
      </p>
      <p className="mt-2 max-w-xl text-xs italic text-gray-900/45">
        Giai đoạn UNDERSTAND trong hành trình mài giũa của bạn.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button href="/portal/hocvienai" variant="primary">
          Tiếp tục học →
        </Button>
        <Button href="/portal/hetrithucai" variant="secondary">
          Khám phá thư viện AI
        </Button>
      </div>
    </GemCard>
  );
}
