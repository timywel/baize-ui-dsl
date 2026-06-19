export default function GuidePage() {
  return (
    <>
      <section className="page-header">
        <h1>集成指南</h1>
        <p>3 分钟把 baize-ui-dsl 集成到你的 React 应用.</p>
      </section>

      <section className="demo-card">
        <h3 style={{ marginTop: 0 }}>1. 安装</h3>
        <pre className="code-block">{`pnpm add @timywel/baize-ui-dsl
# 或
npm install @timywel/baize-ui-dsl`}</pre>
      </section>

      <section className="demo-card">
        <h3 style={{ marginTop: 0 }}>2. 基础用法</h3>
        <pre className="code-block">{`import {
  UiBlockRenderer,
  I18nProvider,
  ThemeProvider,
} from "@timywel/baize-ui-dsl";
import type { UiBlockDSL } from "@timywel/baize-ui-dsl";

const dsl: UiBlockDSL = {
  widget: "kpi_grid",
  layout: "1x3",
  items: [
    { label: "今日 GMV", value: 128560, unit: "¥", delta: { value: 5.2, direction: "up" } },
    { label: "订单量", value: 3674, delta: { value: 8, direction: "down" } },
    { label: "客单价", value: 334.6 },
  ],
};

function App() {
  return (
    <ThemeProvider mode="auto">
      <I18nProvider locale="zh-CN">
        <UiBlockRenderer dsl={dsl} />
      </I18nProvider>
    </ThemeProvider>
  );
}`}</pre>
      </section>

      <section className="demo-card">
        <h3 style={{ marginTop: 0 }}>3. 集成 react-i18next</h3>
        <pre className="code-block">{`import { useTranslation } from "react-i18next";
import { UiBlockRenderer, I18nProvider } from "@timywel/baize-ui-dsl";

function ChatMessage({ dsl }) {
  const { t, i18n } = useTranslation();
  return (
    <I18nProvider t={t} locale={i18n.language}>
      <UiBlockRenderer dsl={dsl} />
    </I18nProvider>
  );
}`}</pre>
      </section>

      <section className="demo-card">
        <h3 style={{ marginTop: 0 }}>4. 流式渲染 (NDJSON / WebSocket)</h3>
        <pre className="code-block">{`import { useEffect } from "react";
import { UiBlockRenderer, useUiBlockStream } from "@timywel/baize-ui-dsl";

function StreamingChatMessage({ chatId, ws }) {
  const { state, apply, reset } = useUiBlockStream();

  useEffect(() => {
    reset();
    const unsubscribe = ws.subscribe((patch) => apply(patch));
    return () => {
      unsubscribe();
      reset();
    };
  }, [chatId]);

  return <UiBlockRenderer dsl={state.current} fallback={<Skeleton />} />;
}`}</pre>
      </section>

      <section className="demo-card">
        <h3 style={{ marginTop: 0 }}>5. 运行时校验 (推荐)</h3>
        <pre className="code-block">{`import { validateUiBlock } from "@timywel/baize-ui-dsl";

const result = validateUiBlock(jsonFromBackend);
if (result.ok) {
  return <UiBlockRenderer dsl={result.data} />;
} else {
  console.error("Invalid DSL:", result.errors);
  return <FallbackUI />;
}`}</pre>
      </section>

      <section className="demo-card">
        <h3 style={{ marginTop: 0 }}>6. 暗色主题</h3>
        <p>
          通过 <code>ThemeProvider mode="dark"</code> 切换; 或者在根节点添加 <code>data-theme="dark"</code> 属性 (CSS variable 自动切换).
        </p>
        <pre className="code-block">{`<div data-theme="dark">
  <ThemeProvider mode="auto">
    {/* 自动跟随根节点主题 */}
  </ThemeProvider>
</div>`}</pre>
        <p>
          所有 widget 使用 CSS variable (<code>var(--baize-*)</code>), 可以自定义 token 覆盖:
        </p>
        <pre className="code-block">{`:root {
  --baize-brand: #your-color;
  --baize-bg-card: #your-bg;
  --baize-text-primary: #your-text;
  /* 完整 token 见 docs/API.md */
}`}</pre>
      </section>

      <section className="page-header" style={{ marginTop: "2rem" }}>
        <h2>下一步</h2>
        <p>深入了解:</p>
        <ul>
          <li>📋 API 参考 (类型定义 / Props) — 见 <code>src/types/dsl.ts</code></li>
          <li>🧪 单测 — <code>npm test</code></li>
          <li>🌐 集成 baize-loop — 见 <code>integration/baize-loop-integration.md</code></li>
        </ul>
      </section>
    </>
  );
}
