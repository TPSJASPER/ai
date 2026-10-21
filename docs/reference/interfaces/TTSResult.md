---
id: TTSResult
title: TTSResult
---

Defined in: packages/ai/src/types.ts:2929

Result of text-to-speech generation.

## Properties

### alignment?

```ts
optional alignment?: TTSAlignment;
```

Defined in: packages/ai/src/types.ts:2944

Character- or word-level timings, present when `timestamps: true` was
requested. Use this rather than `duration` to find where *speech* ends.

***

### artifacts?

```ts
optional artifacts?: PersistedArtifactRef[];
```

Defined in: packages/ai/src/types.ts:2955

Persisted artifact references for generated assets, when available

***

### audio

```ts
audio: string;
```

Defined in: packages/ai/src/types.ts:2935

Base64-encoded audio data

***

### contentType?

```ts
optional contentType?: string;
```

Defined in: packages/ai/src/types.ts:2951

Content type of the audio (e.g., 'audio/mp3')

***

### duration?

```ts
optional duration?: number;
```

Defined in: packages/ai/src/types.ts:2939

Duration of the audio file in seconds, if available

***

### format

```ts
format: string;
```

Defined in: packages/ai/src/types.ts:2937

Audio format of the generated audio

***

### id

```ts
id: string;
```

Defined in: packages/ai/src/types.ts:2931

Unique identifier for the generation

***

### model

```ts
model: string;
```

Defined in: packages/ai/src/types.ts:2933

Model used for generation

***

### segments?

```ts
optional segments?: TTSSegment[];
```

Defined in: packages/ai/src/types.ts:2949

Per-turn (or per-utterance) spans of the audio, present when
`timestamps: true` was requested and the provider reports segmentation.

***

### usage?

```ts
optional usage?: TokenUsage<ProviderUsageDetails>;
```

Defined in: packages/ai/src/types.ts:2953

Token usage information (if provided by the adapter)
