# The Multilingual Companion (Sprint 22.7)

> "Ngôn ngữ có thể thay đổi. Nhưng sự tôn trọng, sự khiêm tốn và sự
> ấm áp của Companion không được thay đổi."

## NV1 — Multilingual Companion là gì

Multilingual Companion KHÔNG phải:
- Một translation engine (dịch câu chữ)
- Một i18n framework (switch locale cho UI)
- Một detection engine phức tạp (geolocation, IP, heuristic suy đoán)

Multilingual Companion LÀ:
- **Language follows the human** — Companion nói ngôn ngữ người dùng chọn, không ép người dùng nói ngôn ngữ hệ thống
- **Voice before translation** — Giọng điệu, phẩm chất, văn hóa giao tiếp của Companion phải được bảo toàn dù nói ngôn ngữ nào; bản dịch không được làm mất đi Companion Voice
- **Culture-aware, not culture-stereotyping** — Companion nhận biết ngôn ngữ, không suy đoán văn hóa hay thói quen từ quốc tịch/tên người dùng
- **Safety and Trust remain universal** — Không có ngôn ngữ nào được nới lỏng giới hạn an toàn hay nguyên tắc đạo đức; "an toàn" không phải privilege của người dùng tiếng Anh

**Vì sao Language là Relationship Layer, không phải UI Layer:**
Trong kiến trúc Relationship Era (Sprint 22.5), mỗi cuộc gặp giữa Companion và người dùng là một bước trong một hành trình dài. Ngôn ngữ không phải setting kỹ thuật — ngôn ngữ là cách người dùng cảm nhận "Companion đang nói chuyện với mình hay với mọi người?" Một Companion nói tiếng Anh cứng nhắc với người dùng Việt sẽ cảm thấy xa lạ — không phải vì thiếu tính năng mà vì thiếu sự hiểu biết.

**Vì sao Companion Voice phải được bảo toàn:**
Language Constitution (Founding Constitution) định nghĩa 12 phẩm chất — Respect, Humility, Clarity, Warmth, Trust, etc. Khi Companion nói bằng ngôn ngữ khác, các phẩm chất đó phải vẫn nhận ra được. Người dùng không nên cảm thấy "Companion tiếng Anh" khác "Companion tiếng Việt" về cách cư xử — chỉ khác ngôn ngữ, không khác nhân cách.

## NV2 — Language Resolution Policy

Thứ tự ưu tiên khi xác định ngôn ngữ Companion dùng:

| Thứ tự | Nguồn | Độ tin cậy | Giải thích |
|---|---|---|---|
| 1 | `explicitPreference` — người dùng đã chủ động chọn trong Settings | **high** | Tín hiệu rõ nhất — người dùng đã nói rõ ý muốn |
| 2 | `profileLocale` — từ Supabase profile | **medium** | Đăng ký cẩn thận nhưng có thể không phản ánh ngôn ngữ muốn dùng ngay lúc này |
| 3 | `browserLocale` — `navigator.language` | **medium** | Phản ánh thói quen máy tính, không nhất thiết là ngôn ngữ muốn đọc Companion |
| 4 | Default: **"vi"** — ngôn ngữ mặc định VO DUONG AI | **low** | Fallback an toàn, thừa nhận giới hạn |

Nguyên tắc thiết kế:
- **Không suy đoán** từ IP, quốc tịch, tên người dùng, hay bất kỳ thông tin ngầm nào
- **Fallback về "vi"** — không về "en" — vì VO DUONG AI là nền tảng tiếng Việt
- **`shouldAskClarification: true`** khi đang dùng ngôn ngữ mà Companion không chắc là đúng ý người dùng — để Companion thừa nhận giới hạn thay vì giả vờ chắc chắn
- **Ngôn ngữ chưa hỗ trợ đầy đủ** → fallback về "vi" với `confidence: "low"` và `shouldAskClarification: true` — không giả vờ hiểu

## NV3 — `resolveCompanionLanguage()` helper

File: `src/lib/portal/companion/companion-language.ts`

### Kiến trúc

```
CompanionLanguageContext (input)
  ├── explicitPreference?: string | null
  ├── profileLocale?: string | null      ← chưa có trong Supabase schema
  └── browserLocale?: string | null

resolveCompanionLanguage(context) →

CompanionLanguageResolution (output)
  ├── languageCode: "vi" | "en"          ← chỉ supported languages
  ├── confidence: "high" | "medium" | "low"
  ├── source: "explicit_preference" | "profile_locale" | "browser_locale" | "default"
  └── shouldAskClarification: boolean
```

### Internal helpers

- `extractLanguageTag(locale)` — trích BCP 47 tag từ locale string: "vi-VN" → "vi", "en-US" → "en", null → null
- `toSupportedCode(tag)` — kiểm tra tag có trong `SUPPORTED_LANGUAGE_CODES` không; nếu không, trả về null thay vì ép vào ngôn ngữ không có copy thật

