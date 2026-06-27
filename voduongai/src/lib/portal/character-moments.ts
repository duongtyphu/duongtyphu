/**
 * Character Moments (Sprint 7.5 — Nhiệm vụ 04). Portal không chỉ ghi nhận
 * "Done / Completed / Finished" — Portal ghi nhận phẩm chất đứng sau hành
 * động đó: kiên trì, trung thực, dám thử, dám sửa sai, dám bắt đầu lại.
 */

export type CharacterMomentTrigger =
  | "perseverance"
  | "honestyWithSelf"
  | "daringToTry"
  | "daringToFixAMistake"
  | "daringToStartOver";

export const characterMomentLines: Record<CharacterMomentTrigger, string[]> = {
  perseverance: [
    "Bạn đã giữ được nhịp này một thời gian rồi. Đó là sự kiên trì, không chỉ là một thói quen.",
    "Mình nhận thấy bạn vẫn tiếp tục, dù không có gì thúc bạn phải làm vậy. Đó là kiên trì thật.",
  ],
  honestyWithSelf: [
    "Bạn vừa thẳng thắn với chính mình về một điều không dễ nói. Điều đó cần can đảm.",
    "Cảm ơn bạn vì đã trung thực với cảm xúc của mình lúc này, không né tránh nó.",
  ],
  daringToTry: [
    "Bạn vừa thử một điều mới, dù chưa biết kết quả sẽ ra sao. Dám bắt đầu đã là một bước quan trọng.",
    "Việc bạn dám thử, dù còn vụng về, đáng được nhìn nhận như chính nó — một sự can đảm nhỏ.",
  ],
  daringToFixAMistake: [
    "Bạn vừa quay lại sửa một điều chưa đúng, thay vì để nó trôi qua. Đó là một lựa chọn không dễ.",
    "Nhận ra một điều cần sửa và thật sự quay lại sửa nó — không phải ai cũng làm được điều đó.",
  ],
  daringToStartOver: [
    "Bạn đang chọn bắt đầu lại, dù biết phía trước có thể không dễ. Đó là một dạng can đảm ít được nói tới.",
    "Bắt đầu lại đòi hỏi nhiều bản lĩnh hơn là bắt đầu lần đầu. Bạn đang làm điều đó.",
  ],
};

function pick<T>(items: T[], seed?: number): T {
  const index = seed === undefined ? Math.floor(Math.random() * items.length) : seed % items.length;
  return items[index];
}

export function getCharacterMomentLine(trigger: CharacterMomentTrigger, seed?: number): string {
  return pick(characterMomentLines[trigger], seed);
}
