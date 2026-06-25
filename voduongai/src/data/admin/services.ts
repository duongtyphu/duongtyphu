export type AdminService = {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaType: "email" | "link";
  ctaValue: string;
  order: number;
  status: "Draft" | "Published" | "Hidden";
};

export const servicesSeed: AdminService[] = [
  {
    id: "service_1",
    title: "Tư vấn 1:1 với Võ Đương AI",
    description: "Tư vấn riêng để xây lộ trình AI và Affiliate phù hợp với hoàn cảnh, nguồn lực của bạn.",
    ctaLabel: "Liên hệ tư vấn",
    ctaType: "email",
    ctaValue: "",
    order: 1,
    status: "Published",
  },
];
