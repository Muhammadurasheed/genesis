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
    """Application lifespan manager with graceful startup for Phase 1"""
    logger.info("🚀 Starting GenesisOS Backend - Phase 1: Intent Engine Foundation...")
    
    try:
        # Initialize database connections (with graceful fallbacks for Phase 1)
        await db.initialize()
        logger.info("✅ Database connections established for Phase 1")
        
        # Initialize memory service (with fallbacks)
        try:
            await memory_service.initialize()
            logger.info("✅ Memory service initialized (with Phase 1 fallbacks)")
        except Exception as e:
            logger.warning(f"⚠️ Memory service initialization warning: {e} - Phase 1 can continue")
        
        logger.info("🎯 Phase 1: Intent Engine Foundation - READY!")
        
    except Exception as e:
        logger.error(f"❌ Phase 1 startup error: {e}")
        raise
    
    yield
    
    # Cleanup
    try:
        await db.close()
        logger.info("👋 GenesisOS Backend shutdown complete")
    except Exception as e:
        logger.warning(f"⚠️ Shutdown warning: {e}")

# Create FastAPI app with Phase 1 configuration
app = FastAPI(
    title="GenesisOS API - Phase 1",
    description="AI-Native Workspace Platform Backend - Intent Engine Foundation",
    version="1.0.0-phase1",
    lifespan=lifespan
)

# CORS middleware with Phase 1 settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL, 
        "http://localhost:3000", 
        "http://localhost:5173",
        "https://bolt.new",
        "https://*.webcontainer-api.io"
    ],
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
    """Root endpoint for Phase 1"""
    return {
        "message": "GenesisOS API - AI-Native Workspace Platform",
        "version": "1.0.0-phase1",
        "status": "active",
        "phase": "1 - Intent Engine Foundation",
        "features": {
            "blueprint_generation": "✅ Gemini 1.5 Pro Integration",
            "intelligent_fallbacks": "✅ Business Logic Powered",
            "wizard_engine": "✅ Natural Language Processing",
            "database": "✅ Supabase Connected",
            "memory_systems": "⏳ Phase 3",
            "voice_interface": "⏳ Phase 4"
        },
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint with Phase 1 service status"""
    try:
        services = {
            "supabase": "connected" if db.supabase else "disconnected",
            "redis": "connected" if db.redis_available else "phase_3_requirement",
            "pinecone": "connected" if db.pinecone_available else "phase_3_requirement",
            "ai_service": "ready_with_gemini" if settings.GEMINI_API_KEY else "fallback_mode"
        }
        
        return {
            "status": "healthy",
            "phase": "1 - Intent Engine Foundation",
            "services": services,
            "mode": "development" if settings.DEBUG else "production",
            "ready_for": "Blueprint Generation & Wizard Flow"
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service unhealthy: {str(e)}")

@app.get("/api/status")
async def api_status():
    """Detailed API status for frontend Phase 1"""
    return {
        "status": "healthy",
        "phase": "1",
        "database": "connected" if db.supabase else "disconnected",
        "redis": "connected" if db.redis_available else "phase_3_requirement",
        "pinecone": "connected" if db.pinecone_available else "phase_3_requirement",
        "ai_service": "ready",
        "features_available": {
            "blueprint_generation": True,
            "guild_management": True,
            "agent_creation": True,
            "wizard_flow": True,
            "memory_systems": db.redis_available or db.pinecone_available,
            "voice_interface": False  # Phase 4
        },
        "next_phase": "2 - Canvas & Workflow Engine"
    }

# Global exception handler for Phase 1
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler for Phase 1"""
    logger.error(f"Phase 1 unhandled exception: {exc}", exc_info=True)
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc) if settings.DEBUG else "Something went wrong in Phase 1",
            "phase": "1 - Intent Engine Foundation",
            "suggestion": "Check logs and ensure all Phase 1 requirements are met"
        }
    )

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG
    )