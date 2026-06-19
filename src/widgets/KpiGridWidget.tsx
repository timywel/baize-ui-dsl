/**
 * KpiGridWidget — KPI 卡片网格 (TokUI 风格)
 *
 * 适用: 数据看板、运营报表、电商 dashboard 等.
 * 样式参考 B 站 TokUI 全行业场景演示 (BV1ZajV61EUX).
 */

import { memo } from "react";
import type { KpiGridBlock, KpiItem, Direction } from "../types/dsl.js";
import { themeTokens } from "../theme/tokens.js";
import { useCountUp } from "./useCountUp.js";

export interface KpiGridWidgetProps {
  readonly dsl: KpiGridBlock;
}

function DeltaIndicator({
  direction,
  value,
}: {
  readonly direction: Direction;
  readonly value: number;
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
      className="text-[13px] font-medium ml-1.5 inline-flex items-baseline gap-0.5"
      style={{ color }}
    >
      <span aria-hidden="true">{arrow}</span>
      <span className="tabular-nums">{Math.abs(value)}%</span>
    </span>
  );
}

function KpiCard({ item }: { readonly item: KpiItem }) {
  // 数字 count-up 动画 (默认 800ms)
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
      className="flex flex-col gap-1.5 p-4 rounded-xl border bg-[var(--baize-bg-card,#fff)] border-[color:var(--baize-border-primary,#e5e7eb)] transition-shadow hover:shadow-sm baize-widget-fade-in"
      style={{ minHeight: 92 }}
    >
      <div
        className="text-xs font-medium"
        style={{ color: "var(--baize-text-secondary, #6b7280)" }}
      >
        {item.label}
      </div>
      <div className="flex items-baseline min-w-0">
        {item.unit && (
          <span
            className="text-[15px] mr-0.5 font-light"
            style={{ color: "var(--baize-text-muted, #9ca3af)" }}
          >
            {item.unit}
          </span>
        )}
        <span
          className="text-[28px] leading-none font-light tabular-nums truncate"
          style={{ color: "var(--baize-text-primary, #111827)", letterSpacing: "-0.02em" }}
        >
          {displayValue}
        </span>
        {item.delta && <DeltaIndicator {...item.delta} />}
      </div>
      {item.caption && (
        <div
          className="text-[10px] mt-0.5 truncate"
          style={{ color: "var(--baize-text-muted, #9ca3af)" }}
        >
          {item.caption}
        </div>
      )}
    </div>
  );
}

function layoutToGridCols(layout: string): string {
  // 不依赖 sm:/lg: 断点 / 也不依赖 Tailwind —— widget 应在自己内部就横排
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

function KpiGridWidgetImpl({ dsl }: KpiGridWidgetProps) {
  return (
    <figure className="my-4" role="group" aria-label={dsl.caption ?? "KPI 网格"}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: layoutToGridCols(dsl.layout),
          gap: "0.75rem",
        }}
      >
        {dsl.items.map((item, i) => (
          <KpiCard key={`${item.label}-${i}`} item={item} />
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
