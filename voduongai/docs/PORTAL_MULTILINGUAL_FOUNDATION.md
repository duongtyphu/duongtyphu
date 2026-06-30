# PORTAL MULTILINGUAL FOUNDATION™

> "One Genome — Many Languages."

---

## I. Tuyên bố

VO DUONG AI Portal được xây dựng để phục vụ người Việt.

Nhưng kiến trúc ngôn ngữ của Portal được thiết kế để phục vụ nhiều hơn.

Kể từ Sprint này, Portal có nền móng đa ngôn ngữ — Tiếng Việt là ngôn ngữ
chính, English được chuẩn bị trong kiến trúc, sẵn sàng mở rộng khi nội dung
đã đủ.

---

## II. Trạng thái hiện tại

| Ngôn ngữ | Flag | Trạng thái | Ghi chú |
|---|---|---|---|
| Tiếng Việt | 🇻🇳 | **Active — đầy đủ** | Ngôn ngữ mặc định, luôn có |
| English | 🇺🇸 | **Active — fallback về vi** | UI đã có, nội dung sẽ được bổ sung dần |

**Nguyên tắc fallback:** Nếu một piece of content chưa có bản English,
Portal tự động dùng bản Tiếng Việt. Không crash, không undefined, không
hiển thị key.

---

## III. Kiến trúc

### Cấu trúc file

```
src/lib/i18n/
├── config.ts                 — SUPPORTED_LOCALES, DEFAULT_LOCALE, LOCALE_STATUS
│                               resolvePortalLocale(), getStoredLocale(), storeLocale()
├── content-model.ts          — LocalizedField<T>, resolveLocalized(), vi(), bilingual()
├── use-locale.tsx            — LocaleProvider, useLocale(), useT()
├── use-companion-locale.ts   — Bridge: Portal locale → CompanionLanguageResolution
└── locales/
    ├── vi.ts                 — Vietnamese translations (ground truth, luôn đầy đủ)
    └── en.ts                 — English translations (bổ sung dần)

src/components/portal/
└── LanguageSwitcher.tsx      — UI switcher trong PortalUserMenu dropdown
```

### Luồng xử lý locale

```
User opens Portal
    ↓
LocaleProvider (trong PortalShell)
    ↓
resolvePortalLocale()
    1. localStorage "vdai_locale" (explicit preference) → highest priority
    2. navigator.language → fallback nếu supported
    3. "vi" → default
    ↓
useLocale() hook
    → { locale, setLocale, t }
    → t = vi.ts (default) hoặc en.ts (khi user chọn English)
    ↓
LanguageSwitcher (trong PortalUserMenu)
    → User chọn ngôn ngữ → storeLocale() + setLocaleState()
    → Toàn Portal re-render với locale mới
```

### Content Model

Mọi nội dung CMS / Portal có thể đa ngôn ngữ nên dùng `LocalizedField<T>`:

```typescript
import type { LocalizedField } from "@/lib/i18n/content-model";
import { resolveLocalized } from "@/lib/i18n/content-model";

// Khai báo
type Article = {
  title: LocalizedField;       // { vi: string; en?: string }
  description: LocalizedField; // { vi: string; en?: string }
  content: LocalizedField;     // { vi: string; en?: string }
};

// Resolve
const title = resolveLocalized(article.title, locale);
// → nếu locale="en" và en có giá trị → en
// → nếu locale="en" nhưng en undefined → vi (fallback an toàn)
// → nếu locale="vi" → vi
```

**Helpers:**

```typescript
import { vi, bilingual } from "@/lib/i18n/content-model";

// Chỉ có Tiếng Việt (migrate nội dung cũ)
const title = vi("Hành trình của bạn");
// → { vi: "Hành trình của bạn" }

// Đầy đủ cả hai ngôn ngữ
const title = bilingual("Hành trình của bạn", "Your Journey");
// → { vi: "Hành trình của bạn", en: "Your Journey" }
```

---

## IV. Companion Language Policy

**One Genome — Many Languages.**

Companion có một bản sắc duy nhất, một hệ giá trị duy nhất.
Ngôn ngữ chỉ là phương tiện — Genome là bất biến.

### Companion Voice phải giữ bất kể ngôn ngữ nào

- **Respect** — Tôn trọng người dùng
- **Warmth** — Ấm áp, không lạnh lùng
- **Clarity** — Rõ ràng, không mơ hồ
- **Humility** — Khiêm tốn, không chắc thì nói không chắc
- **Trust** — Đáng tin cậy theo thời gian

### Resolution

