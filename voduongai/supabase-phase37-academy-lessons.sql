-- =============================================================================
-- Phase 37 — Bước C.4b: 16 bài học khoá "AI cho người mới bắt đầu".
--
-- SINH TỰ ĐỘNG từ 16 file kịch bản Founder gửi. Nội dung giữ NGUYÊN VĂN
-- (chỉ đổi tên khoá "AI cơ bản cho mọi người" → "AI cho người mới bắt đầu"
-- theo quyết định Founder — làm ở bước sinh SQL, không sửa file .md gốc).
--
-- ĐÃ ÁP DỤNG SẴN qua MCP (không lặp lại ở file này): dòng `courses`
-- 'ai-cho-nguoi-moi-bat-dau' (giá 0, status open), 4 dòng `course_sections`,
-- và liên kết `learning_path_courses` vào giai đoạn 1 "Nhập môn AI".
--
-- CÁCH CHẠY: Supabase Dashboard → SQL Editor → dán toàn bộ → Run.
-- Chạy lại nhiều lần an toàn (xoá sạch bài của đúng khoá này trước khi chèn).
--
-- GHI CHÚ DỮ LIỆU — không bịa:
--  • `video_url` để NULL: 16 video chưa quay, file kịch bản không có link.
--    Founder điền sau qua /admin/premium/courses/.../builder.
--  • `duration_minutes` lấy CẬN TRÊN của khoảng ước lượng trong kịch bản
--    ("6-8 phút" → 8) — cột là integer, không lưu được khoảng.
--  • `is_free_preview = true` cho cả 16 bài: đây là khoá FREE, học viên
--    chưa mua gì vẫn phải xem trọn vẹn (đúng mô hình phân quyền đã chốt).
--  • `content` = toàn bộ kịch bản (mục tiêu, lời thoại, tài liệu đi kèm).
-- =============================================================================

begin;
delete from public.course_lessons l using public.course_sections s
 where l.section_id = s.id and s.course_id = 'ai-cho-nguoi-moi-bat-dau';

insert into public.course_lessons (section_id, title, sort_order, status, content, duration_minutes, is_free_preview)
select s.id, 'Bài 1: AI là gì và tại sao ai cũng nên học AI ngay hôm nay', 1, 'Published', '# Bài 1: AI là gì và tại sao ai cũng nên học AI ngay hôm nay

## Mục tiêu bài học
Sau bài này, học viên hiểu vì sao nên dành thời gian học AI ngay bây giờ, và cảm thấy tự tin — không còn e ngại vì nghĩ "AI quá khó" hay "AI không dành cho mình".

## Kịch bản (lời thoại gợi ý)

**[Mở đầu — 0:00-0:45]**

> Chào mừng bạn đến với khóa "AI cho người mới bắt đầu". Mình là Võ Dương, và trong 16 bài học tới, mình sẽ đồng hành cùng bạn từ con số 0 — không cần biết gì về kỹ thuật, không cần giỏi máy tính — để bạn có thể tự tin dùng AI trong công việc và cuộc sống hàng ngày.
>
> Trước khi bắt đầu, mình muốn hỏi bạn một câu: bạn đã từng nghe ai đó nói "AI sẽ thay đổi mọi thứ" chưa? Có thể bạn tin, có thể bạn hoài nghi. Dù bạn nghĩ gì, bài học hôm nay sẽ giúp bạn tự mình đánh giá — bằng chính trải nghiệm thật, không phải nghe người khác nói.

**[Phần 1: AI đang len lỏi vào cuộc sống ra sao — 0:45-3:00]**

> Có thể bạn chưa để ý, nhưng AI đã ở quanh bạn từ rất lâu rồi: gợi ý tìm kiếm khi bạn gõ Google, gợi ý phim khi bạn mở Netflix, bộ lọc spam trong email — tất cả đều là AI.
>
> Nhưng 2-3 năm trở lại đây có một điều khác biệt: AI không còn "ẩn mình" nữa. Giờ đây bạn có thể **trực tiếp trò chuyện** với AI — hỏi nó bất cứ điều gì, nhờ nó viết, nhờ nó phân tích, nhờ nó lên kế hoạch — như đang nhắn tin với một người bạn cực kỳ hiểu biết.
>
> [Demo trực tiếp: mở ChatGPT hoặc Claude, gõ 1 câu hỏi đơn giản, cho học viên xem kết quả trả về ngay lập tức]
>
> Đây chính là điều khiến AI khác hẳn mọi công nghệ trước đây — bạn không cần học code, không cần hiểu kỹ thuật, chỉ cần biết cách **trò chuyện** là đã có thể khai thác được sức mạnh của nó.

**[Phần 2: 3 lý do nên học ngay bây giờ — 3:00-6:00]**

> Vậy tại sao nên học ngay hôm nay, thay vì chờ đến khi "rảnh hơn"? Mình có 3 lý do:
>
> **Lý do 1 — Khoảng cách đang giãn ra rất nhanh.** Người biết dùng AI hiệu quả đang hoàn thành công việc nhanh hơn, chất lượng hơn — không phải vì họ giỏi hơn bạn, mà vì họ có thêm 1 công cụ mạnh trong tay. Bạn học càng sớm, khoảng cách đó càng dễ thu hẹp.
>
> **Lý do 2 — Học AI dễ hơn bạn nghĩ rất nhiều.** Không giống như học lập trình hay học ngoại ngữ mất nhiều năm, chỉ cần vài giờ thực hành đúng cách, bạn đã có thể dùng AI thành thạo cho phần lớn công việc hàng ngày. Đó chính xác là những gì khóa học này sẽ mang lại.
>
> **Lý do 3 — Bạn không cần "giỏi công nghệ" để bắt đầu.** Nếu bạn biết nhắn tin, biết gõ chữ — bạn đã có đủ kỹ năng để bắt đầu học AI. Đây là điều mình sẽ chứng minh cho bạn thấy ngay trong những bài học tiếp theo.

**[Kết bài — 6:00-7:00]**

> Trong bài tiếp theo, chúng ta sẽ cùng "vẽ bản đồ" các loại AI phổ biến hiện nay — chatbot, tạo ảnh, tạo video, AI Agent — để bạn hiểu rõ mình sẽ học gì và dùng công cụ nào cho việc gì.
>
> Trước khi qua bài tiếp theo, mình có 1 tài liệu ngắn bên dưới video này — "AI là gì? Giải thích cho người không rành kỹ thuật" — đọc thêm 5 phút để củng cố lại những gì vừa học. Hẹn gặp bạn ở bài 2!

## Tài liệu đi kèm
- [AI là gì? Giải thích cho người không rành kỹ thuật] (CKOS — Tài liệu 1)

## Ghi chú sản xuất video
- Cần 1 đoạn demo màn hình thực tế (screen recording) mở ChatGPT/Claude và gõ 1 câu hỏi đơn giản, ví dụ: "Gợi ý cho tôi 3 việc AI có thể giúp trong công việc văn phòng"
- Giọng điệu: gần gũi, như đang trò chuyện trực tiếp với 1 người bạn — không đọc kịch bản một cách máy móc', 8, true
from public.course_sections s where s.course_id='ai-cho-nguoi-moi-bat-dau' and s.title='Chương 1 — Làm quen với AI';

insert into public.course_lessons (section_id, title, sort_order, status, content, duration_minutes, is_free_preview)
select s.id, 'Bài 2: Các loại AI phổ biến: Chatbot, tạo ảnh, tạo video, AI Agent', 2, 'Published', '# Bài 2: Các loại AI phổ biến: Chatbot, tạo ảnh, tạo video, AI Agent

## Mục tiêu bài học
Học viên phân biệt được 4 loại AI phổ biến nhất hiện nay, biết loại nào dùng cho việc gì — tránh nhầm lẫn khi bắt đầu khám phá thêm các công cụ khác ngoài khóa học.

## Kịch bản

**[Mở đầu — 0:00-0:40]**

