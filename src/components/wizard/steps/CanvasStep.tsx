import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, Edit3, Play, Save } from 'lucide-react';
import { useWizardStore } from '../../../stores/wizardStore';
import { QuantumCanvas } from '../../canvas/QuantumCanvas';
import { GlassCard } from '../../ui/GlassCard';
import { HolographicButton } from '../../ui/HolographicButton';

export const CanvasStep: React.FC = () => {
  const { blueprint, setStep } = useWizardStore();

  const handleSaveCanvas = (nodes: any[], edges: any[]) => {
    console.log('💾 Canvas saved:', { nodes: nodes.length, edges: edges.length });
    // Here you would save the canvas state
  };

  const handleExecuteWorkflow = () => {
    console.log('▶️ Executing workflow...');
    // Here you would start workflow execution
  };

  const handleContinue = () => {
    setStep('credentials');
  };

  if (!blueprint) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-4xl text-center">
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-4">No Blueprint Available</h2>
          <p className="text-gray-300 mb-6">
            Please complete the blueprint generation step first.
          </p>
          <HolographicButton onClick={() => setStep('intent')}>
            Go Back to Intent
          </HolographicButton>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
          Visual Workflow Canvas
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Your blueprint has been transformed into an interactive workflow. 
          Customize connections, adjust logic, and see your AI agents come to life.
        </p>
      </motion.div>

      {/* Canvas Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-12"
      >
        <GlassCard variant="medium" className="p-4">
          <div className="h-[600px] rounded-xl overflow-hidden">
            <QuantumCanvas 
              blueprint={blueprint}
              onSave={handleSaveCanvas}
              onExecute={handleExecuteWorkflow}
            />
          </div>
        </GlassCard>
      </motion.div>

      {/* Canvas Info & Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid md:grid-cols-3 gap-6 mb-12"
      >
        <GlassCard variant="medium" className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Visual Design</h3>
              <p className="text-gray-300 text-sm">Interactive workflow builder</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Drag and drop nodes to create complex workflows. Your AI agents are 
            automatically connected based on your blueprint.
          </p>
        </GlassCard>

        <GlassCard variant="medium" className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Real-time Editing</h3>
              <p className="text-gray-300 text-sm">Live collaboration ready</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Make changes and see them instantly. Multiple team members can 
            collaborate on the same workflow simultaneously.
          </p>
        </GlassCard>

        <GlassCard variant="medium" className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
              <Play className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Live Execution</h3>
              <p className="text-gray-300 text-sm">Watch your workflow run</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Execute workflows and watch as data flows through your agents 
            in real-time with visual feedback and monitoring.
          </p>
        </GlassCard>
      </motion.div>

      {/* Canvas Features */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mb-12"
      >
        <GlassCard variant="medium" glow className="p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Revolutionary Canvas Features
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-3">Intelligence Layer</h4>
              <div className="space-y-3">
                {[
                  "Auto-generated optimal connections",
                  "Smart node suggestions based on context",
                  "Intelligent error detection and resolution",
                  "Performance optimization recommendations"
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-3">Collaboration Tools</h4>
              <div className="space-y-3">
                {[
                  "Real-time multi-user editing",
                  "Version control and change tracking",
                  "Comment and annotation system",
                  "Team workspace management"
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex justify-center"
      >
        <HolographicButton 
          onClick={handleContinue} 
          size="lg" 
          glow
          className="group"
        >
          <Save className="w-5 h-5 mr-2 group-hover:text-blue-400 transition-colors" />
          Continue to Credentials
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="ml-2"
          >
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </HolographicButton>
      </motion.div>

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-center"
      >
        <GlassCard variant="subtle" className="p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
              <Edit3 className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white">Canvas Pro Tips</h4>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Use the node palette on the left to add new components. Click nodes to see detailed 
            configurations. The canvas auto-saves your changes and supports collaborative editing. 
            Try the simulation mode to test your workflow before deployment.
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
};