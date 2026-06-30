export const metadata = { title: "Thành công học viên" };

const STORIES = [
  {
    name: "Minh Anh",
    role: "Content Creator",
    result: "Tăng 3x lượt tương tác sau 30 ngày dùng Prompt content viral.",
    quote: "Trước đây mình mất cả buổi để viết 1 bài. Giờ chỉ cần 15 phút với prompt có sẵn trong VO DUONG AI.",
  },
  {
    name: "Quốc Huy",
    role: "Affiliate Marketer",
    result: "Có đơn hàng Affiliate đầu tiên sau 2 tuần áp dụng lộ trình.",
    quote: "Affiliate Hub giúp mình biết nên chọn ngách nào và bắt đầu từ đâu, không còn mông lung.",
  },
  {
    name: "Thanh Trúc",
    role: "Freelancer",
    result: "Ra mắt ebook đầu tiên và bán được trong tháng đầu tiên.",
    quote: "Học viện AI + Thư viện Template giúp mình hoàn thành sản phẩm số nhanh hơn nhiều so với tự mò.",
  },
];

export default function StudentSuccessPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Thành công học viên</h1>
        <p className="mt-2 text-gray-900">Câu chuyện thực tế từ học viên đã áp dụng AI, Affiliate và xây tài sản số.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {STORIES.map((s) => (
          <div key={s.name} className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-xl">👤</div>
            <h3 className="mt-3 text-center text-sm font-bold text-gray-900">{s.name}</h3>
            <p className="text-center text-xs text-brand-violet">{s.role}</p>
            <p className="mt-3 text-sm font-semibold text-brand-blue">{s.result}</p>
            <p className="mt-2 text-sm italic text-gray-600">&ldquo;{s.quote}&rdquo;</p>
          </div>
        ))}
      </div>
    </div>
  );
}
