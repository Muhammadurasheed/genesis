import axios from 'axios';

// Backend will be hosted at this URL
const API_BASE_URL = 'https://genesisOS-backend-production.up.railway.app';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for AI operations
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('supabase.auth.token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('supabase.auth.token');
      window.location.href = '/auth';
    }
    
    // Enhanced error messages for better UX
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timed out. The AI is processing your request - this may take a moment.';
    } else if (error.message === 'Network Error') {
      error.message = 'Unable to connect to GenesisOS servers. Please check your internet connection.';
    }
    
    return Promise.reject(error);
  }
);

// Enhanced API methods with better error handling and logging
export const apiMethods = {
  // Health check with detailed status
  healthCheck: async () => {
    try {
      console.log('🔍 Checking API health...');
      const response = await api.get('/health');
      console.log('✅ API Health:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ API Health Check Failed:', error.message);
      throw error;
    }
  },

  // Wizard & Blueprint with enhanced AI processing
  generateBlueprint: async (userInput: string) => {
    try {
      console.log('🤖 Generating AI blueprint for:', userInput.substring(0, 50) + '...');
      
      const response = await api.post('/wizard/generate-blueprint', { 
        user_input: userInput 
      });
      
      console.log('✅ Blueprint generated successfully:', response.data.id);
      return response.data;
    } catch (error: any) {
      console.error('❌ Blueprint generation failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to generate blueprint. Our AI is experiencing high demand - please try again.');
    }
  },

  getBlueprint: async (blueprintId: string) => {
    try {
      const response = await api.get(`/wizard/blueprint/${blueprintId}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Blueprint retrieval failed:', error.response?.data || error.message);
      throw new Error('Failed to retrieve blueprint details.');
    }
  },

  // Guild management with user context
  createGuild: async (guildData: any) => {
    try {
      console.log('🏰 Creating guild:', guildData.name);
      
      const response = await api.post('/guilds', {
        ...guildData,
        // Add user context if available
        user_id: getCurrentUserId()
      });
      
      console.log('✅ Guild created:', response.data.id);
      return response.data;
    } catch (error: any) {
      console.error('❌ Guild creation failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to create guild. Please check your connection and try again.');
    }
  },

  getGuilds: async () => {
    try {
      console.log('📋 Fetching user guilds...');
      const response = await api.get('/guilds');
      console.log(`✅ Retrieved ${response.data.length} guilds`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Guild fetch failed:', error.response?.data || error.message);
      throw new Error('Failed to load your guilds.');
    }
  },

  getGuild: async (guildId: string) => {
    try {
      const response = await api.get(`/guilds/${guildId}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Guild details fetch failed:', error.response?.data || error.message);
      throw new Error('Failed to load guild details.');
    }
  },

  updateGuild: async (guildId: string, updates: any) => {
    try {
      console.log('📝 Updating guild:', guildId);
      const response = await api.patch(`/guilds/${guildId}`, updates);
      console.log('✅ Guild updated successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Guild update failed:', error.response?.data || error.message);
      throw new Error('Failed to update guild.');
    }
  },

  deleteGuild: async (guildId: string) => {
    try {
      console.log('🗑️ Deleting guild:', guildId);
      const response = await api.delete(`/guilds/${guildId}`);
      console.log('✅ Guild deleted successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Guild deletion failed:', error.response?.data || error.message);
      throw new Error('Failed to delete guild.');
    }
  },

  // Agent management with enhanced AI features
  createAgent: async (agentData: any) => {
    try {
      console.log('🤖 Creating AI agent:', agentData.name);
      
      const response = await api.post('/agents', {
        ...agentData,
        user_id: getCurrentUserId()
      });
      
      console.log('✅ Agent created and initializing:', response.data.id);
      return response.data;
    } catch (error: any) {
      console.error('❌ Agent creation failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to create AI agent.');
    }
  },

  getAgents: async (guildId?: string) => {
    try {
      const url = guildId ? `/agents?guild_id=${guildId}` : '/agents';
      console.log('🤖 Fetching agents...');
      
      const response = await api.get(url);
      console.log(`✅ Retrieved ${response.data.length} agents`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Agents fetch failed:', error.response?.data || error.message);
      throw new Error('Failed to load agents.');
    }
  },

  updateAgent: async (agentId: string, updates: any) => {
    try {
      console.log('📝 Updating agent:', agentId);
      const response = await api.patch(`/agents/${agentId}`, updates);
      return response.data;
    } catch (error: any) {
      console.error('❌ Agent update failed:', error.response?.data || error.message);
      throw new Error('Failed to update agent.');
    }
  },

  deleteAgent: async (agentId: string) => {
    try {
      console.log('🗑️ Deleting agent:', agentId);
      const response = await api.delete(`/agents/${agentId}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Agent deletion failed:', error.response?.data || error.message);
      throw new Error('Failed to delete agent.');
    }
  },

  // Agent Chat with intelligent responses
  chatWithAgent: async (agentId: string, message: string) => {
    try {
      console.log('💬 Chatting with agent:', agentId);
      
      const response = await api.post(`/agents/${agentId}/chat`, { 
        content: message,
        timestamp: new Date().toISOString()
      });
      
      console.log('✅ Agent responded successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Agent chat failed:', error.response?.data || error.message);
      throw new Error('Agent is temporarily unavailable. Please try again.');
    }
  },

  getAgentMemory: async (agentId: string) => {
    try {
      console.log('🧠 Retrieving agent memory:', agentId);
      const response = await api.get(`/agents/${agentId}/memory`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Agent memory retrieval failed:', error.response?.data || error.message);
      throw new Error('Failed to retrieve agent memory.');
    }
  },

  // Simulation system
  runSimulation: async (guildId: string, testData: any) => {
    try {
      console.log('🧪 Running guild simulation:', guildId);
      
      const response = await api.post(`/guilds/${guildId}/simulate`, {
        test_data: testData,
        simulation_type: 'full_workflow'
      });
      
      console.log('✅ Simulation completed successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Simulation failed:', error.response?.data || error.message);
      throw new Error('Simulation failed. Please check your guild configuration.');
    }
  },

  // Enhanced monitoring and analytics
  getGuildAnalytics: async (guildId: string) => {
    try {
      const response = await api.get(`/guilds/${guildId}/analytics`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Analytics fetch failed:', error.response?.data || error.message);
      throw new Error('Failed to load analytics data.');
    }
  }
};

// Helper function to get current user ID
const getCurrentUserId = (): string => {
  // This will be populated from auth store
  const authData = localStorage.getItem('supabase.auth.token');
  if (authData) {
    try {
      const parsed = JSON.parse(authData);
      return parsed.user?.id || 'anonymous';
    } catch {
      return 'anonymous';
    }
  }
  return 'anonymous';
};

// Connection test for real-time monitoring
export const testBackendConnection = async (): Promise<{connected: boolean, latency: number, status: any}> => {
  const start = performance.now();
  
  try {
    const result = await apiMethods.healthCheck();
    const latency = performance.now() - start;
    
    return {
      connected: true,
      latency: Math.round(latency),
      status: result
    };
  } catch (error) {
    const latency = performance.now() - start;
    
    return {
      connected: false,
      latency: Math.round(latency),
      status: { error: error.message }
    };
  }
};