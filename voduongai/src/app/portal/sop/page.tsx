import { sops } from "@/data/sop";

export const metadata = { title: "SOP", description: "Quy trình chuẩn (SOP) vận hành Affiliate Marketing và sản xuất nội dung của VO DUONG AI." };

export default function SopPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">SOP — Quy trình vận hành</h1>
        <p className="mt-2 text-white">
          Quy trình chuẩn hoá để bạn (và đội nhóm) làm việc nhất quán, không phụ thuộc cảm hứng.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sops.map((s) => (
          <div key={s.title} className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-white">{s.title}</h3>
            <p className="mt-2 text-sm text-white">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