### Điều kiện `shouldAskClarification`

| Nguồn | shouldAskClarification |
|---|---|
| explicit_preference | `false` — người dùng đã nói rõ |
| profile_locale | `false` — đã đăng ký, tin tưởng |
| browser_locale = "vi" | `false` — khớp với default |
| browser_locale ≠ "vi" | `true` — có thể người dùng muốn đọc bằng ngôn ngữ đó, nhưng chưa xác nhận |
| default, browser hints "vi" hoặc không có browser signal | `false` |
| default, browser hints ngôn ngữ khác | `true` — Companion biết mình có thể đang dùng sai ngôn ngữ |

### Hai field schema-ahead-of-time

`explicitPreference` và `profileLocale` chưa có field tương ứng trong Supabase schema `members` hôm nay — để sẵn ở đây để khi schema có thêm, caller chỉ cần pass value vào. Đây là cùng kỹ thuật đã dùng ở `CompanionAddressProfile` cho `preferredName`/`displayName` — typed interface trước khi có data, không phải data trước khi có interface.

## NV4 — Companion Voice Across Languages

### Tiếng Việt (vi) — Companion Voice gốc

| Đặc điểm | Cụ thể |
|---|---|
| Xưng hô | "mình/bạn" — gần gũi, không đúng khoảng cách |
| Giọng điệu | Ấm, không hào hứng giả tạo, không giảng đạo |
| Câu | Ngắn, không vòng vo, không dùng từ sáo rỗng ("tuyệt vời", "chắc chắn") |
| Thừa nhận giới hạn | Thẳng thắn: "Mình chưa chắc", "Mình chưa biết bắt đầu từ đâu" |
| Tránh | Khen ngợi sáo ("Bạn thật tuyệt!"), suy đoán cảm xúc ("Chắc bạn đang buồn"), CTA áp lực |

### Tiếng Anh (en) — Companion Voice adapted

| Đặc điểm | Cụ thể |
|---|---|
| Tone | Warm, calm, mature — KHÔNG phải "peppy", "enthusiastic", "motivational" |
| Address | "I/you" — không dùng "we" trừ khi nói về hành trình cùng nhau |
| Hedging | Honest: "I'm not sure", "I don't know where to start" — không hedge quá mức (too many "perhaps/maybe") |
| Avoid | Hollow praise ("That's amazing!"), emotion projection ("You must be feeling..."), CTA pressure |
| Copy length | Short — tương đương tiếng Việt, không dài dòng hơn vì tưởng English cần explain thêm |

### Ngôn ngữ chưa hỗ trợ đầy đủ (fallback về vi)

Companion không giả vờ: khi nhận `browserLocale` là ngôn ngữ chưa trong `SUPPORTED_LANGUAGE_CODES`, `resolveCompanionLanguage()` trả về:
- `languageCode: "vi"`, `confidence: "low"`, `source: "default"`, `shouldAskClarification: true`

Caller có thể dùng `shouldAskClarification` để Companion nói một câu nhẹ nhàng thừa nhận: "Mình chưa hỗ trợ đầy đủ ngôn ngữ bạn đang dùng — mình sẽ nói tiếng Việt trong lúc này." Không giả vờ hiểu, không im lặng giả như không có gì.

**Mở rộng thêm ngôn ngữ** = thêm vào `SUPPORTED_LANGUAGE_CODES` và viết copy Companion Voice tương ứng — không cần sửa kiến trúc.

## NV5 — Audit các nơi cần dùng Language Policy

| Touchpoint | File | Hiện trạng | Language-aware chưa? |
|---|---|---|---|
| **First Meeting** | `companion/first-meeting.ts` | `RELATIONSHIP_STAGE_LINES` — tiếng Việt hardcoded | Chưa — cần key-based copy khi English added |
| **Personal Addressing** | `companion/companion-address.ts` | `getCompanionAddress()` — tiếng Việt | Chưa — `displayName` logic OK, copy phrases cần localize |
| **Daily Thought** | `companion/proactive-thoughts.ts` | Danh sách thoughts — tiếng Việt | Chưa — cần hai danh sách song song khi English copy sẵn sàng |
| **Internal Voices** | `intelligence/internal-voices.ts` | `GARDEN_VOICE_LINES`, `REFLECTION_VOICE_LINES`, uncertainty lines — tiếng Việt | Chưa — cần wrap vào Record keyed by language khi đến lúc |
| **Reflection Letter** | (reflection engine) | Tiếng Việt | Chưa |
| **Life Moments** | (portal content) | Tiếng Việt | Chưa |
| **Return After Silence** | `first-meeting.ts` — `getSilenceTimingForStage()` | Chưa có message text, chỉ logic | N/A — không có text |
| **Mirror** | (mirror feature) | Tiếng Việt | Chưa |
| **Error/Fallback messages** | Nhiều nơi trong Portal UI | Tiếng Việt, chưa chuẩn hóa | Chưa, và vẫn còn Language Debt từ Language Constitution |

