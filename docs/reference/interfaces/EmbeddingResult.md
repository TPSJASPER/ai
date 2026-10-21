---
id: EmbeddingResult
title: EmbeddingResult
---

Defined in: packages/ai/src/types.ts:3326

Result of embedding generation.

## Properties

### embeddings

```ts
embeddings: Embedding[];
```

Defined in: packages/ai/src/types.ts:3332

One embedding per input item, in input order

***

### id

```ts
id: string;
```

Defined in: packages/ai/src/types.ts:3328

Unique identifier for the generation

***

### model

```ts
model: string;
```

Defined in: packages/ai/src/types.ts:3330

Model used for generation

***

### usage?

```ts
optional usage?: TokenUsage<ProviderUsageDetails>;
```

Defined in: packages/ai/src/types.ts:3334

Token usage information (if provided by the adapter)
