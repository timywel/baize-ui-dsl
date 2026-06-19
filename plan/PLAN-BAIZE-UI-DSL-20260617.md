# PLAN-BAIZE-UI-DSL-20260617 — 库实施规划

> **库名**: @timywel/baize-ui-dsl
> **位置**: /home/timywel/AI_Product/规范/baize-ui-dsl/
> **版本**: v0.1.0 MVP
> **创建时间**: 2026-06-17 23:30
> **关联文档**:
> - 设计 PLAN（待审阅）: `baize-loop/plan/待审阅/PLAN-BAIZE-UI-DSL-20260617-222555.md`
> - baize-loop 集成指南: `integration/baize-loop-integration.md`
> - B 站 TokUI 截图分析源: `baize-loop/temp/tokui/`（28 张截图）

---

## ASSUMPTIONS

- **A1**：本库先**独立做**，再决定是否集成进 baize-loop（用户 2026-06-17 明确指示）
- **A2**：展示站独立 Vite + React，**与库代码解耦**（element-ui 风格）
- **A3**：MVP 限定 **8 个 widget**，不做"完美展示所有 UI"野心
- **A4**：图表全部**手写 SVG**，不引入 chart.js / d3 / recharts（白泽 CLAUDE.md scope discipline）
- **A5**：i18n 抽象框架无关，**默认字典 + TFunction 注入**
- **A6**：暗色主题通过 CSS variable + ThemeProvider 双层支持
- **A7**：与 baize-loop 的真实集成**留作后续 session**（依赖 PLAN-CHAT-ARCH-REDESIGN 子 PLAN 3 完成）
- **A8**：单测覆盖率目标 ≥85%（schema 100%、widget 渲染 ≥85%）
- **A9**：模型推荐：Claude Sonnet 4.6（性价比最高的执行主力；图表 SVG 涉及 DOM 操作，Sonnet 足够）
- **A10**：本库不依赖 baize-loop 任何代码（**绝对独立**，避免循环依赖）

---

## 仓库结构（已落地）

```
/home/timywel/AI_Product/规范/baize-ui-dsl/
├── package.json                  # @timywel/baize-ui-dsl, MIT, dual ESM/CJS export
├── tsconfig.json                 # strict + ESNext + bundler resolution
├── tsconfig.node.json            # vite/vitest config 用
├── vite.config.ts                # lib 模式 build + vitest 集成
├── .gitignore
├── LICENSE                       # MIT
├── CHANGELOG.md                  # Keep a Changelog 格式
├── README.md                     # 英文版
├── README.zh-CN.md               # 中文版（主推）
│
├── src/                          # 库源代码
│   ├── index.ts                  # 库主入口 (re-export 全部)
│   ├── types/
│   │   ├── dsl.ts                # TS 类型 (UiBlockDSL 等)
│   │   ├── schema.ts             # Zod 运行时校验 schema
│   │   └── index.ts
│   ├── theme/
│   │   ├── tokens.ts             # CSS variable tokens + 暗色覆盖
│   │   ├── ThemeProvider.tsx     # light/dark/auto context
│   │   └── index.ts
│   ├── i18n/
│   │   ├── I18nProvider.tsx      # TFunction 注入抽象
│   │   ├── default-dict.ts       # 默认字典 (zh/en)
│   │   └── index.ts
│   ├── stream/
│   │   ├── StreamParser.ts       # 流式解析 (replace + JSON Patch)
│   │   └── index.ts
│   ├── renderer/
│   │   ├── UiBlockRenderer.tsx   # 按 widget 分流入口
│   │   └── index.ts
│   └── widgets/
│       ├── utils.ts              # 共享工具 (status color, layout grid)
│       ├── KpiGridWidget.tsx
│       ├── LineChartWidget.tsx
│       ├── BarChartWidget.tsx
│       ├── PieChartWidget.tsx
│       ├── TableWidget.tsx
│       ├── TimelineWidget.tsx
│       ├── InsightBlockWidget.tsx
│       ├── ProgressBadgeWidget.tsx
│       └── index.ts
│
├── tests/                        # vitest 单测
│   ├── setup.ts                  # @testing-library/jest-dom
│   ├── types/schema.test.ts      # Zod 校验
│   ├── stream/StreamParser.test.ts
│   └── widgets/widgets.test.tsx  # React Testing Library 渲染测试
│
├── docs/                         # 展示站（element-ui 风格）
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx               # 左导航 + 主区 + 主题切换
│       ├── styles.css            # 全局 + 暗色覆盖
│       ├── widget-meta.ts        # 8 个 widget 的元信息
│       ├── widget-examples.ts    # 每个 widget 2 个示例
│       └── pages/
│           ├── OverviewPage.tsx
│           ├── WidgetPage.tsx    # 动态路由 /widgets/:type
│           ├── PlaygroundPage.tsx # JSON DSL 实时编辑
│           └── GuidePage.tsx
│
├── examples/                     # (留空, 后续加 .tsx 示例)
│
├── integration/
│   └── baize-loop-integration.md # 集成指南
│
├── plan/
│   └── PLAN-BAIZE-UI-DSL-20260617.md  # 本文档
│
└── scripts/                      # (留空, 后续加 sync 脚本)
```

