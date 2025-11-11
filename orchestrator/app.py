"""
Flask API Server for DataSense NL2SQL
Provides REST API endpoints for the frontend
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from dotenv import load_dotenv

# Import our existing modules
from query_executor import QueryExecutor
from query_validator import QueryValidator
from business_context import BUSINESS_CONTEXT
import requests
import tempfile
import time
import io
import os
import openpyxl
from query_store import create_token, get_query

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Try to load LoRA adapter if available
LORA_ADAPTER_PATH = os.path.join('training', 'lora_adapter')
USE_LORA = os.path.exists(LORA_ADAPTER_PATH)

# API Configuration
API_KEY = os.getenv("LLAMA_API_KEY")
OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://192.168.11.10:11434/api/generate")

# Initialize query executor and validator
executor = QueryExecutor()
validator = QueryValidator()

# Preview / export configuration
PREVIEW_LIMIT = int(os.getenv("PREVIEW_LIMIT", 50))
PREVIEW_CHECK = PREVIEW_LIMIT + 1
EXPORT_ROW_WARNING_THRESHOLD = int(os.getenv("EXPORT_ROW_WARNING_THRESHOLD", 10000))
EXPORT_MAX_ROWS = int(os.getenv("EXPORT_MAX_ROWS", 200000))


def load_schema():
    """Load the fixed database schema from JSON file"""
    try:
        with open('database_schema.json', 'r') as f:
            schema_data = json.load(f)
        return format_schema_for_prompt(schema_data), schema_data
    except FileNotFoundError:
        return "Schema file not found. Please ensure database_schema.json exists.", None


def format_schema_for_prompt(schema_data):
    """Convert JSON schema to human-readable format for LLM prompt"""
    formatted = f"DATABASE: {schema_data['database']}\n\n"
    formatted += "TABLES AND COLUMNS:\n\n"
    
    for table in schema_data['tables']:
        formatted += f"Table: {table['name']}\n"
        formatted += "Columns:\n"
        
        for col in table['columns']:
            col_info = f"  - {col['name']} ({col['type']}"
            
            if col.get('primary_key'):
                col_info += ", PRIMARY KEY"
            if col.get('nullable') == False:
                col_info += ", NOT NULL"
            if col.get('unique'):
                col_info += ", UNIQUE"
            if 'default' in col:
                col_info += f", DEFAULT {col['default']}"
            if 'foreign_key' in col:
                fk = col['foreign_key']
                col_info += f", FOREIGN KEY -> {fk['table']}({fk['column']})"
            if 'values' in col:
                col_info += f", VALUES: {col['values']}"
            
            col_info += ")"
            formatted += col_info + "\n"
        
        formatted += "\n"
    
    return formatted


DATABASE_SCHEMA, SCHEMA_JSON = load_schema()


def generate_sql(natural_language_query, model="llama3:8b"):
    """
    Convert natural language to SQL query using Ollama LLM
    
    Args:
        natural_language_query (str): The natural language question
        model (str): The Ollama model to use (default: llama3:8b)
    
    Returns:
        str: Generated SQL query only
    """
    
    # Build a shorter prompt: include only relevant schema tables when possible
    def build_prompt(query_text: str) -> str:
        # find table names mentioned in user query (case-insensitive)
        q = query_text.lower()
        matched_tables = []
        try:
            for t in SCHEMA_JSON.get('tables', []):
                name = t.get('name', '').lower()
                if name and (name in q or name.replace('_', ' ') in q):
                    matched_tables.append(t)
        except Exception:
            matched_tables = []

        schema_section = ''
        if matched_tables:
            for table in matched_tables:
                schema_section += f"Table: {table['name']}\nColumns:\n"
                for col in table.get('columns', []):
                    schema_section += f"  - {col['name']} ({col.get('type','')})\n"
                schema_section += "\n"
        else:
            # fallback to full schema
            schema_section = DATABASE_SCHEMA

        prompt = f"You are a SQL expert for DataSense.\n\n{BUSINESS_CONTEXT}\n\n{schema_section}\n" \
                 f"Rules:\n1) Only use tables/columns present above.\n2) Return ONLY the SQL query, no explanation.\n\nUser question: {natural_language_query}\n\nSQL:"
        return prompt

    prompt = build_prompt(natural_language_query)

    # No caching: always request a fresh response from the model so
    # the user receives up-to-date output (errors / transient states included).

    # Retry logic with backoff
    attempts = 3
    backoff = 2
    last_err = None
    for attempt in range(1, attempts + 1):
        try:
            response = requests.post(OLLAMA_API_URL, json={"model": model, "prompt": prompt, "stream": False}, timeout=300)
            if response.status_code == 200:
                result = response.json()
                if 'response' in result:
                    sql_query = result['response'].strip()
                    if sql_query.startswith('```'):
                        lines = sql_query.split('\n')
                        sql_query = '\n'.join([line for line in lines if not line.startswith('```')])
                        sql_query = sql_query.strip()
                    return sql_query
                else:
                    last_err = f"Unexpected response format (status 200)"
                    break
            else:
                last_err = f"API returned status code {response.status_code}"
                # if 5xx, retry
                if 500 <= response.status_code < 600:
                    pass
                else:
                    break
        except requests.exceptions.Timeout as e:
            last_err = f"Timeout: {e}"
        except Exception as e:
            last_err = str(e)

        # wait before retrying
        try:
            import time
            time.sleep(backoff * attempt)
        except Exception:
            pass

    return f"Error: {last_err or 'Unknown error'}"


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint - test database connection"""
    connection_status = executor.test_connection()
    
    if "successful" in connection_status:
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'message': connection_status,
            'lora_available': USE_LORA
        }), 200
    else:
        return jsonify({
            'status': 'unhealthy',
            'database': 'disconnected',
            'message': connection_status,
            'lora_available': USE_LORA
        }), 500


