import { RoadmapInteractive } from "@/components/portal/RoadmapInteractive";

export const metadata = { title: "Lộ trình thành công" };

export default function RoadmapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Lộ trình thành công</h1>
        <p className="mt-2 text-white">
          7 bước từ làm quen AI đến mở rộng hệ sinh thái cá nhân. Chọn điểm bắt
          đầu phù hợp với bạn.
        </p>
      </div>
      <RoadmapInteractive />
    </div>
  );
}
