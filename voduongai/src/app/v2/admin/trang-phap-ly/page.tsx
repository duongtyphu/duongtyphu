import { Card, CardHead } from "@/components/v2/ui/Card";
import { Field, FieldRow2, TextareaField } from "@/components/v2/ui/Field";
import { ListEditorPanel } from "@/components/v2/ui/ListEditorPanel";
import { PageHead, SaveButton } from "@/components/v2/ui/PageHead";
import { TabsRow } from "@/components/v2/ui/TabsRow";

export const metadata = { title: "Trang Pháp lý — Admin" };

/** Mỗi trang pháp lý gồm một khối metadata + danh sách mục nội dung sửa được. */
const LEGAL_PAGES = [
  {
    id: "privacy",
    label: "Chính sách bảo mật",
    slug: "/privacy",
    updatedAt: "01/08/2026",
    sections: [
      { id: "pv1", title: "Thông tin chúng tôi thu thập", body: "Chúng tôi thu thập thông tin bạn cung cấp khi đăng ký tài khoản, và dữ liệu sử dụng cần thiết để vận hành dịch vụ." },
      { id: "pv2", title: "Cách chúng tôi sử dụng thông tin", body: "Thông tin được dùng để cung cấp dịch vụ, cá nhân hoá trải nghiệm học tập và cải thiện chất lượng nội dung." },
      { id: "pv3", title: "Chia sẻ với bên thứ ba", body: "Chúng tôi không bán dữ liệu cá nhân. Dữ liệu chỉ chia sẻ với nhà cung cấp hạ tầng cần thiết để vận hành." },
      { id: "pv4", title: "Quyền của bạn", body: "Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xoá dữ liệu cá nhân bất cứ lúc nào." },
    ],
  },
  {
    id: "terms",
    label: "Điều khoản sử dụng",
    slug: "/terms",
    updatedAt: "01/08/2026",
    sections: [
      { id: "tm1", title: "Chấp nhận điều khoản", body: "Khi tạo tài khoản, bạn đồng ý với toàn bộ điều khoản được nêu tại trang này." },
      { id: "tm2", title: "Tài khoản và bảo mật", body: "Bạn chịu trách nhiệm giữ bí mật thông tin đăng nhập và mọi hoạt động diễn ra trên tài khoản của mình." },
      { id: "tm3", title: "Quyền sở hữu nội dung", body: "Toàn bộ khoá học, tài liệu và công cụ thuộc quyền sở hữu của VO DUONG AI, không được sao chép hoặc phân phối lại." },
      { id: "tm4", title: "Chấm dứt dịch vụ", body: "Chúng tôi có quyền tạm ngưng tài khoản vi phạm nguyên tắc cộng đồng hoặc điều khoản sử dụng." },
    ],
  },
  {
    id: "refund",
    label: "Chính sách hoàn phí",
    slug: "/refund-policy",
    updatedAt: "15/07/2026",
    sections: [
      { id: "rf1", title: "Điều kiện hoàn phí", body: "Trong 7 ngày đầu kể từ ngày thanh toán, nếu bạn chưa hoàn thành quá 20% nội dung, bạn được hoàn phí toàn phần." },
      { id: "rf2", title: "Quy trình yêu cầu", body: "Gửi yêu cầu qua mục Hỗ trợ trong Portal, kèm mã giao dịch. Chúng tôi phản hồi trong 3 ngày làm việc." },
      { id: "rf3", title: "Trường hợp không áp dụng", body: "Không áp dụng cho sản phẩm tải về, tài liệu số đã truy cập hoặc gói đã gia hạn quá 7 ngày." },
    ],
  },
  {
    id: "affiliate",
    label: "Điều khoản Affiliate",
    slug: "/affiliate-terms",
    updatedAt: "20/07/2026",
    sections: [
      { id: "af1", title: "Điều kiện tham gia", body: "Mọi thành viên đã xác thực email đều có thể tham gia chương trình affiliate." },
      { id: "af2", title: "Cách tính hoa hồng", body: "Hoa hồng tính trên giá trị thực thanh toán, theo cấp bậc affiliate tại thời điểm phát sinh giao dịch." },
      { id: "af3", title: "Thời điểm thanh toán", body: "Hoa hồng được đối soát hằng tháng và chi trả vào ngày 10 của tháng kế tiếp." },
      { id: "af4", title: "Hành vi bị cấm", body: "Nghiêm cấm chạy quảng cáo trên thương hiệu, spam hoặc tự giới thiệu chính mình để hưởng hoa hồng." },
    ],
  },
];

export default function AdminTrangPhapLyPage() {
  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Landing Page › Trang Pháp lý"
        title="Trang Pháp lý"
        description="Soạn nội dung Chính sách bảo mật, Điều khoản sử dụng và Chính sách hoàn phí — hiển thị ở footer trang công khai."
        action={<SaveButton />}
      />

      <TabsRow
        tabs={LEGAL_PAGES.map((page) => ({
          id: page.id,
          label: page.label,
          content: (
            <>
              <Card padding="admin">
                <CardHead title="Thông tin trang" />
                <FieldRow2>
                  <Field label="Tiêu đề trang" defaultValue={page.label} />
                  <Field label="Đường dẫn" defaultValue={page.slug} />
                </FieldRow2>
                <FieldRow2>
                  <Field label="Cập nhật lần cuối" defaultValue={page.updatedAt} />
                  <Field label="Phiên bản" defaultValue="1.0" />
                </FieldRow2>
                <TextareaField
                  label="Lời mở đầu"
                  rows={3}
                  defaultValue={`Trang này mô tả ${page.label.toLowerCase()} áp dụng cho toàn bộ dịch vụ của VO DUONG AI.`}
                />
              </Card>

              <ListEditorPanel
                listTitle="Mục nội dung"
                addLabel="Thêm mục nội dung"
                formTitle="Chi tiết mục đã chọn"
                titleField="title"
                items={page.sections.map((section) => ({
                  id: section.id,
                  title: section.title,
                  subtitle: section.body.slice(0, 60),
                  values: { title: section.title, body: section.body },
                }))}
                fields={[
                  { name: "title", label: "Tiêu đề mục", type: "text" },
                  { name: "body", label: "Nội dung", type: "textarea", rows: 6 },
                ]}
              />
            </>
          ),
        }))}
      />
    </div>
  );
}
