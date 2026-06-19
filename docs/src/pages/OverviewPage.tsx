import { Link } from "react-router-dom";
import {
  KpiGridWidget,
  LineChartWidget,
  PieChartWidget,
  UiBlockRenderer,
  type UiBlockDSL,
} from "@timywel/baize-ui-dsl";
import { ArrowRight } from "lucide-react";
import { WIDGET_META } from "../widget-meta";
import { useReveal } from "../hooks/useReveal";

export default function OverviewPage() {
  const widgetsGridRef = useReveal<HTMLDivElement>();
  const demoCardRef = useReveal<HTMLDivElement>();

  return (
    <>
      {/* ───── HERO: split 5/7 (desktop) → stack (移动端) ───── */}
      <section className="hero hero-split">
        {/* 左侧 — 标题 / 副标题 / CTA */}
        <div className="hero-left">
          <div className="hero-badge">
            v0.1.0 · 8 widget · 流式原生
          </div>
          <h1>白泽协议原生 UI DSL</h1>
          <p className="lede">
            Agent 后端 emit 结构化 UI, 前端按 schema 流式渲染。
            零 token 浪费, 零 LLM 学习成本。
          </p>
          <div className="hero-cta">
            <Link to="/widgets/kpi_grid" className="btn btn-primary">
              浏览 Widget <ArrowRight size={14} style={{ marginLeft: 6 }} />
            </Link>
            <Link to="/playground" className="btn btn-ghost">
              Playground
            </Link>
          </div>
        </div>

        {/* 右侧 — 实时 dashboard 演示 (移动端隐藏折线图) */}
        <div className="hero-right">
          <div className="hero-demo">
            {/* Desktop: KPI + LineChart; Mobile: only KPI */}
            <div className="hero-demo-desktop">
              <KpiGridWidget dsl={heroKpi} dense />
              <LineChartWidget dsl={heroTrend} />
            </div>
            <div className="hero-demo-mobile">
              <KpiGridWidget dsl={heroKpiMobile} dense />
            </div>
          </div>
          <div className="hero-caption">
            一句话 prompt → 完整可交互 UI
          </div>
        </div>
      </section>

      {/* ───── Section 1: 为什么需要这个库 (有 eyebrow) ───── */}
      <section className="page-header">
        <div className="eyebrow">差异化</div>
        <h2>为什么需要这个库</h2>
        <p>与通用 UI 库 (TokUI / A2UI / AG-UI) 的关键差异</p>
      </section>

      <div className="compare-table">
        <table>
          <thead>
            <tr>
              {["维度", "通用 UI 库", "baize-ui-dsl"].map((h) => (
                <th key={h}>{h}</th>
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
              <tr key={i}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td className="highlight">✓ {row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ───── Section 2: 8 widget 卡片 (无 eyebrow, 间距撑开) ───── */}
      <section className="page-header">
        <h2>8 个 Widget</h2>
        <p>每个 widget 一个独立展示页, 含基础 + 高级示例 + 代码片段 + API 文档</p>
      </section>

      <div ref={widgetsGridRef.ref} className="feature-grid reveal-stagger">
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

      {/* ───── Section 3: 综合示例 (无 eyebrow, 但 page-header 是必需的) ───── */}
      <section className="page-header" style={{ marginTop: "4rem" }}>
        <h2>综合示例: 电商 dashboard</h2>
        <p>3 个 widget 组合, 一句话指令 → 完整可交互面板</p>
      </section>

      <div ref={demoCardRef.ref} className="demo-card reveal-up">
        <div className="demo-card-title">
          Prompt: "帮我搭一个电商运营数据看板, 要能看到 GMV、订单量、转化率, 再配一张趋势图"
        </div>
        <KpiGridWidget dsl={ecommerceKpi} />
        <LineChartWidget dsl={ecommerceTrend} />
        <PieChartWidget dsl={ecommerceCategory} />
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
 *  Hero 内嵌示例 — 紧凑 2x2 KPI + 趋势折线
 * ───────────────────────────────────────────────────────────────── */
const heroKpi: UiBlockDSL = {
  widget: "kpi_grid",
  layout: "1x2",
  items: [
    { label: "今日 GMV", value: 128560, unit: "¥", delta: { value: 5.2, direction: "up" } },
    { label: "订单", value: 3674, delta: { value: 8.1, direction: "up" } },
  ],
};

const heroTrend: UiBlockDSL = {
  widget: "line_chart",
  data: [{ name: "GMV", data: [96420, 102300, 110500, 108200, 124800, 128560] }],
  xAxis: [
    { label: "周一" }, { label: "周二" }, { label: "周三" },
    { label: "周四" }, { label: "周五" }, { label: "周六" },
  ],
  height: 140,
};

// 移动端用极简单 KPI + chart (避免 1x2 在窄屏挤)
const heroKpiMobile: UiBlockDSL = {
  widget: "kpi_grid",
  layout: "1x2",
  items: [
    { label: "GMV", value: 128560, delta: { value: 5.2, direction: "up" } },
    { label: "订单", value: 3674, delta: { value: 8.1, direction: "up" } },
  ],
};

/* ─────────────────────────────────────────────────────────────────
 *  综合示例数据 (更长, 用于下方 dashboard demo)
 * ───────────────────────────────────────────────────────────────── */
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
  xAxis: [
    { label: "周一" }, { label: "周二" }, { label: "周三" },
    { label: "周四" }, { label: "周五" }, { label: "周六" },
  ],
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