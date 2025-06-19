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

  setUserInput: (user_input) => set({ user_input }),

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
      errors: [...state.errors, error],
      isLoading: false
    }));
  },

  clearErrors: () => set({ errors: [] }),

  generateBlueprint: async () => {
    const { user_input } = get();
    
    if (!user_input.trim()) {
      get().addError('Please provide your goal or requirement');
      return;
    }

    try {
      set({ isLoading: true, errors: [] });
      console.log('🤖 Starting AI blueprint generation...');
      
      // Call API with smart fallback handling
      const blueprint = await apiMethods.generateBlueprint(user_input);
      
      get().setBlueprint(blueprint);
      get().setStep('blueprint');
      
      console.log('✅ Blueprint generation completed successfully');
      set({ isLoading: false });
      
    } catch (error: any) {
      console.error('❌ Blueprint generation failed:', error);
      get().addError(error.message || 'Failed to generate blueprint. Please try again.');
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
      console.log('🧪 Starting intelligent guild simulation...');
      
      // Prepare simulation data
      const simulationData = {
        blueprint_id: blueprint.id,
        agents: blueprint.suggested_structure.agents,
        workflows: blueprint.suggested_structure.workflows,
        test_credentials: credentials,
        simulation_type: 'full_workflow_intelligence_test'
      };
      
      // Run comprehensive simulation
      const results = await apiMethods.runSimulation(blueprint.id, simulationData);
      
      get().setSimulationResults(results);
      get().setStep('deployment');
      
      console.log('✅ Intelligent simulation completed successfully');
      set({ isLoading: false });
      
    } catch (error: any) {
      console.error('❌ Simulation failed:', error);
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
      console.log('🚀 Starting guild deployment...');
      
      // Create the guild
      const guildData = {
        name: blueprint.suggested_structure.guild_name,
        description: blueprint.interpretation,
        purpose: blueprint.suggested_structure.guild_purpose,
        status: 'active',
        metadata: {
          blueprint_id: blueprint.id,
          simulation_results: simulationResults,
          deployment_timestamp: new Date().toISOString(),
          credentials_configured: Object.keys(credentials).length > 0
        }
      };
      
      const guild = await apiMethods.createGuild(guildData);
      console.log('✅ Guild created:', guild.id);
      
      // Create agents for the guild
      const agentPromises = blueprint.suggested_structure.agents.map(agentBlueprint => {
        const agentData = {
          name: agentBlueprint.name,
          role: agentBlueprint.role,
          description: agentBlueprint.description,
          guild_id: guild.id,
          personality: `Professional ${agentBlueprint.role} with expertise in ${agentBlueprint.tools_needed.join(', ')}`,
          instructions: `You are a ${agentBlueprint.role} agent. ${agentBlueprint.description}. Focus on delivering excellent results while collaborating with other agents in the guild.`,
          tools: agentBlueprint.tools_needed.map(tool => ({
            id: `tool_${tool.toLowerCase().replace(/\s+/g, '_')}`,
            name: tool,
            type: 'api',
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
            stability: 0.5,
            similarity_boost: 0.5
          }
        };
        
        return apiMethods.createAgent(agentData);
      });
      
      // Wait for all agents to be created
      const agents = await Promise.all(agentPromises);
      console.log(`✅ Created ${agents.length} agents successfully`);
      
      set({ 
        deploymentId: guild.id,
        isLoading: false 
      });
      
      console.log('🎉 Guild deployment completed successfully!');
      
    } catch (error: any) {
      console.error('❌ Deployment failed:', error);
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