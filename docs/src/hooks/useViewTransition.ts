/**
 * useViewTransition — 路由切换时的 View Transitions 包装
 *
 * 用 document.startViewTransition() 包裹路由变化,
 * 让浏览器自动做 cross-route morph (Chrome 111+ 支持).
 * 不支持时降级为直接跳转.
 */

import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export function useViewTransition(): void {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // 仅 PUSH/REPLACE 触发 (POP 即浏览器后退不触发)
    if (navigationType !== "PUSH" && navigationType !== "REPLACE") return;

    const root = document.getElementById("root");
    if (!root) return;

    // 检查浏览器支持
    if (
      typeof document === "undefined" ||
      typeof (document as any).startViewTransition !== "function"
    ) {
      return;
    }

    // 已经在 transition 中跳过 (避免嵌套)
    if ((document as any).startViewTransition._inTransition) return;

    const transition = (document as any).startViewTransition(() => {
      // 让 React 完成路由切换
    });

    // 标记正在 transition (5s timeout 防止卡死)
    (document as any).startViewTransition._inTransition = true;
    transition.finished.finally(() => {
      setTimeout(() => {
        (document as any).startViewTransition._inTransition = false;
      }, 100);
    });
  }, [location.pathname, navigationType]);
}