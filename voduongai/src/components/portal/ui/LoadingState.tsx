export function LoadingState({ label = "Đang tải..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="spin-slow h-8 w-8 rounded-full border-2 border-white/10 border-t-[#22D3EE]" />
      <p className="text-sm font-semibold text-white/50">{label}</p>
    </div>
  );
}
