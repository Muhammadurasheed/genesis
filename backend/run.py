#!/usr/bin/env python3
"""
GenesisOS Backend Server
Run with: python run.py
"""

import uvicorn
from app.main import app
from app.core.config import settings

if __name__ == "__main__":
    print("🚀 Starting GenesisOS Backend Server...")
    print(f"📍 Host: {settings.API_HOST}:{settings.API_PORT}")
    print(f"🔧 Debug: {settings.DEBUG}")
    print(f"🌐 Frontend: {settings.FRONTEND_URL}")
    
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG,
        workers=1
    )