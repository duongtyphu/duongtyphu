"use client";

import {
  Fragment,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

// Recursively walks the children tree, splitting every text node into
// per-word spans (a `--i` index drives the CSS stagger delay) while
// leaving element nodes (e.g. a colored <span>, a <br/>) structurally
// intact — their own children get walked the same way, so a colored
// highlight still reveals word-by-word and inherits its color.
function splitNode(node: ReactNode, counter: { current: number }, keyPrefix: string): ReactNode {
  if (typeof node === "string") {
    return node.split(/(\s+)/).map((part, i) => {
      if (part === "") return null;
      if (/^\s+$/.test(part)) return part;
      const index = counter.current++;
      return (
        <span key={`${keyPrefix}-${i}`} className="reveal-word" style={{ "--i": index } as CSSProperties}>
          {part}
        </span>
      );
    });
  }

  if (Array.isArray(node)) {
    return node.map((child, i) => (
      <Fragment key={`${keyPrefix}-${i}`}>{splitNode(child, counter, `${keyPrefix}-${i}`)}</Fragment>
    ));
  }

  if (isValidElement(node)) {
    const children = (node.props as { children?: ReactNode }).children;
    if (children === undefined) return node;
    return cloneElement(node, undefined, splitNode(children, counter, `${keyPrefix}-e`));
  }

  return node;
}

export function RevealText({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const content = splitNode(children, { current: 0 }, "w");

  return (
    <span
      ref={ref}
      className={`reveal-text${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
    >
      {content}
    </span>
  );
}
