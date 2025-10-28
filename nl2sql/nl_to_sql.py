"""
Natural Language to SQL Query Generator with Execution
Usage: python nl_to_sql.py
"""

import requests
import json
import os
from dotenv import load_dotenv
from query_executor import QueryExecutor
from query_validator import QueryValidator
from business_context import BUSINESS_CONTEXT

# Load environment variables
load_dotenv()

# API Configuration
API_KEY = os.getenv("LLAMA_API_KEY")
OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://192.168.11.10:11434/api/generate")

# Load database schema
def load_schema():
    """Load the fixed database schema from JSON file"""
    try:
        with open('database_schema.json', 'r') as f:
            schema_data = json.load(f)
        return format_schema_for_prompt(schema_data)
    except FileNotFoundError:
        return "Schema file not found. Please ensure database_schema.json exists."

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

DATABASE_SCHEMA = load_schema()

def generate_sql(natural_language_query):
    """
    Convert natural language to SQL query using Ollama LLM with database schema and business context
    
    Args:
        natural_language_query (str): The natural language question
    
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
        "model": "llama3:8b",
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
                # Debug: Show what we actually received
                return f"Error: Unexpected response format. Got: {json.dumps(result)}"
        else:
            return f"Error: API returned status code {response.status_code} - {response.text}"
            
    except Exception as e:
        return f"Error: {str(e)}"


def main():
    """
    Main function - takes input, generates SQL, and optionally executes
    """
    
    # Initialize query executor
    executor = QueryExecutor()
    validator = QueryValidator()
    
    # Test database connection at startup
    print("=" * 70)
    print("  DATASENSE - Natural Language to SQL")
    print("=" * 70)
    print("\n🔌 Testing database connection...")
    connection_status = executor.test_connection()
    print(connection_status)
    print()
    
    try:
        while True:
            # Get natural language input from user
            natural_language_query = input("Enter your question (or 'exit' to quit):\n")
            
            # Check if user wants to exit
            if natural_language_query.lower() in ['exit', 'quit', 'q']:
                break
            
            # Skip empty input
            if not natural_language_query.strip():
                continue
            
            # Generate SQL using LLM
            sql_query = generate_sql(natural_language_query)
            
            # Check if it's an error message from LLM
            if sql_query.startswith("ERROR:"):
                print("=" * 70)
                print(sql_query)
                print("=" * 70)
                print()
                continue
            
            # Display generated SQL
            print("=" * 70)
            print("Generated SQL:")
            print("-" * 70)
            print(sql_query)
            print("=" * 70)
            print()
            
            # Ask user if they want to execute
            execute_choice = input("Execute this query? (yes/no): ").strip().lower()
            
            if execute_choice in ['yes', 'y']:
                # Clean and validate query
                cleaned_query = validator.clean_query(sql_query)
                
                # Execute query
                print()
                print("🔄 Executing query...")
                print()
                result = executor.execute_with_validation(cleaned_query)
                print(result)
            else:
                print("⏭️  Query not executed.")
            
            print()
    
    except KeyboardInterrupt:
        print("\n\n👋 Goodbye!")
    finally:
        # Close database connection
        executor.close()


if __name__ == "__main__":
    main()

