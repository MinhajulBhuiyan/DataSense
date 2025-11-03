# Model test (concise)

Purpose
- Run a small validation that compares two inference models (llama3:8b and qwen2.5-coder) against the backend and reports timing and SQL output.

Prerequisites
- Ollama running with the models pulled (e.g. `ollama pull llama3:8b qwen2.5-coder`).
- Backend started for integration tests: `cd nl2sql && python app.py`.

Run the tests
```powershell
cd nl2sql
python test_models.py
```

What you get
- A quick Ollama availability check per model.
- For each example query: model, elapsed time, rows (if returned), status, detected SQL features, and a SQL snippet.
- Per-model timing statistics (count, avg, median, min, max).

Live UI
- While the script runs it POSTS incremental results to the frontend hidden page: `http://localhost:3000/test_models` (developer-only view).

Troubleshooting
- If a model is unreachable: confirm Ollama is running and the model is pulled.
- If backend calls fail: make sure `nl2sql/app.py` is running and listening on its expected port.

Need CSV/JSON output?
- If you want results exported to JSON or CSV, say so and I will add a small flag to `test_models.py`.
