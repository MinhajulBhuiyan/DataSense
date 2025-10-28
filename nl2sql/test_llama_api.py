"""
Simple script to test Llama/Ollama API connection for Natural Language to SQL conversion
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# API Configuration from environment variables
API_KEY = os.getenv("LLAMA_API_KEY")
OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://192.168.11.10:11434/api/chat")  # Default to chat endpoint

def test_nl_to_sql(natural_language_query):
    """
    Test the Ollama API by converting a natural language query to SQL
    
    Args:
        natural_language_query (str): The natural language question
    
    Returns:
        dict: API response with SQL query
    """
    
    # Prepare the prompt for NL to SQL conversion
    prompt = f"""Convert the following natural language query to SQL:

Natural Language: {natural_language_query}

Generate only the SQL query without any explanation."""
    
    # Ollama API payload format (different from OpenAI)
    payload = {
        "model": "llama3:8b",  # Use the available model from Ollama server
        "prompt": prompt,
        "stream": False
    }
    
    try:
        print(f"\n🔄 Testing API Connection...")
        print(f"📝 Natural Language Query: {natural_language_query}")
        print(f"🌐 Sending request to Ollama API...\n")
        
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=30)
        
        # Check if request was successful
        if response.status_code == 200:
            result = response.json()
            print("✅ API Connection Successful!")
            print(f"\n📊 Response:")
            print(json.dumps(result, indent=2))
            
            # Extract SQL query from Ollama response
            if 'response' in result:
                sql_query = result['response']
                print(f"\n🎯 Generated SQL Query:")
                print(f"{sql_query}")
            
            return result
        else:
            print(f"❌ API Error!")
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except requests.exceptions.Timeout:
        print("❌ Request timed out. Please check your internet connection.")
        return None
    except requests.exceptions.ConnectionError:
        print("❌ Connection error. Please check your internet connection and API URL.")
        return None
    except Exception as e:
        print(f"❌ An error occurred: {str(e)}")
        return None


def main():
    """
    Main function to test the API with sample queries
    """
    print("=" * 60)
    print("  OLLAMA API - NL to SQL Connection Test")
    print("=" * 60)
    
    # Check if environment variables are loaded
    if not API_KEY:
        print("❌ Error: LLAMA_API_KEY not found in .env file")
        return
    
    print(f"🔑 API Key loaded: {API_KEY[:10]}...")
    print(f"🌐 API URL: {OLLAMA_API_URL}")
    
    # Sample test queries
    test_queries = [
        "Show me all customers from New York",
        "Get the total sales for each product",
        "Find employees who joined after 2020"
    ]
    
    print("\n🧪 Running test with sample queries...\n")
    
    for i, query in enumerate(test_queries, 1):
        print(f"\n{'='*60}")
        print(f"Test #{i}")
        print(f"{'='*60}")
        result = test_nl_to_sql(query)
        
        if result:
            print(f"\n✅ Test #{i} passed!")
        else:
            print(f"\n❌ Test #{i} failed!")
        
        if i < len(test_queries):
            print("\n" + "-"*60)
    
    print("\n" + "="*60)
    print("  Testing Complete")
    print("="*60)


if __name__ == "__main__":
    main()
