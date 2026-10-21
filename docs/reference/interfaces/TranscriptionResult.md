---
id: TranscriptionResult
title: TranscriptionResult
---

Defined in: packages/ai/src/types.ts:3203

Result of audio transcription.

## Properties

### artifacts?

```ts
optional artifacts?: PersistedArtifactRef[];
```

Defined in: packages/ai/src/types.ts:3221

Persisted artifact references for generated assets, when available

***

### duration?

```ts
optional duration?: number;
```

Defined in: packages/ai/src/types.ts:3213

Duration of the audio in seconds

***

### id

```ts
id: string;
```

Defined in: packages/ai/src/types.ts:3205

Unique identifier for the transcription

***

### language?

```ts
optional language?: string;
```

Defined in: packages/ai/src/types.ts:3211

Language detected or specified

***

### model

```ts
model: string;
```

Defined in: packages/ai/src/types.ts:3207

Model used for transcription

***

### segments?

```ts
optional segments?: TranscriptionSegment[];
```

Defined in: packages/ai/src/types.ts:3215

Detailed segments with timing, if available

***

### text

```ts
text: string;
```

Defined in: packages/ai/src/types.ts:3209

The full transcribed text

***

### usage?

```ts
optional usage?: TokenUsage<ProviderUsageDetails>;
```

Defined in: packages/ai/src/types.ts:3219

Token usage information (if provided by the adapter)

***

### words?

```ts
optional words?: TranscriptionWord[];
```

Defined in: packages/ai/src/types.ts:3217

Word-level timestamps, if available
