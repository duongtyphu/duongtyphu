const pillars = [
  {
    id: "digiu",
    title: "DigiU — Tài sản số cá nhân",
    description:
      "Tài sản số bạn tự tạo và sở hữu: ebook, prompt pack, template, khoá học — sản phẩm trí tuệ có thể bán lặp lại mà không tốn thêm công sức sản xuất.",
  },
  {
    id: "blockchain",
    title: "Blockchain",
    description:
      "Nền tảng công nghệ phía sau crypto và nhiều ứng dụng phi tập trung. Hiểu blockchain giúp bạn đọc đúng bản chất các xu hướng tài sản số đang nổi lên.",
  },
  {
    id: "crypto",
    title: "Crypto",
    description:
      "Tài sản số vận hành trên blockchain. Rủi ro cao, biến động mạnh — cần hiểu rõ trước khi tham gia, không phải kênh \"làm giàu nhanh\".",
  },
  {
    id: "trading",
    title: "Trading",
    description:
      "Kỹ năng phân tích và quản trị rủi ro khi giao dịch tài sản tài chính. Đòi hỏi kỷ luật và kiến thức nền, không phải may rủi.",
  },
  {
    id: "equity",
    title: "Đầu tư cổ phần doanh nghiệp",
    description:
      "Góc nhìn dài hạn: sở hữu một phần doanh nghiệp đang vận hành thay vì chỉ trao đổi tài sản trên thị trường.",
  },
];

export const metadata = { title: "Trung tâm Tài sản số" };

export default function AssetsHubPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Trung tâm Tài sản số</h1>
        <p className="mt-2 text-white">
          Mở rộng tầm nhìn về các loại tài sản số khác nhau. Mục tiêu ở đây là
          giáo dục và nâng nhận thức trước — không phải bán hàng.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {pillars.map((p) => (
          <div key={p.id} className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-white">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
