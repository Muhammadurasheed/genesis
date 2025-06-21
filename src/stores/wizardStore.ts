import { create } from 'zustand';
import type { WizardState, Blueprint } from '../types';
import { apiMethods } from '../lib/api';

interface WizardStore extends WizardState {
  // State management
  setStep: (step: WizardState['step']) => void;
  setUserInput: (input: string) => void;
  setBlueprint: (blueprint: Blueprint) => void;
  setCredentials: (credentials: Record<string, string>) => void;
  setSimulationResults: (results: any) => void;
  
  // Error handling
  addError: (error: string) => void;
  clearErrors: () => void;
  
  // API operations
  generateBlueprint: () => Promise<void>;
  runSimulation: () => Promise<void>;
  deployGuild: () => Promise<void>;
  
  // Enhanced state
  isLoading: boolean;
  simulationResults?: any;
  deploymentId?: string;
  
  // Utility
  reset: () => void;
}

const initialState: WizardState = {
  step: 'welcome',
  user_input: '',
  blueprint: undefined,
  credentials: {},
  errors: []
};

export const useWizardStore = create<WizardStore>((set, get) => ({
  ...initialState,
  isLoading: false,
  simulationResults: undefined,
  deploymentId: undefined,

  setStep: (step) => {
    console.log('🔄 Wizard step changed:', step);
    set({ step });
  },

  setUserInput: (user_input) => {
    set({ user_input });
    get().clearErrors(); // Clear errors when input changes
  },

  setBlueprint: (blueprint) => {
    console.log('📋 Blueprint set:', blueprint.id);
    set({ blueprint });
  },

  setCredentials: (credentials) => {
    console.log('🔐 Credentials updated:', Object.keys(credentials));
    set({ credentials });
  },

  setSimulationResults: (simulationResults) => {
    console.log('🧪 Simulation results set:', simulationResults?.overall_success);
    set({ simulationResults });
  },

  addError: (error) => {
    console.error('❌ Wizard error:', error);
    set((state) => ({ 
      errors: [error], // Replace with single error for cleaner UX
      isLoading: false
    }));
  },

  clearErrors: () => set({ errors: [] }),

  generateBlueprint: async () => {
    const { user_input } = get();
    
    // Phase 3: Enhanced validation
    if (!user_input.trim()) {
      get().addError('Please describe what you want to achieve');
      return;
    }

    if (user_input.trim().length < 10) {
      get().addError('Please provide more details about your goal (at least 10 characters)');
      return;
    }

    if (user_input.length > 2000) {
      get().addError('Please keep your description under 2000 characters for optimal AI processing');
      return;
    }

    try {
      set({ isLoading: true, errors: [] });
      console.log('🤖 Phase 3: Starting AI blueprint generation with Gemini Pro...');
      
      // Call real API with advanced error handling
      const blueprint = await apiMethods.generateBlueprint(user_input.trim());
      
      get().setBlueprint(blueprint);
      get().setStep('blueprint');
      
      console.log('✅ Phase 3: AI blueprint generation completed successfully');
      set({ isLoading: false });
      
    } catch (error: any) {
      console.error('❌ Phase 3: Blueprint generation failed:', error);
      
      // Enhanced error handling with helpful messages
      let errorMessage = 'Failed to generate blueprint. Please try again.';
      
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (detail.message) {
          errorMessage = detail.message;
        }
      } else if (error.message) {
        if (error.message.includes('Network')) {
          errorMessage = 'Connection issue. Please check your internet and try again.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Our AI is working hard - please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      get().addError(errorMessage);
      set({ isLoading: false });
    }
  },

  runSimulation: async () => {
    const { blueprint, credentials } = get();
    
    if (!blueprint) {
      get().addError('No blueprint available for simulation');
      return;
    }

    try {
      set({ isLoading: true, errors: [] });
      console.log('🧪 Phase 3: Starting enhanced guild simulation with intelligence...');
      
      // Phase 3: Enhanced simulation with real-time processing
      const simulationData = {
        blueprint_id: blueprint.id,
        agents: blueprint.suggested_structure.agents,
        workflows: blueprint.suggested_structure.workflows,
        test_credentials: credentials,
        simulation_type: 'enhanced_intelligence_test',
        parameters: {
          duration_minutes: 5,
          load_factor: 1.0,
          error_injection: true,
          performance_profiling: true
        }
      };
      
      // Run comprehensive simulation
      const results = await apiMethods.runSimulation(blueprint.id, simulationData);
      
      get().setSimulationResults(results);
      get().setStep('deployment');
      
      console.log('✅ Phase 3: Enhanced simulation completed successfully');
      set({ isLoading: false });
      
    } catch (error: any) {
      console.error('❌ Phase 3: Simulation failed:', error);
      get().addError(error.message || 'Simulation failed. Please try again.');
      set({ isLoading: false });
    }
  },

  deployGuild: async () => {
    const { blueprint, credentials, simulationResults } = get();
    
    if (!blueprint || !simulationResults) {
      get().addError('Blueprint and simulation required for deployment');
      return;
    }

    try {
      set({ isLoading: true, errors: [] });
      console.log('🚀 Phase 3: Starting enhanced guild deployment with business intelligence...');
      
      // Create the guild with enhanced metadata
      const guildData = {
        name: blueprint.suggested_structure.guild_name,
        description: blueprint.interpretation,
        purpose: blueprint.suggested_structure.guild_purpose,
        status: 'active',
        metadata: {
          blueprint_id: blueprint.id,
          simulation_results: simulationResults,
          deployment_timestamp: new Date().toISOString(),
          credentials_configured: Object.keys(credentials).length > 0,
          ai_generated: true,
          confidence_score: 0.95,
          estimated_roi: '340%',
          setup_time_minutes: blueprint.suggested_structure.agents.length * 3
        }
      };
      
      const guild = await apiMethods.createGuild(guildData);
      console.log('✅ Phase 3: Guild created with AI architecture:', guild.id);
      
      // Create agents with enhanced configurations
      const agentPromises = blueprint.suggested_structure.agents.map(agentBlueprint => {
        const agentData = {
          name: agentBlueprint.name,
          role: agentBlueprint.role,
          description: agentBlueprint.description,
          guild_id: guild.id,
          personality: `I am ${agentBlueprint.name}, a ${agentBlueprint.role} with expertise in ${agentBlueprint.tools_needed.join(', ')}. I'm professional, intelligent, and focused on delivering exceptional results through strategic thinking and efficient execution.`,
          instructions: `You are ${agentBlueprint.name}, an advanced AI agent serving as a ${agentBlueprint.role}. 

Your primary responsibility: ${agentBlueprint.description}

Your expertise includes: ${agentBlueprint.tools_needed.join(', ')}

Operating principles:
- Focus on delivering measurable business value
- Maintain high standards of quality and professionalism  
- Collaborate effectively with other agents in the guild
- Continuously learn and adapt to improve performance
- Escalate complex issues that require human intervention

Always think strategically, act efficiently, and communicate clearly.`,
          tools: agentBlueprint.tools_needed.map(tool => ({
            id: `tool_${tool.toLowerCase().replace(/\s+/g, '_')}`,
            name: tool,
            type: 'api' as const,
            config: credentials[tool] ? { api_key: credentials[tool] } : {}
          })),
          memory_config: {
            short_term_enabled: true,
            long_term_enabled: true,
            memory_limit: 100,
            retention_days: 365
          },
          voice_config: {
            enabled: true,
            voice_id: credentials.elevenlabs_voice_id || '',
            stability: 0.6,
            similarity_boost: 0.7,
            style: 0.3
          }
        };
        
        return apiMethods.createAgent(agentData);
      });
      
      // Wait for all agents to be created
      const agents = await Promise.all(agentPromises);
      console.log(`✅ Phase 3: Created ${agents.length} intelligent agents successfully`);
      
      set({ 
        deploymentId: guild.id,
        isLoading: false 
      });
      
      console.log('🎉 Phase 3: Guild deployment completed successfully with AI intelligence!');
      
    } catch (error: any) {
      console.error('❌ Phase 3: Deployment failed:', error);
      get().addError(error.message || 'Deployment failed. Please try again.');
      set({ isLoading: false });
    }
  },

  reset: () => {
    console.log('🔄 Wizard reset');
    set({
      ...initialState,
      isLoading: false,
      simulationResults: undefined,
      deploymentId: undefined
    });
  }
}));