**总计文件**：~40 个，**库源代码 ~1500 行**，**单测 ~400 行**，**展示站 ~600 行**

---

## 已完成任务清单

| # | Task | 状态 | 备注 |
|---|------|------|------|
| 1 | 仓库骨架 (package/tsconfig/license) | ✅ | MIT + dual export |
| 2 | DSL schema (TS + Zod) | ✅ | discriminated union + 安全校验 |
| 3 | 8 个 widget React 组件 | ✅ | 手写 SVG + 暗色主题原生 |
| 4 | 渲染器入口 + 流式解析 | ✅ | JSON Patch 简化版 |
| 5 | docs/ Vite 展示站 | ✅ | element-ui 风格 (左导航 + 主区) |
| 6 | 展示站示例 + 综合场景 | ✅ | 每个 widget 2 个示例 + 5 综合场景 |
| 7 | 单测 + README + 集成文档 | ✅ | vitest + RTL + 双语 README |
| 8 | 建库规划文档 | ✅ | 本文档 |

---

## 8 个 widget 实施详情

| Widget | TS 类型 | 组件 | 关键能力 |
|--------|---------|------|----------|
| **KpiGridWidget** | `KpiGridBlock` | `KpiGridWidget.tsx` | 4 种 layout, ↑↓ 趋势, unit, caption |
| **LineChartWidget** | `LineChartBlock` | `LineChartWidget.tsx` | 单/多系列, SVG 坐标轴 + 网格 + 节点 + 图例 |
| **BarChartWidget** | `BarChartBlock` | `BarChartWidget.tsx` | 自适应柱宽 + 数值标注 |
| **PieChartWidget** | `PieChartBlock` | `PieChartWidget.tsx` | 引线标签 + 底部图例 |
| **TableWidget** | `TableBlock` | `TableWidget.tsx` | 5 种 cell type + 行高亮 + emptyHint |
| **TimelineWidget** | `TimelineBlock` | `TimelineWidget.tsx` | 5 种 status 节点着色 + 日期 |
| **InsightBlockWidget** | `InsightBlock` | `InsightBlockWidget.tsx` | 3 种 variant (💡⚠️✅) + tag |
| **ProgressBadgeWidget** | `ProgressBadgeBlock` | `ProgressBadgeWidget.tsx` | 5 种 status + 进度条 + meta |

---

## 验证清单

### 库代码验证

- [ ] `pnpm install` 不报错
- [ ] `pnpm test` 单测全过（schema + stream + widgets）
- [ ] `pnpm test:coverage` ≥ 85%
- [ ] `pnpm lint` (tsc --noEmit) 通过
- [ ] `pnpm build:lib` 产出 dist/
- [ ] 8 个 widget 在 React 18 下无 warning

### 展示站验证

