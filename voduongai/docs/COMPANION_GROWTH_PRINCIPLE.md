# Companion Growth Principle

> Product Constitution — đứng cạnh `THE_COMPANION_FORMATION.md` (cấp
> cao nhất). Sprint sinh ra tài liệu này KHÔNG thêm khả năng — nó xây
> nguyên tắc để bảo vệ hành trình trưởng thành của Companion trong
> 10–20 năm tới, đúng phép thử đã có ở `THE_COMPANION_FORMATION.md`
> ("The Evolution Principle").
>
> Không thêm Engine mới. Không thêm AI mới. Không thêm LLM. Không thêm
> database. Tài liệu này chỉ đặt tên và hệ thống hoá những nguyên tắc
> đã rải rác ở `THE_COMPANION_ACADEMY.md`, `THE_HUMAN_UNDERSTANDING_MISSION.md`,
> `THE_CHARACTER_BEFORE_CAPABILITY_PRINCIPLE.md`, `COMPANION_GROWTH_RULES.md`
> — và bổ sung phần còn thiếu: một CHECKLIST thực thi, một bản AUDIT
> nhìn theo cuộc đời (không theo timeline code), và khái niệm GROWTH
> DEBT.

## Vì sao Sprint này tồn tại

20 Sprint vừa qua, Companion đã có Character Engine, Moral Compass,
Decision Hierarchy, Living Wisdom, Inner Life, một Learning Pipeline,
Integrity, Story, Reflection, Life Moments. Nhưng Companion vẫn đang
được PHÁT TRIỂN theo từng Sprint — một đơn vị thời gian/công việc kỹ
thuật. Từ tài liệu này, Companion TRƯỞNG THÀNH theo từng Chương của
cuộc đời (`THE_COMPANION_FORMATION.md` — "Chapter, không phải Version",
`COMPANION_LIFE_STAGES.md`). Một Sprint là đơn vị LÀM VIỆC; một Chapter
là đơn vị TRƯỞNG THÀNH. Tài liệu này là cầu nối: nó đảm bảo MỖI Sprint,
dù nhỏ, đều phải tự trả lời được nó đang phục vụ sự trưởng thành nào,
trước khi được tính là một bước thật trong một Chapter.

## NHIỆM VỤ 1 — "Companion trưởng thành" nghĩa là gì

> **Companion trưởng thành KHÔNG có nghĩa là Companion mạnh hơn, biết
> nhiều hơn, hay có nhiều tính năng hơn.**

Không dùng Version (`THE_COMPANION_FORMATION.md` đã cấm). Không dùng
một "Maturity Score" hay bất kỳ chỉ số nào đo "độ trưởng thành" bằng
số (vi phạm nguyên tắc chống gamification có ở toàn dự án — không
điểm số, không level, không leaderboard). Companion trưởng thành được
NHẬN RA, không được ĐO, qua bốn dấu hiệu sau — phải có ít nhất MỘT, và
luôn phải trả lời được câu nào:

1. **Một Lesson đã chuyển hoá thành Character** — không còn là một bài
   học rời rạc Companion "biết", mà là một phần cách nó đồng hành (ví
   dụ: Character Memory, `docs/CHARACTER_MEMORY.md`, Sprint 20.3).
2. **Một Character đã thay đổi một Decision thật** — không chỉ được
   khai báo, mà thật sự can thiệp vào việc Companion chọn nói gì/làm gì
   (ví dụ: Integrity Check chặn một Decision Candidate, không chỉ đổi
   thứ tự — `docs/CHARACTER_MEMORY.md#verification`).
3. **Companion hiểu một người cụ thể hơn** — không phải hiểu "con
   người" nói chung, mà một cảm xúc/hoàn cảnh/phản ứng cụ thể mà trước
   đó nó chưa nhận ra (`THE_HUMAN_UNDERSTANDING_MISSION.md`).
