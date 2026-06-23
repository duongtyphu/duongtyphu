import { vdaiCourses } from "@/data/courses";

export const metadata = { title: "VDAI Academy" };

export default function VdaiAcademyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">VDAI Academy</h1>
        <p className="mt-2 text-white/60">
          Hệ thống Affiliate Marketing ứng dụng AI — từ VDAI SOLO (một người)
          đến VDAI SCALE (mở rộng đội nhóm).
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {vdaiCourses.map((c) => (
          <div key={c.id} className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-white">{c.title}</h3>
            <p className="mt-2 text-sm text-white/60">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
