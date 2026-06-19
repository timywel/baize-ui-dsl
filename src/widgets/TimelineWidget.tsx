/**
 * TimelineWidget — 时间线 (竖向) — TokUI 风格
 */

import { memo } from "react";
import type { TimelineBlock, TimelineEvent, ProgressStatus } from "../types/dsl.js";
import { useT } from "../i18n/I18nProvider.js";
import { defaultDictZh } from "../i18n/default-dict.js";

export interface TimelineWidgetProps {
  readonly dsl: TimelineBlock;
}

const dotColorMap: Record<
  ProgressStatus,
  { readonly dot: string; readonly ring: string; readonly pulse: boolean }
> = {
  pending: {
    dot: "bg-gray-300 dark:bg-gray-600",
    ring: "ring-gray-200 dark:ring-gray-800",
    pulse: false,
  },
  in_progress: {
    dot: "bg-blue-500",
    ring: "ring-blue-200 dark:ring-blue-900",
    pulse: true,
  },
  completed: {
    dot: "bg-emerald-500",
    ring: "ring-emerald-200 dark:ring-emerald-900",
    pulse: false,
  },
  failed: {
    dot: "bg-red-500",
    ring: "ring-red-200 dark:ring-red-900",
    pulse: false,
  },
  cancelled: {
    dot: "bg-amber-500",
    ring: "ring-amber-200 dark:ring-amber-900",
    pulse: false,
  },
};

const statusBadgeClass: Record<ProgressStatus, string> = {
  pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  failed: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  cancelled: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

function TimelineNode({
  event,
  isLast,
}: {
  readonly event: TimelineEvent;
  readonly isLast: boolean;
}) {
  const t = useT();
  const status: ProgressStatus = event.status ?? "pending";
  const dotStyle = dotColorMap[status];
  const statusLabel = t(
    `status.${status}`,
    defaultDictZh.status[status],
  );

  return (
    <div className="flex gap-4 relative">
      {/* 节点圆 + 连接线 */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 16 }}>
        <div
          className={`relative w-3 h-3 rounded-full ring-4 ${dotStyle.dot} ${dotStyle.ring} ${
            dotStyle.pulse ? "animate-pulse" : ""
          }`}
        >
          {status === "completed" && (
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 12 12"
              aria-hidden="true"
            >
              <path
                d="M3 6 L5 8 L9 4"
                stroke="white"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        {!isLast && (
          <div
            className="w-px flex-1 mt-1"
            style={{ background: "var(--baize-border-subtle, #f3f4f6)" }}
          />
        )}
      </div>

      {/* 内容 */}
      <div className={`flex-1 min-w-0 ${isLast ? "pb-0" : "pb-5"}`}>
        <div className="flex items-baseline gap-2 flex-wrap">
          <h4
            className="text-[14px] font-medium leading-tight"
            style={{ color: "var(--baize-text-primary, #111827)" }}
          >
            {event.title}
          </h4>
          {statusLabel && (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded ${statusBadgeClass[status]}`}
            >
              {statusLabel}
            </span>
          )}
          {event.date && (
            <span
              className="text-xs tabular-nums"
              style={{ color: "var(--baize-text-muted, #9ca3af)" }}
            >
              {event.date}
            </span>
          )}
        </div>
        {event.description && (
          <p
            className="text-[13px] mt-1 leading-relaxed"
            style={{ color: "var(--baize-text-secondary, #6b7280)" }}
          >
            {event.description}
          </p>
        )}
        {event.meta && (
          <p
            className="text-[11px] mt-0.5"
            style={{ color: "var(--baize-text-muted, #9ca3af)" }}
          >
            {event.meta}
          </p>
        )}
      </div>
    </div>
  );
}

function TimelineWidgetImpl({ dsl }: TimelineWidgetProps) {
  return (
    <figure className="my-4 px-1" role="group" aria-label={dsl.caption ?? "时间线"}>
      <div className="flex flex-col">
        {dsl.events.map((event, i) => (
          <TimelineNode
            key={`${event.title}-${i}`}
            event={event}
            isLast={i === dsl.events.length - 1}
          />
        ))}
      </div>
      {dsl.caption && (
        <figcaption
          className="text-[11px] mt-2 px-1"
          style={{ color: "var(--baize-text-muted, #9ca3af)" }}
        >
          {dsl.caption}
        </figcaption>
      )}
    </figure>
  );
}

export const TimelineWidget = memo(TimelineWidgetImpl);
TimelineWidget.displayName = "TimelineWidget";