> Ở bài trước, bạn đã thấy AI có thể trò chuyện và trả lời câu hỏi. Nhưng đó chỉ là 1 trong 4 "nhóm" AI phổ biến nhất hiện nay. Hôm nay mình sẽ vẽ cho bạn một bản đồ tổng quan — để sau bài học này, bất cứ khi nào nghe ai nhắc đến 1 công cụ AI mới, bạn sẽ biết ngay nó thuộc nhóm nào và dùng để làm gì.

**[Phần 1: Chatbot / Trợ lý AI — 0:40-2:30]**

> Nhóm đầu tiên, cũng là nhóm bạn đã làm quen ở bài trước: **Chatbot hay Trợ lý AI** — như ChatGPT, Claude, Gemini. Đây là nhóm bạn "trò chuyện" trực tiếp bằng chữ, và AI trả lời lại bằng chữ.
>
> [Demo: gõ 1 câu hỏi vào Claude/ChatGPT, cho xem kết quả]
>
> Nhóm này dùng để: viết, tóm tắt, tra cứu, brainstorm, phân tích — gần như là công cụ "đa năng" nhất, và cũng là nhóm bạn sẽ dùng nhiều nhất trong khóa học này.

**[Phần 2: Tạo ảnh AI — 2:30-4:30]**

> Nhóm thứ hai: **AI tạo ảnh** — như Midjourney, DALL·E. Thay vì trả lời bằng chữ, bạn mô tả bằng chữ, và AI "vẽ" ra hình ảnh cho bạn.
>
> [Demo: gõ 1 mô tả đơn giản, cho xem ảnh AI tạo ra]
>
> Nhóm này rất hữu ích khi bạn cần hình minh họa cho bài viết, mạng xã hội, hoặc thiết kế nhanh mà không cần biết vẽ hay dùng phần mềm thiết kế phức tạp.

**[Phần 3: Tạo video AI — 4:30-6:00]**

> Nhóm thứ ba: **AI tạo video** — như Runway, CapCut AI, HeyGen. Nhóm này giúp bạn tạo video từ văn bản hoặc hình ảnh, thậm chí có cả "người dẫn" AI nói chuyện thay bạn.
>
> Đây là nhóm phát triển rất nhanh gần đây — trước kia làm 1 video cần rất nhiều công đoạn, giờ nhiều bước có thể để AI hỗ trợ, rút ngắn thời gian đáng kể.

**[Phần 4: AI Agent — 6:00-8:00]**

> Nhóm cuối cùng, cũng là nhóm nâng cao nhất: **AI Agent**. Khác với chatbot chỉ trả lời khi bạn hỏi, AI Agent có thể **tự động thực hiện cả một chuỗi công việc** thay bạn — ví dụ tự đọc email, tự trả lời, tự cập nhật vào bảng tính.
>
> Đây là nội dung nâng cao mình sẽ dành riêng cho các bạn học Premium sau này — trong khóa nhập môn này, bạn chỉ cần biết khái niệm này tồn tại, và nó là "đích đến" khi bạn đã thành thạo AI cơ bản.

**[Kết bài — 8:00-9:00]**

> Vậy là bạn đã có bản đồ tổng quan về 4 nhóm AI phổ biến nhất. Trong khóa nhập môn này, chúng ta sẽ tập trung chủ yếu vào nhóm đầu tiên — Chatbot/Trợ lý AI — vì đây là nền tảng quan trọng nhất để bắt đầu.
>
> Bài tiếp theo, chúng ta sẽ bắt tay vào cài đặt và làm quen thực sự với ChatGPT hoặc Claude — chuẩn bị sẵn máy tính hoặc điện thoại của bạn nhé!

## Tài liệu đi kèm
- [30 Công cụ AI đáng dùng trong công việc] (CKOS — Tài liệu 7, phần liên quan đến từng nhóm)

## Ghi chú sản xuất video
- Cần 4 đoạn demo ngắn (mỗi nhóm 1 đoạn): chatbot, tạo ảnh, tạo video (có thể dùng video mẫu có sẵn nếu chưa có tài khoản), AI Agent (dùng hình ảnh minh họa sơ đồ thay vì demo trực tiếp vì phức tạp)', 10, true
from public.course_sections s where s.course_id='ai-cho-nguoi-moi-bat-dau' and s.title='Chương 1 — Làm quen với AI';

insert into public.course_lessons (section_id, title, sort_order, status, content, duration_minutes, is_free_preview)
select s.id, 'Bài 3: Cài đặt & làm quen ChatGPT / Claude', 3, 'Published', '# Bài 3: Cài đặt & làm quen ChatGPT / Claude

## Mục tiêu bài học
Học viên tự tay tạo được tài khoản và gửi thành công tin nhắn đầu tiên cho AI trong lúc xem video — biến lý thuyết thành hành động ngay lập tức.

## Kịch bản

**[Mở đầu — 0:00-0:30]**

> Đây là bài học đầu tiên bạn sẽ "làm theo" trực tiếp cùng mình, không chỉ xem. Chuẩn bị sẵn điện thoại hoặc máy tính, mở trình duyệt lên — chúng ta bắt đầu nhé!

**[Phần 1: Chọn công cụ để bắt đầu — 0:30-1:30]**

> Trong khóa học này, mình sẽ hướng dẫn bạn 2 lựa chọn phổ biến nhất: ChatGPT và Claude. Bạn không cần dùng cả 2 — chọn 1 trong 2 để bắt đầu, sau này có thể thử công cụ còn lại cũng không sao.
>
> Nếu bạn chưa biết chọn cái nào, mình gợi ý: cứ chọn ChatGPT nếu bạn muốn công cụ phổ biến, đa năng; chọn Claude nếu bạn thường xuyên cần viết lách hoặc đọc tài liệu dài. Cả hai đều có bản miễn phí đủ dùng để học theo khóa này.

**[Phần 2: Hướng dẫn cài đặt từng bước — 1:30-6:00]**

> [Demo màn hình trực tiếp, làm theo từng bước sau]
>
> Bước 1: Mở trình duyệt, gõ địa chỉ chính thức (chatgpt.com hoặc claude.ai) — lưu ý chỉ dùng trang chính thức để đảm bảo an toàn.
>
> Bước 2: Chọn "Đăng ký" (Sign up), có thể dùng email hoặc tài khoản Google có sẵn để đăng ký nhanh hơn.
>
> Bước 3: Xác nhận email nếu được yêu cầu — kiểm tra hộp thư và bấm vào link xác nhận.
>
> Bước 4: Sau khi đăng nhập thành công, bạn sẽ thấy giao diện chính — 1 ô để gõ tin nhắn ở giữa hoặc phía dưới màn hình.
>
> Dừng video lại ở đây nếu bạn cần thêm thời gian hoàn thành các bước trên — khi nào xong, tiếp tục xem tiếp nhé!

**[Phần 3: Làm quen giao diện cơ bản — 6:00-8:00]**

> Giờ hãy cùng làm quen với những phần quan trọng nhất trên giao diện:
> - Ô nhập tin nhắn — nơi bạn gõ câu hỏi/yêu cầu
> - Nút gửi (hoặc phím Enter) — gửi tin nhắn đi
> - Lịch sử trò chuyện (thường ở thanh bên trái) — nơi lưu lại các cuộc trò chuyện trước đó để xem lại
> - Nút "New chat" — bắt đầu 1 cuộc trò chuyện hoàn toàn mới, không liên quan tới cuộc trước

**[Phần 4: Gửi tin nhắn đầu tiên — 8:00-9:30]**

> Bây giờ, hãy cùng gõ tin nhắn đầu tiên. Gõ theo mình: *"Xin chào, tôi mới bắt đầu học cách dùng AI. Bạn có thể giới thiệu ngắn gọn bạn có thể giúp tôi những gì không?"*
>
> [Demo: gõ và gửi, đọc phản hồi cùng học viên]
>
> Chúc mừng bạn — đây chính là tin nhắn AI đầu tiên trong hành trình học AI của bạn!

**[Kết bài — 9:30-10:00]**

> Bài tiếp theo, chúng ta sẽ học cách đặt câu hỏi sao cho AI hiểu đúng ý bạn nhất — vì cách hỏi khác nhau sẽ tạo ra kết quả rất khác nhau. Hẹn gặp lại ở bài 4!

