const lessons = [
  { title: "AI là gì và vì sao bạn cần dùng nó", description: "Hiểu nền tảng AI và cách nó thay đổi cách làm việc." },
  { title: "Làm chủ ChatGPT, Claude, Gemini", description: "So sánh và sử dụng hiệu quả các AI phổ biến nhất." },
  { title: "Viết prompt hiệu quả", description: "Nguyên tắc viết prompt rõ ràng, ra kết quả đúng ý." },
  { title: "Ứng dụng AI vào công việc hàng ngày", description: "Tự động hoá các việc lặp lại bằng AI." },
];

export const metadata = { title: "AI Academy" };

export default function AiAcademyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">AI Academy</h1>
        <p className="mt-2 text-white">
          Lộ trình học AI từ nền tảng đến ứng dụng thực chiến trong công việc.
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
