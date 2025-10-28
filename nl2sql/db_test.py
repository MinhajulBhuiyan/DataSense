"""Detailed DB connectivity diagnostics.
Run: python detailed_db_test.py
"""
import os, socket, sys, traceback, time
from dotenv import load_dotenv

load_dotenv()
DB_HOST = os.getenv('DB_HOST')
DB_PORT = int(os.getenv('DB_PORT', '3306'))
DB_USER = os.getenv('DB_USER')
DB_PWD  = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')

print('='*60)
print('Detailed DB connectivity diagnostic')
print(time.strftime('%Y-%m-%d %H:%M:%S'))
print('='*60)
print(f'DB config: host={DB_HOST} port={DB_PORT} user={DB_USER} db={DB_NAME}')
print('DB password:','(set)' if DB_PWD else '(not set)')

# Resolve hostname
try:
    infos = socket.getaddrinfo(DB_HOST, DB_PORT)
    addrs = sorted({x[4][0] for x in infos})
    print('\nDNS resolution:')
    for a in addrs:
        print(' -', a)
except Exception as e:
    print('\nDNS resolution failed:', e)

# Test TCP connect using raw socket
def test_socket(host, port, timeout=5):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(timeout)
    try:
        s.connect((host, port))
        s.close()
        return True, 'connected'
    except Exception as e:
        return False, str(e)

print('\nTCP connection test (direct):')
ok, msg = test_socket(DB_HOST, DB_PORT, timeout=5)
print(' -', DB_HOST, DB_PORT, '->', 'OK' if ok else 'FAIL', msg)

# If direct fails, try common SSH port used in workbench (6507)
SSH_PORTS = [6507, 22]
if not ok:
    print('\nDirect DB connect failed. Checking SSH ports (6507,22) on the same host...')
    for p in SSH_PORTS:
        ssh_ok, ssh_msg = test_socket(DB_HOST, p, timeout=5)
        print(f' - SSH port {p}:', 'open' if ssh_ok else 'closed/filtered', ssh_msg)

# Attempt a real DB connection (pymysql if available)
print('\nAttempting DB driver connection (pymysql):')
try:
    import pymysql
    try:
        conn = pymysql.connect(host=DB_HOST, port=DB_PORT, user=DB_USER, password=DB_PWD, database=DB_NAME, connect_timeout=5)
        cur = conn.cursor()
        cur.execute('SELECT VERSION()')
        print(' - pymysql: connected, version =', cur.fetchone())
        cur.close(); conn.close()
    except Exception as e:
        print(' - pymysql connection failed:')
        traceback.print_exc()
except Exception as e:
    print(' - pymysql not installed or import failed:', e)

print('\nSummary & next steps:')
if ok:
    print(' - Direct TCP to DB host:port succeeded. If pymysql failed, check credentials and DB user grants.')
else:
    print(' - Direct TCP failed. The server is likely not reachable directly from your machine.')
    print(' - Workbench used "TCP over SSH" which creates an SSH tunnel. To replicate:')
    print('   ssh -L 3307:127.0.0.1:3306 minhaj@10.101.13.28 -p 6507')
    print('   then set DB_HOST=127.0.0.1 DB_PORT=3307 in .env and retry.')

print('\nDone.')
