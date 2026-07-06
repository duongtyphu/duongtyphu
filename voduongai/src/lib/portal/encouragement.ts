/**
 * Encouragement Library (Sprint 7.3 — Nhiệm vụ 02). Viết như một người bạn
 * trưởng thành đang nói chuyện thật, không phải slogan hay câu cổ động kiểu
 * "Bạn là số một". Mỗi câu nên đứng được một mình, không cần CTA đi kèm.
 * Tối thiểu 20 dòng cho mỗi tình huống.
 */

export type EncouragementSituation =
  | "losingMotivation"
  | "failure"
  | "returningAfterLongAbsence"
  | "completedSomethingSmall"
  | "helpedSomeoneElse"
  | "startingOver";

export const encouragementLibrary: Record<EncouragementSituation, string[]> = {
  losingMotivation: [
    "Không có động lực không có nghĩa là bạn đang đi sai hướng. Đôi khi nó chỉ là dấu hiệu bạn cần nghỉ một chút.",
    "Có những ngày mọi thứ đều nặng hơn bình thường. Không cần ép mình phải hào hứng ngay lúc này.",
    "Bạn không cần cảm thấy có động lực mới được phép tiếp tục. Chỉ cần làm một việc nhỏ, mọi thứ vẫn đang chạy.",
    "Động lực lên xuống là điều bình thường, không phải dấu hiệu bạn không phù hợp với con đường này.",
    "Nếu hôm nay bạn chỉ làm được 10% so với ngày hôm trước, 10% đó vẫn có giá trị.",
    "Không sao nếu bạn cần chậm lại. Hành trình này không tính bằng tốc độ, mà bằng việc bạn còn ở đây.",
    "Có lẽ điều bạn cần không phải là thêm động lực, mà là một việc nhỏ hơn để bắt đầu lại.",
    "Cảm giác chán không phải lỗi của bạn. Nó chỉ đang nói rằng bạn cần một nhịp khác đi một chút.",
    "Bạn đã đi được một đoạn không nhỏ rồi, dù bây giờ không cảm nhận được điều đó.",
    "Không phải lúc nào cũng cần cảm thấy 'muốn làm' mới làm được. Có những ngày chỉ cần làm vì đã hứa với chính mình.",
    "Nghỉ một ngày không xóa đi những gì bạn đã xây dựng trước đó.",
    "Có lẽ bạn đang mệt hơn là đang mất hứng. Hai điều đó cần những cách chăm sóc khác nhau.",
    "Một bước rất nhỏ, dù nhỏ đến đâu, vẫn là một bước đi tới, không phải đứng yên.",
    "Bạn không cần phải lấy lại 100% năng lượng mới được phép tiếp tục. 20% cũng đủ để làm một việc.",
    "Có thể bạn đang so sánh mình với một phiên bản tưởng tượng quá lý tưởng của chính mình.",
    "Không ai duy trì động lực cao mãi mãi. Người đi được xa là người biết đi chậm khi cần, không phải người không bao giờ chậm lại.",
    "Bạn vẫn đang ở đây, vẫn đang đọc những dòng này — điều đó đáng được ghi nhận, dù bạn chưa làm gì hôm nay.",
    "Có lẽ hôm nay không phải ngày để tiến xa, mà là ngày để giữ cho mình không bỏ cuộc.",
    "Một quyết định nhỏ — như mở Học viện lên hôm nay — cũng là một hình thức của sự kiên trì.",
    "Khi cảm thấy chùn lại, hãy nhớ rằng cảm giác này sẽ qua, giống như những lần trước nó đã từng qua.",
    "Không cần phải tìm lại cảm hứng ngay lúc này. Đôi khi cảm hứng quay lại sau khi bạn đã bắt đầu, không phải trước đó.",
  ],
  failure: [
    "Một lần chưa làm được không có nghĩa là bạn không làm được. Nó chỉ có nghĩa là lần này chưa đến lúc.",
    "Thất bại lần này không xóa đi những gì bạn đã học được trước đó.",
    "Có lẽ điều không như ý vừa xảy ra sẽ trở thành một bài học quan trọng sau này, dù bây giờ chưa thấy rõ.",
    "Không sao nếu kết quả không như mong đợi. Bạn vẫn đã thử, và điều đó không phải ai cũng làm được.",
    "Một kế hoạch không thành công không có nghĩa là con người thực hiện nó thất bại.",
    "Bạn được phép buồn về điều này một chút, trước khi nghĩ đến bước tiếp theo.",
    "Sai lầm lần này là thông tin, không phải bản án về giá trị của bạn.",
    "Nhiều điều giá trị nhất mà người ta học được lại đến từ những lần không thành công, không phải từ những lần suôn sẻ.",
    "Bạn không cần phải có câu trả lời ngay bây giờ cho việc 'tiếp theo nên làm gì'.",
    "Cảm giác hụt hẫng lúc này là bình thường. Nó không có nghĩa là bạn nên dừng lại.",
    "Có lẽ điều bạn cần lúc này không phải là phân tích lỗi ngay, mà là cho mình một chút thời gian để bình tâm lại.",
    "Một thất bại không định nghĩa toàn bộ con đường bạn đang đi.",
    "Người đi xa không phải người không bao giờ vấp, mà là người vẫn tiếp tục đi sau khi vấp.",
    "Bạn đã dám thử điều mà nhiều người còn chưa dám bắt đầu. Điều đó vẫn đáng được nhìn nhận.",
    "Không cần phải vội vàng rút ra bài học ngay. Có những bài học cần thời gian mới hiện rõ.",
    "Việc bạn vẫn đang ở đây sau một lần không thành công đã nói lên điều gì đó về sự kiên trì của bạn.",
    "Có thể lần này chưa đúng cách, không phải chưa đúng người.",
    "Đừng vội kết luận về bản thân mình chỉ qua một kết quả. Một con người không thể được đo bằng một thời điểm.",
    "Nếu cần, hãy cho phép mình nghỉ trước khi thử lại — không phải vì yếu đuối, mà vì bạn đang chăm sóc chính mình.",
    "Điều quan trọng không phải là bạn đã thất bại, mà là bạn chọn làm gì tiếp theo, vào lúc nào bạn thấy sẵn sàng.",
    "Bạn không đơn độc trong việc này. Hầu hết những người đang ở phía trước bạn cũng từng đứng ở chỗ này.",
  ],
  returningAfterLongAbsence: [
    "Dù bạn vắng mặt bao lâu, hành trình này vẫn còn ở đây, không hề biến mất.",
    "Không cần giải thích vì sao bạn đã rời đi một thời gian. Điều quan trọng là bạn đã quay lại.",
    "Những gì bạn từng học, từng làm trước đây vẫn còn đó, không mất đi chỉ vì bạn tạm dừng.",
    "Quay lại sau một thời gian dài không phải là bắt đầu lại từ số 0, mà là tiếp tục từ một nơi đã có nền tảng.",
    "Không sao nếu bạn cần vài ngày để làm quen lại. Mọi thứ không cần phải trôi chảy ngay từ ngày đầu.",
    "Có lẽ cuộc sống đã đưa bạn đi nơi khác một thời gian. Giờ bạn ở đây là điều đáng được đón nhận, không phải bị nhắc nhở.",
    "Bạn không cần phải bù lại tất cả những gì đã 'bỏ lỡ'. Chỉ cần bắt đầu lại từ hôm nay.",
    "Cảm ơn vì bạn đã chọn quay lại, dù có rất nhiều lý do để không quay lại.",
    "Khoảng thời gian vắng mặt không phải là một khoảng trống vô nghĩa — có thể bạn đã học được điều gì khác trong lúc đó.",
    "Không có 'quá muộn' để quay lại một điều mình từng quan tâm.",
    "Bạn không cần lo lắng về việc mình đã quên những gì. Nhớ lại dần là một phần bình thường của việc quay lại.",
    "Hành trình này không tính điểm cho việc bạn có mặt liên tục hay không. Nó chỉ ghi nhận rằng bạn vẫn đang đi.",
    "Có lẽ điều khó nhất chỉ là bước đầu tiên để quay lại, và bạn đã vừa làm điều đó.",
    "Bạn không cần phải tỏ ra hào hứng ngay. Quen lại từng chút một cũng là một cách bắt đầu.",
    "Không ai mong bạn phải tiếp tục đúng nơi cũ với đúng tốc độ cũ. Bạn được phép bắt đầu lại theo cách của riêng mình.",
    "Sự vắng mặt không phải là một thất bại cần được sửa chữa, nó chỉ là một phần của một hành trình dài hơn.",
    "Có lẽ trong lúc bạn vắng mặt, một phần nào đó trong bạn vẫn đang âm thầm chuẩn bị để quay lại lúc này.",
    "Bạn không cần phải biết hết lý do vì sao mình rời đi để được phép quay lại.",
    "Cứ coi đây là một điểm bắt đầu mới, không phải một điểm phải nối lại cho hoàn hảo với điểm cũ.",
    "Nơi này không đánh giá thời gian bạn đã rời đi. Nó chỉ vui vì bạn đang ở đây lúc này.",
    "Quay lại đã là một quyết định không dễ. Bạn đã làm được điều đó.",
  ],
  completedSomethingSmall: [
    "Một việc nhỏ vừa hoàn thành vẫn là một việc đã hoàn thành — không cần phải lớn mới đáng được ghi nhận.",
    "Bạn vừa làm xong một điều mà có lúc bạn còn chưa chắc mình sẽ làm.",
    "Những việc nhỏ như thế này, khi cộng lại, chính là thứ tạo nên những thay đổi lớn sau này.",
    "Không cần đợi một kết quả to lớn mới được phép tự hào về một bước tiến nhỏ.",
    "Bạn đã giữ lời hứa với chính mình hôm nay, dù chỉ là một việc nhỏ.",
    "Một bước nhỏ hoàn thành đúng lúc đôi khi quan trọng hơn một bước lớn bị trì hoãn.",
    "Việc bạn hoàn thành hôm nay là minh chứng rằng bạn vẫn đang tiến lên, không đứng yên.",
    "Cảm giác hoàn thành một việc nhỏ này — hãy cho phép mình giữ lại nó một chút, đừng vội chuyển sang việc tiếp theo ngay.",
    "Không phải mọi tiến bộ đều cần ồn ào để có giá trị. Cái này, dù nhỏ, vẫn có giá trị thật.",
    "Bạn đang xây dựng một thói quen tốt: làm xong những việc mình bắt đầu, dù nhỏ.",
    "Việc nhỏ hôm nay là một viên gạch, không phải là cả căn nhà — nhưng không có viên gạch nào là thừa.",
    "Bạn vừa chứng minh với chính mình rằng mình có thể bắt đầu và hoàn thành. Điều đó đáng nhớ.",
    "Không cần ai khác xác nhận để việc bạn vừa làm có giá trị. Bạn đã biết rồi.",
    "Đây là kiểu tiến bộ ít người nhìn thấy, nhưng lại là kiểu tiến bộ bền nhất.",
    "Một việc nhỏ xong đúng lúc còn tốt hơn một việc lớn còn dang dở.",
    "Bạn đang học được rằng mình không cần phải làm điều gì to tát để cảm thấy mình đang đi đúng hướng.",
    "Cứ ăn mừng việc nhỏ này theo cách của riêng bạn, không cần phải chờ một cột mốc lớn hơn.",
    "Việc bạn vừa hoàn thành là một lời nhắc rằng bạn vẫn đang giữ nhịp, dù mọi thứ khác có bận rộn thế nào.",
    "Nhiều người bỏ cuộc trước khi hoàn thành những việc nhỏ như thế này. Bạn đã không bỏ cuộc.",
    "Một việc nhỏ, làm đến cùng, là một dạng kỷ luật âm thầm mà không phải ai cũng có.",
    "Hãy cho mình một khoảnh khắc để công nhận điều này, trước khi nghĩ đến việc tiếp theo cần làm.",
  ],
  helpedSomeoneElse: [
    "Bạn vừa dùng một phần thời gian của mình để giúp người khác đi nhanh hơn. Điều đó không hề nhỏ.",
    "Sự giúp đỡ bạn vừa dành cho ai đó có thể sẽ theo họ rất lâu sau buổi hôm nay.",
    "Không phải ai cũng sẵn lòng dừng lại để giúp người khác khi bản thân mình cũng đang bận. Bạn đã làm điều đó.",
    "Có lẽ bạn không nhận ra, nhưng cách bạn vừa giúp người khác cũng là một dạng trưởng thành.",
    "Một câu trả lời chân thành, một lời động viên đúng lúc — đôi khi đó là điều người khác cần nhất.",
    "Việc bạn giúp đỡ người khác không lấy đi gì từ hành trình của riêng bạn, nó chỉ làm hành trình đó có thêm ý nghĩa.",
    "Người được bạn giúp hôm nay có thể sẽ giúp lại một người khác trong tương lai. Điều tốt thường lan đi như vậy.",
    "Bạn không cần là chuyên gia để giúp ai đó cảm thấy được lắng nghe. Bạn chỉ cần có mặt.",
    "Khoảnh khắc bạn dành cho người khác hôm nay là một phần câu chuyện của riêng bạn, không kém gì những thành tựu cá nhân.",
    "Có những điều bạn nói tưởng như đơn giản, nhưng lại đúng lúc với người cần nghe nó.",
    "Giúp người khác không làm bạn chậm lại — nó thường khiến cả hai cùng đi xa hơn.",
    "Bạn đang cho thấy rằng hành trình này không chỉ là về việc đi nhanh một mình, mà còn là về việc đi cùng nhau.",
    "Không cần ai ghi nhận điều này để nó có giá trị, nhưng nếu cần một lời ghi nhận: cảm ơn vì bạn đã làm điều đó.",
    "Một người được giúp đúng lúc có thể tránh được rất nhiều khó khăn không cần thiết. Bạn vừa làm được điều đó cho ai đó.",
    "Việc sẵn lòng chia sẻ những gì mình biết, dù còn ít, vẫn là một hành động đáng quý.",
    "Bạn không chỉ đang học cho riêng mình nữa — bạn đang bắt đầu mang điều mình học được đến với người khác.",
    "Có lẽ chính việc giúp người khác cũng đang giúp bạn nhìn lại và hiểu rõ hơn những gì mình đã học.",
    "Lòng tốt không cần phải lớn mới có ý nghĩa. Một sự giúp đỡ nhỏ, đúng lúc, vẫn đủ để thay đổi một ngày của ai đó.",
    "Bạn vừa cho thấy mình không chỉ quan tâm đến hành trình của riêng mình, mà còn quan tâm đến người khác trên đường đi.",
    "Điều bạn vừa làm không phải để được nhìn thấy, mà có lẽ vì bạn thật sự muốn người đó tốt hơn. Điều đó đáng quý.",
    "Hãy nhớ cảm giác này — cảm giác khi giúp ai đó một cách thật lòng. Nó cũng là một phần của sự trưởng thành của bạn.",
  ],
  startingOver: [
    "Bắt đầu lại không có nghĩa là những gì đã qua trở thành vô nghĩa. Nó có nghĩa là bạn đang chọn tiếp tục theo một cách khác.",
    "Không sao nếu lần này bạn phải bắt đầu từ một điểm khác với lần trước. Mỗi lần bắt đầu đều có giá trị riêng của nó.",
    "Bạn không yếu hơn vì phải bắt đầu lại. Bạn chỉ đang chọn không bỏ cuộc.",
    "Có những hành trình cần nhiều hơn một lần bắt đầu mới đi được đến nơi cần đến.",
    "Lần bắt đầu này có một thứ mà lần trước không có: những gì bạn đã học được từ lần trước.",
    "Không cần phải xóa bỏ hoàn toàn những gì cũ để bắt đầu lại. Bạn được phép giữ lại những gì còn hữu ích.",
    "Bắt đầu lại đòi hỏi nhiều can đảm hơn là bắt đầu lần đầu, vì lần này bạn đã biết phía trước có thể khó khăn.",
    "Bạn đang cho mình một cơ hội khác. Điều đó nói lên rằng bạn vẫn tin vào hành trình này.",
    "Không có giới hạn cho số lần một người được phép bắt đầu lại, miễn là họ vẫn còn muốn tiếp tục.",
    "Có lẽ lần trước chưa phải lúc đúng. Lần này có thể sẽ khác, và điều đó hoàn toàn có thể xảy ra.",
    "Việc bạn quyết định bắt đầu lại, dù biết sẽ không dễ, đã là một dạng can đảm.",
    "Bạn không cần phải vội vàng để 'bù' lại thời gian đã qua. Bắt đầu lại đúng cách quan trọng hơn bắt đầu lại nhanh.",
    "Mỗi lần bắt đầu lại là một cơ hội để làm điều đó tốt hơn, không phải để chứng minh lần trước đã sai.",
    "Bạn không phải là người duy nhất từng phải bắt đầu lại một điều quan trọng với mình.",
    "Hãy cho phép bản thân bắt đầu lại theo nhịp độ của riêng mình, không theo áp lực phải bằng người khác.",
    "Bắt đầu lại không phải là lùi về vạch xuất phát. Bạn vẫn mang theo những gì mình đã từng học được.",
    "Có lẽ điều quan trọng nhất lúc này không phải là đi nhanh, mà là đi đúng nhịp mà bạn có thể duy trì lâu dài.",
    "Việc bạn chọn quay lại và bắt đầu lại, thay vì để mọi thứ dừng hẳn, đã là một quyết định đáng được ghi nhận.",
    "Không ai có thể đoán trước hành trình sẽ luôn thẳng tắp. Vòng lại để bắt đầu lại cũng là một phần bình thường của nó.",
    "Bạn đang viết một chương mới, không phải đang viết lại từ đầu một chương đã cũ.",
    "Cứ bắt đầu lại theo cách nhẹ nhàng nhất có thể với chính mình. Không cần phải khắt khe ngay từ ngày đầu.",
  ],
};

function pick<T>(items: T[], seed?: number): T {
  const index = seed === undefined ? Math.floor(Math.random() * items.length) : seed % items.length;
  return items[index];
}

export function getEncouragementLine(situation: EncouragementSituation, seed?: number): string {
  return pick(encouragementLibrary[situation], seed);
}
