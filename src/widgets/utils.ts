/**
 * Widget 共享 utilities
 */

import { themeTokens } from "../theme/tokens.js";
import type { ProgressStatus } from "../types/dsl.js";

/**
 * 取图表系列颜色 — 优先用 series.color, 否则从调色板按 index 取
 */
export function getSeriesColor(index: number, override?: string): string {
  if (override) return override;
  const palette = themeTokens.color.chartPalette;
  const fallback = "#2563eb";
  return palette[index % palette.length] ?? fallback;
}

/**
 * 状态 → CSS class + 颜色映射
 */
export const statusColorMap: Record<
  ProgressStatus,
  { readonly bg: string; readonly text: string; readonly ring: string }
> = {
  pending: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-700 dark:text-gray-300",
    ring: "ring-gray-300 dark:ring-gray-600",
  },
  in_progress: {
    bg: "bg-blue-100 dark:bg-blue-950",
    text: "text-blue-700 dark:text-blue-300",
    ring: "ring-blue-300 dark:ring-blue-700",
  },
  completed: {
    bg: "bg-emerald-100 dark:bg-emerald-950",
    text: "text-emerald-700 dark:text-emerald-300",
    ring: "ring-emerald-300 dark:ring-emerald-700",
  },
  failed: {
    bg: "bg-red-100 dark:bg-red-950",
    text: "text-red-700 dark:text-red-300",
    ring: "ring-red-300 dark:ring-red-700",
  },
  cancelled: {
    bg: "bg-amber-100 dark:bg-amber-950",
    text: "text-amber-700 dark:text-amber-300",
    ring: "ring-amber-300 dark:ring-amber-700",
  },
};

/**
 * KpiLayout → Tailwind grid class
 */
export function layoutToGridClass(layout: string): string {
  switch (layout) {
    case "1x2":
      return "grid-cols-1 sm:grid-cols-2";
    case "1x3":
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    case "1x4":
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    case "2x2":
      return "grid-cols-1 sm:grid-cols-2";
    default:
      return "grid-cols-1 sm:grid-cols-2";
  }
}

/**
 * 卡片根 class
 */
export const cardClass =
  "rounded-lg border p-4 bg-[var(--baize-bg-card,white)] border-[color:var(--baize-border-primary,#e5e7eb)]";

/**
 * 文本 muted class
 */
export const mutedTextClass =
  "text-[var(--baize-text-muted,#9ca3af)]";
