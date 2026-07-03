import { Download } from "lucide-react";

/** Chuẩn bị nhãn Prompt Pack/Checklist/Template cho tính năng download sau này — chưa xây file thật. */
export function DownloadPrepCard({
  promptPackLabel,
  checklistLabel,
  templateLabel,
}: {
  promptPackLabel: string;
  checklistLabel: string;
  templateLabel: string;
}) {
  const items = [promptPackLabel, checklistLabel, templateLabel];
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-4">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400">
        <Download className="h-3.5 w-3.5" />
        Sẵn sàng để tải xuống (sắp có)
      </p>
      <ul className="space-y-1 text-xs text-gray-500">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