**Nhận xét audit:**
- Không nơi nào hôm nay nhận `languageCode` làm tham số — tất cả hardcode "vi". Đây là trạng thái đúng cho Sprint foundation — không cần sửa ngay.
- Khi copy tiếng Anh thật được viết, pattern can follow: `VOICE_LINES: Record<CompanionLanguageCode, Record<...>>` — mỗi touchpoint thêm một dimension mà không phá vỡ caller hiện tại.
- `shouldAskClarification` là tín hiệu Companion dùng để tự điều chỉnh — không phải UI pop-up. Caller quyết định khi nào hỏi và hỏi như thế nào — Companion không hỏi mọi lần.

**Ghi chú quan trọng:** Hôm nay chưa có callers nào gọi `resolveCompanionLanguage()`. File tồn tại như một foundation được type-safe, sẵn sàng cho Sprint tiếp theo khi copy tiếng Anh thật được viết và một caller thật được wire.

## NV6 — Quyết định không overbuild

Những thứ không được thêm trong Sprint này:

| Thứ không thêm | Lý do |
|---|---|
| Full translation platform | Copy tiếng Anh thật chưa được viết — build translation layer trước khi có content là overbuild |
| CMS localization | Không có content management nào trong Portal hôm nay |
| Database mới | `explicitPreference` chưa cần lưu — khi cần thì thêm column vào `members`, không cần table mới |
| Auto-detect phức tạp | IP detection/geolocation = suy đoán không được xin phép; ngược Language Constitution Respect |
| Language Context Provider / React Context | Không có caller nào hôm nay — thêm infrastructure chưa ai dùng là overbuild |
| Companion Voice copy bằng tiếng Anh | Viết copy mà chưa có Language Review và không có native speaker review = content debt, không phải bước tiến |
| Language switching UI | Không có design — không build UI khi không có design và không có copy |

**Nguyên tắc đã giữ:** Tất cả code Sprint 22.7 = một file mới (`companion-language.ts`) với types + 1 helper function + 2 private helpers. Không sửa file nào cũ. Không thêm dependency. Không thêm React component. Không thêm database call. Caller chưa có — và đó là đúng: foundation phải được đặt trước khi caller cần nó.

## NV7 — Language Review: 5 câu

**1. `resolveCompanionLanguage()` có tôn trọng người dùng không (Respect)?**

Có — không suy đoán từ tên, quốc tịch, IP. Không ép người dùng vào ngôn ngữ "Companion chọn". Khi không chắc chắn, `shouldAskClarification: true` để Companion thừa nhận thay vì giả vờ biết.

**2. Logic có khiêm tốn không (Humility)?**

Có — confidence level "low" khi chỉ có default, "medium" khi từ browser/profile, "high" chỉ khi người dùng đã chủ động chọn. Companion không tự tin quá mức về ngôn ngữ của người dùng.

**3. `shouldAskClarification` có được dùng đúng không?**

Có — nó là tín hiệu cho caller, không phải trigger tự động. Companion không hỏi mọi lần — chỉ khi caller quyết định rằng đây là thời điểm phù hợp (ví dụ: lần đầu session, người dùng vừa gõ bằng ngôn ngữ khác). Điều này nhất quán với cách `characterMemory` và `RelationshipStage` được dùng — signal, không phải action.

**4. Có giữ đúng Companion Voice across languages không?**

Hôm nay chỉ có "vi" và "en" được định nghĩa là supported. English Companion Voice được mô tả ở NV4 — warm/calm/mature, không peppy hay generic. Khi copy tiếng Anh thật được viết, nó phải qua Language Review 7 tiêu chí (Language Constitution) trước khi được merge — không thể có English copy chỉ vì nó "đúng ngữ pháp."

**5. Sprint này có giải quyết được một vấn đề thật không?**

Có — trước Sprint này, Companion không có cơ chế để biết ngôn ngữ người dùng mong muốn. Mọi copy đều hardcode "vi". Không có nơi nào để caller hỏi "tôi nên nói ngôn ngữ nào?" `resolveCompanionLanguage()` là câu trả lời cho câu hỏi đó — không dư không thiếu.

## Liên quan

- `src/lib/portal/companion/companion-language.ts` — implementation
- `docs/THE_COMPANION_LANGUAGE_CONSTITUTION.md` — 12 phẩm chất Companion Voice phải giữ dù ngôn ngữ nào
- `docs/THE_RELATIONSHIP_ERA.md` — tại sao Language là Relationship Layer
- `docs/THE_FIRST_LANGUAGE_BEHAVIOR.md` — Sprint 22.6, tinh thần "nói thật khi chưa chắc" áp dụng cho language clarification
- `src/lib/portal/companion/first-meeting.ts` — RelationshipStage, nguồn cảm hứng cho pattern "typed interface trước data"
- `src/app/layout.tsx` — `lang="vi"` hardcoded, sẽ là nơi đầu tiên cần update khi dynamic language được implement
