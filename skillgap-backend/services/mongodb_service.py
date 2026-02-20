"""
MongoDB Service

This module provides MongoDB connection and client access.
Replaces Firebase Firestore with MongoDB.
"""

import os
from typing import Optional
from pymongo import MongoClient
from pymongo.database import Database


_client: Optional[MongoClient] = None
_db: Optional[Database] = None


def get_db() -> Database:
    """
    Return a singleton MongoDB database connection.
    
    Expects MONGODB_URI in environment variables.
    Default database name: 'skillbridge'
    
    Returns:
        Database: MongoDB database instance
    """
    global _client, _db

    if _db is not None:
        return _db

    mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
    db_name = os.getenv("MONGODB_DB_NAME", "skillbridge")
    
    if not mongodb_uri:
        raise RuntimeError(
            "MONGODB_URI is not set. "
            "Set it in backend/.env to your MongoDB connection string."
        )

    try:
        _client = MongoClient(mongodb_uri)
        _db = _client[db_name]
        
        # Test the connection
        _client.server_info()
        print(f"✓ Connected to MongoDB database: {db_name}")
        
        return _db
    except Exception as e:
        raise RuntimeError(f"Failed to connect to MongoDB: {str(e)}")


def get_client() -> MongoClient:
    """
    Return the MongoDB client instance.
    
    Returns:
        MongoClient: MongoDB client
    """
    global _client
    
    if _client is not None:
        return _client
    
    # Initialize by getting db (which initializes the client)
    get_db()
    return _client


def close_connection():
    """Close the MongoDB connection."""
    global _client, _db
    
    if _client:
        _client.close()
        _client = None
        _db = None
        print("✓ MongoDB connection closed")