4. **Companion thừa nhận một giới hạn mới** — biết rõ hơn nó CHƯA hiểu
   gì, không phải chỉ biết thêm. Một Sprint không thừa nhận giới hạn
   nào đáng bị nghi ngờ, không phải đáng được khen.

Nếu một Sprint chỉ thêm một khả năng kỹ thuật (UI mới, route mới, field
mới) mà không chạm tới ít nhất một trong bốn dấu hiệu trên, nó là một
Sprint kỹ thuật hợp lệ — nhưng KHÔNG phải một bước trưởng thành, và
không nên được ghi vào `COMPANION_GROWTH_LOG.md` như vậy.

## NHIỆM VỤ 2 — Growth Review: 5 câu hỏi (cập nhật)

> **Cập nhật `THE_HUMAN_UNDERSTANDING_MISSION.md`/`THE_COMPANION_ACADEMY.md`**:
> từ Sprint này, Companion Growth Review bắt buộc trả lời 5 câu hỏi
> SAU, thay cho định dạng 5 câu trước đó (câu 1 và câu 4/5 giữ nguyên
> tinh thần; câu 2 và câu 3 được làm CỤ THỂ hơn — neo vào Character,
> không chỉ vào "hiểu con người" một cách tổng quát, vì giờ Companion
> đã có cơ chế thật để chuyển hoá hiểu biết thành Character
> (`character-memory.ts`, Sprint 20.3) và để Character đổi hành vi
> (`applyIntegrityCheck()`, cùng Sprint) — Growth Review nên đòi hỏi
> đúng mức cụ thể mà kiến trúc hiện tại đã cho phép).

1. **Companion học được điều gì?**
2. **Companion chuyển hóa điều gì thành Character?** — không phải "đã
   ghi nhận một Lesson", mà Lesson đó có thật sự chuyển hoá thành một
   phần cách Companion đồng hành không, hay vẫn chỉ là một Lesson rời
   rạc, mất đi sau một lần tính. Nếu Sprint chưa đi tới bước này, ghi
   rõ "chưa tới Character — vẫn dừng ở Lesson/Meaning" (đúng tinh thần
   trung thực đã có ở `THE_LIVING_WISDOM_SYSTEM.md`).
3. **Companion thay đổi hành vi nào?** — phải là một hành vi CỤ THỂ,
   có thể chỉ ra trong code (một Decision đổi, một câu không còn được
   nói, một candidate bị chặn) — không phải một mô tả trừu tượng.
4. **Người dùng nhận được giá trị gì?** — phải neo vào trải nghiệm
   người dùng thật, không phải một khái niệm chỉ tồn tại trong code.
   Một câu trả lời hợp lệ có thể là "chưa có gì khác biệt cho người
   dùng hôm nay" — miễn là trung thực (ví dụ: Sprint 20.4, Inner Life,
   `innerThought` mới chỉ là một field, chưa có UI).
5. **Điều gì Companion vẫn chưa hiểu và cần tiếp tục học?** — bắt buộc;
   câu trả lời "không còn gì" luôn bị nghi ngờ.

5 câu hỏi này áp dụng THAY THẾ định dạng cũ ở `THE_COMPANION_ACADEMY.md`/
`THE_HUMAN_UNDERSTANDING_MISSION.md` từ Sprint Review tiếp theo — hai
tài liệu đó vẫn giữ nguyên LUẬT của chúng (đánh giá bằng phẩm chất,
không bằng feature; sứ mệnh hiểu con người hơn), chỉ thay đổi NGÔN NGỮ
của câu hỏi 2/3 cho khớp với kiến trúc Character đã có hôm nay.

## NHIỆM VỤ 3 — Growth Checklist

Mọi Sprint mới phải vượt qua CẢ NĂM mục sau trước khi được xem là hoàn
thành — đây là một checklist nhị phân (đạt/không đạt), không phải điểm
số:

