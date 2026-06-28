export type ConnectPillar = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: "users" | "user-check" | "calendar" | "award" | "handshake" | "share";
};

export const connectPillars: ConnectPillar[] = [
  {
    id: "cp1",
    title: "Cộng đồng",
    description: "Kết nối với những người cùng học, cùng làm và cùng phát triển.",
    href: "/portal/community",
    icon: "users",
  },
  {
    id: "cp2",
    title: "Mentor",
    description: "Nhận định hướng từ người đi trước và AI Coach.",
    href: "/portal/ai-assistant",
    icon: "user-check",
  },
  {
    id: "cp3",
    title: "Sự kiện",
    description: "Tham gia webinar, workshop, livestream và offline.",
    href: "/portal/updates",
    icon: "calendar",
  },
  {
    id: "cp4",
    title: "Thành tựu",
    description: "Ghi nhận sự trưởng thành và những cột mốc của từng thành viên.",
    href: "/portal/achievements",
    icon: "award",
  },
  {
    id: "cp5",
    title: "Cơ hội",
    description: "Khám phá cơ hội học tập, hợp tác, affiliate, dự án và phát triển nghề nghiệp.",
    href: "/portal/opportunities",
    icon: "handshake",
  },
  {
    id: "cp6",
    title: "Đóng góp",
    description: "Chia sẻ tri thức, kinh nghiệm và hỗ trợ cộng đồng cùng trưởng thành.",
    href: "/portal/community",
    icon: "share",
  },
];

export type ConnectModule = {
  id: string;
  label: string;
  description: string;
  href?: string;
};

export const communityHubModules: ConnectModule[] = [
  { id: "ch1", label: "Facebook Community", description: "Nhóm cộng đồng chính thức của VO DUONG AI.", href: "/portal/community" },
  { id: "ch2", label: "Telegram / Zalo / Discord", description: "Kênh trao đổi nhanh, hỏi đáp theo thời gian thực." },
  { id: "ch3", label: "Thành viên nổi bật", description: "Những thành viên đang tạo cảm hứng cho cộng đồng." },
  { id: "ch4", label: "Bài chia sẻ cộng đồng", description: "Câu chuyện và kinh nghiệm thực chiến từ thành viên." },
  { id: "ch5", label: "Câu hỏi & hỗ trợ", description: "Đặt câu hỏi và nhận hỗ trợ từ cộng đồng.", href: "/portal/support" },
  { id: "ch6", label: "Nhóm theo chủ đề", description: "Tham gia nhóm nhỏ theo đúng mục tiêu của bạn." },
];

export const eventWebinarModules: ConnectModule[] = [
  { id: "ew1", label: "Webinar sắp tới", description: "Buổi chia sẻ trực tiếp cùng chuyên gia." },
  { id: "ew2", label: "Workshop", description: "Thực hành chuyên sâu theo từng chủ đề." },
  { id: "ew3", label: "Livestream", description: "Tương tác trực tiếp, hỏi đáp theo thời gian thực." },
  { id: "ew4", label: "Offline / Meetup", description: "Gặp gỡ trực tiếp những người cùng hành trình." },
  { id: "ew5", label: "Replay", description: "Xem lại các buổi chia sẻ đã diễn ra.", href: "/portal/updates" },
  { id: "ew6", label: "Lịch sự kiện", description: "Toàn bộ lịch sự kiện sắp tới của hệ sinh thái." },
];

export const achievementLeaderboardModules: ConnectModule[] = [
  { id: "al1", label: "Thành tựu học viên", description: "Những cột mốc đáng tự hào của thành viên.", href: "/portal/achievements" },
  { id: "al2", label: "Success Stories", description: "Hành trình tỏa sáng của các học viên.", href: "/portal/student-success" },
  { id: "al3", label: "Đóng góp nổi bật", description: "Những câu chuyện đóng góp được cộng đồng đón nhận." },
  { id: "al5", label: "Chứng nhận", description: "Chứng nhận hoàn thành các chặng quan trọng — và những phẩm chất được cộng đồng nhận ra ở bạn." },
  { id: "al6", label: "Đóng góp đáng ghi nhận", description: "Những đóng góp có ý nghĩa, được cộng đồng phản hồi tích cực." },
];

export const opportunityNetworkModules: ConnectModule[] = [
  { id: "on1", label: "Affiliate Partner", description: "Trở thành đối tác giới thiệu của VO DUONG AI.", href: "/portal/referral" },
  { id: "on2", label: "Dự án cộng đồng", description: "Tham gia các dự án do cộng đồng cùng xây.", href: "/portal/opportunities" },
  { id: "on3", label: "Cơ hội hợp tác", description: "Kết nối hợp tác cùng những thành viên khác." },
  { id: "on4", label: "Premium Community", description: "Không gian dành riêng cho thành viên Premium.", href: "/portal/premium" },
  { id: "on5", label: "Mentor Group", description: "Nhóm nhỏ được đồng hành sát sao hơn." },
  { id: "on6", label: "Partner Network", description: "Mạng lưới đối tác cùng phát triển với VO DUONG AI." },
];

export const contributionZoneModules: ConnectModule[] = [
  { id: "cz1", label: "Chia sẻ bài học", description: "Lan tỏa điều bạn vừa học được tới người khác." },
  { id: "cz2", label: "Đóng góp Prompt", description: "Gửi prompt hữu ích cho thư viện chung.", href: "/portal/prompts" },
  { id: "cz3", label: "Đóng góp Workflow", description: "Chia sẻ quy trình bạn đã kiểm chứng hiệu quả." },
  { id: "cz4", label: "Gửi Case Study", description: "Kể lại câu chuyện thực chiến của riêng bạn.", href: "/portal/case-studies" },
  { id: "cz5", label: "Góp ý sản phẩm", description: "Đóng góp ý kiến giúp VO DUONG AI tốt hơn.", href: "/portal/support" },
  { id: "cz6", label: "Giúp đỡ thành viên mới", description: "Đồng hành cùng những người mới bắt đầu." },
];

export type AiConnectTip = {
  message: string;
  href: string;
  cta: string;
};

export const aiConnectTip: AiConnectTip = {
  message:
    "Dựa trên hành trình hiện tại, bạn nên chia sẻ một ghi chú học tập, tham gia một thử thách cộng đồng và kết nối với ít nhất một người đang cùng mục tiêu.",
  href: "/portal/ai-assistant",
  cta: "Hỏi AI Connect Coach",
};

export type ConnectProgressDimension = {
  id: string;
  label: string;
  percent: number;
};

export const connectProgress: ConnectProgressDimension[] = [
  { id: "community", label: "Community", percent: 20 },
  { id: "contribution", label: "Contribution", percent: 8 },
  { id: "collaboration", label: "Collaboration", percent: 5 },
  { id: "recognition", label: "Recognition", percent: 12 },
  { id: "impact", label: "Impact", percent: 6 },
];

export type HumanNetwork = {
  title: string;
  description: string;
  href: string;
  cta: string;
};

export const humanNetwork: HumanNetwork = {
  title: "Mạng lưới những viên ngọc",
  description:
    "Mỗi thành viên trong VO DUONG AI là một viên ngọc đang được mài giũa. Khi những viên ngọc kết nối với nhau, chúng ta tạo nên một hệ sinh thái tri thức, hành động và di sản.",
  href: "/portal/community",
  cta: "Khám phá cộng đồng",
};
