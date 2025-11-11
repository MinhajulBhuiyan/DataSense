Top-level project structure (concise)

mcp/               — chunking → embeddings → index; returns exact text snippets for prompts
orchestrator/      — prompt builder, schema enforcement, SQL validator, safe executor
business_contexts/ — editable markdown: business rules, examples, policies (source-of-truth)
schema/            — canonical tables & columns (validator + prompts)
training/          — LoRA datasets & training scripts (optional)
tools/             — tabular → chart/spec transformers and UX helpers
frontend/          — UI (Next.js / React)
docs/              — minimal documentation / run notes
tests/             — automated checks (unit/integration)
scripts/           — admin utilities (optional)

Notes:
- Vector DB stores vectors only; index from `business_contexts/`.
- LoRA artifacts live under `training/`; train adapters and load at inference.
- `mcp/` supplies snippets; `orchestrator/` composes prompts, validates, and executes.

See <attachments> above for file contents. You may not need to search or read the file again.
