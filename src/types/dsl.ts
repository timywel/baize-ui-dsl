/**
 * UiBlockDSL — 白泽 UI DSL 类型定义
 *
 * 设计原则:
 * - JSON 形态 (后端 loop.ts emit 友好, 前端增量渲染简单)
 * - 框架无关 (TS types + Zod schema 双层, 任何框架可消费)
 * - 渐进增强 (MVP 8 widget, 后续按需扩展)
 * - i18n 友好 (label 走 i18n key, 数据走原始值)
 */

// ─────────────────────────────────────────────────────────────────
//  Widget 枚举
// ─────────────────────────────────────────────────────────────────

export const WIDGET_TYPES = [
  "kpi_grid",
  "line_chart",
  "bar_chart",
  "pie_chart",
  "table",
  "timeline",
  "insight",
  "progress_badge",
] as const;

export type WidgetType = (typeof WIDGET_TYPES)[number];

// ─────────────────────────────────────────────────────────────────
//  原子类型
// ─────────────────────────────────────────────────────────────────

export type Direction = "up" | "down" | "flat";

export type ProgressStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "failed"
  | "cancelled";

export type InsightVariant = "insight" | "warning" | "success";

export type TableCellType = "text" | "number" | "badge" | "progress" | "delta";

export type CellAlign = "left" | "center" | "right";

export interface BadgeTone {
  readonly type: "badge";
  readonly value: string;
  readonly tone: "S" | "A" | "B" | "C" | "neutral";
}

export interface ProgressCell {
  readonly type: "progress";
  readonly value: number;
}

export interface DeltaCell {
  readonly type: "delta";
  readonly value: number;
  readonly direction: Direction;
}

export type CellValue =
  | string
  | number
  | BadgeTone
  | ProgressCell
  | DeltaCell;

// ─────────────────────────────────────────────────────────────────
//  KpiGridWidget — KPI 卡片网格
// ─────────────────────────────────────────────────────────────────

export type KpiLayout = "1x2" | "1x3" | "1x4" | "2x2";

export interface KpiItem {
  /** i18n key 或原始字符串 (前者优先) */
  readonly label: string;
  readonly value: string | number;
  readonly unit?: string;
  readonly delta?: {
    readonly value: number;
    readonly direction: Direction;
  };
  readonly caption?: string;
}

export interface KpiGridBlock {
  readonly widget: "kpi_grid";
  readonly layout: KpiLayout;
  readonly items: readonly KpiItem[];
  readonly caption?: string;
}

// ─────────────────────────────────────────────────────────────────
//  LineChartWidget / BarChartWidget — 折线 / 柱状图
// ─────────────────────────────────────────────────────────────────

export interface AxisLabel {
  readonly label: string;
  readonly value?: string | number;
}

export interface ChartSeries {
  readonly name: string;
  readonly data: readonly number[];
  readonly color?: string;
}

export interface LineChartBlock {
  readonly widget: "line_chart";
  readonly data: readonly ChartSeries[];
  readonly xAxis: readonly AxisLabel[];
  readonly yAxis?: {
    readonly min?: number;
    readonly max?: number;
    readonly ticks?: number;
  };
  readonly caption?: string;
  readonly height?: number;
}

export interface BarChartBlock {
  readonly widget: "bar_chart";
  readonly data: ChartSeries;
  readonly xAxis: readonly AxisLabel[];
  readonly yAxis?: {
    readonly min?: number;
    readonly max?: number;
    readonly ticks?: number;
  };
  readonly caption?: string;
  readonly height?: number;
}

// ─────────────────────────────────────────────────────────────────
//  PieChartWidget — 饼图
// ─────────────────────────────────────────────────────────────────

export interface PieSlice {
  readonly label: string;
  readonly value: number;
  readonly color?: string;
}

export interface PieChartBlock {
  readonly widget: "pie_chart";
  readonly data: readonly PieSlice[];
  readonly caption?: string;
  readonly showLegend?: boolean;
  readonly height?: number;
}

// ─────────────────────────────────────────────────────────────────
//  TableWidget — 结构化表格
// ─────────────────────────────────────────────────────────────────

export interface TableColumn {
  readonly key: string;
  readonly label: string;
  readonly type?: TableCellType;
  readonly align?: CellAlign;
  readonly width?: number | string;
}

export interface TableRow {
  readonly [key: string]: CellValue | undefined;
}

export interface TableBlock {
  readonly widget: "table";
  readonly columns: readonly TableColumn[];
  readonly rows: readonly TableRow[];
  readonly highlightRow?: number;
  readonly caption?: string;
  readonly emptyHint?: string;
}

// ─────────────────────────────────────────────────────────────────
//  TimelineWidget — 时间线
// ─────────────────────────────────────────────────────────────────

export interface TimelineEvent {
  readonly title: string;
  readonly date?: string;
  readonly status?: ProgressStatus;
  readonly description?: string;
  readonly meta?: string;
}

export type TimelineOrientation = "vertical" | "horizontal";

export interface TimelineBlock {
  readonly widget: "timeline";
  readonly events: readonly TimelineEvent[];
  readonly orientation?: TimelineOrientation;
  readonly caption?: string;
}

// ─────────────────────────────────────────────────────────────────
//  InsightBlockWidget — 洞察/预警/建议块
// ─────────────────────────────────────────────────────────────────

export interface InsightBlock {
  readonly widget: "insight";
  readonly variant: InsightVariant;
  readonly title: string;
  readonly body: string;
  readonly tag?: string;
}

// ─────────────────────────────────────────────────────────────────
//  ProgressBadgeWidget — 状态徽章 + 进度条
// ─────────────────────────────────────────────────────────────────

export interface ProgressBadgeBlock {
  readonly widget: "progress_badge";
  readonly status: ProgressStatus;
  readonly value?: number;
  readonly label: string;
  readonly meta?: string;
}

// ─────────────────────────────────────────────────────────────────
//  联合类型 + 顶层 schema
// ─────────────────────────────────────────────────────────────────

export type UiBlockDSL =
  | KpiGridBlock
  | LineChartBlock
  | BarChartBlock
  | PieChartBlock
  | TableBlock
  | TimelineBlock
  | InsightBlock
  | ProgressBadgeBlock;

/**
 * 流式 patch — 用于流式渲染时的增量更新
 *
 * 协议层 (后端 loop.ts) 在流式输出时, 可以选择:
 * 1. emit 完整 dsl (每次重发整个 block) — 简单但带宽浪费
 * 2. emit delta (op + path) — JSON Patch 风格, 流式友好
 *
 * MVP 推荐用 op 1 (完整 dsl), op 2 留给后续优化
 */
export type UiBlockPatch =
  | { readonly op: "replace"; readonly dsl: UiBlockDSL }
  | {
      readonly op: "patch";
      readonly widget: WidgetType;
      readonly patches: ReadonlyArray<{
        readonly path: string;
        readonly value: unknown;
      }>;
    };

// ─────────────────────────────────────────────────────────────────
//  类型守卫
// ─────────────────────────────────────────────────────────────────

export function isWidgetType(value: unknown): value is WidgetType {
  return (
    typeof value === "string" &&
    (WIDGET_TYPES as readonly string[]).includes(value)
  );
}

export function isUiBlockDSL(value: unknown): value is UiBlockDSL {
  if (!value || typeof value !== "object") return false;
  const candidate = value as { widget?: unknown };
  return isWidgetType(candidate.widget);
}
