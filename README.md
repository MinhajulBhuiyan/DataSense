# DataSense - Natural Language to SQL

A Natural Language to SQL system with a modern web interface for the DataSense ice cream distribution database.

## Features

- Natural language to SQL conversion using AI
- Modern Next.js web interface
- Read-only mode with query validation
- Table-formatted results with CSV export
- Data visualization with dynamic charts
- Responsive design

## Structure

```
````markdown
# DataSense - Natural Language to SQL

A Natural Language to SQL system with a modern web interface for the DataSense ice cream distribution database.

## Features

- Natural language to SQL conversion using AI
- Modern Next.js web interface
- Read-only mode with query validation
- Table-formatted results with CSV export
- Data visualization with dynamic charts
- Responsive design

## Structure

```
DataSense/
├── frontend/
│   ├── app/                      # Next.js app router (pages & routes)
│   │   ├── examples/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx               # Main chat interface
│   ├── components/                # React UI components
│   ├── hooks/                     # Custom React hooks
│   ├── utils/                     # Helpers, constants, chart analyzer
│   └── package.json
│
├── orchestrator/                  # Backend API (Flask)
│   ├── app.py                     # Main Flask API server
│   ├── business_context.py
│   ├── database_schema.json
│   ├── db_connector.py
│   ├── query_executor.py
│   ├── query_validator.py
│   ├── query_store.py
│   ├── requirements.txt
│   └── training/                  # Optional LoRA training artifacts
│
└── README.md
```

## Quick Start

### 1. Start Backend
```powershell
cd orchestrator
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Wait for: "API will be available at: http://localhost:5001"

### 2. Start Frontend
```powershell
cd frontend
npm install
npm run dev
```

### 3. Open Browser
Navigate to: http://localhost:3000

## Installation (local dev)

### Backend
```powershell
cd orchestrator
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend
```powershell
cd frontend
npm install
```

## Configuration

Create a `.env` file inside `orchestrator/` with your DB and LLM settings (example):
```env
OLLAMA_API_URL=http://ip/api/generate
DB_HOST=your-host-ip
DB_PORT=your-host-port
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=datasense
```

## Troubleshooting

- Backend not connecting to database? Check `.env` credentials and network access to the DB.
- Frontend can't reach backend? Ensure backend is running at http://localhost:5001 and API_BASE_URL in `frontend/utils/constants.ts` matches.
- Port already in use? Kill the process or change the port.

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Backend: Flask 3.0, Python
- Database: MySQL
- AI: Ollama (Llama 3 8B)

---

*Made by Minhajul and Mahin*

````
