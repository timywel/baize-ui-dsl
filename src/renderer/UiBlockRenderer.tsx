/**
 * UiBlockRenderer — UI DSL 渲染入口
 *
 * 按 dsl.widget 分流到 8 个 widget 组件.
 * Why: 协议原生 UI 渲染的核心入口 (类似 element-ui 的 <el-* />).
 */

import { memo } from "react";
import type { UiBlockDSL } from "../types/dsl.js";
import { useT } from "../i18n/I18nProvider.js";
import {
  BarChartWidget,
  InsightBlockWidget,
  KpiGridWidget,
  LineChartWidget,
  PieChartWidget,
  ProgressBadgeWidget,
  TableWidget,
  TimelineWidget,
} from "../widgets/index.js";

export interface UiBlockRendererProps {
  readonly dsl: UiBlockDSL | null | undefined;
  readonly fallback?: React.ReactNode;
  readonly onError?: (error: Error) => void;
}

function UiBlockRendererImpl({
  dsl,
  fallback,
  onError,
}: UiBlockRendererProps) {
  const t = useT();

  if (!dsl) {
    return fallback ? <>{fallback}</> : null;
  }

  try {
    switch (dsl.widget) {
      case "kpi_grid":
        return <KpiGridWidget dsl={dsl} />;
      case "line_chart":
        return <LineChartWidget dsl={dsl} />;
      case "bar_chart":
        return <BarChartWidget dsl={dsl} />;
      case "pie_chart":
        return <PieChartWidget dsl={dsl} />;
      case "table":
        return <TableWidget dsl={dsl} />;
      case "timeline":
        return <TimelineWidget dsl={dsl} />;
      case "insight":
        return <InsightBlockWidget dsl={dsl} />;
      case "progress_badge":
        return <ProgressBadgeWidget dsl={dsl} />;
      default: {
        // Exhaustiveness check
        const _exhaustive: never = dsl;
        void _exhaustive;
        if (typeof console !== "undefined") {
          console.warn("[UiBlockRenderer] unknown widget:", dsl);
        }
        return fallback ? <>{fallback}</> : null;
      }
    }
  } catch (err) {
    if (onError) {
      onError(err instanceof Error ? err : new Error(String(err)));
    }
    if (typeof console !== "undefined") {
      console.error("[UiBlockRenderer] render error:", err);
    }
    return (
      <div className="my-3 px-3 py-2 rounded border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
        {t("common.errorTitle", "渲染失败")}: {t("common.errorFallback", "该 UI 块无法显示，请稍后重试")}
      </div>
    );
  }
}

export const UiBlockRenderer = memo(UiBlockRendererImpl);
UiBlockRenderer.displayName = "UiBlockRenderer";
