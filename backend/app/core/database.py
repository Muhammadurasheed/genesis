import redis
import pinecone
from supabase import create_client, Client
from app.core.config import settings

class DatabaseManager:
    """Centralized database connection manager"""
    
    def __init__(self):
        self.supabase: Client = None
        self.redis_client: redis.Redis = None
        self.pinecone_index = None
        
    async def initialize(self):
        """Initialize all database connections"""
        
        # Initialize Supabase
        self.supabase = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY
        )
        
        # Initialize Redis
        self.redis_client = redis.from_url(
            settings.REDIS_URL,
            decode_responses=True
        )
        
        # Initialize Pinecone
        pinecone.init(
            api_key=settings.PINECONE_API_KEY,
            environment=settings.PINECONE_ENVIRONMENT
        )
        self.pinecone_index = pinecone.Index(settings.PINECONE_INDEX_NAME)
        
        # Test connections
        await self._test_connections()
        
    async def _test_connections(self):
        """Test all database connections"""
        try:
            # Test Supabase
            response = self.supabase.table("users").select("id").limit(1).execute()
            
            # Test Redis
            self.redis_client.ping()
            
            # Test Pinecone
            self.pinecone_index.describe_index_stats()
            
            print("✅ All database connections established successfully")
            
        except Exception as e:
            print(f"❌ Database connection error: {e}")
            raise
    
    async def close(self):
        """Close all database connections"""
        if self.redis_client:
            await self.redis_client.close()

# Global database manager instance
db = DatabaseManager()