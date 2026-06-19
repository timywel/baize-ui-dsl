/**
 * StreamParser 单测
 */

import { describe, expect, it } from "vitest";
import {
  UiBlockStreamParser,
  createInitialParser,
  useUiBlockStream,
} from "../../src/stream/index.js";
import type { KpiGridBlock } from "../../src/types/dsl.js";

const sampleKpi: KpiGridBlock = {
  widget: "kpi_grid",
  layout: "1x3",
  items: [
    { label: "A", value: 100 },
    { label: "B", value: 200 },
    { label: "C", value: 300 },
  ],
};

describe("UiBlockStreamParser — replace op", () => {
  it("初始状态应为 null", () => {
    const parser = new UiBlockStreamParser();
    const state = parser.getState();
    expect(state.current).toBeNull();
    expect(state.patchCount).toBe(0);
    expect(state.firstError).toBeNull();
  });

  it("replace 应更新 current", () => {
    const parser = new UiBlockStreamParser();
    parser.apply({ op: "replace", dsl: sampleKpi });
    const state = parser.getState();
    expect(state.current).toEqual(sampleKpi);
    expect(state.patchCount).toBe(1);
  });

  it("非法 dsl 应记录错误但不中断", () => {
    const parser = new UiBlockStreamParser();
    parser.apply({
      op: "replace",
      // @ts-expect-error testing invalid dsl
      dsl: { widget: "unknown", data: [] },
    });
    const state = parser.getState();
    expect(state.firstError).not.toBeNull();
    expect(state.current).toBeNull();
  });

  it("合法 dsl 后再非法 dsl 应保留之前状态", () => {
    const parser = new UiBlockStreamParser();
    parser.apply({ op: "replace", dsl: sampleKpi });
    parser.apply({
      op: "replace",
      // @ts-expect-error testing invalid dsl
      dsl: { widget: "kpi_grid", layout: "invalid", items: [] },
    });
    const state = parser.getState();
    expect(state.current).toEqual(sampleKpi);
  });
});

describe("UiBlockStreamParser — patch op", () => {
  it("patch 应修改 deep path", () => {
    const parser = createInitialParser(sampleKpi);
    parser.apply({
      op: "patch",
      widget: "kpi_grid",
      patches: [{ path: "items.0.value", value: 999 }],
    });
    const state = parser.getState();
    expect(state.current?.widget).toBe("kpi_grid");
    if (state.current?.widget === "kpi_grid") {
      expect(state.current.items[0]?.value).toBe(999);
    }
  });

  it("无 current 时 patch 应错误但不崩", () => {
    const parser = new UiBlockStreamParser();
    parser.apply({
      op: "patch",
      widget: "kpi_grid",
      patches: [{ path: "items.0.value", value: 999 }],
    });
    expect(parser.getState().firstError).not.toBeNull();
  });

  it("widget mismatch 应错误", () => {
    const parser = createInitialParser(sampleKpi);
    parser.apply({
      op: "patch",
      widget: "table",
      patches: [],
    });
    expect(parser.getState().firstError).not.toBeNull();
  });
});

describe("UiBlockStreamParser — reset", () => {
  it("reset 应清空全部状态", () => {
    const parser = createInitialParser(sampleKpi);
    parser.reset();
    const state = parser.getState();
    expect(state.current).toBeNull();
    expect(state.patchCount).toBe(0);
    expect(state.firstError).toBeNull();
  });
});

describe("createInitialParser", () => {
  it("应创建并初始化 parser", () => {
    const parser = createInitialParser(sampleKpi);
    expect(parser.getState().current).toEqual(sampleKpi);
    expect(parser.getState().patchCount).toBe(1);
  });
});

describe("useUiBlockStream", () => {
  it("应返回 stream state + apply + reset", () => {
    // simple functional check, real DOM test in docs
    const hook = useUiBlockStream;
    expect(typeof hook).toBe("function");
  });
});
