import { MediaWorkspaceShell } from "@/components/admin/media/MediaWorkspaceShell";
import { MediaAssetRegistry } from "@/components/admin/media/MediaAssetRegistry";

export default function MediaDocumentsPage() {
  return (
    <MediaWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Documents</h2>
          <p className="mt-1 text-sm text-white/60">
            Metadata tài liệu — PDF/DOCX/XLSX/PPTX (Task 5), dùng chung thư viện Media, lọc theo category
            &quot;Document&quot;. <strong className="text-brand-orange">Phát hiện kiến trúc:</strong> PDF khoá học
            hiện là URL động (`products.pdf_url`/`lessons.pdf_url`, nhập tay ở khu vực Premium), không phải file
            do Media Center quản lý. DOCX/XLSX/PPTX chưa có ví dụ nào trong repo.
          </p>
        </div>
        <MediaAssetRegistry lockedCategory="Document" />
      </div>
    </MediaWorkspaceShell>
  );
}
