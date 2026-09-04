import { redirect, notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { getMnytTopicAdmin, deleteMnytTopicAdmin } from "../actions";
import { listMnytCategories } from "../../danh-muc/actions";
import { TopicEditForm } from "./TopicEditForm";

export const metadata = { title: "Sửa ý tưởng · Admin" };

export default async function MnytTopicEditPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { id } = await params;
  const [topic, { items: categories }] = await Promise.all([getMnytTopicAdmin(id), listMnytCategories()]);
  if (!topic) notFound();

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        trail={[
          { label: "Học viện", href: "/admin/moi-ngay-mot-y-tuong/y-tuong" },
          { label: "Mỗi ngày một ý tưởng", href: "/admin/moi-ngay-mot-y-tuong/y-tuong" },
          { label: "Ý tưởng", href: "/admin/moi-ngay-mot-y-tuong/y-tuong" },
          { label: topic.title },
        ]}
      />
      <TopicEditForm
        topic={topic}
        categories={categories.map((c) => ({ key: c.key, name: c.name, name_en: c.name_en, color: c.color }))}
        deleteAction={deleteMnytTopicAdmin}
      />
    </div>
  );
}
