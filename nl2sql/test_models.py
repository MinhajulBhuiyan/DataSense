"""
Test script to verify both Llama 3 8B and Qwen 2.5 Coder models are working correctly
"""

import requests
import json
import time
from datetime import datetime

# Configuration
OLLAMA_API_URL = "http://192.168.11.10:11434/api/generate"
BACKEND_API_URL = "http://localhost:5001/api/query"

# Test queries: 10 concise mixed prompts (to the point)
TEST_QUERIES = [
    "show me all distributors",
    "show me all products",
    "which products have low stock",
    "show recent orders",
    "show cancelled orders",
    "what is our total revenue",
    "show unpaid invoices",
    "show me all returns",
    "what are our best selling products",
    "show me recent payments"
]

def test_ollama_model_direct(model_name):
    """
    Test Ollama model directly (without backend)
    """
    print(f"\n{'='*80}")
    print(f"Testing {model_name} directly via Ollama API")
    print(f"{'='*80}\n")
    
    test_prompt = "Write a simple SQL query to select all records from a table called 'users'"
    
    payload = {
        "model": model_name,
        "prompt": test_prompt,
        "stream": False
    }
    
    try:
        start_time = time.time()
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=120)
        elapsed_time = time.time() - start_time
        
        if response.status_code == 200:
            result = response.json()
            sql_response = result.get('response', 'No response')
            
            print(f"✅ SUCCESS - Model: {model_name}")
            print(f"   Response time: {elapsed_time:.2f}s")
            print(f"   Response preview: {sql_response[:200]}...")
            return True
        else:
            print(f"❌ FAILED - Status code: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR - {str(e)}")
        return False

def test_backend_with_model(model_name, query):
    """
    Test model through DataSense backend API
    """
    payload = {
        "prompt": query,
        "model": model_name
    }
    
    try:
        start_time = time.time()
        response = requests.post(BACKEND_API_URL, json=payload, timeout=180)
        elapsed_time = time.time() - start_time

        if response.status_code == 200:
            data = response.json()
            sql_query = data.get('sql_query', '') or 'No SQL generated'
            row_count = data.get('row_count', None)
            error = data.get('error')

            return {
                'success': True,
                'model': model_name,
                'query': query,
                'time': elapsed_time,
                'sql': sql_query,
                'rows': row_count,
                'error': error
            }
        else:
            try:
                data = response.json()
                error = data.get('error', response.text)
            except Exception:
                error = response.text
            return {
                'success': False,
                'model': model_name,
                'query': query,
                'time': elapsed_time,
                'sql': '',
                'rows': None,
                'error': error
            }

    except Exception as e:
        return {
            'success': False,
            'model': model_name,
            'query': query,
            'time': None,
            'sql': '',
            'rows': None,
            'error': str(e)
        }


def analyze_sql_features(sql_text: str):
    """Return a list of simple, heuristic features found in the generated SQL.

    This is intentionally lightweight: it searches for common SQL keywords
    like JOIN, GROUP BY, WHERE, ORDER BY, LIMIT and aggregate functions.
    """
    s = sql_text.upper()
    features = []
    if 'JOIN' in s:
        features.append('JOIN')
    if 'GROUP BY' in s:
        features.append('GROUP_BY')
    if 'ORDER BY' in s:
        features.append('ORDER_BY')
    if 'WHERE' in s:
        features.append('WHERE')
    if 'LIMIT' in s:
        features.append('LIMIT')
    if 'SUM(' in s or 'COUNT(' in s or 'AVG(' in s or 'MIN(' in s or 'MAX(' in s:
        features.append('AGGREGATE')
    if 'EXPLAIN' in s or 'DESCRIBE' in s:
        features.append('META')
    if 'INSERT' in s or 'UPDATE' in s or 'DELETE' in s:
        features.append('MUTATION')
    return features

