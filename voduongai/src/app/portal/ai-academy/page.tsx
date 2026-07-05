import { redirect } from "next/navigation";

/**
 * Academy Reset — Product Decision: gỡ bỏ toàn bộ Course/Lesson/Video Course
 * UI và demo data cũ. Route giữ nguyên (không 404), chuyển hướng vào
 * Academy Operating System mới tại /portal/hocvienai.
 */
export default function AiAcademyPage() {
  redirect("/portal/hocvienai");
}
