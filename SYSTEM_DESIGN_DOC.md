SYSTEM DESIGN — DataSense (prose only)

Overview
--------
DataSense converts natural-language questions into safe SQL and visualizations using two complementary approaches:
- MCP (retrieval): provides up-to-date facts (schema, business rules, examples) as short text snippets.
- LoRA (adapter): optionally changes model behavior for consistent SQL style, guardrails, and repeatable fixes.

Primary goals
- Produce accurate SQL referencing canonical table/column names.
- Minimize hallucinations by supplying exact facts via retrieval.
- Enforce safety and validation before any DB execution.
- Let teams update business rules as human-editable docs (then re-index).

Components
----------
- Frontend (UI)
  - Presents chat/query box, displays SQL/results and charts.
  - Sends user queries to the Orchestrator.

- Orchestrator
  - Builds compact prompts by combining user text + retrieved snippets + schema hints.
  - Calls the model host (Ollama) and applies LoRA adapter when configured.
  - Runs quick validation and safe-execution checks.
  - Handles retries, timeouts, and caching of composed prompts / responses.

- MCP (Retrieval)
  - Chunker: turns large markdown/text files into chunks.
  - Embeddings: converts chunks into vectors.
  - Index: stores vectors in a Vector DB (FAISS/Chroma/Qdrant) for fast top-k search.
  - Returns exact text snippets and snippet IDs to the Orchestrator.

- Model Host (Ollama) + LoRA
  - Ollama runs the base LLM locally (user-controlled office IP).
  - LoRA adapters (optional) are trained separately and loaded at inference time to nudge model behavior.

- Database
  - Authoritative source of truth for data. The Orchestrator validates SQL against `schema/` files and enforces execution policies.

- Tools
  - Post-process tabular results into charts/specs and provide UI-ready visualization objects.

Data flow (high level)
----------------------
1. User submits NL query via Frontend.
2. Frontend forwards query to the Orchestrator.
3. Orchestrator asks MCP for top-k relevant snippets (schema, rules, examples).
4. Orchestrator composes a compact prompt: user + retrieved snippets + schema hints.
5. Prompt (with LoRA adapter applied if available) is sent to the model host.
6. Model returns SQL (or clarification). Orchestrator validates SQL against canonical schema and safety rules.
7. If SQL is valid and permitted, Orchestrator executes against DB in a safe manner (limited, sandboxed queries). Results return to Frontend.
8. Tools convert results into visualizations if requested.

Caching responsibilities (who caches what)
------------------------------------------
- MCP: cache embeddings, index shards, and top-k snippet lookups. Rebuild index when documents change.
- Orchestrator: cache composed prompt keys and model responses (short TTL) to avoid repeat model calls.
- Do not cache LoRA adapters (they are model artifacts). You may cache model outputs produced using a LoRA adapter.

Validation & safety
-------------------
- Always validate that generated SQL only references canonical table/column names from `schema/`.
- Enforce execution policies: read-only where possible, LIMITs, row caps, and query timeouts.
- For risky queries (DDL or deletes), require explicit human confirmation.
- Log all executed queries for audit and rollback.

LoRA vs MCP (practical summary)
-------------------------------
- MCP provides facts and keeps knowledge up-to-date by indexing docs.
- LoRA changes model behaviour (formatting, guardrails). Use LoRA to reduce repeated prompt tokens and fix systematic model mistakes.
- Use both together for highest accuracy: MCP for facts, LoRA for consistent behavior.

Failure modes and mitigations
----------------------------
- Hallucinated identifiers: mitigate by schema-aware validator and restricting execution of non-canonical names.
- Stale docs: schedule re-indexing after edits, or invalidate cache on doc updates.
- Model cold-starts: implement retries with backoff and per-request timeouts.
- Overfitting LoRA: validate adapters on held-out queries before deployment.

Deployment notes
----------------
- Keep Ollama host address configurable (do not hardcode). Warm the model before demos.
- Store LoRA adapters in a versioned artifacts directory and load them by name in the Orchestrator.
- Vector DB can be local (FAISS) for small scale or managed (Qdrant/Milvus) for production.

Operational checklist (short)
-----------------------------
- Keep `business_contexts/` human-editable and re-index after changes.
- Maintain `schema/` as canonical validation source.
- Keep `training/` with dataset and LoRA scripts for future fine-tuning.
- Monitor model latencies, DB query times, and validation failures.

If you want a separate compact Mermaid diagram, it already exists in `SYSTEM_DESIGN.md`.
