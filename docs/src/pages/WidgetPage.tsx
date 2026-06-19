import { useParams, Link } from "react-router-dom";
import { UiBlockRenderer, type UiBlockDSL } from "@timywel/baize-ui-dsl";
import type { WidgetMeta } from "../widget-meta";
import { widgetExamples } from "../widget-examples";
import CodeBlock, { dslToTypeSignature } from "../components/CodeBlock";
import ApiTable from "../components/ApiTable";
import { getApiForWidget } from "../widget-api";
import { useReveal } from "../hooks/useReveal";

export interface WidgetPageProps {
  readonly widgetMeta: ReadonlyArray<WidgetMeta>;
}

export default function WidgetPage({ widgetMeta }: WidgetPageProps) {
  const { widgetType } = useParams<{ widgetType: string }>();
  const meta = widgetMeta.find((w) => w.type === widgetType);
  const examples = widgetType ? widgetExamples[widgetType] ?? [] : [];

  const apiTableRef = useReveal<HTMLDivElement>();

  if (!meta) {
    return (
      <div className="page-header">
        <h1>未找到 widget</h1>
        <p>
          返回 <Link to="/">概览</Link> 查看所有 widget.
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="page-header">
        <h1>
          {meta.icon} {meta.name}
          <span
            style={{
              marginLeft: 12,
              fontSize: "0.875rem",
              color: "var(--color-text-muted)",
              fontWeight: 400,
            }}
          >
            {meta.type}
          </span>
        </h1>
        <p>{meta.description}</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.125rem", margin: "0 0 0.75rem" }}>
          典型场景
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {meta.scenarios.map((s) => (
            <span
              key={s}
              style={{
                padding: "0.25rem 0.75rem",
                background: "var(--color-brand-subtle)",
                color: "var(--color-brand)",
                borderRadius: "9999px",
                fontSize: "0.8125rem",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {examples.map((ex, idx) => (
        <section key={`${meta.type}-${idx}`} style={{ marginBottom: "2.5rem" }}>
          <h3 style={{ fontSize: "1.125rem", margin: "0 0 0.75rem" }}>
            示例 {idx + 1}: {ex.title}
          </h3>
          {ex.description && (
            <p
              style={{
                color: "var(--color-text-secondary)",
                marginBottom: "0.75rem",
              }}
            >
              {ex.description}
            </p>
          )}
          <div className="demo-card">
            <UiBlockRenderer dsl={ex.dsl} />
          </div>

          <CodeBlock
            title={`示例 ${idx + 1}`}
            tabs={[
              {
                key: "json",
                label: "JSON DSL",
                language: "json",
                code: JSON.stringify(ex.dsl, null, 2),
              },
              {
                key: "type",
                label: "TypeScript 类型",
                language: "typescript",
                code: `import type { UiBlockDSL } from "@timywel/baize-ui-dsl";\n\nconst dsl: UiBlockDSL = ${dslToTypeSignature(ex.dsl)};`,
              },
              {
                key: "usage",
                label: "使用示例",
                language: "tsx",
                code: generateUsageCode(ex.dsl),
              },
            ]}
          />
        </section>
      ))}

      <div ref={apiTableRef.ref} className="reveal-up">
        <ApiTable title="Props / Schema 字段" fields={getApiForWidget(meta.type)} />
      </div>
    </>
  );
}

function generateUsageCode(dsl: UiBlockDSL): string {
  return `import { UiBlockRenderer, I18nProvider, ThemeProvider } from "@timywel/baize-ui-dsl";
import type { UiBlockDSL } from "@timywel/baize-ui-dsl";

const dsl: UiBlockDSL = ${JSON.stringify(dsl, null, 2)};

export default function ChatMessage() {
  return (
    <ThemeProvider mode="auto">
      <I18nProvider locale="zh-CN">
        <UiBlockRenderer dsl={dsl} />
      </I18nProvider>
    </ThemeProvider>
  );
}`;
}