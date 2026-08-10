import { Card, CardHead } from "@/components/v2/ui/Card";
import { ListEditorPanel } from "@/components/v2/ui/ListEditorPanel";
import { PageHead, SaveButton } from "@/components/v2/ui/PageHead";
import { PORTAL_NAV } from "@/components/v2/nav/nav-config";

export const metadata = { title: "Quản lý Menu — Admin" };

export default function AdminQuanLyMenuPage() {
  const [mainSection, quickSection] = PORTAL_NAV;

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Tổng quan › Quản lý Menu"
        title="Quản lý Menu Portal"
        description="Thêm, sửa, xoá và sắp xếp lại toàn bộ mục menu hiển thị trên thanh điều hướng portal."
        action={<SaveButton />}
      />

      <ListEditorPanel
        listTitle="Cấu trúc Menu chính"
        addLabel="Thêm mục menu"
        formTitle="Chi tiết mục menu"
        titleField="label"
        items={mainSection.items.map((item) => ({
          id: item.href,
          title: item.label,
          subtitle: item.href,
          icon: item.icon,
          values: {
            label: item.label,
            href: item.href,
            group: item.group ?? "Không thuộc cụm nào",
          },
        }))}
        fields={[
          { name: "label", label: "Nhãn hiển thị", type: "text" },
          { name: "href", label: "Đường dẫn", type: "text" },
          {
            name: "group",
            label: "Thuộc cụm mở rộng",
            type: "select",
            options: ["Không thuộc cụm nào", "companion", "ecosystem"],
            hint: "Mục thuộc một cụm chỉ hiện khi người dùng đang đứng trong cụm đó.",
          },
        ]}
      />

      <Card padding="admin">
        <CardHead title="Tiện ích nhanh (cố định)" />
        <p className="mb-3 text-[12.5px] text-[var(--v2-muted)]">
          Ba mục dưới đây luôn nằm cuối sidebar và không sắp xếp lại được.
        </p>
        {quickSection.items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.href}
              className="flex items-center gap-3 border-b border-[var(--v2-line)] py-3 last:border-b-0"
            >
              <span className="v2-ico flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] bg-[var(--v2-violet-light)] text-[var(--v2-violet)]">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <div className="text-[13px] font-bold">{item.label}</div>
                <div className="text-[11.5px] text-[var(--v2-muted)]">{item.href}</div>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
