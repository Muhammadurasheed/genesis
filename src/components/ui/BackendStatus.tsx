import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { testBackendConnection } from '../../lib/api';

interface BackendStatusProps {
  className?: string;
}

export const BackendStatus: React.FC<BackendStatusProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<'testing' | 'connected' | 'failed' | 'slow'>('testing');
  const [latency, setLatency] = useState<number>(0);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  const checkConnection = async () => {
    setStatus('testing');
    
    try {
      const result = await testBackendConnection();
      
      if (result.connected) {
        if (result.latency > 2000) {
          setStatus('slow');
        } else {
          setStatus('connected');
        }
        setLatency(result.latency);
      } else {
        setStatus('failed');
      }
    } catch (error) {
      setStatus('failed');
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
          detail: `${latency}ms`
        };
      case 'slow':
        return {
          icon: AlertCircle,
          color: 'text-yellow-500',
          bg: 'bg-yellow-500/20',
          border: 'border-yellow-500/30',
          text: 'Backend Slow',
          detail: `${latency}ms`
        };
      case 'failed':
        return {
          icon: WifiOff,
          color: 'text-red-500',
          bg: 'bg-red-500/20',
          border: 'border-red-500/30',
          text: 'Backend Offline',
          detail: 'Retry...'
        };
      default:
        return {
          icon: Zap,
          color: 'text-blue-500',
          bg: 'bg-blue-500/20',
          border: 'border-blue-500/30',
          text: 'Connecting...',
          detail: '...'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  if (import.meta.env.PROD && status === 'connected') {
    return null; // Don't show in production when working
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm border backdrop-blur-sm ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
        <Icon className={`w-4 h-4 ${status === 'testing' ? 'animate-pulse' : ''}`} />
        
        <div className="flex flex-col">
          <span className="font-medium leading-tight">{statusInfo.text}</span>
          <span className="text-xs opacity-70">{statusInfo.detail}</span>
        </div>
        
        <button
          onClick={checkConnection}
          className="ml-2 hover:opacity-70 transition-opacity"
          title="Test connection"
        >
          <Wifi className="w-3 h-3" />
        </button>
      </div>
      
      <div className="text-xs text-gray-500 mt-1 text-right">
        Last: {lastCheck.toLocaleTimeString()}
      </div>
    </div>
  );
};