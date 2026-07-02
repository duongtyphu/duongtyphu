"use client";

export function DiscoveryGoalCard({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active
          ? "border-blue-500 bg-brand-blue text-white"
          : "border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-300 hover:text-blue-600"
      }`}
    >
      {label}
    </button>
  );
}
