export const blogCategories = [
  "AI",
  "Affiliate Marketing",
  "Prompt",
  "Công cụ AI",
  "Tài sản số",
  "DigiU",
  "Website & SEO",
  "Case Study",
] as const;

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tag: string;
  emoji: string;
  date: string;
  readTime: string;
  tags: string[];
  ctaTitle: string;
  ctaDescription: string;
  ctaLabel: string;
  ctaHref: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "ai-nghien-cuu-san-pham-affiliate",
    title: "AI giúp tăng tốc nghiên cứu sản phẩm Affiliate như thế nào?",
    excerpt:
      "Quy trình nghiên cứu ngách, đối thủ và sản phẩm tiềm năng thường mất hàng giờ. Đây là cách dùng AI để rút quy trình đó xuống chỉ còn vài chục phút mà vẫn chính xác.",
    category: "Affiliate Marketing",
    tag: "AI Affiliate",
    emoji: "🔍",
    date: "15/01/2026",
    readTime: "6 phút đọc",
    tags: ["AI ứng dụng", "Affiliate Marketing", "Nghiên cứu sản phẩm"],
    ctaTitle: "Muốn áp dụng quy trình này vào hệ thống của bạn?",
    ctaDescription:
      "V-SOLO hướng dẫn chi tiết quy trình nghiên cứu sản phẩm bằng AI từ A đến Z, kèm thực hành trực tiếp trên ngách của bạn.",
    ctaLabel: "Xem chương trình V-SOLO →",
    ctaHref: "/portal/vdai-academy",
    content: [
      "Một trong những công việc tốn thời gian nhất khi làm Affiliate Marketing là nghiên cứu sản phẩm: tìm ngách phù hợp, đánh giá đối thủ, kiểm tra mức độ cạnh tranh và dự đoán khả năng chuyển đổi. Theo cách làm truyền thống, một người mới thường mất 3–5 giờ cho mỗi sản phẩm để có đủ dữ liệu ra quyết định. Với AI, quy trình này có thể rút ngắn xuống còn 20–30 phút mà độ chính xác không giảm — thậm chí còn tốt hơn vì AI xử lý được lượng dữ liệu lớn hơn con người.",
      "## 1. Dùng AI để lọc ngách trước khi đi sâu",
      "Thay vì lướt hàng chục sản phẩm một cách thủ công, bạn có thể mô tả thị trường mục tiêu và yêu cầu AI liệt kê các ngách phụ (sub-niche) đang có nhu cầu tăng, mức độ cạnh tranh thấp đến trung bình, và phù hợp với nguồn lực hiện tại của bạn. Một prompt hiệu quả thường có ba phần: đối tượng khách hàng, ngân sách/nguồn lực bạn có, và mục tiêu kết quả mong muốn.",
      "> 💡 Lưu ý: AI không \"biết\" dữ liệu thị trường theo thời gian thực. Hãy luôn đối chiếu gợi ý của AI với dữ liệu thực tế từ nền tảng bán hàng (lượng tìm kiếm, đánh giá, lịch sử bán) trước khi quyết định.",
      "## 2. Phân tích đối thủ nhanh hơn bằng cách tổng hợp dữ liệu",
      "Khi đã có vài sản phẩm tiềm năng, bước tiếp theo là xem đối thủ đang làm gì: họ định vị sản phẩm ra sao, dùng góc tiếp cận nào trong content, và điểm yếu nào trong trải nghiệm khách hàng mà bạn có thể khai thác. AI có thể giúp bạn tổng hợp và so sánh nhanh các mẫu content, từ đó rút ra mẫu số chung và những khoảng trống chưa ai khai thác.",
      "### Ba câu hỏi nên đặt ra cho AI khi phân tích đối thủ:",
      "- Đối thủ đang nhấn vào lợi ích nào nhiều nhất trong content của họ?\n- Có điểm đau (pain point) nào của khách hàng chưa được giải quyết tốt?\n- Định dạng content nào (video ngắn, review, so sánh...) đang được dùng nhiều nhất trong ngách này?",
      "## 3. Dự đoán khả năng chuyển đổi bằng dữ liệu định tính",
      "AI không thể đảm bảo doanh số, nhưng có thể giúp bạn đánh giá định tính: mức độ rõ ràng của lợi ích sản phẩm, độ tin cậy của thương hiệu, và sự phù hợp giữa sản phẩm với insight khách hàng mà bạn đã thu thập. Đây là bước giúp bạn loại bỏ sớm những sản phẩm có vẻ hấp dẫn nhưng thực chất khó bán.",
      "## Kết luận",
      "AI không thay thế hoàn toàn trực giác và kinh nghiệm của người làm Affiliate, nhưng nó là một công cụ khuếch đại tốc độ ra quyết định. Khi bạn biết cách đặt câu hỏi đúng, AI sẽ giúp bạn rút ngắn vòng lặp thử–sai và tập trung nguồn lực vào những sản phẩm có khả năng thành công cao nhất.",
    ],
  },
  {
    slug: "prompt-ai-viet-content-ban-hang",
    title: "5 prompt AI giúp viết content bán hàng nhanh gấp 3 lần",
    excerpt:
      "Không cần là copywriter chuyên nghiệp. Với 5 cấu trúc prompt này, bạn có thể tạo ra content quảng cáo, bài đăng và caption chuyển đổi cao trong vài phút.",
    category: "Prompt",
    tag: "Content AI",
    emoji: "✍️",
    date: "22/01/2026",
    readTime: "7 phút đọc",
    tags: ["Content AI", "Copywriting", "Prompt Engineering"],
    ctaTitle: "Muốn có bộ prompt đầy đủ cho từng loại content?",
    ctaDescription:
      "V-SOLO cung cấp thư viện prompt thực chiến cùng hướng dẫn tinh chỉnh theo từng ngách sản phẩm.",
    ctaLabel: "Xem chương trình V-SOLO →",
    ctaHref: "/portal/vdai-academy",
    content: [
      "Viết content bán hàng là việc lặp đi lặp lại mỗi ngày — và cũng là việc dễ \"cạn ý tưởng\" nhất. Thay vì ngồi nhìn màn hình trắng, bạn có thể dùng AI như một trợ lý viết draft đầu tiên, sau đó chỉnh sửa theo giọng văn của riêng mình. Dưới đây là 5 cấu trúc prompt đã được kiểm chứng hiệu quả trong thực tế.",
      "## 1. Prompt theo công thức AIDA",
      "AIDA (Attention – Interest – Desire – Action) là công thức copywriting kinh điển. Khi prompt AI, hãy yêu cầu rõ AI viết theo 4 bước này, kèm theo thông tin sản phẩm và đối tượng khách hàng cụ thể. Kết quả sẽ có cấu trúc rõ ràng, dễ chỉnh sửa hơn so với prompt mở.",
      "## 2. Prompt \"Vấn đề – Giải pháp – Bằng chứng\"",
      "Cấu trúc này đặc biệt hiệu quả với sản phẩm giải quyết một nỗi đau cụ thể. Yêu cầu AI mô tả vấn đề khách hàng đang gặp, giới thiệu sản phẩm như giải pháp, và chèn một bằng chứng (đánh giá, số liệu, hoặc trải nghiệm thực tế) để tăng độ tin cậy.",
      "## 3. Prompt theo góc nhìn người dùng thật",
      "Thay vì để AI viết ở giọng \"người bán\", hãy yêu cầu AI nhập vai một khách hàng đã dùng sản phẩm và chia sẻ trải nghiệm cá nhân. Content dạng này thường tạo cảm giác chân thực hơn và phù hợp với nền tảng mạng xã hội.",
      "> 💡 Mẹo: Luôn yêu cầu AI tạo 3–5 phương án khác nhau cho cùng một sản phẩm, sau đó chọn và kết hợp ý tốt nhất từ mỗi phương án — đừng dùng nguyên bản đầu tiên.",
      "## 4. Prompt rút gọn cho caption ngắn",
      "Với nền tảng như TikTok hay Instagram, content cần ngắn và bắt mắt trong 3 giây đầu. Hãy yêu cầu AI viết caption không quá 2 câu, có hook ở đầu và call-to-action rõ ràng ở cuối — tránh các đoạn diễn giải dài dòng.",
      "### Cấu trúc hook hiệu quả để đưa vào prompt:",
      "- Đặt câu hỏi gây tò mò (\"Bạn có biết...?\")\n- Đưa ra số liệu gây bất ngờ\n- Chỉ ra một sai lầm phổ biến mà khách hàng đang mắc phải",
      "## 5. Prompt viết theo bộ khung A/B testing",
      "Yêu cầu AI viết 2 phiên bản cùng nội dung nhưng khác giọng văn — một bản nghiêm túc, chuyên nghiệp và một bản gần gũi, hài hước. Sau đó thử nghiệm cả hai trên các bài đăng thật để xem phiên bản nào chuyển đổi tốt hơn với đúng tệp khách hàng của bạn.",
      "## Kết luận",
      "AI không viết hộ bạn toàn bộ chiến lược content, nhưng nó loại bỏ phần khó nhất: bắt đầu. Khi đã có draft chất lượng trong vài phút, bạn chỉ cần dành thời gian để chỉnh sửa giọng văn và đảm bảo content đúng với thương hiệu của mình.",
    ],
  },
  {
    slug: "chatbot-ai-cham-soc-khach-hang",
    title: "Tự động hoá chăm sóc khách hàng bằng Chatbot AI cho người mới",
    excerpt:
      "Hướng dẫn từng bước để dựng một chatbot AI trả lời khách hàng 24/7 mà không cần biết lập trình — áp dụng được ngay cho shop nhỏ và freelancer.",
    category: "Công cụ AI",
    tag: "Tự động hóa",
    emoji: "🤖",
    date: "03/02/2026",
    readTime: "8 phút đọc",
    tags: ["Tự động hóa", "Chatbot AI", "Chăm sóc khách hàng"],
    ctaTitle: "Muốn dựng chatbot AI cho shop của bạn?",
    ctaDescription:
      "V-SCALE hướng dẫn xây dựng hệ thống chatbot tích hợp đơn hàng, giúp đội nhóm vận hành tự động và hiệu quả hơn.",
    ctaLabel: "Xem chương trình V-SCALE →",
    ctaHref: "/portal/vdai-academy",
    content: [
      "Một trong những lý do khiến nhiều người bán hàng online \"burnout\" là phải trả lời cùng những câu hỏi lặp đi lặp lại: giá bao nhiêu, còn hàng không, ship mất bao lâu. Chatbot AI giải quyết đúng vấn đề này — và tin tốt là bạn không cần biết lập trình để dựng một chatbot cơ bản hoạt động hiệu quả.",
      "## 1. Xác định những câu hỏi chatbot cần trả lời",
      "Trước khi dựng chatbot, hãy liệt kê 15–20 câu hỏi khách hàng hỏi nhiều nhất trong 1 tháng qua. Đây chính là \"kịch bản gốc\" để huấn luyện chatbot. Phần lớn shop nhỏ sẽ thấy 80% câu hỏi lặp lại chỉ xoay quanh 5–6 chủ đề: giá, vận chuyển, đổi trả, tình trạng hàng, và cách thanh toán.",
      "## 2. Chọn nền tảng phù hợp với quy mô của bạn",
      "Với người mới, không cần đầu tư vào hệ thống phức tạp. Một chatbot AI tích hợp sẵn vào fanpage hoặc website, được huấn luyện bằng tài liệu sản phẩm và câu hỏi thường gặp, đã đủ để xử lý phần lớn tin nhắn tự động. Khi quy mô lớn hơn, bạn có thể nâng cấp lên hệ thống tích hợp với đơn hàng và CRM.",
      "> 💡 Lưu ý quan trọng: Luôn để khách hàng có lựa chọn chuyển sang nói chuyện với người thật khi cần. Chatbot tốt nhất là chatbot biết \"biết giới hạn của mình\".",
      "## 3. Huấn luyện chatbot bằng dữ liệu thật của bạn",
      "Chatbot AI hoạt động tốt nhất khi được \"nạp\" thông tin cụ thể về sản phẩm, chính sách và giọng văn thương hiệu của bạn — không phải thông tin chung. Hãy chuẩn bị một tài liệu ngắn gồm: mô tả sản phẩm, chính sách đổi trả, FAQ, và vài câu trả lời mẫu theo đúng tone giọng bạn muốn.",
      "### Cấu trúc tài liệu huấn luyện hiệu quả:",
      "- Thông tin sản phẩm: tên, giá, đặc điểm nổi bật\n- Chính sách: vận chuyển, đổi trả, bảo hành\n- Câu hỏi thường gặp kèm câu trả lời mẫu\n- Quy tắc khi nào cần chuyển sang nhân viên thật",
      "## 4. Kiểm thử trước khi đưa vào vận hành chính thức",
      "Trước khi public, hãy tự đóng vai khách hàng và thử hỏi chatbot 20–30 câu hỏi khác nhau, bao gồm cả những câu hỏi \"khó\" hoặc không có trong kịch bản. Đây là bước giúp bạn phát hiện điểm yếu trước khi khách hàng thực sự gặp phải.",
      "## 5. Theo dõi và cải thiện liên tục",
      "Sau khi chatbot hoạt động, định kỳ xem lại các cuộc trò chuyện mà chatbot trả lời chưa tốt hoặc khách hàng phải chuyển sang người thật. Đây là nguồn dữ liệu quý để cập nhật và cải thiện kịch bản huấn luyện theo thời gian.",
      "## Kết luận",
      "Chatbot AI không nhằm thay thế hoàn toàn con người trong chăm sóc khách hàng, mà giúp xử lý phần việc lặp lại để bạn dành thời gian cho những tương tác cần sự tinh tế của con người. Đây là một trong những bước tự động hóa đầu tiên và dễ triển khai nhất cho người mới bắt đầu với AI.",
    ],
  },
  {
    slug: "van-hanh-tinh-gon-nhan-ban-he-thong",
    title: "Vận hành tinh gọn, nhân bản mạnh mẽ: Xu hướng Affiliate 2026",
    excerpt:
      "AI đang thay đổi cách một cá nhân vận hành như cả một đội nhóm. Đây là những thay đổi quan trọng nhất trong cách làm Affiliate Marketing năm 2026.",
    category: "Affiliate Marketing",
    tag: "Hệ thống",
    emoji: "⚙️",
    date: "18/02/2026",
    readTime: "7 phút đọc",
    tags: ["Chiến lược", "Affiliate Marketing", "Hệ thống hóa"],
    ctaTitle: "Sẵn sàng xây hệ thống vận hành của riêng bạn?",
    ctaDescription:
      "V-SOLO và V-SCALE là hai lộ trình giúp bạn từ vận hành cá nhân đến nhân bản hệ thống cùng đội nhóm.",
    ctaLabel: "Khám phá lộ trình VO DUONG AI →",
    ctaHref: "/portal/vdai-academy",
    content: [
      "Trong nhiều năm, làm Affiliate Marketing đồng nghĩa với việc phải đánh đổi thời gian để có doanh thu: nhiều content hơn, nhiều sản phẩm hơn, nhiều giờ làm việc hơn. AI đang thay đổi phương trình đó. Một cá nhân với hệ thống đúng có thể vận hành ở quy mô mà trước đây cần cả một đội nhóm — đây chính là tinh thần \"vận hành tinh gọn, nhân bản mạnh mẽ\" mà VO DUONG AI Academy theo đuổi.",
      "## 1. Từ làm việc theo giờ sang làm việc theo hệ thống",
      "Thay vì đo hiệu suất bằng số giờ ngồi máy, người làm Affiliate hiện đại đo hiệu suất bằng chất lượng của hệ thống họ xây dựng: quy trình nghiên cứu sản phẩm, quy trình tạo content, quy trình chăm sóc khách hàng. Khi mỗi quy trình được tối ưu và một phần được AI hỗ trợ, tổng thời gian cần thiết giảm đáng kể mà sản lượng vẫn tăng.",
      "## 2. AI là đòn bẩy, không phải đối thủ",
      "Một lo ngại phổ biến là AI sẽ \"thay thế\" người làm Affiliate. Trên thực tế, AI hoạt động tốt nhất khi được điều khiển bởi một người hiểu rõ thị trường, khách hàng và mục tiêu kinh doanh. Người chiến thắng trong giai đoạn này không phải người dùng AI nhiều nhất, mà là người biết kết hợp AI với chiến lược đúng.",
      "> 💡 Quan sát thực tế: Những học viên VO DUONG AI có kết quả tốt nhất không phải là người chạy nhiều AI tool nhất, mà là người xây được một quy trình rõ ràng rồi mới đưa AI vào từng bước cụ thể.",
      "## 3. Từ một người làm tất cả đến hệ thống có thể nhân bản",
      "Khi đã vận hành tinh gọn với AI ở quy mô cá nhân, bước tiếp theo là nhân bản: chuyển giao một phần quy trình cho cộng tác viên hoặc đội nhóm nhỏ, với AI đóng vai trò chuẩn hóa cách làm. Đây là điểm khác biệt giữa V-SOLO (tối ưu vận hành cá nhân) và V-SCALE (nhân bản hệ thống cho đội nhóm).",
      "### Ba dấu hiệu cho thấy bạn đã sẵn sàng nhân bản hệ thống:",
      "- Quy trình làm việc của bạn đã được viết thành tài liệu rõ ràng, không chỉ nằm trong đầu\n- Bạn có thể đo lường kết quả ở từng bước, không chỉ kết quả cuối cùng\n- Bạn dành nhiều thời gian xử lý công việc lặp lại hơn là công việc tạo ra giá trị mới",
      "## 4. Xu hướng 2026: Cá nhân hóa ở quy mô lớn",
      "Khách hàng ngày càng kỳ vọng trải nghiệm cá nhân hóa, nhưng nguồn lực để làm điều đó thủ công là không đủ. AI cho phép một người hoặc một đội nhóm nhỏ cá nhân hóa content, tư vấn và chăm sóc khách hàng ở quy mô mà trước đây chỉ doanh nghiệp lớn mới làm được.",
      "## Kết luận",
      "Xu hướng rõ ràng nhất của Affiliate Marketing năm 2026 không phải là \"dùng AI nhiều hơn\", mà là xây dựng hệ thống đúng để AI phát huy hết giá trị. Vận hành tinh gọn không có nghĩa là làm ít hơn — mà là làm đúng việc, đúng lúc, với đòn bẩy phù hợp.",
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export type AdminBlogPostLike = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  status: "Draft" | "Published" | "Hidden";
  publishedAt: string;
  featured: boolean;
};

// Adapts a post created in /admin/blog (Supabase-backed, single markdown
// `content` string) to the BlogPost shape this page renders — admin posts
// don't have tag/emoji/readTime/CTA fields, so those get sensible defaults.
export function fromAdminPost(post: AdminBlogPostLike): BlogPost {
  const words = post.content.split(/\s+/).filter(Boolean).length;
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    tag: post.category,
    emoji: "📝",
    date: post.publishedAt,
    readTime: `${Math.max(1, Math.round(words / 200))} phút đọc`,
    tags: post.tags,
    ctaTitle: "Muốn áp dụng kiến thức này vào hệ thống của bạn?",
    ctaDescription: "Khám phá các khoá học và công cụ AI thực chiến tại VO DUONG AI.",
    ctaLabel: "Xem Portal →",
    ctaHref: "/portal",
    content: post.content.split("\n\n").filter(Boolean),
  };
}
