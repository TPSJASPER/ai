---
'@tanstack/ai-mcp': patch
'@tanstack/ai-code-mode': patch
---

The `mcp()` and `codeMode()` harness plugins send their warnings to the logger of the host (`createHarnessHost({ logger })`).
