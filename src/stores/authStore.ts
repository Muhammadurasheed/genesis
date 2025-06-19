import { create } from 'zustand';
import { auth } from '../lib/supabase';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  emailConfirmationRequired: boolean;
  lastEmailSent: number | null;
  rateLimitRemaining: number;
  initialize: () => void;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: any }>;
  signInWithGoogle: () => Promise<{ error?: any }>;
  resendConfirmation: (email: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  clearEmailConfirmationState: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  emailConfirmationRequired: false,
  lastEmailSent: null,
  rateLimitRemaining: 0,

  initialize: async () => {
    try {
      // Check for existing session first
      const { session } = await auth.getCurrentSession();
      if (session?.user) {
        set({ user: session.user as User, loading: false });
      } else {
        set({ loading: false });
      }

      // Listen for auth changes
      auth.onAuthStateChange((user) => {
        set({ user: user as User | null, loading: false });
        if (user) {
          set({ emailConfirmationRequired: false });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true, emailConfirmationRequired: false });
    const { data, error } = await auth.signIn(email, password);
    
    if (error) {
      set({ loading: false });
      
      // Handle specific auth errors
      if (error.message?.includes('email_not_confirmed')) {
        set({ emailConfirmationRequired: true });
        return { error: { ...error, message: 'Please check your email and click the confirmation link before signing in.' } };
      }
      
      return { error };
    }

    set({ user: data.user as User, loading: false });
    return {};
  },

  signUp: async (email: string, password: string, name: string) => {
    set({ loading: true });
    const { data, error } = await auth.signUp(email, password, name);
    
    if (error) {
      set({ loading: false });
      
      // Handle rate limiting
      if (error.message?.includes('email_send_rate_limit')) {
        const now = Date.now();
        set({ 
          lastEmailSent: now,
          rateLimitRemaining: 20
        });
        
        // Start countdown
        const countdown = setInterval(() => {
          const remaining = 20 - Math.floor((Date.now() - now) / 1000);
          if (remaining <= 0) {
            clearInterval(countdown);
            set({ rateLimitRemaining: 0, lastEmailSent: null });
          } else {
            set({ rateLimitRemaining: remaining });
          }
        }, 1000);
        
        return { error: { ...error, message: `Please wait ${20} seconds before requesting another confirmation email.` } };
      }
      
      return { error };
    }

    // If user needs email confirmation
    if (data.user && !data.session) {
      set({ 
        emailConfirmationRequired: true,
        lastEmailSent: Date.now(),
        loading: false 
      });
      return { error: { message: 'Please check your email and click the confirmation link to complete your account setup.' } };
    }

    set({ user: data.user as User, loading: false });
    return {};
  },

  signInWithGoogle: async () => {
    set({ loading: true });
    const { data, error } = await auth.signInWithGoogle();
    
    if (error) {
      set({ loading: false });
      
      // Handle specific Google OAuth errors
      if (error.message?.includes('provider is not enabled')) {
        return { error: { ...error, message: 'Google sign-in is not enabled. Please contact support or use email/password.' } };
      }
      
      return { error };
    }

    // User will be set via onAuthStateChange callback after redirect
    set({ loading: false });
    return {};
  },

  resendConfirmation: async (email: string) => {
    const { lastEmailSent } = get();
    const now = Date.now();
    
    // Check rate limit
    if (lastEmailSent && (now - lastEmailSent) < 20000) {
      const remaining = Math.ceil((20000 - (now - lastEmailSent)) / 1000);
      set({ rateLimitRemaining: remaining });
      return { error: { message: `Please wait ${remaining} seconds before requesting another email.` } };
    }

    const { data, error } = await auth.resendConfirmation(email);
    
    if (error) {
      if (error.message?.includes('email_send_rate_limit')) {
        set({ 
          lastEmailSent: now,
          rateLimitRemaining: 20
        });
        
        // Start countdown
        const countdown = setInterval(() => {
          const remaining = 20 - Math.floor((Date.now() - now) / 1000);
          if (remaining <= 0) {
            clearInterval(countdown);
            set({ rateLimitRemaining: 0, lastEmailSent: null });
          } else {
            set({ rateLimitRemaining: remaining });
          }
        }, 1000);
      }
      return { error };
    }

    set({ lastEmailSent: now });
    return {};
  },

  clearEmailConfirmationState: () => {
    set({ 
      emailConfirmationRequired: false,
      lastEmailSent: null,
      rateLimitRemaining: 0
    });
  },

  signOut: async () => {
    set({ loading: true });
    await auth.signOut();
    set({ 
      user: null, 
      loading: false, 
      emailConfirmationRequired: false,
      lastEmailSent: null,
      rateLimitRemaining: 0
    });
  }
}));