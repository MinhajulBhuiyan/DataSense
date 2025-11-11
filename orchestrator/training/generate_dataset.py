import re
import json
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SQL_INSERT = (ROOT.parent / 'Insert-datasense.sql')
SCHEMA_JSON = (ROOT.parent / 'database_schema.json')
OUT = ROOT / 'dataset.jsonl'

random.seed(42)

# Read insert file and extract quoted strings that look like product names
text = SQL_INSERT.read_text(encoding='utf-8')
# capture single-quoted tokens
tokens = re.findall(r"'([^']{2,120})'", text)
# filter out tokens that look like JSON or timestamps or tiny values
candidates = []
for t in tokens:
    if any(ch.isdigit() for ch in t) and len([c for c in t if c.isalpha()]) < 3:
        continue
    if t.startswith('{') or t.startswith('[') or t.endswith('}') or t.endswith(']'):
        continue
    if re.match(r"\d{4}-\d{2}-\d{2}", t):
        continue
    if t.upper().startswith('VALUES'):
        continue
    # reject short codes like '88003'
    if re.match(r"^\d+$", t):
        continue
    if len(t) < 3:
        continue
    candidates.append(t)

# heuristically pick product-like tokens by filtering common words
product_names = []
for t in candidates:
    # likely product names contain spaces or words like 'Vanilla', 'Mini', 'Cup', 'Sundae', 'Chocobar', 'Mango'
    if any(k in t for k in ['Vanilla','Mango','Chocobar','Crunchie','Kulfi','Cup','Sundae','Ikone','Choco','Doi','Kheer','Mini','Butterscotch','Caramel','Chocolate']):
        product_names.append(t)

# fallback: if not enough product names, pick deduped candidates
if len(product_names) < 30:
    product_names = list(dict.fromkeys(candidates))[:120]
else:
    product_names = list(dict.fromkeys(product_names))

# A small set of realistic distributor names (not present in insert file) - acceptable for training realism
distributors = [
    'Alpha Distributors', 'Beta Trading Co', 'Crescent Foods', 'Delta Ice Creams', 'ECO Supplies',
    'Fresh Dairy Ltd', 'Gulf Distributors', 'Horizon Traders'
]

# Load schema to verify table/column names
schema = json.loads(SCHEMA_JSON.read_text(encoding='utf-8'))
# build a map table -> columns
table_cols = {t['name']: [c['name'] for c in t['columns']] for t in schema['tables']}

# Templates for natural language and SQL
templates = []

# Simple selects
templates.append(("Show all distributors", "SELECT * FROM distributors;"))
templates.append(("Show active products", "SELECT product_id, name, unit_price, current_stock FROM products WHERE is_active = 1;"))

# Filters - product name
for prod in product_names[:20]:
    nl = f"Find product details for '{prod}'"
    sql = f"SELECT product_id, name, unit_price, current_stock FROM products WHERE name = '{prod}';"
    templates.append((nl, sql))

# Orders per distributor (aggregation)
for d in distributors:
    nl = f"Count total orders for {d}"
    sql = "SELECT o.distributor_id, COUNT(*) AS total_orders FROM orders o JOIN distributors d ON o.distributor_id = d.distributor_id WHERE d.name = '{}' GROUP BY o.distributor_id;".format(d)
    templates.append((nl, sql))

# Join invoices and items
for _ in range(15):
    p = random.choice(product_names)
    nl = f"List invoices that include product '{p}' with invoice date and total"
    sql = ("SELECT i.invoice_id, i.invoice_date, i.total_amount FROM invoices i "
           "JOIN invoice_items ii ON i.invoice_id = ii.invoice_id "
           f"JOIN products p ON ii.product_id = p.product_id WHERE p.name = '{p}';")
    templates.append((nl, sql))

# Aggregations: monthly revenue for a distributor
for d in distributors[:5]:
    nl = f"Monthly revenue for {d} for 2024"
    sql = ("SELECT DATE_FORMAT(i.invoice_date, '%Y-%m') AS month, SUM(ii.price_per_unit * ii.quantity_invoiced) AS revenue "
           "FROM invoices i JOIN invoice_items ii ON i.invoice_id = ii.invoice_id "
           "JOIN distributors d ON i.order_id = d.distributor_id "
           f"WHERE d.name = '{d}' AND i.invoice_date BETWEEN '2024-01-01' AND '2024-12-31' "
           "GROUP BY month ORDER BY month;")
    templates.append((nl, sql))