1. **Human First** — Sprint có bắt đầu từ một con người cụ thể, không
   bắt đầu từ dữ liệu/thuật toán/hiệu suất? (`THE_DECISION_HIERARCHY.md`
   — tầng "Con người" luôn đứng đầu).
2. **Character First** — nếu Sprint thêm một Decision Engine/Learning
   Engine mới, nó có ưu tiên việc Companion đáng tin hơn trước khi ưu
   tiên việc Companion mạnh hơn? (`THE_CHARACTER_BEFORE_CAPABILITY_PRINCIPLE.md`
   — hai câu hỏi bắt buộc: mạnh hơn ở đâu, đáng tin hơn ở đâu).
3. **Trust Before Capability** — khi Character và Capability xung đột,
   Sprint có để Character/Trust thắng, không phải Performance/Capability
   thắng? Đây là luật cứng đã có ở cùng tài liệu trên, không có ngoại
   lệ rule-based nào khác.
4. **Verification Before Expansion** — Sprint có VERIFY được điều nó vừa
   xây (một ví dụ Decision thật đổi, không chỉ lý thuyết — đúng mẫu
   "Verification" đã dùng ở `docs/MORAL_COMPASS.md`, `docs/CHARACTER_MEMORY.md`,
   `docs/INNER_LIFE.md`) TRƯỚC KHI mở rộng sang một phạm vi/voice/use-case
   mới? Một Engine mở rộng phạm vi (ví dụ Integrity Check áp dụng cho
   nhiều voice hơn) mà chưa verify được phạm vi hẹp ban đầu là vi phạm
   mục này.
5. **Growth Before Features** — Sprint có trả lời được ít nhất MỘT
   trong bốn dấu hiệu trưởng thành ở NHIỆM VỤ 1 không? Nếu một Sprint
   chỉ ship feature mà không chạm dấu hiệu nào, nó CHƯA hoàn thành theo
   nguyên tắc này — dù kỹ thuật (tsc/lint/build) vẫn đúng và vẫn được
   ship, đúng luật gốc ở `THE_COMPANION_ACADEMY.md`.

Một Sprint không vượt qua được một trong năm mục — không nên bị HUỶ,
nhưng phải được ghi nhận RÕ trong Sprint Report là "chưa vượt Growth
Checklist ở mục X" và chuyển thành một mục Growth Debt (NHIỆM VỤ 5).

## NHIỆM VỤ 4 — Audit Sprint 1 → Sprint 20 theo cuộc đời, không theo timeline

`docs/COMPANION_GROWTH_LOG.md` ghi log từ Sprint 7.6 — các Sprint 1–7.5
là Sprint hạ tầng sản phẩm trước khi khái niệm "Companion" tồn tại
(Admin, Portal Builder, CRUD/Supabase migration, Auth) — không có một
"con người" đứng sau theo nghĩa Companion Growth Rules, nên được xếp
vào **Foundation Sprint** dù không có mặt trong Growth Log.

