/**
 * i18n 抽象 — 极简 i18n hook
 *
 * Why: baize-ui-dsl 框架无关, 不强制依赖 i18next / react-i18next.
 *      消费方可以:
 *      1. 直接传 i18nKey + fallback (最简)
 *      2. 通过 TFunction 注入实现 (推荐, 完整 i18n)
 *      3. 完全不传 (用原始字符串)
 */

import { createContext, useContext, type ReactNode } from "react";

export type TFunction = (key: string, fallback?: string) => string;

export interface I18nContextValue {
  readonly t: TFunction;
  readonly locale: string;
}

const defaultContext: I18nContextValue = {
  t: (key: string, fallback?: string) => fallback ?? key,
  locale: "zh-CN",
};

export const I18nContext = createContext<I18nContextValue>(defaultContext);

export interface I18nProviderProps {
  readonly t?: TFunction;
  readonly locale?: string;
  readonly children: ReactNode;
}

export function I18nProvider({
  t,
  locale = "zh-CN",
  children,
}: I18nProviderProps) {
  const value: I18nContextValue = {
    t: t ?? defaultContext.t,
    locale,
  };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}

/**
 * useT hook — 便捷 t() 访问
 */
export function useT(): TFunction {
  return useContext(I18nContext).t;
}
