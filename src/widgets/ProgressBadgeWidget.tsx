/**
 * ProgressBadgeWidget — 状态徽章 + 进度条 (TokUI 风格)
 */

import { memo } from "react";
import type { ProgressBadgeBlock } from "../types/dsl.js";
import { useT } from "../i18n/I18nProvider.js";
import { defaultDictZh } from "../i18n/default-dict.js";
import { statusColorMap } from "./utils.js";
import { themeTokens } from "../theme/tokens.js";

export interface ProgressBadgeWidgetProps {
  readonly dsl: ProgressBadgeBlock;
}

function ProgressBadgeWidgetImpl({ dsl }: ProgressBadgeWidgetProps) {
  const t = useT();
  const statusStyle = statusColorMap[dsl.status];
  const statusLabel = t(
    `status.${dsl.status}`,
    defaultDictZh.status[dsl.status],
  );
  const trackBg = themeTokens.color.borderSubtle;
  const brand = themeTokens.color.brand;

  return (
    <div
      className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px]"
      style={{ background: "var(--baize-bg-secondary, #f8f9fa)" }}
    >
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${statusStyle.bg} ${statusStyle.text}`}
      >
        {statusLabel}
      </span>
      <span
        className="font-medium"
        style={{ color: "var(--baize-text-primary, #111827)" }}
      >
        {dsl.label}
      </span>
      {typeof dsl.value === "number" && (
        <div className="flex items-center gap-1.5 min-w-[100px]">
          <div
            className="flex-1 h-1 rounded-full overflow-hidden"
            style={{ background: trackBg }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${dsl.value}%`, background: brand }}
            />
          </div>
          <span
            className="text-[11px] tabular-nums"
            style={{ color: "var(--baize-text-muted, #9ca3af)" }}
          >
            {dsl.value}%
          </span>
        </div>
      )}
      {dsl.value === undefined && dsl.meta && (
        <span
          className="text-[11px]"
          style={{ color: "var(--baize-text-muted, #9ca3af)" }}
        >
          {dsl.meta}
        </span>
      )}
      {dsl.value !== undefined && dsl.meta && (
        <span
          className="text-[11px]"
          style={{ color: "var(--baize-text-muted, #9ca3af)" }}
        >
          · {dsl.meta}
        </span>
      )}
    </div>
  );
}

export const ProgressBadgeWidget = memo(ProgressBadgeWidgetImpl);
ProgressBadgeWidget.displayName = "ProgressBadgeWidget";
