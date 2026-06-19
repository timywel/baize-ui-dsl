/**
 * RightToc — 右侧 sticky 目录 (自动从 h2 / h3 抓取)
 */

import { useEffect, useState } from "react";

export interface TocItem {
  readonly id: string;
  readonly text: string;
  readonly level: 2 | 3;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s一-鿿]+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/^-+|-+$/g, "");
}

export default function RightToc({
  contentRef,
}: {
  readonly contentRef: React.RefObject<HTMLElement>;
}) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;
    const headings = Array.from(
      root.querySelectorAll<HTMLHeadingElement>("h2, h3"),
    );
    const found: TocItem[] = headings
      .map((h) => ({
        id: h.id || slugify(h.textContent ?? ""),
        text: h.textContent ?? "",
        level: h.tagName === "H2" ? 2 : 3,
      }))
      .filter((i) => i.text);
    // 给 heading 添加 id (如果还没有)
    headings.forEach((h, idx) => {
      const item = found[idx];
      if (item && !h.id && item.id) {
        h.id = item.id;
      }
    });
    setItems(found);

    // 监听滚动, 高亮当前 section
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveId(e.target.id);
        }
      },
      { rootMargin: "-20% 0px -75% 0px" },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [contentRef]);

  if (items.length === 0) {
    return (
      <nav className="right-toc" aria-label="本页目录">
        <div className="right-toc-title">本页目录</div>
      </nav>
    );
  }

  return (
    <nav className="right-toc" aria-label="本页目录">
      <div className="right-toc-title">本页目录</div>
      <ul className="right-toc-list">
        {items.map((item) => (
          <li
            key={item.id}
            className={`right-toc-item level-${item.level} ${activeId === item.id ? "active" : ""}`}
          >
            <a href={`#${item.id}`}>{item.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}