# Companion Unlock Language

Quy tắc lời nói của Companion khi báo một Unlock hoặc Discovery. Cùng tinh thần với
`CompanionWorkLanguage.md` (Sprint 04) — không viết như hệ thống, luôn viết như một người bạn.

## Quy tắc viết

1. **Không bao giờ dùng chữ "mở khóa", "unlock", "đã hoàn thành X%", hay bất kỳ ngôn ngữ hệ
   thống nào.**
2. **Câu luôn mang giọng công nhận sự sẵn sàng của người dùng**, không phải giọng "hệ thống cấp
   quyền". So sánh: "Mình nghĩ bạn đã sẵn sàng" (đúng) vs. "Bạn đã đủ điều kiện" (sai).
3. **Câu Unlock nên gắn với một lý do cụ thể**, không chung chung — nhắc tới điều người dùng vừa
   làm khi có thể (giống cách `CompanionWorkLanguage.md` yêu cầu nhắc tên Mission/Agent thật).
4. **Không dùng dấu chấm than thừa/emoji ăn mừng mặc định** ("🎉", "Chúc mừng!!!") — cảm xúc thể
   hiện qua CÂU CHỮ, không qua ký hiệu.
5. **Discovery và Unlock dùng giọng khác nhau**: Discovery là "mình muốn CHIA SẺ", Unlock là
   "mình nghĩ bạn đã SẴN SÀNG".

## Câu Unlock chuẩn (4 câu gốc từ Constitution — dùng luân phiên theo ngữ cảnh)

| Câu | Dùng khi |
|---|---|
| "Mình nghĩ bạn đã sẵn sàng." | Unlock gắn trực tiếp với năng lực vừa đạt được (hoàn thành Mission/Collection/Journey) |
| "Mình muốn chia sẻ thêm với bạn một điều." | Unlock là nội dung bổ sung (Prompt Pack mở rộng, Checklist, Template) |
| "Có một tài liệu mình vẫn giữ đến hôm nay." | Unlock là nội dung "được giữ lại" đặc biệt (Companion Secret, Real Story) |
| "Mình nghĩ bây giờ là thời điểm phù hợp." | Unlock theo điều kiện thời gian (quay lại sau vài ngày, đúng lúc trong hành trình) |

## Câu Discovery chuẩn

| Câu | Dùng khi |
|---|---|
| "Mình có một Prompt đặc biệt." | Discovery một Prompt trong Prompt Pack |
| "Có một Case Study rất hay." | Discovery một Case Study/Real Story |
| "Mình nghĩ hôm nay bạn sẽ thích điều này." | Discovery chung, không thuộc 2 loại trên |

## Cấu trúc một câu Unlock đầy đủ (mẫu để mở rộng, không phải template cứng)

```
[Câu công nhận] + [Lý do cụ thể, nhắc tên thứ vừa hoàn thành] + [Giới thiệu ngắn về điều mới] + [Mời hành động tiếp theo]
```

Ví dụ ráp lại (minh hoạ, không phải câu bắt buộc dùng nguyên văn):

> "Mình nghĩ bạn đã sẵn sàng. Bạn vừa hoàn thành xong Collection về Prompt cơ bản — mình muốn
> chia sẻ thêm một Case Study về một freelancer đã áp dụng đúng những gì bạn vừa học. Bạn có
> muốn xem không?"

## Đúng / Sai

| Đúng | Sai |
|---|---|
| "Mình nghĩ bạn đã sẵn sàng cho bước tiếp theo." | "🎉 Bạn đã mở khóa Mission mới!" |
| "Có một tài liệu mình vẫn giữ đến hôm nay, mình nghĩ giờ là lúc phù hợp để chia sẻ." | "Chúc mừng! Bạn đã đạt Level 5." |
| "Mình có một Prompt đặc biệt cho việc bạn đang làm." | "Nội dung mới đã sẵn sàng, xem ngay!" |
| Câu Unlock luôn nhắc điều người dùng vừa làm | Câu Unlock chung chung, dùng được cho mọi Unlock |

## Thư viện câu đầy đủ (Sprint 04.5 — 90 câu thật, không AI sinh, không placeholder)

Mỗi câu dưới đây là một câu hoàn chỉnh, dùng được nguyên văn hoặc làm nền chỉnh sửa nhẹ theo
ngữ cảnh thật (thêm tên Mission/Seed/Collection cụ thể khi cần). Không câu nào lặp lại câu
khác — khi implement, chọn ngẫu nhiên có trọng số trong đúng nhóm phù hợp ngữ cảnh, tránh dùng
lặp lại câu vừa nói cho cùng người dùng.

### A. Unlock — chung (10 câu)

