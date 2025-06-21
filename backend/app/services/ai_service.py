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
    """Phase 1: Enhanced AI service for intelligent blueprint generation"""
    
    def __init__(self):
        """Initialize with Gemini Pro for maximum intelligence in Phase 1"""
        if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "":
            try:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self.model = genai.GenerativeModel('gemini-1.5-pro')
                self.available = True
                logger.info("✅ Gemini 1.5 Pro initialized successfully for Phase 1")
            except Exception as e:
                logger.warning(f"⚠️ Gemini initialization failed: {e} - using intelligent fallback")
                self.model = None
                self.available = False
        else:
            logger.warning("⚠️ Gemini API key not configured - using intelligent fallback for Phase 1")
            self.model = None
            self.available = False
        
    async def generate_blueprint(self, user_input: str) -> Blueprint:
        """Generate AI blueprint from user intent with Phase 1 intelligence"""
        
        if self.available and self.model:
            return await self._generate_with_gemini(user_input)
        else:
            return await self._generate_intelligent_fallback(user_input)
    
    async def _generate_with_gemini(self, user_input: str) -> Blueprint:
        """Generate blueprint using Gemini 1.5 Pro with advanced Phase 1 prompting"""
        
        # Phase 1: Advanced prompt engineering for business intelligence
        prompt = f"""
        You are GENESIS AI - the world's most advanced business automation architect in Phase 1 development.
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
        
        PHASE 1 INTELLIGENCE GUIDELINES:
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
        
        Generate a Phase 1 blueprint that would impress Sam Altman and solve real business problems.
        """
        
        try:
            logger.info(f"🤖 Phase 1: Generating blueprint with Gemini for: {user_input[:50]}...")
            
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
            
            # Create blueprint object with Phase 1 metadata
            blueprint = Blueprint(
                id=str(uuid.uuid4()),
                user_input=user_input,
                interpretation=parsed_result["interpretation"],
                suggested_structure=SuggestedStructure(**parsed_result["suggested_structure"]),
                status="pending",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            logger.info(f"✅ Phase 1: Gemini blueprint generated successfully: {blueprint.id}")
            return blueprint
            
        except Exception as e:
            logger.error(f"❌ Phase 1: Gemini blueprint generation failed: {e}")
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
        """Validate Phase 1 blueprint structure with comprehensive checks"""
        
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
            logger.error(f"❌ Phase 1: Blueprint validation error: {e}")
            return False
    
    async def _generate_intelligent_fallback(self, user_input: str) -> Blueprint:
        """Generate intelligent fallback blueprint using Phase 1 business logic"""
        
        logger.info(f"🧠 Phase 1: Generating intelligent fallback blueprint for: {user_input[:50]}...")
        
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
        
        logger.info(f"✅ Phase 1: Intelligent fallback blueprint generated: {blueprint.id}")
        return blueprint
    
    def _analyze_business_domain(self, user_input: str) -> Dict[str, Any]:
        """Analyze business domain with sophisticated Phase 1 keyword detection"""
        
        domain_keywords = {
            "customer_support": ["support", "customer", "help", "ticket", "issue", "problem", "service", "chat", "response"],
            "sales": ["sales", "lead", "prospect", "deal", "revenue", "conversion", "pipeline", "crm", "follow"],
            "marketing": ["marketing", "campaign", "email", "social", "content", "brand", "advertising", "seo", "growth"],
            "finance": ["finance", "payment", "invoice", "billing", "accounting", "revenue", "expense", "mrr", "report"],
            "operations": ["operation", "process", "workflow", "automation", "efficiency", "task", "manage", "coordinate"],
            "analytics": ["analytics", "data", "report", "metrics", "insights", "dashboard", "tracking", "measure"],
            "hr": ["hr", "human resources", "employee", "hiring", "recruitment", "onboarding", "team", "staff"],
            "ecommerce": ["shop", "store", "product", "order", "inventory", "shipping", "cart", "checkout", "fulfillment"]
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
        """Create contextual Phase 1 blueprint based on domain analysis"""
        
        primary_domain = domain_analysis["primary_domain"]
        
        # Phase 1: Domain-specific blueprint templates
        templates = {
            "customer_support": {
                "guild_name": "Customer Success Command Center",
                "guild_purpose": "Deliver exceptional customer experiences through intelligent automation and human-like support",
                "agents": [
                    {
                        "name": "Support Intelligence Agent",
                        "role": "Customer Support Specialist",
                        "description": "Handles customer inquiries with empathy, resolves issues intelligently, and escalates complex problems with context preservation",
                        "tools_needed": ["Zendesk API", "Slack Integration", "Email Automation", "Knowledge Base API"]
                    },
                    {
                        "name": "Knowledge Curator",
                        "role": "Information Management Specialist",
                        "description": "Maintains and updates knowledge base, creates help articles, and ensures information accuracy with real-time updates",
                        "tools_needed": ["Knowledge Base API", "Document Generator", "Content Management", "Search Analytics"]
                    }
                ],
                "workflows": [
                    {
                        "name": "Intelligent Ticket Routing",
                        "description": "Automatically categorizes and routes support tickets to appropriate agents with priority scoring",
                        "trigger_type": "webhook"
                    },
                    {
                        "name": "Customer Satisfaction Monitoring",
                        "description": "Tracks satisfaction scores and triggers follow-up actions for continuous improvement",
                        "trigger_type": "schedule"
                    }
                ]
            },
            "finance": {
                "guild_name": "Financial Intelligence Hub",
                "guild_purpose": "Automate financial reporting and insights with enterprise-grade accuracy and real-time monitoring",
                "agents": [
                    {
                        "name": "Revenue Analytics Agent",
                        "role": "Financial Data Analyst",
                        "description": "Processes revenue data, generates MRR reports, and provides financial insights with predictive analytics",
                        "tools_needed": ["Stripe API", "QuickBooks API", "Slack Integration", "Analytics Dashboard"]
                    },
                    {
                        "name": "Report Distribution Agent", 
                        "role": "Communication Specialist",
                        "description": "Formats and distributes financial reports to stakeholders with personalized insights and scheduling",
                        "tools_needed": ["Email API", "Slack API", "PDF Generator", "Calendar Integration"]
                    }
                ],
                "workflows": [
                    {
                        "name": "Weekly MRR Report Generation",
                        "description": "Automatically generates and distributes weekly Monthly Recurring Revenue reports with insights",
                        "trigger_type": "schedule"
                    },
                    {
                        "name": "Financial Threshold Alerts",
                        "description": "Monitors key financial metrics and sends alerts when thresholds are crossed",
                        "trigger_type": "event"
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
                        "description": "Qualifies leads, enriches prospect data, and schedules meetings with decision makers using advanced scoring",
                        "tools_needed": ["CRM API", "LinkedIn API", "Email Automation", "Calendar Integration"]
                    },
                    {
                        "name": "Deal Accelerator",
                        "role": "Sales Operations Specialist",
                        "description": "Monitors deal progress, identifies bottlenecks, and suggests optimization strategies with AI insights",
                        "tools_needed": ["Salesforce API", "Calendar API", "Analytics API", "Communication Tools"]
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
            }
        }
        
        # Get template or use default
        template = templates.get(primary_domain, templates["customer_support"])
        
        # Customize interpretation based on user input
        interpretation = f"I understand you want to create an intelligent system for: {user_input}. Based on your requirements, I've designed a {template['guild_name']} that will automate and enhance your {primary_domain.replace('_', ' ')} operations with AI-powered agents working in perfect coordination."
        
        return {
            "interpretation": interpretation,
            "suggested_structure": template
        }

    async def generate_agent_response(self, agent_context: Dict[str, Any], query: str) -> str:
        """Generate intelligent agent responses with personality (Phase 2+)"""
        
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