## Tài liệu đi kèm
- [Checklist cài đặt ChatGPT/Claude] (CKOS — Tài liệu 13, danh mục Công cụ AI)

## Ghi chú sản xuất video
- Bắt buộc có screen recording đầy đủ từng bước cài đặt thật (không dùng ảnh chụp tĩnh) để học viên làm theo chính xác
- Cần cập nhật lại video nếu giao diện đăng ký của ChatGPT/Claude thay đổi trong tương lai — đánh dấu bài này cần rà soát định kỳ mỗi 6 tháng', 10, true
from public.course_sections s where s.course_id='ai-cho-nguoi-moi-bat-dau' and s.title='Chương 1 — Làm quen với AI';

insert into public.course_lessons (section_id, title, sort_order, status, content, duration_minutes, is_free_preview)
select s.id, 'Bài 4: Cách đặt câu hỏi để AI hiểu đúng ý bạn', 4, 'Published', '# Bài 4: Cách đặt câu hỏi để AI hiểu đúng ý bạn

## Mục tiêu bài học
Học viên tự viết được ít nhất 1 prompt "tử tế" theo công thức 4 yếu tố ngay trong lúc xem video, và hiểu vì sao cách hỏi quyết định chất lượng câu trả lời.

## Kịch bản

**[Mở đầu — 0:00-0:40]**

> Bạn đã gửi tin nhắn đầu tiên ở bài trước — chúc mừng! Nhưng có một bí mật nhỏ: cùng một câu hỏi, cách hỏi khác nhau sẽ cho ra kết quả khác nhau **rất nhiều**. Hôm nay mình sẽ chỉ bạn công thức đơn giản để luôn hỏi đúng cách.

**[Phần 1: So sánh prompt tệ và tốt — 0:40-3:00]**

> Hãy thử ví dụ này. Nếu bạn gõ: *"Viết cho tôi caption Facebook"* — [demo gõ vào AI, đọc kết quả] — bạn thấy đấy, kết quả khá chung chung, không biết viết về cái gì, cho ai, giọng điệu ra sao.
>
> Giờ thử lại với cách hỏi rõ ràng hơn: *"Viết 1 caption Facebook giới thiệu quán cà phê mới mở, giọng văn gần gũi vui vẻ, nhắm đến giới trẻ, 3-4 câu, kết thúc bằng câu hỏi"* — [demo gõ vào AI, đọc kết quả] — bạn thấy khác biệt rõ ràng chưa? Kết quả này gần như dùng được ngay.

**[Phần 2: Công thức 4 yếu tố — 3:00-5:30]**

> Bí quyết nằm ở 4 yếu tố mà câu hỏi thứ hai có nhưng câu đầu không có:
>
> **① Làm gì** — bạn muốn AI làm cụ thể việc gì (viết caption, tóm tắt, phân tích...)
> **② Cho ai** — đối tượng hướng đến là ai (khách hàng, đồng nghiệp, bạn bè...)
> **③ Giọng điệu thế nào** — trang trọng, gần gũi, hài hước, chuyên nghiệp...
> **④ Định dạng ra sao** — độ dài, số lượng, cấu trúc mong muốn
>
> Bạn không cần nhớ thuộc lòng — chỉ cần mỗi lần hỏi AI, tự hỏi mình 4 câu này trước khi gõ, kết quả sẽ tốt hơn rất nhiều.

**[Phần 3: Thực hành cùng nhau — 5:30-7:30]**

> Giờ đến lượt bạn. Hãy nghĩ về 1 việc bạn đang cần AI giúp — có thể là viết email, hoặc tóm tắt gì đó. Áp dụng công thức 4 yếu tố, gõ ra câu hỏi của riêng bạn.
>
> [Tạm dừng video 30 giây để học viên tự viết]
>
> Gửi đi và xem kết quả — nếu chưa vừa ý, thử thêm chi tiết vào 1 trong 4 yếu tố và hỏi lại. Đây chính là cách những người dùng AI thành thạo vẫn làm mỗi ngày.

**[Kết bài — 7:30-8:00]**

> Công thức 4 yếu tố này sẽ theo bạn suốt cả khóa học — càng thực hành nhiều, bạn sẽ càng làm chủ nó một cách tự nhiên. Bài tiếp theo, chúng ta chuyển sang ứng dụng thực tế đầu tiên: dùng AI để viết email và tóm tắt văn bản.

## Tài liệu đi kèm
- [10 Prompt AI hiệu quả cho Content Marketing] (CKOS — Tài liệu 3)

## Ghi chú sản xuất video
- Cần 2 đoạn demo so sánh trực tiếp (prompt tệ vs tốt) với cùng 1 AI để học viên thấy rõ khác biệt
- Có đoạn "tạm dừng" 30 giây — cân nhắc thêm hiệu ứng đếm ngược trên màn hình để học viên biết đây là lúc tự thực hành', 8, true
from public.course_sections s where s.course_id='ai-cho-nguoi-moi-bat-dau' and s.title='Chương 1 — Làm quen với AI';

insert into public.course_lessons (section_id, title, sort_order, status, content, duration_minutes, is_free_preview)
select s.id, 'Bài 5: Dùng AI để viết email, tóm tắt văn bản', 5, 'Published', '# Bài 5: Dùng AI để viết email, tóm tắt văn bản

## Mục tiêu bài học
Học viên thực hành được 2 việc dùng AI phổ biến nhất trong công việc văn phòng: soạn email và tóm tắt văn bản dài.

## Kịch bản

**[Mở đầu — 0:00-0:30]**

> Từ bài này, chúng ta bắt đầu chương 2 — áp dụng những gì đã học vào việc thật. Hôm nay là 2 việc bạn có thể dùng ngay từ ngày mai: viết email và tóm tắt văn bản.

**[Phần 1: Dùng AI viết email — 0:30-3:30]**

> Email là việc tốn thời gian nhất trong ngày làm việc của nhiều người — không phải vì khó, mà vì mất thời gian chọn từ ngữ sao cho phù hợp.
>
> [Demo trực tiếp: viết prompt yêu cầu AI soạn 1 email thật, ví dụ xin dời lịch họp]
>
> *"Viết giúp tôi 1 email xin dời lịch họp với khách hàng từ thứ 3 sang thứ 5 tuần này, lý do bận công việc đột xuất, giọng văn lịch sự chuyên nghiệp"*
>
> [Đọc kết quả AI trả về, chỉnh sửa nhẹ nếu cần]
>
> Bạn thấy đấy — chỉ mất vài giây thay vì phải ngồi nghĩ cách diễn đạt sao cho lịch sự mà vẫn rõ ràng. Mẹo nhỏ: luôn đọc lại và chỉnh sửa cho phù hợp với tình huống cụ thể của bạn trước khi gửi.

**[Phần 2: Dùng AI tóm tắt văn bản dài — 3:30-6:30]**

> Việc thứ hai: tóm tắt. Giả sử bạn nhận được 1 bài báo dài hoặc 1 tài liệu nhiều trang cần đọc gấp.
>
> [Demo: dán 1 đoạn văn bản dài vào AI]
>
> *"Tóm tắt đoạn văn bản sau thành 3 ý chính, dễ hiểu: [dán nội dung]"*
>
> [Đọc kết quả tóm tắt]
>
> Chỉ trong vài giây, bạn đã nắm được ý chính của cả 1 trang tài liệu — tiết kiệm rất nhiều thời gian đọc, đặc biệt hữu ích khi bạn cần xử lý nhiều tài liệu trong ngày.

**[Phần 3: Lưu ý quan trọng — 6:30-7:30]**

> Một lưu ý nhỏ: với những email hoặc tài liệu quan trọng (hợp đồng, thông tin nhạy cảm), luôn đọc kỹ lại kết quả AI đưa ra trước khi dùng — AI có thể bỏ sót chi tiết nhỏ mà chỉ bạn mới biết là quan trọng trong tình huống cụ thể của mình.

**[Kết bài — 7:30-8:00]**

> Hai kỹ năng này sẽ giúp bạn tiết kiệm hàng chục phút mỗi ngày ngay từ hôm nay. Bài tiếp theo, chúng ta sẽ học cách dùng AI để tìm kiếm thông tin và học kiến thức mới hiệu quả hơn cách tra Google truyền thống.

