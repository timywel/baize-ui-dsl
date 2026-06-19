/**
 * KpiGridWidget — KPI 卡片网格 (TokUI 风格)
 *
 * 适用: 数据看板、运营报表、电商 dashboard 等.
 * 样式参考 B 站 TokUI 全行业场景演示 (BV1ZajV61EUX).
 *
 * dense mode 用于嵌入在 hero 等紧凑区域.
 */

import { memo } from "react";
import type { KpiGridBlock, KpiItem, Direction } from "../types/dsl.js";
import { themeTokens } from "../theme/tokens.js";
import { useCountUp } from "./useCountUp.js";

export interface KpiGridWidgetProps {
  readonly dsl: KpiGridBlock;
  readonly dense?: boolean;
}

function DeltaIndicator({
  direction,
  value,
  dense = false,
}: {
  readonly direction: Direction;
  readonly value: number;
  readonly dense?: boolean;
}) {
  const color =
    direction === "up"
      ? themeTokens.color.success
      : direction === "down"
        ? themeTokens.color.danger
        : themeTokens.color.textMuted;
  const arrow = direction === "up" ? "↑" : direction === "down" ? "↓" : "—";
  return (
    <span
      className={`font-medium ml-1 inline-flex items-baseline gap-0.5 ${
        dense ? "text-[10px]" : "text-[13px]"
      }`}
      style={{ color }}
    >
      <span aria-hidden="true">{arrow}</span>
      <span className="tabular-nums">{Math.abs(value)}%</span>
    </span>
  );
}

function KpiCard({
  item,
  dense = false,
}: {
  readonly item: KpiItem;
  readonly dense?: boolean;
}) {
  // 数字 count-up 动画 (默认 700ms)
  const targetValue = typeof item.value === "number" ? item.value : Number(item.value);
  const isFinite = Number.isFinite(targetValue);
  const animatedValue = useCountUp(isFinite ? targetValue : 0, {
    duration: 700,
    decimals: Number.isInteger(targetValue) ? 0 : 1,
  });
  const displayValue = isFinite
    ? animatedValue.toLocaleString("zh-CN", {
        maximumFractionDigits: Number.isInteger(targetValue) ? 0 : 1,
      })
    : item.value;

  return (
    <div
      className="flex flex-col gap-1.5 rounded-xl border baize-widget-fade-in"
      style={{
        padding: dense ? "8px 10px" : "var(--space-4)",
        background: "var(--baize-bg-card,#fff)",
        borderColor: "var(--baize-border-primary,#e5e7eb)",
        minHeight: dense ? 64 : 92,
      }}
    >
      <div
        className="font-medium"
        style={{
          fontSize: dense ? 11 : 12,
          color: "var(--baize-text-secondary, #6b7280)",
        }}
      >
        {item.label}
      </div>
      <div className="flex items-baseline min-w-0">
        {item.unit && (
          <span
            className="mr-0.5 font-light"
            style={{
              fontSize: dense ? 11 : 15,
              color: "var(--baize-text-muted, #9ca3af)",
            }}
          >
            {item.unit}
          </span>
        )}
        <span
          className="leading-none font-light tabular-nums truncate"
          style={{
            color: "var(--baize-text-primary, #111827)",
            letterSpacing: "-0.02em",
            fontSize: dense ? "16px" : "28px",
          }}
        >
          {displayValue}
        </span>
        {item.delta && <DeltaIndicator {...item.delta} dense={dense} />}
      </div>
      {item.caption && (
        <div
          className="mt-0.5 truncate"
          style={{
            fontSize: 10,
            color: "var(--baize-text-muted, #9ca3af)",
          }}
        >
          {item.caption}
        </div>
      )}
    </div>
  );
}

function layoutToGridCols(layout: string): string {
  switch (layout) {
    case "1x2":
      return "repeat(2, minmax(0, 1fr))";
    case "1x3":
      return "repeat(3, minmax(0, 1fr))";
    case "1x4":
      return "repeat(4, minmax(0, 1fr))";
    case "2x2":
      return "repeat(2, minmax(0, 1fr))";
    default:
      return "repeat(2, minmax(0, 1fr))";
  }
}

function KpiGridWidgetImpl({ dsl, dense }: KpiGridWidgetProps) {
  return (
    <figure className="my-4" role="group" aria-label={dsl.caption ?? "KPI 网格"}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: layoutToGridCols(dsl.layout),
          gap: dense ? "8px" : "0.75rem",
        }}
      >
        {dsl.items.map((item, i) => (
          <KpiCard key={`${item.label}-${i}`} item={item} {...(dense ? { dense: true } : {})} />
        ))}
      </div>
      {dsl.caption && (
        <figcaption
          className="text-[11px] mt-2 px-1"
          style={{ color: "var(--baize-text-muted, #9ca3af)" }}
        >
          {dsl.caption}
        </figcaption>
      )}
    </figure>
  );
}

export const KpiGridWidget = memo(KpiGridWidgetImpl);
KpiGridWidget.displayName = "KpiGridWidget";