# Inventory queries
templates.append(("Products with current stock less than 100", "SELECT product_id, name, current_stock FROM products WHERE current_stock < 100;"))

# Stock rebuild
templates.append(("Rebuild stock per product from transactions", "SELECT product_id, SUM(CASE WHEN tx_type IN ('production_add','return_add') THEN quantity WHEN tx_type = 'sale_deduct' THEN -quantity ELSE 0 END) AS computed_stock FROM inventory_transactions GROUP BY product_id;"))

# Returns/refunds
templates.append(("List refunds for invoice 123", "SELECT * FROM refunds WHERE invoice_id = 123;"))

# Delivered vs invoiced
templates.append(("Show invoices where delivered quantity < invoiced quantity", "SELECT i.invoice_id, SUM(ii.quantity_invoiced) AS invoiced, SUM(ii.quantity_delivered) AS delivered FROM invoices i JOIN invoice_items ii ON i.invoice_id = ii.invoice_id GROUP BY i.invoice_id HAVING delivered < invoiced;"))

# Load plans and vehicle usage
templates.append(("Which vehicles had load plans in October 2024", "SELECT vehicle_id, COUNT(*) AS plans FROM load_plans WHERE plan_date BETWEEN '2024-10-01' AND '2024-10-31' GROUP BY vehicle_id;"))

# Payments and reconciliation
templates.append(("Outstanding invoice balance for invoice 200", "SELECT i.invoice_id, i.total_amount - COALESCE(SUM(p.amount),0) AS balance FROM invoices i LEFT JOIN payments p ON i.invoice_id = p.invoice_id WHERE i.invoice_id = 200 GROUP BY i.invoice_id;"))

# Denormalized table examples
templates.append(("Get denormalized order header for order 500", "SELECT * FROM detailed_order WHERE id = 500;"))

# Some random joins and filters
for _ in range(20):
    p = random.choice(product_names)
    nl = f"Top 5 distributors by quantity sold of '{p}'"
    sql = ("SELECT d.name, SUM(ii.quantity_invoiced) AS total_qty FROM invoice_items ii "
           "JOIN invoices i ON ii.invoice_id = i.invoice_id "
           "JOIN orders o ON i.order_id = o.order_id "
           "JOIN distributors d ON o.distributor_id = d.distributor_id "
           f"JOIN products p ON ii.product_id = p.product_id WHERE p.name = '{p}' GROUP BY d.name ORDER BY total_qty DESC LIMIT 5;")
    templates.append((nl, sql))

# Date range example
templates.append(("Show invoices from 2023-01-01 to 2023-01-31", "SELECT * FROM invoices WHERE invoice_date BETWEEN '2023-01-01' AND '2023-01-31';"))

# Avoid destructive commands
templates.append(("List tables in the database (information_schema)", "SELECT table_name FROM information_schema.tables WHERE table_schema = 'datasense';"))

# Ensure uniqueness and reasonable size
templates = list(dict.fromkeys(templates))
random.shuffle(templates)

# If too few templates, duplicate with small variations
while len(templates) < 120:
    t = random.choice(list(templates))
    nl = t[0]
    sql = t[1]
    # small variation: add WHERE is_active = 1 sometimes
    if 'FROM products' in sql and 'is_active' not in sql:
        sql = sql.replace(';', ' WHERE is_active = 1;')
        nl = nl + ' (active only)'
    templates.append((nl, sql))

# Write to JSONL with prompt and completion fields
with OUT.open('w', encoding='utf-8') as f:
    for nl, sql in templates:
        prompt = f"DATABASE: datasense\n\n" + "".join([f"TABLE: {t}\\n  - " + ", ".join(table_cols.get(t, [])[:6]) + '\\n' for t in ['orders','order_items','invoices','invoice_items','products','distributors']])
        prompt += "\nQUESTION: " + nl + "\n"
        completion = sql
        obj = {"prompt": prompt, "completion": completion}
        f.write(json.dumps(obj, ensure_ascii=False) + "\n")

print(f"Wrote {sum(1 for _ in OUT.open())} examples to {OUT}")