## Tài liệu đi kèm
- [5 cách dùng AI tăng năng suất công việc mỗi ngày] (CKOS — Tài liệu 5, mục 2)

## Ghi chú sản xuất video
- Cần 2 demo thật với ví dụ cụ thể, gần gũi với người đi làm văn phòng Việt Nam
- Có thể dùng 1 bài báo tiếng Việt thật (đã xin phép hoặc dùng nội dung tự viết) để demo tóm tắt cho chân thực', 8, true
from public.course_sections s where s.course_id='ai-cho-nguoi-moi-bat-dau' and s.title='Chương 2 — Dùng AI cho việc hàng ngày';

insert into public.course_lessons (section_id, title, sort_order, status, content, duration_minutes, is_free_preview)
select s.id, 'Bài 6: Dùng AI để tìm kiếm thông tin & học kiến thức mới', 6, 'Published', '# Bài 6: Dùng AI để tìm kiếm thông tin & học kiến thức mới

## Mục tiêu bài học
Học viên biết cách dùng AI để học 1 khái niệm mới hiệu quả hơn tra Google truyền thống, và hiểu khi nào nên dùng AI, khi nào vẫn nên tìm kiếm truyền thống.

## Kịch bản

**[Mở đầu — 0:00-0:30]**

> Bạn đã quen tra Google mỗi khi cần tìm hiểu điều gì đó. Hôm nay mình sẽ chỉ bạn một cách khác — đôi khi nhanh và dễ hiểu hơn nhiều — dùng AI để học kiến thức mới.

**[Phần 1: Khác biệt giữa tra Google và hỏi AI — 0:30-2:30]**

> Khi bạn tra Google, bạn nhận về hàng chục kết quả, phải tự đọc, tự chọn lọc, tự tổng hợp lại thành hiểu biết của mình.
>
> Khi bạn hỏi AI, nó **tổng hợp sẵn** kiến thức và giải thích trực tiếp theo đúng trình độ bạn cần — như có 1 người thầy riêng giải thích ngay lập tức, thay vì bạn phải tự mò mẫm giữa nhiều nguồn.
>
> [Demo: hỏi AI giải thích 1 khái niệm bất kỳ, ví dụ "lạm phát là gì"]

**[Phần 2: Mẹo hỏi để AI giải thích dễ hiểu hơn — 2:30-5:00]**

> Bí quyết để AI giải thích đúng theo trình độ của bạn — hãy nói rõ:
>
> *"Giải thích [khái niệm] cho tôi như đang nói chuyện với người hoàn toàn không biết gì về lĩnh vực này, dùng ví dụ đời thường dễ hiểu"*
>
> [Demo với ví dụ cụ thể hơn]
>
> Nếu câu trả lời vẫn còn khó hiểu, đừng ngại hỏi lại: *"Bạn giải thích lại đơn giản hơn được không?"* hoặc *"Cho tôi 1 ví dụ cụ thể hơn"* — AI sẽ điều chỉnh ngay lập tức, không giống như đọc 1 bài viết cố định trên Google.

**[Phần 3: Khi nào vẫn nên tra Google truyền thống — 5:00-6:30]**

> Nhắc lại từ bài học về "ảo giác AI" mà chúng ta sẽ học kỹ hơn ở Bài 8: với những thông tin cần độ chính xác cao (tin tức mới nhất, số liệu thống kê, sự kiện cụ thể), vẫn nên kết hợp tra cứu thêm nguồn đáng tin cậy, không chỉ dựa hoàn toàn vào AI.
>
> Cách dùng tốt nhất: dùng AI để **hiểu khái niệm nhanh**, dùng Google/nguồn chính thống để **kiểm chứng thông tin cụ thể**.

**[Kết bài — 6:30-7:00]**

> Từ giờ, mỗi khi gặp 1 khái niệm bạn chưa hiểu, hãy thử hỏi AI trước — bạn sẽ ngạc nhiên vì tốc độ và sự rõ ràng. Bài tiếp theo, chúng ta sẽ học cách dùng AI để lên kế hoạch công việc và cuộc sống.

## Tài liệu đi kèm
- (Liên kết ngược Bài 1 — không có tài liệu CKOS riêng)

## Ghi chú sản xuất video
- Chọn khái niệm demo nên gần gũi, dễ liên hệ với đa số học viên (tài chính cá nhân, sức khỏe, hoặc chủ đề đời thường) thay vì quá học thuật', 7, true
from public.course_sections s where s.course_id='ai-cho-nguoi-moi-bat-dau' and s.title='Chương 2 — Dùng AI cho việc hàng ngày';

insert into public.course_lessons (section_id, title, sort_order, status, content, duration_minutes, is_free_preview)
select s.id, 'Bài 7: Dùng AI để lên kế hoạch công việc/cuộc sống', 7, 'Published', '# Bài 7: Dùng AI để lên kế hoạch công việc/cuộc sống

## Mục tiêu bài học
Học viên thực hành lên được 1 kế hoạch cụ thể (công việc hoặc cá nhân) với sự hỗ trợ của AI ngay trong buổi học.

## Kịch bản

**[Mở đầu — 0:00-0:30]**

> Bạn đã từng có những ngày nhìn vào danh sách việc cần làm mà không biết bắt đầu từ đâu chưa? Hôm nay AI sẽ giúp bạn giải quyết chính xác vấn đề này.

**[Phần 1: Lên kế hoạch 1 ngày làm việc — 0:30-3:00]**

> [Demo trực tiếp]
>
> *"Đây là danh sách việc tôi cần làm hôm nay: trả lời email khách hàng, chuẩn bị báo cáo tuần, họp với team lúc 2 giờ chiều, gọi điện cho nhà cung cấp. Giúp tôi sắp xếp thứ tự ưu tiên, gợi ý việc nào nên làm buổi sáng khi tập trung tốt nhất."*
>
> [Đọc kết quả AI gợi ý]
>
> Chỉ 2 phút, bạn đã có 1 kế hoạch rõ ràng thay vì cảm giác rối bời không biết bắt đầu từ đâu.

**[Phần 2: Lên kế hoạch cho mục tiêu lớn hơn — 3:00-5:30]**

> AI không chỉ giúp lên kế hoạch 1 ngày — mà cả những mục tiêu dài hơi hơn. Ví dụ:
>
> *"Tôi muốn học tiếng Anh giao tiếp cơ bản trong 3 tháng, mỗi ngày chỉ có 30 phút rảnh. Gợi ý cho tôi 1 lộ trình học cụ thể theo tuần."*
>
> [Đọc kết quả]
>
> Bạn có thể áp dụng cách này cho bất kỳ mục tiêu nào — học kỹ năng mới, tiết kiệm tiền, tập thể dục — AI sẽ giúp bạn chia nhỏ mục tiêu lớn thành các bước cụ thể, dễ thực hiện hơn.

**[Phần 3: Lưu ý khi dùng AI lên kế hoạch — 5:30-6:30]**

> Kế hoạch AI đưa ra là **gợi ý khởi điểm**, không phải quy tắc cứng nhắc. Hãy điều chỉnh theo hoàn cảnh thực tế của bạn — AI không biết hết những ràng buộc riêng trong cuộc sống bạn, chỉ bạn mới biết rõ điều đó.

**[Kết bài — 6:30-7:00]**

> Thử áp dụng ngay hôm nay — lên kế hoạch cho ngày mai của bạn với AI trước khi đi ngủ tối nay. Bài tiếp theo, chúng ta sẽ học một điều rất quan trọng: cách nhận diện khi AI trả lời sai.

## Tài liệu đi kèm
- [5 cách dùng AI tăng năng suất công việc mỗi ngày] (CKOS — Tài liệu 5, mục 1 & 5)

## Ghi chú sản xuất video
- Demo nên dùng ví dụ công việc gần gũi với đối tượng đa số học viên (văn phòng, kinh doanh nhỏ)', 7, true
from public.course_sections s where s.course_id='ai-cho-nguoi-moi-bat-dau' and s.title='Chương 2 — Dùng AI cho việc hàng ngày';