def main():
    """
    Run all model tests
    """
    print("\n" + "="*80)
    print("DataSense Model Testing Suite")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*80)
    
    # Prepare live posting to frontend
    logs = []
    def post_update(state: str):
        # read all_results safely in case it's not yet defined in this scope
        current_results = globals().get('all_results', [])
        payload = {
            'state': state,
            'logs': logs,
            'results': current_results,
            'summary': {}
        }
        try:
            requests.post('http://localhost:3000/api/test_models', json=payload, timeout=2)
        except Exception:
            pass

    # Test 1: Direct Ollama API tests
    print("\n" + "="*80)
    print("PHASE 1: Direct Ollama API Tests")
    print("="*80)
    logs.append('PHASE 1: Direct Ollama API Tests')
    post_update('phase1-start')

    llama_direct = test_ollama_model_direct("llama3:8b")
    logs.append(f"llama3:8b direct available: {llama_direct}")
    post_update('phase1-llama-done')
    qwen_direct = test_ollama_model_direct("qwen2.5-coder")
    logs.append(f"qwen2.5-coder direct available: {qwen_direct}")
    post_update('phase1-qwen-done')
    
    # Test 2: Backend integration tests
    print("\n" + "="*80)
    print("PHASE 2: Backend Integration Tests")
    print("="*80)
    
    if not llama_direct and not qwen_direct:
        print("\n❌ Skipping backend tests - Ollama models not accessible")
        return
    
    # Check if backend is running
    try:
        health_response = requests.get("http://localhost:5001/api/health", timeout=5)
        if health_response.status_code != 200:
            print("\n❌ Backend not healthy. Please start the Flask server.")
            return
        print("\n✅ Backend is running and healthy\n")
    except Exception as e:
        print(f"\n❌ Cannot connect to backend at {BACKEND_API_URL}")
        print(f"   Error: {str(e)}")
        print("\n💡 Start backend with: cd nl2sql && python app.py")
        return
    
    # Test each query: run llama first, then qwen so results are directly comparable
    models_order = ['llama3:8b', 'qwen2.5-coder']
    available_models = [m for m in models_order if (m == 'llama3:8b' and llama_direct) or (m == 'qwen2.5-coder' and qwen_direct)]

    all_results = []

    for query in TEST_QUERIES:
        print(f"\n{'─'*80}")
        print(f"Query: {query}")
        print(f"{'─'*80}\n")

        for model in available_models:
            print(f"Running model: {model} ...")
            logs.append(f"Running model: {model} ...")
            post_update('model-start')
            res = test_backend_with_model(model, query)
            # annotate features heuristically
            sql_text = res.get('sql', '') if isinstance(res, dict) else ''
            features = analyze_sql_features(sql_text) if sql_text else []
            if isinstance(res, dict):
                res['features'] = features
            all_results.append(res)
            logs.append(f"Result - model: {model}, success: {res.get('success')}, time: {res.get('time')}")
            post_update('model-done')
            # small delay
            time.sleep(0.5)

    # Print a comparison table
    print('\n' + '='*100)
    print('COMPARISON TABLE (per query, models run in order: llama -> qwen)')
    print('='*100 + '\n')

    # Table header
    header = ['Query', 'Model', 'Time(s)', 'Rows', 'Status', 'Features', 'SQL (trim)']
    print('| ' + ' | '.join(header) + ' |')
    print('|' + '|'.join(['---']*len(header)) + '|')

    for r in all_results:
        # r may be None or dict
        if not isinstance(r, dict):
            continue
        q = r.get('query', '')
        model = r.get('model', '')
        time_s = f"{r.get('time'):.2f}" if r.get('time') is not None else 'N/A'
        rows = str(r.get('rows')) if r.get('rows') is not None else 'N/A'
        status = 'OK' if r.get('success') else f"ERR: {str(r.get('error'))[:60]}"
        features = ','.join(r.get('features', [])) if r.get('features') else '-'
        sql_trim = (r.get('sql') or '')[:80].replace('\n', ' ')
        print(f"| {q} | {model} | {time_s} | {rows} | {status} | {features} | {sql_trim} |")

    # Summarize per-model success counts
    summary = {}
    for r in all_results:
        if not isinstance(r, dict):
            continue
        m = r.get('model')
        summary.setdefault(m, {'success': 0, 'failed': 0, 'count': 0})
        summary[m]['count'] += 1
        if r.get('success'):
            summary[m]['success'] += 1
        else:
            summary[m]['failed'] += 1

    print('\n' + '='*80)
    print('SUMMARY')
    print('='*80)
    for m, s in summary.items():
        total = s['count']
        succ = s['success']
        failed = s['failed']
        rate = succ / total * 100 if total else 0
        print(f"Model: {m} — Success: {succ}/{total} ({rate:.1f}%), Failed: {failed}/{total}")
    
    # Send results to frontend (optional) so hidden page can display them
    frontend_endpoint = 'http://localhost:3000/api/test_models'
    payload = {
        'results': all_results,
        'summary': summary,
    }
    try:
        payload['logs'] = logs
        payload['state'] = 'finished'
        requests.post(frontend_endpoint, json=payload, timeout=5)
        print(f"\n✅ Posted results to frontend at {frontend_endpoint}")
    except Exception:
        print(f"\n⚠️  Could not post results to frontend at {frontend_endpoint} (is dev server running?)")

    print('\n' + '='*80)
    print('RECOMMENDATIONS')
    print('='*80)

    # Use the summary computed earlier to produce recommendations
    for m, s in summary.items():
        total = s['count']
        succ = s['success']
        rate = succ / total * 100 if total else 0
        if rate >= 80:
            print(f"\n✅ {m} looks healthy: {succ}/{total} successful ({rate:.1f}%).")
        elif rate >= 50:
            print(f"\n⚠️  {m} is partially successful: {succ}/{total} ({rate:.1f}%). Review failures.")
        else:
            print(f"\n❌ {m} failed most tests: {succ}/{total} ({rate:.1f}%). Check model availability or prompt design.")

    print('\n' + '='*80 + '\n')

if __name__ == "__main__":
    main()
