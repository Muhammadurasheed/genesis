from typing import List
from fastapi import APIRouter, HTTPException, Depends
from app.models.agent import CreateAgentRequest, AgentResponse
from app.services.ai_service import ai_service
from app.services.memory_service import memory_service
from app.core.database import db
import uuid
from datetime import datetime

router = APIRouter(prefix="/agents", tags=["agents"])

@router.post("/", response_model=AgentResponse)
async def create_agent(request: CreateAgentRequest):
    """Create a new agent"""
    
    try:
        agent_id = str(uuid.uuid4())
        agent_data = {
            "id": agent_id,
            "name": request.name,
            "role": request.role,
            "description": request.description,
            "guild_id": request.guild_id,
            "personality": request.personality,
            "instructions": request.instructions,
            "tools": [tool.dict() for tool in request.tools],
            "memory_config": request.memory_config.dict(),
            "voice_config": request.voice_config.dict(),
            "status": "active",
            "metadata": {},
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = db.supabase.table("agents").insert(agent_data).execute()
        
        # Initialize agent memory
        await memory_service.update_agent_state(agent_id, {
            "status": "active",
            "initialization_time": datetime.utcnow().isoformat()
        })
        
        return AgentResponse(
            id=agent_id,
            name=request.name,
            role=request.role,
            description=request.description,
            guild_id=request.guild_id,
            status="active",
            tools_count=len(request.tools),
            memory_enabled=request.memory_config.short_term_enabled or request.memory_config.long_term_enabled,
            voice_enabled=request.voice_config.enabled,
            created_at=agent_data["created_at"],
            updated_at=agent_data["updated_at"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent creation failed: {str(e)}")

@router.get("/", response_model=List[AgentResponse])
async def get_agents(guild_id: str = None):
    """Get all agents, optionally filtered by guild"""
    
    try:
        query = db.supabase.table("agents").select("*")
        
        if guild_id:
            query = query.eq("guild_id", guild_id)
        
        result = query.execute()
        
        agents = []
        for agent_data in result.data:
            agents.append(AgentResponse(
                id=agent_data["id"],
                name=agent_data["name"],
                role=agent_data["role"],
                description=agent_data["description"],
                guild_id=agent_data["guild_id"],
                status=agent_data["status"],
                tools_count=len(agent_data.get("tools", [])),
                memory_enabled=agent_data.get("memory_config", {}).get("short_term_enabled", False),
                voice_enabled=agent_data.get("voice_config", {}).get("enabled", False),
                created_at=agent_data["created_at"],
                updated_at=agent_data["updated_at"]
            ))
        
        return agents
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching agents: {str(e)}")

@router.post("/{agent_id}/chat")
async def chat_with_agent(agent_id: str, message: dict):
    """Chat with a specific agent"""
    
    try:
        # Get agent data
        result = db.supabase.table("agents").select("*").eq("id", agent_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        agent_data = result.data[0]
        
        # Get agent context from memory
        context = await memory_service.get_agent_context(agent_id)
        
        # Prepare agent context for AI
        agent_context = {
            "name": agent_data["name"],
            "role": agent_data["role"],
            "personality": agent_data["personality"],
            "instructions": agent_data["instructions"],
            "recent_memory": context["short_term_memory"][:5]  # Last 5 memories
        }
        
        # Generate response
        response = await ai_service.generate_agent_response(
            agent_context, 
            message.get("content", "")
        )
        
        # Store interaction in memory
        await memory_service.store_short_term_memory(agent_id, {
            "type": "chat",
            "user_message": message.get("content", ""),
            "agent_response": response,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        return {
            "agent_id": agent_id,
            "agent_name": agent_data["name"],
            "response": response,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@router.get("/{agent_id}/memory")
async def get_agent_memory(agent_id: str):
    """Get agent's memory and context"""
    
    try:
        context = await memory_service.get_agent_context(agent_id)
        return context
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving memory: {str(e)}")