insert into public.course_lessons (section_id, title, sort_order, status, content, duration_minutes, is_free_preview)
select s.id, 'Bài 8: Nhận diện thông tin sai lệch do AI tạo ra ("ảo giác AI")', 8, 'Published', '# Bài 8: Nhận diện thông tin sai lệch do AI tạo ra ("ảo giác AI")

## Mục tiêu bài học
Học viên hiểu AI có thể trả lời sai một cách tự tin, biết cách nhận diện và kiểm chứng — trang bị tư duy an toàn ngay từ giai đoạn nhập môn.

## Kịch bản

**[Mở đầu — 0:00-0:40]**

> Đây là bài học mình cho là quan trọng nhất trong cả chương 2 — không phải vì nó dạy bạn kỹ năng mới, mà vì nó bảo vệ bạn khỏi một rủi ro mà rất nhiều người dùng AI mỗi ngày vẫn chưa biết.

**[Phần 1: Demo AI trả lời sai một cách tự tin — 0:40-3:00]**

> [Demo trực tiếp: hỏi AI về 1 chi tiết cụ thể mà nó có khả năng trả lời sai, ví dụ hỏi về 1 cuốn sách/sự kiện ít phổ biến]
>
> Bạn thấy không — AI trả lời rất tự tin, rất mạch lạc, đọc lên hoàn toàn hợp lý. Nhưng thực tế [giải thích điểm sai nếu có]. Đây chính là hiện tượng gọi là **"ảo giác AI"** — AI không cố tình nói dối, nó chỉ đang tạo ra câu trả lời nghe hợp lý dựa trên khuôn mẫu ngôn ngữ, chứ không phải đang tra cứu sự thật.

**[Phần 2: Vì sao điều này xảy ra — 3:00-4:30]**

> Nhớ lại bài học đầu tiên: AI dự đoán từ tiếp theo dựa trên những gì nó đã học, không phải tra cứu trong 1 cuốn từ điển. Vì vậy, với những thông tin nó không chắc chắn, thay vì nói "tôi không biết", nó có thể "đoán" ra 1 câu trả lời nghe rất thuyết phục.

**[Phần 3: Cách nhận diện và kiểm chứng — 4:30-7:00]**

> 3 cách đơn giản để tự bảo vệ mình:
>
> **Một:** Với số liệu, ngày tháng, tên riêng cụ thể — luôn kiểm chứng lại qua nguồn khác trước khi dùng cho việc quan trọng.
>
> **Hai:** Hỏi ngược lại AI: *"Bạn có chắc chắn về thông tin này không?"* — đôi khi AI sẽ tự nhận ra và điều chỉnh.
>
> **Ba:** Nếu có thể, dùng công cụ có bật tìm kiếm web (như Perplexity, hoặc ChatGPT/Claude có bật search) để AI trích dẫn nguồn thật, bạn có thể click kiểm tra trực tiếp.

**[Kết bài — 7:00-8:00]**

> Đừng để bài học này khiến bạn e ngại dùng AI — ngược lại, hiểu được điều này giúp bạn dùng AI tự tin và an toàn hơn rất nhiều. Có một tài liệu chuyên sâu hơn về chủ đề này bên dưới video, mình khuyến khích bạn đọc thêm. Bài tiếp theo, chúng ta chuyển sang chương thực hành mở rộng — bắt đầu với AI tạo hình ảnh.

## Tài liệu đi kèm
- [Tư duy phản biện khi làm việc cùng AI] (CKOS — Tài liệu 9)

## Ghi chú sản xuất video
- Cần chọn kỹ ví dụ demo — nên test trước để đảm bảo AI thực sự trả lời sai theo đúng kịch bản minh họa, tránh trường hợp AI vô tình trả lời đúng làm mất tính minh họa
- Giọng điệu: nghiêm túc hơn các bài trước 1 chút vì đây là nội dung an toàn quan trọng, nhưng vẫn giữ sự gần gũi, tránh gây hoang mang quá mức', 8, true
from public.course_sections s where s.course_id='ai-cho-nguoi-moi-bat-dau' and s.title='Chương 2 — Dùng AI cho việc hàng ngày';

insert into public.course_lessons (section_id, title, sort_order, status, content, duration_minutes, is_free_preview)
select s.id, 'Bài 9: Dùng AI tạo hình ảnh cơ bản', 9, 'Published', '# Bài 9: Dùng AI tạo hình ảnh cơ bản

## Mục tiêu bài học
Học viên tự tạo được ít nhất 1 hình ảnh bằng AI trong lúc xem video, hiểu cách viết mô tả (prompt) cho AI tạo ảnh.

## Kịch bản

**[Mở đầu — 0:00-0:30]**

> Chúng ta bước sang chương 3 — thực hành mở rộng. Hôm nay, thay vì chỉ làm việc với chữ, bạn sẽ thử tạo ra hình ảnh đầu tiên bằng AI — không cần biết vẽ, không cần phần mềm thiết kế phức tạp.

**[Phần 1: Giới thiệu công cụ tạo ảnh — 0:30-1:30]**

> Nhắc lại từ Bài 2, có nhiều công cụ tạo ảnh AI như Midjourney, DALL·E, Leonardo AI. Hôm nay mình sẽ demo bằng DALL·E vì có thể dùng ngay trong ChatGPT mà không cần cài thêm gì.

**[Phần 2: Viết prompt tạo ảnh — 1:30-5:00]**

> [Demo trực tiếp]
>
> Mô tả ảnh cho AI cũng cần rõ ràng, tương tự công thức đã học ở Bài 4 nhưng áp dụng cho hình ảnh: **chủ thể** (là gì/ai), **bối cảnh** (ở đâu), **phong cách** (thực tế, hoạt hình, tối giản...), **màu sắc/không khí** mong muốn.
>
> Ví dụ: *"Một quán cà phê nhỏ ấm cúng buổi sáng, ánh nắng chiếu qua cửa sổ, phong cách chụp ảnh thực tế, tông màu ấm"*
>
> [Đọc/xem kết quả AI tạo ra]
>
> Nếu ảnh chưa vừa ý, bạn có thể yêu cầu AI tạo lại với mô tả chi tiết hơn, hoặc chỉnh sửa 1 phần: *"Giữ nguyên bối cảnh nhưng đổi sang buổi tối"*.

**[Phần 3: Ứng dụng thực tế — 5:00-7:00]**

> Bạn có thể dùng kỹ năng này để: tạo ảnh minh họa cho bài viết mạng xã hội, tạo hình đại diện độc đáo, minh họa ý tưởng khi thuyết trình, hay đơn giản là thỏa sức sáng tạo cho vui.
>
> [Demo thêm 1 ví dụ ứng dụng thực tế, ví dụ tạo ảnh cho 1 bài đăng Facebook]

**[Kết bài — 7:00-8:00]**

> Chúc mừng bạn đã tạo ra hình ảnh AI đầu tiên! Bài tiếp theo, chúng ta sẽ xem cách áp dụng AI vào công việc cụ thể theo từng ngành nghề khác nhau.

## Tài liệu đi kèm
- [30 Công cụ AI đáng dùng trong công việc] (CKOS — Tài liệu 7, nhóm Hình ảnh & thiết kế)

## Ghi chú sản xuất video
- Cần demo thực tế quá trình tạo ảnh, không dùng ảnh có sẵn — để học viên thấy đúng quy trình thật
- Chọn ví dụ mô tả ảnh gần gũi, dễ liên tưởng với bối cảnh Việt Nam', 8, true
from public.course_sections s where s.course_id='ai-cho-nguoi-moi-bat-dau' and s.title='Chương 3 — Thực hành mở rộng';

insert into public.course_lessons (section_id, title, sort_order, status, content, duration_minutes, is_free_preview)
select s.id, 'Bài 10: Dùng AI hỗ trợ công việc theo ngành nghề của bạn', 10, 'Published', '# Bài 10: Dùng AI hỗ trợ công việc theo ngành nghề của bạn

## Mục tiêu bài học
Học viên nhìn thấy ví dụ ứng dụng AI cụ thể gần với ngành nghề của chính họ, tự tin hình dung cách áp dụng vào công việc thật.

