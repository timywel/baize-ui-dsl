/**
 * Widget 示例数据 — 每个 widget 2 个示例 (基础 + 高级)
 *
 * 参考源: temp/tokui/ B 站 TokUI 28 张截图分析
 */

import type { UiBlockDSL } from "@timywel/baize-ui-dsl";

export interface WidgetExample {
  readonly title: string;
  readonly description?: string;
  readonly dsl: UiBlockDSL;
}

export const widgetExamples: Record<string, ReadonlyArray<WidgetExample>> = {
  kpi_grid: [
    {
      title: "基础: 4 个 KPI 卡片",
      description: "电商 dashboard 核心指标, 带 ↑↓ 趋势和单位",
      dsl: {
        widget: "kpi_grid",
        layout: "1x4",
        items: [
          { label: "今日 GMV", value: 128560, unit: "¥", delta: { value: 5.2, direction: "up" } },
          { label: "订单量", value: 3674, delta: { value: 8.1, direction: "up" } },
          { label: "支付转化率", value: 4.2, unit: "%", delta: { value: 2.3, direction: "up" } },
          { label: "客单价", value: 334.6, unit: "¥", delta: { value: 1.2, direction: "down" } },
        ],
        caption: "数据更新时间: 2026-06-17 10:00:00 | 数据来源: 交易中台",
      },
    },
    {
      title: "高级: 2x2 布局 + caption",
      description: "运营核心指标, 含多个 KPI 分组",
      dsl: {
        widget: "kpi_grid",
        layout: "2x2",
        items: [
          { label: "DAU", value: 125000, delta: { value: 12.5, direction: "up" }, caption: "日活跃用户" },
          { label: "MAU", value: 1200000, delta: { value: 5.2, direction: "up" }, caption: "月活跃用户" },
          { label: "留存率", value: 68.5, unit: "%", delta: { value: 3.1, direction: "up" } },
          { label: "ARPU", value: 28.5, unit: "¥", delta: { value: 1.5, direction: "down" } },
        ],
      },
    },
  ],

  line_chart: [
    {
      title: "基础: 单系列趋势",
      dsl: {
        widget: "line_chart",
        data: [{ name: "GMV", data: [96420, 102300, 110500, 108200, 124800, 128560] }],
        xAxis: [
          { label: "周一" }, { label: "周二" }, { label: "周三" },
          { label: "周四" }, { label: "周五" }, { label: "周六" },
        ],
        caption: "近 6 日 GMV 趋势 (元)",
      },
    },
    {
      title: "高级: 多系列对比 + 数据洞察",
      dsl: {
        widget: "line_chart",
        data: [
          { name: "本月", data: [36.1, 42.3, 45.1, 48.1] },
          { name: "上月", data: [32.5, 38.8, 42.0, 45.8] },
        ],
        xAxis: [
          { label: "9 月上" }, { label: "9 月下" },
          { label: "10 月上" }, { label: "10 月下" },
        ],
        caption: "GMV 半月趋势对比 (万元)",
      },
    },
  ],

  bar_chart: [
    {
      title: "基础: 区域订单分布",
      dsl: {
        widget: "bar_chart",
        data: { name: "订单量", data: [3200, 2800, 2400, 2000, 1700] },
        xAxis: [
          { label: "华东" }, { label: "华南" }, { label: "华北" },
          { label: "西南" }, { label: "其他" },
        ],
        caption: "区域订单分布",
      },
    },
    {
      title: "高级: 带数据洞察建议",
      dsl: {
        widget: "bar_chart",
        data: { name: "GMV", data: [120, 95, 60, 35, 10] },
        xAxis: [
          { label: "服饰" }, { label: "美妆" }, { label: "数码" },
          { label: "家居" }, { label: "其他" },
        ],
      },
    },
  ],

  pie_chart: [
    {
      title: "基础: 类目占比",
      dsl: {
        widget: "pie_chart",
        data: [
          { label: "服饰", value: 45 },
          { label: "美妆", value: 28 },
          { label: "数码", value: 18 },
          { label: "家居", value: 9 },
        ],
        caption: "类目占比 (%)",
      },
    },
    {
      title: "高级: 不显示图例 (节省空间)",
      dsl: {
        widget: "pie_chart",
        data: [
          { label: "APP", value: 65 },
          { label: "小程序", value: 25 },
          { label: "H5", value: 10 },
        ],
        showLegend: false,
      },
    },
  ],

  table: [
    {
      title: "基础: 文本表格",
      dsl: {
        widget: "table",
        columns: [
          { key: "name", label: "姓名" },
          { key: "age", label: "年龄", type: "number", align: "right" },
          { key: "city", label: "城市" },
        ],
        rows: [
          { name: "李明", age: 28, city: "杭州" },
          { name: "陈默", age: 29, city: "上海" },
          { name: "王磊", age: 32, city: "北京" },
        ],
      },
    },
    {
      title: "高级: badge + progress + delta cell",
      description: "团队绩效汇总表, 5 种 cell type 综合",
      dsl: {
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
          { name: "王磊", role: "中级开发", kpi: { type: "progress", value: 88 }, score: { type: "badge", value: "B", tone: "B" }, delta: { type: "delta", value: 1.2, direction: "down" } },
          { name: "陈静", role: "UI 设计师", kpi: { type: "progress", value: 92 }, score: { type: "badge", value: "A", tone: "A" }, delta: { type: "delta", value: 4.5, direction: "up" } },
          { name: "赵阳", role: "测试工程师", kpi: { type: "progress", value: 85 }, score: { type: "badge", value: "B", tone: "B" }, delta: { type: "delta", value: 2.8, direction: "down" } },
        ],
        highlightRow: 0,
        caption: "Q3 团队绩效汇总",
      },
    },
  ],

  timeline: [
    {
      title: "基础: 项目计划时间线",
      dsl: {
        widget: "timeline",
        events: [
          { title: "需求评审通过", date: "10-20", status: "completed" },
          { title: "研发冲刺阶段", date: "10-21 ~ 10-25", status: "in_progress" },
          { title: "质量保障阶段", date: "10-26 ~ 10-28", status: "pending" },
          { title: "UAT 验收", date: "10-29", status: "pending" },
          { title: "正式发布", date: "11-01", status: "pending" },
        ],
        caption: "新功能上线执行计划",
      },
    },
    {
      title: "高级: 简历时间线",
      dsl: {
        widget: "timeline",
        events: [
          { title: "浙江大学 · 计算机科学与技术", date: "2016-2019", status: "completed", description: "GPA 3.8/4.0 | 校级优秀毕业生" },
          { title: "字节跳动 · 抖音电商前端团队", date: "2021.07 ~ 至今", status: "in_progress", description: "负责商家工作台核心模块, 主导微前端架构升级, 页面加载提速 40%" },
          { title: "蚂蚁集团 · 体验技术部", date: "2019.07 ~ 2021.06", status: "completed", description: "参与 Ant Design 组件库维护, 贡献 PR 50+, 负责内部低代码平台搭建" },
        ],
        caption: "陈默 - 高级前端工程师",
      },
    },
  ],

  insight: [
    {
      title: "基础: 核心洞察",
      dsl: {
        widget: "insight",
        variant: "insight",
        title: "核心发现",
        body: "10 月 GMV 环比增长 12.3%, 主要由服饰类目大促驱动: 小程序渠道新客转化率高出 APP 22%, 但客单价低 18%; 高价值客户贡献 38% GMV, 复购率达 68%, 是稳定基本盘.",
        tag: "核心洞察",
      },
    },
    {
      title: "高级: 风险预警 + 优化建议 + 发版公告",
      dsl: {
        widget: "insight",
        variant: "warning",
        title: "异常风险",
        body: "整体支付链路成功率下滑, 在 19:30 出现 4 次连续失败, 持续 3 分钟, 涉及客户约 150 人, 已自动触发告警并通知值班同学.",
        tag: "风控告警",
      },
    },
    {
      title: "优化建议",
      dsl: {
        widget: "insight",
        variant: "success",
        title: "优化建议",
        body: "优化商品组合策略, 提升关联推荐单位: ①小程序增加满减门槛引导凑单; ②西南仓扩容并更换备货品类; ③沉睡客户改企微+1v1触达+专属优惠券测试效果.",
        tag: "运营建议",
      },
    },
  ],

  progress_badge: [
    {
      title: "基础: 任务进度",
      dsl: {
        widget: "progress_badge",
        status: "in_progress",
        value: 60,
        label: "首页改版",
        meta: "前端张伟 · 预计 2026-06-25 完成",
      },
    },
    {
      title: "高级: 多种状态对比",
      dsl: {
        widget: "progress_badge",
        status: "completed",
        value: 100,
        label: "支付链路重构",
        meta: "已上线 · 历时 5 天",
      },
    },
  ],
};
