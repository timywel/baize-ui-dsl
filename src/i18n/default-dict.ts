/**
 * i18n 默认字典 (中文 / 英文)
 *
 * Why: 让 widget 标签 / 状态徽章有意义的 fallback.
 *      消费方可注入自己的 i18n 系统 (react-i18next / next-intl 等).
 */

export const defaultDictZh = {
  status: {
    pending: "待开始",
    in_progress: "进行中",
    completed: "已完成",
    failed: "失败",
    cancelled: "已取消",
  },
  insight: {
    insightTitle: "核心洞察",
    warningTitle: "风险预警",
    successTitle: "优化建议",
  },
  delta: {
    up: "上升",
    down: "下降",
    flat: "持平",
  },
  common: {
    dataSource: "数据来源",
    updateTime: "数据更新时间",
    noData: "暂无数据",
    loading: "加载中…",
    errorTitle: "渲染失败",
    errorFallback: "该 UI 块无法显示，请稍后重试",
  },
} as const;

export const defaultDictEn = {
  status: {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
    failed: "Failed",
    cancelled: "Cancelled",
  },
  insight: {
    insightTitle: "Key Insight",
    warningTitle: "Risk Warning",
    successTitle: "Suggestion",
  },
  delta: {
    up: "Up",
    down: "Down",
    flat: "Flat",
  },
  common: {
    dataSource: "Data Source",
    updateTime: "Last Updated",
    noData: "No Data",
    loading: "Loading…",
    errorTitle: "Render Failed",
    errorFallback: "This UI block could not be displayed",
  },
} as const;

export type Dict = typeof defaultDictZh;
