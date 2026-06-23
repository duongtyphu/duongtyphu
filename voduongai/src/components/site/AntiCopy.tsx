"use client";

import { useEffect } from "react";

export function AntiCopy() {
  useEffect(() => {
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();
    const blockSelectStart = (e: Event) => e.preventDefault();
    const blockCopy = (e: ClipboardEvent) => e.preventDefault();
    const blockDragStart = (e: DragEvent) => e.preventDefault();

    const blockKeys = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (key === "f12") {
        e.preventDefault();
        return;
      }
      if (isCtrlOrCmd && e.shiftKey && ["i", "j", "c"].includes(key)) {
        e.preventDefault();
        return;
      }
      if (isCtrlOrCmd && ["c", "x", "u", "s", "p"].includes(key)) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("selectstart", blockSelectStart);
    document.addEventListener("copy", blockCopy);
    document.addEventListener("dragstart", blockDragStart);
    document.addEventListener("keydown", blockKeys);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("selectstart", blockSelectStart);
      document.removeEventListener("copy", blockCopy);
      document.removeEventListener("dragstart", blockDragStart);
      document.removeEventListener("keydown", blockKeys);
    };
  }, []);

  return null;
}
