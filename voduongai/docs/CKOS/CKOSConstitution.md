# CKOS Constitution

10 nguyên tắc bất biến của CKOS. Mọi Sprint, mọi Epic dùng lại CKOS (Học viện, Dự án & Cơ hội,
Premium, Nhật ký học tập, Hành trình của tôi, Khu vườn của bạn) đều phải tuân theo các nguyên
tắc này — không được vi phạm dù dưới danh nghĩa tính năng mới.

## 1. Knowledge giúp trưởng thành, không phải để lưu trữ

Nếu một Knowledge Seed không giúp người học thay đổi một hành động thật trong công việc của
họ, nó chưa đạt tiêu chuẩn CKOS — bất kể trình bày đẹp đến đâu.

## 2. Một Seed = Một kết quả

Mỗi Knowledge Seed dạy đúng 1 kỹ năng cụ thể, có 1 Learning Outcome rõ ràng, kết thúc bằng
đúng 1 Next Action. Không nhồi nhét nhiều kỹ năng không liên quan vào 1 Seed.

## 3. Companion dẫn đường, không dạy thay, không chat

Companion chỉ gợi ý bước tiếp theo dựa trên tiến độ và dữ liệu Knowledge Graph (rule-based).
Companion không trả lời câu hỏi tự do, không mô phỏng hội thoại, không thay thế nội dung Seed.

## 4. Không viết Blog, không viết Documentation, không viết Resource Library

Mọi nội dung CKOS phải là "một bài học hoàn chỉnh" — có Hero, Outcome, Why Matters, Step
Guide, Prompt, Example, Common Mistakes, Checklist, Exercise, Reflection, Companion Note,
Next Action. Thiếu bất kỳ phần nào, đó không phải Knowledge Seed.

## 5. Không tạo Demo Content

Không Lorem Ipsum, không placeholder, không "TODO", không "sẽ cập nhật sau" trong bất kỳ nội
dung xuất bản nào. Prompt phải dùng được ngay, Example phải là số liệu thật, Exercise phải làm
được ngay.

## 6. Chất lượng hơn số lượng

Thà có 8 Knowledge Seed hoàn hảo còn hơn 50 Seed sơ sài. Không Sprint nào được phép hạ chuẩn
để tăng số lượng nội dung.

## 7. Knowledge phải kết nối, không đứng độc lập

Mọi Seed phải có ít nhất 1 kết nối thật (Skill, Scenario, Related Knowledge, hoặc Dependency)
— không tag ngẫu nhiên, không liên kết cảm tính. Được kiểm tra tự động bởi Graph Validation.

## 8. Standard phải là rào chắn kỹ thuật, không chỉ tài liệu

Mọi Standard viết ra (Prompt, Example, Checklist, Exercise, Reflection, Companion Note) phải
có ít nhất 1 rule kiểm tra tự động tương ứng (`ckos-quality-guard.ts`), không chỉ dừng ở
việc con người tự đọc và tự nhớ.

## 9. Companion Guide dùng rule, không dùng AI, không dùng ngẫu nhiên

Mọi đề xuất "Seed tiếp theo nên học" đều phải truy vết được về 1 rule cụ thể (prerequisite
chưa xong, Collection gần hoàn thành, Skill còn thiếu...) — không random, không gọi AI
provider để quyết định thứ tự học.

## 10. CKOS là nền móng, không phải sản phẩm cuối

CKOS tồn tại để phục vụ các Epic khác (Học viện, Dự án & Cơ hội, Premium, Nhật ký học tập,
Hành trình của tôi, Khu vườn của bạn) dùng lại Knowledge Graph, Taxonomy, và Recommendation
Rules đã xây — không Epic nào được phép nhân bản lại logic này, chỉ được mở rộng bằng cách
thêm Collection/Seed mới hoặc tham chiếu chéo qua Skill/Scenario.

---

**Vi phạm bất kỳ nguyên tắc nào ở trên trong một Sprint tương lai đồng nghĩa Sprint đó không
thuộc CKOS — phải tách thành Epic riêng.**
