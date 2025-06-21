import redis
import pinecone
from supabase import create_client, Client
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class DatabaseManager:
    """Centralized database connection manager with graceful fallbacks"""
    
    def __init__(self):
        self.supabase: Client = None
        self.redis_client: redis.Redis = None
        self.pinecone_index = None
        self.pinecone_available = False
        self.redis_available = False
        
    async def initialize(self):
        """Initialize all database connections with graceful fallbacks"""
        
        # Initialize Supabase (required)
        try:
            self.supabase = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_SERVICE_ROLE_KEY
            )
            logger.info("✅ Supabase connection initialized")
        except Exception as e:
            logger.error(f"❌ Supabase initialization failed: {e}")
            raise
        
        # Initialize Redis (optional for Phase 1)
        try:
            if settings.REDIS_URL and settings.REDIS_URL != "":
                self.redis_client = redis.from_url(
                    settings.REDIS_URL,
                    decode_responses=True
                )
                # Test connection
                self.redis_client.ping()
                self.redis_available = True
                logger.info("✅ Redis connection established")
            else:
                logger.info("⚠️ Redis URL not configured - using fallback for Phase 1")
        except Exception as e:
            logger.warning(f"⚠️ Redis connection failed: {e} - Phase 1 can continue without Redis")
            self.redis_available = False
        
        # Initialize Pinecone (optional for Phase 1, required for Phase 3)
        try:
            if (settings.PINECONE_API_KEY and 
                settings.PINECONE_API_KEY != "" and 
                settings.PINECONE_ENVIRONMENT and 
                settings.PINECONE_ENVIRONMENT != ""):
                
                pinecone.init(
                    api_key=settings.PINECONE_API_KEY,
                    environment=settings.PINECONE_ENVIRONMENT
                )
                self.pinecone_index = pinecone.Index(settings.PINECONE_INDEX_NAME)
                # Test connection
                self.pinecone_index.describe_index_stats()
                self.pinecone_available = True
                logger.info("✅ Pinecone connection established")
            else:
                logger.info("⚠️ Pinecone not configured - Phase 1 can continue without vector storage")
        except Exception as e:
            logger.warning(f"⚠️ Pinecone connection failed: {e} - Phase 1 can continue without vector storage")
            self.pinecone_available = False
        
        # Test connections (only require Supabase for Phase 1)
        await self._test_connections()
        
    async def _test_connections(self):
        """Test database connections with graceful fallbacks"""
        try:
            # Test Supabase (required)
            try:
                response = self.supabase.table("users").select("id").limit(1).execute()
                logger.info("✅ Supabase connection test successful")
            except Exception as e:
                logger.warning(f"⚠️ Supabase test warning (table may not exist): {e}")
            
            # Test Redis (optional)
            if self.redis_available and self.redis_client:
                try:
                    self.redis_client.ping()
                    logger.info("✅ Redis connection test successful")
                except Exception as e:
                    logger.warning(f"⚠️ Redis test failed: {e}")
                    self.redis_available = False
            
            # Test Pinecone (optional)
            if self.pinecone_available and self.pinecone_index:
                try:
                    self.pinecone_index.describe_index_stats()
                    logger.info("✅ Pinecone connection test successful")
                except Exception as e:
                    logger.warning(f"⚠️ Pinecone test failed: {e}")
                    self.pinecone_available = False
            
            # Summary
            services = []
            if self.supabase: services.append("Supabase")
            if self.redis_available: services.append("Redis")
            if self.pinecone_available: services.append("Pinecone")
            
            logger.info(f"✅ Database initialization complete. Available services: {', '.join(services)}")
            
        except Exception as e:
            logger.error(f"❌ Database connection test failed: {e}")
            raise
    
    async def close(self):
        """Close all database connections"""
        if self.redis_client and self.redis_available:
            try:
                await self.redis_client.close()
                logger.info("✅ Redis connection closed")
            except Exception as e:
                logger.warning(f"⚠️ Redis close warning: {e}")

# Global database manager instance
db = DatabaseManager()