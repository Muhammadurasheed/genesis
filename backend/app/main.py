from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import db
from app.services.memory_service import memory_service
from app.api.routes import wizard, guilds, agents
import uvicorn
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager with graceful startup"""
    logger.info("🚀 Starting GenesisOS Backend...")
    
    try:
        # Initialize database connections (with graceful fallbacks)
        await db.initialize()
        logger.info("✅ Database connections established")
        
        # Initialize memory service
        await memory_service.initialize()
        logger.info("✅ Memory service initialized")
        
    except Exception as e:
        logger.error(f"❌ Startup error: {e}")
        raise
    
    yield
    
    # Cleanup
    try:
        await db.close()
        logger.info("👋 GenesisOS Backend shutdown complete")
    except Exception as e:
        logger.warning(f"⚠️ Shutdown warning: {e}")

# Create FastAPI app
app = FastAPI(
    title="GenesisOS API",
    description="AI-Native Workspace Platform Backend",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(wizard.router, prefix="/api")
app.include_router(guilds.router, prefix="/api")
app.include_router(agents.router, prefix="/api")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "GenesisOS API - AI-Native Workspace Platform",
        "version": "1.0.0",
        "status": "active",
        "phase": "1 - Intent Engine Foundation",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint with service status"""
    try:
        services = {
            "supabase": "connected" if db.supabase else "disconnected",
            "redis": "connected" if db.redis_available else "not_configured",
            "pinecone": "connected" if db.pinecone_available else "not_configured",
            "ai_service": "ready"
        }
        
        return {
            "status": "healthy",
            "services": services,
            "phase": "1 - Intent Engine Foundation",
            "mode": "development" if settings.DEBUG else "production"
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service unhealthy: {str(e)}")

@app.get("/api/status")
async def api_status():
    """Detailed API status for frontend"""
    return {
        "status": "healthy",
        "database": "connected" if db.supabase else "disconnected",
        "redis": "connected" if db.redis_available else "phase_3_requirement",
        "pinecone": "connected" if db.pinecone_available else "phase_3_requirement",
        "ai_service": "ready",
        "phase": "1",
        "features_available": {
            "blueprint_generation": True,
            "guild_management": True,
            "agent_creation": True,
            "memory_systems": db.redis_available or db.pinecone_available,
            "voice_interface": False  # Phase 4
        }
    }

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc) if settings.DEBUG else "Something went wrong",
            "phase": "1 - Intent Engine Foundation"
        }
    )

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG
    )