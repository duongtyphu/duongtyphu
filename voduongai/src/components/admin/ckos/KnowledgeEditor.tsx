"use client";

import { useRef } from "react";
import {
  Bold,
  Italic,
  Heading2,
  List,
  Link2,
  Code,
  Image as ImageIcon,
  Video,
  Paperclip,
  type LucideIcon,
} from "lucide-react";

function ToolbarButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-md text-white/60 transition hover:bg-white/10 hover:text-white"
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

/**
 * Shared editor for all 9 CKOS modules (Task 3) — one component, not one
 * per module. Markdown-based rather than a full WYSIWYG rich-text engine:
 * this repo has zero rich-text editor dependency today (confirmed in
 * ADM-SPR-001 research), and adding one (TipTap/Slate/Quill) is a real new
 * dependency this sandbox has no way to visually verify. Markdown + a
 * formatting toolbar covers the same content types (headings, lists, code
 * blocks, images, video embeds, attachments, internal links) with zero new
 * dependencies. A true WYSIWYG upgrade is flagged as future work in
 * docs/admin/CKOS_MANAGEMENT.md.
 */
export function KnowledgeEditor({
  value,
  onChange,
  onInsertInternalLink,
}: {
  value: string;
  onChange: (next: string) => void;
  /** Opens the RelationshipPicker so the user can insert `[label](internal://module/id)`. */
  onInsertInternalLink?: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function wrapSelection(before: string, after = before) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || "văn bản";
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  function insertAtCursor(text: string) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const next = value.slice(0, start) + text + value.slice(el.selectionEnd);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + text.length, start + text.length);
    });
  }

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
      <div className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-white/5 p-1.5">
        <ToolbarButton icon={Bold} label="In đậm" onClick={() => wrapSelection("**")} />
        <ToolbarButton icon={Italic} label="In nghiêng" onClick={() => wrapSelection("_")} />
        <ToolbarButton icon={Heading2} label="Tiêu đề" onClick={() => insertAtCursor("\n## Tiêu đề\n")} />
        <ToolbarButton icon={List} label="Danh sách" onClick={() => insertAtCursor("\n- Mục 1\n- Mục 2\n")} />
        <ToolbarButton icon={Code} label="Khối code" onClick={() => insertAtCursor("\n```\ncode\n```\n")} />
        <ToolbarButton icon={Link2} label="Liên kết" onClick={() => wrapSelection("[", "](https://)")} />
        <ToolbarButton icon={ImageIcon} label="Hình ảnh" onClick={() => insertAtCursor("\n![Mô tả](https://)\n")} />
        <ToolbarButton icon={Video} label="Video" onClick={() => insertAtCursor("\n[Video](https://)\n")} />
        <ToolbarButton
          icon={Paperclip}
          label="Tệp đính kèm"
          onClick={() => insertAtCursor("\n[Tệp đính kèm](https://)\n")}
        />
        {onInsertInternalLink && (
          <button
            type="button"
            onClick={onInsertInternalLink}
            className="ml-1 rounded-md border border-white/10 px-2 py-1 text-[11px] font-semibold text-white/70 hover:bg-white/10 hover:text-white"
          >
            + Liên kết nội bộ
          </button>
        )}
        <span className="ml-auto pr-1 text-[10px] font-semibold uppercase tracking-wide text-white/30">Markdown</span>
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={12}
        placeholder="Viết nội dung bằng Markdown..."
        className="w-full resize-y bg-transparent px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none"
      />
    </div>
  );
}
