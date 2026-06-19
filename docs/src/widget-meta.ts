/**
 * Widget 元信息 — 展示站导航 + 示例用
 */

export interface WidgetMeta {
  readonly type: string;
  readonly name: string;
  readonly icon: string;
  readonly category: "数据展示" | "数据可视化" | "结构组织" | "反馈与状态";
  readonly description: string;
  readonly scenarios: ReadonlyArray<string>;
}

export const WIDGET_META: ReadonlyArray<WidgetMeta> = [
  {
    type: "kpi_grid",
    name: "KPI 网格",
    icon: "📊",
    category: "数据展示",
    description: "数据看板、运营报表、电商 dashboard。带 ↑↓ 趋势、单位、caption。",
    scenarios: ["电商 GMV 看板", "运营核心指标", "团队 KPI 汇总"],
  },
  {
    type: "line_chart",
    name: "折线图",
    icon: "📈",
    category: "数据可视化",
    description: "单/多系列折线图，SVG 手写。带坐标轴、网格、节点、图例。",
    scenarios: ["GMV 趋势", "用户增长曲线", "环比对比"],
  },
  {
    type: "bar_chart",
    name: "柱状图",
    icon: "📊",
    category: "数据可视化",
    description: "单系列柱状图。Y 轴刻度自适应, 数值标注可选。",
    scenarios: ["区域订单分布", "类目销量对比", "任务优先级分布"],
  },
  {
    type: "pie_chart",
    name: "饼图",
    icon: "🥧",
    category: "数据可视化",
    description: "饼图带引线标签 + 底部图例。数值百分比自动计算。",
    scenarios: ["类目占比", "用户来源分布", "风险构成"],
  },
  {
    type: "table",
    name: "表格",
    icon: "📋",
    category: "结构组织",
    description: "结构化表格,5 种 cell type: text / number / badge / progress / delta。支持行高亮。",
    scenarios: ["团队绩效表", "对比表", "检验报告"],
  },
  {
    type: "timeline",
    name: "时间线",
    icon: "📅",
    category: "结构组织",
    description: "竖向时间线。节点带状态着色 (completed/in_progress/pending/failed/cancelled)。",
    scenarios: ["项目计划", "简历时间线", "版本发布历史"],
  },
  {
    type: "insight",
    name: "洞察块",
    icon: "💡",
    category: "反馈与状态",
    description: "数据洞察 / 风险预警 / 优化建议 3 种 variant。带 emoji 图标 + 配色。",
    scenarios: ["关键洞察", "风险预警", "优化建议", "发版公告"],
  },
  {
    type: "progress_badge",
    name: "进度徽章",
    icon: "🏷️",
    category: "反馈与状态",
    description: "状态徽章 + 进度条 + label + meta。5 种 status 配色。",
    scenarios: ["任务进度", "流程节点", "功能上线状态"],
  },
];

export const WIDGET_CATEGORIES: ReadonlyArray<{
  readonly key: WidgetMeta["category"];
  readonly label: string;
  readonly icon: string;
}> = [
  { key: "数据展示", label: "数据展示", icon: "📊" },
  { key: "数据可视化", label: "数据可视化", icon: "📈" },
  { key: "结构组织", label: "结构组织", icon: "🗂️" },
  { key: "反馈与状态", label: "反馈与状态", icon: "💬" },
];
