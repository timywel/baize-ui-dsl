/**
 * LineChartWidget — 折线图 (单/多系列, SVG 手写)
 *
 * 样式参考 B 站 TokUI 全行业场景演示 (BV1ZajV61EUX).
 */

import { memo, useMemo } from "react";
import type { LineChartBlock } from "../types/dsl.js";
import { getSeriesColor } from "./utils.js";
import { themeTokens } from "../theme/tokens.js";
import { useDrawIn } from "./useDrawIn.js";

export interface LineChartWidgetProps {
  readonly dsl: LineChartBlock;
}

const PADDING = { top: 24, right: 24, bottom: 36, left: 56 };

function LineChartWidgetImpl({ dsl }: LineChartWidgetProps) {
  const { data, xAxis, yAxis, height = 260, caption } = dsl;
  const width = 720;
  const drawProgress = useDrawIn(800);

  const { maxY, ticks } = useMemo(() => {
    const allValues = data.flatMap((s) => s.data);
    const max = Math.max(1, ...allValues);
    const tickCount = yAxis?.ticks ?? 5;
    const tickValues: number[] = [];
    for (let i = 0; i <= tickCount; i += 1) {
      tickValues.push((max * i) / tickCount);
    }
    return { maxY: max, ticks: tickValues };
  }, [data, yAxis?.ticks]);

  const innerW = width - PADDING.left - PADDING.right;
  const innerH = height - PADDING.top - PADDING.bottom;
  const xStep = xAxis.length > 1 ? innerW / (xAxis.length - 1) : 0;
  const labelColor = themeTokens.color.textMuted;

  const xLabelSkip = Math.max(1, Math.ceil(xAxis.length / 8));

  // 预计算每个系列的 points + dash 长度 (供 draw-in 动画)
  const seriesData = useMemo(() => {
    return data.map((series, idx) => {
      const color = getSeriesColor(idx, series.color);
      const points = series.data
        .map((v, i) => {
          const x = PADDING.left + i * xStep;
          const y = PADDING.top + innerH - (v / maxY) * innerH;
          return `${x},${y}`;
        })
        .join(" ");
      // 估算路径长度 (各段欧氏距离之和)
      let dashLen = 0;
      for (let i = 1; i < series.data.length; i += 1) {
        const x1 = PADDING.left + (i - 1) * xStep;
        const y1 = PADDING.top + innerH - (series.data[i - 1] / maxY) * innerH;
        const x2 = PADDING.left + i * xStep;
        const y2 = PADDING.top + innerH - (series.data[i] / maxY) * innerH;
        dashLen += Math.hypot(x2 - x1, y2 - y1);
      }
      return { series, idx, color, points, dashLen };
    });
  }, [data, xStep, innerH, maxY]);

  return (
    <figure className="my-4" role="group" aria-label={caption ?? "折线图"}>
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
          aria-label={caption ?? "line chart"}
          style={{ color: labelColor }}
        >
          {/* Y 轴网格 + 刻度 label */}
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

          {/* X 轴线 */}
          <line
            x1={PADDING.left}
            x2={width - PADDING.right}
            y1={PADDING.top + innerH}
            y2={PADDING.top + innerH}
            stroke="currentColor"
            strokeOpacity="0.12"
          />

          {/* 系列折线 (draw-in animation) */}
          {seriesData.map(({ series, idx, color, points, dashLen }) => (
              <g key={`series-${idx}`}>
                <polyline
                  points={points}
                  fill="none"
                  stroke={color}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: dashLen,
                    strokeDashoffset: dashLen * (1 - drawProgress),
                    transition: "stroke-dashoffset 50ms linear",
                  }}
                />
                {series.data.map((v, i) => {
                  const x = PADDING.left + i * xStep;
                  const y = PADDING.top + innerH - (v / maxY) * innerH;
                  return (
                    <circle
                      key={`pt-${i}`}
                      cx={x}
                      cy={y}
                      r={4}
                      fill="white"
                      stroke={color}
                      strokeWidth={2}
                      style={{
                        opacity: Math.max(0, drawProgress * 1.5 - 0.5),
                      }}
                    />
                  );
                })}
              </g>
            ))}

          {/* X 轴标签 */}
          {xAxis.map((label, i) => {
            if (i % xLabelSkip !== 0 && i !== xAxis.length - 1) return null;
            const x = PADDING.left + i * xStep;
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

        {/* 图例 */}
        {data.length > 1 && (
          <div className="flex items-center gap-5 mt-3 px-1 text-xs">
            {data.map((series, idx) => (
              <div key={`legend-${idx}`} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-3 h-0.5 rounded-full"
                  style={{ background: getSeriesColor(idx, series.color) }}
                />
                <span
                  style={{ color: "var(--baize-text-secondary, #6b7280)" }}
                >
                  {series.name}
                </span>
              </div>
            ))}
          </div>
        )}
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

export const LineChartWidget = memo(LineChartWidgetImpl);
LineChartWidget.displayName = "LineChartWidget";
