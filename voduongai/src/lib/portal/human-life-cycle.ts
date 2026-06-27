/**
 * Human Life Cycle Model (Sprint 7.3) — Portal nhìn người dùng như một con
 * người đang đi qua những MÙA của cuộc sống, không phải một "Member" đang
 * tích điểm. Tuyệt đối không dùng "Level" hay "Rank" ở đây hoặc bất cứ nơi
 * nào hiển thị mùa này ra UI.
 *
 * Đây là một mô hình MÔ TẢ (descriptive), không phải một thước đo
 * (measurement) — Portal không tự động "thăng mùa" cho ai, mùa hiện tại
 * vẫn được truyền vào từ ngoài (giống cách `human-flow.ts` nhận currentOS).
 */

export type LifeSeason =
  | "beginning"
  | "learning"
  | "practice"
  | "building"
  | "sharing"
  | "leading"
  | "renewal";

export type LifeSeasonProfile = {
  emoji: string;
  name: string;
  goal: string;
  commonDifficulty: string;
  whatUserNeedsToHear: string;
  whatPortalShouldDo: string;
  whatPortalMustNeverSay: string;
};

export const lifeSeasons: Record<LifeSeason, LifeSeasonProfile> = {
  beginning: {
    emoji: "🌱",
    name: "Khởi đầu",
    goal: "Làm quen với một thế giới mới, không bị choáng ngợp, và tin rằng mình có thể bắt đầu.",
    commonDifficulty:
      "Cảm thấy mọi thứ quá nhiều, quá mới, không biết nên bắt đầu từ đâu, dễ so sánh mình với người đã đi trước.",
    whatUserNeedsToHear:
      "Bắt đầu chậm vẫn là bắt đầu. Không ai giỏi ngay từ ngày đầu, và điều đó hoàn toàn bình thường.",
    whatPortalShouldDo:
      "Gợi ý một bước nhỏ, rõ ràng, không yêu cầu kiến thức trước đó. Ăn mừng cả những hành động nhỏ nhất như đăng nhập lần đầu, đọc bài học đầu tiên.",
    whatPortalMustNeverSay:
      "Đừng nói 'Bạn chậm hơn người khác', 'Đến lúc này bạn nên biết rồi', hoặc liệt kê những gì người dùng 'còn thiếu'.",
  },
  learning: {
    emoji: "📚",
    name: "Học hỏi",
    goal: "Xây nền kiến thức vững, hiểu bản chất trước khi vội vàng tạo ra kết quả.",
    commonDifficulty:
      "Học nhiều nhưng chưa thấy kết quả cụ thể, dễ nản vì cảm giác 'học mãi mà chưa làm được gì', dễ học lan man không có trọng tâm.",
    whatUserNeedsToHear:
      "Hiểu đúng một điều nhỏ còn giá trị hơn lướt qua mười điều lớn. Kiến thức bạn đang tích lũy sẽ có lúc dùng đến, dù bây giờ chưa thấy rõ.",
    whatPortalShouldDo:
      "Giúp người dùng chọn một trọng tâm thay vì học tất cả cùng lúc. Nhắc lại những gì họ đã hiểu đúng để họ thấy kiến thức đang thật sự tích lũy.",
    whatPortalMustNeverSay:
      "Đừng nói 'Học vậy chưa đủ', 'Bạn cần học nhanh hơn', hoặc so sánh tốc độ học của họ với người khác.",
  },
  practice: {
    emoji: "🛠",
    name: "Thực hành",
    goal: "Biến kiến thức thành hành động thật, dù kết quả ban đầu còn vụng về.",
    commonDifficulty:
      "Sợ làm sai, sợ kết quả không hoàn hảo nên trì hoãn không bắt tay vào làm, hoặc làm rồi thấy chưa như mong đợi nên dễ tự trách.",
    whatUserNeedsToHear:
      "Một kết quả chưa hoàn hảo vẫn tốt hơn một ý tưởng nằm im. Vụng về ở bước thực hành đầu tiên là điều ai cũng đi qua, không phải dấu hiệu bạn không phù hợp.",
    whatPortalShouldDo:
      "Khuyến khích làm một việc nhỏ, cụ thể, có thể hoàn thành trong thời gian ngắn. Ghi nhận hành động đã làm, không chỉ ghi nhận kết quả cuối.",
    whatPortalMustNeverSay:
      "Đừng nói 'Làm vậy chưa đạt', 'Lẽ ra nên làm tốt hơn', hoặc nhấn vào lỗi sai mà không nhắc đến nỗ lực đã bỏ ra.",
  },
  building: {
    emoji: "🚀",
    name: "Kiến tạo",
    goal: "Tạo ra giá trị có hệ thống, lặp lại được, không còn là thử nghiệm một lần.",
    commonDifficulty:
      "Áp lực phải mở rộng nhanh, dễ kiệt sức vì cố làm mọi thứ một mình, dễ hoài nghi liệu hướng đi hiện tại có đúng không.",
    whatUserNeedsToHear:
      "Bạn không cần xây mọi thứ một mình và không cần xây xong trong một ngày. Một hệ thống bền vững quan trọng hơn một kết quả nhanh nhưng dễ vỡ.",
    whatPortalShouldDo:
      "Gợi ý cách hệ thống hóa những gì đang làm thủ công, đề xuất kết nối với người khác khi phù hợp. Nhắc lại hành trình đã đi để họ thấy mình không bắt đầu từ con số 0.",
    whatPortalMustNeverSay:
      "Đừng nói 'Người khác đã làm lớn hơn bạn rồi', 'Bạn xây vậy là chậm', hoặc thúc ép quy mô như một thước đo giá trị duy nhất.",
  },
  sharing: {
    emoji: "🤝",
    name: "Chia sẻ",
    goal: "Mang điều mình biết, mình có đến với người khác, và nhận lại kết nối thật.",
    commonDifficulty:
      "Sợ chia sẻ rồi bị đánh giá, sợ mình 'chưa đủ giỏi' để chia sẻ, hoặc chia sẻ mà không thấy ai phản hồi nên dễ nản.",
    whatUserNeedsToHear:
      "Bạn không cần là chuyên gia để chia sẻ điều có ích — bạn chỉ cần đi trước người khác một bước. Một người được giúp đỡ thật cũng là một thành quả, không kém gì một kết quả cá nhân.",
    whatPortalShouldDo:
      "Gợi ý những hình thức chia sẻ nhỏ, ít rủi ro để bắt đầu. Ghi nhận khi người dùng giúp đỡ hoặc đóng góp cho người khác trong cộng đồng.",
    whatPortalMustNeverSay:
      "Đừng nói 'Bạn chưa đủ kinh nghiệm để chia sẻ', hoặc đánh giá giá trị chia sẻ của họ dựa trên số lượt tương tác nhận được.",
  },
  leading: {
    emoji: "🌳",
    name: "Dẫn dắt",
    goal: "Đồng hành và giúp người khác đi nhanh hơn, an toàn hơn trên con đường mình đã từng đi qua.",
    commonDifficulty:
      "Áp lực phải luôn đúng, sợ làm người khác thất vọng, đôi lúc quên dành thời gian cho hành trình của chính mình vì lo cho người khác.",
    whatUserNeedsToHear:
      "Dẫn dắt không có nghĩa là phải hoàn hảo — mà là sẵn lòng đi cùng. Bạn vẫn được phép có câu hỏi của riêng mình, dù đang là người hướng dẫn người khác.",
    whatPortalShouldDo:
      "Tôn trọng vai trò người dẫn dắt của họ, đồng thời vẫn hỏi han hành trình cá nhân của họ như với bất kỳ ai khác. Gợi ý họ ghi lại những bài học để truyền lại có hệ thống hơn.",
    whatPortalMustNeverSay:
      "Đừng nói 'Là người dẫn dắt thì không nên còn vấn đề gì nữa', hoặc đặt kỳ vọng họ phải luôn vững vàng, không được mệt.",
  },
  renewal: {
    emoji: "🍃",
    name: "Tái tạo",
    goal: "Nhìn lại, nghỉ ngơi, và chọn một hướng đi mới — không phải vì đã thất bại, mà vì đã đến lúc làm mới.",
    commonDifficulty:
      "Cảm giác chững lại, hoài nghi liệu mình có đang lùi bước, hoặc áp lực phải lập tức tìm ra hướng đi tiếp theo ngay.",
    whatUserNeedsToHear:
      "Một mùa chững lại không phải là một mùa thất bại. Nghỉ để nhìn lại cũng là một phần của trưởng thành, không phải là dừng lại trưởng thành.",
    whatPortalShouldDo:
      "Mời người dùng nhìn lại hành trình đã qua trong My Story, không thúc ép họ chọn ngay một hướng mới. Cho họ thời gian, và nhắc rằng Portal vẫn ở đây khi họ sẵn sàng.",
    whatPortalMustNeverSay:
      "Đừng nói 'Bạn đang chững lại', 'Bạn cần tìm mục tiêu mới ngay', hoặc coi giai đoạn nghỉ là một vấn đề cần được giải quyết gấp.",
  },
};

export function getLifeSeasonProfile(season: LifeSeason): LifeSeasonProfile {
  return lifeSeasons[season];
}
