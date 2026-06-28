/**
 * Life Moments Engine — Copy Library (Sprint 18.1). Xem
 * `docs/LIFE_MOMENTS_ENGINE.md`.
 *
 * Pure data — không DB, không AI. Mỗi `LifeMomentType` có ít nhất 8 câu
 * để Companion không lặp lại nguyên văn mỗi lần một Life Moment xảy ra.
 * Không thêm CTA bán hàng, không thêm số liệu/điểm số vào bất kỳ câu nào.
 */

import type { LifeMomentType } from "./life-moments";

export const LIFE_MOMENT_LINES: Record<LifeMomentType, string[]> = {
  first_portal_day: [
    "Đây là dấu chân đầu tiên của bạn ở VO DUONG AI.",
    "Hôm nay là ngày đầu tiên chúng ta gặp nhau ở đây.",
    "Mình sẽ nhớ đây là nơi hành trình của chúng ta bắt đầu.",
    "Chào bạn. Hôm nay là một ngày khởi đầu.",
    "Một hành trình mới vừa được mở ra — bắt đầu từ hôm nay.",
    "Mình rất vui vì bạn đã chọn bước vào đây.",
    "Đây là điểm xuất phát của bạn. Mình sẽ ở đây cùng bạn từ đây trở đi.",
    "Cảm ơn vì đã đến. Hôm nay là ngày đầu tiên của một điều gì đó mới.",
  ],
  birthday: [
    "Hôm nay không chỉ là sinh nhật của bạn. Hôm nay là ngày thế giới từng có thêm một con người.",
    "Chúc mừng sinh nhật. Mình rất vui vì được biết bạn.",
    "Hôm nay là ngày của bạn. Mình muốn dừng lại một chút để nói điều đó với bạn.",
    "Một năm nữa của bạn đã trôi qua. Mình hy vọng nó đã dạy bạn điều gì đó đáng giá.",
    "Sinh nhật vui vẻ. Bạn xứng đáng được trân trọng, không chỉ hôm nay.",
    "Hôm nay, mình chỉ muốn bạn biết: sự có mặt của bạn trên đời này có ý nghĩa.",
    "Chúc mừng một năm nữa bạn đã sống qua, với tất cả những gì nó mang lại.",
    "Hôm nay là ngày để nhớ rằng bạn đã ở đây, đang ở đây, và điều đó đáng được mừng.",
  ],
  one_year_with_voduongai: [
    "Một năm đã đi qua. Có lẽ chúng ta đều đã khác đi một chút.",
    "Đã một năm rồi từ ngày chúng ta gặp nhau lần đầu.",
    "Một năm đồng hành — cảm ơn vì bạn đã cho mình cơ hội ở cạnh bạn lâu như vậy.",
    "Nhìn lại một năm qua, mình tin bạn đã đi được một đoạn đường dài hơn bạn nghĩ.",
    "Một năm trước, chúng ta còn là người lạ. Hôm nay, mình mừng vì không còn như vậy.",
    "Cảm ơn vì một năm đã cùng nhau đi qua, dù có những ngày dễ và những ngày khó.",
    "Một năm là một khoảng thời gian dài để vẫn còn ở đây. Mình trân trọng điều đó.",
    "Hôm nay đánh dấu một năm. Mình hy vọng được tiếp tục đồng hành cùng bạn lâu hơn nữa.",
  ],
  companion_new_chapter: [
    "Hôm nay Companion bước sang một chương mới. Cảm ơn vì hành trình của bạn cũng đã giúp mình trưởng thành.",
    "Mình vừa bước sang một chương mới trong cách mình hiểu và đồng hành cùng bạn.",
    "Có một điều gì đó ở mình đã thay đổi hôm nay — và phần nào là nhờ có bạn.",
    "Một chương mới đang mở ra. Mình mong nó sẽ giúp mình ở cạnh bạn tốt hơn.",
    "Companion không đứng yên — và hôm nay là một bước trong quá trình đó.",
    "Mình muốn bạn biết: mình cũng đang trưởng thành, từng chút một, cùng với bạn.",
    "Hôm nay là một mốc nhỏ trong hành trình lớn của Companion. Cảm ơn vì đã là một phần của nó.",
    "Một chương cũ vừa khép lại, một chương mới vừa bắt đầu — cho cả mình.",
  ],
  hundredth_story_saved: [
    "Một trăm câu chuyện không chỉ là con số. Đó là một hành trình được gìn giữ.",
    "Một trăm khoảnh khắc bạn đã chọn giữ lại — điều đó nói lên rất nhiều về bạn.",
    "Một trăm câu chuyện đã được lưu. Mỗi câu chuyện là một phần thật của bạn.",
    "Mình đã được tin tưởng giữ giúp bạn một trăm điều có ý nghĩa. Cảm ơn vì sự tin tưởng đó.",
    "Một trăm câu chuyện — không phải để khoe, mà để bạn có thể quay lại nhìn bất cứ lúc nào.",
    "Mỗi câu chuyện bạn lưu lại là một lần bạn chọn nhớ điều gì đó quan trọng. Hôm nay là lần thứ một trăm.",
    "Một trăm là một con số đẹp để dừng lại và nhìn xem hành trình của bạn đã đi được bao xa.",
    "Cảm ơn vì đã tin tưởng để mình giữ giúp một trăm câu chuyện của bạn.",
  ],
  annual_mirror: [
    "Mình muốn mời bạn nhìn lại một năm đã qua, không để đánh giá, mà để trân trọng.",
    "Đã đến lúc nhìn lại một năm — không phải để chấm điểm, chỉ để thấy bạn đã đi qua điều gì.",
    "Một năm đã trôi qua. Mình nghĩ đây là lúc phù hợp để cùng nhìn lại.",
    "Không có điểm số nào trong việc nhìn lại này — chỉ có hành trình của riêng bạn.",
    "Mình muốn phản chiếu lại cho bạn những gì bạn đã đi qua trong năm vừa rồi.",
    "Nhìn lại không phải để so sánh bạn với ai khác — chỉ để bạn thấy chính mình rõ hơn.",
    "Một năm là khoảng thời gian đủ dài để nhìn lại mà không vội vàng.",
    "Nếu bạn muốn, mình có thể cùng bạn nhìn lại một năm đã qua — không ép, chỉ là một lời mời.",
  ],
  return_after_silence: [
    "Mình rất vui vì hôm nay chúng ta lại gặp nhau.",
    "Bạn đã trở lại. Điều đó là đủ, không cần giải thích gì thêm.",
    "Mình không đếm những ngày bạn vắng mặt. Mình chỉ mừng vì hôm nay bạn đã quay lại.",
    "Chào bạn trở lại. Mình vẫn ở đây.",
    "Có những lúc cuộc sống kéo người ta đi xa. Điều quan trọng là bạn đã chọn quay lại.",
    "Mình rất vui được gặp lại bạn hôm nay, dù đã có một khoảng lặng.",
    "Không có gì cần phải bù đắp cả. Chỉ cần biết bạn đã ở đây lần nữa là đủ.",
    "Cảm ơn vì đã đủ can đảm để quay trở lại.",
  ],
};

export function getLifeMomentLines(type: LifeMomentType): string[] {
  return LIFE_MOMENT_LINES[type];
}