@app.route('/api/schema', methods=['GET'])
def get_schema():
    """Get database schema for display in frontend"""
    if SCHEMA_JSON:
        # Format schema in a readable way for frontend
        schema_text = ""
        for table in SCHEMA_JSON['tables']:
            schema_text += f"\n{table['name']}:\n"
            for col in table['columns']:
                schema_text += f"  • {col['name']} ({col['type']})\n"
        
        return jsonify({
            'schema': schema_text.strip(),
            'database': SCHEMA_JSON['database'],
            'tables': SCHEMA_JSON['tables']
        }), 200
    else:
        return jsonify({
            'error': 'Schema not found'
        }), 500


@app.route('/api/query', methods=['POST'])
def process_query():
    """
    Main endpoint: Convert natural language to SQL and execute
    
    Request body:
    {
        "prompt": "Show me all distributors",
        "model": "llama3:8b"  // optional, defaults to llama3:8b
    }
    
    Response:
    {
        "sql_query": "SELECT * FROM distributors",
        "results": [...],
        "columns": [...],
        "row_count": 10
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'prompt' not in data:
            return jsonify({
                'error': 'Missing "prompt" in request body'
            }), 400
        
        natural_language_query = data['prompt'].strip()
        model = data.get('model', 'llama3:8b')  # Get model from request, default to llama3:8b
        
        if not natural_language_query:
            return jsonify({
                'error': 'Prompt cannot be empty'
            }), 400
        
        # Step 1: Generate SQL using LLM with selected model
        sql_query = generate_sql(natural_language_query, model)
        
        # Check if it's an error message from LLM
        if sql_query.startswith("ERROR:") or sql_query.startswith("Error:"):
            return jsonify({
                'error': sql_query,
                'sql_query': None
            }), 400
        
        # Step 2: Clean and validate query
        cleaned_query = validator.clean_query(sql_query)
        
        # Step 3: Execute query (preview + possible export token)
        # If it's a SELECT, perform a cheap preview using LIMIT (PREVIEW_CHECK)
        if cleaned_query.strip().lower().startswith('select'):
            success, rows, columns = executor.db.execute_query_with_limit(cleaned_query, PREVIEW_CHECK)
            if not success:
                return jsonify({
                    'error': f"Query execution failed: {rows}",
                    'sql_query': sql_query
                }), 400

            # If results are <= PREVIEW_LIMIT, return all rows like before
            if len(rows) <= PREVIEW_LIMIT:
                results = []
                for row in rows:
                    row_dict = {}
                    for i, col in enumerate(columns):
                        value = row[i]
                        if value is None:
                            row_dict[col] = None
                        else:
                            row_dict[col] = str(value) if not isinstance(value, (int, float, bool)) else value
                    results.append(row_dict)

                return jsonify({
                    'sql_query': sql_query,
                    'results': results,
                    'columns': columns,
                    'row_count': len(results),
                    'success': True,
                    'model_used': model,
                    'lora_trained': USE_LORA,
                    'has_more': False
                }), 200

            # Otherwise, we have more than PREVIEW_LIMIT rows. Return preview and a token.
            preview_rows = rows[:PREVIEW_LIMIT]
            results = []
            for row in preview_rows:
                row_dict = {}
                for i, col in enumerate(columns):
                    value = row[i]
                    if value is None:
                        row_dict[col] = None
                    else:
                        row_dict[col] = str(value) if not isinstance(value, (int, float, bool)) else value
                results.append(row_dict)

            # create a short-lived token for exporting the full result
            token = create_token(cleaned_query)

            return jsonify({
                'sql_query': sql_query,
                'results': results,
                'columns': columns,
                'preview_count': len(results),
                'row_count': f">{PREVIEW_LIMIT}",
                'success': True,
                'model_used': model,
                'lora_trained': USE_LORA,
                'has_more': True,
                'export_token': token
            }), 200
        else:
            # Non-SELECT query: run as before
            success, data, columns = executor.db.execute_query(cleaned_query)
            if not success:
                return jsonify({
                    'sql_query': sql_query,
                    'error': data
                }), 400
            return jsonify({
                'sql_query': sql_query,
                'message': data,
                'success': True
            }), 200
    
    except Exception as e:
        return jsonify({
            'error': f'Server error: {str(e)}'
        }), 500


@app.route('/api/export', methods=['POST'])
def export_csv():
    """
    Export full query result as XLSX.
    Expects JSON body: { "token": "<export_token>" }
    """
    try:
        data = request.get_json()

        if not data or 'token' not in data:
            return jsonify({'error': 'Missing "token" in request body'}), 400

        token = data['token']
        item = get_query(token)
        if not item:
            return jsonify({'error': 'Invalid or expired token'}), 400

        sql = item.get('sql')
        # Re-validate SQL server-side
        cleaned = validator.clean_query(sql)
        is_safe, msg = validator.is_safe_query(cleaned)
        if not is_safe:
            return jsonify({'error': 'Query not allowed for export', 'reason': msg}), 400

        # Stream rows using server-side cursor
        columns, rows_gen = executor.db.stream_query_with_columns(cleaned)

        # Build XLSX in a temporary file using openpyxl write-only mode
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx')
        tmp_path = tmp.name
        tmp.close()

        wb = openpyxl.Workbook(write_only=True)
        ws = wb.create_sheet(title='Export')
        # Write header
        ws.append(columns)

        total = 0
        for row in rows_gen:
            total += 1
            if total > EXPORT_MAX_ROWS:
                # stop and return error to client
                wb.close()
                try:
                    os.unlink(tmp_path)
                except Exception:
                    pass
                return jsonify({'error': f'Export exceeds maximum allowed rows ({EXPORT_MAX_ROWS})'}), 413
            # convert values to safe types (strings for blobs etc)
            safe_row = [None if v is None else (v if isinstance(v, (int, float, bool)) else str(v)) for v in row]
            ws.append(safe_row)

        wb.save(tmp_path)
        wb.close()

        # Stream file and remove after streaming
        filename = f"export_{int(time.time())}.xlsx"

        def stream_file(path):
            try:
                with open(path, 'rb') as f:
                    chunk = f.read(8192)
                    while chunk:
                        yield chunk
                        chunk = f.read(8192)
            finally:
                try:
                    os.unlink(path)
                except Exception:
                    pass

        from flask import Response
        headers = {
            'Content-Disposition': f'attachment; filename="{filename}"'
        }
        return Response(stream_file(tmp_path), mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', headers=headers)

    except Exception as e:
        return jsonify({'error': f'Export error: {str(e)}'}), 500


@app.errorhandler(404)
def not_found(e):
    return jsonify({
        'error': 'Endpoint not found'
    }), 404


@app.errorhandler(500)
def internal_error(e):
    return jsonify({
        'error': 'Internal server error'
    }), 500


if __name__ == '__main__':
    # Print startup message
    print("=" * 70)
    print("  DATASENSE NL2SQL API SERVER")
    print("=" * 70)
    print("\n🔌 Testing database connection...")
    connection_status = executor.test_connection()
    print(connection_status)
    print("\n🚀 Starting Flask API server...")
    print("📡 API will be available at: http://localhost:5001")
    print("=" * 70)
    print()
    
    # Run Flask app
    app.run(host='0.0.0.0', port=5001, debug=True)