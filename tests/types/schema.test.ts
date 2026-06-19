/**
 * DSL schema 单测
 *
 * 覆盖目标:
 * - 8 个 widget 全部合法
 * - 未知 widget 拒绝
 * - 必填字段缺失拒绝
 * - 类型错误拒绝
 */

import { describe, expect, it } from "vitest";
import {
  validateUiBlock,
  isKnownWidget,
  WIDGET_TYPES,
  uiBlockDslSchema,
} from "../../src/types/index.js";

const validKpiGrid = {
  widget: "kpi_grid",
  layout: "1x4",
  items: [
    { label: "今日 GMV", value: 128560, unit: "¥", delta: { value: 5.2, direction: "up" } },
    { label: "订单量", value: 3674, delta: { value: 8.1, direction: "up" } },
  ],
};

const validLineChart = {
  widget: "line_chart",
  data: [{ name: "本周", data: [10, 20, 15, 30, 25, 35] }],
  xAxis: [{ label: "周一" }, { label: "周二" }, { label: "周三" }],
  caption: "近 6 日 GMV 趋势",
};

const validBarChart = {
  widget: "bar_chart",
  data: { name: "订单", data: [3200, 2800, 2400, 2000, 1700] },
  xAxis: [
    { label: "华东" },
    { label: "华南" },
    { label: "华北" },
    { label: "西南" },
    { label: "其他" },
  ],
};

const validPieChart = {
  widget: "pie_chart",
  data: [
    { label: "服饰", value: 45 },
    { label: "美妆", value: 28 },
    { label: "数码", value: 18 },
    { label: "家居", value: 9 },
  ],
};

const validTable = {
  widget: "table",
  columns: [
    { key: "name", label: "姓名" },
    { key: "score", label: "评分", type: "badge" },
  ],
  rows: [
    { name: "张伟", score: { type: "badge", value: "S", tone: "S" } },
    { name: "李娜", score: { type: "badge", value: "A", tone: "A" } },
  ],
};

const validTimeline = {
  widget: "timeline",
  events: [
    { title: "需求评审通过", date: "10-20", status: "completed" },
    { title: "研发冲刺", date: "10-21", status: "in_progress" },
  ],
};

const validInsight = {
  widget: "insight",
  variant: "insight",
  title: "核心洞察",
  body: "小程序渠道新客转化率高出 APP 22%",
};

const validProgressBadge = {
  widget: "progress_badge",
  status: "in_progress",
  value: 60,
  label: "首页改版",
};

describe("validateUiBlock — 合法 widget", () => {
  it.each([
    ["kpi_grid", validKpiGrid],
    ["line_chart", validLineChart],
    ["bar_chart", validBarChart],
    ["pie_chart", validPieChart],
    ["table", validTable],
    ["timeline", validTimeline],
    ["insight", validInsight],
    ["progress_badge", validProgressBadge],
  ] as const)("%s 应通过校验", (_name, payload) => {
    const result = validateUiBlock(payload);
    expect(result.ok).toBe(true);
  });
});

describe("validateUiBlock — 非法情况", () => {
  it("未知 widget 应拒绝", () => {
    const result = validateUiBlock({
      widget: "unknown_widget",
      data: [],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });

  it("缺失 widget 字段应拒绝", () => {
    const result = validateUiBlock({
      layout: "1x4",
      items: [],
    });
    expect(result.ok).toBe(false);
  });

  it("null 应拒绝", () => {
    const result = validateUiBlock(null);
    expect(result.ok).toBe(false);
  });

  it("kpi_grid items 为空数组应拒绝", () => {
    const result = validateUiBlock({
      widget: "kpi_grid",
      layout: "1x4",
      items: [],
    });
    expect(result.ok).toBe(false);
  });

  it("line_chart data 为空应拒绝", () => {
    const result = validateUiBlock({
      widget: "line_chart",
      data: [],
      xAxis: [],
    });
    expect(result.ok).toBe(false);
  });

  it("progress_badge value 超出 0-100 应拒绝", () => {
    const result = validateUiBlock({
      widget: "progress_badge",
      status: "in_progress",
      value: 150,
      label: "test",
    });
    expect(result.ok).toBe(false);
  });

  it("table row 类型错误应拒绝", () => {
    const result = validateUiBlock({
      widget: "table",
      columns: [{ key: "name", label: "姓名" }],
      rows: [{ name: { type: "invalid_type", value: "x" } }],
    });
    expect(result.ok).toBe(false);
  });
});

describe("isKnownWidget — widget 类型守卫", () => {
  it("已知 widget 应返回 true", () => {
    expect(isKnownWidget("kpi_grid")).toBe(true);
    expect(isKnownWidget("table")).toBe(true);
  });

  it("未知 widget 应返回 false", () => {
    expect(isKnownWidget("foo_bar")).toBe(false);
    expect(isKnownWidget("")).toBe(false);
    expect(isKnownWidget(null)).toBe(false);
    expect(isKnownWidget(123)).toBe(false);
  });
});

describe("WIDGET_TYPES 枚举", () => {
  it("应有 8 个 widget", () => {
    expect(WIDGET_TYPES.length).toBe(8);
  });

  it("schema 应识别所有 widget", () => {
    for (const wt of WIDGET_TYPES) {
      const sample = sampleByWidget(wt);
      const result = uiBlockDslSchema.safeParse(sample);
      expect(result.success).toBe(true);
    }
  });
});

function sampleByWidget(widget: string) {
  switch (widget) {
    case "kpi_grid":
      return validKpiGrid;
    case "line_chart":
      return validLineChart;
    case "bar_chart":
      return validBarChart;
    case "pie_chart":
      return validPieChart;
    case "table":
      return validTable;
    case "timeline":
      return validTimeline;
    case "insight":
      return validInsight;
    case "progress_badge":
      return validProgressBadge;
    default:
      throw new Error(`unknown: ${widget}`);
  }
}
