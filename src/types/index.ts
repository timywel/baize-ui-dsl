/**
 * types 公开 API 入口
 */

export * from "./dsl.js";
export {
  validateUiBlock,
  isKnownWidget,
  uiBlockDslSchema,
} from "./schema.js";
export type {
  UiBlockDslParsed,
  ValidationResult,
} from "./schema.js";
