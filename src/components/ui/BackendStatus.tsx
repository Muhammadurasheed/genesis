import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Zap, AlertCircle, CheckCircle, Code, Wrench } from 'lucide-react';
import { testBackendConnection } from '../../lib/api';

interface BackendStatusProps {
  className?: string;
}

export const BackendStatus: React.FC<BackendStatusProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<'testing' | 'connected' | 'failed' | 'development'>('testing');
  const [latency, setLatency] = useState<number>(0);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [mode, setMode] = useState<string>('');

  const checkConnection = async () => {
    setStatus('testing');
    
    try {
      const result = await testBackendConnection();
      
      if (result.connected) {
        if (result.status.mode === 'development' || result.status.status === 'development_fallback') {
          setStatus('development');
          setMode('Development Mode');
        } else {
          setStatus('connected');
          setMode('Production');
        }
        setLatency(result.latency);
      } else {
        setStatus('failed');
        setMode('Offline');
      }
    } catch (error) {
      setStatus('failed');
      setMode('Error');
    }
    
    setLastCheck(new Date());
  };

  useEffect(() => {
    checkConnection();
    
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bg: 'bg-green-500/20',
          border: 'border-green-500/30',
          text: 'Backend Online',
          detail: `${latency}ms • ${mode}`
        };
      case 'development':
        return {
          icon: Code,
          color: 'text-blue-500',
          bg: 'bg-blue-500/20',
          border: 'border-blue-500/30',
          text: 'Development Mode',
          detail: `${latency}ms • Mock APIs`
        };
      case 'failed':
        return {
          icon: WifiOff,
          color: 'text-orange-500',
          bg: 'bg-orange-500/20',
          border: 'border-orange-500/30',
          text: 'Using Fallbacks',
          detail: 'Mock data active'
        };
      default:
        return {
          icon: Zap,
          color: 'text-blue-500',
          bg: 'bg-blue-500/20',
          border: 'border-blue-500/30',
          text: 'Connecting...',
          detail: 'Testing...'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  // Show in development or when there are issues
  if (import.meta.env.PROD && status === 'connected') {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm border backdrop-blur-sm ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} shadow-lg`}>
        <Icon className={`w-5 h-5 ${status === 'testing' ? 'animate-pulse' : ''}`} />
        
        <div className="flex flex-col">
          <span className="font-semibold leading-tight">{statusInfo.text}</span>
          <span className="text-xs opacity-80">{statusInfo.detail}</span>
        </div>
        
        <button
          onClick={checkConnection}
          className="ml-2 p-1 hover:opacity-70 transition-opacity rounded"
          title="Test connection"
        >
          <Wifi className="w-4 h-4" />
        </button>
      </div>
      
      {import.meta.env.DEV && (
        <div className="text-xs text-gray-400 mt-2 text-right px-2">
          Last check: {lastCheck.toLocaleTimeString()}
          {status === 'development' && (
            <div className="text-blue-400 mt-1">
              <Wrench className="w-3 h-3 inline mr-1" />
              Smart fallbacks active
            </div>
          )}
        </div>
      )}
    </div>
  );
};