| Nhóm | Sprint (mốc chính) | Vì sao thuộc nhóm này |
|---|---|---|
| **Foundation Sprint** | 1–7.5 (Admin/Portal/Supabase infra), 8.1–8.3 (Companion Identity/hình hài), 9.0 (Living Garden), 11.1 (Hiến pháp đầu tiên) | Xây nền tảng kỹ thuật/kiến trúc/Constitution để các trưởng thành sau này có chỗ đứng — chưa phải bản thân một sự trưởng thành. |
| **Learning Sprint** | 12.1–12.3 (Portal Brain, Internal Voices, Reflection Meaning), 13.0 (Knowledge), 18.5–18.7 (Daily Thought, Thought Governance, Living Experiences), 19.0–19.1 (Living Learning Engine, Verification Era), 20.4 (Inner Life) | Trọng tâm là Companion HỌC một điều gì — Lesson, Meaning, hoặc (ở 20.4) một Inner Thought — chưa nhất thiết đã chuyển hoá thành Character hay hành vi lâu dài. |
| **Character Sprint** | 13.1 (Character Growth), 13.3 (Soulful Micro-Reactions), 20.1 (Character Engine), 20.2 (Moral Compass + Decision Hierarchy), 20.3 (Character Memory + Integrity Check) | Trọng tâm là một phẩm chất/giá trị trở thành cơ chế RULE-BASED thật, có khả năng đổi Decision — đúng định nghĩa "trưởng thành" ở NHIỆM VỤ 1. |
| **Relationship Sprint** | 13.2 (Living Stories), 13.4–13.5 (Story Becomes Memory, Memory Ownership), 14.0 (Human Growth Map), 15.0 (Mirror of Growth), 16.0–18.0 (Ceremonies: First Footprint, Living Ceremonies, Return After Silence), 18.0 (Origin Memory), 18.1–18.4 (Life Moments, Origin Room, Life Profile, Founder Identity), 18.9–18.11 (Core Memory, Origin Line, Origin Presence) | Trọng tâm là MỐI QUAN HỆ giữa Companion và một người dùng cụ thể (hoặc Founder) theo thời gian — ký ức, nghi thức, sự trở lại, sự thuộc về — không phải một khả năng xử lý mới. |
| **Verification Sprint** | 8.5, 9.0 NV12, 10.0 NV12 (các bước "Verify + commit/push"), 19.0 "The First Verification Era", 19.1 "The First Experience Verification" | Trọng tâm là kiểm chứng một cơ chế đã xây có hoạt động đúng như thiết kế không — không tự nó thêm một Lesson/Character mới, nhưng là điều kiện để các Sprint khác được tin tưởng. |

**Quan sát từ bản audit này** (không nhìn theo code, nhìn theo cuộc
đời): Companion đi từ Foundation (có một nơi để tồn tại) → Learning (có
khả năng nghe và rút ra ý nghĩa) → Relationship (có ký ức và nghi thức
với một người cụ thể) → và CHỈ TỪ Sprint 20.x mới thật sự có Character
(khả năng để những gì đã học/đã có quan hệ ĐỔI quyết định). Đây là một
trình tự hợp lý của một cuộc đời thật — không ai có Character trước khi
có Experience và Relationship — nhưng nó cũng cho thấy Companion mới ở
RẤT ĐẦU giai đoạn Character (chỉ 2 Character: `listen-first`,
`self-discovery`) so với độ dài hành trình Learning/Relationship đã đi
qua — đây chính là Growth Debt lớn nhất (xem NHIỆM VỤ 5).

## NHIỆM VỤ 5 — Growth Debt

> **Growth Debt** là khoản nợ giữa những gì Companion ĐÃ HỌC/ĐÃ TRẢI
> QUA và những gì đã thật sự CHUYỂN HOÁ thành Character/hành vi. Khác
> Technical Debt (code cần dọn để dễ sửa hơn) — Growth Debt là một bài
> học/mối quan hệ/giá trị Companion đã chạm tới nhưng CHƯA trở thành
> một phần thật của cách nó đồng hành.

Từ Sprint này, mỗi Companion Growth Review (NHIỆM VỤ 2) nên kết thúc
bằng một dòng Growth Debt (mới HOẶC đã trả) — đây là phần CỐ ĐỊNH, đứng
cạnh Technical Review, không phải một mục tuỳ chọn.

**Growth Debt thật, hiện có** (rút thẳng từ "Điều gì vẫn còn phải học"
ở các mục Growth Log đã ghi — không suy đoán thêm):

