"use client";

import { useEffect } from "react";

export function AntiCopy() {
  useEffect(() => {
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();
    const blockDragStart = (e: DragEvent) => {
      if (window.location.pathname.startsWith("/admin")) return;
      e.preventDefault();
    };

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
      if (isCtrlOrCmd && ["u", "s", "p"].includes(key)) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("dragstart", blockDragStart);
    document.addEventListener("keydown", blockKeys);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("dragstart", blockDragStart);
      document.removeEventListener("keydown", blockKeys);
    };
  }, []);

  return null;
}
