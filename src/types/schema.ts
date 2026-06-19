/**
 * UiBlockSchema — Zod 运行时校验 schema
 *
 * 与 src/types/dsl.ts 配套使用:
 * - dsl.ts 提供静态类型 (编译期)
 * - schema.ts 提供运行时校验 (运行期, 后端 emit 不可信时用)
 *
 * Why: 后端 loop.ts emit 的 DSL 字符串可能是不可信的 (LLM 幻觉 / 网络截断),
 *      渲染前必须 zod 校验, 失败时降级到 fallback UI 而非整个崩溃.
 */

import { z } from "zod";
import { WIDGET_TYPES } from "./dsl.js";

// ─────────────────────────────────────────────────────────────────
//  原子类型
// ─────────────────────────────────────────────────────────────────

const directionSchema = z.enum(["up", "down", "flat"]);

const progressStatusSchema = z.enum([
  "pending",
  "in_progress",
  "completed",
  "failed",
  "cancelled",
]);

const insightVariantSchema = z.enum(["insight", "warning", "success"]);

const badgeToneSchema = z.object({
  type: z.literal("badge"),
  value: z.string(),
  tone: z.enum(["S", "A", "B", "C", "neutral"]),
});

const progressCellSchema = z.object({
  type: z.literal("progress"),
  value: z.number().min(0).max(100),
});

const deltaCellSchema = z.object({
  type: z.literal("delta"),
  value: z.number(),
  direction: directionSchema,
});

const cellValueSchema = z.union([
  z.string(),
  z.number(),
  badgeToneSchema,
  progressCellSchema,
  deltaCellSchema,
]);

// ─────────────────────────────────────────────────────────────────
//  Widget block schemas
// ─────────────────────────────────────────────────────────────────

const kpiItemSchema = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number()]),
  unit: z.string().optional(),
  delta: z
    .object({
      value: z.number(),
      direction: directionSchema,
    })
    .optional(),
  caption: z.string().optional(),
});

const kpiGridBlockSchema = z.object({
  widget: z.literal("kpi_grid"),
  layout: z.enum(["1x2", "1x3", "1x4", "2x2"]),
  items: z.array(kpiItemSchema).min(1).max(12),
  caption: z.string().optional(),
});

const axisLabelSchema = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number()]).optional(),
});

const chartSeriesSchema = z.object({
  name: z.string(),
  data: z.array(z.number()).min(1),
  color: z.string().optional(),
});

const lineChartBlockSchema = z.object({
  widget: z.literal("line_chart"),
  data: z.array(chartSeriesSchema).min(1).max(8),
  xAxis: z.array(axisLabelSchema).min(1),
  yAxis: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      ticks: z.number().optional(),
    })
    .optional(),
  caption: z.string().optional(),
  height: z.number().positive().optional(),
});

const barChartBlockSchema = z.object({
  widget: z.literal("bar_chart"),
  data: chartSeriesSchema,
  xAxis: z.array(axisLabelSchema).min(1),
  yAxis: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      ticks: z.number().optional(),
    })
    .optional(),
  caption: z.string().optional(),
  height: z.number().positive().optional(),
});

const pieSliceSchema = z.object({
  label: z.string(),
  value: z.number().nonnegative(),
  color: z.string().optional(),
});

const pieChartBlockSchema = z.object({
  widget: z.literal("pie_chart"),
  data: z.array(pieSliceSchema).min(1).max(12),
  caption: z.string().optional(),
  showLegend: z.boolean().optional(),
  height: z.number().positive().optional(),
});

const tableColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum(["text", "number", "badge", "progress", "delta"]).optional(),
  align: z.enum(["left", "center", "right"]).optional(),
  width: z.union([z.number(), z.string()]).optional(),
});

const tableRowSchema = z.record(z.string(), cellValueSchema);

const tableBlockSchema = z.object({
  widget: z.literal("table"),
  columns: z.array(tableColumnSchema).min(1),
  rows: z.array(tableRowSchema),
  highlightRow: z.number().int().nonnegative().optional(),
  caption: z.string().optional(),
  emptyHint: z.string().optional(),
});

const timelineEventSchema = z.object({
  title: z.string(),
  date: z.string().optional(),
  status: progressStatusSchema.optional(),
  description: z.string().optional(),
  meta: z.string().optional(),
});

const timelineBlockSchema = z.object({
  widget: z.literal("timeline"),
  events: z.array(timelineEventSchema).min(1),
  orientation: z.enum(["vertical", "horizontal"]).optional(),
  caption: z.string().optional(),
});

const insightBlockSchema = z.object({
  widget: z.literal("insight"),
  variant: insightVariantSchema,
  title: z.string(),
  body: z.string(),
  tag: z.string().optional(),
});

const progressBadgeBlockSchema = z.object({
  widget: z.literal("progress_badge"),
  status: progressStatusSchema,
  value: z.number().min(0).max(100).optional(),
  label: z.string(),
  meta: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────
//  Discriminated union
// ─────────────────────────────────────────────────────────────────

export const uiBlockDslSchema = z.discriminatedUnion("widget", [
  kpiGridBlockSchema,
  lineChartBlockSchema,
  barChartBlockSchema,
  pieChartBlockSchema,
  tableBlockSchema,
  timelineBlockSchema,
  insightBlockSchema,
  progressBadgeBlockSchema,
]);

// ─────────────────────────────────────────────────────────────────
//  公共 API
// ─────────────────────────────────────────────────────────────────

export type UiBlockDslParsed = z.infer<typeof uiBlockDslSchema>;

export type ValidationResult =
  | { readonly ok: true; readonly data: UiBlockDslParsed }
  | { readonly ok: false; readonly errors: ReadonlyArray<string> };

/**
 * 安全校验 — 永不抛异常, 失败时返回 errors
 */
export function validateUiBlock(value: unknown): ValidationResult {
  const result = uiBlockDslSchema.safeParse(value);
  if (result.success) {
    return { ok: true, data: result.data };
  }
  return {
    ok: false,
    errors: result.error.issues.map(
      (issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`,
    ),
  };
}

/**
 * Widget 类型守卫 (运行时)
 */
export function isKnownWidget(value: unknown): boolean {
  return (
    typeof value === "string" &&
    (WIDGET_TYPES as readonly string[]).includes(value)
  );
}
