/**
 * useReveal — IntersectionObserver 触发的 reveal 动画
 *
 * 元素进入 viewport 时添加 .is-visible 类, 触发 CSS 动画.
 * 用法:
 *   const ref = useReveal<HTMLDivElement>();
 *   <div ref={ref} className="reveal-up">...</div>
 */

import { useEffect, useRef, useState } from "react";

export type RevealVariant = "up" | "fade" | "left" | "right" | "scale";

export interface UseRevealOptions {
  /** 触发阈值 (0-1, 默认 0.15) */
  readonly threshold?: number;
  /** 触发后只触发一次 (默认 true) */
  readonly once?: boolean;
  /** 进入视窗时附加的 class (默认 "is-visible") */
  readonly visibleClass?: string;
  /** rootMargin, 用于提前触发 */
  readonly rootMargin?: string;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {},
) {
  const {
    threshold = 0.15,
    once = true,
    visibleClass = "is-visible",
    rootMargin = "0px 0px -60px 0px",
  } = options;
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 不支持 IntersectionObserver 时直接显示 (SSR/旧浏览器)
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add(visibleClass);
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add(visibleClass);
            setIsVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            el.classList.remove(visibleClass);
            setIsVisible(false);
          }
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once, visibleClass, rootMargin]);

  return { ref, isVisible };
}