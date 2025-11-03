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

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# API Configuration
API_KEY = os.getenv("LLAMA_API_KEY")
OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://192.168.11.10:11434/api/generate")

# Initialize query executor and validator
executor = QueryExecutor()
validator = QueryValidator()


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
    
    # Prepare the prompt for NL to SQL conversion with schema AND business context
    prompt = f"""You are a SQL expert for DataSense, an ice cream manufacturing and distribution company.

{BUSINESS_CONTEXT}

{DATABASE_SCHEMA}

IMPORTANT RULES:
1. Generate SQL queries ONLY using the tables and columns from the schema above
2. If the user's question is about tables/columns NOT in the schema, respond with: "ERROR: Please ask questions related to the datasense database schema only."
3. Understand the business context - orders flow to invoices, stock is managed via inventory_transactions, returns and refunds are separate from original records
4. For financial calculations:
   - Net Revenue = invoice total_amount - returned amounts
   - Outstanding = invoice total_amount - sum of payments
   - Use LEFT JOINs when data might not exist (e.g., not all invoices have returns)
5. For status queries, remember the business flows (placed→invoiced, pending→processed, etc.)
6. Return ONLY the SQL query without any explanation, markdown formatting, or additional text
7. Use proper table and column names exactly as defined in the schema
8. Use appropriate JOINs when multiple tables are needed

Natural Language Query: {natural_language_query}

SQL:"""
    
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    
    try:
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=100)
        
        if response.status_code == 200:
            result = response.json()
            
            # Extract SQL query from Ollama response
            if 'response' in result:
                sql_query = result['response'].strip()
                
                # Clean up the response - remove markdown code blocks if present
                if sql_query.startswith('```'):
                    lines = sql_query.split('\n')
                    sql_query = '\n'.join([line for line in lines if not line.startswith('```')])
                    sql_query = sql_query.strip()
                
                return sql_query
            else:
                return f"Error: Unexpected response format from LLM"
        else:
            return f"Error: API returned status code {response.status_code}"
            
    except Exception as e:
        return f"Error: {str(e)}"


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint - test database connection"""
    connection_status = executor.test_connection()
    
    if "successful" in connection_status:
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'message': connection_status
        }), 200
    else:
        return jsonify({
            'status': 'unhealthy',
            'database': 'disconnected',
            'message': connection_status
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
        
        # Step 3: Execute query
        success, data, columns = executor.db.execute_query(cleaned_query)
        
        if not success:
            return jsonify({
                'error': f"Query execution failed: {data}",
                'sql_query': sql_query
            }), 400
        
        # Step 4: Format results
        if columns:
            # SELECT query with results
            results = []
            for row in data:
                row_dict = {}
                for i, col in enumerate(columns):
                    # Convert to JSON-serializable format
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
                'success': True
            }), 200
        else:
            # Non-SELECT query
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
    Export results to CSV (optional feature)
    For now, just returns success - can implement file download later
    """
    try:
        data = request.get_json()
        
        if not data or 'results' not in data:
            return jsonify({
                'error': 'Missing "results" in request body'
            }), 400
        
        # For now, just acknowledge the request
        # In production, you might want to generate a CSV file and return a download link
        return jsonify({
            'message': 'Export feature coming soon',
            'success': True
        }), 200
    
    except Exception as e:
        return jsonify({
            'error': f'Export error: {str(e)}'
        }), 500


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