"""
Populate the vector database with sample knowledge base
Run this script to initialize the database with tech-related content
"""

from vector_db import VectorDatabase
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Sample knowledge base - Tech topics
KNOWLEDGE_BASE = [
    # AI & Machine Learning
    "Artificial Intelligence is the simulation of human intelligence by machines, enabling them to perform tasks that typically require human cognition.",
    "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.",
    "Deep learning uses artificial neural networks with multiple layers to progressively extract higher-level features from raw input data.",
    "Neural networks are computing systems inspired by biological neural networks that constitute animal brains, consisting of interconnected nodes.",
    "Natural Language Processing enables computers to understand, interpret, and generate human language in a valuable way.",
    "Computer vision enables machines to derive meaningful information from digital images, videos and other visual inputs.",
    
    # Quantum Computing
    "Quantum computing uses quantum bits or qubits to perform calculations exponentially faster than classical computers for certain problems.",
    "Quantum entanglement is a phenomenon where quantum particles become correlated in ways that cannot be explained by classical physics.",
    "Quantum superposition allows qubits to exist in multiple states simultaneously until measured, unlike classical bits.",
    "Quantum algorithms like Shor's algorithm can factor large numbers exponentially faster than classical algorithms.",
    
    # Blockchain & Crypto
    "Blockchain is a distributed ledger technology that ensures transparent, secure, and immutable record-keeping across a network.",
    "Bitcoin is the first decentralized cryptocurrency that uses blockchain technology for peer-to-peer transactions without intermediaries.",
    "Ethereum is a blockchain platform that enables smart contracts and decentralized applications to be built and run without downtime.",
    "Smart contracts are self-executing contracts with terms directly written into code, automatically enforcing agreements.",
    "Proof of Work is a consensus mechanism where miners solve complex mathematical puzzles to validate transactions and create new blocks.",
    
    # Cloud Computing
    "Cloud computing delivers computing services over the internet on a pay-as-you-go basis, including servers, storage, and applications.",
    "Infrastructure as a Service provides virtualized computing resources over the internet, offering maximum flexibility.",
    "Platform as a Service provides a platform allowing customers to develop, run, and manage applications without infrastructure complexity.",
    "Software as a Service delivers software applications over the internet on a subscription basis, eliminating local installation.",
    "Serverless computing allows developers to build applications without managing servers, automatically scaling based on demand.",
    
    # Web Technologies
    "React is a JavaScript library for building user interfaces, particularly single-page applications with reusable components.",
    "Next.js is a React framework that enables server-side rendering and static site generation for optimal performance.",
    "Node.js is a JavaScript runtime built on Chrome's V8 engine that allows server-side JavaScript execution.",
    "REST APIs use HTTP requests to GET, PUT, POST and DELETE data, providing a standardized way for systems to communicate.",
    "GraphQL is a query language for APIs that enables clients to request exactly the data they need.",
    
    # Programming Concepts
    "Object-oriented programming organizes code into objects that contain both data and methods that operate on that data.",
    "Functional programming treats computation as the evaluation of mathematical functions, avoiding changing state and mutable data.",
    "Asynchronous programming allows programs to handle multiple operations concurrently without blocking execution.",
    "Microservices architecture structures applications as collections of loosely coupled, independently deployable services.",
    "Containerization packages software code with all its dependencies so it runs quickly and reliably across computing environments.",
    
    # Data Science
    "Data science combines statistics, mathematics, programming, and domain expertise to extract insights from structured and unstructured data.",
    "Big Data refers to extremely large datasets that require specialized tools and techniques for processing and analysis.",
    "Data mining discovers patterns and knowledge from large amounts of data using methods from statistics and machine learning.",
    "Predictive analytics uses statistical algorithms and machine learning to identify the likelihood of future outcomes.",
    "Data visualization represents data graphically to help people understand trends, outliers, and patterns in data.",
    
    # Cybersecurity
    "Encryption converts data into a coded format that can only be read by authorized parties with the decryption key.",
    "Multi-factor authentication requires users to provide two or more verification factors to access resources, enhancing security.",
    "Zero Trust security models assume no user or device should be trusted by default, even if inside the network perimeter.",
    "Penetration testing simulates cyberattacks to identify vulnerabilities in systems before real attackers can exploit them.",
    "Social engineering manipulates people into divulging confidential information or performing actions that compromise security.",
    
    # Internet of Things
    "Internet of Things connects physical devices to the internet, enabling them to collect, share, and act on data.",
    "Edge computing processes data near the source of data generation rather than in centralized data centers.",
    "5G networks provide faster speeds, lower latency, and greater capacity than previous wireless technologies.",
    "Smart home devices automate and control home functions like lighting, temperature, and security through internet connectivity.",
    
    # Emerging Technologies
    "Augmented reality overlays digital information onto the real world, enhancing what we see, hear, and feel.",
    "Virtual reality creates immersive, computer-generated environments that users can interact with using special equipment.",
    "Autonomous vehicles use AI, sensors, and GPS to navigate and operate without human intervention.",
    "3D printing creates physical objects by depositing materials layer by layer based on digital models.",
    "Biotechnology applies biological systems and living organisms to develop products and technologies for various applications.",
]


def populate_database():
    """Populate the vector database with knowledge base"""
    logger.info("Starting database population...")
    
    # Initialize database
    db = VectorDatabase(collection_name="knowledge_base")
    
    # Check existing documents
    existing_count = db.count_documents()
    logger.info(f"Existing documents: {existing_count}")
    
    if existing_count > 0:
        response = input(f"\nDatabase already contains {existing_count} documents. Delete and repopulate? (y/n): ")
        if response.lower() == 'y':
            db.delete_collection()
            db = VectorDatabase(collection_name="knowledge_base")
        else:
            logger.info("Keeping existing data. Exiting...")
            return
    
    # Generate document IDs
    doc_ids = [f"doc_{i:03d}" for i in range(len(KNOWLEDGE_BASE))]
    
    # Generate metadata
    metadatas = [
        {"source": "knowledge_base", "index": i, "topic": "tech"}
        for i in range(len(KNOWLEDGE_BASE))
    ]
    
    # Add documents to database
    success = db.add_documents(
        texts=KNOWLEDGE_BASE,
        doc_ids=doc_ids,
        metadatas=metadatas
    )
    
    if success:
        logger.info(f"\n✅ Successfully populated database with {len(KNOWLEDGE_BASE)} documents!")
        
        # Test search
        logger.info("\n🔍 Testing search functionality...")
        test_queries = [
            "What is quantum computing?",
            "Explain machine learning",
            "How does blockchain work?"
        ]
        
        for query in test_queries:
            results = db.search(query, top_k=3)
            logger.info(f"\nQuery: {query}")
            logger.info(f"Found {results['count']} results")
            if results['results']:
                logger.info(f"Top result: {results['results'][0]['document'][:100]}...")
    else:
        logger.error("❌ Failed to populate database")


if __name__ == "__main__":
    populate_database()
