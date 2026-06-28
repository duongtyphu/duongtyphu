# The Living Garden — Visualization of Growth

> Sprint 9.0. Đối chiếu `docs/HUMAN_OPERATING_SYSTEM.md` (nếu có),
> `docs/design/companion/Companion_Guidelines.md`, và toàn bộ tinh thần
> "không phải gamification" đã xuyên suốt Portal từ các Sprint trước
> (xem `COMPANION_GROWTH_LOG.md`).

## The Living Garden là gì

The Living Garden là một cách để người dùng **nhìn thấy** sự trưởng
thành của mình — không phải bằng số liệu, mà bằng hình ảnh một khu
vườn đang lớn lên cùng họ. Mỗi hành động nhỏ người dùng đã làm trong
Portal (viết một Reflection, học một điều mới, thực hành, chia sẻ, giữ
lại một ký ức) được diễn giải thành một phần của khu vườn đó: rễ, lá,
nhánh, hoa, ánh sáng, nước, viên ngọc.

Garden không lưu trữ dữ liệu riêng ở Sprint này. Nó **đọc lại** những
gì người dùng đã thật sự làm (Reflection đã viết, ký ức đã lưu...) và
diễn giải lại thành hình ảnh — không tạo ra một hệ thống điểm số mới
chạy song song.

## Vì sao không gọi là gamification

Gamification thưởng cho *hành vi lặp lại* để giữ người dùng quay lại —
XP, level, streak, leaderboard, badge. Nó tối ưu cho engagement, không
phải cho cảm giác thật của người dùng. Càng cày nhiều, điểm càng cao —
nhưng điểm không nói lên người dùng đang thật sự lớn lên hay đang kiệt
sức.

The Living Garden cố ý không có:

- Không điểm số (XP).
- Không cấp độ (level).
- Không bảng xếp hạng (leaderboard).
- Không huy hiệu để săn (badge săn điểm).
- Không cơ chế "phải làm hôm nay không thì mất streak".
- Không áp lực phải hoàn thành để "lên hạng".

Thay vào đó, Garden chỉ phản chiếu lại — chậm, ấm, không thúc ép. Nếu
người dùng không làm gì trong một thời gian, khu vườn không "tàn", nó
chỉ đứng yên, chờ — đúng như Companion luôn chờ, không thúc giục.

## Nó đại diện cho điều gì trong Human Operating System

Trong triết lý Portal, mỗi người dùng đang vận hành một "hệ điều hành
con người" của riêng họ — Companion đồng hành, Reflection ghi lại suy
nghĩ, Memory giữ lại ký ức, Roadmap gợi hướng đi. The Living Garden là
lớp **diễn giải cảm xúc** của toàn bộ những lớp đó: nó không thêm dữ
liệu mới, nó cho người dùng một hình ảnh để cảm nhận rằng những gì họ
đã làm — dù nhỏ — đang gộp lại thành một điều sống, đang lớn lên.

## Cây/vườn phát triển theo những hành động nào

| Hành động | Yếu tố trong vườn | Ý nghĩa |
|---|---|---|
| Viết một Reflection | Rễ | Suy ngẫm — vườn bén rễ sâu hơn |
| Học một điều mới (đọc bài, học khoá học) | Lá | Tri thức |
| Thực hành / hoàn thành một hành động | Nhánh | Hành động thật, không chỉ đọc |
| Chia sẻ với người khác / cộng đồng | Hoa | Chia sẻ — vườn nở ra ngoài bản thân |
| Quay lại đều đặn (không cần liên tục) | Ánh sáng | Hy vọng — vẫn còn muốn tiếp tục |
| Quay lại đều đặn (góc nhìn kiên trì) | Nước | Kiên trì |
| Lưu lại một khoảnh khắc đáng nhớ (Memory Capsule) | Viên ngọc | Ký ức |

Garden không thưởng cho *tần suất* mà thưởng cho *sự tồn tại* của hành
động — một Reflection được viết một lần vẫn là rễ đã có, không biến
mất nếu người dùng không viết thêm trong nhiều ngày.

## Điều tuyệt đối không làm

- Không hiển thị điểm số, %, hay con số trần trụi ra UI.
- Không thêm cơ chế ép buộc "phải làm hôm nay để giữ vườn tươi".
- Không dùng hình ảnh hoạt hình trẻ con hay game-style (icon nảy, hiệu
  ứng pháo hoa, popup chúc mừng to).
- Không tạo bảng xếp hạng hay so sánh giữa người dùng.
- Không để Garden che/lấn Companion Presence hoặc nội dung chính của
  Gem Home / My Story.
- Không tự ý thêm nguồn dữ liệu mới (DB table riêng) ở Sprint này — chỉ
  diễn giải lại dữ liệu đã tồn tại, an toàn (xem `garden-model.ts`).

