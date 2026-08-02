/**
 * Sprint CS-04 — Credential Architecture (Foundation).
 *
 * THUẦN KIẾN TRÚC/TÀI LIỆU — mọi hằng số ở đây chỉ mô tả KHÁI NIỆM
 * ("Credential" — thuật ngữ chuẩn hoá thay cho "API Key" trong toàn bộ
 * lớp Credential mới này), KHÔNG chứa secret, KHÔNG đọc `process.env`,
 * KHÔNG import bất kỳ Adapter/`registry.ts`/`provider-manager.ts`/
 * `model-router.ts` nào — hoàn toàn tách biệt khỏi Runtime thật, đúng
 * "Chỉ hiển thị. Không implement." của đề bài.
 *
 * Không phải "server-only" — không có gì nhạy cảm ở đây (giống
 * `manifest.ts` của CS-03: thuần dữ liệu tĩnh mô tả).
 */

export type CredentialSourceType = "environment" | "database" | "secret-manager" | "local-runtime" | "disabled";

export type CredentialSourceDescriptor = {
  id: CredentialSourceType;
  label: string;
  description: string;
};

/** 5 nguồn Credential CÓ THỂ có trong tương lai — mô tả khái niệm, KHÔNG
    kết nối/kiểm tra nguồn nào thật. */
export const CREDENTIAL_SOURCES: CredentialSourceDescriptor[] = [
  { id: "environment", label: "Environment", description: "Biến môi trường (vd Vercel) — cách duy nhất đang chạy thật hôm nay (CS-01/CS-02/CS-03)." },
  { id: "database", label: "Database", description: "Lưu trong Supabase, mã hoá tại chỗ — CHƯA tồn tại, là mục tiêu 1 Sprint sau (CS-05+)." },
  { id: "secret-manager", label: "Secret Manager", description: "Dịch vụ quản lý secret chuyên dụng bên ngoài (vd Vercel Env Encryption/1Password/AWS Secrets Manager) — CHƯA tích hợp." },
  { id: "local-runtime", label: "Local Runtime", description: "Provider chạy local (vd Ollama — Base URL, không phải API key thật)." },
  { id: "disabled", label: "Disabled", description: "Không có nguồn nào cấu hình — Provider tắt hẳn, không thử gọi." },
];

/**
 * Thứ tự ưu tiên resolve Credential — CHỈ HIỂN THỊ, hoàn toàn CHƯA
 * implement (không có hàm `resolveCredential()` nào ở Sprint này, không
 * đổi hành vi `selectAdapter()`/`ProviderManager` — cả 2 vẫn đọc thẳng
 * `process.env` như cũ, y hệt Runtime hiện tại).
 */
export const CREDENTIAL_RESOLUTION_ORDER: CredentialSourceType[] = [
  "environment",
  "database",
  "secret-manager",
  "local-runtime",
  "disabled",
];

export type CredentialStatus = "available" | "missing" | "disabled" | "unknown";

export type CredentialStatusDescriptor = {
  id: CredentialStatus;
  label: string;
  description: string;
};

/** 4 trạng thái Credential CÓ THỂ có — mô tả khái niệm, KHÔNG đọc secret/
    ENV thật để tính trạng thái này (khác Provider Health ở CS-01/CS-02/
    CS-03 — Health vẫn là nguồn sự thật duy nhất cho trạng thái THẬT). */
export const CREDENTIAL_STATUSES: CredentialStatusDescriptor[] = [
  { id: "available", label: "Available", description: "Có Credential hợp lệ từ 1 nguồn trong Resolution Order." },
  { id: "missing", label: "Missing", description: "Không tìm thấy Credential ở bất kỳ nguồn nào đã bật." },
  { id: "disabled", label: "Disabled", description: "Provider bị tắt thủ công — không tìm Credential dù có hay không." },
  { id: "unknown", label: "Unknown", description: "Chưa xác định được — trạng thái mặc định của Sprint Foundation này." },
];

export type CredentialAuthenticationType = "api-key" | "base-url" | "none" | "unknown";

export type CredentialMetadataFieldDescriptor = {
  field: string;
  label: string;
  description: string;
};

/** 4 field Metadata CÓ THỂ gắn với 1 Credential — chỉ mô tả Ý NGHĨA từng
    field, KHÔNG có giá trị thật nào (mọi ví dụ trong UI đều đánh dấu rõ
    "minh hoạ", không gắn với Provider thật nào). */
export const CREDENTIAL_METADATA_FIELDS: CredentialMetadataFieldDescriptor[] = [
  { field: "authenticationType", label: "Authentication Type", description: "Kiểu xác thực Provider cần — api-key / base-url / none." },
  { field: "credentialSource", label: "Credential Source", description: "Credential đang đến từ nguồn nào trong 5 nguồn ở trên." },
  { field: "lastUpdated", label: "Last Updated", description: "Lần gần nhất Credential được thiết lập/thay đổi." },
  { field: "managedBy", label: "Managed By", description: "Ai/hệ thống nào đang quản lý Credential này (Founder/PMO/tự động)." },
];
