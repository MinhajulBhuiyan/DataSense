"""Quick diagnostic script to test all connections"""
import os
import sys
from dotenv import load_dotenv
import requests

load_dotenv()

print("=" * 60)
print("DATASENSE CONNECTION DIAGNOSTIC")
print("=" * 60)

# Test 1: Environment variables
print("\n[1] Checking environment variables...")
ollama_url = os.getenv("OLLAMA_API_URL")
db_host = os.getenv("DB_HOST")
print(f"   OLLAMA_API_URL: {ollama_url}")
print(f"   DB_HOST: {db_host}")

if not ollama_url:
    print("   ❌ OLLAMA_API_URL not set!")
    sys.exit(1)

# Test 2: Ollama server connectivity
print("\n[2] Testing Ollama server connection...")
try:
    base_url = ollama_url.replace('/api/generate', '')
    response = requests.get(f"{base_url}/api/tags", timeout=5)
    if response.ok:
        models = response.json().get('models', [])
        print(f"   ✓ Ollama server is UP")
        print(f"   Available models: {[m['name'] for m in models]}")
    else:
        print(f"   ❌ Ollama returned status {response.status_code}")
except requests.exceptions.Timeout:
    print(f"   ❌ Ollama server TIMEOUT (>5s)")
    print(f"   → Server is too slow or down")
except Exception as e:
    print(f"   ❌ Cannot reach Ollama: {e}")

# Test 3: Test a quick generation
print("\n[3] Testing actual model generation...")
try:
    payload = {
        "model": "llama3:8b",
        "prompt": "Reply with just 'OK'",
        "stream": False
    }
    print(f"   Sending request to: {ollama_url}")
    response = requests.post(ollama_url, json=payload, timeout=10)
    if response.ok:
        result = response.json()
        print(f"   ✓ Model responded successfully")
        print(f"   Response: {result.get('response', '')[:50]}")
    else:
        print(f"   ❌ Model returned status {response.status_code}")
except requests.exceptions.Timeout:
    print(f"   ❌ Model TIMEOUT (>10s)")
    print(f"   → Model is loading or server is overloaded")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test 4: Database connection
print("\n[4] Testing database connection...")
try:
    import pymysql
    conn = pymysql.connect(
        host=os.getenv('DB_HOST'),
        port=int(os.getenv('DB_PORT', 3306)),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM orders")
    count = cursor.fetchone()[0]
    print(f"   ✓ Database connected")
    print(f"   Orders count: {count}")
    conn.close()
except Exception as e:
    print(f"   ❌ Database error: {e}")

print("\n" + "=" * 60)
print("DIAGNOSTIC COMPLETE")
print("=" * 60)