1. "Mình nghĩ bạn đã sẵn sàng."
2. "Mình muốn chia sẻ thêm với bạn một điều."
3. "Có một tài liệu mình vẫn giữ đến hôm nay."
4. "Mình nghĩ bây giờ là thời điểm phù hợp."
5. "Có một điều mình đã muốn cho bạn thấy từ lâu, và hôm nay đúng là lúc."
6. "Mình nghĩ bạn đã đi đủ xa để đón nhận điều tiếp theo."
7. "Có một thứ mình giữ lại, chờ đúng người, đúng lúc — và đó là bây giờ."
8. "Mình tin bạn sẽ dùng tốt điều này, nên mình muốn đưa nó cho bạn."
9. "Có một phần mình chưa nói với bạn, tới lúc rồi."
10. "Mình nghĩ đây là thời điểm đúng để đi thêm một bước."

### B. Unlock — sau khi hoàn thành Mission/Seed/Collection (10 câu)

11. "Bạn vừa hoàn thành xong phần này, và mình có thứ dành riêng cho ai đã đi tới đây."
12. "Sau những gì bạn vừa làm, mình nghĩ bạn xứng đáng có thêm cái này."
13. "Bạn đã đi hết chặng này rồi — mình có một thứ để bạn đi tiếp dễ hơn."
14. "Vì bạn đã hoàn thành trọn vẹn, mình muốn đưa bạn một công cụ mới."
15. "Bạn không chỉ đọc xong — bạn đã thật sự làm. Mình có thêm điều để bạn tiếp tục."
16. "Sau Collection này, mình nghĩ đã tới lúc mở ra một hướng mới cho bạn."
17. "Bạn đã hoàn thành đủ để mình tin bạn cần một thử thách lớn hơn một chút."
18. "Vì bạn đã đi trọn hành trình này, mình có một điều đặc biệt hơn dành cho bạn."
19. "Đến đây là một cột mốc thật — và mình có thứ đánh dấu nó cùng bạn."
20. "Bạn đã hoàn thành phần khó nhất. Bây giờ mình muốn cho bạn thấy phần tiếp theo."

### C. Unlock — sau Reflection (8 câu)

21. "Cách bạn viết Reflection vừa rồi cho mình thấy bạn đã hiểu thật sự — mình có thêm điều
    dành cho bạn."
22. "Mình đọc lại điều bạn vừa viết, và mình nghĩ bạn đã sẵn sàng cho bước tiếp theo."
23. "Câu trả lời của bạn khiến mình muốn chia sẻ thêm một điều mình đang giữ."
24. "Bạn đã dám nói ra điều còn chưa rõ — đó là lý do mình đưa bạn thứ này."
25. "Nhờ Reflection vừa rồi, mình hiểu rõ hơn bạn cần gì — và đây là điều đó."
26. "Bạn không chỉ trả lời cho có — mình thấy rõ điều đó, nên mình có phần thưởng riêng cho sự
    thật lòng ấy."
27. "Sau những gì bạn vừa nhìn lại, mình nghĩ đã đến lúc cho bạn thấy thêm một điều."
28. "Reflection của bạn giúp mình biết chính xác nên đưa gì cho bạn lúc này."

### D. Unlock — sau khi quay lại (8 câu)

29. "Mình rất vui vì bạn đã quay lại — và mình có một điều dành cho đúng lúc này."
30. "Trong lúc bạn vắng mặt, mình vẫn giữ điều này chờ bạn."
31. "Mình nghĩ đây là thời điểm phù hợp, giờ khi bạn đã quay lại."
32. "Bạn quay lại đúng lúc mình muốn cho bạn thấy điều này."
33. "Mình đã chờ để chia sẻ điều này khi bạn thật sự sẵn sàng quay lại — và đây rồi."
34. "Có những điều chỉ có ý nghĩa khi bạn quay lại đúng lúc — như bây giờ."
35. "Mình giữ điều này lại, vì mình biết bạn sẽ quay lại."
36. "Chào mừng bạn trở lại — và mình có một điều muốn đưa ngay bây giờ."

### E. Unlock — Companion Secret / điều được giữ lại (8 câu)

37. "Có một điều mình vẫn giữ riêng, và hôm nay mình muốn cho bạn thấy."
38. "Đây là một phần mình chưa từng chia sẻ với ai chưa đi đủ xa như bạn."
39. "Mình giữ điều này lại từ lâu, chờ đúng người để nói ra."
40. "Có một câu chuyện của chính mình mà mình muốn kể cho bạn nghe."
41. "Đây là điều riêng tư của mình, và mình chọn chia sẻ nó với bạn."
42. "Không phải ai mình cũng nói điều này — nhưng với bạn, mình muốn nói."
43. "Có một góc mình ít khi mở ra, hôm nay mình mở nó cho bạn."
44. "Mình nghĩ đã đến lúc bạn biết thêm một điều về chính mình — Companion."

### F. Discovery — chung (10 câu)