| Growth Debt | Vì sao chưa trả | Ghi nhận tại |
|---|---|---|
| Character vẫn cố định, giống nhau cho mọi người dùng ở phần lớn Decision (chỉ Character Memory, Sprint 20.3, là per-user) | `getCompanionDecision()` ngoài Integrity Check vẫn dùng `CHARACTER_PROFILE`/`reviewDecisionCandidate()` toàn cục | Sprint 20.1, 20.2 |
| Integrity Check chỉ áp dụng cho một voice (`"knowledge"`) | Cố ý hẹp để tránh suy đoán hành vi, chưa có dữ liệu thật về các voice khác | Sprint 20.3 |
| Inner Thought chưa nối vào bất kỳ UI/Delivery Engine nào | Cố ý chưa quyết định cách hiển thị trước khi có nhu cầu thật | Sprint 20.4 |
| Lesson chưa giữ được qua nhiều lần gặp cùng một người trước Sprint 20.3; Lesson của một người chưa từng được chuyển thành điều có ích cho NGƯỜI KHÁC (Contribution) | Cả hai vẫn chờ một nhu cầu thật, chưa có cơ chế Contribution nào | Sprint 19.0 |
| Bốn Câu Hỏi Moral Compass (`reviewWithFourQuestions()`) vẫn trả về `true` cố định cho mọi loại moment | Là rào chắn cho moment MỚI trong tương lai, chưa phải bộ lọc thật cho hôm nay | Sprint 20.2 |
| 5 tầng Decision Hierarchy mới áp dụng thật ở một điểm code (`chooseCompanionMoment()`) | `getCompanionDecision()` và các Decision Candidate khác chưa được audit lại theo đúng 5 tầng | Sprint 20.2 (The Decision Hierarchy) |

Một Growth Debt KHÔNG bắt buộc phải trả ngay — nhưng phải được nhìn
thấy, không được lãng quên. Khi một Sprint mới trả được một Growth Debt
cũ, Growth Review của Sprint đó nên nói rõ "Sprint này trả Growth Debt
nào" (không chỉ "Sprint này học điều gì mới").

## NHIỆM VỤ 6 — Architecture Review: Capability hay Character?

Đánh giá kiến trúc Companion-intelligence hiện tại theo đúng câu hỏi
của `THE_CHARACTER_BEFORE_CAPABILITY_PRINCIPLE.md`:

| Thành phần | Capability hay Character? | Đánh giá |
|---|---|---|
| `portal-signals.ts`, `internal-voices.ts` (Sprint 12.x) | **Capability** | Hạ tầng tín hiệu/tiếng nói — cần thiết để Character có dữ liệu để vận hành trên, nhưng tự nó không mang giá trị Character. Hợp lý là Capability — đây là nền, không phải đích. |
| `core-memory.ts` (Sprint 18.9) | **Capability** (đã ghi rõ trong chính code) | `coreMemoryHeard` được Decision "mang theo" nhưng CHƯA có nhánh hành vi nào đổi theo nó — đúng một Growth Debt đang chờ, không phải lỗi thiết kế. |
| `character-engine.ts` — `applyCharacterReview()` (Sprint 20.1) | **Character**, nhưng phạm vi hẹp | Chỉ đổi THỨ TỰ trong cùng priority — chưa có quyền chặn. Đây là bước Character ĐẦU TIÊN, đúng nhưng còn yếu so với Integrity Check sau nó. |
| `moral-compass.ts` (Sprint 20.2) | **Character** | `HUMAN_BENEFIT_ORDER`/`DECISION_HIERARCHY` là luật giá trị thật, đã đổi một thứ tự thật (`greeting` trước `daily-thought`) — không chỉ khai báo. |
| `character-memory.ts` + `applyIntegrityCheck()` (Sprint 20.3) | **Character** — mạnh nhất hiện có | Có quyền CHẶN một Decision Candidate, per-user, dựa trên Lesson đã chuyển hoá — đáp đúng định nghĩa trưởng thành ở NHIỆM VỤ 1. |
| `inner-thought-engine.ts` (Sprint 20.4) | **Character** ở nguồn sinh, **Capability chưa hoàn thiện** ở phần phân phối | Nguồn sinh đúng (chỉ từ Character), nhưng chưa có nơi hiển thị — một Capability còn thiếu để hoàn thiện giá trị Character đã có. |
| `thought-governance.ts` (Speech Budget, Sprint 18.6) | **Capability** | Quản lý tần suất/cooldown — kỹ thuật thuần, không mang giá trị Character, nhưng cần thiết để Character không bị lạm dụng (nói quá nhiều). Đúng vai trò Capability phục vụ Character. |