## Kịch bản

**[Mở đầu — 0:00-0:40]**

> Đến giờ, bạn đã học được khá nhiều kỹ năng nền tảng. Hôm nay, mình muốn cho bạn thấy những kỹ năng đó áp dụng cụ thể ra sao trong từng ngành nghề khác nhau — để bạn thấy rõ AI không chỉ là lý thuyết, mà thực sự hữu ích cho đúng công việc của bạn.

**[Phần 1: Nhân viên văn phòng — 0:40-3:00]**

> Nếu bạn làm văn phòng: AI giúp soạn báo cáo nhanh hơn, tóm tắt biên bản họp, trả lời email, và thậm chí phân tích dữ liệu cơ bản trong Excel/Sheets.
>
> [Demo ngắn: 1 ví dụ cụ thể, ví dụ dùng AI phân tích nhanh 1 bảng số liệu đơn giản]

**[Phần 2: Kinh doanh nhỏ / Freelancer — 3:00-5:30]**

> Nếu bạn kinh doanh nhỏ hoặc làm freelancer: AI giúp viết mô tả sản phẩm, trả lời tin nhắn khách hàng nhanh hơn, lên kế hoạch nội dung mạng xã hội, và thậm chí phân tích đối thủ cạnh tranh cơ bản.
>
> [Demo ngắn: viết mô tả sản phẩm bằng AI]

**[Phần 3: Giáo viên / Người làm giáo dục — 5:30-7:30]**

> Nếu bạn làm giáo dục: AI giúp soạn giáo án nhanh hơn, tạo câu hỏi kiểm tra, giải thích khái niệm khó theo nhiều cách khác nhau cho học sinh dễ hiểu.
>
> [Demo ngắn: tạo 5 câu hỏi trắc nghiệm cho 1 chủ đề đơn giản]

**[Phần 4: Ngành khác — 7:30-9:00]**

> Dù bạn làm ngành gì không nằm trong 3 nhóm trên, nguyên tắc vẫn giống nhau: nghĩ về những việc lặp đi lặp lại, tốn thời gian trong công việc của bạn — đó chính là điểm khởi đầu tốt nhất để thử áp dụng AI.

**[Kết bài — 9:00-10:00]**

> Bây giờ đến lượt bạn — hãy thử nghĩ 1 việc cụ thể trong công việc của bạn mà AI có thể giúp, và thử ngay hôm nay. Bài tiếp theo, mình sẽ giới thiệu bạn đến một không gian đặc biệt trong Học viện — nơi bạn có thể thực hành mọi thứ đã học: AI Workspace.

## Tài liệu đi kèm
- (Không có tài liệu CKOS cụ thể — học viên tự áp dụng theo ngành riêng)

## Ghi chú sản xuất video
- Nên khảo sát nhanh đối tượng học viên đăng ký khóa học trước để biết ngành nghề phổ biến nhất, ưu tiên demo đúng ngành đó
- Có thể mở rộng thêm ví dụ ngành khác trong phần mô tả video nếu học viên có ngành đặc thù không được nhắc tới', 10, true
from public.course_sections s where s.course_id='ai-cho-nguoi-moi-bat-dau' and s.title='Chương 3 — Thực hành mở rộng';

insert into public.course_lessons (section_id, title, sort_order, status, content, duration_minutes, is_free_preview)
select s.id, 'Bài 11: Giới thiệu AI Workspace — nơi thực hành mọi thứ vừa học', 11, 'Published', '# Bài 11: Giới thiệu AI Workspace — nơi thực hành mọi thứ vừa học

## Mục tiêu bài học
Học viên biết đến và tạo được dự án đầu tiên trong AI Workspace — cầu nối chuyển từ "học" sang "làm" trong hệ sinh thái Portal.

## Kịch bản

**[Mở đầu — 0:00-0:30]**

> Bạn đã học được rất nhiều kỹ năng qua 10 bài học vừa rồi. Hôm nay, mình muốn giới thiệu bạn đến một không gian đặc biệt trong Portal — nơi bạn có thể gom tất cả những gì đã học lại thành các dự án thực tế: AI Workspace.

**[Phần 1: AI Workspace là gì — 0:30-2:00]**

> [Demo: mở AI Workspace trong Portal]
>
> AI Workspace là nơi bạn: lưu trữ các dự án đang thực hiện, tìm công cụ AI theo từng nhóm nhu cầu, và làm theo các workflow mẫu có sẵn — thay vì phải tự mò mẫm nhớ lại cách làm mỗi lần.

**[Phần 2: Tour nhanh giao diện — 2:00-4:00]**

> [Demo: lướt qua các phần chính]
> - "Công cụ theo nhóm" — tất cả công cụ AI đã học được sắp xếp theo nhu cầu, có link truy cập nhanh
> - "Dự án của bạn" — nơi lưu và theo dõi tiến độ các dự án đang làm
> - "Workflow mẫu" — quy trình từng bước có sẵn cho các việc phổ biến (viết blog, tạo video...)

**[Phần 3: Tạo dự án đầu tiên — 4:00-5:30]**

> [Demo: bấm "Tạo dự án mới", đặt tên dự án, ví dụ "Content Facebook tuần này"]
>
> Đây chính là nơi bạn sẽ áp dụng bài tập tổng hợp ở bài học tiếp theo — hãy tạo sẵn 1 dự án ngay bây giờ để chuẩn bị.

**[Kết bài — 5:30-6:00]**

> Từ giờ, AI Workspace sẽ là "xưởng thực hành" của bạn mỗi khi áp dụng AI vào công việc thật. Bài tiếp theo, chúng ta sẽ cùng làm 1 bài tập tổng hợp — tạo ra 1 sản phẩm hoàn chỉnh bằng AI ngay trong AI Workspace vừa giới thiệu.

## Tài liệu đi kèm
- (Không có — đây là bài "cầu nối" sang mục Workspace, không gắn tài liệu CKOS)

## Ghi chú sản xuất video
- Cần quay demo thật trên giao diện Portal đã hoàn thiện (phối hợp với Claude Code để đảm bảo giao diện đã sẵn sàng trước khi quay bài này)
- Bài này nên quay sau cùng trong đợt sản xuất, vì phụ thuộc vào tiến độ build giao diện AI Workspace', 6, true
from public.course_sections s where s.course_id='ai-cho-nguoi-moi-bat-dau' and s.title='Chương 3 — Thực hành mở rộng';

insert into public.course_lessons (section_id, title, sort_order, status, content, duration_minutes, is_free_preview)
select s.id, 'Bài 12: Thực hành — Tạo 1 sản phẩm nhỏ hoàn chỉnh với AI', 12, 'Published', '# Bài 12: Thực hành — Tạo 1 sản phẩm nhỏ hoàn chỉnh với AI

## Mục tiêu bài học
Học viên tự tay hoàn thành 1 sản phẩm nhỏ (caption + ảnh minh họa) từ đầu đến cuối, tổng hợp toàn bộ kỹ năng đã học từ Bài 1-11.

## Kịch bản

**[Mở đầu — 0:00-0:40]**

> Đây là bài học đặc biệt — không có kiến thức mới, mà là lúc bạn tổng hợp lại mọi thứ đã học thành 1 sản phẩm hoàn chỉnh. Hãy mở AI Workspace và dự án bạn đã tạo ở bài trước, chúng ta bắt đầu nhé.

**[Phần 1: Xác định mục tiêu sản phẩm — 0:40-2:00]**

> Hôm nay chúng ta sẽ tạo: 1 bài đăng Facebook hoàn chỉnh, gồm caption và ảnh minh họa — sản phẩm nhỏ nhưng đủ để bạn thấy được toàn bộ quy trình từ ý tưởng đến hoàn thiện.

**[Phần 2: Bước 1 — Lên ý tưởng bằng AI — 2:00-4:00]**

> [Áp dụng kỹ năng từ Bài 4 và 5]
>
> *"Gợi ý cho tôi 3 ý tưởng nội dung Facebook cho [chủ đề bạn chọn], mục tiêu tăng tương tác"*
>
> [Chọn 1 ý tưởng để tiếp tục]

