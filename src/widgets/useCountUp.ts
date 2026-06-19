/**
 * useCountUp — 数字从 0 动画到目标值
 *
 * 用于 KPI 数字、百分比等需要 count-up 动效的场景.
 * 用 requestAnimationFrame + easeOutCubic, 默认 800ms.
 */

import { useEffect, useState, useRef } from "react";

export interface CountUpOptions {
  readonly duration?: number;
  readonly start?: number;
  readonly decimals?: number;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useCountUp(
  target: number,
  options: CountUpOptions = {},
): number {
  const { duration = 800, start = 0, decimals = 0 } = options;
  const [value, setValue] = useState(start);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startTimeRef.current = null;
    setValue(start);

    const tick = (now: number) => {
      if (startTimeRef.current === null) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      const current = start + (target - start) * eased;
      setValue(Number(current.toFixed(decimals)));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, start, duration, decimals]);

  return value;
}
