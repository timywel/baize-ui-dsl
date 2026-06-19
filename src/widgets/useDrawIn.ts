/**
 * useDrawIn — 折线图/柱状图 draw-in 动画
 *
 * 返回一个 0 → 1 的 progress 值, 用于 stroke-dashoffset / clip-path 动画.
 * 默认 1200ms ease-out.
 */

import { useEffect, useState } from "react";

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useDrawIn(duration = 1200, delay = 0): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf: number | null = null;
    let startTime: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      setProgress(easeOutCubic(t));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    timeoutId = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [duration, delay]);

  return progress;
}
