import { Bot, BookOpen, Briefcase, Crown, GraduationCap, LayoutGrid } from "lucide-react";

import { Card, CardHead } from "@/components/v2/ui/Card";
import { UploadSlot } from "@/components/v2/ui/Controls";
import { Field, FieldRow2, SelectField, TextareaField } from "@/components/v2/ui/Field";
import { ListEditorPanel } from "@/components/v2/ui/ListEditorPanel";
import { PageHead, SaveButton } from "@/components/v2/ui/PageHead";
import { TabsRow } from "@/components/v2/ui/TabsRow";
import { listExploreCards } from "@/lib/v2/data/home";
import { listJourneyStages } from "@/lib/v2/data/catalog";

export const metadata = { title: "Trang chủ Portal — Admin" };

const ECOSYSTEM_ICONS = [GraduationCap, Bot, BookOpen, LayoutGrid, Briefcase, Crown];

export default async function AdminTrangChuPage() {
  const [explore, stages] = await Promise.all([listExploreCards(), listJourneyStages()]);

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Nội dung Portal › Trang chủ"
        title="Quản lý Trang chủ"
        description="Chỉnh sửa banner chính, hệ sinh thái, khám phá nhanh và lộ trình học tập hiển thị trên Trang chủ."
        action={<SaveButton />}
      />

      <TabsRow
        tabs={[
          {
            id: "banner",
            label: "Banner chính",
            content: (
              <div className="grid grid-cols-1 gap-[18px] min-[860px]:grid-cols-2">
                <Card padding="admin">
                  <CardHead title="Nội dung banner" />
                  <Field label="Tiêu đề chính" defaultValue="Chào mừng bạn trở lại!" />
                  <TextareaField
                    label="Mô tả"
                    rows={3}
                    defaultValue="Hôm nay là một ngày tuyệt vời để học hỏi và phát triển cùng AI."
                  />
                  <FieldRow2>
                    <Field label="Nút chính — nhãn" defaultValue="Tiếp tục học" />
                    <Field label="Nút chính — đường dẫn" defaultValue="/v2/hoc-vien-ai" />
                  </FieldRow2>
                  <FieldRow2>
                    <Field label="Nút phụ — nhãn" defaultValue="Gặp Companion AI Mentor" />
                    <Field label="Nút phụ — đường dẫn" defaultValue="/v2/companion" />
                  </FieldRow2>
                </Card>

                <Card padding="admin">
                  <CardHead title="Hình ảnh / Hiệu ứng nền" />
                  <div className="mb-[14px]">
                    <span className="mb-[6px] block text-[12px] font-bold text-[var(--v2-muted)]">
                      Nhân vật Companion trong banner
                    </span>
                    <UploadSlot label="Tải lên ảnh nhân vật Companion (PNG nền trong suốt)" />
                  </div>
                  <SelectField
                    label="Hiệu ứng sao lấp lánh"
                    options={["Bật — 39 chấm sao di chuyển", "Bật — mật độ thấp", "Tắt hiệu ứng"]}
                  />
                  <SelectField
                    label="5 ngôi sao đánh giá (vị trí tay robot)"
                    options={["Hiển thị — màu vàng ánh kim", "Ẩn"]}
                  />
                </Card>
              </div>
            ),
          },
          {
            id: "eco",
            label: "Hệ sinh thái",
            content: (
              <ListEditorPanel
                listTitle="6 khối Hệ sinh thái"
                addLabel="Thêm khối hệ sinh thái"
                formTitle="Chi tiết khối đã chọn"
                titleField="title"
                items={explore.map((card, index) => ({
                  id: card.id,
                  title: card.title,
                  subtitle: card.description.slice(0, 60),
                  icon: ECOSYSTEM_ICONS[index % ECOSYSTEM_ICONS.length],
                  values: {
                    title: card.title,
                    description: card.description,
                    href: card.href,
                  },
                }))}
                fields={[
                  { name: "title", label: "Tên khối", type: "text" },
                  { name: "description", label: "Mô tả ngắn", type: "textarea", rows: 3 },
                  { name: "href", label: "Đường dẫn", type: "text" },
                ]}
              />
            ),
          },
          {
            id: "explore",
            label: "Khám phá nhanh",
            content: (
              <ListEditorPanel
                listTitle="6 mục Khám phá nhanh"
                addLabel="Thêm mục khám phá"
                formTitle="Chi tiết mục đã chọn"
                titleField="title"
                items={explore.map((card, index) => ({
                  id: `ex_${card.id}`,
                  title: card.title,
                  subtitle: card.href,
                  icon: ECOSYSTEM_ICONS[index % ECOSYSTEM_ICONS.length],
                  values: {
                    title: card.title,
                    description: card.description,
                    href: card.href,
                  },
                }))}
                fields={[
                  { name: "title", label: "Tiêu đề", type: "text" },
                  { name: "description", label: "Mô tả", type: "textarea", rows: 3 },
                  { name: "href", label: "Đường dẫn", type: "text" },
                ]}
              />
            ),
          },
          {
            id: "roadmap",
            label: "Lộ trình học tập",
            content: (
              <ListEditorPanel
                listTitle={`${stages.length} giai đoạn lộ trình`}
                addLabel="Thêm giai đoạn"
                formTitle="Chi tiết giai đoạn đã chọn"
                titleField="name"
                items={stages.map((stage) => ({
                  id: stage.id,
                  title: stage.name,
                  subtitle: stage.description.slice(0, 60),
                  values: {
                    name: stage.name,
                    description: stage.description,
                    courseCount: String(stage.courseCount),
                  },
                }))}
                fields={[
                  { name: "name", label: "Tên giai đoạn", type: "text" },
                  { name: "description", label: "Mô tả", type: "textarea", rows: 3 },
                  { name: "courseCount", label: "Số khoá học", type: "text" },
                ]}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
