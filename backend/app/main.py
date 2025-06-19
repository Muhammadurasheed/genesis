from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import db
from app.api.routes import wizard, guilds, agents
import uvicorn

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    print("🚀 Starting GenesisOS Backend...")
    
    # Initialize database connections
    await db.initialize()
    print("✅ Database connections established")
    
    yield
    
    # Cleanup
    await db.close()
    print("👋 GenesisOS Backend shutdown complete")

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
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connections
        db.redis_client.ping()
        
        return {
            "status": "healthy",
            "database": "connected",
            "redis": "connected",
            "ai_service": "ready"
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service unhealthy: {str(e)}")

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc) if settings.DEBUG else "Something went wrong"
        }
    )

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG
    )