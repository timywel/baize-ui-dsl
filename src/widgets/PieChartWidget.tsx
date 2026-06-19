/**
 * PieChartWidget — 饼图 (SVG 手写, 引线标签不超出 viewBox)
 */

import { memo, useMemo } from "react";
import type { PieChartBlock } from "../types/dsl.js";
import { getSeriesColor } from "./utils.js";
import { themeTokens } from "../theme/tokens.js";

export interface PieChartWidgetProps {
  readonly dsl: PieChartBlock;
}

const PADDING = 80; // 给左右引线 label 留空间

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
): { x: number; y: number } {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function arcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx},${cy} L ${start.x},${start.y} A ${r},${r} 0 ${largeArc} 0 ${end.x},${end.y} Z`;
}

function PieChartWidgetImpl({ dsl }: PieChartWidgetProps) {
  const { data, showLegend = true, caption } = dsl;
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - PADDING * 2) / 2;
  const labelColor = themeTokens.color.textSecondary;

  const total = useMemo(
    () => data.reduce((sum, slice) => sum + slice.value, 0) || 1,
    [data],
  );

  const slices = useMemo(() => {
    let acc = 0;
    return data.map((slice, i) => {
      const startAngle = (acc / total) * 360;
      acc += slice.value;
      const endAngle = (acc / total) * 360;
      const midAngle = (startAngle + endAngle) / 2;
      return {
        slice,
        startAngle,
        endAngle,
        midAngle,
        color: getSeriesColor(i, slice.color),
        pct: (slice.value / total) * 100,
      };
    });
  }, [data, total]);

  return (
    <figure className="my-4" role="group" aria-label={caption ?? "饼图"}>
      <div
        className="rounded-xl border p-5 flex flex-col items-center"
        style={{
          background: "var(--baize-bg-card, #fff)",
          borderColor: "var(--baize-border-primary, #e5e7eb)",
        }}
      >
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width="100%"
          height={size}
          role="img"
          aria-label={caption ?? "pie chart"}
          style={{ color: labelColor, maxWidth: size }}
        >
          {slices.map(({ slice, startAngle, endAngle, color, midAngle }, i) => {
            const path = arcPath(cx, cy, radius, startAngle, endAngle);
            // 引线: 起点在圆边外一点, 终点在 label 位置
            const innerEdge = polarToCartesian(cx, cy, radius, midAngle);
            const outerEdge = polarToCartesian(cx, cy, radius + 8, midAngle);
            // label 终点根据角度决定左右
            const isRight = midAngle <= 180;
            const labelEndX = isRight ? outerEdge.x + 14 : outerEdge.x - 14;
            const labelEndY = outerEdge.y;
            return (
              <g key={`slice-${i}`}>
                <path d={path} fill={color} stroke="white" strokeWidth={2} />
                {slice.value / total > 0.05 && (
                  <>
                    <text
                      x={cx + (Math.cos(((midAngle - 90) * Math.PI) / 180) * radius) * 0.6}
                      y={cy + (Math.sin(((midAngle - 90) * Math.PI) / 180) * radius) * 0.6}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[11px] font-medium"
                      fill="white"
                    >
                      {Math.round(slice.value)}
                    </text>
                    <polyline
                      points={`${innerEdge.x},${innerEdge.y} ${outerEdge.x},${outerEdge.y} ${labelEndX},${labelEndY}`}
                      fill="none"
                      stroke={color}
                      strokeWidth={1.5}
                    />
                    <text
                      x={labelEndX}
                      y={labelEndY}
                      textAnchor={isRight ? "start" : "end"}
                      dominantBaseline="middle"
                      className="text-[11px]"
                      fill="currentColor"
                    >
                      {slice.label} {Math.round(pctRounded(slice.value, total))}%
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {showLegend && (
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs justify-center">
            {slices.map(({ slice, color }, i) => (
              <div key={`legend-${i}`} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ background: color }}
                />
                <span style={{ color: "var(--baize-text-secondary, #6b7280)" }}>
                  {slice.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      {caption && (
        <figcaption
          className="text-[11px] mt-2 px-1 text-center"
          style={{ color: "var(--baize-text-muted, #9ca3af)" }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function pctRounded(v: number, total: number): number {
  return Math.round((v / total) * 100);
}

export const PieChartWidget = memo(PieChartWidgetImpl);
PieChartWidget.displayName = "PieChartWidget";
