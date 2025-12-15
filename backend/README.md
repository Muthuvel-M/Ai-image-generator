# AI Video Generator - Backend

Free and open-source AI video generator using semantic search.

## Setup Instructions

### 1. Create Python Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

**Note**: This will download ~2GB of models on first run. Be patient!

### 3. Populate Database

```bash
python populate_db.py
```

This will add 50+ tech knowledge documents to the vector database.

### 4. Start the Server

```bash
python mcp_server.py
```

The server will start on `http://localhost:8000`

## API Endpoints

- `GET /` - Health check
- `POST /api/search` - Semantic search
- `POST /api/feedback` - Log user feedback
- `GET /api/stats` - Get system statistics
- `POST /api/documents` - Add new documents

## Testing

Test the search API:

```bash
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "What is quantum computing?", "top_k": 3}'
```

## Next Steps

1. ✅ Challenge 1: Semantic Search (Complete)
2. 🔄 Challenge 2: Video Generation (Next)
3. ⏳ Challenge 3: Integration

Visit `http://localhost:3000/search` to use the search interface!
