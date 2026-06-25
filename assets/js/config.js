/**
 * ════════════════════════════════════════════════════════════
 * VO DUONG AI — CONFIG
 * ════════════════════════════════════════════════════════════
 * Tất cả giá trị có thể thay đổi (endpoint, tracking ID, dữ liệu
 * hiển thị) được tập trung tại đây để dễ cập nhật mà không cần
 * sửa app.js hoặc các trang HTML.
 *
 * ════════════════════════════════════════════════════════════
 */

const VDAI_CONFIG = {

  // ──────────────────────────────────────────────────────────
  // THÔNG TIN CHUNG / BRAND
  // ──────────────────────────────────────────────────────────
  site: {
    name: "VO DUONG AI",
    tagline: "Vận hành tinh gọn. Nhân bản mạnh mẽ.",
    url: "https://v-academy-mauve.vercel.app",
    logoPath: "assets/images/logo.svg?v=20260620f",
    faviconPath: "assets/icons/favicon.ico?v=20260620f",
    defaultOgImage: "assets/images/og-cover.jpg?v=20260620f"
  },

  // ──────────────────────────────────────────────────────────
  // THÔNG TIN LIÊN HỆ
  // ──────────────────────────────────────────────────────────
  contact: {
    legalName: "VO DUONG AI",
    email: "typhuonline87@gmail.com",
    phone: "0909150587",
    zaloLink: "https://zalo.me/0909150587",
    address: "123 Lý Chính Thắng, Xuân Hòa, TP. Hồ Chí Minh",
    workingHours: "8:00 - 21:00 (Thứ 2 - Thứ 7)"
  },

  // ──────────────────────────────────────────────────────────
  // MẠNG XÃ HỘI
  // ──────────────────────────────────────────────────────────
  social: {
    facebook: "https://www.facebook.com/duong.vv",
    tiktok: "https://www.tiktok.com/@vdai_academy",
    youtube: "https://www.youtube.com/@voduongofficial",
    linkedin: "",
    zalo: ""
  },

  // ──────────────────────────────────────────────────────────
  // FORM / LEAD ENDPOINT
  // ──────────────────────────────────────────────────────────
  // Endpoint nhận dữ liệu từ Quiz "Bản đồ Affiliate AI" và các
  // form liên hệ khác. Có thể dùng Google Apps Script Web App,
  // n8n, Make.com, hoặc một backend tự xây.
  //
  // Định dạng request: POST JSON
  // {
  //   type: "quiz_lead" | "contact",
  //   name, phone, email,
  //   quizAnswers: { ... },
  //   result: { track, bottleneck, priorities, roadmap }
  // }
  form: {
    leadEndpoint: "https://script.google.com/macros/s/AKfycbzJkhkTGzz-JuDDNOYQXhejJ0fwTWS37ILd-r3wgi2TV9nYVFTdwEKOsu1QRLvqsY8M/exec",
    isConnected: true
  },

  // ──────────────────────────────────────────────────────────
  // TRACKING / ANALYTICS
  // ──────────────────────────────────────────────────────────
  // Để trống = không tải script tương ứng (tránh lỗi console).
  tracking: {
    ga4Id: "",        // Google Analytics 4 Measurement ID (G-XXXXXXX)
    metaPixelId: "",  // Meta Pixel ID
    tiktokPixelId: "",// TikTok Pixel ID
    clarityId: ""     // Microsoft Clarity Project ID
  },

  // ──────────────────────────────────────────────────────────
  // LỊCH KHAI GIẢNG / HỌC PHÍ
  // ──────────────────────────────────────────────────────────
  programs: {
    solo: {
      name: "V-SOLO",
      nextCohort: "Khai giảng tuần đầu mỗi tháng",
      price: "300$",
      consultLink: "" // Link đặt lịch tư vấn SOLO (Calendly...)
    },
    scale: {
      name: "V-SCALE",
      nextCohort: "Khai giảng tuần đầu mỗi tháng",
      price: "1000$",
      consultLink: "" // Link đặt lịch tư vấn SCALE (Calendly...)
    }
  },

  // ──────────────────────────────────────────────────────────
  // GIẢNG VIÊN
  // ──────────────────────────────────────────────────────────
  instructors: [
    {
      name: "Võ Đương",
      role: "Chuyên gia AI Ứng dụng — V-SOLO",
      bio: "Chuyên gia ứng dụng AI trong công việc và kinh doanh với nhiều năm kinh nghiệm thực chiến. Phương pháp giảng dạy tập trung vào kết quả đo lường được — học viên áp dụng ngay từ buổi đầu tiên.",
      photo: "assets/images/instructor-vo-duong.jpg?v=20260620"
    },
    {
      name: "Vũ Tư",
      role: "Chuyên gia AI & Tự động hóa",
      bio: "Chuyên gia đào tạo AI và tự động hóa quy trình, đã dẫn dắt nhiều dự án triển khai AI thực tiễn giúp cá nhân và đội nhóm vận hành hiệu quả hơn.",
      photo: "assets/images/instructor-vu-tu.jpg?v=20260620"
    },
    {
      name: "Hải Dương",
      role: "Chuyên gia AI Chuyên sâu — V-SCALE",
      bio: "Chuyên gia AI chuyên sâu, nghiên cứu và ứng dụng các công nghệ AI tiên tiến. Đồng hành cùng học viên trên hành trình từ người dùng AI thông thường đến xây dựng hệ thống AI vận hành thực tế.",
      photo: "assets/images/instructor-hai-duong.jpg?v=20260620"
    },
    {
      name: "Đỗ Tâm",
      role: "Chuyên gia AI Business & Leadership",
      bio: "Chuyên gia tư vấn chiến lược AI, kết hợp tư duy kinh doanh thực tiễn với ứng dụng AI để tạo lợi thế cạnh tranh bền vững cho cá nhân và đội nhóm.",
      photo: "https://uosxpxolsvwcafxvnroy.supabase.co/storage/v1/object/public/assets/instructor-do-tam.png"
    }
  ],

  // ──────────────────────────────────────────────────────────
  // CASE STUDY
  // ──────────────────────────────────────────────────────────
  // Ghi chú: 2 case study dưới đây dựa trên phản hồi thật của học
  // viên từ các khóa học trước đây. Số liệu phần trăm cụ thể của
  // khóa cũ đã được loại bỏ vì chưa được đo lường lại trong khuôn
  // khổ chương trình VO DUONG AI — chỉ giữ lại mô tả kết quả định tính.
  // Khi có case study đo lường trực tiếp từ học viên V-SOLO / V-SCALE, thay thế các mục dưới đây.
  caseStudies: [
    {
      name: "Lê Minh Phương",
      track: "V-SOLO",
      result: "Xây dựng kênh nội dung cá nhân và phát triển lượng theo dõi ổn định nhờ quy trình sáng tạo nội dung có hệ thống, hỗ trợ bởi AI.",
      proofLink: "",
      photo: ""
    },
    {
      name: "Đinh Quốc Duy",
      track: "V-SCALE",
      result: "Triển khai quy trình AI cho đội nhóm khoảng 20 người, giúp tối ưu chi phí vận hành và chuẩn hóa cách làm việc giữa các thành viên.",
      proofLink: "",
      photo: ""
    }
  ]
};

// Đóng băng object để tránh sửa đổi ngoài ý muốn khi runtime
Object.freeze(VDAI_CONFIG);