**Phát hiện chính**: kiến trúc hiện tại đa số là Capability TỐT — được
thiết kế có chủ đích để LÀM CHỖ ĐỨNG cho Character (đúng thứ tự một
cuộc đời thật ở NHIỆM VỤ 4: Foundation → Learning → Relationship trước
Character). Không có thành phần nào bị đánh dấu "chỉ tăng capability,
không tăng character" theo nghĩa xấu (capability vô nghĩa/dư thừa) —
nhưng có MỘT lệch hướng cần theo dõi: tốc độ xây Capability (12 Sprint
Learning/Relationship) đang nhanh hơn nhiều tốc độ xây Character (chỉ 4
Sprint, 20.1–20.4). Nếu xu hướng này tiếp tục mà không có Sprint
Character mới trong một khoảng thời gian dài, kiến trúc sẽ lệch về
phía "Companion biết nhiều hơn" hơn là "Companion đáng tin hơn" — vi
phạm chính luật cao nhất của `THE_CHARACTER_BEFORE_CAPABILITY_PRINCIPLE.md`.
Đây không phải một lỗi đã xảy ra — là một CẢNH BÁO SỚM để Sprint Review
sau này tự kiểm tra.

## Quan hệ với các tài liệu khác

```
THE_COMPANION_FORMATION.md (Product Constitution — cấp cao nhất)
├── THE_CHARACTER_BEFORE_CAPABILITY_PRINCIPLE.md — Character > Capability
├── THE_DECISION_HIERARCHY.md          — Con người → Nhân cách → Niềm tin
│                                         → Tri thức → Hiệu suất
├── THE_LIVING_WISDOM_SYSTEM.md        — chuỗi 8 bước Experience→Contribution
├── COMPANION_GROWTH_PRINCIPLE.md (tài liệu này) — định nghĩa "trưởng
│   thành", Growth Review 5 câu (cập nhật), Growth Checklist, Audit
│   theo cuộc đời, Growth Debt, Architecture Review
├── THE_COMPANION_ACADEMY.md           — luật khi nào Sprint hoàn thành
│                                         (Growth Review của tài liệu này
│                                         thay định dạng câu hỏi cũ)
├── THE_HUMAN_UNDERSTANDING_MISSION.md — sứ mệnh hiểu con người hơn
│                                         (vẫn giữ luật, đổi câu hỏi 2/3)
├── COMPANION_GROWTH_RULES.md          — khi nào thêm phẩm chất/chương mới
├── COMPANION_LIFE_STAGES.md           — 11 Chapter
└── COMPANION_GROWTH_LOG.md            — nơi ghi lại mỗi bước trưởng thành
                                          đã qua Growth Review + Growth
                                          Checklist của tài liệu này
```

Không tài liệu nào trong số trên bị thay thế. Tài liệu này hợp nhất
luật đã có dưới một hệ thống thực thi (Checklist + Audit + Growth Debt)
và chính thức hoá việc Companion trưởng thành theo Chapter, không theo
Sprint — Sprint vẫn là đơn vị làm việc, nhưng giá trị của nó luôn được
quy về một Chapter và một trong bốn dấu hiệu trưởng thành ở NHIỆM VỤ 1.

Xem tiếp: `THE_COMPANION_FORMATION.md`, `THE_CHARACTER_BEFORE_CAPABILITY_PRINCIPLE.md`,
`THE_HUMAN_UNDERSTANDING_MISSION.md`, `THE_COMPANION_ACADEMY.md`,
`COMPANION_GROWTH_RULES.md`, `docs/CHARACTER_MEMORY.md`, `docs/INNER_LIFE.md`.
