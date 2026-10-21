---
title: "@tanstack/ai-octane"
id: ai-octane
order: 8
description: "API reference for @tanstack/ai-octane. Octane hooks including useChat for streaming chat with full type safety."
keywords:
  - tanstack ai
  - "@tanstack/ai-octane"
  - octane
  - useChat
  - octane hooks
  - api reference
---

Install `@tanstack/ai-octane`, then call `useChat` the same way you would in React. The hook modules are `.tsrx` and compile in your Octane plugin.

## Installation

<!-- ::start:tabs variant="package-manager" mode="install" -->

octane: @tanstack/ai-octane octane

<!-- ::end:tabs -->

`octane` is a required peer. This package publishes uncompiled source, like Svelte packages that ship `.svelte`.

## `useRegisterWebMCPTools(tools, options?)`

Register executable client tools after the Octane component mounts. Octane removes them on cleanup and replaces them when `tools` or `options` change.

For a complete setup and behavior guide, see [WebMCP Tools](../tools/webmcp).

```tsx
import {
  useRegisterWebMCPTools,
  type UseRegisterWebMCPToolsOptions,
} from '@tanstack/ai-octane'
import { searchProducts } from './tools'

const tools = [searchProducts]
const options: UseRegisterWebMCPToolsOptions<typeof tools> = {
  onError(error) {
    console.error(error)
  },
}

function ProductsPage() {
  useRegisterWebMCPTools(tools, options)
  return null
}
```

`UseRegisterWebMCPToolsOptions<TTools, TContext>` contains `toolOptions`, `context`, and `onError`. The hook owns the registration signal.

The `context` field is required when a tool declares a required runtime context. Keep `tools` and `options` stable when their values do not change.

## `usePageWebMCPTools(options?)`

Read the WebMCP tools on the page as client tools. The array starts empty and updates when the page adds or removes a tool. Pass it to `useChat` as `tools`.

```tsx
import { usePageWebMCPTools } from "@tanstack/ai-octane"

export function useSameOriginPageTools() {
  return usePageWebMCPTools({
    filter: (tool) => tool.origin === location.origin,
  })
}
```

`filter` skips a tool when it returns `false`. `onError` gets a failed WebMCP read. For a complete guide, see [Page WebMCP Tools in Chat](../tools/webmcp-page-tools).

## `useChat(options)`

Manages chat state in an Octane component.

```tsx
import { useState } from 'octane'
import { useChat, fetchServerSentEvents } from '@tanstack/ai-octane'
import {
  createChatClientOptions,
  type InferChatMessages,
} from '@tanstack/ai-client'
import { toolDefinition } from '@tanstack/ai'
import { z } from 'zod'

const updateUIDef = toolDefinition({
  name: 'updateUI',
  description: 'Show a notification in the UI',
  inputSchema: z.object({ message: z.string() }),
})

export function ChatComponent() {
  const [notification, setNotification] = useState<string | null>(null)
  const updateUI = updateUIDef.client((input) => {
    setNotification(input.message)
    return { success: true }
  })
  const tools = [updateUI]

  const chatOptions = createChatClientOptions({
    connection: fetchServerSentEvents('/api/chat'),
    tools,
  })

  type ChatMessages = InferChatMessages<typeof chatOptions>

  const { messages, sendMessage, isLoading, error } = useChat(chatOptions)

  return (
    <div>
      {notification}
      {isLoading ? 'Loading' : null}
      {error ? error.message : null}
      <button onClick={() => void sendMessage('hi')} type="button">
        Send
      </button>
      {messages.length}
    </div>
  )
}
```

The matching server route still runs `chat({ adapter, messages })` and returns SSE. See [Quick Start](../getting-started/quick-start).

### Options you pass first

Extends `ChatClientOptions` from `@tanstack/ai-client`. Pass `connection` or `fetcher`, not both.

- `connection` or `fetcher` - how the hook talks to your server
- `tools?` - client tool implementations from `.client()`
- `threadId?` - the only identity for this chat. Required when persistence is on
- `initialMessages?` - starting transcript
- `forwardedProps?` - JSON sent to the server on the AG-UI `forwardedProps` field

### Options you add later

- `live?` - subscribe on mount, unsubscribe on unmount
- `queue?` - what to do when `sendMessage` runs while a turn is in flight. Default queues
- `interrupts?` - typed interrupt definitions
- `context?` - client-only runtime context for client tools. Not sent to the server
- `onResponse?` / `onChunk?` / `onFinish?` / `onError?` / `onInterruptStateChange?`
- `devtools?` - display options. The hook always tags `framework: 'octane'`

Client tools run automatically. There is no `onToolCall` callback.

Changing `connection` or `fetcher` updates the live `ChatClient`. Changing `threadId` creates a new client.