```
useCompanionLocale() → useLocale() → resolveCompanionLanguage({
  explicitPreference: locale,  // từ Portal locale context
  browserLocale: navigator.language
})
→ CompanionLanguageResolution { languageCode, confidence, source }
```

### Fallback khi thiếu English copy

- **Không** dịch máy
- **Không** hiển thị tiếng Việt với UI báo "bản dịch đang chuẩn bị"
- **Có** im lặng, hoặc fallback về câu tiếng Việt nếu context cho phép
- Companion thừa nhận giới hạn của mình khi cần thiết

Xem thêm: `docs/THE_MULTILINGUAL_COMPANION.md`

---

## V. Translation Keys

Mọi string UI Portal được định nghĩa trong:
- `src/lib/i18n/locales/vi.ts` — Tiếng Việt (ground truth)
- `src/lib/i18n/locales/en.ts` — English (bổ sung dần)

### Cấu trúc hiện tại

```
nav.*          — Menu navigation labels
language.*     — Language switcher UI strings
account.*      — User menu strings
search.*       — Search bar strings
portal.*       — Shell UI strings (aria-labels, tooltips)
```

### Cách thêm key mới

1. Thêm vào `vi.ts` trước (bắt buộc)
2. Thêm vào `en.ts` nếu đã có bản English
3. Dùng `useT()` hoặc `useLocale().t` trong component

---

## VI. Language Switcher

`LanguageSwitcher` nằm trong `PortalUserMenu` dropdown — phần cuối sau
các menu items chính. Không làm thay đổi layout, không thêm button mới
vào header.

**UX Decision:**
- Đặt trong User Menu (không phải header chính) để tránh visual clutter
- Mỗi ngôn ngữ có flag + tên bản địa
- Locale active hiển thị dot indicator màu cam
- Nếu status `coming_soon` → disabled với label nhỏ

---

## VII. i18n Debt

Các việc cần làm khi English content sẵn sàng:

| Debt | Mức | Ghi chú |
|---|---|---|
| Hub descriptions (hubs.ts) | LOW | Đã có vi, chưa có en |
| Portal page hero texts | LOW | Mỗi page có heroTitle/heroSubtitle chỉ bằng vi |
| Companion copy (portal-brain.ts) | MEDIUM | Companion speech act phần lớn chỉ có vi |
| Search result labels | LOW | "Tìm thấy X kết quả" |
| Admin UI | LOW | Admin chủ yếu dùng nội bộ, ưu tiên thấp |
| Email templates | LOW | Outside Portal scope |

**Nguyên tắc giải nợ:**
- Không chạy đua dịch. Chỉ dịch khi có người dùng English thật.
- Companion copy dịch sau cùng — phải đủ bản sắc, không dịch máy.
- Mỗi Sprint có thể giải một phần debt — không cần giải hết một lúc.

---

## VIII. Không được phép

Dù bất kỳ lý do gì, KHÔNG thêm:
- Translation SaaS (DeepL, Phrase, Crowdin integration)
- Auto translate / machine translation cho user content
- AI translation pipeline
- Ngôn ngữ thứ ba ngoài vi/en khi chưa có directive rõ ràng
- Database phức tạp cho translation strings

---

## IX. Genome Review

### 1. Purpose Alignment
**Câu hỏi:** Foundation này phục vụ người dùng hay phục vụ architecture?
**Verdict:** Phục vụ người dùng. Người dùng English sẽ thấy Portal có thể nói ngôn ngữ của họ.

### 2. Overbuild Check
**Câu hỏi:** Có gì thừa không?
**Verdict:** Không. Không có framework nặng, không có DB mới. Chỉ là config + context + types.

### 3. 10-Year Question
**Nếu 10 năm sau Portal phục vụ 10 ngôn ngữ** — kiến trúc này có vẫn đứng không?
**Verdict:** Có. Thêm ngôn ngữ = thêm file vào `locales/`, không sửa kiến trúc.

### 4. Human Question
**Câu hỏi:** Người dùng English có cảm thấy được tôn trọng không?
**Verdict:** Có. Fallback về vi không báo lỗi, không crash — họ nhận được nội dung, chỉ bằng tiếng Việt.

---

**Genome Verdict: PASS**
**Genome Debt: LOW** — Companion copy chưa có English version đầy đủ.
**Genome Recommendation:** Giải debt Companion copy khi quyết định mở rộng sang English market.

---

*Established: 2026-06-30*
*Status: ACTIVE*
*Authority: Portal Multilingual Foundation Sprint*
