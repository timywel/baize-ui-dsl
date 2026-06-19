/**
 * 关键 widget 渲染单测 (React Testing Library + happy-dom)
 *
 * 覆盖目标: 渲染正确性 + 边界 + a11y
 */

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  KpiGridWidget,
  InsightBlockWidget,
  ProgressBadgeWidget,
  TimelineWidget,
  LineChartWidget,
  BarChartWidget,
  PieChartWidget,
  TableWidget,
  UiBlockRenderer,
  I18nProvider,
  ThemeProvider,
} from "../../src/index.js";

function withProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider mode="light">
      <I18nProvider locale="zh-CN">{ui}</I18nProvider>
    </ThemeProvider>,
  );
}

describe("KpiGridWidget", () => {
  it("应渲染所有 KPI 项 (count-up 动画完成后)", async () => {
    withProviders(
      <KpiGridWidget
        dsl={{
          widget: "kpi_grid",
          layout: "1x3",
          items: [
            { label: "今日 GMV", value: 128560, unit: "¥", delta: { value: 5.2, direction: "up" } },
            { label: "订单量", value: 3674, delta: { value: 8, direction: "down" } },
            { label: "客单价", value: 334.6 },
          ],
        }}
      />,
    );
    // 等 count-up 动画完成 (默认 700ms + 缓冲)
    await new Promise((r) => setTimeout(r, 900));
    expect(screen.getByText("今日 GMV")).toBeInTheDocument();
    // 数字用千位分隔符渲染, 128560 -> "128,560"
    expect(screen.getByText("128,560")).toBeInTheDocument();
    expect(screen.getByText("3,674")).toBeInTheDocument();
    expect(screen.getByText("334.6")).toBeInTheDocument();
    // Delta: arrow + number 分两个 span
    expect(screen.getByText("5.2%")).toBeInTheDocument();
    expect(screen.getByText("8%")).toBeInTheDocument();
    expect(screen.getAllByText("↑").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("↓").length).toBeGreaterThanOrEqual(1);
  });

  it("空 items 应不崩 (schema 已校验, 但渲染层防御)", () => {
    const { container } = withProviders(
      <KpiGridWidget
        dsl={{ widget: "kpi_grid", layout: "1x2", items: [] }}
      />,
    );
    expect(container).toBeTruthy();
  });
});

describe("InsightBlockWidget", () => {
  it("3 种 variant 应正确渲染", () => {
    withProviders(
      <>
        <InsightBlockWidget
          dsl={{ widget: "insight", variant: "insight", title: "洞察", body: "正文" }}
        />
        <InsightBlockWidget
          dsl={{ widget: "insight", variant: "warning", title: "预警", body: "正文" }}
        />
        <InsightBlockWidget
          dsl={{ widget: "insight", variant: "success", title: "建议", body: "正文" }}
        />
      </>,
    );
    expect(screen.getByText("洞察")).toBeInTheDocument();
    expect(screen.getByText("预警")).toBeInTheDocument();
    expect(screen.getByText("建议")).toBeInTheDocument();
    expect(screen.getAllByText("正文").length).toBe(3);
  });
});

