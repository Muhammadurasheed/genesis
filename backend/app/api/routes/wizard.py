from fastapi import APIRouter, HTTPException, Depends
from app.models.wizard import GenerateBlueprintRequest, BlueprintResponse
from app.services.ai_service import ai_service
from app.core.database import db
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/wizard", tags=["wizard"])

@router.post("/generate-blueprint", response_model=BlueprintResponse)
async def generate_blueprint(request: GenerateBlueprintRequest):
    """Generate AI blueprint from user intent with enhanced intelligence"""
    
    try:
        logger.info(f"🎯 Blueprint generation requested for: {request.user_input[:100]}...")
        
        # Validate input
        if not request.user_input or len(request.user_input.strip()) < 10:
            raise HTTPException(
                status_code=400, 
                detail="Please provide a more detailed description of what you want to achieve (at least 10 characters)"
            )
        
        if len(request.user_input) > 2000:
            raise HTTPException(
                status_code=400,
                detail="Please keep your description under 2000 characters for optimal processing"
            )
        
        # Generate blueprint using AI
        blueprint = await ai_service.generate_blueprint(request.user_input.strip())
        
        # Store blueprint in Supabase with error handling
        try:
            blueprint_data = {
                "id": blueprint.id,
                "user_input": blueprint.user_input,
                "interpretation": blueprint.interpretation,
                "suggested_structure": blueprint.suggested_structure.dict(),
                "status": blueprint.status,
                "created_at": blueprint.created_at.isoformat(),
                "updated_at": blueprint.updated_at.isoformat(),
                # Enhanced metadata for Phase 1
                "complexity_score": len(blueprint.suggested_structure.agents) + len(blueprint.suggested_structure.workflows),
                "estimated_setup_time": len(blueprint.suggested_structure.agents) * 5 + len(blueprint.suggested_structure.workflows) * 3,
                "confidence_score": 0.95 if ai_service.available else 0.85,
                "tags": _extract_tags_from_blueprint(blueprint)
            }
            
            result = db.supabase.table("blueprints").insert(blueprint_data).execute()
            logger.info(f"✅ Blueprint stored in database: {blueprint.id}")
            
        except Exception as db_error:
            logger.warning(f"⚠️ Blueprint storage failed: {db_error} - continuing without storage")
            # Don't fail the request if storage fails
        
        # Return enhanced response
        response = BlueprintResponse(
            id=blueprint.id,
            user_input=blueprint.user_input,
            interpretation=blueprint.interpretation,
            suggested_structure=blueprint.suggested_structure,
            status=blueprint.status,
            created_at=blueprint.created_at.isoformat()
        )
        
        logger.info(f"✅ Blueprint generation completed successfully: {blueprint.id}")
        return response
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"❌ Blueprint generation failed: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail={
                "error": "Blueprint generation failed",
                "message": "Our AI architects are temporarily overwhelmed. Please try again in a moment.",
                "suggestion": "Try simplifying your request or being more specific about your goals.",
                "support": "If this persists, our team is standing by to help you personally."
            }
        )

@router.get("/blueprint/{blueprint_id}", response_model=BlueprintResponse)
async def get_blueprint(blueprint_id: str):
    """Retrieve a specific blueprint with enhanced error handling"""
    
    try:
        logger.info(f"📋 Blueprint retrieval requested: {blueprint_id}")
        
        result = db.supabase.table("blueprints").select("*").eq("id", blueprint_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=404, 
                detail={
                    "error": "Blueprint not found",
                    "message": f"Blueprint {blueprint_id} doesn't exist or may have expired.",
                    "suggestion": "Try generating a new blueprint or check if the ID is correct."
                }
            )
        
        blueprint_data = result.data[0]
        
        # Convert back to proper response format
        response = BlueprintResponse(
            id=blueprint_data["id"],
            user_input=blueprint_data["user_input"],
            interpretation=blueprint_data["interpretation"],
            suggested_structure=blueprint_data["suggested_structure"],
            status=blueprint_data["status"],
            created_at=blueprint_data["created_at"]
        )
        
        logger.info(f"✅ Blueprint retrieved successfully: {blueprint_id}")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Blueprint retrieval failed: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail={
                "error": "Blueprint retrieval failed",
                "message": "Unable to retrieve the requested blueprint.",
                "suggestion": "Please try again or generate a new blueprint."
            }
        )

@router.get("/health")
async def wizard_health():
    """Health check for wizard service"""
    return {
        "status": "healthy",
        "ai_service": "available" if ai_service.available else "fallback_mode",
        "gemini_configured": ai_service.available,
        "database": "connected" if db.supabase else "disconnected",
        "phase": "1 - Intent Engine Foundation"
    }

def _extract_tags_from_blueprint(blueprint) -> list:
    """Extract relevant tags from blueprint for categorization"""
    tags = []
    
    # Extract from guild name and purpose
    text = f"{blueprint.suggested_structure.guild_name} {blueprint.suggested_structure.guild_purpose}".lower()
    
    # Business domain tags
    if any(word in text for word in ["support", "customer", "service", "help"]):
        tags.append("customer_support")
    if any(word in text for word in ["sales", "revenue", "lead", "deal"]):
        tags.append("sales")
    if any(word in text for word in ["marketing", "campaign", "brand", "content"]):
        tags.append("marketing")
    if any(word in text for word in ["finance", "payment", "billing", "invoice"]):
        tags.append("finance")
    if any(word in text for word in ["analytics", "data", "report", "insight"]):
        tags.append("analytics")
    
    # Complexity tags
    agent_count = len(blueprint.suggested_structure.agents)
    if agent_count <= 2:
        tags.append("simple")
    elif agent_count <= 4:
        tags.append("moderate")
    else:
        tags.append("complex")
    
    # Integration tags
    all_tools = []
    for agent in blueprint.suggested_structure.agents:
        all_tools.extend(agent.tools_needed)
    
    if any("slack" in tool.lower() for tool in all_tools):
        tags.append("slack_integration")
    if any("email" in tool.lower() for tool in all_tools):
        tags.append("email_integration")
    if any("stripe" in tool.lower() for tool in all_tools):
        tags.append("payment_integration")
    
    return tags