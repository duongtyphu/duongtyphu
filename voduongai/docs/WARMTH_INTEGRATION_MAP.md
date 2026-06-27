# Warmth Integration Map (Sprint 7.4)

Bản đồ các điểm chạm thật trong Portal — trạng thái người dùng, vai trò
Portal nên đóng, cảm xúc cần tạo ra, và copy hiện tại/đề xuất. Đây là tài
liệu sống: khi thêm một điểm chạm mới, hãy thêm một dòng vào đây trước khi
viết copy cho nó.

| Điểm chạm | Trạng thái người dùng | Vai trò Portal | Cảm xúc cần tạo | Copy hiện tại | Copy đề xuất | Sửa trong Sprint này? |
|---|---|---|---|---|---|---|
| WelcomeHero | Vừa quay lại Gem Home | Friend | Được chào đón, không bị thẩm vấn | Đã ấm từ Sprint 7.3 (welcomeCopy + life-moment cho comeback) | Giữ nguyên | Không — đã đạt chuẩn |
| TodayMissionCard | Đang nhìn danh sách việc trong ngày | Coach | Nhẹ nhõm, không bị giao KPI | "Nhiệm vụ hôm nay" / "Chưa làm · Đang làm · Hoàn thành" | "Hôm nay, vài điều nhỏ để đi tiếp" + dòng "Không cần làm hết" + label "Chưa bắt đầu/Đang thực hiện/Đã xong" | **Có — đã sửa** |
| RecommendedResources | Đang lướt qua tài nguyên gợi ý | Guide | Được dẫn đường, không bị quảng cáo | "Gợi ý dành cho bạn" (không có dòng dẫn) + mô tả mang tính liệt kê tính năng | Thêm dòng dẫn "Không cần tự mò hết..." + mô tả hướng tới lợi ích cảm xúc, không chỉ tính năng | **Có — đã sửa** |
| TodayOpportunity | Đang xem các cơ hội phát triển | Guide | Thấy đây là cơ hội học hỏi, không phải sale | Có dòng mở đầu ấm; CTA "Tìm hiểu thêm →" hơi giống nút bán hàng | CTA "Khi bạn sẵn sàng, tìm hiểu thêm →" | **Có — đã sửa** |
| HumanMomentumCard | Đang xem điều giữ mình tiếp tục | Witness | Được nhìn thấy ý nghĩa, không phải điểm số | "Động lực của bạn" | "Điều đang giữ bạn tiếp tục" | **Có — đã sửa** |
| NextBestActionCard | Cần biết bước tiếp theo | Companion | Được đồng hành, không bị ra lệnh | Đã ấm từ Sprint 7.2 (lý do + CTA mềm) | Giữ nguyên | Không — đã đạt chuẩn |
| ProgressNarrativeCard | Đang xem mình ở giai đoạn nào | Witness | Thấy được nhìn nhận theo câu chuyện, không theo % | Đã ấm (`progressNarrative` theo OS) | Giữ nguyên | Không — đã đạt chuẩn |
| Reflection Journal (chưa trả lời) | Được hỏi một câu hỏi nhỏ | Friend | Cảm thấy được hỏi thật, không bị khảo sát | "Một câu hỏi nhỏ hôm nay" / nút "Lưu lại suy ngẫm này" | Nút đổi thành "Lưu lại một dấu chân hôm nay" | **Có — đã sửa** |
| Reflection Journal (đã trả lời hôm nay) | Vừa chia sẻ điều gì đó | Witness | Được ghi nhận đã lắng nghe | "Cảm ơn bạn đã dành chút thời gian để suy ngẫm hôm nay..." | Giữ nguyên — đã đúng vai Witness | Không — đã đạt chuẩn |
| Memory Capsule (form) | Muốn giữ lại một khoảnh khắc | Legacy Keeper | Thấy đây là cất giữ, không phải nhập liệu | "Lưu lại một khoảnh khắc đáng nhớ" / nút "Cất giữ vào My Story" | Giữ nguyên — đã đúng tông | Không — đã đạt chuẩn |
| Memory Capsule (sau khi lưu) | Vừa cất giữ xong | Legacy Keeper | Cảm thấy điều đó đã được giữ lại thật, không chỉ "lưu thành công" | Chỉ đổi label nút thành "Đã cất giữ" | Thêm dòng "Khoảnh khắc này đã được giữ lại cho hành trình của bạn." | **Có — đã sửa** |
| My Story timeline (empty state) | Chưa có khoảnh khắc nào | Companion | Thấy hy vọng, không thấy trống rỗng | "Câu chuyện của bạn đang chờ những dòng đầu tiên..." (Sprint 7.1) | Giữ nguyên — đã đạt chuẩn | Không |
| Monthly Letter (empty state) | Chưa có lịch sử | Legacy Keeper | Thấy một lá thư sẽ đến, không phải báo lỗi rỗng | "Lá thư đầu tiên sẽ được viết khi..." (Sprint 7.1) | Giữ nguyên — đã đạt chuẩn | Không |
| Storage fallback (table chưa sẵn sàng) | Bảng dữ liệu chưa migrate | Companion | Không thấy lỗi kỹ thuật | "Khu vực lưu ký ức đang được chuẩn bị..." (Sprint 7.1) | Giữ nguyên — đã đạt chuẩn | Không |
| Error / fallback chung | Có lỗi tải dữ liệu phía sau | Companion | Không cảm thấy bị bỏ rơi, không thấy log kỹ thuật | Hiện tại đa số fallback về rỗng âm thầm (catch → []) | Đề xuất Sprint sau: thêm một dòng nhẹ khi fallback thật sự xảy ra, hiện tại chưa đủ rủi ro để ưu tiên sửa | Không — đề xuất cho sprint sau |
| Completion (mission "Đã xong") | Vừa hoàn thành một nhiệm vụ nhỏ | Witness | Được ghi nhận, không chỉ đổi icon | Chỉ đổi icon + label, chưa có dòng ghi nhận riêng | Đề xuất Sprint sau: một dòng ghi nhận ngắn xuất hiện khi chuyển trạng thái sang "Đã xong" | Không — đề xuất cho sprint sau |

Ghi chú: các dòng đánh "Không — đã đạt chuẩn" là những điểm chạm đã được
làm ấm trong Sprint 7.0–7.3 và đã qua review, nên Sprint 7.4 không chạm lại
để tránh thay đổi không cần thiết.
