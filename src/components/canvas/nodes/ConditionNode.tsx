import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import { GitBranch, Target, MoreHorizontal, Check, X } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';

interface ConditionNodeData {
  label: string;
  description: string;
  conditionType: 'if' | 'switch' | 'filter' | 'gate';
  condition: string;
  icon: React.ComponentType<any>;
  color: string;
  status: 'ready' | 'evaluating' | 'true' | 'false' | 'error';
}

export const ConditionNode = memo<NodeProps<ConditionNodeData>>(({ data, selected }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'border-orange-400 shadow-orange-400/30';
      case 'evaluating': return 'border-yellow-400 shadow-yellow-400/30 animate-pulse';
      case 'true': return 'border-green-400 shadow-green-400/30';
      case 'false': return 'border-red-400 shadow-red-400/30';
      case 'error': return 'border-red-500 shadow-red-500/30';
      default: return 'border-gray-400 shadow-gray-400/30';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={`relative ${selected ? 'z-10' : ''}`}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-orange-400 border-2 border-white shadow-lg"
      />

      {/* Main Node */}
      <GlassCard 
        variant="medium" 
        className={`w-72 border-2 ${getStatusColor(data.status)} ${
          selected ? 'ring-2 ring-orange-400/50' : ''
        } transition-all duration-200`}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <motion.div 
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${data.color} flex items-center justify-center relative overflow-hidden`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />
                <GitBranch className="w-6 h-6 text-white relative z-10" />
              </motion.div>

              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm leading-tight">
                  {data.label}
                </h3>
                <p className="text-orange-300 text-xs capitalize">
                  {data.conditionType} condition
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <div className="flex items-center space-x-1 px-2 py-1 bg-white/10 rounded-full">
                {data.status === 'true' && <Check className="w-3 h-3 text-green-400" />}
                {data.status === 'false' && <X className="w-3 h-3 text-red-400" />}
                {data.status === 'evaluating' && <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />}
                {data.status === 'ready' && <div className="w-2 h-2 bg-orange-400 rounded-full" />}
                <span className="text-xs text-white capitalize">{data.status}</span>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <MoreHorizontal className="w-3 h-3 text-white" />
              </motion.button>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-xs mb-3 leading-relaxed">
            {data.description}
          </p>

          {/* Condition Logic */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs font-medium">Condition</span>
              <span className="text-orange-400 text-xs">
                {data.conditionType.toUpperCase()}
              </span>
            </div>

            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="text-white text-xs font-mono">
                {data.condition || "value > threshold"}
              </div>
              
              {/* Visual representation of branching */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    data.status === 'true' ? 'bg-green-400' : 'bg-gray-400'
                  }`} />
                  <span className="text-xs text-gray-300">True path</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    data.status === 'false' ? 'bg-red-400' : 'bg-gray-400'
                  }`} />
                  <span className="text-xs text-gray-300">False path</span>
                </div>
              </div>
            </div>
          </div>

          {/* Evaluation Progress */}
          {data.status === 'evaluating' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3"
            >
              <div className="w-full bg-white/10 rounded-full h-1">
                <motion.div
                  className="h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              </div>
              <div className="text-center text-xs text-gray-400 mt-1">
                Evaluating condition...
              </div>
            </motion.div>
          )}
        </div>

        {/* Glow Effect */}
        {selected && (
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl opacity-20 blur-lg -z-10"
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </GlassCard>

      {/* Output Handles - True and False paths */}
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={{ top: '30%' }}
        className="w-3 h-3 bg-green-400 border-2 border-white shadow-lg"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{ top: '70%' }}
        className="w-3 h-3 bg-red-400 border-2 border-white shadow-lg"
      />
    </motion.div>
  );
});