- [ ] `pnpm dev:docs` 启动 (port 5174)
- [ ] 概览页显示 6 个特性卡片 + 8 个 widget 卡片
- [ ] 8 个 widget 详情页都能打开 + 渲染示例
- [ ] Playground 页: 编辑 JSON → 实时渲染 + Zod 错误显示
- [ ] 集成指南页: 6 个示例代码块
- [ ] 主题切换 light/dark 生效
- [ ] 语言切换 zh/en 生效

### 集成验证（待后续 session）

- [ ] 在 baize-loop packages/ 软链/复制
- [ ] ChatMessageRenderer.jsx 加 case 不破坏现有 7 种 type
- [ ] i18n Provider 注入正常
- [ ] 暗色主题与白泽一致

---

## 与 baize-loop 集成时间线

```
2026-06-17 (今日)     库 v0.1.0 MVP 完成 ✅
                       ↓
[待触发]              PLAN-CHAT-ARCH-REDESIGN 子 PLAN 3 完成
                       ↓
2026-06-XX (后续)     Phase 2: 接入 baize-loop packages/
                       Phase 3: ChatMessageRenderer.jsx 加 case "ui_block"
                       Phase 4: 后端 loop.ts 真实 emit
                       Phase 5: 白泽 Agent 跑真实任务输出 UI
```

详见 [integration/baize-loop-integration.md](../integration/baize-loop-integration.md)

---

## Success Criteria

### MVP 完成（v0.1.0）

- [x] SC-1：8 个 widget 全部实现 + TS 类型 + Zod 校验
- [x] SC-2：UiBlockRenderer 按 widget 分流 + 未知 widget 容错
- [x] SC-3：流式解析器支持 replace + JSON Patch
- [x] SC-4：ThemeProvider (light/dark/auto) + I18nProvider
- [x] SC-5：单测 schema + stream + widgets
- [x] SC-6：展示站 element-ui 风格 (概览 + 8 widget 页 + Playground + 指南)
- [x] SC-7：README 双语 (英文 + 中文)
- [x] SC-8：集成文档 (与 baize-loop 流程图)

### 真实集成验证（后续 session）

- [ ] SC-9：白泽 Agent 在 SwarmPanel 真实场景输出 UI
- [ ] SC-10：与 react-markdown 路径并存，不破坏现有 chat
- [ ] SC-11：8 个 widget 在白泽暗色主题下视觉一致

---

## Boundaries

### Always

- ✅ 库代码**绝对独立**（不依赖 baize-loop / 任何项目代码）
- ✅ 图表手写 SVG（不引 chart.js / d3 / recharts）
- ✅ CSS variable 驱动主题（不用 hardcoded 颜色）
- ✅ 单测覆盖 8 widget + schema + stream
- ✅ 文档双语同步

### Ask first

- ⚠️ 修改 dsl.ts 类型（向后兼容性）
- ⚠️ 新增 widget（扩到 9+ 时）
- ⚠️ 引入第三方依赖
- ⚠️ 改变仓库位置（从 `/规范/` 移到别处）

### Never

- ❌ 依赖 baize-loop 任何代码
- ❌ hardcoded 颜色字符串
- ❌ 跨平台渲染（iOS / Android / 小程序）
- ❌ 交互（hover / click → callback，留 AG-UI 范畴）
- ❌ 删任何核心 widget

---

## Noticed but not touching

- 白泽 i18n 历史 366 个 4+ 层 key —— i18n-guideline 已说明"留待 Batch 5+ 处理"，不本任务范围
- TokUI 仓库未公开 —— 留作 backlog，本库定位**不依赖**外部
- 元素 UI 主题色调（暖色 off-white / 暖棕）—— 风格不同，本库用白泽现代蓝调，避免与 element-ui 同质化
- A2UI / AG-UI 后续协议 —— 本库**协议中立**，未来可对接
- Storybook 风格 —— 本库用 element-ui 风格自研展示站，避免引入大型依赖

→ 不需要创建后续任务；本 PLAN 是独立闭环

---

## 文档版本

| 版本 | 时间 | 作者 | 变更 |
|------|------|------|------|
| 1.0 | 2026-06-17 23:30 | BaiZe 架构 | 初版,8 widget MVP 完成 |
