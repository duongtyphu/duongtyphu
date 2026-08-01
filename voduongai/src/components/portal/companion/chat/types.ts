export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  /** Optimistic — chưa được server xác nhận. */
  pending?: boolean;
};
