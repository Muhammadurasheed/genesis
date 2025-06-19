import { create } from 'zustand';
import type { WizardState, Blueprint } from '../types';
import { apiMethods } from '../lib/api';

interface WizardStore extends WizardState {
  setStep: (step: WizardState['step']) => void;
  setUserInput: (input: string) => void;
  setBlueprint: (blueprint: Blueprint) => void;
  setCredentials: (credentials: Record<string, string>) => void;
  addError: (error: string) => void;
  clearErrors: () => void;
  generateBlueprint: () => Promise<void>;
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

  setStep: (step) => set({ step }),

  setUserInput: (user_input) => set({ user_input }),

  setBlueprint: (blueprint) => set({ blueprint }),

  setCredentials: (credentials) => set({ credentials }),

  addError: (error) => set((state) => ({ 
    errors: [...state.errors, error] 
  })),

  clearErrors: () => set({ errors: [] }),

  generateBlueprint: async () => {
    const { user_input } = get();
    if (!user_input.trim()) {
      get().addError('Please provide your goal or requirement');
      return;
    }

    try {
      get().clearErrors();
      const blueprint = await apiMethods.generateBlueprint(user_input);
      get().setBlueprint(blueprint);
      get().setStep('blueprint');
    } catch (error: any) {
      get().addError(error.response?.data?.message || 'Failed to generate blueprint');
    }
  },

  reset: () => set(initialState)
}));