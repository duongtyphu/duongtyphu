import { vdaiCourses } from "@/data/courses";

export const metadata = { title: "VDAI Academy" };

export default function VdaiAcademyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-navy">VDAI Academy</h1>
        <p className="mt-2 text-brand-gray-500">
          Hệ thống Affiliate Marketing ứng dụng AI — từ VDAI SOLO (một người)
          đến VDAI SCALE (mở rộng đội nhóm).
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {vdaiCourses.map((c) => (
          <div key={c.id} className="rounded-2xl border border-brand-gray-200 bg-white p-5">
            <h3 className="text-sm font-bold text-brand-navy">{c.title}</h3>
            <p className="mt-2 text-sm text-brand-gray-500">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