**[Phần 3: Bước 2 — Viết caption — 4:00-6:30]**

> [Áp dụng công thức 4 yếu tố từ Bài 4]
>
> *"Viết caption Facebook cho ý tưởng vừa chọn, giọng văn [chọn giọng điệu], nhắm đến [đối tượng], kết thúc bằng câu hỏi tương tác"*
>
> [Đọc và tinh chỉnh kết quả]

**[Phần 4: Bước 3 — Tạo ảnh minh họa — 6:30-9:00]**

> [Áp dụng kỹ năng từ Bài 9]
>
> Dựa trên nội dung caption vừa viết, mô tả cho AI tạo 1 ảnh phù hợp — nhớ áp dụng công thức chủ thể, bối cảnh, phong cách, màu sắc.

**[Phần 5: Bước 4 — Kiểm tra lại toàn bộ — 9:00-10:30]**

> Trước khi coi là hoàn thành, hãy tự hỏi (áp dụng bài học từ Bài 8): thông tin trong caption có cần kiểm chứng gì không? Giọng văn có đúng với thương hiệu/cá nhân bạn muốn thể hiện không?

**[Phần 6: Lưu vào Workspace — 10:30-11:30]**

> [Demo: lưu caption và ảnh vào dự án trong AI Workspace]
>
> Vậy là bạn đã hoàn thành sản phẩm đầu tiên hoàn toàn với sự hỗ trợ của AI — từ ý tưởng, viết nội dung, đến hình ảnh minh họa.

**[Kết bài — 11:30-12:00]**

> Đây chính là quy trình bạn có thể lặp lại cho bất kỳ nội dung nào trong tương lai. Chỉ còn 4 bài học nữa là bạn hoàn thành khóa nhập môn — bài tiếp theo, chúng ta sẽ nói về những giới hạn cần nhớ khi dùng AI lâu dài.

## Tài liệu đi kèm
- (Tổng hợp — không có tài liệu mới, học viên áp dụng lại các tài liệu từ Bài 4, 5, 9)

## Ghi chú sản xuất video
- Đây là bài dài nhất trong khóa — cân nhắc chia thành 2 phần nếu cảm thấy quá dài khi quay thật (Phần A: ý tưởng + caption, Phần B: ảnh + hoàn thiện)
- Nên chọn chủ đề demo trung lập, dễ áp dụng cho nhiều ngành nghề khác nhau', 12, true
from public.course_sections s where s.course_id='ai-cho-nguoi-moi-bat-dau' and s.title='Chương 3 — Thực hành mở rộng';

insert into public.course_lessons (section_id, title, sort_order, status, content, duration_minutes, is_free_preview)
select s.id, 'Bài 13: Giới hạn của AI — điều cần nhớ khi dùng AI lâu dài', 13, 'Published', '# Bài 13: Giới hạn của AI — điều cần nhớ khi dùng AI lâu dài

## Mục tiêu bài học
Học viên nắm rõ những gì AI không làm được, để dùng AI bền vững và đúng mực trong dài hạn, tránh phụ thuộc quá mức.

## Kịch bản

**[Mở đầu — 0:00-0:30]**

> Sau 12 bài học, bạn đã thấy AI có thể làm được rất nhiều điều. Nhưng để dùng AI một cách bền vững và khôn ngoan, bạn cũng cần biết rõ những gì nó **không** làm được.

**[Phần 1: 4 giới hạn quan trọng — 0:30-4:00]**

> **Một — AI không biết thông tin mới nhất** (trừ khi có bật tìm kiếm web). Với tin tức, sự kiện gần đây, luôn kiểm tra thêm nguồn khác.
>
> **Hai — AI không có trải nghiệm thực tế.** Nó mô tả dựa trên văn bản đã học, không phải đã thực sự trải nghiệm — hữu ích để tham khảo, nhưng đừng thay thế hoàn toàn ý kiến người có kinh nghiệm thật.
>
> **Ba — AI không chịu trách nhiệm cho quyết định của bạn.** Với việc quan trọng (tài chính, pháp lý, sức khỏe), AI chỉ nên là bước tham khảo đầu, không phải quyết định cuối cùng.
>
> **Bốn — AI có thể mang thiên kiến từ dữ liệu nó học.** Không phải lúc nào cũng hoàn toàn khách quan — giữ tư duy phản biện như đã học ở Bài 8.

**[Phần 2: Vì sao hiểu giới hạn giúp bạn dùng AI tốt hơn — 4:00-5:30]**

> Nghe có vẻ nghịch lý, nhưng hiểu rõ giới hạn không khiến bạn dùng AI ít đi — mà giúp bạn dùng **đúng chỗ, đúng việc**, tự tin hơn vì biết chính xác khi nào nên tin tưởng hoàn toàn, khi nào cần thêm một bước kiểm tra.

**[Kết bài — 5:30-6:00]**

> Bài tiếp theo, chúng ta sẽ nói về cách biến những kỹ năng rời rạc đã học thành thói quen sử dụng AI mỗi ngày một cách tự nhiên.

## Tài liệu đi kèm
- [AI là gì? Giải thích cho người không rành kỹ thuật] (CKOS — Tài liệu 1, mục 4)
- [Tư duy phản biện khi làm việc cùng AI] (CKOS — Tài liệu 9)

## Ghi chú sản xuất video
- Giọng điệu: điềm tĩnh, mang tính tổng kết, không cần demo màn hình nhiều — có thể dùng slide minh họa 4 giới hạn thay vì screen recording', 6, true
from public.course_sections s where s.course_id='ai-cho-nguoi-moi-bat-dau' and s.title='Chương 4 — Định hướng tiếp theo';

insert into public.course_lessons (section_id, title, sort_order, status, content, duration_minutes, is_free_preview)
select s.id, 'Bài 14: Xây dựng thói quen dùng AI mỗi ngày', 14, 'Published', '# Bài 14: Xây dựng thói quen dùng AI mỗi ngày

## Mục tiêu bài học
Học viên có 1 kế hoạch cụ thể để biến các kỹ năng đã học thành thói quen sử dụng hàng ngày, không chỉ dừng lại sau khi kết thúc khóa học.

## Kịch bản

**[Mở đầu — 0:00-0:30]**

> Học xong 13 bài không có nghĩa là bạn đã "thành thạo AI" — thành thạo chỉ đến khi những kỹ năng này trở thành thói quen tự nhiên. Hôm nay mình sẽ giúp bạn xây dựng đúng thói quen đó.

**[Phần 1: Tổng hợp lại 5 thời điểm dùng AI trong ngày — 0:30-3:30]**

> Nhớ lại những gì đã học rải rác, đây là cách đóng gói thành 1 lịch trình cụ thể:
>
> - **Buổi sáng:** Lên kế hoạch ngày làm việc (Bài 7)
> - **Trong ngày:** Xử lý email, tóm tắt tài liệu khi cần (Bài 5)
> - **Khi cần quyết định:** Hỏi AI để có thêm góc nhìn (mở rộng thêm ở khóa Premium)
> - **Cuối ngày:** Tổng kết công việc, chuẩn bị cho ngày mai
> - **Bất cứ khi nào tò mò:** Hỏi AI để học điều mới (Bài 6)

**[Phần 2: Mẹo để thói quen "dính" lâu dài — 3:30-5:30]**

> Đừng cố áp dụng cả 5 thời điểm cùng lúc ngay từ ngày mai — chọn **1 thời điểm dễ nhất** với bạn, áp dụng liên tục trong 1 tuần cho đến khi nó trở thành phản xạ, rồi mới thêm thời điểm tiếp theo.
>
> Gợi ý: hầu hết mọi người thấy dễ bắt đầu nhất với việc xử lý email — vì tần suất dùng cao, kết quả thấy rõ ngay lập tức.

**[Phần 3: Theo dõi tiến bộ của bạn — 5:30-6:30]**

> [Demo: chỉ vào phần "Hành trình của tôi" trong Portal]
>
> Portal có sẵn tính năng "Hành trình của tôi" giúp bạn theo dõi tiến độ học tập, số ngày liên tục dùng AI — hãy dùng nó như 1 công cụ nhắc nhở duy trì thói quen.

