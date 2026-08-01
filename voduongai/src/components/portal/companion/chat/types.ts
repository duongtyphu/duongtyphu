export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  /** Optimistic — chưa được server xác nhận. */
  pending?: boolean;
  /** EPIC-UX-002 fix — Next Step Card CHỈ render khi có dữ liệu thật ở đây.
      Runtime/response schema hiện tại KHÔNG trả field này (chưa sửa) nên
      luôn `undefined` trong production — Next Step Card ẩn hoàn toàn, đúng
      trạng thái trung thực "chưa có dữ liệu bước tiếp theo", không phải mock. */
  nextSteps?: string[];
};
