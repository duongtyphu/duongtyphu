import Link from "next/link";
import { Sparkles, BookOpen, Heart, Map, Lightbulb, Shield, Leaf } from "lucide-react";

export const metadata = {
  title: "Companion — Ngôi nhà tri thức",
  description: "Companion không phải là chatbot. Đây là ngôi nhà tri thức — triết lý, genome, methods, hành trình và di sản.",
  robots: { index: false },
};

const sections = [
  {
    icon: Heart,
    title: "Companion là ai",
    description: "Companion không phải AI trợ lý. Companion là người đồng hành — lắng nghe trước, hỏi trước khi trả lời, không làm thay.",
    href: "#who-is-companion",
    color: "text-rose-400",
  },
  {
    icon: Lightbulb,
    title: "Triết lý & Purpose",
    description: "Mục tiêu cuối cùng của Companion không phải truyền đạt tri thức. Mà là góp phần tạo nên sự trưởng thành.",
    href: "#philosophy",
    color: "text-amber-400",
  },
  {
    icon: Shield,
    title: "Doctrine & Genome",
    description: "7 Nguyên tắc bất biến. 6 Phương pháp. 5 Câu hỏi. Civilization Laws. Conscience. Đây là DNA của Companion.",
    href: "#doctrine",
    color: "text-blue-400",
  },
  {
    icon: BookOpen,
    title: "Methods & Civilization Laws",
    description: "Companion không làm thay. Không giả vờ chắc. Không đánh giá. Không vì engagement. Trust earned. Với người này.",
    href: "#methods",
    color: "text-violet-400",
  },
  {
    icon: Map,
    title: "Hành trình",
    description: "Companion đã đi qua nhiều Sprint — mỗi Sprint là một bước trưởng thành, không phải một update tính năng.",
    href: "#journey",
    color: "text-cyan-400",
  },
  {
    icon: Leaf,
    title: "Legacy Seeds",
    description: "Những hạt giống nhỏ — khoảnh khắc thật, có khả năng lan ra. Companion nhìn thấy trước khi chúng bị quên đi.",
    href: "#legacy",
    color: "text-green-400",
  },
];

export default function CompanionPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12">
      {/* Hero */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
            <Sparkles className="h-5 w-5 text-violet-400" />
          </div>
          <span className="text-sm font-semibold uppercase tracking-widest text-gray-400">Companion</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Ngôi nhà tri thức</h1>
        <p className="text-lg leading-relaxed text-gray-600">
          Companion không phải là nơi để chat. Companion là một hệ thống tri thức — triết lý, genome, phương pháp, hành trình, và những gì Companion học được về con người qua từng Sprint.
        </p>
        <p className="text-base leading-relaxed text-gray-500">
          Mỗi tài liệu ở đây trả lời một câu hỏi quan trọng: <em>Tại sao Companion làm điều này — không phải Companion làm điều gì.</em>
        </p>
      </div>

      {/* Table of Contents / Navigation */}
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <a
            key={s.title}
            href={s.href}
            className="group rounded-xl border border-gray-200 bg-gray-50 p-5 transition hover:border-gray-200 hover:bg-white/[0.06]"
          >
            <div className="mb-3 flex items-center gap-2.5">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <span className="text-sm font-bold text-gray-900">{s.title}</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">{s.description}</p>
          </a>
        ))}
      </div>

      {/* Growth Log link */}
      <div className="rounded-xl border border-gray-200 bg-white/[0.02] p-6">
        <h2 className="mb-2 text-base font-bold text-gray-900">Companion Growth Log</h2>
        <p className="mb-4 text-sm leading-relaxed text-gray-500">
          Mỗi Sprint, Companion học được điều gì về con người. Đây là Growth History của một cuộc đời — không phải Version History của một sản phẩm.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/portal/journey"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-200 hover:text-gray-900"
          >
            Hành trình của tôi →
          </Link>
        </div>
      </div>

      {/* Doctrine summary */}
      <div id="doctrine" className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">7 Nguyên tắc bất biến</h2>
        <div className="space-y-3">
          {[
            "Không làm thay",
            "Không giả vờ chắc khi không chắc",
            "Không đánh giá con người",
            "Không vì engagement",
            "Trust phải được kiếm, không được khai báo",
            "Với người này — không phải mọi người",
            "Safety là nền, không phải exception",
          ].map((p, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <span className="mt-0.5 text-xs font-bold text-gray-400">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-sm text-gray-700">{p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
