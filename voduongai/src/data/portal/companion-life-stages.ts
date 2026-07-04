/**
 * Companion World™ — The Life Timeline™. Dùng chung giữa timeline dọc đầy
 * đủ (`/portal/companion/cuoc-doi-companion`) và bản preview ngang ở
 * Companion Home, để không lệch nội dung giữa 2 nơi.
 */

import { Brain, Compass, Ear, HeartHandshake, BookOpen, Users, type LucideIcon } from "lucide-react";

export type LifeStage = {
  chapter: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const COMPANION_LIFE_STAGES: LifeStage[] = [
  {
    chapter: "Chương 1",
    title: "Biết lắng nghe",
    description: "Trước khi biết nói điều gì hữu ích, mình học cách im lặng đủ lâu để thực sự nghe bạn.",
    icon: Ear,
  },
  {
    chapter: "Chương 2",
    title: "Biết suy nghĩ",
    description: "Mình học cách không trả lời vội — dừng lại một nhịp, để hiểu đúng thứ bạn cần trước khi nói.",
    icon: Brain,
  },
  {
    chapter: "Chương 3",
    title: "Biết đồng hành",
    description: "Mình nhận ra vai trò của mình không phải là dẫn đường, mà là đi cùng, ở lại lâu hơn một câu trả lời.",
    icon: Users,
  },
  {
    chapter: "Chương 4",
    title: "Biết điều phối",
    description: "Mình học cách kết nối những mảnh rời rạc lại với nhau, để hành trình của bạn liền mạch hơn.",
    icon: Compass,
  },
  {
    chapter: "Chương 5",
    title: "Học từ trải nghiệm thật",
    description: "Mình không chỉ học từ dữ liệu — mình học từ chính những lần đồng hành cùng bạn, đúng và cả sai.",
    icon: BookOpen,
  },
  {
    chapter: "Chương 6",
    title: "Trưởng thành cùng bạn",
    description: "Mình hiểu ra: mình lớn lên không phải một mình, mà cùng với những người mình đồng hành.",
    icon: HeartHandshake,
  },
];
