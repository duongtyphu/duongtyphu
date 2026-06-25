const lessons = [
  { title: "Định vị thương hiệu cá nhân", description: "Xác định bạn muốn được biết đến vì điều gì, với ai." },
  { title: "Xây câu chuyện cá nhân (Personal Story)", description: "Kể câu chuyện của bạn theo cách tạo kết nối và niềm tin." },
  { title: "Chọn kênh và tần suất xuất hiện", description: "Chọn 1-2 kênh phù hợp năng lực, duy trì đều đặn hơn là dàn trải." },
  { title: "Xây hình ảnh chuyên nghiệp bằng AI", description: "Dùng AI tạo ảnh đại diện, mô tả, bộ nhận diện cá nhân nhất quán." },
  { title: "Biến follower thành khách hàng", description: "Chuyển từ người theo dõi sang người tin tưởng và mua hàng." },
];

export const metadata = { title: "Thương hiệu cá nhân", description: "Lộ trình xây dựng thương hiệu cá nhân ứng dụng AI của VO DUONG AI." };

export default function PersonalBrandPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Thương hiệu cá nhân</h1>
        <p className="mt-2 text-white">
          Micro-learning giúp bạn xây dựng thương hiệu cá nhân làm nền tảng cho
          Affiliate Marketing và tạo tài sản số lâu dài.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {lessons.map((l) => (
          <div key={l.title} className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-white">{l.title}</h3>
            <p className="mt-2 text-sm text-white">{l.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
