import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Eye, 
  Edit3, 
  Play, 
  Save, 
  Sparkles, 
  Brain, 
  Zap, 
  Target, 
  Layers,
  Settings,
  Users,
  Palette,
  Lightbulb,
  Rocket,
  Shield,
  BarChart,
  Workflow,
  Star,
  Command
} from 'lucide-react';
import { useWizardStore } from '../../../stores/wizardStore';
import { useEnhancedCanvasStore } from '../../../stores/enhancedCanvasStore';
import { EnhancedQuantumCanvas } from '../../canvas/EnhancedQuantumCanvas';
import { GlassCard } from '../../ui/GlassCard';
import { HolographicButton } from '../../ui/HolographicButton';

export const EnhancedCanvasStep: React.FC = () => {
  const { blueprint, setStep } = useWizardStore();
  const { 
    canvasMode, 
    setCanvasMode, 
    metrics, 
    isCollaborative,
    smartSuggestions,
    showNeuralNetwork,
    setShowNeuralNetwork,
    performanceMode,
    setPerformanceMode
  } = useEnhancedCanvasStore();

  const [showTutorial, setShowTutorial] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  useEffect(() => {
    // Show tutorial for first-time users
    const hasSeenTutorial = localStorage.getItem('canvas-tutorial-seen');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const handleSaveCanvas = (nodes: any[], edges: any[]) => {
    console.log('💾 Enhanced Canvas saved:', { 
      nodes: nodes.length, 
      edges: edges.length,
      mode: canvasMode,
      performance: metrics.performanceScore 
    });
  };

  const handleExecuteWorkflow = () => {
    console.log('▶️ Executing enhanced workflow with intelligence...');
  };

  const handleContinue = () => {
    setStep('credentials');
  };

  const completeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('canvas-tutorial-seen', 'true');
  };

  if (!blueprint) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Blueprint Required</h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            The revolutionary canvas needs your AI blueprint to create intelligent workflows. 
            Let's generate your architectural foundation first.
          </p>
          <HolographicButton onClick={() => setStep('intent')} glow>
            <Brain className="w-4 h-4 mr-2" />
            Generate Blueprint
          </HolographicButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-8xl">
      {/* Revolutionary Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center mb-6">
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Workflow className="w-8 h-8 text-white" />
          </motion.div>
          <div className="text-left">
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Quantum Canvas
            </h1>
            <p className="text-purple-300 text-lg">Apple × Google × n8n Revolutionary Design</p>
          </div>
        </div>
        
        <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
          Experience the future of workflow design. Your blueprint transforms into an intelligent, 
          collaborative canvas where AI agents coordinate in visual symphony.
        </p>

        {/* Performance & Intelligence Indicators */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center space-x-6 mt-8"
        >
          {[
            { icon: Brain, label: 'AI Intelligence', value: '95%', color: 'text-purple-400' },
            { icon: Zap, label: 'Performance', value: `${metrics.performanceScore}/100`, color: 'text-blue-400' },
            { icon: Users, label: 'Collaboration', value: isCollaborative ? 'Live' : 'Solo', color: 'text-green-400' },
            { icon: Target, label: 'Suggestions', value: smartSuggestions.length.toString(), color: 'text-orange-400' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="text-center"
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-400 text-xs">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Mode Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <GlassCard variant="medium" className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-white font-semibold">Canvas Intelligence Mode</h3>
              <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
                {[
                  { mode: 'design', icon: Edit3, label: 'Design', description: 'Creative workflow building' },
                  { mode: 'simulate', icon: Play, label: 'Simulate', description: 'Test with AI intelligence' },
                  { mode: 'deploy', icon: Rocket, label: 'Deploy', description: 'Production deployment' },
                  { mode: 'debug', icon: Settings, label: 'Debug', description: 'Advanced diagnostics' }
                ].map((modeOption) => (
                  <HolographicButton
                    key={modeOption.mode}
                    variant={canvasMode === modeOption.mode ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setCanvasMode(modeOption.mode as any)}
                    className="group relative"
                  >
                    <modeOption.icon className="w-4 h-4 mr-2" />
                    {modeOption.label}
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {modeOption.description}
                    </div>
                  </HolographicButton>
                ))}
              </div>
            </div>

            {/* Performance Controls */}
            <div className="flex items-center space-x-3">
              <div className="text-gray-300 text-sm">Performance:</div>
              <select
                value={performanceMode}
                onChange={(e) => setPerformanceMode(e.target.value as any)}
                className="bg-white/10 text-white text-sm rounded-lg px-3 py-1 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="auto">Auto</option>
                <option value="high">High</option>
                <option value="balanced">Balanced</option>
                <option value="low">Low Power</option>
              </select>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Revolutionary Canvas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mb-12"
      >
        <GlassCard variant="intense" glow className="p-6 relative overflow-hidden">
          {/* Canvas Performance Overlay */}
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center space-x-2 text-xs text-white/70">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Neural Network: {showNeuralNetwork ? 'Active' : 'Standby'}</span>
            </div>
          </div>

          <div className="h-[700px] rounded-xl overflow-hidden relative">
            <EnhancedQuantumCanvas 
              blueprint={blueprint}
              onSave={handleSaveCanvas}
              onExecute={handleExecuteWorkflow}
            />
          </div>
        </GlassCard>
      </motion.div>

      {/* Revolutionary Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="grid lg:grid-cols-3 gap-6 mb-12"
      >
        {[
          {
            icon: Brain,
            title: 'Neural Intelligence',
            description: 'AI-powered suggestions and auto-optimization',
            features: ['Smart node suggestions', 'Auto-layout algorithms', 'Performance optimization', 'Error prevention'],
            color: 'from-purple-500 to-pink-500',
            stats: '95% accuracy'
          },
          {
            icon: Users,
            title: 'Live Collaboration',
            description: 'Real-time multi-user design experience',
            features: ['Live cursors', 'Conflict resolution', 'Version control', 'Team workspace'],
            color: 'from-blue-500 to-cyan-500',
            stats: 'Up to 10 users'
          },
          {
            icon: Zap,
            title: 'Quantum Execution',
            description: 'Lightning-fast workflow processing',
            features: ['Real-time monitoring', 'Visual data flow', 'Performance metrics', 'Error recovery'],
            color: 'from-emerald-500 to-teal-500',
            stats: '<100ms latency'
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            onHoverStart={() => setActiveFeature(feature.title)}
            onHoverEnd={() => setActiveFeature(null)}
            className="group cursor-pointer"
          >
            <GlassCard 
              variant="medium" 
              className={`p-6 h-full transition-all duration-300 ${
                activeFeature === feature.title ? 'ring-2 ring-purple-400/50 bg-white/15' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </motion.div>
                <div className="text-right">
                  <div className="text-white text-sm font-mono">{feature.stats}</div>
                  <div className="text-gray-400 text-xs">Performance</div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                {feature.title}
              </h3>
              
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {feature.description}
              </p>

              <div className="space-y-2">
                {feature.features.map((feat, featIndex) => (
                  <motion.div
                    key={featIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 + featIndex * 0.05 }}
                    className="flex items-center space-x-2 text-xs"
                  >
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                    <span className="text-gray-300">{feat}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Advanced Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="mb-12"
      >
        <GlassCard variant="medium" glow className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Command className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Advanced Canvas Controls</h3>
                <p className="text-gray-300">Fine-tune your workflow creation experience</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Pro Features</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Lightbulb,
                title: 'Smart Suggestions',
                description: 'AI-powered workflow optimization',
                active: smartSuggestions.length > 0,
                action: () => console.log('Toggle suggestions')
              },
              {
                icon: Palette,
                title: 'Neural Visualization',
                description: 'Advanced network overlay',
                active: showNeuralNetwork,
                action: () => setShowNeuralNetwork(!showNeuralNetwork)
              },
              {
                icon: Shield,
                title: 'Auto-save',
                description: 'Continuous backup protection',
                active: true,
                action: () => console.log('Auto-save settings')
              },
              {
                icon: BarChart,
                title: 'Performance Monitor',
                description: 'Real-time metrics dashboard',
                active: canvasMode === 'debug',
                action: () => setCanvasMode('debug')
              }
            ].map((control, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={control.action}
                className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                  control.active 
                    ? 'bg-purple-500/20 border-purple-400/50 text-purple-300' 
                    : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                }`}
              >
                <control.icon className={`w-6 h-6 mb-3 ${control.active ? 'text-purple-400' : 'text-gray-400'}`} />
                <div className="font-medium text-white mb-1">{control.title}</div>
                <div className="text-xs text-gray-400">{control.description}</div>
                <div className={`mt-2 w-2 h-2 rounded-full ${control.active ? 'bg-green-400' : 'bg-gray-600'}`} />
              </motion.button>
            ))}
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
          size="xl" 
          glow
          className="group relative overflow-hidden"
        >
          <Save className="w-6 h-6 mr-3 group-hover:text-blue-400 transition-colors" />
          <span className="text-xl">Continue to Credentials</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="ml-3"
          >
            <ArrowRight className="w-6 h-6" />
          </motion.div>
        </HolographicButton>
      </motion.div>

      {/* Tutorial Overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-2xl"
            >
              <GlassCard variant="intense" className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Welcome to Quantum Canvas</h2>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  You're about to experience the most advanced workflow design platform ever created. 
                  This canvas combines Apple's design philosophy, Google's intelligence, and n8n's workflow power.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <HolographicButton variant="outline" onClick={completeTutorial}>
                    Skip Tutorial
                  </HolographicButton>
                  <HolographicButton onClick={completeTutorial} glow>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Creating
                  </HolographicButton>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};