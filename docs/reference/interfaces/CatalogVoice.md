---
id: CatalogVoice
title: CatalogVoice
---

Defined in: packages/ai/src/types.ts:2972

One voice from a provider's catalog.

## Properties

### description?

```ts
optional description?: string;
```

Defined in: packages/ai/src/types.ts:2980

Provider description of the voice

***

### labels?

```ts
optional labels?: Record<string, string>;
```

Defined in: packages/ai/src/types.ts:2984

Provider labels, such as accent, age, or use case

***

### name?

```ts
optional name?: string;
```

Defined in: packages/ai/src/types.ts:2976

Display name, when the provider stores one

***

### origin?

```ts
optional origin?: VoiceOrigin;
```

Defined in: packages/ai/src/types.ts:2978

Where the voice came from

***

### previewUrl?

```ts
optional previewUrl?: string;
```

Defined in: packages/ai/src/types.ts:2982

URL of a sample, when the provider hosts one

***

### voiceId

```ts
voiceId: string;
```

Defined in: packages/ai/src/types.ts:2974

Pass this to `generateSpeech()` as `voice`