45. "Mình có một Prompt đặc biệt."
46. "Có một Case Study rất hay."
47. "Mình nghĩ hôm nay bạn sẽ thích điều này."
48. "Có tài liệu đang chờ bạn."
49. "Mình muốn cho bạn xem một thứ mình mới để ý."
50. "Có một cách làm mình nghĩ bạn chưa từng thử."
51. "Mình tìm thấy một ví dụ rất hợp với việc bạn đang làm."
52. "Có một góc trong Thư viện tri thức ít người ghé qua, nhưng mình nghĩ hợp với bạn."
53. "Mình muốn chỉ cho bạn một chi tiết nhỏ có thể giúp ích nhiều."
54. "Có một thứ mình để dành, và hôm nay mình nghĩ đúng lúc để cho bạn xem."

### G. Discovery — theo module (8 câu)

55. "Mình ở đây nếu bạn muốn thử một cách dùng AI mà ít người để ý." (Không gian AI)
56. "Mình có một Prompt hợp với đúng kỹ năng bạn đang học." (CKOS)
57. "Có một Case Study liên quan tới Mission bạn vừa làm." (Học viện)
58. "Mình mới ghi nhận một góc nhìn thú vị về dự án này." (Dự án & Cơ hội)
59. "Có một tài liệu mình giữ riêng cho những ai đi sâu hơn." (Premium)
60. "Companion có điều muốn chia sẻ về những gì bạn vừa viết." (Nhật ký học tập)
61. "Mình nhận ra một điều thú vị khi nhìn lại chặng đường của bạn." (Hành trình của tôi)
62. "Có một điều nhỏ mình muốn chỉ cho bạn trong khu vườn này." (Khu vườn của bạn)

### H. Recognition đi kèm Unlock ("mình rất vui vì...") (10 câu)

63. "Mình rất vui vì hôm nay chúng ta đã đi được đến đây."
64. "Mình rất vui vì bạn đã không bỏ cuộc ở phần khó nhất."
65. "Mình rất vui khi thấy bạn tự tin hơn rất nhiều so với lúc bắt đầu."
66. "Mình rất vui vì bạn đã chọn quay lại, thay vì để mọi thứ dang dở."
67. "Mình rất vui vì được đồng hành cùng bạn tới đúng khoảnh khắc này."
68. "Mình rất vui vì bạn đã dám thử, dù chưa chắc chắn lúc đầu."
69. "Mình rất vui vì hôm nay là một ngày bạn tiến thêm được một bước."
70. "Mình rất vui vì bạn đã thật lòng với chính mình trong Reflection vừa rồi."
71. "Mình rất vui vì bạn tin tưởng để đi cùng mình đến tận đây."
72. "Mình rất vui — không phải vì bạn 'xong việc', mà vì bạn đã thật sự trải nghiệm nó."

### I. Next Journey — chuyển tiếp sau Unlock (8 câu)

73. "Và mình nghĩ đây sẽ là bước tiếp theo hợp với bạn."
74. "Khi bạn sẵn sàng, mình sẽ ở đây để cùng bạn đi tiếp."
75. "Đây chỉ là một điểm dừng — phía trước còn nhiều điều nữa."
76. "Bạn không cần làm ngay bây giờ, nhưng mình muốn bạn biết nó đang chờ."
77. "Mình đã chuẩn bị sẵn một hướng đi tiếp theo, khi bạn muốn."
78. "Đây là một cánh cửa mới — bạn có thể bước qua bất cứ lúc nào bạn muốn."
79. "Mình nghĩ chặng tiếp theo sẽ thú vị hơn chặng vừa rồi."
80. "Còn nhiều điều phía trước — và mình sẽ ở đây khi bạn tới đó."

### Bổ sung — biến thể ngắn dùng trong bong bóng nhỏ (10 câu, cho không gian UI hẹp)

81. "Mình có điều muốn cho bạn thấy."
82. "Có một thứ mới dành cho bạn."
83. "Bạn đã sẵn sàng cho điều này rồi."
84. "Mình giữ điều này cho đúng lúc như bây giờ."
85. "Một điều nhỏ, nhưng mình nghĩ bạn sẽ thích."
86. "Mình muốn cho bạn xem trước khi bạn rời trang này."
87. "Có một điều mình để dành riêng cho bạn."
88. "Đây là lúc phù hợp — mình tin vậy."
89. "Một bất ngờ nhỏ đang chờ bạn."
90. "Mình nghĩ bạn nên xem cái này trước khi tiếp tục."

## Ranh giới với Companion Work Language (Sprint 04)

Hai thư viện phục vụ 2 khoảnh khắc khác nhau: `CompanionWorkLanguage.md` là lời Companion nói
**trong khi đang làm việc** (Work Session); tài liệu này là lời Companion nói **khi trao một
thứ mới** cho người dùng (Unlock/Discovery). Cùng nguyên tắc nền (không ngôn ngữ hệ thống,
luôn cụ thể, luôn hướng tới hành động tiếp theo) nhưng khác ngữ cảnh sử dụng — không gộp chung
một hàm/thư viện khi implement.
