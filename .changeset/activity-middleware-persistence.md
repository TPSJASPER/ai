---
'@tanstack/ai': patch
---

Persist `ACTIVITY_SNAPSHOT` and `ACTIVITY_DELTA` events that chat middleware adds to the public stream, so `withPersistence` saves them and `reconstructChat` restores their activity rows.
