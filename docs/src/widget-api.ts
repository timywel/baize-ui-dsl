/**
 * Widget API 字段定义 — 给 ApiTable 用
 *
 * 与 src/types/dsl.ts 保持同步 (字段名 + 类型 + 必填).
 * description 用人类语言说明每个字段的语义.
 */

import type { ApiField } from "./components/ApiTable.js";

export type WidgetApiMap = Record<string, ReadonlyArray<ApiField>>;

export const WIDGET_API: WidgetApiMap = {
  kpi_grid: [
    {
      name: "widget",
      type: '"kpi_grid"',
      required: true,
      defaultValue: "—",
      description: "固定为 \"kpi_grid\"，渲染器按此分发",
    },
    {
      name: "layout",
      type: '"1x2" | "1x3" | "1x4" | "2x2"',
      required: true,
      defaultValue: "—",
      description: "网格布局: 1x2/1x3/1x4 单行 N 列; 2x2 两行两列",
    },
    {
      name: "items",
      type: "KpiItem[]",
      required: true,
      defaultValue: "—",
      description: "KPI 项数组, 每项含 label + value + 可选 delta/unit/caption",
    },
    {
      name: "items[].label",
      type: "string",
      required: true,
      defaultValue: "—",
      description: "KPI 标签 (走 i18n 走 t())",
    },
    {
      name: "items[].value",
      type: "string | number",
      required: true,
      defaultValue: "—",
      description: "KPI 数值, 大字号 font-light 渲染",
    },
    {
      name: "items[].unit",
      type: "string",
      required: false,
      defaultValue: "—",
      description: "单位 (如 ¥ / % / ms), 渲染在 value 之前",
    },
    {
      name: "items[].delta",
      type: "{ value: number; direction: 'up' | 'down' | 'flat' }",
      required: false,
      defaultValue: "—",
      description: "趋势指标, ↑绿/↓红/—灰, 渲染在 value 之后",
    },
    {
      name: "items[].caption",
      type: "string",
      required: false,
      defaultValue: "—",
      description: "辅助说明, 渲染在卡片底部",
    },
    {
      name: "caption",
      type: "string",
      required: false,
      defaultValue: "—",
      description: "整组 caption, 渲染在 grid 下方 (如数据来源)",
    },
  ],

  line_chart: [
    {
      name: "widget",
      type: '"line_chart"',
      required: true,
      defaultValue: "—",
      description: "固定为 \"line_chart\"",
    },
    {
      name: "data",
      type: "ChartSeries[]",
      required: true,
      defaultValue: "—",
      description: "多系列数据, 每项含 name + data (数值数组) + 可选 color",
    },
    {
      name: "xAxis",
      type: "AxisLabel[]",
      required: true,
      defaultValue: "—",
      description: "X 轴标签数组, 长度与 data[].data 一致",
    },
    {
      name: "yAxis",
      type: "{ min?, max?, ticks? }",
      required: false,
      defaultValue: "—",
      description: "Y 轴配置: ticks 控制刻度数量 (默认 5)",
    },
    {
      name: "height",
      type: "number",
      required: false,
      defaultValue: "260",
      description: "SVG 高度 (px)",
    },
    {
      name: "caption",
      type: "string",
      required: false,
      defaultValue: "—",
      description: "整图 caption",
    },
  ],

  bar_chart: [
    {
      name: "widget",
      type: '"bar_chart"',
      required: true,
      defaultValue: "—",
      description: "固定为 \"bar_chart\"",
    },
    {
      name: "data",
      type: "ChartSeries",
      required: true,
      defaultValue: "—",
      description: "单系列数据 (与 line_chart 不同, 只支持 1 个系列)",
    },
    {
      name: "xAxis",
      type: "AxisLabel[]",
      required: true,
      defaultValue: "—",
      description: "X 轴标签",
    },
    {
      name: "yAxis",
      type: "{ min?, max?, ticks? }",
      required: false,
      defaultValue: "—",
      description: "Y 轴配置",
    },
    {
      name: "caption",
      type: "string",
      required: false,
      defaultValue: "—",
      description: "整图 caption",
    },
  ],

  pie_chart: [
    {
      name: "widget",
      type: '"pie_chart"',
      required: true,
      defaultValue: "—",
      description: "固定为 \"pie_chart\"",
    },
    {
      name: "data",
      type: "PieSlice[]",
      required: true,
      defaultValue: "—",
      description: "扇形数组, 每项含 label + value + 可选 color",
    },
    {
      name: "showLegend",
      type: "boolean",
      required: false,
      defaultValue: "true",
      description: "是否显示底部图例 (false 时节省空间)",
    },
    {
      name: "caption",
      type: "string",
      required: false,
      defaultValue: "—",
      description: "整图 caption",
    },
  ],

  table: [
    {
      name: "widget",
      type: '"table"',
      required: true,
      defaultValue: "—",
      description: "固定为 \"table\"",
    },
    {
      name: "columns",
      type: "TableColumn[]",
      required: true,
      defaultValue: "—",
      description: "列定义, 每项含 key + label + 可选 type (text/number/badge/progress/delta) + align",
    },
    {
      name: "rows",
      type: "TableRow[]",
      required: true,
      defaultValue: "—",
      description: "行数据, 键对应 columns[].key, 值根据列 type 决定",
    },
    {
      name: "highlightRow",
      type: "number",
      required: false,
      defaultValue: "—",
      description: "高亮第 N 行 (索引), 用于强调关键数据",
    },
    {
      name: "emptyHint",
      type: "string",
      required: false,
      defaultValue: "—",
      description: "rows 为空时显示的提示文本",
    },
    {
      name: "caption",
      type: "string",
      required: false,
      defaultValue: "—",
      description: "整表 caption",
    },
  ],

  timeline: [
    {
      name: "widget",
      type: '"timeline"',
      required: true,
      defaultValue: "—",
      description: "固定为 \"timeline\"",
    },
    {
      name: "events",
      type: "TimelineEvent[]",
      required: true,
      defaultValue: "—",
      description: "事件数组, 每项含 title + 可选 date/status/description/meta",
    },
    {
      name: "events[].status",
      type: '"pending" | "in_progress" | "completed" | "failed" | "cancelled"',
      required: false,
      defaultValue: '"pending"',
      description: "节点状态, 决定圆点颜色 (绿/蓝/灰/红/橙)",
    },
    {
      name: "caption",
      type: "string",
      required: false,
      defaultValue: "—",
      description: "整组 caption",
    },
  ],

  insight: [
    {
      name: "widget",
      type: '"insight"',
      required: true,
      defaultValue: "—",
      description: "固定为 \"insight\"",
    },
    {
      name: "variant",
      type: '"insight" | "warning" | "success"',
      required: true,
      defaultValue: "—",
      description: "3 种变体: insight(💡蓝) / warning(⚠️黄) / success(✅绿)",
    },
    {
      name: "title",
      type: "string",
      required: true,
      defaultValue: "—",
      description: "洞察标题, 走 i18n",
    },
    {
      name: "body",
      type: "string",
      required: true,
      defaultValue: "—",
      description: "洞察正文, 支持换行",
    },
    {
      name: "tag",
      type: "string",
      required: false,
      defaultValue: "—",
      description: "标签, 渲染在 title 旁 (如 '核心洞察' / '风险预警')",
    },
  ],

  progress_badge: [
    {
      name: "widget",
      type: '"progress_badge"',
      required: true,
      defaultValue: "—",
      description: "固定为 \"progress_badge\"",
    },
    {
      name: "status",
      type: '"pending" | "in_progress" | "completed" | "failed" | "cancelled"',
      required: true,
      defaultValue: "—",
      description: "5 种状态决定徽章配色",
    },
    {
      name: "value",
      type: "number",
      required: false,
      defaultValue: "—",
      description: "进度 0-100, 存在时显示进度条",
    },
    {
      name: "label",
      type: "string",
      required: true,
      defaultValue: "—",
      description: "主体文字, 走 i18n",
    },
    {
      name: "meta",
      type: "string",
      required: false,
      defaultValue: "—",
      description: "辅助说明, 渲染在 label 之后 (如负责人 / 截止日期)",
    },
  ],
};

/**
 * 给 widget 路径返回 API 字段
 */
export function getApiForWidget(widgetType: string): ReadonlyArray<ApiField> {
  return WIDGET_API[widgetType] ?? [];
}
