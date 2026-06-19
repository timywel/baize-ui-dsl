/**
 * InsightBlockWidget — 洞察 / 预警 / 建议块
 *
 * 样式参考 B 站 TokUI 全行业场景演示.
 */

import { memo } from "react";
import type {
  InsightBlock as InsightBlockDSL,
  InsightVariant,
} from "../types/dsl.js";
import { themeTokens } from "../theme/tokens.js";

export interface InsightBlockWidgetProps {
  readonly dsl: InsightBlockDSL;
}

const variantConfig: Record<
  InsightVariant,
  {
    readonly icon: string;
    readonly bg: string;
    readonly border: string;
    readonly text: string;
    readonly iconBg: string;
  }
> = {
  insight: {
    icon: "💡",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-900 dark:text-blue-200",
    iconBg: "bg-blue-100 dark:bg-blue-900",
  },
  warning: {
    icon: "⚠️",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-900 dark:text-amber-200",
    iconBg: "bg-amber-100 dark:bg-amber-900",
  },
  success: {
    icon: "✅",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-900 dark:text-emerald-200",
    iconBg: "bg-emerald-100 dark:bg-emerald-900",
  },
};

function InsightBlockWidgetImpl({ dsl }: InsightBlockWidgetProps) {
  const cfg = variantConfig[dsl.variant];
  const textPrimary = themeTokens.color.textSecondary;

  return (
    <div
      className={`my-4 flex gap-3 rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}
      role="note"
      aria-label={dsl.title}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full ${cfg.iconBg} flex items-center justify-center text-base leading-none`}
        aria-hidden="true"
      >
        {cfg.icon}
      </div>
      <div className="flex-1 min-w-0">
        {/* 标题行: 标题 + tag 一行 */}
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <h4 className={`text-[14px] font-semibold leading-tight ${cfg.text}`}>
            {dsl.title}
          </h4>
          {dsl.tag && (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded border ${cfg.text} ${cfg.bg} ${cfg.border}`}
            >
              {dsl.tag}
            </span>
          )}
        </div>
        <p
          className="text-[13px] leading-relaxed whitespace-pre-wrap"
          style={{ color: textPrimary }}
        >
          {dsl.body}
        </p>
      </div>
    </div>
  );
}

export const InsightBlockWidget = memo(InsightBlockWidgetImpl);
InsightBlockWidget.displayName = "InsightBlockWidget";
