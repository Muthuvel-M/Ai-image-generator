"""
MCP Server - Model Context Protocol Server for Semantic Search
FastAPI backend exposing vector database search via REST API
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
from vector_db import VectorDatabase
import logging
import sqlite3
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AI Video Generator - MCP Server",
    description="Semantic search and video generation backend",
    version="1.0.0"
)

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize vector database
db = VectorDatabase()

# Initialize feedback database
conn = sqlite3.connect('feedback.db', check_same_thread=False)
cursor = conn.cursor()
cursor.execute('''
    CREATE TABLE IF NOT EXISTS search_feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query TEXT NOT NULL,
        result_id TEXT,
        clicked BOOLEAN DEFAULT 0,
        rating INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
''')
conn.commit()


# Pydantic models
class SearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5


class SearchResponse(BaseModel):
    query: str
    results: List[Dict]
    count: int


class FeedbackRequest(BaseModel):
    query: str
    result_id: str
    clicked: Optional[bool] = False
    rating: Optional[int] = None


class DocumentRequest(BaseModel):
    text: str
    doc_id: str
    metadata: Optional[Dict] = None


# API Endpoints
@app.get("/")
async def root():
    """Health check endpoint"""
    doc_count = db.count_documents()
    return {
        "status": "online",
        "service": "AI Video Generator MCP Server",
        "version": "1.0.0",
        "documents_count": doc_count
    }


@app.post("/api/search", response_model=SearchResponse)
async def semantic_search(request: SearchRequest):
    """
    Perform semantic search on the knowledge base
    
    - **query**: Search query text
    - **top_k**: Number of results to return (default: 5)
    """
    try:
        if not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        logger.info(f"Search query: {request.query}")
        results = db.search(request.query, request.top_k)
        
        return results
    except Exception as e:
        logger.error(f"Search error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/feedback")
async def log_feedback(feedback: FeedbackRequest):
    """
    Log user feedback for improving search results
    
    - **query**: The search query
    - **result_id**: ID of the result
    - **clicked**: Whether user clicked the result
    - **rating**: User rating (1-5)
    """
    try:
        cursor.execute(
            '''INSERT INTO search_feedback (query, result_id, clicked, rating, timestamp)
               VALUES (?, ?, ?, ?, ?)''',
            (feedback.query, feedback.result_id, feedback.clicked, 
             feedback.rating, datetime.now())
        )
        conn.commit()
        
        return {"status": "success", "message": "Feedback logged"}
    except Exception as e:
        logger.error(f"Feedback error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/feedback/stats")
async def get_feedback_stats():
    """Get feedback statistics"""
    try:
        # Top clicked results
        cursor.execute('''
            SELECT result_id, COUNT(*) as clicks, AVG(rating) as avg_rating
            FROM search_feedback
            WHERE clicked = 1
            GROUP BY result_id
            ORDER BY clicks DESC
            LIMIT 10
        ''')
        top_results = cursor.fetchall()
        
        # Recent searches
        cursor.execute('''
            SELECT query, timestamp
            FROM search_feedback
            ORDER BY timestamp DESC
            LIMIT 20
        ''')
        recent_searches = cursor.fetchall()
        
        return {
            "top_clicked_results": [
                {"result_id": r[0], "clicks": r[1], "avg_rating": r[2]}
                for r in top_results
            ],
            "recent_searches": [
                {"query": s[0], "timestamp": s[1]}
                for s in recent_searches
            ]
        }
    except Exception as e:
        logger.error(f"Stats error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/documents")
async def add_document(doc: DocumentRequest):
    """
    Add a new document to the knowledge base
    
    - **text**: Document content
    - **doc_id**: Unique document ID
    - **metadata**: Optional metadata dictionary
    """
    try:
        success = db.add_document(doc.text, doc.doc_id, doc.metadata)
        if success:
            return {"status": "success", "doc_id": doc.doc_id}
        else:
            raise HTTPException(status_code=500, detail="Failed to add document")
    except Exception as e:
        logger.error(f"Add document error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/stats")
async def get_stats():
    """Get system statistics"""
    doc_count = db.count_documents()
    
    # Get total searches from feedback
    cursor.execute('SELECT COUNT(*) FROM search_feedback')
    total_searches = cursor.fetchone()[0]
    
    # Get average rating
    cursor.execute('SELECT AVG(rating) FROM search_feedback WHERE rating IS NOT NULL')
    avg_rating = cursor.fetchone()[0] or 0
    
    return {
        "total_documents": doc_count,
        "total_searches": total_searches,
        "average_rating": round(avg_rating, 2) if avg_rating else 0
    }


# Shutdown event
@app.on_event("shutdown")
def shutdown_event():
    """Close database connections on shutdown"""
    conn.close()
    logger.info("Database connections closed")


if __name__ == "__main__":
    import uvicorn
    logger.info("Starting MCP Server...")
    logger.info(f"Documents in database: {db.count_documents()}")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
