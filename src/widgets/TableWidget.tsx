/**
 * TableWidget — 结构化表格 (5 种 cell type)
 *
 * 样式参考 B 站 TokUI 全行业场景演示.
 */

import { memo } from "react";
import type {
  CellValue,
  TableBlock,
  TableCellType,
  TableColumn,
} from "../types/dsl.js";
import { themeTokens } from "../theme/tokens.js";

export interface TableWidgetProps {
  readonly dsl: TableBlock;
}

const badgeToneClass: Record<string, string> = {
  S: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  A: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  B: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  C: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800",
  neutral: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
};

const alignClass: Record<NonNullable<TableColumn["align"]>, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const textPrimary = themeTokens.color.textPrimary;
const textMuted = themeTokens.color.textMuted;
const brand = themeTokens.color.brand;

function renderCell(value: CellValue | undefined, _type?: TableCellType) {
  if (value === undefined || value === null) return null;

  if (typeof value !== "object") {
    return (
      <span
        className="text-[13px] tabular-nums"
        style={{ color: textPrimary }}
      >
        {String(value)}
      </span>
    );
  }

  if ("type" in value) {
    switch (value.type) {
      case "badge": {
        const v = value as { value: string; tone: string };
        const toneClass = badgeToneClass[v.tone] ?? badgeToneClass.neutral;
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${toneClass}`}
          >
            {v.value}
          </span>
        );
      }
      case "progress": {
        const v = (value as { value: number }).value;
        return (
          <div className="inline-flex items-center gap-2 min-w-[120px]">
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--baize-border-subtle, #f3f4f6)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${Math.max(0, Math.min(100, v))}%`, background: brand }}
              />
            </div>
            <span className="text-[11px] tabular-nums" style={{ color: textMuted }}>
              {v}%
            </span>
          </div>
        );
      }
      case "delta": {
        const v = value as { value: number; direction: string };
        const color =
          v.direction === "up"
            ? themeTokens.color.success
            : v.direction === "down"
              ? themeTokens.color.danger
              : textMuted;
        const arrow = v.direction === "up" ? "↑" : v.direction === "down" ? "↓" : "—";
        return (
          <span className="text-[11px] tabular-nums" style={{ color }}>
            {arrow}
            {v.value}%
          </span>
        );
      }
      default:
        return null;
    }
  }

  return null;
}

function TableWidgetImpl({ dsl }: TableWidgetProps) {
  const { columns, rows, highlightRow, caption, emptyHint } = dsl;
  const borderColor = "var(--baize-border-primary, #e5e7eb)";
  const borderSubtle = "var(--baize-border-subtle, #f3f4f6)";
  const headerBg = "var(--baize-bg-secondary, #f8f9fa)";

  return (
    <figure className="my-4" role="group" aria-label={caption ?? "表格"}>
      <div
        className="rounded-xl border overflow-x-auto"
        style={{ background: "var(--baize-bg-card, #fff)", borderColor }}
      >
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ background: headerBg }}>
              {columns.map((col) => {
                const align = col.align ?? "left";
                return (
                  <th
                    key={col.key}
                    className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider ${alignClass[align]}`}
                    style={{ color: textMuted, borderBottom: `1px solid ${borderColor}`, letterSpacing: "0.04em" }}
                  >
                    {col.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && emptyHint && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm"
                  style={{ color: textMuted }}
                >
                  {emptyHint}
                </td>
              </tr>
            )}
            {rows.map((row, rowIdx) => {
              const isHighlight = highlightRow === rowIdx;
              return (
                <tr
                  key={`row-${rowIdx}`}
                  style={{
                    borderBottom: `1px solid ${borderSubtle}`,
                    background: isHighlight
                      ? "rgba(37, 99, 235, 0.04)"
                      : undefined,
                  }}
                >
                  {columns.map((col) => {
                    const align = col.align ?? "left";
                    return (
                      <td
                        key={col.key}
                        className={`px-4 py-3 ${alignClass[align]}`}
                      >
                        {renderCell(row[col.key], col.type)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
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

export const TableWidget = memo(TableWidgetImpl);
TableWidget.displayName = "TableWidget";
