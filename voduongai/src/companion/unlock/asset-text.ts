import type { UnlockableAsset } from "./unlock.types";

/** Chuyển nội dung asset thành văn bản thuần — dùng cho Copy/Save (không cần backend). */
export function assetToPlainText(asset: UnlockableAsset): string {
  const lines: string[] = [asset.title, ""];
  if (asset.type === "prompt_pack" && "prompts" in asset.content) {
    asset.content.prompts.forEach((p) => {
      lines.push(`## ${p.label}`, p.prompt, "");
    });
  } else if (asset.type === "checklist" && "items" in asset.content) {
    asset.content.items.forEach((item) => {
      lines.push(`- ${item.label}: ${item.detail}`);
    });
  } else if (asset.type === "template" && "templates" in asset.content) {
    asset.content.templates.forEach((t) => {
      lines.push(`## ${t.label}`, t.body, "");
    });
  }
  return lines.join("\n");
}

export function fileNameForAsset(asset: UnlockableAsset): string {
  const slug = asset.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${slug || asset.id}.txt`;
}
