# DataSense - Natural Language to SQL

A Natural Language to SQL system with a modern web interface for the DataSense ice cream distribution database.

## 🚀 Features

- 💬 Natural language to SQL conversion using AI
- 🌐 Modern Next.js web interface
- 🔒 Read-only mode with query validation
- 📊 Table-formatted results with CSV export
- 🌓 Dark/Light mode
- 📱 Responsive design

## 📁 Structure

```
DataSense/
├── nl2sql/           # Flask Backend API
└── frontend/         # Next.js Frontend
```

## ⚡ Quick Start

### 1. Start Backend
```powershell
cd nl2sql
.\venv\Scripts\activate
python app.py
# Runs on http://localhost:5001
```

### 2. Start Frontend
```powershell
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### 3. Open Browser
Navigate to **http://localhost:3000**

## 📦 Installation

### Backend
```powershell
cd nl2sql
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend
```powershell
cd frontend
npm install
```


## � Example Queries

- "Show all distributors"
- "List all products with current stock"
- "Show recent orders from this month"
- "Calculate total revenue by distributor"
- "Find products with low stock levels"
- "Show pending returns"

## � Configuration

Create `.env` file in `nl2sql/`:
```env
OLLAMA_API_URL=http://192.168.11.10:11434/api/generate
DB_HOST=10.101.13.28
DB_PORT=6507
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=datasense
```

## 🐛 Troubleshooting

**Backend not connecting to database?**
- Check `.env` file credentials

**Frontend can't reach backend?**
- Ensure backend is running on http://localhost:5001

**Port already in use?**
- Kill the process or change the port

## �️ Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Flask 3.0, Python
- **Database:** MySQL
- **AI:** Ollama (Llama 3 8B)

---

*Made for DataSense Ice Cream Distribution*
