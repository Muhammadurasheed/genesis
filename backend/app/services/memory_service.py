import json
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import numpy as np
from app.core.database import db
from app.core.config import settings

class MemoryService:
    """Service for agent memory management using Redis and Pinecone"""
    
    def __init__(self):
        self.redis = db.redis_client
        self.pinecone = db.pinecone_index
        
    async def store_short_term_memory(self, agent_id: str, memory_data: Dict[str, Any]):
        """Store short-term memory in Redis"""
        memory_key = f"agent:{agent_id}:short_memory"
        memory_item = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "data": memory_data
        }
        
        # Add to Redis list (FIFO)
        self.redis.lpush(memory_key, json.dumps(memory_item))
        
        # Trim to memory limit
        self.redis.ltrim(memory_key, 0, settings.AGENT_SHORT_TERM_MEMORY_LIMIT - 1)
        
        # Set expiration
        self.redis.expire(memory_key, timedelta(days=1).total_seconds())
    
    async def get_short_term_memory(self, agent_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Retrieve short-term memory from Redis"""
        memory_key = f"agent:{agent_id}:short_memory"
        memories = self.redis.lrange(memory_key, 0, limit - 1)
        
        return [json.loads(memory) for memory in memories]
    
    async def store_long_term_memory(
        self, 
        agent_id: str, 
        content: str, 
        metadata: Dict[str, Any],
        embedding: Optional[List[float]] = None
    ):
        """Store long-term memory in Pinecone with vector embeddings"""
        
        memory_id = f"agent_{agent_id}_{uuid.uuid4()}"
        
        # Generate embedding if not provided (mock for now)
        if not embedding:
            embedding = np.random.rand(1536).tolist()  # Mock embedding
        
        # Prepare metadata
        memory_metadata = {
            "agent_id": agent_id,
            "content": content,
            "timestamp": datetime.utcnow().isoformat(),
            **metadata
        }
        
        # Store in Pinecone
        self.pinecone.upsert([
            (memory_id, embedding, memory_metadata)
        ])
        
        return memory_id
    
    async def search_long_term_memory(
        self, 
        agent_id: str, 
        query_embedding: List[float], 
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """Search long-term memory using vector similarity"""
        
        response = self.pinecone.query(
            vector=query_embedding,
            filter={"agent_id": agent_id},
            top_k=limit,
            include_metadata=True
        )
        
        return [
            {
                "id": match.id,
                "score": match.score,
                "content": match.metadata.get("content", ""),
                "metadata": match.metadata
            }
            for match in response.matches
        ]
    
    async def get_agent_context(self, agent_id: str) -> Dict[str, Any]:
        """Get comprehensive agent context from all memory sources"""
        
        # Get recent short-term memories
        short_term = await self.get_short_term_memory(agent_id, limit=20)
        
        # Get agent state
        agent_state = self.redis.hgetall(f"agent:{agent_id}:state")
        
        return {
            "short_term_memory": short_term,
            "agent_state": agent_state,
            "context_retrieved_at": datetime.utcnow().isoformat()
        }
    
    async def update_agent_state(self, agent_id: str, state_updates: Dict[str, Any]):
        """Update agent's current state in Redis"""
        state_key = f"agent:{agent_id}:state"
        
        # Convert all values to strings for Redis
        string_updates = {k: json.dumps(v) if not isinstance(v, str) else v 
                         for k, v in state_updates.items()}
        
        self.redis.hset(state_key, mapping=string_updates)
        self.redis.expire(state_key, timedelta(days=7).total_seconds())

# Global memory service instance
memory_service = MemoryService()