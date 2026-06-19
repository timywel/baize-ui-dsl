# @timywel/baize-ui-dsl

> **白泽协议原生 UI DSL** — Agent 后端 emit 结构化 UI，前端按 schema 流式渲染

[![npm version](https://img.shields.io/npm/v/@timywel/baize-ui-dsl.svg)](https://www.npmjs.com/package/@timywel/baize-ui-dsl)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English README](./README.md) | 中文文档

## 📸 预览

**展示站风格对标 [element-plus.org](https://element-plus.org/) + [vant.pro](https://vant.pro/vant/)** —— 左导航 + 顶部 tab + 实时 Playground + 代码块复制。

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

### 展示站截图占位

> 📷 部署后截图将放在这里。

预期截图清单（v0.1.0 发布时）：
1. 概览页 hero 区
2. KPI 网格 + 折线图 + 饼图 综合示例
3. Playground 实时编辑
4. 暗色主题对比

---

## 这是什么？

**白泽（Baize）协议原生 UI 渲染层** — 让 LLM Agent 的输出从"Markdown 文本"升级为"真正的可交互 UI"，但**不需要 LLM 学会新 DSL**。

### 为什么做这件事？

灵感来自 [B 站 TokUI 全行业场景演示](https://www.bilibili.com/video/BV1ZajV61EUX)（山东向量空间 AI 实验室 / JBoltAI 团队）。TokUI 演示了 20+ 种 UI 类型的"AI 一句话生成"能力，但**依赖 LLM 输出 DSL**：

- LLM 训练成本高
- token 浪费（DSL 占上下文）
- 格式不稳定（LLM 幻觉）

白泽做这件事有**独特优势**：

> 白泽 Agent transcript schema（`PLAN-CHAT-ARCH-REDESIGN`）的输出方是**后端 loop.ts 直接 emit**，**LLM 不参与 DSL 输出**。

这意味着：
- ✅ 零 token 浪费（DSL 不进 LLM 上下文）
- ✅ 零格式错误（TypeScript schema 强约束）
- ✅ 零学习成本（开发者改 schema 即可）
- ✅ 天然 i18n（走白泽 i18n 体系）
- ✅ 暗色主题原生（CSS variable 切换）

### 核心差异化对比

| 维度 | TokUI / A2UI / AG-UI | **baize-ui-dsl** |
|------|----------------------|------------------|
| **DSL 来源** | LLM 输出（依赖训练） | **后端协议层直接 emit** |
| **token 成本** | DSL 本身消耗 LLM 上下文 | **零**（不经过 LLM） |
| **格式错误率** | 依赖 LLM 输出稳定性 | **零**（TypeScript schema 强约束） |
| **覆盖范围** | 通用 14+ 行业 | 白泽 Agent 输出类型 |
| **i18n** | 各自实现 | 框架无关 + 默认字典 |
| **维护方** | 商业团队 | 白泽自身 |

## 8 个 Widget（MVP）

| Widget | 适用场景 | 截图样例 |
|--------|----------|----------|
| `kpi_grid` | 数据看板、运营报表（↑↓ 趋势） | 电商 GMV 卡片 |
| `line_chart` | 折线图（单/多系列） | 近 6 日趋势 |
| `bar_chart` | 柱状图 | 区域订单分布 |
| `pie_chart` | 饼图（带引线标签） | 类目占比 |
| `table` | 结构化表格（5 种 cell type） | 团队绩效表 |
| `timeline` | 竖向时间线 | 项目计划、简历 |
| `insight` | 洞察/预警/建议块 | 数据洞察、风险预警 |
| `progress_badge` | 状态徽章 + 进度条 | 任务进度 |

更多 widget（雷达图、地图、tabs、树形）将在 v0.3.0+ 迭代。

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

### 2. 集成 react-i18next（白泽现有 i18n 体系）

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

### 3. 流式渲染（NDJSON / WebSocket 后端）

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

### 4. Zod 运行时校验

```tsx
import { validateUiBlock } from "@timywel/baize-ui-dsl";

const result = validateUiBlock(jsonFromBackend);
if (result.ok) {
  return <UiBlockRenderer dsl={result.data} />;
} else {
  console.error("Invalid DSL:", result.errors);
  return <FallbackUI />;
}
```

## 完整示例

### 电商 dashboard（KPI + 折线图 + 饼图）

```tsx
// 后端 loop.ts emit
const ecommerceDsl: UiBlockDSL[] = [
  {
    widget: "kpi_grid",
    layout: "1x4",
    items: [
      { label: "今日 GMV", value: 128560, unit: "¥", delta: { value: 5.2, direction: "up" } },
      { label: "订单量", value: 3674, delta: { value: 8.1, direction: "up" } },
      { label: "支付转化率", value: 4.2, unit: "%", delta: { value: 2.3, direction: "up" } },
      { label: "客单价", value: 334.6, unit: "¥", delta: { value: 1.2, direction: "down" } },
    ],
  },
  {
    widget: "line_chart",
    data: [{ name: "GMV", data: [96420, 102300, 110500, 108200, 124800, 128560] }],
    xAxis: [{ label: "周一" }, { label: "周二" }, { label: "周三" }, { label: "周四" }, { label: "周五" }, { label: "周六" }],
    caption: "近 6 日 GMV 趋势",
  },
  {
    widget: "pie_chart",
    data: [
      { label: "服饰", value: 45 },
      { label: "美妆", value: 28 },
      { label: "数码", value: 18 },
      { label: "家居", value: 9 },
    ],
    caption: "类目占比",
  },
];
```

### 团队绩效表

```tsx
const perfDsl: UiBlockDSL = {
  widget: "table",
  columns: [
    { key: "name", label: "成员" },
    { key: "role", label: "岗位" },
    { key: "kpi", label: "KPI 完成度", type: "progress", align: "center" },
    { key: "score", label: "评分", type: "badge", align: "center" },
    { key: "delta", label: "环比趋势", type: "delta", align: "right" },
  ],
  rows: [
    { name: "张伟", role: "前端负责人", kpi: { type: "progress", value: 98 }, score: { type: "badge", value: "S", tone: "S" }, delta: { type: "delta", value: 5.2, direction: "up" } },
    { name: "李娜", role: "高级开发", kpi: { type: "progress", value: 95 }, score: { type: "badge", value: "A", tone: "A" }, delta: { type: "delta", value: 3.8, direction: "up" } },
  ],
};
```

## 架构

```
┌─────────────────────────────────────────────┐
│  Agent 后端 (loop.ts / transcript)          │
│   emit { type: "ui_block", dsl: {...} }     │
└─────────────────────────────────────────────┘
                  ↓ NDJSON / WebSocket
┌─────────────────────────────────────────────┐
│  baize-ui-dsl (本库)                         │
│                                             │
│   types/    ← TS types + Zod schema (契约)  │
│   stream/   ← 流式解析器 (replace/patch)    │
│   renderer/ ← UiBlockRenderer 入口          │
│   widgets/  ← 8 个 widget 组件               │
│   theme/    ← 设计 token + ThemeProvider     │
│   i18n/     ← i18n 抽象 + 默认字典           │
└─────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│  消费方 (baize-loop / 第三方应用)             │
│   <UiBlockRenderer dsl={dsl} />             │
└─────────────────────────────────────────────┘
```

## 文档

- 📖 **展示站**：本地 `pnpm dev:docs`，参考 element-ui.io 风格
- 📋 **API 参考**：[docs/API.md](./docs/API.md)
- 🌐 **baize-loop 集成指南**：[integration/baize-loop-integration.md](./integration/baize-loop-integration.md)
- 📝 **设计 PLAN**：[plan/PLAN-BAIZE-UI-DSL.md](./plan/PLAN-BAIZE-UI-DSL.md)

## 开发

```bash
# 安装依赖
pnpm install

# 跑测试
pnpm test              # 一次性
pnpm test:watch        # watch 模式
pnpm test:coverage     # 覆盖率 (≥85%)

# 类型检查
pnpm lint

# 构建库
pnpm build:lib         # tsc → dist/
pnpm build             # lib + docs

# 启动展示站
pnpm dev:docs

# 格式化
pnpm format
```

## 路线图

- **v0.1.0**（当前）：8 widget MVP + 类型 + 流式解析 + 展示站 + 单测 ≥ 85%
- **v0.2.0**：交互支持（hover / click → callback，对应 AG-UI 范畴）
- **v0.3.0**：更多 widget（雷达图、地图、树形、tabs、accordion）
- **v0.4.0**：i18n 完整字典（en / zh-CN / ja / ko）
- **v1.0.0**：跨端（iOS / Android / 小程序，通过新 renderer）

## 与 baize-loop 集成

本库是 **baize-loop chat 架构重设计**（`PLAN-CHAT-ARCH-REDESIGN`）的 UI 端。

集成路径：
```
/home/timywel/AI_Product/规范/baize-ui-dsl/  (本仓库, source of truth)
          ↓ sync-from-规范.sh
/home/timywel/AI_Product/baize-loop/packages/baize-ui-dsl/  (消费方)
          ↓ pnpm install
baize-loop/frontend/  (实际使用)
```

详见 [integration/baize-loop-integration.md](./integration/baize-loop-integration.md)

## 借鉴与归属声明

本库为 **clean-room 实现**，灵感来源：

- **B 站 TokUI**（山东向量空间 AI 实验室 / JBoltAI 团队） — 全行业 UI 演示（28 张截图分析源：`baize-loop/temp/tokui/`）
- **element-ui** — 展示站组织方式（左导航 + 主区 + Playground）
- **白泽 chat transcript schema** — DSL 类型设计

所有代码均为本团队独立实现，不含借鉴项目的独特代码片段、注释、变量命名。

## 许可证

MIT © 2026 Tim Ywel
