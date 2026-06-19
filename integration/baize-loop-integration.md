# baize-ui-dsl ↔ baize-loop 集成指南

> 本文档描述如何把 `/home/timywel/AI_Product/规范/baize-ui-dsl/` 集成进 `/home/timywel/AI_Product/baize-loop/`。

## 集成路径

```
source of truth (规范库):  /home/timywel/AI_Product/规范/baize-ui-dsl/
消费方 (baize-loop):       /home/timywel/AI_Product/baize-loop/packages/baize-ui-dsl/
实际使用:                  /home/timywel/AI_Product/baize-loop/frontend/src/components/chat/ui-block/
```

## 同步流程（参照 baize-memory-core）

### 1. 手动同步脚本

```bash
# /home/timywel/AI_Product/baize-loop/scripts/sync-baize-ui-dsl.sh

#!/usr/bin/env bash
set -e

SRC="/home/timywel/AI_Product/规范/baize-ui-dsl"
DEST="/home/timywel/AI_Product/baize-loop/packages/baize-ui-dsl"

echo "🔄 同步 baize-ui-dsl: $SRC → $DEST"

# 1. 复制源代码 (排除 dev 文件)
mkdir -p "$DEST"
rsync -a --delete \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.vite' \
  --exclude='coverage' \
  --exclude='docs' \
  --exclude='examples' \
  --exclude='*.log' \
  "$SRC/src/" "$DEST/src/"

# 2. 复制 README (双语)
cp "$SRC/README.md" "$DEST/"
cp "$SRC/README.zh-CN.md" "$DEST/"
cp "$SRC/LICENSE" "$DEST/"
cp "$SRC/package.json" "$DEST/"

echo "✅ 同步完成"
```

### 2. 在 baize-loop 中引用

`/home/timywel/AI_Product/baize-loop/frontend/package.json`：

```json
{
  "dependencies": {
    "@timywel/baize-ui-dsl": "workspace:*"
  }
}
```

`/home/timywel/AI_Product/baize-loop/pnpm-workspace.yaml`：

```yaml
packages:
  - "frontend"
  - "packages/*"
```

## 接入点

### 1. ChatMessageRenderer.jsx 加 case

```jsx
// /home/timywel/AI_Product/baize-loop/frontend/src/components/chat/ChatMessageRenderer.jsx
import { UiBlockRenderer } from "@timywel/baize-ui-dsl";

// 在 switch 中加:
case "ui_block":
  return <UiBlockRenderer entry={entry} chatId={chatId} config={config} />;
```

### 2. i18n Provider 注入

```jsx
// /home/timywel/AI_Product/baize-loop/frontend/src/App.jsx
import { I18nProvider } from "@timywel/baize-ui-dsl";
import { useTranslation } from "react-i18next";

function ChatApp() {
  const { t, i18n } = useTranslation();
  return (
    <I18nProvider t={t} locale={i18n.language}>
      {/* existing chat */}
    </I18nProvider>
  );
}
```

### 3. 后端 loop.ts emit ui_block

后端实现真实集成需要 `PLAN-CHAT-ARCH-REDESIGN` 子 PLAN 3 完成（transcript schema 加 `ui_block` type）后才能做，**留作后续 session**。

## 启动时间线

| 阶段 | 时间 | 内容 |
|------|------|------|
| **Phase 1**（当前） | 2026-06 | 独立库完成（v0.1.0 MVP）|
| **Phase 2** | 待 PLAN-3 完成后 | 接入 baize-loop packages + 同步脚本 |
| **Phase 3** | Phase 2 后 | ChatMessageRenderer.jsx 加 case |
| **Phase 4** | Phase 3 后 | 后端 loop.ts 真实 emit ui_block |
| **Phase 5** | Phase 4 后 | 白泽 Agent 跑真实任务（如 SwarmPanel）输出 UI |

## 验证 checklist

集成完成后逐项验证：

- [ ] `pnpm install` 不报 baize-ui-dsl 找不到
- [ ] `pnpm test:unit` 全过
- [ ] `pnpm test:e2e` 全过（含新增 ui-block 场景）
- [ ] 暗色主题下 widget 视觉正确（Playwright 截图对比）
- [ ] i18n 切换 zh-CN / en-US 不硬编码
- [ ] `MarkdownMessage` 路径不受影响（回归）
- [ ] `pnpm build` 产物体积增量 < 50KB（gzipped）

## 回滚策略

如果发现问题，回滚步骤：

```bash
# 1. 删除 frontend/src/components/chat/ui-block/ 新增文件
# 2. ChatMessageRenderer.jsx 去掉 case "ui_block"
# 3. frontend/package.json 去掉 @timywel/baize-ui-dsl 依赖
# 4. pnpm install
# 5. pnpm test:e2e 确认回归
```

每个步骤独立可逆，不影响主 chat 流程。
