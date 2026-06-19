/**
 * Theme tokens — 设计 token 集中管理
 *
 * Why: 8 widget 共享一套颜色 / 间距 / 字号, 改一处全部生效.
 *      暗色/浅色主题通过 CSS variable 自动适配, widget 内只用 var(--xxx).
 */

export const themeTokens = {
  color: {
    // Surface
    bgPrimary: "var(--baize-bg-primary, #ffffff)",
    bgSecondary: "var(--baize-bg-secondary, #f8f9fa)",
    bgCard: "var(--baize-bg-card, #ffffff)",

    // Border
    borderPrimary: "var(--baize-border-primary, #e5e7eb)",
    borderSubtle: "var(--baize-border-subtle, #f0f1f3)",

    // Text
    textPrimary: "var(--baize-text-primary, #111827)",
    textSecondary: "var(--baize-text-secondary, #6b7280)",
    textMuted: "var(--baize-text-muted, #9ca3af)",
    textInverse: "var(--baize-text-inverse, #ffffff)",

    // Brand
    brand: "var(--baize-brand, #2563eb)",
    brandSubtle: "var(--baize-brand-subtle, #dbeafe)",

    // Status
    success: "var(--baize-success, #10b981)",
    warning: "var(--baize-warning, #f59e0b)",
    danger: "var(--baize-danger, #ef4444)",
    info: "var(--baize-info, #3b82f6)",

    // Chart palette (8 系列, 自动循环)
    chartPalette: [
      "var(--baize-chart-1, #2563eb)",
      "var(--baize-chart-2, #10b981)",
      "var(--baize-chart-3, #f59e0b)",
      "var(--baize-chart-4, #ef4444)",
      "var(--baize-chart-5, #8b5cf6)",
      "var(--baize-chart-6, #ec4899)",
      "var(--baize-chart-7, #06b6d4)",
      "var(--baize-chart-8, #84cc16)",
    ] as const,
  },

  radius: {
    sm: "var(--baize-radius-sm, 0.25rem)",
    md: "var(--baize-radius-md, 0.5rem)",
    lg: "var(--baize-radius-lg, 0.75rem)",
    full: "var(--baize-radius-full, 9999px)",
  },

  spacing: {
    xs: "var(--baize-spacing-xs, 0.25rem)",
    sm: "var(--baize-spacing-sm, 0.5rem)",
    md: "var(--baize-spacing-md, 1rem)",
    lg: "var(--baize-spacing-lg, 1.5rem)",
    xl: "var(--baize-spacing-xl, 2rem)",
  },

  font: {
    sans: "var(--baize-font-sans, system-ui, -apple-system, sans-serif)",
    mono: "var(--baize-font-mono, ui-monospace, monospace)",
    sizeXs: "var(--baize-font-size-xs, 0.75rem)",
    sizeSm: "var(--baize-font-size-sm, 0.875rem)",
    sizeBase: "var(--baize-font-size-base, 1rem)",
    sizeLg: "var(--baize-font-size-lg, 1.125rem)",
    sizeXl: "var(--baize-font-size-xl, 1.25rem)",
    size2xl: "var(--baize-font-size-2xl, 1.5rem)",
    size3xl: "var(--baize-font-size-3xl, 1.875rem)",
  },
} as const;

export type ThemeMode = "light" | "dark" | "auto";

/**
 * 暗色主题 CSS variable 覆盖
 *
 * Usage: 在根节点加 [data-theme="dark"] 属性, CSS variable 自动切换.
 */
export const darkThemeOverrides = `
[data-theme="dark"], .dark, .dark-mode {
  --baize-bg-primary: #0a0a0a;
  --baize-bg-secondary: #171717;
  --baize-bg-card: #1f1f1f;

  --baize-border-primary: #2a2a2a;
  --baize-border-subtle: #1f1f1f;

  --baize-text-primary: #f5f5f5;
  --baize-text-secondary: #a3a3a3;
  --baize-text-muted: #737373;
  --baize-text-inverse: #0a0a0a;

  --baize-brand-subtle: #1e3a8a;
}
` as const;