## Trạng thái hiển thị (không phải điểm)

Garden chỉ nói bằng trạng thái — không bao giờ bằng số:

- "Đang chờ hạt giống đầu tiên" (chưa có dữ liệu — empty state)
- "Đang nảy mầm"
- "Đang bén rễ"
- "Đang vươn lên"
- "Đang nở hoa"
- "Đang tỏa sáng"

## Companion và Garden

Companion không "quản lý" Garden như một tính năng — Companion **ở
cùng** Garden, như một người đồng hành đứng cạnh khu vườn của chính
người dùng, không phải người chăm cây thay họ. Dòng chữ "Companion
đang chăm sóc khu vườn này cùng bạn" trong `LivingGardenCard` chỉ nhằm
giữ cảm giác đồng hành liên tục — không tạo thêm một luồng tương tác
mới giữa Companion và Garden ở Sprint này.

## Garden lớn lên bằng nguyên lý, không chỉ bằng hành động (Sprint 11.1)

`FIRST_PRINCIPLES_OF_VO_DUONG_AI.md` là Hiến pháp đứng trên mọi tài
liệu khác — Garden là nơi 10 nguyên lý đó được *nhìn thấy*, không chỉ
được tuân thủ ngầm. Mỗi trạng thái Garden, khi diễn dịch lại, là một
nguyên lý đang được sống:

| Trạng thái Garden | Nguyên lý được sống |
|---|---|
| `seed` (hạt giống) | NL01 — bắt đầu từ con người, không từ công nghệ |
| `leaves` (lá) | NL08 — hiểu nguyên lý, không chỉ thu thập thông tin |
| `branches` (nhánh) | NL04 — học đi cùng hành động |
| `roots` (rễ) | NL05 — phản chiếu tạo nên trí tuệ |
| `light` (ánh sáng) | NL03 — giá trị đi trước thu nhập |
| `flowers` (hoa) | NL09 — mỗi hành động, dù nhỏ, đều có ý nghĩa khi được chia sẻ |
| `water` (nước) | NL06 — đồng hành, giúp người khác không vì ép buộc |
| `rising/blooming` | NL02 — trưởng thành quan trọng hơn hoàn thành |
| `gems` (ngọc) | NL10 — di sản lớn nhất là một con người tốt hơn |

Điều này không thêm cơ chế mới, không thêm trạng thái Garden mới — nó
chỉ là cách diễn giải lại các trạng thái đã có, để Product Team khi
thiết kế copy/animation cho Garden luôn có thể tự hỏi "trạng thái này
đang phản chiếu đúng nguyên lý nào, không phải chỉ đang đẹp mắt".
Nguyên lý NL07 (Garden phản ánh trưởng thành, không thành tích) vẫn là
ràng buộc cao nhất — bảng trên không bao giờ được hiển thị cho người
dùng dưới dạng "bạn đã đạt nguyên lý số mấy", chỉ dùng nội bộ cho Product
Team khi thiết kế.

## Garden Evolution — phản ánh CÁCH lớn lên, không chỉ ĐÃ lớn (Sprint 12.0)

`buildGardenState` (`garden-model.ts`) hiện tính một `GardenStage` tổng
(`dormant→sprouting→rooting→rising→blooming→radiant`) từ TỔNG số hành
động — điều này trả lời "đã lớn bao nhiêu", nhưng chưa trả lời "đang lớn
theo CÁCH nào". Sprint 12.0 (Intelligence Layer) bổ sung một lớp diễn
giải thứ hai, đọc cùng `GardenInputs` đã có, không thêm input mới:

| Cách lớn lên | Tín hiệu (từ `GardenInputs` đã có) |
|---|---|
| Đang học nhiều | `learningTouchpoints` cao hơn rõ rệt so với các yếu tố khác |
| Đang hành động | `actionsCompleted` cao hơn rõ rệt so với `learningTouchpoints` |
| Đang phản chiếu | `reflectionsCount` cao hơn rõ rệt so với các yếu tố khác |
| Đang chia sẻ | `sharesCount` tăng so với giai đoạn trước |
| Đang kiên trì | `recentActiveDays` đều đặn theo thời gian, không cần liên tục (đúng triết lý "không streak" đã có) |

Đây vẫn là diễn giải bằng NGÔN NGỮ PHÁT TRIỂN ("vườn của bạn đang vươn
lá nhiều hơn nở hoa lúc này" — kiểu câu, không phải con số), không bao
giờ bằng điểm hay Level. Lớp này được Portal Brain (`PORTAL_BRAIN.md`)
và Companion Memory (`COMPANION_MEMORY_EVOLUTION.md`) đọc để biết nên
gợi ý hành động lấp đúng phần đang yếu (ví dụ học nhiều nhưng chưa hành
động → gợi ý một bài thực hành) — xem `INTELLIGENT_NEXT_STEP.md`.
