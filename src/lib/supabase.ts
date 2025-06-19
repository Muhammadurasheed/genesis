import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced validation and error handling
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (e) {
  console.error('❌ Invalid Supabase URL format:', supabaseUrl);
  throw new Error('Invalid Supabase URL format');
}

// Debug logging for development
if (import.meta.env.DEV) {
  console.log('🔧 Supabase Configuration:');
  console.log('URL:', supabaseUrl);
  console.log('Key (first 20 chars):', supabaseAnonKey?.substring(0, 20) + '...');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: import.meta.env.DEV
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseAnonKey,
    },
  },
});

// Get the current domain for redirects
const getCurrentDomain = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:5173'; // fallback for SSR
};

// Enhanced connection test
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error && error.code !== 'PGRST116') { // PGRST116 is "relation not found" which is expected
      console.warn('⚠️ Supabase connection test warning:', error.message);
    } else {
      console.log('✅ Supabase connection successful');
    }
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
};

// Test connection on initialization
if (import.meta.env.DEV) {
  testConnection();
}

// Enhanced auth helpers with better error handling
export const auth = {
  signUp: async (email: string, password: string, name: string) => {
    try {
      console.log('🔄 Attempting signup for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${getCurrentDomain()}/auth/callback`
        }
      });
      
      if (error) {
        console.error('❌ Signup error:', error);
        return { data: null, error };
      }
      
      console.log('✅ Signup successful:', data.user?.id);
      
      // Create user profile if signup successful and user exists
      if (data.user && !error) {
        try {
          const { error: profileError } = await supabase
            .from('users')
            .upsert({
              id: data.user.id,
              email: data.user.email!,
              name: name,
              avatar_url: data.user.user_metadata?.avatar_url || null,
              email_confirmed: !!data.user.email_confirmed_at
            });
          
          if (profileError) {
            console.warn('⚠️ Profile creation warning:', profileError);
          }
        } catch (profileError) {
          console.warn('⚠️ Profile creation failed:', profileError);
        }
      }
      
      return { data, error };
    } catch (error: any) {
      console.error('❌ Network/Connection error in signup:', error);
      
      // Enhanced network error detection
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { 
          data: null, 
          error: { 
            message: 'Network connection failed. Please check your internet connection and try again.',
            code: 'network_error'
          }
        };
      }
      
      return { 
        data: null, 
        error: { 
          message: error.message || 'An unexpected error occurred during signup.',
          code: 'unknown_error'
        }
      };
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      console.log('🔄 Attempting signin for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('❌ Signin error:', error);
        return { data: null, error };
      }
      
      console.log('✅ Signin successful:', data.user?.id);
      
      if (data.user && !error) {
        // Update user profile with latest info
        try {
          await supabase
            .from('users')
            .upsert({
              id: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
              avatar_url: data.user.user_metadata?.avatar_url || null,
              email_confirmed: !!data.user.email_confirmed_at
            });
        } catch (profileError) {
          console.warn('⚠️ Profile update failed:', profileError);
        }
      }
      
      return { data, error };
    } catch (error: any) {
      console.error('❌ Network/Connection error in signin:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { 
          data: null, 
          error: { 
            message: 'Connection to authentication server failed. Please check your internet connection.',
            code: 'network_error'
          }
        };
      }
      
      return { 
        data: null, 
        error: { 
          message: error.message || 'Sign in failed. Please try again.',
          code: 'signin_error'
        }
      };
    }
  },

  signInWithGoogle: async () => {
    try {
      console.log('🔄 Attempting Google OAuth signin');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${getCurrentDomain()}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error('❌ Google OAuth error:', error);
        return { data: null, error };
      }
      
      console.log('✅ Google OAuth initiated successfully');
      return { data, error };
    } catch (error: any) {
      console.error('❌ Google OAuth network error:', error);
      return { 
        data: null, 
        error: { 
          message: 'Failed to connect to Google. Please check your connection and try again.',
          code: 'google_oauth_error'
        }
      };
    }
  },

  signOut: async () => {
    try {
      console.log('🔄 Signing out...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Signout error:', error);
      } else {
        console.log('✅ Signout successful');
      }
      
      return { error };
    } catch (error: any) {
      console.error('❌ Signout network error:', error);
      return { error: { message: 'Failed to sign out. Please try again.' } };
    }
  },

  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('❌ Get user error:', error);
      }
      
      return { user, error };
    } catch (error: any) {
      console.error('❌ Get user network error:', error);
      return { user: null, error };
    }
  },

  getCurrentSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Get session error:', error);
      }
      
      return { session, error };
    } catch (error: any) {
      console.error('❌ Get session network error:', error);
      return { session: null, error };
    }
  },

  resendConfirmation: async (email: string) => {
    try {
      console.log('🔄 Resending confirmation for:', email);
      
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${getCurrentDomain()}/auth/callback`
        }
      });
      
      if (error) {
        console.error('❌ Resend confirmation error:', error);
        return { data: null, error };
      }
      
      console.log('✅ Confirmation email resent successfully');
      return { data, error };
    } catch (error: any) {
      console.error('❌ Resend confirmation network error:', error);
      return { 
        data: null, 
        error: { 
          message: 'Failed to resend confirmation email. Please check your connection.',
          code: 'resend_error'
        }
      };
    }
  },

  onAuthStateChange: (callback: (user: any) => void) => {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.id);
      
      if (session?.user) {
        try {
          // Ensure user profile exists or update it
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (!profile) {
            // Create profile if it doesn't exist
            await supabase
              .from('users')
              .insert({
                id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
                avatar_url: session.user.user_metadata?.avatar_url || null,
                email_confirmed: !!session.user.email_confirmed_at
              });
          } else {
            // Update email confirmation status
            await supabase
              .from('users')
              .update({
                email_confirmed: !!session.user.email_confirmed_at,
                name: session.user.user_metadata?.name || profile.name,
                avatar_url: session.user.user_metadata?.avatar_url || profile.avatar_url
              })
              .eq('id', session.user.id);
          }
        } catch (error) {
          console.warn('⚠️ Profile sync error:', error);
        }
      }
      
      callback(session?.user || null);
    });
  }
};