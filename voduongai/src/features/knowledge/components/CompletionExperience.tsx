/** Feature 14 — Completion Experience: đủ tạo cảm giác thành tựu, không animation phức tạp. */
export function CompletionExperience({ seedTitle }: { seedTitle: string }) {
  return (
    <div className="space-y-1.5 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 text-center">
      <p className="text-2xl">🌱</p>
      <p className="text-sm font-bold text-emerald-700">Bạn vừa gieo thêm một hạt giống tri thức.</p>
      <p className="text-xs text-gray-500">Đã hoàn thành: {seedTitle}</p>
    </div>
  );
}
