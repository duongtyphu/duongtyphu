import { ExternalLink } from "lucide-react";

import { Card, CardHead } from "@/components/v2/ui/Card";
import { Toggle } from "@/components/v2/ui/Controls";
import { Field, FieldRow2, TextareaField } from "@/components/v2/ui/Field";
import { ListEditorPanel } from "@/components/v2/ui/ListEditorPanel";
import { PageHead, SaveButton } from "@/components/v2/ui/PageHead";
import { TabsRow } from "@/components/v2/ui/TabsRow";
import { listExploreCards } from "@/lib/v2/data/home";

export const metadata = { title: "Landing Page — Admin" };

const HERO_CHIPS = [
  "Học ChatGPT như thế nào?",
  "Bắt đầu với AI từ đâu?",
  "Cách viết prompt hiệu quả?",
  "DeepSeek là gì? Bắt đầu ra sao?",
  "Claude khác ChatGPT thế nào?",
  "Top công cụ AI miễn phí?",
];

export default async function AdminLandingPage() {
  const explore = await listExploreCards();

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Landing Page"
        title="Quản lý Landing Page"
        description="Chỉnh sửa toàn bộ nội dung trang giới thiệu công khai — voduongai.com — hero, hệ sinh thái, bài test năng lực, kỹ năng, công cụ và cộng đồng."
        action={
          <div className="flex shrink-0 gap-[10px]">
            <a
              href="https://voduongai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-[10px] border border-[var(--v2-line)] bg-[var(--v2-surface)] px-4 py-[11px] text-[13px] font-bold text-[var(--v2-text)] hover:bg-[var(--v2-bg)]"
            >
              <ExternalLink className="h-[14px] w-[14px]" aria-hidden="true" />
              Xem trang live
            </a>
            <SaveButton />
          </div>
        }
      />

      <TabsRow
        tabs={[
          {
            id: "hero",
            label: "Banner & Liên hệ",
            content: (
              <div className="grid grid-cols-1 gap-[18px] min-[860px]:grid-cols-2">
                <Card padding="admin">
                  <CardHead title="Nội dung Hero" />
                  <Field
                    label="Dòng nhãn (eyebrow)"
                    defaultValue="Thương hiệu cá nhân · Hệ sinh thái AI"
                  />
                  <TextareaField
                    label="Tiêu đề chính"
                    rows={2}
                    defaultValue="Học AI đúng hướng. Xây hệ thống vững chắc. Tạo tài sản số bền vững."
                  />
                  <TextareaField
                    label="Mô tả"
                    rows={3}
                    defaultValue="VO DUONG AI là hệ sinh thái học tập AI giúp bạn học đúng, thực hành đúng và từng bước xây dựng hệ thống làm việc, thương hiệu cá nhân và tài sản số bền vững trong kỷ nguyên trí tuệ nhân tạo."
                  />
                  <FieldRow2>
                    <Field label="Nút CTA — nhãn" defaultValue="Bắt đầu ngay hôm nay" />
                    <Field label="Nút CTA — đường dẫn" defaultValue="/login" />
                  </FieldRow2>
                  <Field
                    label="Dòng phụ dưới CTA"
                    defaultValue="Miễn phí tham gia • Học mọi lúc • Đồng hành cùng Companion AI"
                  />
                  <div className="mb-[14px]">
                    <span className="mb-[6px] block text-[12px] font-bold text-[var(--v2-muted)]">
                      Câu hỏi gợi ý nổi (chip bay quanh Hero)
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {HERO_CHIPS.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-[9px] border border-[var(--v2-line)] bg-[var(--v2-bg)] px-3 py-2 text-[12.5px] font-semibold"
                        >
                          {chip}
                        </span>
                      ))}
                      <button
                        type="button"
                        className="rounded-[9px] border border-dashed border-[var(--v2-violet)] px-3 py-2 text-[12.5px] font-bold text-[var(--v2-violet)]"
                      >
                        + Thêm câu hỏi
                      </button>
                    </div>
                  </div>
                </Card>

                <div className="flex flex-col gap-[18px]">
                  <Card padding="admin">
                    <CardHead title="Thông tin liên hệ" />
                    <FieldRow2>
                      <Field label="Email" type="email" defaultValue="duongvv.vn@gmail.com" />
                      <Field label="Hotline" defaultValue="1900 xxxx" />
                    </FieldRow2>
                    <Field label="Địa chỉ" defaultValue="TP. Hồ Chí Minh, Việt Nam" />
                  </Card>

                  <Card padding="admin">
                    <CardHead title="Kênh mạng xã hội" />
                    <Field label="Facebook" defaultValue="https://facebook.com/voduongai" />
                    <Field label="YouTube" defaultValue="https://youtube.com/@voduongai" />
                    <Field label="TikTok" defaultValue="https://tiktok.com/@voduongai" />
                    <Field label="Zalo" defaultValue="https://zalo.me/voduongai" />
                  </Card>
                </div>
              </div>
            ),
          },
          {
            id: "eco",
            label: "Hệ sinh thái",
            content: (
              <ListEditorPanel
                listTitle='6 khối "Tất cả những gì bạn cần"'
                addLabel="Thêm khối"
                formTitle="Chi tiết khối đã chọn"
                titleField="title"
                items={explore.map((card) => ({
                  id: `lp_${card.id}`,
                  title: card.title,
                  subtitle: card.description.slice(0, 60),
                  icon: card.icon,
                  values: {
                    title: card.title,
                    description: card.description,
                    href: card.href,
                  },
                }))}
                fields={[
                  { name: "title", label: "Tiêu đề khối", type: "text" },
                  { name: "description", label: "Mô tả", type: "textarea", rows: 3 },
                  { name: "href", label: "Đường dẫn", type: "text" },
                ]}
              />
            ),
          },
          {
            id: "roadmap",
            label: "Lộ trình & Nền tảng",
            content: (
              <Card padding="admin">
                <CardHead title="Khối lộ trình trên Landing Page" />
                <Field label="Tiêu đề khu vực" defaultValue="Lộ trình học AI từ số 0" />
                <TextareaField
                  label="Mô tả"
                  rows={3}
                  defaultValue="Năm giai đoạn rõ ràng, từ hiểu AI là gì tới xây được tài sản số của riêng bạn."
                />
                <FieldRow2>
                  <Field label="Nhãn nút" defaultValue="Xem lộ trình chi tiết" />
                  <Field label="Đường dẫn" defaultValue="/v2/hanh-trinh-cua-toi" />
                </FieldRow2>
                <Toggle label="Hiển thị khu vực này" defaultOn />
              </Card>
            ),
          },
          {
            id: "quiz",
            label: "Đánh giá năng lực",
            content: (
              <Card padding="admin">
                <CardHead title="Bài đánh giá năng lực AI" />
                <Field label="Tiêu đề" defaultValue="Bạn đang ở đâu trên hành trình AI?" />
                <TextareaField
                  label="Mô tả"
                  rows={3}
                  defaultValue="Trả lời 10 câu hỏi ngắn để biết mình đang ở giai đoạn nào và nên bắt đầu từ đâu."
                />
                <FieldRow2>
                  <Field label="Số câu hỏi" defaultValue="10" />
                  <Field label="Thời gian ước tính" defaultValue="3 phút" />
                </FieldRow2>
                <Toggle label="Hiển thị khu vực này" defaultOn />
                <Toggle label="Yêu cầu email trước khi xem kết quả" defaultOn />
              </Card>
            ),
          },
          {
            id: "skills",
            label: "Kỹ năng & Công cụ AI",
            content: (
              <Card padding="admin">
                <CardHead title="Khu vực kỹ năng & công cụ" />
                <Field label="Tiêu đề" defaultValue="Kỹ năng và công cụ bạn sẽ thành thạo" />
                <TextareaField
                  label="Mô tả"
                  rows={3}
                  defaultValue="Không học dàn trải. Tập trung vào những kỹ năng và công cụ tạo ra kết quả thật trong công việc."
                />
                <Toggle label="Hiển thị logo công cụ" defaultOn />
                <Toggle label="Hiển thị khu vực này" defaultOn />
              </Card>
            ),
          },
          {
            id: "community",
            label: "Cộng đồng & Người sáng lập",
            content: (
              <div className="grid grid-cols-1 gap-[18px] min-[860px]:grid-cols-2">
                <Card padding="admin">
                  <CardHead title="Khu vực cộng đồng" />
                  <Field label="Tiêu đề" defaultValue="Không ai đi một mình" />
                  <TextareaField
                    label="Mô tả"
                    rows={3}
                    defaultValue="Cộng đồng người học AI chia sẻ kết quả thật, hỏi đáp thật, đi cùng nhau đường dài."
                  />
                  <Field label="Số thành viên hiển thị" defaultValue="18.420" />
                </Card>
                <Card padding="admin">
                  <CardHead title="Người sáng lập" />
                  <Field label="Họ và tên" defaultValue="Võ Dương" />
                  <Field label="Chức danh" defaultValue="Nhà sáng lập VO DUONG AI" />
                  <TextareaField
                    label="Giới thiệu"
                    rows={4}
                    defaultValue="Chia sẻ kiến thức và kinh nghiệm thực chiến về AI, xây dựng hệ sinh thái học tập giúp người Việt ứng dụng AI hiệu quả vào công việc và cuộc sống."
                  />
                </Card>
              </div>
            ),
          },
          {
            id: "seo",
            label: "SEO & Metadata",
            content: (
              <Card padding="admin">
                <CardHead title="SEO & Metadata" />
                <Field label="Thẻ tiêu đề (title)" defaultValue="VO DUONG AI — Học AI đúng hướng" />
                <TextareaField
                  label="Mô tả (meta description)"
                  rows={3}
                  defaultValue="Hệ sinh thái học tập AI giúp bạn học đúng, thực hành đúng và xây dựng tài sản số bền vững."
                />
                <Field
                  label="Từ khoá"
                  defaultValue="học AI, VO DUONG AI, AI Toolkit, Affiliate Marketing, tài sản số"
                />
                <FieldRow2>
                  <Field label="Đường dẫn chuẩn (canonical)" defaultValue="https://voduongai.com/" />
                  <Field label="Ảnh Open Graph" defaultValue="/opengraph-image" />
                </FieldRow2>
                <Toggle label="Cho phép công cụ tìm kiếm lập chỉ mục" defaultOn />
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}
