import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';

export const AuthCallback: React.FC = () => {
  const { initialize } = useAuthStore();

  useEffect(() => {
    // Handle OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Re-initialize auth to pick up the new session
        await initialize();
        
        // Redirect to main app
        window.location.href = '/';
      } catch (error) {
        console.error('Auth callback error:', error);
        // Redirect to auth page on error
        window.location.href = '/auth';
      }
    };

    handleAuthCallback();
  }, [initialize]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center text-white"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center mx-auto mb-6 animate-pulse">
          <span className="text-white font-bold text-2xl">G</span>
        </div>
        <h2 className="text-2xl font-bold mb-4">Completing sign in...</h2>
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
      </motion.div>
    </div>
  );
};