# DataSense - Natural Language to SQL Query System

A Natural Language to SQL converter with query execution capabilities for the DataSense MySQL database. **Now with business context awareness** for accurate, business-logic-driven query generation.

## Features

✅ **Natural Language Processing** - Convert plain English questions to SQL queries  
✅ **Business Context Aware** - Understands DataSense ice cream distribution business logic  
✅ **Schema-Aware** - Uses fixed datasense database schema for accurate query generation  
✅ **Query Execution** - Execute generated queries on MySQL database  
✅ **Safety First** - Read-only mode with query validation  
✅ **Result Formatting** - Beautiful table-formatted results  
✅ **Error Handling** - Comprehensive error messages and validation  

## What's New: Business Context Training

The LLM is now trained with DataSense business knowledge from `datasense.md`:

- **Order-to-Invoice Flow** - Understands placed → invoiced → delivered lifecycle
- **Inventory Management** - Knows how stock is added/deducted via transactions
- **Financial Calculations** - Correctly computes net revenue, outstanding payments
- **Returns & Refunds** - Understands immutable records and adjustment logic
- **Status Progressions** - Follows business rules for status changes
- **Business Terminology** - Interprets distributor, challan, load plan concepts

### Example Business-Aware Queries:

**Query:** "Calculate net revenue for each distributor"  
**LLM understands:** Net revenue = invoice total - returns, needs LEFT JOIN for returns

**Query:** "Show invoices with outstanding balance"  
**LLM understands:** Outstanding = total_amount - sum(payments)  

## Project Structure

```
nl2sql/
├── nl_to_sql.py              # Main application
├── db_connector.py           # Database connection handler
├── query_executor.py         # Query execution and formatting
├── query_validator.py        # Query safety validation
├── business_context.py       # Business logic context loader
├── database_schema.json      # Database schema (JSON format)
├── datasense.md             # Business process documentation (training data)
├── datasense.sql            # Database creation script
├── demo_queries.md          # 65+ example queries with business context
├── requirements.txt         # Python dependencies
├── .env                     # Environment variables (not in git)
├── .gitignore              # Git ignore rules
├── HOW_TO_RUN.txt          # Setup and usage instructions
└── README.md               # This file
```

## Requirements

- Python 3.7+
- MySQL Database (accessible at 10.101.13.28:6507)
- Ollama LLM Server (running llama3:8b model)
- Internet connection

## Installation

1. **Clone or navigate to project directory:**
   ```powershell
   cd c:\Users\Legion\Desktop\Internship\data-sense\nl2sql
   ```

2. **Create virtual environment:**
   ```powershell
   python -m venv venv
   ```

3. **Activate virtual environment:**
   ```powershell
   .\venv\Scripts\activate
   ```

4. **Install dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```

## Configuration

All configuration is stored in `.env` file:

```env
# LLM API Configuration
LLAMA_API_KEY=sk-e7284ee811994f869f508b0a46bcef98
OLLAMA_API_URL=http://192.168.11.10:11434/api/generate

# Database Configuration
DB_HOST=10.101.13.28
DB_PORT=6507
DB_USER=minhaj
DB_PASSWORD=BHU8(ijn3
DB_NAME=datasense
```

## Usage

1. **Run the application:**
   ```powershell
   python nl_to_sql.py
   ```

2. **Enter natural language query:**
   ```
   Enter your question: Show me all active distributors
   ```

3. **Review generated SQL:**
   ```sql
   SELECT * FROM distributors WHERE is_active = TRUE;
   ```

4. **Execute or skip:**
   ```
   Execute this query? (yes/no): yes
   ```

5. **View results in formatted table**

## Example Queries

See `demo_queries.md` for 50+ example queries including:

- **Distributor Queries:** Active distributors, contact info, etc.
- **Product Queries:** Stock levels, pricing, inventory
- **Order Queries:** Order status, amounts, dates
- **Invoice Queries:** Delivery status, amounts
- **Sales Returns:** Return tracking and processing
- **Payments & Refunds:** Payment methods, status
- **Complex Queries:** JOINs, aggregations, analytics

## Safety Features

🔒 **Read-Only Mode** - Only SELECT queries allowed  
🔒 **Query Validation** - Checks for dangerous SQL keywords  
🔒 **Pattern Detection** - Blocks SQL injection attempts  
🔒 **User Confirmation** - Asks before executing queries  
🔒 **Error Handling** - Graceful error messages  

## Database Schema

The system uses a fixed schema with 17 tables:
- distributors
- products
- orders
- order_items
- invoices
- invoice_items
- sales_returns
- return_items
- cancellations
- vehicles
- load_plans
- load_plan_items
- challans
- gate_passes
- payments
- refunds
- inventory_transactions

Schema details available in `database_schema.json` and `database_schema.txt`

## Dependencies

```
requests==2.31.0              # HTTP requests for LLM API
python-dotenv==1.0.0          # Environment variable management
mysql-connector-python==8.2.0 # MySQL database connector
tabulate==0.9.0              # Table formatting for results
```

## Troubleshooting

**Import errors after installation:**
```powershell
pip install --upgrade -r requirements.txt
```

**Database connection failed:**
- Check if MySQL server is accessible
- Verify credentials in .env file
- Check network connectivity to 10.101.13.28:6507

**LLM not responding:**
- Verify Ollama server is running
- Check OLLAMA_API_URL in .env
- Test with: `curl http://192.168.11.10:11434/api/tags`

**Query validation errors:**
- System only allows SELECT queries
- Avoid INSERT, UPDATE, DELETE operations
- Check for SQL injection patterns

## Development

**Test database connection:**
```python
from db_connector import DatabaseConnector
db = DatabaseConnector()
print(db.test_connection())
```

**Test query validation:**
```python
from query_validator import QueryValidator
validator = QueryValidator()
print(validator.is_safe_query("SELECT * FROM products"))
```

## License

Internal use only - DataSense Internship Project

## Author

Minhaj - DataSense Intern
Date: October 2025
```