### Returns

```typescript
import type { UIMessage } from '@tanstack/ai-octane'
import type { ModelMessage } from '@tanstack/ai/client'
import type {
  MultimodalContent,
  ChatClientState,
  ConnectionStatus,
  QueuedMessage,
  SendMessageOptions,
} from '@tanstack/ai-client'

interface UseChatReturn {
  messages: ReadonlyArray<UIMessage>
  sendMessage: (
    content: string | MultimodalContent,
    options?: SendMessageOptions,
  ) => Promise<void>
  append: (message: ModelMessage | UIMessage) => Promise<void>
  addToolResult: (result: {
    toolCallId: string
    tool: string
    output: unknown
    state?: 'output-available' | 'output-error'
    errorText?: string
  }) => Promise<void>
  reload: () => Promise<void>
  stop: () => void
  isLoading: boolean
  error: Error | undefined
  status: ChatClientState
  isSubscribed: boolean
  connectionStatus: ConnectionStatus
  sessionGenerating: boolean
  isHydrating: boolean
  setMessages: (messages: ReadonlyArray<UIMessage>) => void
  clear: () => void
  queue: ReadonlyArray<QueuedMessage>
  cancelQueued: (id: string) => void
  runId: string | null
}
```

`queue` holds sends that wait while a run is busy. `runId` is the in-flight turn, or `null`. Interrupt helpers (`interrupts`, `resolveInterrupts`, `cancelInterrupts`, `retryInterrupts`) are on the same object when you pass `interrupts`.

## Connection adapters

Re-exported from `@tanstack/ai-client`:

```typescript
import {
  fetchServerSentEvents,
  fetchHttpStream,
  fetchJson,
  stream,
  type ConnectionAdapter,
} from '@tanstack/ai-octane'
```

## Example: basic chat

```tsx
import { useState } from 'octane'
import { useChat, fetchServerSentEvents } from '@tanstack/ai-octane'

export function Chat() {
  const [input, setInput] = useState('')
  const { messages, sendMessage, isLoading } = useChat({
    connection: fetchServerSentEvents('/api/chat'),
  })

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.role}:</strong>
          {message.parts
            .filter((part) => part.type === 'text')
            .map((part) => part.content)
            .join('')}
        </div>
      ))}
      <input
        value={input}
        disabled={isLoading}
        onInput={(event) => setInput(event.currentTarget.value)}
      />
      <button
        disabled={isLoading}
        onClick={() => {
          void sendMessage(input)
          setInput('')
        }}
        type="button"
      >
        Send
      </button>
    </div>
  )
}
```

## Example: tool approval

Pending approvals show up in `interrupts`. Pass the shared tool definition to `tools` so each item is typed. Then call `resolveInterrupt` with the decision.

```tsx
import { toolDefinition } from '@tanstack/ai'
import { useChat, fetchServerSentEvents } from '@tanstack/ai-octane'
import { z } from 'zod'

const deleteFileTool = toolDefinition({
  name: 'delete_file',
  description: 'Delete a file',
  needsApproval: true,
  inputSchema: z.object({ path: z.string() }),
})

export function ChatWithApproval() {
  const { sendMessage, interrupts } = useChat({
    connection: fetchServerSentEvents('/api/chat'),
    tools: [deleteFileTool],
  })

  return (
    <div>
      <button onClick={() => void sendMessage('run the tool')} type="button">
        Send
      </button>
      {interrupts.map((interrupt) =>
        interrupt.kind === 'tool-approval' ? (
          <div key={interrupt.id}>
            <p>Approve: {interrupt.toolName}</p>
            <button
              onClick={() => interrupt.resolveInterrupt(true)}
              type="button"
            >
              Approve
            </button>
            <button
              onClick={() => interrupt.resolveInterrupt(false)}
              type="button"
            >
              Deny
            </button>
          </div>
        ) : null,
      )}
    </div>
  )
}
```

## Other hooks

The package also exports `useRealtimeChat`, `useMcpAppBridge`, `useGeneration`, `useGenerateImage`, `useGenerateAudio`, `useGenerateSpeech`, `useGenerateVideo`, `useTranscription`, `useSummarize`, and `useAudioRecorder`.

The `./mcp-apps` React `AppRenderer` subpath is not in this package. `useMcpAppBridge` is.

## Types

Re-exported from `@tanstack/ai-client`:

- `UIMessage<TTools>`
- `ChatClientOptions<TTools, TContext>`
- `InferChatMessages<T>`
- `QueuedMessage`, `SendMessageOptions`, `WhenBusy`

## Next

- [Quick Start](../getting-started/quick-start)
- [Tools](../tools/tools)
- [Client tools](../tools/client-tools)
