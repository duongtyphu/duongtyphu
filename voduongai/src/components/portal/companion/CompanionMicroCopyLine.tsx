/**
 * Companion Design System™ — Layer 05, Nhiệm vụ 07: Đời sống nội tâm.
 * Một dòng micro-copy ngắn, đặt xen giữa các section — không phải section
 * riêng, không card, không glow. Chỉ một câu, đủ để cảm nhận Companion có
 * đời sống riêng, không viết dài, không sáo rỗng.
 */
export function CompanionMicroCopyLine({ children }: { children: React.ReactNode }) {
  return <p className="mx-auto max-w-md text-center text-sm italic leading-relaxed text-slate-400">{children}</p>;
}
