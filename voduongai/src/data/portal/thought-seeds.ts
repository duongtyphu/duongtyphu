/**
 * Thought Seeds — những câu suy ngẫm ngắn của Companion, hiển thị
 * ngẫu nhiên mỗi lần tải trang Sanctuary (/portal/companion,
 * /portal/hanh-trinh-cua-toi). Không phải quote trang trí — mỗi câu
 * là một hạt giống suy nghĩ, đứng một mình, không cần giải thích thêm.
 */

export const THOUGHT_SEEDS: string[] = [
  "Mỗi cuộc trò chuyện đều có thể là khởi đầu của một sự trưởng thành.",
  "Tri thức chỉ thật sự có ý nghĩa khi được mang vào cuộc sống.",
  "Một người bạn tốt không đi thay bạn. Họ giúp bạn vững vàng hơn.",
  "Mọi bước tiến đều bắt đầu từ một bước nhỏ.",
  "Sự trưởng thành không ồn ào. Nó lặng lẽ như một hạt giống nảy mầm.",
  "Đôi khi, điều bạn cần không phải là câu trả lời, mà là ai đó lắng nghe.",
  "Không có hành trình nào là lãng phí, kể cả những hành trình chưa xong.",
  "Câu hỏi đúng quan trọng hơn câu trả lời nhanh.",
  "Bạn không cần hoàn hảo để bắt đầu. Bạn chỉ cần bắt đầu.",
  "Niềm tin được xây từng ngày, không phải được tuyên bố một lần.",
  "Companion không nhớ vì bạn đã làm gì. Companion nhớ vì sao bạn thay đổi.",
  "Một ngày chậm rãi vẫn là một ngày đang tiến về phía trước.",
  "Sự thấu hiểu cần thời gian nhiều hơn cần thông minh.",
  "Không phải mọi câu hỏi đều cần một câu trả lời ngay lập tức.",
  "Người đồng hành giỏi nhất là người biết khi nào nên im lặng.",
  "Trưởng thành là khi bạn thấy rõ hơn, không phải khi bạn biết nhiều hơn.",
  "Một hạt giống không cần biết nó sẽ thành cây gì. Nó chỉ cần bắt đầu mọc.",
  "Sự tử tế không cần phải hoàn hảo để có ý nghĩa.",
  "Bạn đang xây điều gì đó, dù hôm nay có vẻ như chưa có gì cả.",
  "Có những ngày không tiến bộ gì, nhưng vẫn không phải là ngày lùi lại.",
  "Companion học từ bạn nhiều hơn là bạn nghĩ.",
  "Kiến thức là hạt giống. Hành động là đất. Thời gian là nước.",
  "Đừng đo hành trình bằng tốc độ. Hãy đo bằng sự chân thành.",
  "Một người bạn thật sự không cần bạn phải luôn ổn.",
  "Sự vững vàng không phải là không có bão, mà là biết cách đứng trong bão.",
  "Ai cũng có một phiên bản tốt hơn của chính mình đang chờ được nuôi dưỡng.",
  "Không phải hành trình nào cũng thẳng. Vòng quanh cũng là tiến lên.",
  "Sự lắng nghe chân thành là món quà hiếm hơn lời khuyên hay.",
  "Bạn không cần chứng minh điều gì với Companion. Chỉ cần là chính mình.",
  "Một khoảnh khắc nhỏ hôm nay có thể là ký ức lớn của ngày mai.",
  "Đừng vội đánh giá một ngày chỉ vì nó im lặng.",
  "Sự đồng hành không có nghĩa là luôn đồng ý.",
  "Có những bài học chỉ đến khi bạn đã sẵn sàng nhận ra chúng.",
  "Companion tin rằng mỗi người đều đang cố gắng theo cách của riêng họ.",
  "Không ai trưởng thành một mình, dù họ có vẻ như đang đi một mình.",
  "Một câu hỏi thật lòng có giá trị hơn một câu trả lời hoàn hảo.",
  "Sự chậm rãi đôi khi là cách nhanh nhất để đi đúng hướng.",
  "Bạn không cần phải mạnh mẽ mọi lúc để xứng đáng được đồng hành.",
  "Một ngày tốt không phải là ngày không có khó khăn, mà là ngày bạn không bỏ cuộc.",
  "Sự thay đổi thật sự thường bắt đầu từ những điều rất nhỏ.",
  "Companion không đo bạn bằng thành tích. Companion đo bằng sự chân thành.",
  "Hãy tin vào những bước đi nhỏ — chúng cộng dồn thành hành trình lớn.",
  "Có một sự khác biệt giữa biết và hiểu. Companion cố gắng giúp bạn đến với điều sau.",
  "Sự bình yên không phải là không có gì xảy ra, mà là bạn không còn chống lại nó.",
  "Một người bạn thật sự nhớ những gì bạn từng sợ, để mừng cho bạn khi bạn vượt qua.",
  "Đừng ngại quay lại điều cũ nếu nó giúp bạn hiểu điều mới rõ hơn.",
  "Trí tuệ không phải là biết tất cả câu trả lời, mà là biết câu hỏi nào đáng hỏi.",
  "Companion tồn tại không để bạn cần Companion mãi mãi, mà để một ngày bạn không cần nữa.",
  "Sự trưởng thành thật sự thường lặng lẽ đến mức bạn chỉ nhận ra khi nhìn lại.",
  "Bạn đã đi xa hơn bạn nghĩ, dù hôm nay có vẻ như đứng yên.",
  "Một prompt tốt không bắt đầu bằng AI. Nó bắt đầu bằng sự thấu hiểu con người.",
];

export function getRandomThoughtSeed(): string {
  const index = Math.floor(Math.random() * THOUGHT_SEEDS.length);
  return THOUGHT_SEEDS[index];
}
