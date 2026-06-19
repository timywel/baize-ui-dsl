/**
 * ThemeProvider — 主题上下文 Provider
 *
 * Why: 让 widget 能感知当前主题 (light / dark / auto),
 *      后续可扩展为 brand color / 自定义 token 覆盖.
 */

import { createContext, useContext, type ReactNode } from "react";
import type { ThemeMode } from "./tokens.js";

export interface ThemeContextValue {
  readonly mode: ThemeMode;
  readonly resolvedMode: "light" | "dark";
  readonly setMode: (mode: ThemeMode) => void;
}

const defaultContext: ThemeContextValue = {
  mode: "auto",
  resolvedMode: "light",
  setMode: () => {
    /* noop default */
  },
};

export const ThemeContext = createContext<ThemeContextValue>(defaultContext);

export interface ThemeProviderProps {
  readonly mode?: ThemeMode;
  readonly children: ReactNode;
}

export function ThemeProvider({
  mode = "auto",
  children,
}: ThemeProviderProps) {
  // MVP 简化: 不实现 system preference detection, 直接用 mode
  const resolvedMode: "light" | "dark" =
    mode === "dark" ? "dark" : mode === "light" ? "light" : "light";

  const value: ThemeContextValue = {
    mode,
    resolvedMode,
    setMode: () => {
      /* MVP noop */
    },
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
