import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const ConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<'testing' | 'connected' | 'failed'>('testing');
  const [details, setDetails] = useState<string>('');

  const testConnection = async () => {
    setStatus('testing');
    setDetails('Testing connection...');

    try {
      // Test basic connectivity
      const { data, error } = await supabase.from('users').select('count').limit(1);
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Table doesn't exist - but connection works
          setStatus('connected');
          setDetails('Connected to Supabase successfully!');
        } else {
          setStatus('failed');
          setDetails(`Connection error: ${error.message}`);
        }
      } else {
        setStatus('connected');
        setDetails('Connected to Supabase successfully!');
      }
    } catch (error: any) {
      setStatus('failed');
      setDetails(`Network error: ${error.message || 'Failed to connect'}. Check your internet connection.`);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  if (import.meta.env.PROD) {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
        status === 'connected' 
          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
          : status === 'failed'
          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
      }`}>
        {status === 'connected' && <Wifi className="w-4 h-4" />}
        {status === 'failed' && <WifiOff className="w-4 h-4" />}
        {status === 'testing' && <RefreshCw className="w-4 h-4 animate-spin" />}
        
        <span className="font-medium">
          {status === 'connected' && 'Connected'}
          {status === 'failed' && 'Connection Failed'}
          {status === 'testing' && 'Testing...'}
        </span>
        
        <button
          onClick={testConnection}
          className="ml-2 hover:opacity-70 transition-opacity"
          title="Retry connection test"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>
      
      {details && (
        <div className="mt-1 text-xs text-gray-400 max-w-xs">
          {details}
        </div>
      )}
    </div>
  );
};