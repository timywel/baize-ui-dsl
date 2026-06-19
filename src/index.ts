/**
 * @timywel/baize-ui-dsl — 库主入口
 *
 * 白泽协议原生 UI DSL: Agent 后端 emit 结构化 UI, 前端按 schema 流式渲染.
 * 8 widget (KPI / 图表 / 表格 / 时间线 / 进度 / 洞察), 暗色主题原生, i18n 友好.
 *
 * 快速使用:
 * ```tsx
 * import { UiBlockRenderer, I18nProvider, ThemeProvider } from "@timywel/baize-ui-dsl";
 *
 * function ChatMessage({ dsl }) {
 *   return (
 *     <ThemeProvider mode="auto">
 *       <I18nProvider t={t} locale="zh-CN">
 *         <UiBlockRenderer dsl={dsl} />
 *       </I18nProvider>
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */

// Widgets
export * from "./widgets/index.js";

// Renderer
export * from "./renderer/index.js";

// Stream parser
export * from "./stream/index.js";

// Types
export * from "./types/index.js";

// Theme
export * from "./theme/index.js";

// i18n
export * from "./i18n/index.js";
