import { AdminServicesSection } from "@/components/portal/AdminServicesSection";

export const metadata = { title: "Dịch vụ", description: "Các dịch vụ tư vấn và hỗ trợ triển khai AI, Affiliate Marketing của VO DUONG AI." };

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Dịch vụ</h1>
        <p className="mt-2 text-gray-900">
          Khi bạn cần đồng hành sát hơn ngoài tài liệu tự học.
        </p>
      </div>
      <AdminServicesSection />
    </div>
  );
}
