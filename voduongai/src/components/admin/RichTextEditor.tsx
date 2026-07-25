"use client";

import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link2,
  Image as ImageIconLucide,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo2,
  Redo2,
  Eraser,
  Highlighter,
} from "lucide-react";

/**
 * "NỘI DUNG ĐẦY ĐỦ (HIỂN THỊ Ở TRANG CHI TIẾT)" — Founder yêu cầu trình
 * soạn thảo chuyên nghiệp (đính kèm ảnh chụp thanh công cụ Google Docs:
 * đậm/nghiêng/gạch chân/cỡ chữ/canh giữa/chèn ảnh/link/danh sách...).
 * Dùng TipTap (ProseMirror) — thư viện rich-text chuẩn cho React, hỗ trợ
 * React 19 chính thức. Lưu `content` dưới dạng HTML (thay plain text
 * `\n\n`-separated cũ) — xem `src/lib/portal/richText.ts` cho lớp tương
 * thích ngược với bài viết cũ.
 *
 * Không có hạ tầng upload file trong dự án (xác nhận qua toàn bộ
 * `imageUrl`/`ArticleImage.url`/`MarketingLink.url`... đều là dán URL đã
 * host sẵn) — chèn ảnh/link ở đây cũng dán URL qua `window.prompt()`,
 * đúng convention chung, không xây upload mới.
 *
 * `immediatelyRender: false` — bắt buộc với Next.js App Router (SSR) để
 * tránh lỗi hydration mismatch đã biết của TipTap.
 */

/** Cỡ chữ — TipTap chưa có package ổn định cho việc này (bản chính thức
 * mới nhất còn ở tag "next", chưa production-ready) — tự viết Extension
 * nhỏ mở rộng `textStyle` (đúng pattern tài liệu TipTap khuyến nghị),
 * không thêm dependency ngoài. */
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize || null,
            renderHTML: (attributes: { fontSize?: string | null }) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
});

const FONT_SIZES = [
  { label: "Nhỏ", value: "13px" },
  { label: "Bình thường", value: "" },
  { label: "Vừa", value: "18px" },
  { label: "Lớn", value: "22px" },
  { label: "Rất lớn", value: "28px" },
];

const toolbarBtn =
  "rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 data-[active=true]:bg-blue-100 data-[active=true]:text-brand-blue";

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TiptapImage.configure({ HTMLAttributes: { class: "rounded-lg max-w-full" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      FontSize,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "min-h-[220px] max-w-none px-3 py-2 text-sm text-gray-900 focus:outline-none prose prose-sm",
      },
    },
  });

  if (!editor) {
    return <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-400">Đang tải trình soạn thảo...</div>;
  }

  function addLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Đường link:", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function addImage() {
    if (!editor) return;
    const url = window.prompt("URL ảnh:");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-100 bg-gray-50/60 px-2 py-1.5">
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={toolbarBtn} title="Hoàn tác">
          <Undo2 className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={toolbarBtn} title="Làm lại">
          <Redo2 className="h-4 w-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-gray-200" />

        <select
          value={editor.isActive("heading", { level: 2 }) ? "h2" : editor.isActive("heading", { level: 3 }) ? "h3" : "p"}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "p") editor.chain().focus().setParagraph().run();
            else if (v === "h2") editor.chain().focus().setHeading({ level: 2 }).run();
            else editor.chain().focus().setHeading({ level: 3 }).run();
          }}
          className="rounded-md border border-transparent bg-transparent px-1.5 py-1 text-xs font-semibold text-gray-700 hover:border-gray-200 focus:outline-none"
        >
          <option value="p">Bình thường</option>
          <option value="h2">Tiêu đề lớn</option>
          <option value="h3">Tiêu đề nhỏ</option>
        </select>

        <select
          value={(editor.getAttributes("textStyle").fontSize as string) || ""}
          onChange={(e) => {
            const v = e.target.value;
            if (!v) editor.chain().focus().unsetMark("textStyle").run();
            else editor.chain().focus().setMark("textStyle", { fontSize: v }).run();
          }}
          className="rounded-md border border-transparent bg-transparent px-1.5 py-1 text-xs font-semibold text-gray-700 hover:border-gray-200 focus:outline-none"
        >
          {FONT_SIZES.map((s) => (
            <option key={s.label} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <span className="mx-1 h-5 w-px bg-gray-200" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          data-active={editor.isActive("bold")}
          className={toolbarBtn}
          title="In đậm"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          data-active={editor.isActive("italic")}
          className={toolbarBtn}
          title="In nghiêng"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          data-active={editor.isActive("underline")}
          className={toolbarBtn}
          title="Gạch chân"
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          data-active={editor.isActive("strike")}
          className={toolbarBtn}
          title="Gạch ngang"
        >
          <Strikethrough className="h-4 w-4" />
        </button>

        <label className={`${toolbarBtn} relative cursor-pointer`} title="Màu chữ">
          <span className="pointer-events-none">A</span>
          <input
            type="color"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          data-active={editor.isActive("highlight")}
          className={toolbarBtn}
          title="Đánh dấu (highlight)"
        >
          <Highlighter className="h-4 w-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-gray-200" />

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          data-active={editor.isActive({ textAlign: "left" })}
          className={toolbarBtn}
          title="Canh trái"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          data-active={editor.isActive({ textAlign: "center" })}
          className={toolbarBtn}
          title="Canh giữa"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          data-active={editor.isActive({ textAlign: "right" })}
          className={toolbarBtn}
          title="Canh phải"
        >
          <AlignRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          data-active={editor.isActive({ textAlign: "justify" })}
          className={toolbarBtn}
          title="Canh đều"
        >
          <AlignJustify className="h-4 w-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-gray-200" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          data-active={editor.isActive("bulletList")}
          className={toolbarBtn}
          title="Danh sách gạch đầu dòng"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          data-active={editor.isActive("orderedList")}
          className={toolbarBtn}
          title="Danh sách đánh số"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          data-active={editor.isActive("blockquote")}
          className={toolbarBtn}
          title="Trích dẫn"
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={toolbarBtn}
          title="Đường kẻ ngang"
        >
          <Minus className="h-4 w-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-gray-200" />

        <button type="button" onClick={addLink} data-active={editor.isActive("link")} className={toolbarBtn} title="Chèn liên kết">
          <Link2 className="h-4 w-4" />
        </button>
        <button type="button" onClick={addImage} className={toolbarBtn} title="Chèn ảnh">
          <ImageIconLucide className="h-4 w-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-gray-200" />

        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className={toolbarBtn}
          title="Xoá định dạng"
        >
          <Eraser className="h-4 w-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
