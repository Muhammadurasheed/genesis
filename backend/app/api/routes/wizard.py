from fastapi import APIRouter, HTTPException, Depends
from app.models.wizard import GenerateBlueprintRequest, BlueprintResponse
from app.services.ai_service import ai_service
from app.core.database import db

router = APIRouter(prefix="/wizard", tags=["wizard"])

@router.post("/generate-blueprint", response_model=BlueprintResponse)
async def generate_blueprint(request: GenerateBlueprintRequest):
    """Generate AI blueprint from user intent"""
    
    try:
        # Generate blueprint using AI
        blueprint = await ai_service.generate_blueprint(request.user_input)
        
        # Store blueprint in Supabase
        blueprint_data = {
            "id": blueprint.id,
            "user_input": blueprint.user_input,
            "interpretation": blueprint.interpretation,
            "suggested_structure": blueprint.suggested_structure.dict(),
            "status": blueprint.status,
            "created_at": blueprint.created_at.isoformat(),
            "updated_at": blueprint.updated_at.isoformat()
        }
        
        result = db.supabase.table("blueprints").insert(blueprint_data).execute()
        
        return BlueprintResponse(
            id=blueprint.id,
            user_input=blueprint.user_input,
            interpretation=blueprint.interpretation,
            suggested_structure=blueprint.suggested_structure,
            status=blueprint.status,
            created_at=blueprint.created_at.isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blueprint generation failed: {str(e)}")

@router.get("/blueprint/{blueprint_id}", response_model=BlueprintResponse)
async def get_blueprint(blueprint_id: str):
    """Retrieve a specific blueprint"""
    
    try:
        result = db.supabase.table("blueprints").select("*").eq("id", blueprint_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Blueprint not found")
        
        blueprint_data = result.data[0]
        
        return BlueprintResponse(**blueprint_data)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving blueprint: {str(e)}")