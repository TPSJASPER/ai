---
id: VideoStatusResult
title: VideoStatusResult
---

Defined in: packages/ai/src/types.ts:2598

**`Experimental`**

Status of a video generation job.

 Video generation is an experimental feature and may change.

## Properties

### error?

```ts
optional error?: string;
```

Defined in: packages/ai/src/types.ts:2606

**`Experimental`**

Error message if status is 'failed'

***

### jobId

```ts
jobId: string;
```

Defined in: packages/ai/src/types.ts:2600

**`Experimental`**

Job identifier

***

### progress?

```ts
optional progress?: number;
```

Defined in: packages/ai/src/types.ts:2604

**`Experimental`**

Progress percentage (0-100), if available

***

### status

```ts
status: "pending" | "processing" | "completed" | "failed";
```

Defined in: packages/ai/src/types.ts:2602

**`Experimental`**

Current status of the job