**[Kết bài — 6:30-7:00]**

> Bài tiếp theo là bài ôn tập — chúng ta sẽ cùng nhìn lại toàn bộ hành trình 14 bài học vừa qua trước khi bước sang bài cuối cùng của khóa.

## Tài liệu đi kèm
- [5 cách dùng AI tăng năng suất công việc mỗi ngày] (CKOS — Tài liệu 5)

## Ghi chú sản xuất video
- Cần demo giao diện "Hành trình của tôi" thật — phối hợp thời điểm quay với tiến độ build Portal của Claude Code', 7, true
from public.course_sections s where s.course_id='ai-cho-nguoi-moi-bat-dau' and s.title='Chương 4 — Định hướng tiếp theo';

insert into public.course_lessons (section_id, title, sort_order, status, content, duration_minutes, is_free_preview)
select s.id, 'Bài 15: Ôn tập & tổng kết khóa học', 15, 'Published', '# Bài 15: Ôn tập & tổng kết khóa học

## Mục tiêu bài học
Học viên nhìn lại toàn bộ hành trình 14 bài học, củng cố lại kiến thức cốt lõi, và giải đáp các câu hỏi thường gặp nhất.

## Kịch bản

**[Mở đầu — 0:00-0:40]**

> Chúng ta sắp hoàn thành khóa nhập môn rồi! Trước khi qua bài cuối cùng, hãy cùng nhìn lại toàn bộ hành trình đã đi qua.

**[Phần 1: Tóm tắt 4 chương — 0:40-4:30]**

> **Chương 1 — Làm quen với AI:** Bạn đã hiểu AI là gì, biết các loại AI phổ biến, tự cài đặt được công cụ, và học công thức 4 yếu tố để đặt câu hỏi hiệu quả.
>
> **Chương 2 — Dùng AI cho việc hàng ngày:** Bạn đã biết viết email, tóm tắt văn bản, tìm kiếm thông tin, lên kế hoạch, và quan trọng nhất — nhận diện khi AI trả lời sai.
>
> **Chương 3 — Thực hành mở rộng:** Bạn đã tạo được hình ảnh AI, thấy ứng dụng theo từng ngành nghề, làm quen AI Workspace, và hoàn thành sản phẩm đầu tiên.
>
> **Chương 4 — Định hướng tiếp theo:** Bạn đã hiểu giới hạn của AI và cách xây dựng thói quen sử dụng lâu dài.

**[Phần 2: Câu hỏi thường gặp — 4:30-7:00]**

> Đây là những câu hỏi mình thường nhận được nhất từ học viên mới:
>
> **"Tôi có cần trả phí để dùng AI hiệu quả không?"** — Không bắt buộc. Bản miễn phí của ChatGPT/Claude đã đủ cho phần lớn nhu cầu cơ bản. Trả phí chỉ cần thiết khi bạn dùng với tần suất rất cao hoặc cần tính năng nâng cao.
>
> **"Tôi lo AI sẽ khiến tôi mất khả năng tự tư duy?"** — Đây là lo lắng hợp lý. Cách phòng tránh chính là điều bạn đã học ở Bài 8 — luôn giữ vai trò kiểm chứng và quyết định cuối cùng, dùng AI như công cụ hỗ trợ chứ không thay thế tư duy của bạn.
>
> **"Tôi nên học tiếp gì sau khóa này?"** — Chính là nội dung bài học cuối cùng, ngay sau đây.

**[Kết bài — 7:00-8:00]**

> Bạn đã đi được một chặng đường dài từ con số 0. Bài cuối cùng, mình sẽ giúp bạn chọn đúng hướng đi tiếp theo phù hợp với mục tiêu riêng của bạn.

## Tài liệu đi kèm
- (Tổng hợp — liên kết lại toàn bộ 14 bài trước)

## Ghi chú sản xuất video
- Có thể làm dạng "montage" — chèn lại các đoạn demo ngắn từ những bài trước xen kẽ khi tóm tắt từng chương, giúp video sinh động hơn thay vì chỉ nói suông', 8, true
from public.course_sections s where s.course_id='ai-cho-nguoi-moi-bat-dau' and s.title='Chương 4 — Định hướng tiếp theo';

insert into public.course_lessons (section_id, title, sort_order, status, content, duration_minutes, is_free_preview)
select s.id, 'Bài 16: Bước tiếp theo — chọn lộ trình phù hợp với bạn', 16, 'Published', '# Bài 16: Bước tiếp theo — chọn lộ trình phù hợp với bạn

## Mục tiêu bài học
Học viên hiểu rõ 4 lộ trình tiếp theo trong Học viện AI, chọn được hướng phù hợp với mục tiêu cá nhân, và có động lực nâng cấp Premium để tiếp tục hành trình.

## Kịch bản

**[Mở đầu — 0:00-0:40]**

> Đây là bài học cuối cùng của khóa nhập môn — và cũng là điểm bắt đầu cho hành trình tiếp theo của bạn. Bạn đã có nền tảng vững chắc, giờ là lúc chọn hướng đi phù hợp nhất với mục tiêu riêng của bạn.

**[Phần 1: Giới thiệu 4 lộ trình — 0:40-5:00]**

> **Nếu mục tiêu của bạn là ứng dụng AI vào công việc hàng ngày hiệu quả hơn** → Lộ trình "Ứng dụng AI trong công việc" — 20 bài học chuyên sâu về văn phòng, quản lý dự án, phân tích dữ liệu cơ bản.
>
> **Nếu bạn muốn tự động hóa, xây dựng hệ thống làm việc thông minh hơn** → Lộ trình "Xây dựng hệ thống với AI" — 20 bài, học cách kết nối AI với các công cụ khác để tự động hóa quy trình.
>
> **Nếu bạn kinh doanh hoặc làm marketing** → Lộ trình "AI cho kinh doanh & Marketing" — chuyên sâu về content, quảng cáo, chăm sóc khách hàng có AI hỗ trợ.
>
> **Nếu bạn muốn thành thạo sâu 1 công cụ cụ thể trước** → Khóa "ChatGPT từ A đến Z" hoặc "Prompt Engineering Mastery" — đào sâu kỹ năng cốt lõi trước khi mở rộng.

**[Phần 2: Gợi ý chọn theo mục tiêu cá nhân — 5:00-6:30]**

> Nếu vẫn chưa chắc chắn, hãy tự hỏi: "Việc gì trong công việc hiện tại của tôi tốn nhiều thời gian nhất?" — câu trả lời đó thường chỉ ra đúng lộ trình bạn nên bắt đầu.
>
> Bạn cũng không cần chọn ngay lập tức — có thể xem trước 2-3 bài học đầu của mỗi lộ trình để cảm nhận trước khi quyết định.

**[Phần 3: Vì sao nên tiếp tục với Premium — 6:30-7:30]**

> Khóa nhập môn này chỉ là bước khởi đầu. Với Premium, bạn không chỉ mở khóa toàn bộ 4 lộ trình này, mà còn có: lớp học LIVE hàng tuần cùng mình, chứng chỉ hoàn thành cho mỗi khóa, và có thể đặt câu hỏi trực tiếp khi gặp khó khăn — thay vì tự mò mẫm một mình.

**[Kết bài — 7:30-8:00]**

> Cảm ơn bạn đã đồng hành cùng mình suốt 16 bài học vừa qua. Đây mới chỉ là điểm khởi đầu — hẹn gặp lại bạn ở những lộ trình tiếp theo. Chúc bạn tiếp tục hành trình chinh phục AI thật vững vàng!

## Tài liệu đi kèm
- (Không có tài liệu CKOS cụ thể — bài học định hướng tổng thể)

## Ghi chú sản xuất video
- CTA cuối video cần link trực tiếp tới trang Premium/trang chọn lộ trình
- Đây là bài quan trọng về mặt chuyển đổi (conversion) — nên đầu tư kỹ phần dựng hình ảnh minh họa 4 lộ trình để trực quan, dễ so sánh', 8, true
from public.course_sections s where s.course_id='ai-cho-nguoi-moi-bat-dau' and s.title='Chương 4 — Định hướng tiếp theo';
commit;
