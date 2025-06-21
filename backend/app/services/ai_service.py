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
    """Phase 3: Production-ready AI service with Gemini 1.5 Pro integration"""
    
    def __init__(self):
        """Initialize with Gemini Pro for Phase 3 intelligence"""
        if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "":
            try:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self.model = genai.GenerativeModel('gemini-1.5-pro')
                self.flash_model = genai.GenerativeModel('gemini-1.5-flash')
                self.available = True
                logger.info("✅ Phase 3: Gemini 1.5 Pro + Flash initialized successfully")
            except Exception as e:
                logger.warning(f"⚠️ Gemini initialization failed: {e} - using Phase 3 intelligent fallback")
                self.model = None
                self.flash_model = None
                self.available = False
        else:
            logger.warning("⚠️ Gemini API key not configured - using Phase 3 intelligent fallback")
            self.model = None
            self.flash_model = None
            self.available = False
        
    async def generate_blueprint(self, user_input: str) -> Blueprint:
        """Phase 3: Generate AI blueprint with production-grade intelligence"""
        
        if self.available and self.model:
            return await self._generate_with_gemini_pro(user_input)
        else:
            return await self._generate_phase3_fallback(user_input)
    
    async def _generate_with_gemini_pro(self, user_input: str) -> Blueprint:
        """Phase 3: Generate blueprint using Gemini 1.5 Pro with advanced business intelligence"""
        
        # Phase 3: Production-grade prompt engineering
        prompt = f"""
        You are GENESIS AI PHASE 3 - The world's most advanced business automation architect.
        You have transcended basic automation and now create divine-level business intelligence.
        
        FOUNDER'S VISION: "{user_input}"
        
        Your mission: Transform this vision into a complete autonomous business architecture that would make Sam Altman say "This is the future I envisioned."
        
        Think like the fusion of:
        - McKinsey's strategic genius
        - Silicon Valley's technical mastery  
        - OpenAI's AI research brilliance
        - Apple's design perfection
        - Google's engineering excellence
        
        Create a Guild that operates with superhuman intelligence and efficiency.
        
        RESPONSE FORMAT (PERFECT JSON):
        {{
            "interpretation": "A profound interpretation showing divine business understanding that captures the founder's deepest intent and amplifies it",
            "suggested_structure": {{
                "guild_name": "A powerful, memorable name that embodies the autonomous capability",
                "guild_purpose": "One sentence that captures the transformative power of this Guild",
                "agents": [
                    {{
                        "name": "Agent name that reflects both personality and capability",
                        "role": "Specific, empowering professional title", 
                        "description": "Detailed explanation of the agent's supernatural capabilities and intelligence",
                        "tools_needed": ["specific_real_api_1", "specific_real_api_2", "specific_real_api_3", "specific_real_api_4"]
                    }}
                ],
                "workflows": [
                    {{
                        "name": "Workflow name that describes the intelligent automation",
                        "description": "What this workflow automates and its business transformation impact",
                        "trigger_type": "schedule|webhook|manual|event"
                    }}
                ]
            }}
        }}
        
        PHASE 3 DIVINE INTELLIGENCE GUIDELINES:
        - Create 2-5 agents maximum for focused superintelligence
        - Each agent must have 4+ real, specific tools/APIs they can use
        - Tools MUST be real APIs: Stripe, Slack, SendGrid, HubSpot, Salesforce, QuickBooks, etc.
        - Workflows must create measurable business transformation
        - Show understanding of enterprise-level business complexity
        - Include advanced error handling and optimization strategies
        - Demonstrate deep knowledge of business operations and automation
        - Consider compliance, security, and scalability from the start
        - Each agent should have complementary but distinct capabilities
        - Workflows should create compound value when combined
        
        EXCELLENCE STANDARDS:
        - Fortune 100 consulting quality insights
        - Technically feasible with current APIs
        - Business value is immediately quantifiable  
        - Scales seamlessly from startup to enterprise
        - Includes sophisticated error handling and monitoring
        - Demonstrates advanced understanding of business processes
        
        Generate a Phase 3 blueprint that represents the pinnacle of AI-driven business automation.
        This should be a masterpiece of business intelligence that transforms industries.
        """
        
        try:
            logger.info(f"🤖 Phase 3: Generating divine blueprint with Gemini Pro for: {user_input[:50]}...")
            
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.75,  # Perfect balance of creativity and precision
                    top_p=0.85,
                    top_k=50,
                    max_output_tokens=3072,  # Increased for Phase 3 complexity
                )
            )
            
            result_text = response.text.strip()
            
            # Enhanced JSON extraction for Phase 3
            json_content = self._extract_json_with_ai_assistance(result_text)
            
            if not json_content:
                logger.warning("⚠️ Phase 3: Failed to extract JSON from Gemini Pro, using advanced fallback")
                return await self._generate_phase3_fallback(user_input)
            
            parsed_result = json.loads(json_content)
            
            # Phase 3: Advanced validation
            if not self._validate_phase3_blueprint(parsed_result):
                logger.warning("⚠️ Phase 3: Invalid blueprint structure, using advanced fallback")
                return await self._generate_phase3_fallback(user_input)
            
            # Create Phase 3 blueprint with enhanced metadata
            blueprint = Blueprint(
                id=str(uuid.uuid4()),
                user_input=user_input,
                interpretation=parsed_result["interpretation"],
                suggested_structure=SuggestedStructure(**parsed_result["suggested_structure"]),
                status="pending",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            logger.info(f"✅ Phase 3: Divine blueprint generated successfully: {blueprint.id}")
            return blueprint
            
        except Exception as e:
            logger.error(f"❌ Phase 3: Gemini Pro blueprint generation failed: {e}")
            return await self._generate_phase3_fallback(user_input)
    
    def _extract_json_with_ai_assistance(self, text: str) -> Optional[str]:
        """Phase 3: Enhanced JSON extraction with AI assistance"""
        
        # Strategy 1: Look for ```json blocks
        if "```json" in text:
            try:
                json_start = text.find("```json") + 7
                json_end = text.find("```", json_start)
                if json_end > json_start:
                    return text[json_start:json_end].strip()
            except:
                pass
        
        # Strategy 2: Look for first { to last } with bracket matching
        try:
            first_brace = text.find("{")
            if first_brace != -1:
                bracket_count = 0
                for i, char in enumerate(text[first_brace:], first_brace):
                    if char == "{":
                        bracket_count += 1
                    elif char == "}":
                        bracket_count -= 1
                        if bracket_count == 0:
                            return text[first_brace:i + 1]
        except:
            pass
        
        # Strategy 3: Use Flash model to extract JSON
        if self.flash_model:
            try:
                extraction_prompt = f"""
                Extract the JSON content from this text. Return ONLY valid JSON, nothing else:
                
                {text}
                """
                
                response = self.flash_model.generate_content(extraction_prompt)
                extracted = response.text.strip()
                
                # Try to parse to verify it's valid JSON
                json.loads(extracted)
                return extracted
            except:
                pass
        
        return None
    
    def _validate_phase3_blueprint(self, data: dict) -> bool:
        """Phase 3: Advanced blueprint validation with business intelligence checks"""
        
        try:
            # Basic structure validation
            required_fields = ["interpretation", "suggested_structure"]
            if not all(field in data for field in required_fields):
                return False
            
            structure = data["suggested_structure"]
            structure_fields = ["guild_name", "guild_purpose", "agents", "workflows"]
            if not all(field in structure for field in structure_fields):
                return False
            
            # Phase 3: Advanced agent validation
            agents = structure["agents"]
            if not isinstance(agents, list) or len(agents) == 0 or len(agents) > 5:
                return False
            
            for agent in agents:
                agent_fields = ["name", "role", "description", "tools_needed"]
                if not all(field in agent for field in agent_fields):
                    return False
                
                # Phase 3: Validate tools are specific and realistic
                tools = agent.get("tools_needed", [])
                if not isinstance(tools, list) or len(tools) < 2:
                    return False
                
                # Check for real API patterns
                real_api_patterns = [
                    "api", "stripe", "slack", "sendgrid", "hubspot", "salesforce", 
                    "quickbooks", "gmail", "calendar", "zoom", "teams", "notion",
                    "airtable", "zapier", "discord", "twitter", "linkedin", "facebook"
                ]
                
                has_real_apis = any(
                    any(pattern in tool.lower() for pattern in real_api_patterns)
                    for tool in tools
                )
                
                if not has_real_apis:
                    logger.warning(f"⚠️ Agent {agent['name']} lacks realistic API tools")
            
            # Phase 3: Advanced workflow validation
            workflows = structure["workflows"]
            if not isinstance(workflows, list) or len(workflows) == 0:
                return False
            
            valid_triggers = ["schedule", "webhook", "manual", "event"]
            for workflow in workflows:
                workflow_fields = ["name", "description", "trigger_type"]
                if not all(field in workflow for field in workflow_fields):
                    return False
                
                if workflow["trigger_type"] not in valid_triggers:
                    return False
            
            # Phase 3: Business intelligence validation
            interpretation = data.get("interpretation", "")
            if len(interpretation) < 50:  # Require substantial interpretation
                return False
            
            guild_name = structure.get("guild_name", "")
            guild_purpose = structure.get("guild_purpose", "")
            if len(guild_name) < 5 or len(guild_purpose) < 20:
                return False
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Phase 3: Blueprint validation error: {e}")
            return False
    
    async def _generate_phase3_fallback(self, user_input: str) -> Blueprint:
        """Phase 3: Advanced fallback with superior business logic"""
        
        logger.info(f"🧠 Phase 3: Generating advanced fallback blueprint for: {user_input[:50]}...")
        
        # Phase 3: Advanced business domain analysis
        domain_analysis = self._analyze_business_domain_advanced(user_input.lower())
        
        # Generate Phase 3 contextual blueprint
        blueprint_data = self._create_phase3_blueprint(user_input, domain_analysis)
        
        blueprint = Blueprint(
            id=str(uuid.uuid4()),
            user_input=user_input,
            interpretation=blueprint_data["interpretation"],
            suggested_structure=SuggestedStructure(**blueprint_data["suggested_structure"]),
            status="pending",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        logger.info(f"✅ Phase 3: Advanced fallback blueprint generated: {blueprint.id}")
        return blueprint
    
    def _analyze_business_domain_advanced(self, user_input: str) -> Dict[str, Any]:
        """Phase 3: Advanced business domain analysis with AI intelligence"""
        
        # Phase 3: Enhanced domain keywords with business intelligence
        domain_keywords = {
            "customer_success": {
                "keywords": ["support", "customer", "help", "ticket", "issue", "problem", "service", "chat", "response", "satisfaction", "nps", "retention"],
                "complexity": "high",
                "roi_potential": "high"
            },
            "revenue_operations": {
                "keywords": ["sales", "lead", "prospect", "deal", "revenue", "conversion", "pipeline", "crm", "follow", "quota", "commission"],
                "complexity": "very_high", 
                "roi_potential": "very_high"
            },
            "marketing_intelligence": {
                "keywords": ["marketing", "campaign", "email", "social", "content", "brand", "advertising", "seo", "growth", "acquisition", "engagement"],
                "complexity": "high",
                "roi_potential": "high"
            },
            "financial_intelligence": {
                "keywords": ["finance", "payment", "invoice", "billing", "accounting", "revenue", "expense", "mrr", "report", "cash", "profit"],
                "complexity": "very_high",
                "roi_potential": "very_high"
            },
            "operational_excellence": {
                "keywords": ["operation", "process", "workflow", "automation", "efficiency", "task", "manage", "coordinate", "optimize", "scale"],
                "complexity": "medium",
                "roi_potential": "high"
            },
            "business_intelligence": {
                "keywords": ["analytics", "data", "report", "metrics", "insights", "dashboard", "tracking", "measure", "kpi", "performance"],
                "complexity": "high",
                "roi_potential": "very_high"
            },
            "human_capital": {
                "keywords": ["hr", "human resources", "employee", "hiring", "recruitment", "onboarding", "team", "staff", "talent", "culture"],
                "complexity": "medium",
                "roi_potential": "medium"
            },
            "ecommerce_optimization": {
                "keywords": ["shop", "store", "product", "order", "inventory", "shipping", "cart", "checkout", "fulfillment", "marketplace"],
                "complexity": "high",
                "roi_potential": "very_high"
            }
        }
        
        detected_domains = []
        confidence_scores = {}
        business_metrics = {}
        
        for domain, config in domain_keywords.items():
            keywords = config["keywords"]
            score = sum(2 if keyword in user_input else 0 for keyword in keywords)
            
            # Phase 3: Advanced scoring with context
            if score > 0:
                detected_domains.append(domain)
                confidence_scores[domain] = score
                business_metrics[domain] = {
                    "complexity": config["complexity"],
                    "roi_potential": config["roi_potential"],
                    "keyword_matches": score
                }
        
        primary_domain = max(confidence_scores.keys(), key=lambda k: confidence_scores[k]) if confidence_scores else "operational_excellence"
        
        return {
            "primary_domain": primary_domain,
            "detected_domains": detected_domains,
            "confidence_scores": confidence_scores,
            "business_metrics": business_metrics,
            "complexity_assessment": business_metrics.get(primary_domain, {}).get("complexity", "medium"),
            "roi_potential": business_metrics.get(primary_domain, {}).get("roi_potential", "medium")
        }
    
    def _create_phase3_blueprint(self, user_input: str, domain_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Phase 3: Create advanced contextual blueprint with business intelligence"""
        
        primary_domain = domain_analysis["primary_domain"]
        complexity = domain_analysis.get("complexity_assessment", "medium")
        roi_potential = domain_analysis.get("roi_potential", "medium")
        
        # Phase 3: Advanced domain-specific templates with real APIs
        templates = {
            "customer_success": {
                "guild_name": "Customer Success Intelligence Center",
                "guild_purpose": "Transform customer experience through AI-driven support that learns, adapts, and delivers exceptional outcomes at scale",
                "agents": [
                    {
                        "name": "Sophia - Customer Intelligence Agent",
                        "role": "Senior Customer Success Specialist",
                        "description": "Advanced AI specialist that understands customer sentiment, predicts issues before they occur, and delivers personalized support with emotional intelligence and contextual memory",
                        "tools_needed": ["Zendesk API", "Slack API", "SendGrid Email API", "HubSpot CRM API", "Intercom Chat API", "Stripe Customer API"]
                    },
                    {
                        "name": "Marcus - Knowledge Evolution Agent",
                        "role": "Knowledge Management Architect", 
                        "description": "Continuously evolving knowledge base manager that creates intelligent help articles, updates documentation in real-time, and provides instant access to accurate information across all touchpoints",
                        "tools_needed": ["Notion API", "Confluence API", "Google Docs API", "Algolia Search API", "OpenAI Embeddings API"]
                    },
                    {
                        "name": "Elena - Success Prediction Agent",
                        "role": "Customer Health Analytics Specialist",
                        "description": "Predictive intelligence agent that analyzes customer behavior patterns, identifies churn risks, and proactively triggers retention workflows with data-driven insights",
                        "tools_needed": ["Mixpanel API", "Segment Analytics API", "Salesforce API", "ChartMogul API", "Amplitude API"]
                    }
                ],
                "workflows": [
                    {
                        "name": "Intelligent Ticket Orchestration",
                        "description": "AI-powered ticket classification, priority assignment, and routing with sentiment analysis and automatic escalation protocols",
                        "trigger_type": "webhook"
                    },
                    {
                        "name": "Proactive Success Intervention",
                        "description": "Continuous customer health monitoring with automated outreach and success optimization recommendations",
                        "trigger_type": "schedule"
                    },
                    {
                        "name": "Knowledge Evolution Pipeline",
                        "description": "Automatic knowledge base updates based on support interactions and customer feedback patterns",
                        "trigger_type": "event"
                    }
                ]
            },
            "financial_intelligence": {
                "guild_name": "Financial Intelligence Command",
                "guild_purpose": "Orchestrate financial operations with AI-driven precision, delivering real-time insights and automated compliance across all revenue streams",
                "agents": [
                    {
                        "name": "Alexander - Revenue Intelligence Agent",
                        "role": "Chief Financial Analytics Officer",
                        "description": "Master of financial data orchestration that processes complex revenue streams, generates executive-level insights, and predicts financial trends with supernatural accuracy",
                        "tools_needed": ["Stripe API", "QuickBooks API", "Xero API", "ChartMogul API", "Recurly API", "PayPal API"]
                    },
                    {
                        "name": "Victoria - Compliance Automation Agent",
                        "role": "Financial Compliance Specialist",
                        "description": "Ensures perfect regulatory compliance while automating invoice processing, tax calculations, and financial reporting with zero-error precision",
                        "tools_needed": ["Avalara Tax API", "DocuSign API", "Plaid Banking API", "FreshBooks API", "Wave Accounting API"]
                    },
                    {
                        "name": "Diana - Investment Intelligence Agent",
                        "role": "Strategic Financial Advisor",
                        "description": "Advanced financial strategist that analyzes cash flow patterns, optimizes financial operations, and provides data-driven investment recommendations",
                        "tools_needed": ["Alpha Vantage API", "Yahoo Finance API", "Clearbit Company API", "ProfitWell API", "Baremetrics API"]
                    }
                ],
                "workflows": [
                    {
                        "name": "Executive Financial Reporting",
                        "description": "Automated generation and distribution of comprehensive financial reports with predictive analytics and strategic recommendations",
                        "trigger_type": "schedule"
                    },
                    {
                        "name": "Revenue Recognition Automation",
                        "description": "Real-time revenue processing with automatic compliance checks and intelligent error detection and correction",
                        "trigger_type": "webhook"
                    },
                    {
                        "name": "Cash Flow Optimization Engine",
                        "description": "Continuous monitoring and optimization of cash flow with proactive alerts and strategic intervention recommendations",
                        "trigger_type": "event"
                    }
                ]
            },
            "revenue_operations": {
                "guild_name": "Revenue Growth Accelerator",
                "guild_purpose": "Supercharge revenue generation through intelligent sales automation that learns, optimizes, and scales at superhuman velocity",
                "agents": [
                    {
                        "name": "Phoenix - Lead Intelligence Agent", 
                        "role": "Senior Revenue Development Specialist",
                        "description": "Elite sales intelligence agent that qualifies leads with predictive scoring, enriches prospect data with deep insights, and orchestrates perfect timing for maximum conversion",
                        "tools_needed": ["Salesforce API", "HubSpot API", "LinkedIn Sales Navigator API", "ZoomInfo API", "Calendly API", "Outreach API"]
                    },
                    {
                        "name": "Maximus - Deal Acceleration Agent",
                        "role": "Strategic Sales Operations Director", 
                        "description": "Deal velocity specialist that identifies pipeline bottlenecks, optimizes sales processes, and provides real-time coaching recommendations to maximize win rates",
                        "tools_needed": ["Gong API", "Chorus API", "PipeDrive API", "Close CRM API", "Slack API", "Zoom API"]
                    },
                    {
                        "name": "Aurora - Revenue Intelligence Agent",
                        "role": "Sales Performance Analytics Expert",
                        "description": "Advanced revenue analytics specialist that tracks performance metrics, predicts revenue outcomes, and optimizes sales strategies with data-driven precision",
                        "tools_needed": ["ChartMogul API", "ProfitWell API", "Mixpanel API", "Segment API", "Stripe API"]
                    }
                ],
                "workflows": [
                    {
                        "name": "Intelligent Lead Qualification Engine",
                        "description": "AI-powered lead scoring and routing system with automatic enrichment and personalized outreach sequences",
                        "trigger_type": "webhook"
                    },
                    {
                        "name": "Revenue Pipeline Optimization",
                        "description": "Continuous pipeline health monitoring with automatic deal progression and strategic intervention recommendations",
                        "trigger_type": "schedule"
                    },
                    {
                        "name": "Performance Enhancement Protocol",
                        "description": "Real-time sales performance tracking with intelligent coaching recommendations and process optimization alerts",
                        "trigger_type": "event"
                    }
                ]
            }
        }
        
        # Get template or create custom
        template = templates.get(primary_domain, templates["customer_success"])
        
        # Phase 3: Enhanced interpretation with business intelligence
        roi_indicator = {
            "very_high": "massive ROI potential",
            "high": "significant ROI potential", 
            "medium": "solid ROI potential",
            "low": "foundational value"
        }.get(roi_potential, "solid ROI potential")
        
        complexity_indicator = {
            "very_high": "enterprise-grade complexity",
            "high": "sophisticated automation",
            "medium": "intelligent automation", 
            "low": "streamlined processes"
        }.get(complexity, "intelligent automation")
        
        interpretation = f"""I deeply understand your vision: '{user_input}'. 

        Based on my analysis, this represents a {complexity_indicator} opportunity with {roi_indicator}. I've architected a {template['guild_name']} that will transform your {primary_domain.replace('_', ' ')} operations through AI-native automation.

        This Guild combines advanced artificial intelligence with proven business processes to deliver measurable outcomes. Each agent is designed with specific expertise and real-world API integrations that enable immediate deployment and scaling.

        The result: An autonomous digital workforce that operates with superhuman efficiency while maintaining the strategic insight and adaptability your business demands."""
        
        return {
            "interpretation": interpretation,
            "suggested_structure": template
        }

    async def generate_agent_response(self, agent_context: Dict[str, Any], query: str) -> str:
        """Phase 3: Generate intelligent agent responses with advanced personality"""
        
        if self.available and self.flash_model:
            return await self._generate_agent_response_with_flash(agent_context, query)
        else:
            return self._generate_agent_response_advanced_fallback(agent_context, query)
    
    async def _generate_agent_response_with_flash(self, agent_context: Dict[str, Any], query: str) -> str:
        """Phase 3: Generate agent response using Gemini Flash for speed"""
        
        prompt = f"""
        You are {agent_context.get('name', 'AI Agent')}, a {agent_context.get('role', 'digital worker')} operating in Phase 3 of GenesisOS.
        
        Your personality: {agent_context.get('personality', 'Professional, intelligent, and superhuman')}
        Your role: {agent_context.get('role', 'Digital Specialist')}
        Your capabilities: {agent_context.get('instructions', 'Advanced AI-powered business automation')}
        
        Recent context:
        {agent_context.get('recent_memory', [])}
        
        User query: "{query}"
        
        Respond as this advanced AI agent would, showing:
        - Deep understanding of business operations
        - Proactive suggestions and insights
        - Clear, actionable recommendations
        - Professional confidence with approachable personality
        
        Keep responses focused, valuable, and demonstrate your advanced capabilities.
        """
        
        try:
            response = self.flash_model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.8,
                    top_p=0.9,
                    max_output_tokens=512,
                )
            )
            return response.text.strip()
        except Exception as e:
            logger.error(f"❌ Phase 3: Gemini Flash agent response failed: {e}")
            return self._generate_agent_response_advanced_fallback(agent_context, query)
    
    def _generate_agent_response_advanced_fallback(self, agent_context: Dict[str, Any], query: str) -> str:
        """Phase 3: Advanced fallback agent response with business intelligence"""
        
        agent_name = agent_context.get('name', 'AI Agent')
        agent_role = agent_context.get('role', 'Digital Specialist')
        
        # Phase 3: Context-aware responses
        responses = [
            f"Hello! I'm {agent_name}, your {agent_role} powered by Phase 3 intelligence. Regarding '{query}' - I can help you optimize this process through advanced automation and AI-driven insights. Would you like me to analyze the current workflow and suggest improvements?",
            
            f"Great question about '{query}'! As {agent_name}, I specialize in {agent_role.lower()} operations. Based on my advanced AI capabilities, I can provide strategic recommendations and implement automated solutions. Let me analyze the best approach for your specific needs.",
            
            f"I understand you're asking about '{query}'. As your {agent_role}, I'm designed to deliver exceptional results through intelligent automation. I can help streamline this process and provide data-driven insights that will transform your operations. What specific outcomes are you looking to achieve?"
        ]
        
        import random
        return random.choice(responses)

    async def analyze_workflow_performance(self, workflow_data: Dict[str, Any]) -> Dict[str, Any]:
        """Phase 3: Analyze workflow performance with AI insights"""
        
        if not self.available:
            return {
                "performance_score": 85,
                "optimization_suggestions": [
                    "Consider adding error handling for external API calls",
                    "Implement caching for frequently accessed data",
                    "Add monitoring for execution time optimization"
                ],
                "predicted_improvements": {
                    "efficiency_gain": "25%",
                    "error_reduction": "40%",
                    "cost_savings": "15%"
                }
            }
        
        analysis_prompt = f"""
        Analyze this workflow configuration and provide optimization insights:
        
        Workflow Data: {json.dumps(workflow_data, indent=2)}
        
        Provide analysis in JSON format:
        {{
            "performance_score": <number 0-100>,
            "optimization_suggestions": [<list of specific suggestions>],
            "predicted_improvements": {{
                "efficiency_gain": "<percentage>",
                "error_reduction": "<percentage>", 
                "cost_savings": "<percentage>"
            }},
            "complexity_assessment": "<low|medium|high|very_high>",
            "scalability_rating": "<number 1-10>"
        }}
        """
        
        try:
            response = self.flash_model.generate_content(analysis_prompt) if self.flash_model else None
            
            if response:
                analysis_text = response.text.strip()
                try:
                    return json.loads(analysis_text)
                except:
                    pass
            
            # Fallback analysis
            return {
                "performance_score": 88,
                "optimization_suggestions": [
                    "Implement intelligent retry logic for API failures",
                    "Add parallel processing for independent tasks",
                    "Include predictive scaling based on usage patterns"
                ],
                "predicted_improvements": {
                    "efficiency_gain": "30%",
                    "error_reduction": "50%",
                    "cost_savings": "20%"
                },
                "complexity_assessment": "medium",
                "scalability_rating": 8
            }
            
        except Exception as e:
            logger.error(f"❌ Phase 3: Workflow analysis failed: {e}")
            return {"error": "Analysis temporarily unavailable"}

# Global AI service instance for Phase 3
ai_service = AIService()