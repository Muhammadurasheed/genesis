import React, { useEffect, useState } from 'react';
import { useAuthStore } from './stores/authStore';
import { LandingPage } from './components/landing/LandingPage';
import { AuthForm } from './components/auth/AuthForm';
import { WizardFlow } from './components/wizard/WizardFlow';
import { Header } from './components/layout/Header';
import { BackendStatus } from './components/ui/BackendStatus';

type AppState = 'landing' | 'auth' | 'app';

function App() {
  const { user, loading, initialize } = useAuthStore();
  const [appState, setAppState] = useState<AppState>('landing');

  useEffect(() => {
    console.log('🚀 GenesisOS Phase 3: Initializing with live backend...');
    initialize();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user) {
        console.log('✅ User authenticated - entering main app:', user.email);
        setAppState('app');
      } else {
        console.log('👤 No user authenticated');
        if (appState !== 'auth') {
          setAppState('landing');
        }
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">G</span>
          </div>
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white/70 text-sm">Initializing AI-Native Workspace...</p>
          <p className="text-white/50 text-xs mt-2">Phase 3: Live Backend Integration</p>
        </div>
        <BackendStatus />
      </div>
    );
  }

  if (appState === 'landing') {
    return (
      <>
        <LandingPage 
          onGetStarted={() => setAppState('auth')}
          onSignIn={() => setAppState('auth')}
        />
        <BackendStatus />
      </>
    );
  }

  if (appState === 'auth') {
    return (
      <>
        <AuthForm 
          onBack={() => setAppState('landing')}
        />
        <BackendStatus />
      </>
    );
  }

  // User is logged in - show main app
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <WizardFlow />
      </main>
      <BackendStatus />
    </div>
  );
}

export default App;