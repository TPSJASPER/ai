---
id: ToolCallStartEvent
title: ToolCallStartEvent
---

Defined in: packages/ai/src/types.ts:1672

Emitted when a tool call starts.

@ag-ui/core provides: `toolCallId`, `toolCallName`, `parentMessageId?`,
`subagentRunId?`

## Extends

- `Omit`\<`AGUIToolCallStartEvent`, `"type"`\>

## Properties

### metadata?

```ts
optional metadata?: Record<string, any>;
```

Defined in: packages/ai/src/types.ts:1680

Provider-specific metadata to carry into the ToolCall.

#### Overrides

```ts
Omit.metadata
```

***

### toolName?

```ts
optional toolName?: string;
```

Defined in: packages/ai/src/types.ts:1678

Alias of `toolCallName`. Kept so existing stream readers still compile.

***

### type

```ts
type: "TOOL_CALL_START";
```

Defined in: packages/ai/src/types.ts:1676
