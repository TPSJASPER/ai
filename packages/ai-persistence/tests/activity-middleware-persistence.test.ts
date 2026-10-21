import { describe, expect, it } from 'vitest'
import { EventType, chat } from '@tanstack/ai'
import type {
  AdapterYieldChunk,
  AnyTextAdapter,
  ChatMiddleware,
  StreamChunk,
} from '@tanstack/ai'
import { memoryPersistence } from '../src/memory'
import { withPersistence } from '../src/middleware'
import { reconstructChat } from '../src/reconstruct'

const progressSnapshot: StreamChunk = {
  type: EventType.ACTIVITY_SNAPSHOT,
  messageId: 'search-1',
  activityType: 'search',
  content: { status: 'running', hits: 0 },
  timestamp: 1,
}

const progressDelta: StreamChunk = {
  type: EventType.ACTIVITY_DELTA,
  messageId: 'search-1',
  activityType: 'search',
  patch: [
    { op: 'replace', path: '/status', value: 'done' },
    { op: 'replace', path: '/hits', value: 3 },
  ],
  timestamp: 2,
}

function fixedAdapter(chunks: Array<AdapterYieldChunk>): AnyTextAdapter {
  return {
    kind: 'text',
    name: 'fixed',
    model: 'test-model',
    '~types': {},
    async *chatStream() {
      for (const chunk of chunks) yield chunk
    },
  } as unknown as AnyTextAdapter
}

function textRun(runId = 'run-1'): Array<AdapterYieldChunk> {
  return [
    {
      type: EventType.RUN_STARTED,
      runId,
      threadId: 'thread-1',
      timestamp: 1,
    },
    {
      type: EventType.TEXT_MESSAGE_START,
      messageId: 'msg-1',
      role: 'assistant',
      timestamp: 1,
    },
    {
      type: EventType.TEXT_MESSAGE_CONTENT,
      messageId: 'msg-1',
      delta: 'answer',
      timestamp: 1,
    },
    {
      type: EventType.TEXT_MESSAGE_END,
      messageId: 'msg-1',
      timestamp: 1,
    },
    {
      type: EventType.RUN_FINISHED,
      runId,
      threadId: 'thread-1',
      finishReason: 'stop',
      timestamp: 1,
    },
  ]
}

async function collect(stream: AsyncIterable<StreamChunk>) {
  const chunks: Array<StreamChunk> = []
  for await (const chunk of stream) chunks.push(chunk)
  return chunks
}

async function reconstructedRoles(
  persistence: ReturnType<typeof memoryPersistence>,
) {
  const response = await reconstructChat(
    persistence,
    new Request('http://example.test/api/chat?threadId=thread-1'),
  )
  const body = (await response.json()) as {
    messages: Array<{ role: string }>
  }
  return body.messages.map((message) => message.role)
}

describe('activity events emitted by chat middleware', () => {
  it('persists middleware activity and restores it with reconstructChat', async () => {
    const persistence = memoryPersistence()
    const searchProgress: ChatMiddleware = {
      name: 'search-progress',
      onChunk(_ctx, chunk) {
        if (chunk.type === EventType.RUN_STARTED) {
          return [progressSnapshot, chunk]
        }
        if (chunk.type === EventType.TEXT_MESSAGE_START) {
          return [progressDelta, chunk]
        }
        return [chunk]
      },
    }

    const wire = await collect(
      chat({
        adapter: fixedAdapter(textRun('run-middleware')),
        messages: [{ role: 'user', content: 'search' }],
        threadId: 'thread-1',
        runId: 'run-middleware',
        middleware: [withPersistence(persistence), searchProgress],
      }) as AsyncIterable<StreamChunk>,
    )

    expect(wire.map((chunk) => chunk.type)).toContain(
      EventType.ACTIVITY_SNAPSHOT,
    )
    expect(wire.map((chunk) => chunk.type)).toContain(EventType.ACTIVITY_DELTA)

    expect(
      await persistence.stores.activities.loadActivities('thread-1'),
    ).toEqual([
      expect.objectContaining({
        id: 'search-1',
        activityType: 'search',
        content: { status: 'done', hits: 3 },
      }),
    ])
    expect(await reconstructedRoles(persistence)).toEqual([
      'user',
      'activity',
      'assistant',
    ])
  })

  it('keeps adapter and middleware activity rows and applies the adapter delta once', async () => {
    const persistence = memoryPersistence()
    const adapter = fixedAdapter([
      {
        type: EventType.RUN_STARTED,
        runId: 'run-adapter',
        threadId: 'thread-1',
        timestamp: 1,
      },
      {
        type: EventType.ACTIVITY_SNAPSHOT,
        messageId: 'adapter-1',
        activityType: 'search',
        content: { items: [] },
        timestamp: 1,
      },
      {
        type: EventType.ACTIVITY_DELTA,
        messageId: 'adapter-1',
        activityType: 'search',
        patch: [{ op: 'add', path: '/items/-', value: 'adapter' }],
        timestamp: 2,
      },
      {
        type: EventType.TEXT_MESSAGE_START,
        messageId: 'msg-1',
        role: 'assistant',
        timestamp: 1,
      },
      {
        type: EventType.TEXT_MESSAGE_CONTENT,
        messageId: 'msg-1',
        delta: 'answer',
        timestamp: 1,
      },
      {
        type: EventType.TEXT_MESSAGE_END,
        messageId: 'msg-1',
        timestamp: 1,
      },
      {
        type: EventType.RUN_FINISHED,
        runId: 'run-adapter',
        threadId: 'thread-1',
        finishReason: 'stop',
        timestamp: 1,
      },
    ])
    const middlewareNotice: ChatMiddleware = {
      name: 'middleware-notice',
      onChunk(_ctx, chunk) {
        if (chunk.type === EventType.TEXT_MESSAGE_START) {
          return [
            {
              type: EventType.ACTIVITY_SNAPSHOT,
              messageId: 'middleware-1',
              activityType: 'notice',
              content: { text: 'from middleware' },
              timestamp: 2,
            },
            chunk,
          ]
        }
        return [{ ...chunk }]
      },
    }

    await collect(
      chat({
        adapter,
        messages: [{ role: 'user', content: 'search' }],
        threadId: 'thread-1',
        runId: 'run-adapter',
        middleware: [withPersistence(persistence), middlewareNotice],
      }) as AsyncIterable<StreamChunk>,
    )

    expect(
      await persistence.stores.activities.loadActivities('thread-1'),
    ).toEqual([
      expect.objectContaining({
        id: 'adapter-1',
        content: { items: ['adapter'] },
      }),
      expect.objectContaining({
        id: 'middleware-1',
        activityType: 'notice',
        content: { text: 'from middleware' },
      }),
    ])
    expect(await reconstructedRoles(persistence)).toEqual([
      'user',
      'activity',
      'activity',
      'assistant',
    ])
  })
})
