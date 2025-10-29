# DataSense - Natural Language to SQL with Web Interface

A complete Natural Language to SQL system with a modern web interface for the DataSense MySQL database. **Business context aware** for accurate, business-logic-driven query generation.

## 🚀 Features

✅ **Modern Web Interface** - Beautiful Next.js frontend with real-time query results  
✅ **REST API Backend** - Flask API server for seamless frontend-backend communication  
✅ **Natural Language Processing** - Convert plain English questions to SQL queries  
✅ **Business Context Aware** - Understands DataSense ice cream distribution business logic  
✅ **Schema-Aware** - Uses fixed datasense database schema for accurate query generation  
✅ **Query Execution** - Execute generated queries on MySQL database  
✅ **Safety First** - Read-only mode with query validation  
✅ **Beautiful Results** - Table-formatted results with export to CSV  
✅ **Error Handling** - Comprehensive error messages and validation  

## 📁 Project Structure

```
datasense/
├── nl2sql/                   # Backend API Server
│   ├── app.py               # Flask API server
│   ├── db_connector.py      # Database connection handler
│   ├── query_executor.py    # Query execution and formatting
│   ├── query_validator.py   # Query safety validation
│   ├── business_context.py  # Business logic context loader
│   ├── database_schema.json # Database schema (JSON format)
│   ├── datasense.md        # Business process documentation
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Environment variables (not in git)
│
└── frontend/                # Next.js Web Interface
    ├── app/
    │   ├── page.tsx        # Main chat interface
    │   ├── layout.tsx      # App layout
    │   └── globals.css     # Global styles
    ├── package.json
    └── next.config.ts
```

## 🛠️ Requirements

- Python 3.7+
- Node.js 18+
- MySQL Database (accessible at 10.101.13.28:6507)
- Ollama LLM Server (running llama3:8b model)
- Internet connection

## 📦 Installation

### Backend Setup

1. **Navigate to backend directory:**
   ```powershell
   cd nl2sql
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

### Frontend Setup

1. **Navigate to frontend directory:**
   ```powershell
   cd ..\frontend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

## 🚀 Running the Application

### Start Backend API Server

1. **Navigate to nl2sql directory and activate venv:**
   ```powershell
   cd nl2sql
   .\venv\Scripts\activate
   ```

2. **Run Flask API server:**
   ```powershell
   python app.py
   ```

   Server will start at: **http://localhost:5001**

   You should see:
   ```
   ==================================================================
     DATASENSE NL2SQL API SERVER
   ==================================================================
   
   🔌 Testing database connection...
   ✅ Database connection successful!
   
   🚀 Starting Flask API server...
   📡 API will be available at: http://localhost:5001
   ==================================================================
   ```

### Start Frontend

1. **Open a new terminal and navigate to frontend:**
   ```powershell
   cd frontend
   ```

2. **Run development server:**
   ```powershell
   npm run dev
   ```

   Frontend will start at: **http://localhost:3000**

3. **Open browser:**
   Navigate to http://localhost:3000

## 🎯 Usage

1. Open http://localhost:3000 in your browser
2. Type your question in natural language (e.g., "Show all distributors")
3. The system will:
   - Convert your question to SQL using AI
   - Validate the query for safety
   - Execute it on the database
   - Display results in a beautiful table
4. Export results to CSV if needed

## 🌐 API Endpoints

The Flask backend provides the following REST API endpoints:

### `GET /api/health`
Health check and database connection test
```json
{
  "status": "healthy",
  "database": "connected",
  "message": "Database connection successful!"
}
```

### `GET /api/schema`
Get database schema information
```json
{
  "schema": "...",
  "database": "datasense",
  "tables": [...]
}
```

### `POST /api/query`
Convert natural language to SQL and execute

**Request:**
```json
{
  "prompt": "Show all distributors"
}
```

**Response:**
```json
{
  "sql_query": "SELECT * FROM distributors",
  "results": [...],
  "columns": ["id", "name", "address"],
  "row_count": 10,
  "success": true
}
```

## 💡 Example Queries

Try these example queries in the web interface:

**Basic Queries:**
- "Show all distributors"
- "List all products"
- "Show recent orders"

**Business Queries:**
- "Calculate net revenue for each distributor"
- "Show invoices with outstanding balance"
- "Find products with low stock"
- "Show top selling products"

**Financial Queries:**
- "Total revenue this month"
- "Pending payments by distributor"
- "Refunds issued this week"

**Complex Queries:**
- "Show distributors who haven't ordered in 30 days"
- "Calculate average delivery time by distributor"
- "Find most returned products"

## 🔒 Security Features

- **Read-only Mode**: Only SELECT queries are allowed
- **Query Validation**: All queries are validated before execution
- **SQL Injection Protection**: Dangerous patterns are blocked
- **CORS Protection**: API is configured for secure cross-origin requests

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Failed:**
- Check `.env` file has correct credentials
- Verify database server is accessible
- Check firewall settings

**LLM Not Responding:**
- Verify Ollama server is running at configured URL
- Check OLLAMA_API_URL in `.env`
- Test with: `curl http://192.168.11.10:11434/api/generate`

**Port Already in Use:**
- Change port in `app.py`: `app.run(port=5002)`
- Update frontend API_URL accordingly

### Frontend Issues

**Cannot Connect to Backend:**
- Ensure backend is running at http://localhost:5001
- Check browser console for CORS errors
- Verify API_URL in `frontend/app/page.tsx`

**npm install Fails:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Try `npm install --legacy-peer-deps`

## 📝 Configuration

### Backend Configuration (`.env`)

```env
# LLM API Configuration
LLAMA_API_KEY=your-api-key
OLLAMA_API_URL=http://192.168.11.10:11434/api/generate

# Database Configuration
DB_HOST=10.101.13.28
DB_PORT=6507
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=datasense
```

### Frontend Configuration

API endpoint is configured in `frontend/app/page.tsx`:
```typescript
const API_URL = 'http://localhost:5001/api';
```

## 🎨 Features

### Frontend Features
- 🌓 Dark/Light mode toggle
- 💬 Chat-style interface
- 📊 Table view for results
- 📥 CSV export
- 📱 Responsive design
- ⚡ Real-time query execution
- 🎯 Example queries for quick start
- 📖 Database schema viewer

### Backend Features
- 🤖 AI-powered SQL generation
- ✅ Query validation
- 🔒 Security checks
- 📊 Result formatting
- 🚀 Fast execution
- 📝 Comprehensive error messages
- 🔄 Connection pooling
- 🎯 Business context awareness

## 🤝 Contributing

This is an internal project for DataSense. For questions or issues, contact the development team.

## 📄 License

Internal use only - DataSense Ice Cream Distribution System

## 🙏 Acknowledgments

- Ollama for LLM inference
- Flask for API framework
- Next.js for frontend framework
- Tailwind CSS for styling

---

**Made with ❤️ for DataSense**
