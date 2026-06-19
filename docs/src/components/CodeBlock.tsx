/**
 * CodeBlock — 代码块组件 (element-plus 风格)
 *
 * 特性:
 * - 顶部 Tab 切换 (JSON DSL / TS 类型签名 / 预览) — 可选
 * - 右上角 Copy 按钮 (lucide-react Copy/Check 图标)
 * - shiki 语法高亮 (light + dark 双主题, 跟随根 [data-theme])
 * - 行号
 * - 语言标签 (JSON / TypeScript / Bash)
 */

import { useState, useEffect, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import {
  createHighlighter,
  type BundledLanguage,
  type Highlighter,
} from "shiki";

// 共享的 shiki highlighter (单例, 按需懒加载主题/语言)
let highlighterPromise: Promise<Highlighter> | null = null;
async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: ["json", "typescript", "tsx", "bash"],
    });
  }
  return highlighterPromise;
}

export interface CodeTab {
  readonly key: string;
  readonly label: string;
  readonly language: BundledLanguage;
  readonly code: string;
}

export interface CodeBlockProps {
  readonly tabs?: ReadonlyArray<CodeTab>;
  readonly code?: string;
  readonly language?: BundledLanguage;
  readonly title?: string;
  readonly showLineNumbers?: boolean;
}

const LANG_LABELS: Record<string, string> = {
  json: "JSON",
  typescript: "TypeScript",
  tsx: "TSX",
  bash: "Bash",
  text: "Text",
};

function CopyButton({ code }: { readonly code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label="复制代码"
      className="absolute top-2 right-2 z-10 p-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

function useShikiRender(code: string, lang: BundledLanguage): string {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    getHighlighter()
      .then((hl) => {
        if (cancelled) return;
        return hl.codeToHtml(code, {
          lang,
          themes: { light: "github-light", dark: "github-dark" },
          defaultColor: false,
        });
      })
      .then((h) => {
        if (h && !cancelled) setHtml(h);
      })
      .catch(() => {
        if (!cancelled)
          setHtml(
            `<pre><code>${code.replace(/</g, "&lt;")}</code></pre>`,
          );
      });
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  return html;
}

function HighlightedCode({
  code,
  language,
  showLineNumbers,
}: {
  readonly code: string;
  readonly language: BundledLanguage;
  readonly showLineNumbers?: boolean;
}) {
  const html = useShikiRender(code, language);

  if (!html) {
    return (
      <pre
        className="m-0 p-4 overflow-x-auto text-[13px] leading-[1.6] font-mono"
        style={{ background: "#f6f8fa", color: "#24292f", minHeight: 60 }}
      >
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div
      className={`shiki-container text-[13px] leading-[1.6] font-mono ${
        showLineNumbers ? "with-line-numbers" : ""
      }`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function CodeBlock({
  tabs,
  code,
  language = "text",
  title,
  showLineNumbers = true,
}: CodeBlockProps) {
  if (tabs && tabs.length > 0) {
    return (
      <MultiTabCodeBlock
        tabs={tabs}
        title={title}
        showLineNumbers={showLineNumbers}
      />
    );
  }

  if (code === undefined) return null;

  return (
    <div className="relative rounded-md overflow-hidden my-3 border border-slate-700">
      {title && (
        <div
          className="flex items-center justify-between px-3 py-1.5 text-[11px] font-medium"
          style={{ background: "#0f172a", color: "#94a3b8" }}
        >
          <span>{title}</span>
          <span className="uppercase tracking-wider opacity-60">
            {LANG_LABELS[language] ?? language}
          </span>
        </div>
      )}
      <div className="relative">
        <CopyButton code={code} />
        <HighlightedCode
          code={code}
          language={language}
          showLineNumbers={showLineNumbers}
        />
      </div>
    </div>
  );
}

function MultiTabCodeBlock({
  tabs,
  title,
  showLineNumbers,
}: {
  readonly tabs: ReadonlyArray<CodeTab>;
  readonly title?: string;
  readonly showLineNumbers?: boolean;
}) {
  const [active, setActive] = useState(tabs[0]?.key ?? "");
  const current = tabs.find((t) => t.key === active) ?? tabs[0];
  if (!current) return null;

  return (
    <div className="relative rounded-md overflow-hidden my-3 border border-slate-700">
      <div
        className="flex items-center justify-between border-b border-slate-700"
        style={{ background: "#0f172a" }}
      >
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`px-3 py-1.5 text-[12px] font-medium transition-colors ${
                active === tab.key
                  ? "text-white border-b-2 border-blue-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {title && (
          <span className="text-[11px] text-slate-500 pr-3">{title}</span>
        )}
      </div>
      <div className="relative">
        <CopyButton code={current.code} />
        <HighlightedCode
          code={current.code}
          language={current.language}
          showLineNumbers={showLineNumbers}
        />
      </div>
    </div>
  );
}

export function dslToTypeSignature(dsl: unknown): string {
  if (!dsl || typeof dsl !== "object") return "unknown";
  const obj = dsl as { widget?: string };
  const widget = obj.widget;
  if (!widget) return "UiBlockDSL";

  const samples: Record<string, string> = {
    kpi_grid: `{
  widget: "kpi_grid",
  layout: "1x2" | "1x3" | "1x4" | "2x2",
  items: KpiItem[],
  caption?: string
}`,
    line_chart: `{
  widget: "line_chart",
  data: ChartSeries[],
  xAxis: AxisLabel[],
  yAxis?: { min?, max?, ticks? },
  caption?: string
}`,
    bar_chart: `{
  widget: "bar_chart",
  data: ChartSeries,
  xAxis: AxisLabel[],
  yAxis?: { min?, max?, ticks? }
}`,
    pie_chart: `{
  widget: "pie_chart",
  data: PieSlice[],
  caption?: string,
  showLegend?: boolean
}`,
    table: `{
  widget: "table",
  columns: TableColumn[],
  rows: TableRow[],
  highlightRow?: number,
  emptyHint?: string
}`,
    timeline: `{
  widget: "timeline",
  events: TimelineEvent[],
  orientation?: "vertical" | "horizontal"
}`,
    insight: `{
  widget: "insight",
  variant: "insight" | "warning" | "success",
  title: string,
  body: string,
  tag?: string
}`,
    progress_badge: `{
  widget: "progress_badge",
  status: ProgressStatus,
  value?: number,
  label: string,
  meta?: string
}`,
  };

  return samples[widget] ?? `unknown widget: ${widget}`;
}

export function CodeInline({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode {
  return (
    <code
      className="px-1 py-0.5 rounded text-[0.85em] font-mono"
      style={{
        background: "var(--color-bg-secondary)",
        color: "var(--color-text-primary)",
      }}
    >
      {children}
    </code>
  );
}
