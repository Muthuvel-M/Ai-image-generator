# AI Video Generator - Setup Guide

A free, open-source AI-powered application featuring semantic search, image generation, and video generation capabilities (coming soon).

## 🚀 Quick Start

### Prerequisites

Before you begin, make sure you have installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.9 or higher) - [Download here](https://www.python.org/)
- **Git** - [Download here](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Muthuvel-M/Ai-image-generator.git
cd Ai-image-generator
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Setup Python Backend

#### Create Virtual Environment

```bash
cd backend
python3 -m venv venv
```

#### Activate Virtual Environment

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
venv\Scripts\activate
```

#### Install Python Packages

```bash
pip install -r requirements.txt
```

**Note**: This may take 5-10 minutes on first install as it downloads AI models (~2GB).

### 4. Populate the Knowledge Base

```bash
python populate_db.py
```

This will load 49 tech-related documents into the vector database.

### 5. Run the Application

You need **TWO terminal windows**:

#### Terminal 1 - Backend Server

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python mcp_server.py
```

You should see:
```
INFO: Documents in database: 49
INFO: Uvicorn running on http://0.0.0.0:8000
```

#### Terminal 2 - Frontend

```bash
npm run dev
```

You should see:
```
Ready on http://localhost:3000
```

### 6. Open the App

Visit: **http://localhost:3000**

## ✨ Features

### Current (Challenge 1 - Complete)

- **🔍 Semantic Search**: AI-powered knowledge base search
  - 49 tech documents indexed
  - Understands meaning, not just keywords
  - Shows relevance scores
  - Feedback system with thumbs up/down

### Coming Soon

- **🎨 Image Generation** (Challenge 2)
- **🎬 Video Generation** (Challenge 3)

## 🧪 Testing the Search

1. Click the **"Search AI"** quick action button
2. Or type: "What is quantum computing?"
3. See 5 AI-powered search results
4. Rate with 👍 or 👎
5. If you click 👎, you can explain what needs improvement

## 📁 Project Structure

```
Ai-image-generator/
├── backend/              # Python backend (FastAPI + ChromaDB)
│   ├── mcp_server.py     # API server
│   ├── vector_db.py      # Vector database logic
│   ├── populate_db.py    # Data loader
│   └── venv/             # Python virtual environment (created by you)
├── app/                  # Next.js pages
│   ├── page.jsx          # Homepage
│   └── search/           # Search page (standalone)
├── components/           # React components
│   └── ai-chat-screen.jsx # Main chat UI
├── data/                 # Persistent data storage
│   └── chromadb/         # Vector database files
└── package.json          # Node.js dependencies
```

## 🛠️ Troubleshooting

### Backend won't start?

**Problem**: `ModuleNotFoundError: No module named 'chromadb'`

**Solution**:
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### Port already in use?

**Problem**: `Address already in use` on port 8000 or 3000

**Solution**:
```bash
# Find and kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Search returns no results?

**Problem**: Backend shows `Documents in database: 0`

**Solution**:
```bash
cd backend
source venv/bin/activate
python populate_db.py
```

### Frontend can't connect to backend?

**Problem**: "Failed to fetch" errors in browser console

**Solution**:
1. Make sure backend is running: `curl http://localhost:8000`
2. Check CORS settings in `backend/mcp_server.py`
3. Restart both servers

## 🔧 Development

### Backend API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/api/search` | POST | Semantic search |
| `/api/feedback` | POST | Save user feedback |
| `/api/stats` | GET | Get system stats |

### Environment Variables

Create `.env` file in root (optional):

```env
# Backend
BACKEND_PORT=8000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📊 System Requirements

### Minimum
- **RAM**: 8GB
- **Storage**: 20GB free space
- **CPU**: Any modern processor

### Recommended
- **RAM**: 16GB
- **Storage**: 50GB free space
- **GPU**: Optional (speeds up processing 5-10x)

## 🌟 Technology Stack

**Frontend**:
- Next.js 14
- React
- Tailwind CSS

**Backend**:
- FastAPI (Python)
- ChromaDB (Vector Database)
- Sentence Transformers (AI Embeddings)
- SQLite (Feedback Storage)

**AI Models** (All Free & Open Source):
- `all-MiniLM-L6-v2` - Semantic search embeddings
- More coming in Challenge 2 & 3

## 💰 Cost

**$0/month** - Everything runs locally on your machine!

## 📝 Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server

# Backend
python mcp_server.py # Start API server
python populate_db.py # Load knowledge base
```
