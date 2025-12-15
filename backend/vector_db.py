"""
Vector Database Module using ChromaDB and Sentence Transformers
Handles semantic search and document storage
"""

import chromadb
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class VectorDatabase:
    """Vector database for semantic search using ChromaDB"""
    
    def __init__(self, collection_name: str = "knowledge_base", persist_directory: str = "../data/chromadb"):
        logger.info("Initializing ChromaDB client...")
        # Use persistent storage instead of in-memory
        self.client = chromadb.PersistentClient(path=persist_directory)
        self.collection_name = collection_name
        
        # Initialize embedding model
        logger.info("Loading Sentence Transformer model...")
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"description": "Knowledge base for semantic search"}
        )
        logger.info(f"Collection '{collection_name}' ready!")
    
    def add_document(
        self, 
        text: str, 
        doc_id: str, 
        metadata: Optional[Dict] = None
    ) -> bool:
        """Add a single document to the vector database"""
        try:
            embedding = self.model.encode(text).tolist()
            
            self.collection.add(
                documents=[text],
                embeddings=[embedding],
                ids=[doc_id],
                metadatas=[metadata or {}]
            )
            return True
        except Exception as e:
            logger.error(f"Error adding document: {e}")
            return False
    
    def add_documents(
        self, 
        texts: List[str], 
        doc_ids: List[str], 
        metadatas: Optional[List[Dict]] = None
    ) -> bool:
        """Add multiple documents to the vector database"""
        try:
            logger.info(f"Generating embeddings for {len(texts)} documents...")
            embeddings = self.model.encode(texts).tolist()
            
            logger.info("Adding documents to collection...")
            self.collection.add(
                documents=texts,
                embeddings=embeddings,
                ids=doc_ids,
                metadatas=metadatas or [{} for _ in texts]
            )
            logger.info(f"Successfully added {len(texts)} documents!")
            return True
        except Exception as e:
            logger.error(f"Error adding documents: {e}")
            return False
    
    def search(
        self, 
        query: str, 
        top_k: int = 5
    ) -> Dict:
        """Perform semantic search on the database"""
        try:
            # Generate query embedding
            query_embedding = self.model.encode(query).tolist()
            
            # Search
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k
            )
            
            # Format results
            formatted_results = []
            if results['documents'] and len(results['documents']) > 0:
                for i, doc in enumerate(results['documents'][0]):
                    formatted_results.append({
                        'document': doc,
                        'id': results['ids'][0][i] if results['ids'] else None,
                        'distance': results['distances'][0][i] if results['distances'] else None,
                        'metadata': results['metadatas'][0][i] if results['metadatas'] else {}
                    })
            
            return {
                'query': query,
                'results': formatted_results,
                'count': len(formatted_results)
            }
        except Exception as e:
            logger.error(f"Error during search: {e}")
            return {'query': query, 'results': [], 'count': 0, 'error': str(e)}
    
    def count_documents(self) -> int:
        """Get the total number of documents in the database"""
        try:
            return self.collection.count()
        except:
            return 0
    
    def delete_collection(self):
        """Delete the entire collection"""
        try:
            self.client.delete_collection(name=self.collection_name)
            logger.info(f"Collection '{self.collection_name}' deleted")
        except Exception as e:
            logger.error(f"Error deleting collection: {e}")


# Example usage
if __name__ == "__main__":
    # Initialize database
    db = VectorDatabase()
    
    # Add sample documents
    sample_docs = [
        "Quantum computing uses quantum bits or qubits to perform calculations exponentially faster than classical computers.",
        "Machine learning is a subset of artificial intelligence that enables systems to learn from data.",
        "Blockchain is a distributed ledger technology that ensures transparent and secure transactions.",
    ]
    
    doc_ids = [f"doc_{i}" for i in range(len(sample_docs))]
    
    db.add_documents(sample_docs, doc_ids)
    
    # Test search
    results = db.search("What is quantum computing?")
    print(f"\nSearch Results: {results}")
