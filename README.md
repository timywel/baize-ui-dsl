# @timywel/baize-ui-dsl

> **白泽协议原生 UI DSL** — Agent 后端 emit 结构化 UI，前端按 schema 流式渲染

[![npm version](https://img.shields.io/npm/v/@timywel/baize-ui-dsl.svg)](https://www.npmjs.com/package/@timywel/baize-ui-dsl)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)

## 📸 预览

**自建文档站架构** — 左导航（widget 按 4 个 category 分组）+ 顶部 tab（指南 / 组件 / Playground / 集成）+ 实时 Playground JSON DSL 编辑器 + 代码块一键复制 + API 字段表格 + 右侧 sticky 目录。所有组件 100% 自实现，零外部库依赖（除 React + Tailwind）。

### 本地预览

```bash
# 安装依赖（一次性）
pnpm install

# 启动 dev server（端口 5174）
pnpm dev:docs

# 生产构建 + 预览（端口 4174）
pnpm --filter baize-ui-dsl-docs build
pnpm --filter baize-ui-dsl-docs preview
```

### 预览站功能

- 📋 **8 个 widget** —— 每个独立展示页（基础 + 高级示例 + JSON DSL）
- 🎮 **Playground** —— 左侧编辑 JSON DSL，右侧实时渲染 + Zod 错误提示
- 🌗 **暗色 / 浅色主题切换**
- 🌐 **中英文切换**
- 📦 **代码块多 Tab** —— JSON DSL / TypeScript 类型 / 实际使用代码
- 📋 **一键复制** —— 所有代码块右上角 Copy 按钮

### 截图占位

> 📷 部署后截图将放在这里。

预期截图清单（v0.1.0 发布时）：
1. 概览页 hero 区
2. KPI 网格 + 折线图 + 饼图 综合示例
3. Playground 实时编辑
4. 暗色主题对比

---

## 这是什么？

**白泽（Baize）协议原生 UI 渲染层** — 让 LLM Agent 的输出从"Markdown 文本"升级为"真正的可交互 UI"，但**不需要 LLM 学会新 DSL**。

### 核心差异化

| 维度 | TokUI / A2UI / AG-UI | **baize-ui-dsl** |
|------|----------------------|------------------|
| **DSL 来源** | LLM 输出（依赖训练） | **后端协议层直接 emit** |
| **token 成本** | DSL 本身消耗 LLM 上下文 | **零**（不经过 LLM） |
| **格式错误率** | 依赖 LLM 输出稳定性 | **零**（TypeScript schema 强约束） |
| **覆盖范围** | 通用 14+ 行业 | 白泽 Agent 输出类型 |
| **i18n** | 各自实现 | 框架无关 + 默认字典 |

### 8 个 Widget（MVP）

| Widget | 适用场景 |
|--------|----------|
| `kpi_grid` | 数据看板、运营报表（↑↓ 趋势） |
| `line_chart` | 折线图（单/多系列，SVG 手写） |
| `bar_chart` | 柱状图 |
| `pie_chart` | 饼图（带引线标签） |
| `table` | 结构化表格（5 种 cell type） |
| `timeline` | 竖向时间线（项目计划、简历） |
| `insight` | 洞察 / 预警 / 建议块（💡⚠️✅） |
| `progress_badge` | 状态徽章 + 进度条 |

## 安装

```bash
pnpm add @timywel/baize-ui-dsl
# 或
npm install @timywel/baize-ui-dsl
```

**依赖要求**：
- React ≥ 18.0.0
- React DOM ≥ 18.0.0
- Node ≥ 18（开发环境）

## 快速开始

### 1. 基础用法

```tsx
import {
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
  caption: "数据更新时间: 2026-06-17",
};

function ChatMessage() {
  return (
    <ThemeProvider mode="auto">
      <I18nProvider locale="zh-CN">
        <UiBlockRenderer dsl={dsl} />
      </I18nProvider>
    </ThemeProvider>
  );
}
```

### 2. 集成 react-i18next

```tsx
import { useTranslation } from "react-i18next";
import { UiBlockRenderer, I18nProvider } from "@timywel/baize-ui-dsl";

function ChatMessage({ dsl }) {
  const { t, i18n } = useTranslation();
  return (
    <I18nProvider t={t} locale={i18n.language}>
      <UiBlockRenderer dsl={dsl} />
    </I18nProvider>
  );
}
```

### 3. 流式渲染（NDJSON 后端）

```tsx
import { useEffect } from "react";
import { UiBlockRenderer, useUiBlockStream } from "@timywel/baize-ui-dsl";

function StreamingChatMessage({ chatId, ws }) {
  const { state, apply, reset } = useUiBlockStream();

  useEffect(() => {
    reset();
    const unsubscribe = ws.subscribe((patch) => apply(patch));
    return unsubscribe;
  }, [chatId, ws, apply, reset]);

  return <UiBlockRenderer dsl={state.current} fallback={<Skeleton />} />;
}
```

## 完整示例（电商 dashboard）

```tsx
const dsl: UiBlockDSL = {
  widget: "line_chart",
  data: [
    { name: "本周", data: [96420, 102300, 110500, 108200, 124800, 128560] },
  ],
  xAxis: [
    { label: "周一" },
    { label: "周二" },
    { label: "周三" },
    { label: "周四" },
    { label: "周五" },
    { label: "周六" },
  ],
  caption: "近 6 日 GMV 趋势",
};
```

→ 渲染结果：[展示站示例](https://baize-ui-dsl-docs.example.com/widgets/line-chart)

## 架构

```
┌─────────────────────────────────────────────┐
│  Agent 后端 (loop.ts)                       │
│   emit { type: "ui_block", dsl: {...} }     │
└─────────────────────────────────────────────┘
                  ↓ NDJSON / WebSocket
┌─────────────────────────────────────────────┐
│  baize-ui-dsl (本库)                         │
│                                             │
│   types/  ← TS types + Zod schema (契约)    │
│   stream/ ← 流式解析器 (replace/patch)      │
│   renderer/← UiBlockRenderer 入口            │
│   widgets/ ← 8 个 widget 组件                │
│   theme/   ← 设计 token + ThemeProvider      │
│   i18n/    ← i18n 抽象 + 默认字典            │
└─────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│  消费方 (baize-loop / 第三方应用)             │
│   <UiBlockRenderer dsl={dsl} />             │
└─────────────────────────────────────────────┘
```

## 文档

- 📖 **展示站**：本地启动 `pnpm dev:docs` 访问
- 📋 **API 参考**：[docs/API.md](./docs/API.md)（待生成）
- 🌐 **集成指南**：[integration/baize-loop-integration.md](./integration/baize-loop-integration.md)
- 📝 **设计思路**：[plan/PLAN-BAIZE-UI-DSL.md](./plan/PLAN-BAIZE-UI-DSL.md)

## 开发

```bash
# 安装依赖
pnpm install

# 跑测试
pnpm test
pnpm test:coverage  # 覆盖率报告

# 类型检查
pnpm lint

# 构建库
pnpm build

# 启动展示站
pnpm dev:docs
```

## 路线图

- **v0.1.0**（当前）：8 widget MVP + 类型 + 流式解析 + 展示站
- **v0.2.0**：交互支持（hover / click → callback，对应 AG-UI 范畴）
- **v0.3.0**：更多 widget（雷达图、地图、树形、tabs）
- **v1.0.0**：跨端（iOS / Android / 小程序，通过新 renderer）

## 与 baize-loop 集成

本库是 **baize-loop chat 架构重设计**（`PLAN-CHAT-ARCH-REDESIGN`）的 UI 端。

集成路径：`/规范/baize-ui-dsl/` → `baize-loop/packages/baize-ui-dsl/` → `frontend/src/components/chat/`

详见 [integration/baize-loop-integration.md](./integration/baize-loop-integration.md)

## 借鉴与归属

本库为 **clean-room 实现**，灵感来源：

- **B 站 TokUI**（山东向量空间 AI 实验室） — 全行业 UI 演示
- **element-ui** — 展示站组织方式（左导航 + 主区）
- **白泽 chat transcript schema** — DSL 类型设计

## 许可证

MIT © 2026 Tim Ywel
