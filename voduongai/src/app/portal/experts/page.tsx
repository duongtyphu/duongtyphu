import { redirect } from "next/navigation";

// Community Campus Reconstruction — /portal/student-success (đích cũ) đã
// archive vì chứa câu chuyện học viên bịa, không có ảnh/xác thực thật.
// Trỏ thẳng về Community — nơi có khối "Community Stories" thật, dùng
// empty state trung thực cho tới khi có câu chuyện thật đầu tiên.
export default function ExpertsRedirect() {
  redirect("/portal/congdongai");
}
