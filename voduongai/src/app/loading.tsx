export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-brand-blue" />
      <p className="text-sm text-white/50">Đang tải...</p>
    </div>
  );
}
