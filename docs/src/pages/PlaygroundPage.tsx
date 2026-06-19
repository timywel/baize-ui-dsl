import { useState } from "react";
import { UiBlockRenderer, validateUiBlock, type UiBlockDSL } from "@timywel/baize-ui-dsl";

const DEFAULT_DSL: UiBlockDSL = {
  widget: "kpi_grid",
  layout: "1x3",
  items: [
    { label: "今日 GMV", value: 128560, unit: "¥", delta: { value: 5.2, direction: "up" } },
    { label: "订单量", value: 3674, delta: { value: 8, direction: "down" } },
    { label: "客单价", value: 334.6 },
  ],
  caption: "试试修改 JSON 看效果",
};

export default function PlaygroundPage() {
  const [text, setText] = useState(JSON.stringify(DEFAULT_DSL, null, 2));
  const [parsed, setParsed] = useState<UiBlockDSL>(DEFAULT_DSL);
  const [error, setError] = useState<string | null>(null);

  const handleApply = () => {
    try {
      const obj = JSON.parse(text);
      const result = validateUiBlock(obj);
      if (result.ok) {
        setParsed(result.data as UiBlockDSL);
        setError(null);
      } else {
        setError(result.errors.join("\n"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <>
      <section className="page-header">
        <h1>Playground</h1>
        <p>左侧编辑 JSON DSL, 右侧实时渲染. Zod 校验失败时显示错误.</p>
      </section>

      <div className="playground-grid">
        <div>
          <h3 style={{ fontSize: "1rem", margin: "0 0 0.5rem" }}>JSON DSL</h3>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            style={{
              width: "100%",
              height: 400,
              fontFamily: "ui-monospace, monospace",
              fontSize: "0.8125rem",
              padding: "1rem",
              border: "1px solid var(--color-border)",
              borderRadius: "0.375rem",
              background: "var(--color-bg-primary)",
              color: "var(--color-text-primary)",
              resize: "vertical",
            }}
          />
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
            <button className="btn btn-primary" onClick={handleApply}>
              应用 (Apply)
            </button>
            <button
              className="btn"
              onClick={() => {
                setText(JSON.stringify(DEFAULT_DSL, null, 2));
                setParsed(DEFAULT_DSL);
                setError(null);
              }}
            >
              重置
            </button>
          </div>
          {error && (
            <pre
              className="code-block"
              style={{ background: "#fef2f2", color: "#dc2626", marginTop: "0.75rem", whiteSpace: "pre-wrap" }}
            >
              {error}
            </pre>
          )}
        </div>

        <div>
          <h3 style={{ fontSize: "1rem", margin: "0 0 0.5rem" }}>渲染结果</h3>
          <div className="demo-card" style={{ minHeight: 400 }}>
            <UiBlockRenderer dsl={parsed} />
          </div>
        </div>
      </div>

      <section style={{ marginTop: "2rem" }}>
        <h3 style={{ fontSize: "1.125rem", margin: "0 0 0.5rem" }}>支持的 widget</h3>
        <p style={{ color: "var(--color-text-secondary)" }}>
          切换 <code style={{ background: "var(--color-bg-secondary)", padding: "0.1rem 0.4rem", borderRadius: "0.25rem" }}>widget</code> 字段试试:
        </p>
        <ul style={{ columns: 2, listStyle: "none", padding: 0 }}>
          <li><code>kpi_grid</code></li>
          <li><code>line_chart</code></li>
          <li><code>bar_chart</code></li>
          <li><code>pie_chart</code></li>
          <li><code>table</code></li>
          <li><code>timeline</code></li>
          <li><code>insight</code></li>
          <li><code>progress_badge</code></li>
        </ul>
      </section>
    </>
  );
}