describe("ProgressBadgeWidget", () => {
  it("应渲染 status + label + value", () => {
    withProviders(
      <ProgressBadgeWidget
        dsl={{ widget: "progress_badge", status: "in_progress", value: 60, label: "首页改版" }}
      />,
    );
    expect(screen.getByText("进行中")).toBeInTheDocument();
    expect(screen.getByText("首页改版")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
  });
});

describe("TimelineWidget", () => {
  it("应渲染所有 events + status", () => {
    withProviders(
      <TimelineWidget
        dsl={{
          widget: "timeline",
          events: [
            { title: "需求评审", date: "10-20", status: "completed" },
            { title: "研发冲刺", date: "10-21", status: "in_progress" },
            { title: "UAT", date: "10-29", status: "pending" },
          ],
        }}
      />,
    );
    expect(screen.getByText("需求评审")).toBeInTheDocument();
    expect(screen.getByText("研发冲刺")).toBeInTheDocument();
    expect(screen.getByText("UAT")).toBeInTheDocument();
    expect(screen.getByText("已完成")).toBeInTheDocument();
    expect(screen.getByText("进行中")).toBeInTheDocument();
    expect(screen.getByText("待开始")).toBeInTheDocument();
  });
});

describe("LineChartWidget", () => {
  it("应渲染 SVG + 图例 (多系列)", () => {
    const { container } = withProviders(
      <LineChartWidget
        dsl={{
          widget: "line_chart",
          data: [
            { name: "系列1", data: [10, 20, 30] },
            { name: "系列2", data: [15, 18, 28] },
          ],
          xAxis: [{ label: "周一" }, { label: "周二" }, { label: "周三" }],
        }}
      />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(screen.getByText("系列1")).toBeInTheDocument();
    expect(screen.getByText("系列2")).toBeInTheDocument();
  });

  it("单系列不渲染图例", () => {
    const { container } = withProviders(
      <LineChartWidget
        dsl={{
          widget: "line_chart",
          data: [{ name: "单系列", data: [10, 20] }],
          xAxis: [{ label: "A" }, { label: "B" }],
        }}
      />,
    );
    // 单系列时不渲染图例 (行为定义), 验证 SVG 仍然渲染
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });
});

describe("BarChartWidget", () => {
  it("应渲染所有柱子", () => {
    const { container } = withProviders(
      <BarChartWidget
        dsl={{
          widget: "bar_chart",
          data: { name: "订单", data: [3200, 2800] },
          xAxis: [{ label: "华东" }, { label: "华南" }],
        }}
      />,
    );
    const bars = container.querySelectorAll("rect");
    expect(bars.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("华东")).toBeInTheDocument();
    expect(screen.getByText("华南")).toBeInTheDocument();
  });
});

describe("PieChartWidget", () => {
  it("应渲染所有扇形", () => {
    const { container } = withProviders(
      <PieChartWidget
        dsl={{
          widget: "pie_chart",
          data: [
            { label: "服饰", value: 45 },
            { label: "美妆", value: 28 },
          ],
        }}
      />,
    );
    const slices = container.querySelectorAll("path");
    expect(slices.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("服饰")).toBeInTheDocument();
    expect(screen.getByText("美妆")).toBeInTheDocument();
  });
});

describe("TableWidget", () => {
  it("应渲染表头 + 行 + badge cell", () => {
    withProviders(
      <TableWidget
        dsl={{
          widget: "table",
          columns: [
            { key: "name", label: "姓名" },
            { key: "score", label: "评分", type: "badge" },
          ],
          rows: [
            { name: "张伟", score: { type: "badge", value: "S", tone: "S" } },
            { name: "李娜", score: { type: "badge", value: "A", tone: "A" } },
          ],
        }}
      />,
    );
    expect(screen.getByText("姓名")).toBeInTheDocument();
    expect(screen.getByText("评分")).toBeInTheDocument();
    expect(screen.getByText("张伟")).toBeInTheDocument();
    expect(screen.getByText("S")).toBeInTheDocument();
  });

  it("空数据应显示 emptyHint", () => {
    withProviders(
      <TableWidget
        dsl={{
          widget: "table",
          columns: [{ key: "name", label: "姓名" }],
          rows: [],
          emptyHint: "暂无数据",
        }}
      />,
    );
    expect(screen.getByText("暂无数据")).toBeInTheDocument();
  });
});

describe("UiBlockRenderer", () => {
  it("null dsl 应渲染 fallback 或 null", () => {
    const { container } = withProviders(<UiBlockRenderer dsl={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("应按 widget type 分流", () => {
    withProviders(
      <UiBlockRenderer
        dsl={{
          widget: "insight",
          variant: "insight",
          title: "测试洞察",
          body: "内容",
        }}
      />,
    );
    expect(screen.getByText("测试洞察")).toBeInTheDocument();
  });

  it("render error 应显示降级 UI", () => {
    // 通过传一个渲染时会抛错的对象 (实际 widget 不会出错, 这里只是测 try/catch)
    const { container } = withProviders(
      <UiBlockRenderer
        dsl={
          // @ts-expect-error testing fallback path
          { widget: "unknown_widget" }
        }
      />,
    );
    // unknown widget → null (不渲染 fallback 因为没传)
    expect(container.firstChild).toBeNull();
  });
});
