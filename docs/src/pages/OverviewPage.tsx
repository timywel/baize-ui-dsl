import { Link } from "react-router-dom";
import {
  UiBlockRenderer,
  KpiGridWidget,
  LineChartWidget,
  PieChartWidget,
  type UiBlockDSL,
} from "@timywel/baize-ui-dsl";
import { WIDGET_META } from "../widget-meta";

export default function OverviewPage() {
  return (
    <>
      <section
        className="hero"
        style={{ padding: "3rem 0 2rem" }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "0.25rem 0.75rem",
            background: "var(--color-brand-subtle)",
            color: "var(--color-brand)",
            borderRadius: "9999px",
            fontSize: "0.75rem",
            fontWeight: 500,
            marginBottom: "1rem",
          }}
        >
          v0.1.0 · 8 widget · 流式原生
        </div>
        <h1 style={{ fontSize: "2.5rem", margin: "0 0 0.75rem" }}>
          白泽协议原生 UI DSL
        </h1>
        <p
          style={{
            fontSize: "1.05rem",
            color: "var(--color-text-secondary)",
            maxWidth: 720,
            margin: "0 auto 1.5rem",
          }}
        >
          Agent 后端 emit 结构化 UI, 前端按 schema 流式渲染. 零 token 浪费,
          零 LLM 学习成本.
        </p>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        >
          {[
            "后端 emit",
            "TypeScript schema",
            "Zod 校验",
            "NDJSON 流式",
            "暗色主题",
            "i18n 框架无关",
            "手写 SVG 图表",
            "零运行时依赖",
          ].map((tag) => (
            <span
              key={tag}
              style={{
                padding: "0.25rem 0.625rem",
                background: "var(--color-bg-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "4px",
                fontSize: "0.75rem",
                color: "var(--color-text-secondary)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="hero-cta">
          <Link to="/widgets/kpi_grid" className="btn btn-primary">
            开始浏览 Widget
          </Link>
          <Link to="/playground" className="btn">
            Playground 试试
          </Link>
        </div>
      </section>

      <section className="page-header">
        <h2>为什么需要这个库</h2>
        <p>与通用 UI 库 (TokUI / A2UI / AG-UI) 的关键差异</p>
      </section>

      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: "var(--color-bg-card, #fff)",
          borderColor: "var(--color-border, #e5e7eb)",
        }}
      >
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ background: "var(--color-bg-secondary, #f8f9fa)" }}>
              {["维度", "通用 UI 库", "baize-ui-dsl"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider"
                  style={{
                    color: "var(--color-text-muted, #9ca3af)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["DSL 来源", "LLM 输出 (依赖训练)", "后端协议层直接 emit"],
              ["token 成本", "DSL 消耗 LLM 上下文", "零 (不经过 LLM)"],
              ["格式错误率", "依赖 LLM 稳定性", "零 (TS schema 强约束)"],
              ["覆盖范围", "通用 14+ 行业", "白泽 Agent 输出类型"],
              ["i18n", "各自实现", "框架无关 + 默认字典"],
              ["维护方", "商业团队", "白泽自身"],
            ].map((row, i) => (
              <tr
                key={i}
                style={{
                  borderTop: "1px solid var(--color-border, #e5e7eb)",
                }}
              >
                <td
                  className="px-4 py-3 font-medium text-[13px]"
                  style={{ color: "var(--color-text-primary, #111827)" }}
                >
                  {row[0]}
                </td>
                <td
                  className="px-4 py-3 text-[13px]"
                  style={{ color: "var(--color-text-secondary, #6b7280)" }}
                >
                  {row[1]}
                </td>
                <td
                  className="px-4 py-3 text-[13px] font-medium"
                  style={{ color: "var(--color-brand)" }}
                >
                  ✓ {row[2]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="page-header">
        <h2>8 个 Widget 速览</h2>
        <p>每个 widget 一个独立展示页, 含基础示例 + 高级示例 + 代码片段.</p>
      </section>

      <div className="feature-grid">
        {WIDGET_META.map((w) => (
          <Link
            key={w.type}
            to={`/widgets/${w.type}`}
            style={{ textDecoration: "none" }}
          >
            <div className="feature-card">
              <h3>
                {w.icon} {w.name}
              </h3>
              <p>{w.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <section className="page-header" style={{ marginTop: "3rem" }}>
        <h2>综合示例: 电商 dashboard</h2>
        <p>3 个 widget 组合, 一句话指令 → 完整可交互面板.</p>
      </section>

      <div className="demo-card">
        <div className="demo-card-title">Prompt: "帮我搭一个电商运营数据看板, 要能看到 GMV、订单量、转化率, 再配一张趋势图"</div>
        <UiBlockRenderer dsl={ecommerceKpi} />
        <UiBlockRenderer dsl={ecommerceTrend} />
        <UiBlockRenderer dsl={ecommerceCategory} />
      </div>
    </>
  );
}

const ecommerceKpi: UiBlockDSL = {
  widget: "kpi_grid",
  layout: "1x4",
  items: [
    { label: "今日 GMV", value: 128560, unit: "¥", delta: { value: 5.2, direction: "up" } },
    { label: "订单量", value: 3674, delta: { value: 8.1, direction: "up" } },
    { label: "支付转化率", value: 4.2, unit: "%", delta: { value: 2.3, direction: "up" } },
    { label: "客单价", value: 334.6, unit: "¥", delta: { value: 1.2, direction: "down" } },
  ],
  caption: "数据更新时间: 2026-06-17 10:00:00",
};

const ecommerceTrend: UiBlockDSL = {
  widget: "line_chart",
  data: [
    { name: "GMV", data: [96420, 102300, 110500, 108200, 124800, 128560] },
  ],
  xAxis: [{ label: "周一" }, { label: "周二" }, { label: "周三" }, { label: "周四" }, { label: "周五" }, { label: "周六" }],
  caption: "近 6 日 GMV 趋势 (元)",
};

const ecommerceCategory: UiBlockDSL = {
  widget: "pie_chart",
  data: [
    { label: "服饰", value: 45 },
    { label: "美妆", value: 28 },
    { label: "数码", value: 18 },
    { label: "家居", value: 9 },
  ],
  caption: "类目占比 (%)",
};
