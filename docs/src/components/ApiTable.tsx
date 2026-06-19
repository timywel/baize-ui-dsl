/**
 * ApiTable — 组件 API 文档表格 (element-plus / antd 风格)
 *
 * 列: Name | Description | Type | Default | Required
 */

import type { ReactNode } from "react";

export interface ApiField {
  readonly name: string;
  readonly description: string;
  readonly type: string;
  readonly defaultValue?: string;
  readonly required?: boolean;
}

export interface ApiTableProps {
  readonly title?: string;
  readonly fields: ReadonlyArray<ApiField>;
}

function renderType(type: string): ReactNode {
  // 处理 | 分割的类型
  if (type.includes("|")) {
    return (
      <span className="text-[12px] font-mono">
        {type.split("|").map((t, i) => (
          <span key={`t-${i}`}>
            <code
              className="px-1 rounded"
              style={{
                background: "var(--color-brand-subtle)",
                color: "var(--color-text-primary)",
              }}
            >
              {t.trim()}
            </code>
            {i < type.split("|").length - 1 && <span> | </span>}
          </span>
        ))}
      </span>
    );
  }
  return (
    <code
      className="px-1.5 py-0.5 rounded text-[12px] font-mono"
      style={{
        background: "var(--color-brand-subtle)",
        color: "var(--color-text-primary)",
      }}
    >
      {type}
    </code>
  );
}

export default function ApiTable({ title, fields }: ApiTableProps) {
  return (
    <div className="my-5">
      {title && (
        <h3
          className="text-base font-semibold mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          {title}
        </h3>
      )}
      <div
        className="rounded-xl border overflow-x-auto"
        style={{
          background: "var(--color-bg-card, #fff)",
          borderColor: "var(--color-border, #e5e7eb)",
        }}
      >
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ background: "var(--color-bg-secondary, #f8f9fa)" }}>
              <th
                className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider"
                style={{
                  color: "var(--color-text-muted, #9ca3af)",
                  width: 180,
                }}
              >
                Name
              </th>
              <th
                className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--color-text-muted, #9ca3af)" }}
              >
                Description
              </th>
              <th
                className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider"
                style={{
                  color: "var(--color-text-muted, #9ca3af)",
                  width: 220,
                }}
              >
                Type
              </th>
              <th
                className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider"
                style={{
                  color: "var(--color-text-muted, #9ca3af)",
                  width: 100,
                }}
              >
                Default
              </th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, i) => (
              <tr
                key={`${field.name}-${i}`}
                style={{
                  borderTop: "1px solid var(--color-border, #e5e7eb)",
                }}
              >
                <td className="px-4 py-3 align-top">
                  <code
                    className="text-[12px] font-mono font-medium"
                    style={{ color: "var(--color-text-primary, #111827)" }}
                  >
                    {field.name}
                    {field.required && (
                      <span
                        className="ml-1"
                        style={{ color: "var(--color-danger, #dc2626)" }}
                        title="必填"
                      >
                        *
                      </span>
                    )}
                  </code>
                </td>
                <td
                  className="px-4 py-3 align-top text-[13px]"
                  style={{ color: "var(--color-text-secondary, #6b7280)" }}
                >
                  {field.description}
                </td>
                <td className="px-4 py-3 align-top">
                  {renderType(field.type)}
                </td>
                <td
                  className="px-4 py-3 align-top text-[12px] font-mono"
                  style={{ color: "var(--color-text-muted, #9ca3af)" }}
                >
                  {field.defaultValue ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
