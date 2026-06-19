/**
 * BarChartWidget — 柱状图 (单系列, SVG 手写)
 */

import { memo, useMemo } from "react";
import type { BarChartBlock } from "../types/dsl.js";
import { getSeriesColor } from "./utils.js";
import { themeTokens } from "../theme/tokens.js";

export interface BarChartWidgetProps {
  readonly dsl: BarChartBlock;
}

const PADDING = { top: 24, right: 24, bottom: 36, left: 56 };

function BarChartWidgetImpl({ dsl }: BarChartWidgetProps) {
  const { data, xAxis, height = 260, caption } = dsl;
  const width = 720;
  const labelColor = themeTokens.color.textMuted;

  const maxY = useMemo(() => Math.max(1, ...data.data), [data.data]);

  const innerW = width - PADDING.left - PADDING.right;
  const innerH = height - PADDING.top - PADDING.bottom;
  const barCount = xAxis.length;
  const barGap = 10;
  const barWidth = Math.max(4, (innerW - barGap * (barCount - 1)) / barCount);
  const tickCount = 5;
  const ticks: number[] = [];
  for (let i = 0; i <= tickCount; i += 1) {
    ticks.push((maxY * i) / tickCount);
  }

  const color = getSeriesColor(0, data.color);

  return (
    <figure className="my-4" role="group" aria-label={caption ?? "柱状图"}>
      <div
        className="rounded-xl border p-5 overflow-x-auto"
        style={{
          background: "var(--baize-bg-card, #fff)",
          borderColor: "var(--baize-border-primary, #e5e7eb)",
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height={height}
          role="img"
          aria-label={caption ?? "bar chart"}
          style={{ color: labelColor }}
        >
          {ticks.map((tick, i) => {
            const y = PADDING.top + innerH - (tick / maxY) * innerH;
            return (
              <g key={`tick-${i}`}>
                <line
                  x1={PADDING.left}
                  x2={width - PADDING.right}
                  y1={y}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.08"
                  strokeDasharray="2,4"
                />
                <text
                  x={PADDING.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[11px] tabular-nums"
                  fill="currentColor"
                >
                  {Math.round(tick)}
                </text>
              </g>
            );
          })}

          <line
            x1={PADDING.left}
            x2={width - PADDING.right}
            y1={PADDING.top + innerH}
            y2={PADDING.top + innerH}
            stroke="currentColor"
            strokeOpacity="0.12"
          />

          {data.data.map((v, i) => {
            const x = PADDING.left + i * (barWidth + barGap);
            const barH = (v / maxY) * innerH;
            const y = PADDING.top + innerH - barH;
            return (
              <g key={`bar-${i}`}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  fill={color}
                  rx={3}
                />
                {barH > 18 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 6}
                    textAnchor="middle"
                    className="text-[10px] tabular-nums"
                    fill="currentColor"
                    opacity={0.7}
                  >
                    {v}
                  </text>
                )}
              </g>
            );
          })}

          {xAxis.map((label, i) => {
            const x = PADDING.left + i * (barWidth + barGap) + barWidth / 2;
            return (
              <text
                key={`x-${i}`}
                x={x}
                y={height - 14}
                textAnchor="middle"
                className="text-[11px]"
                fill="currentColor"
              >
                {label.label}
              </text>
            );
          })}
        </svg>
      </div>
      {caption && (
        <figcaption
          className="text-[11px] mt-2 px-1"
          style={{ color: "var(--baize-text-muted, #9ca3af)" }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export const BarChartWidget = memo(BarChartWidgetImpl);
BarChartWidget.displayName = "BarChartWidget";
