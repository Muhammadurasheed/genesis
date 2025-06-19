import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
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
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('supabase.auth.token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// API methods
export const apiMethods = {
  // Wizard & Blueprint
  generateBlueprint: async (userInput: string) => {
    const response = await api.post('/wizard/generate-blueprint', { user_input: userInput });
    return response.data;
  },

  getBlueprint: async (blueprintId: string) => {
    const response = await api.get(`/wizard/blueprint/${blueprintId}`);
    return response.data;
  },

  // Guild management
  createGuild: async (guildData: any) => {
    const response = await api.post('/guilds', guildData);
    return response.data;
  },

  getGuilds: async () => {
    const response = await api.get('/guilds');
    return response.data;
  },

  getGuild: async (guildId: string) => {
    const response = await api.get(`/guilds/${guildId}`);
    return response.data;
  },

  updateGuild: async (guildId: string, updates: any) => {
    const response = await api.patch(`/guilds/${guildId}`, updates);
    return response.data;
  },

  deleteGuild: async (guildId: string) => {
    const response = await api.delete(`/guilds/${guildId}`);
    return response.data;
  },

  // Agent management
  createAgent: async (agentData: any) => {
    const response = await api.post('/agents', agentData);
    return response.data;
  },

  getAgents: async (guildId?: string) => {
    const url = guildId ? `/agents?guild_id=${guildId}` : '/agents';
    const response = await api.get(url);
    return response.data;
  },

  updateAgent: async (agentId: string, updates: any) => {
    const response = await api.patch(`/agents/${agentId}`, updates);
    return response.data;
  },

  deleteAgent: async (agentId: string) => {
    const response = await api.delete(`/agents/${agentId}`);
    return response.data;
  },

  // Agent Chat
  chatWithAgent: async (agentId: string, message: string) => {
    const response = await api.post(`/agents/${agentId}/chat`, { content: message });
    return response.data;
  },

  getAgentMemory: async (agentId: string) => {
    const response = await api.get(`/agents/${agentId}/memory`);
    return response.data;
  },

  // Health Check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};