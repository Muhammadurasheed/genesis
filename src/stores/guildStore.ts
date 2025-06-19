import { create } from 'zustand';
import type { Guild, Agent, Workflow } from '../types';
import { apiMethods } from '../lib/api';

interface GuildState {
  guilds: Guild[];
  currentGuild: Guild | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchGuilds: () => Promise<void>;
  fetchGuild: (guildId: string) => Promise<void>;
  createGuild: (guildData: Partial<Guild>) => Promise<Guild | null>;
  updateGuild: (guildId: string, updates: Partial<Guild>) => Promise<void>;
  deleteGuild: (guildId: string) => Promise<void>;
  setCurrentGuild: (guild: Guild | null) => void;
  clearError: () => void;
}

export const useGuildStore = create<GuildState>((set, get) => ({
  guilds: [],
  currentGuild: null,
  loading: false,
  error: null,

  fetchGuilds: async () => {
    set({ loading: true, error: null });
    try {
      const guilds = await apiMethods.getGuilds();
      set({ guilds, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch guilds',
        loading: false 
      });
    }
  },

  fetchGuild: async (guildId: string) => {
    set({ loading: true, error: null });
    try {
      const guild = await apiMethods.getGuild(guildId);
      set({ currentGuild: guild, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch guild',
        loading: false 
      });
    }
  },

  createGuild: async (guildData: Partial<Guild>) => {
    set({ loading: true, error: null });
    try {
      const guild = await apiMethods.createGuild(guildData);
      set(state => ({ 
        guilds: [...state.guilds, guild],
        currentGuild: guild,
        loading: false 
      }));
      return guild;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to create guild',
        loading: false 
      });
      return null;
    }
  },

  updateGuild: async (guildId: string, updates: Partial<Guild>) => {
    set({ loading: true, error: null });
    try {
      const updatedGuild = await apiMethods.updateGuild(guildId, updates);
      set(state => ({
        guilds: state.guilds.map(g => g.id === guildId ? updatedGuild : g),
        currentGuild: state.currentGuild?.id === guildId ? updatedGuild : state.currentGuild,
        loading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update guild',
        loading: false 
      });
    }
  },

  deleteGuild: async (guildId: string) => {
    set({ loading: true, error: null });
    try {
      await apiMethods.deleteGuild(guildId);
      set(state => ({
        guilds: state.guilds.filter(g => g.id !== guildId),
        currentGuild: state.currentGuild?.id === guildId ? null : state.currentGuild,
        loading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete guild',
        loading: false 
      });
    }
  },

  setCurrentGuild: (guild: Guild | null) => set({ currentGuild: guild }),

  clearError: () => set({ error: null })
}));