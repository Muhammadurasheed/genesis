import json
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
import google.generativeai as genai
from app.core.config import settings
from app.models.wizard import Blueprint, SuggestedStructure, BlueprintAgent, BlueprintWorkflow
import logging

logger = logging.getLogger(__name__)

class AIService:
    """Advanced AI service for intelligent blueprint generation and agent consciousness"""
    
    def __init__(self):
        """Initialize with Gemini Pro for maximum intelligence"""
        if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "":
            try:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self.model = genai.GenerativeModel('gemini-1.5-pro')
                self.available = True
                logger.info("✅ Gemini 1.5 Pro initialized successfully")
            except Exception as e:
                logger.warning(f"⚠️ Gemini initialization failed: {e} - using fallback")
                self.model = None
                self.available = False
        else:
            logger.warning("⚠️ Gemini API key not configured - using intelligent fallback")
            self.model = None
            self.available = False
        
    async def generate_blueprint(self, user_input: str) -> Blueprint:
        """Generate AI blueprint from user intent with divine intelligence"""
        
        if self.available and self.model:
            return await self._generate_with_gemini(user_input)
        else:
            return await self._generate_intelligent_fallback(user_input)
    
    async def _generate_with_gemini(self, user_input: str) -> Blueprint:
        """Generate blueprint using Gemini 1.5 Pro with advanced prompting"""
        
        # Advanced prompt engineering for business intelligence
        prompt = f"""
        You are GENESIS AI - the world's most advanced business automation architect.
        You possess deep understanding of business operations, workflow optimization, and AI agent deployment.
        
        FOUNDER'S VISION: "{user_input}"
        
        Your mission is to transform this vision into a complete digital business architecture.
        Think like a combination of:
        - McKinsey consultant (strategic thinking)
        - Silicon Valley CTO (technical excellence)
        - AI researcher (cutting-edge capabilities)
        - Business operations expert (practical implementation)
        
        Analyze the founder's intent and create a Guild (digital department) that can execute this vision autonomously.
        
        RESPONSE FORMAT (JSON):
        {{
            "interpretation": "A sophisticated interpretation showing deep business understanding",
            "suggested_structure": {{
                "guild_name": "Professional name that reflects the business purpose",
                "guild_purpose": "One powerful sentence describing the autonomous capability",
                "agents": [
                    {{
                        "name": "Specific role-based name",
                        "role": "Clear professional title",
                        "description": "Detailed explanation of agent's intelligence and capabilities",
                        "tools_needed": ["specific_api_or_tool_1", "specific_api_or_tool_2", "specific_api_or_tool_3"]
                    }}
                ],
                "workflows": [
                    {{
                        "name": "Descriptive workflow name",
                        "description": "What this workflow automates and its business impact",
                        "trigger_type": "schedule|webhook|manual|event"
                    }}
                ]
            }}
        }}
        
        INTELLIGENCE GUIDELINES:
        - Create 2-4 agents maximum for focused excellence
        - Each agent should have distinct, complementary capabilities
        - Tools should be real, actionable APIs (Stripe, Slack, SendGrid, etc.)
        - Workflows should connect agents in logical business processes
        - Focus on measurable business outcomes
        - Consider edge cases and error handling
        - Demonstrate deep understanding of the business domain
        
        QUALITY STANDARDS:
        - Fortune 500 consulting quality
        - Technically feasible and implementable
        - Business value is immediately clear
        - Scales from startup to enterprise
        - Considers security and compliance
        
        Generate a blueprint that would impress Sam Altman and solve real business problems.
        """
        
        try:
            logger.info(f"🤖 Generating blueprint with Gemini for: {user_input[:50]}...")
            
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,  # Balanced creativity and consistency
                    top_p=0.8,
                    top_k=40,
                    max_output_tokens=2048,
                )
            )
            
            result_text = response.text.strip()
            
            # Extract JSON from response with robust parsing
            json_content = self._extract_json_from_response(result_text)
            
            if not json_content:
                logger.warning("⚠️ Failed to extract JSON from Gemini response, using intelligent fallback")
                return await self._generate_intelligent_fallback(user_input)
            
            parsed_result = json.loads(json_content)
            
            # Validate the structure
            if not self._validate_blueprint_structure(parsed_result):
                logger.warning("⚠️ Invalid blueprint structure from Gemini, using intelligent fallback")
                return await self._generate_intelligent_fallback(user_input)
            
            # Create blueprint object with enhanced metadata
            blueprint = Blueprint(
                id=str(uuid.uuid4()),
                user_input=user_input,
                interpretation=parsed_result["interpretation"],
                suggested_structure=SuggestedStructure(**parsed_result["suggested_structure"]),
                status="pending",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            logger.info(f"✅ Gemini blueprint generated successfully: {blueprint.id}")
            return blueprint
            
        except Exception as e:
            logger.error(f"❌ Gemini blueprint generation failed: {e}")
            return await self._generate_intelligent_fallback(user_input)
    
    def _extract_json_from_response(self, text: str) -> Optional[str]:
        """Extract JSON from AI response with multiple fallback strategies"""
        
        # Strategy 1: Look for ```json blocks
        if "```json" in text:
            try:
                json_start = text.find("```json") + 7
                json_end = text.find("```", json_start)
                if json_end > json_start:
                    return text[json_start:json_end].strip()
            except:
                pass
        
        # Strategy 2: Look for first { to last }
        try:
            first_brace = text.find("{")
            last_brace = text.rfind("}")
            if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
                return text[first_brace:last_brace + 1]
        except:
            pass
        
        # Strategy 3: Try to find JSON-like structure
        try:
            lines = text.split("\n")
            json_lines = []
            in_json = False
            
            for line in lines:
                if "{" in line and not in_json:
                    in_json = True
                
                if in_json:
                    json_lines.append(line)
                
                if "}" in line and in_json:
                    break
            
            return "\n".join(json_lines)
        except:
            pass
        
        return None
    
    def _validate_blueprint_structure(self, data: dict) -> bool:
        """Validate blueprint structure with comprehensive checks"""
        
        try:
            required_fields = ["interpretation", "suggested_structure"]
            if not all(field in data for field in required_fields):
                return False
            
            structure = data["suggested_structure"]
            structure_fields = ["guild_name", "guild_purpose", "agents", "workflows"]
            if not all(field in structure for field in structure_fields):
                return False
            
            # Validate agents
            agents = structure["agents"]
            if not isinstance(agents, list) or len(agents) == 0:
                return False
            
            for agent in agents:
                agent_fields = ["name", "role", "description", "tools_needed"]
                if not all(field in agent for field in agent_fields):
                    return False
            
            # Validate workflows
            workflows = structure["workflows"]
            if not isinstance(workflows, list) or len(workflows) == 0:
                return False
            
            for workflow in workflows:
                workflow_fields = ["name", "description", "trigger_type"]
                if not all(field in workflow for field in workflow_fields):
                    return False
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Blueprint validation error: {e}")
            return False
    
    async def _generate_intelligent_fallback(self, user_input: str) -> Blueprint:
        """Generate intelligent fallback blueprint using business logic"""
        
        logger.info(f"🧠 Generating intelligent fallback blueprint for: {user_input[:50]}...")
        
        # Analyze user input for keywords and intent
        user_lower = user_input.lower()
        
        # Business domain detection
        domain_analysis = self._analyze_business_domain(user_lower)
        
        # Generate contextual blueprint
        blueprint_data = self._create_contextual_blueprint(user_input, domain_analysis)
        
        blueprint = Blueprint(
            id=str(uuid.uuid4()),
            user_input=user_input,
            interpretation=blueprint_data["interpretation"],
            suggested_structure=SuggestedStructure(**blueprint_data["suggested_structure"]),
            status="pending",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        logger.info(f"✅ Intelligent fallback blueprint generated: {blueprint.id}")
        return blueprint
    
    def _analyze_business_domain(self, user_input: str) -> Dict[str, Any]:
        """Analyze business domain with sophisticated keyword detection"""
        
        domain_keywords = {
            "customer_support": ["support", "customer", "help", "ticket", "issue", "problem", "service"],
            "sales": ["sales", "lead", "prospect", "deal", "revenue", "conversion", "pipeline"],
            "marketing": ["marketing", "campaign", "email", "social", "content", "brand", "advertising"],
            "finance": ["finance", "payment", "invoice", "billing", "accounting", "revenue", "expense"],
            "operations": ["operation", "process", "workflow", "automation", "efficiency", "task"],
            "analytics": ["analytics", "data", "report", "metrics", "insights", "dashboard", "tracking"],
            "hr": ["hr", "human resources", "employee", "hiring", "recruitment", "onboarding"],
            "ecommerce": ["shop", "store", "product", "order", "inventory", "shipping", "cart"]
        }
        
        detected_domains = []
        confidence_scores = {}
        
        for domain, keywords in domain_keywords.items():
            score = sum(1 for keyword in keywords if keyword in user_input)
            if score > 0:
                detected_domains.append(domain)
                confidence_scores[domain] = score
        
        primary_domain = max(confidence_scores.keys(), key=lambda k: confidence_scores[k]) if confidence_scores else "operations"
        
        return {
            "primary_domain": primary_domain,
            "detected_domains": detected_domains,
            "confidence_scores": confidence_scores
        }
    
    def _create_contextual_blueprint(self, user_input: str, domain_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Create contextual blueprint based on domain analysis"""
        
        primary_domain = domain_analysis["primary_domain"]
        
        # Domain-specific blueprint templates
        templates = {
            "customer_support": {
                "guild_name": "Customer Success Command Center",
                "guild_purpose": "Deliver exceptional customer experiences through intelligent automation and human-like support",
                "agents": [
                    {
                        "name": "Support Specialist",
                        "role": "Customer Support Agent",
                        "description": "Handles customer inquiries, resolves issues, and escalates complex problems with empathy and efficiency",
                        "tools_needed": ["Zendesk API", "Slack API", "Email Integration"]
                    },
                    {
                        "name": "Knowledge Curator",
                        "role": "Information Specialist",
                        "description": "Maintains and updates knowledge base, creates help articles, and ensures information accuracy",
                        "tools_needed": ["Knowledge Base API", "Document Generator", "Content Management"]
                    }
                ],
                "workflows": [
                    {
                        "name": "Intelligent Ticket Routing",
                        "description": "Automatically categorizes and routes support tickets to appropriate agents or teams",
                        "trigger_type": "webhook"
                    },
                    {
                        "name": "Customer Satisfaction Monitoring",
                        "description": "Tracks satisfaction scores and triggers follow-up actions for improvement",
                        "trigger_type": "schedule"
                    }
                ]
            },
            "sales": {
                "guild_name": "Revenue Growth Engine",
                "guild_purpose": "Accelerate sales velocity through intelligent lead nurturing and deal optimization",
                "agents": [
                    {
                        "name": "Lead Intelligence Agent",
                        "role": "Sales Development Representative",
                        "description": "Qualifies leads, enriches prospect data, and schedules meetings with decision makers",
                        "tools_needed": ["CRM API", "LinkedIn API", "Email Automation"]
                    },
                    {
                        "name": "Deal Accelerator",
                        "role": "Sales Operations Specialist",
                        "description": "Monitors deal progress, identifies bottlenecks, and suggests optimization strategies",
                        "tools_needed": ["Salesforce API", "Calendar API", "Analytics API"]
                    }
                ],
                "workflows": [
                    {
                        "name": "Lead Scoring and Routing",
                        "description": "Automatically scores leads and routes them to the most suitable sales representative",
                        "trigger_type": "webhook"
                    },
                    {
                        "name": "Pipeline Health Monitoring",
                        "description": "Daily analysis of sales pipeline with alerts for stalled deals and opportunities",
                        "trigger_type": "schedule"
                    }
                ]
            },
            "marketing": {
                "guild_name": "Brand Growth Accelerator",
                "guild_purpose": "Drive brand awareness and customer acquisition through intelligent marketing automation",
                "agents": [
                    {
                        "name": "Content Strategist",
                        "role": "Marketing Content Specialist",
                        "description": "Creates, schedules, and optimizes content across multiple marketing channels",
                        "tools_needed": ["Social Media APIs", "Email Marketing", "Content Management"]
                    },
                    {
                        "name": "Campaign Optimizer",
                        "role": "Marketing Analytics Specialist",
                        "description": "Analyzes campaign performance and automatically optimizes targeting and spending",
                        "tools_needed": ["Google Analytics", "Facebook Ads API", "Marketing Automation"]
                    }
                ],
                "workflows": [
                    {
                        "name": "Multi-Channel Campaign Execution",
                        "description": "Coordinates marketing campaigns across email, social media, and advertising platforms",
                        "trigger_type": "schedule"
                    },
                    {
                        "name": "Performance Optimization Loop",
                        "description": "Continuously monitors and optimizes campaign performance based on real-time data",
                        "trigger_type": "event"
                    }
                ]
            }
        }
        
        # Get template or use default
        template = templates.get(primary_domain, templates["customer_support"])
        
        # Customize interpretation based on user input
        interpretation = f"I understand you want to create an intelligent system for: {user_input}. Based on your requirements, I've designed a {template['guild_name']} that will automate and enhance your {primary_domain.replace('_', ' ')} operations with AI-powered agents."
        
        return {
            "interpretation": interpretation,
            "suggested_structure": template
        }

    async def generate_agent_response(self, agent_context: Dict[str, Any], query: str) -> str:
        """Generate intelligent agent responses with personality"""
        
        if self.available and self.model:
            return await self._generate_agent_response_with_gemini(agent_context, query)
        else:
            return self._generate_agent_response_fallback(agent_context, query)
    
    async def _generate_agent_response_with_gemini(self, agent_context: Dict[str, Any], query: str) -> str:
        """Generate agent response using Gemini with personality"""
        
        prompt = f"""
        You are {agent_context.get('name', 'AI Agent')}, a {agent_context.get('role', 'digital worker')} with distinct personality and expertise.
        
        Your personality: {agent_context.get('personality', 'Professional, helpful, and intelligent')}
        Your role: {agent_context.get('role', 'Digital Assistant')}
        Your instructions: {agent_context.get('instructions', 'Help users achieve their goals')}
        
        Recent conversation context:
        {agent_context.get('recent_memory', [])}
        
        User query: "{query}"
        
        Respond as this agent would, maintaining your personality while being helpful and professional.
        Keep responses concise but thorough. Show your expertise and include actionable insights when relevant.
        """
        
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.8,
                    top_p=0.9,
                    max_output_tokens=512,
                )
            )
            return response.text.strip()
        except Exception as e:
            logger.error(f"❌ Gemini agent response failed: {e}")
            return self._generate_agent_response_fallback(agent_context, query)
    
    def _generate_agent_response_fallback(self, agent_context: Dict[str, Any], query: str) -> str:
        """Generate fallback agent response with personality"""
        
        agent_name = agent_context.get('name', 'AI Agent')
        agent_role = agent_context.get('role', 'Digital Assistant')
        
        return f"Hello! I'm {agent_name}, your {agent_role}. I understand you're asking: '{query}'. I'm here to help you with intelligent solutions and would be happy to assist once I'm fully deployed. My capabilities include advanced reasoning and task execution specific to my role."

# Global AI service instance
ai_service = AIService()