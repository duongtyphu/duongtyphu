import { getLiveEcosystemChrome } from "@/lib/portal/live-ecosystem-chrome";
import { getAllLiveSubProjects } from "@/lib/portal/live-subprojects";
import { getAllLiveEcosystemArticles } from "@/lib/portal/live-ecosystem-articles";
import { getAllLiveEcosystemRatings } from "@/lib/portal/live-ecosystem-ratings";

import { AdminDuAnCoHoiClient } from "./AdminDuAnCoHoiClient";

export const metadata = { title: "Dự án & Cơ hội — Admin" };

/**
 * `/v2/admin/du-an-co-hoi` — theo đúng lệnh "Admin phải khớp hình ảnh trực
 * quan với trang Portal tương ứng, không phải chỉ khớp riêng với mockup
 * Admin". Khung Admin (`AdminSidebar`/`Topbar`) đã có sẵn ở
 * `src/app/v2/admin/layout.tsx` (Bước F, task #17) — trang này CHỈ dựng
 * phần nội dung, tái dùng NGUYÊN `.duo`/`.cat-grid`/`.card` CSS + dữ liệu
 * thật của `/v2/du-an-co-hoi` (xem `AdminDuAnCoHoiClient.tsx`), thay vì
 * bộ khung KPI/DataTable chung (`@/components/v2/ui/*`) hay bám theo
 * layout bespoke riêng của `Admin Du an Co hoi.html`.
 */
export default async function AdminDuAnCoHoiPage() {
  const ecosystemIds = ["eco_digiu", "eco_solargroup", "eco_crypto", "eco_blockchain", "eco_trading"];

  const [chromes, allSubProjects, allArticles, allRatings] = await Promise.all([
    Promise.all(ecosystemIds.map((id) => getLiveEcosystemChrome(id))),
    getAllLiveSubProjects(),
    getAllLiveEcosystemArticles(),
    getAllLiveEcosystemRatings(),
  ]);

  return (
    <AdminDuAnCoHoiClient
      chromes={chromes}
      allSubProjects={allSubProjects}
      allArticles={allArticles}
      allRatings={allRatings}
    />
  );
}
