/**
 * StreamParser — 流式 DSL 解析器
 *
 * 协议层 (后端 loop.ts) 通过 NDJSON / SSE 输出 ui_block 时, 可能是:
 * 1. 完整 dsl 一次性 emit
 * 2. 增量 emit (replace / patch)
 *
 * 本解析器抽象两种模式, 渲染器订阅 patch 流即可.
 */

import { validateUiBlock } from "../types/schema.js";
import type {
  UiBlockDSL,
  UiBlockPatch,
  WidgetType,
} from "../types/dsl.js";

export interface StreamState {
  /** 当前最新的完整 dsl (任意时刻可重渲染) */
  readonly current: UiBlockDSL | null;
  /** 已接收的 patch 计数 (调试用) */
  readonly patchCount: number;
  /** 第一个错误 (后续 patch 继续处理, 不中断) */
  readonly firstError: string | null;
}

/**
 * 流式解析器 (不可变, 每次 patch 返回新 state)
 */
export class UiBlockStreamParser {
  private current: UiBlockDSL | null = null;
  private patchCount = 0;
  private firstError: string | null = null;

  /**
   * 接收一个 patch, 返回新 state (不变)
   */
  apply(patch: UiBlockPatch): StreamState {
    this.patchCount += 1;

    if (patch.op === "replace") {
      const validation = validateUiBlock(patch.dsl);
      if (!validation.ok) {
        this.recordError(validation.errors);
        return this.snapshot();
      }
      this.current = validation.data as UiBlockDSL;
      return this.snapshot();
    }

    // patch.op === "patch" (delta update)
    if (!this.current) {
      this.recordError(["cannot patch: no current state"]);
      return this.snapshot();
    }
    if (this.current.widget !== patch.widget) {
      this.recordError([
        `patch widget mismatch: current=${this.current.widget} patch=${patch.widget}`,
      ]);
      return this.snapshot();
    }

    try {
      const next = applyPatches(this.current, patch.patches);
      const validation = validateUiBlock(next);
      if (!validation.ok) {
        this.recordError(validation.errors);
        return this.snapshot();
      }
      this.current = validation.data as UiBlockDSL;
    } catch (err) {
      this.recordError([err instanceof Error ? err.message : String(err)]);
    }
    return this.snapshot();
  }

  /**
   * 直接重置 (用于组件 unmount / chatId 切换)
   */
  reset(): StreamState {
    this.current = null;
    this.patchCount = 0;
    this.firstError = null;
    return this.snapshot();
  }

  getState(): StreamState {
    return this.snapshot();
  }

  private snapshot(): StreamState {
    return {
      current: this.current,
      patchCount: this.patchCount,
      firstError: this.firstError,
    };
  }

  private recordError(errors: ReadonlyArray<string>) {
    if (this.firstError === null && errors.length > 0) {
      this.firstError = errors[0] ?? "unknown error";
    }
  }
}

/**
 * JSON Patch 简化版 — 支持点路径 (e.g. "data.0.value" / "items.1.label")
 *
 * Why: 不引入 fast-json-patch 依赖 (MVP 不需要复杂 RFC 6902),
 *      自实现只覆盖 widget 实际场景.
 */
function applyPatches(
  source: UiBlockDSL,
  patches: ReadonlyArray<{ path: string; value: unknown }>,
): UiBlockDSL {
  // 深拷贝 (structuredClone 在 Node 18+ / 现代浏览器可用)
  const next = structuredClone(source) as UiBlockDSL;
  for (const { path, value } of patches) {
    setByPath(next, path, value);
  }
  return next;
}

function setByPath(target: unknown, path: string, value: unknown): void {
  const segments = path.split(".");
  if (segments.length === 0) return;

  let current: any = target;
  for (let i = 0; i < segments.length - 1; i += 1) {
    const segment = segments[i];
    if (segment === undefined) return;
    const key = /^\d+$/.test(segment) ? Number(segment) : segment;
    if (current == null || typeof current !== "object") return;
    current = current[key];
  }

  const lastSegment = segments[segments.length - 1];
  if (lastSegment === undefined || current == null) return;
  const lastKey = /^\d+$/.test(lastSegment) ? Number(lastSegment) : lastSegment;
  if (typeof current !== "object") return;
  (current as Record<string | number, unknown>)[lastKey] = value;
}

// ─────────────────────────────────────────────────────────────────
//  React Hook 封装
// ─────────────────────────────────────────────────────────────────

import { useMemo, useRef, useSyncExternalStore } from "react";

export interface UseStreamParserResult {
  readonly state: StreamState;
  readonly apply: (patch: UiBlockPatch) => void;
  readonly reset: () => void;
}

/**
 * useUiBlockStream — React 订阅流式解析器
 *
 * Usage:
 *   const { state, apply, reset } = useUiBlockStream();
 *   useEffect(() => ws.subscribe((patch) => apply(patch)), []);
 *   return <UiBlockRenderer dsl={state.current} />;
 */
export function useUiBlockStream(): UseStreamParserResult {
  const parserRef = useRef<UiBlockStreamParser | null>(null);
  if (parserRef.current === null) {
    parserRef.current = new UiBlockStreamParser();
  }
  const parser = parserRef.current;

  const state = useSyncExternalStore(
    (onChange) => {
      // MVP: 每次 apply 后同步通知, 真实场景用 microtask 批量
      const unsubscribe = subscribeNotify(parser, onChange);
      return unsubscribe;
    },
    () => parser.getState(),
    () => parser.getState(),
  );

  return useMemo(
    () => ({
      state,
      apply: (patch) => parser.apply(patch),
      reset: () => parser.reset(),
    }),
    [parser, state],
  );
}

/**
 * 简单的订阅机制 — 每次 apply 后通知所有订阅者
 */
function subscribeNotify(
  parser: UiBlockStreamParser,
  onChange: () => void,
): () => void {
  // 给 parser 实例添加 listener 列表 (MVP 简化实现)
  const listeners = (parser as unknown as { _listeners?: Set<() => void> })
    ._listeners ??= new Set();
  listeners.add(onChange);
  // 钩进 apply 方法 — 通过重写 wrap
  const originalApply = parser.apply.bind(parser);
  parser.apply = (patch) => {
    const result = originalApply(patch);
    queueMicrotask(() => {
      for (const listener of listeners) listener();
    });
    return result;
  };
  return () => {
    listeners.delete(onChange);
  };
}

// ─────────────────────────────────────────────────────────────────
//  工厂函数: 完整 dsl 直接喂给渲染器
// ─────────────────────────────────────────────────────────────────

/**
 * createInitialParser — 从完整 dsl 初始化解析器
 */
export function createInitialParser(initial: UiBlockDSL): UiBlockStreamParser {
  const parser = new UiBlockStreamParser();
  parser.apply({ op: "replace", dsl: initial });
  return parser;
}

/**
 * 类型守卫: 是否是合法的 patch op
 */
export function isWidgetOfType<T extends WidgetType>(
  dsl: UiBlockDSL,
  widget: T,
): dsl is Extract<UiBlockDSL, { widget: T }> {
  return dsl.widget === widget;
}
