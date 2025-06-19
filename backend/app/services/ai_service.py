import json
import uuid
from datetime import datetime
from typing import Dict, Any, List
import google.generativeai as genai
from app.core.config import settings
from app.models.wizard import Blueprint, SuggestedStructure, BlueprintAgent, BlueprintWorkflow

class AIService:
    """AI service for blueprint generation and agent intelligence"""
    
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-1.5-pro')
        
    async def generate_blueprint(self, user_input: str) -> Blueprint:
        """Generate AI blueprint from user intent"""
        
        prompt = f"""
        You are Genesis AI, an expert system architect that translates human business goals into digital worker structures.
        
        USER GOAL: "{user_input}"
        
        Analyze this goal and create a blueprint for a "Guild" (digital department) that can achieve it autonomously.
        
        Respond with valid JSON in this exact format:
        {{
            "interpretation": "A clear interpretation of what the user wants to achieve",
            "suggested_structure": {{
                "guild_name": "A professional name for this department",
                "guild_purpose": "One-sentence purpose statement",
                "agents": [
                    {{
                        "name": "Agent Name",
                        "role": "Specific role title",
                        "description": "What this agent does and how it contributes",
                        "tools_needed": ["tool1", "tool2", "tool3"]
                    }}
                ],
                "workflows": [
                    {{
                        "name": "Workflow Name",
                        "description": "What this workflow automates",
                        "trigger_type": "schedule|webhook|manual|event"
                    }}
                ]
            }}
        }}
        
        Rules:
        - Create 2-4 agents maximum
        - Each agent should have a specific, focused role
        - Tools should be real APIs/services (Stripe, Slack, email, etc.)
        - Workflows should connect agents logically
        - Be specific about trigger types
        - Focus on automation and intelligence
        """
        
        try:
            response = self.model.generate_content(prompt)
            result_text = response.text.strip()
            
            # Extract JSON from response
            if "```json" in result_text:
                json_start = result_text.find("```json") + 7
                json_end = result_text.find("```", json_start)
                result_text = result_text[json_start:json_end].strip()
            
            parsed_result = json.loads(result_text)
            
            # Create blueprint object
            blueprint = Blueprint(
                id=str(uuid.uuid4()),
                user_input=user_input,
                interpretation=parsed_result["interpretation"],
                suggested_structure=SuggestedStructure(**parsed_result["suggested_structure"]),
                status="pending",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            return blueprint
            
        except Exception as e:
            # Fallback blueprint if AI fails
            return self._create_fallback_blueprint(user_input)
    
    def _create_fallback_blueprint(self, user_input: str) -> Blueprint:
        """Create a fallback blueprint if AI generation fails"""
        return Blueprint(
            id=str(uuid.uuid4()),
            user_input=user_input,
            interpretation=f"Create a digital workspace to help with: {user_input}",
            suggested_structure=SuggestedStructure(
                guild_name="Digital Assistant Guild",
                guild_purpose="Automate and enhance your business operations",
                agents=[
                    BlueprintAgent(
                        name="Task Manager",
                        role="Operations Coordinator",
                        description="Manages tasks and coordinates workflow execution",
                        tools_needed=["Calendar API", "Email", "Webhooks"]
                    ),
                    BlueprintAgent(
                        name="Data Analyst",
                        role="Analytics Specialist", 
                        description="Analyzes data and generates insights",
                        tools_needed=["Database", "API Connectors", "Reporting"]
                    )
                ],
                workflows=[
                    BlueprintWorkflow(
                        name="Daily Operations",
                        description="Automated daily task management and reporting",
                        trigger_type="schedule"
                    )
                ]
            ),
            status="pending",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

    async def generate_agent_response(self, agent_context: Dict[str, Any], query: str) -> str:
        """Generate intelligent agent responses"""
        
        prompt = f"""
        You are {agent_context.get('name', 'AI Agent')}, a {agent_context.get('role', 'digital worker')}.
        
        Your personality: {agent_context.get('personality', 'Professional and helpful')}
        Your instructions: {agent_context.get('instructions', 'Help the user with their requests')}
        
        User query: "{query}"
        
        Respond as this agent would, staying in character and being helpful.
        Keep responses concise but thorough. Include your thought process if relevant.
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"I apologize, but I'm experiencing technical difficulties. Error: {str(e)}"

# Global AI service instance
ai_service = AIService()