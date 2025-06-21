import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  ConnectionMode,
  Panel,
  MarkerType,
  Connection,
  EdgeChange,
  NodeChange,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Zap, 
  Settings, 
  Play, 
  Pause, 
  Save, 
  Share2, 
  Layers,
  Sparkles,
  Eye,
  EyeOff,
  Maximize2,
  Grid,
  Workflow,
  Brain,
  Users,
  Calendar,
  Database,
  Globe,
  Mail,
  MessageSquare,
  DollarSign,
  BarChart,
  FileText,
  Image,
  Video,
  Mic,
  Clock,
  Target,
  Rocket,
  Shield,
  Heart,
  Star,
  Lightbulb,
  Coffee,
  Music
} from 'lucide-react';
import { AgentNode } from './nodes/AgentNode';
import { TriggerNode } from './nodes/TriggerNode';
import { ActionNode } from './nodes/ActionNode';
import { ConditionNode } from './nodes/ConditionNode';
import { DelayNode } from './nodes/DelayNode';
import { GlassCard } from '../ui/GlassCard';
import { HolographicButton } from '../ui/HolographicButton';
import { useCanvasStore } from '../../stores/canvasStore';
import type { Blueprint } from '../../types';

const nodeTypes = {
  agent: AgentNode,
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  delay: DelayNode,
};

const proOptions = {
  hideAttribution: true,
};

interface QuantumCanvasProps {
  blueprint?: Blueprint;
  onSave?: (nodes: Node[], edges: Edge[]) => void;
  onExecute?: () => void;
  isExecuting?: boolean;
}

export const QuantumCanvas: React.FC<QuantumCanvasProps> = ({
  blueprint,
  onSave,
  onExecute,
  isExecuting = false
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isMinimapVisible, setIsMinimapVisible] = useState(true);
  const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null);
  const [isGridVisible, setIsGridVisible] = useState(true);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Canvas state management
  const { 
    canvasMode, 
    setCanvasMode, 
    selectedNodes, 
    setSelectedNodes,
    isCollaborative,
    setIsCollaborative
  } = useCanvasStore();

  // Initialize canvas from blueprint
  useEffect(() => {
    if (blueprint && blueprint.suggested_structure) {
      generateNodesFromBlueprint();
    }
  }, [blueprint]);

  const generateNodesFromBlueprint = useCallback(() => {
    if (!blueprint) return;

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Create trigger node
    newNodes.push({
      id: 'trigger-1',
      type: 'trigger',
      position: { x: 100, y: 100 },
      data: {
        label: 'Guild Activation',
        triggerType: 'manual',
        description: 'Initiates the guild workflow',
        icon: Rocket,
        color: 'from-emerald-500 to-teal-500'
      },
    });

    // Create agent nodes from blueprint
    blueprint.suggested_structure.agents.forEach((agent, index) => {
      const agentNode: Node = {
        id: `agent-${index + 1}`,
        type: 'agent',
        position: { 
          x: 300 + (index * 350), 
          y: 200 + (index % 2) * 150 
        },
        data: {
          label: agent.name,
          role: agent.role,
          description: agent.description,
          tools: agent.tools_needed,
          personality: 'Professional and intelligent',
          icon: getAgentIcon(agent.role),
          color: getAgentColor(index),
          status: 'ready'
        },
      };
      newNodes.push(agentNode);

      // Connect trigger to first agent, and agents in sequence
      if (index === 0) {
        newEdges.push({
          id: `trigger-agent-${index + 1}`,
          source: 'trigger-1',
          target: `agent-${index + 1}`,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#10b981', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
        });
      } else {
        newEdges.push({
          id: `agent-${index}-agent-${index + 1}`,
          source: `agent-${index}`,
          target: `agent-${index + 1}`,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#8b5cf6', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
        });
      }
    });

    // Create workflow action nodes
    blueprint.suggested_structure.workflows.forEach((workflow, index) => {
      const workflowNode: Node = {
        id: `workflow-${index + 1}`,
        type: 'action',
        position: { 
          x: 300 + (index * 300), 
          y: 450 
        },
        data: {
          label: workflow.name,
          description: workflow.description,
          actionType: workflow.trigger_type,
          icon: getWorkflowIcon(workflow.trigger_type),
          color: getWorkflowColor(workflow.trigger_type),
          status: 'pending'
        },
      };
      newNodes.push(workflowNode);

      // Connect last agent to workflows
      if (blueprint.suggested_structure.agents.length > 0) {
        const lastAgentIndex = blueprint.suggested_structure.agents.length;
        newEdges.push({
          id: `agent-${lastAgentIndex}-workflow-${index + 1}`,
          source: `agent-${lastAgentIndex}`,
          target: `workflow-${index + 1}`,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#f59e0b', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' },
        });
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [blueprint]);

  const getAgentIcon = (role: string) => {
    const roleIcons: Record<string, any> = {
      'analyst': BarChart,
      'support': MessageSquare,
      'sales': DollarSign,
      'marketing': Sparkles,
      'finance': DollarSign,
      'operations': Settings,
      'hr': Users,
      'customer': Heart,
      'data': Database,
      'content': FileText,
      'social': Share2,
      'email': Mail,
      'report': FileText,
      'intelligence': Brain,
      'specialist': Target,
    };

    const roleKey = Object.keys(roleIcons).find(key => 
      role.toLowerCase().includes(key)
    );

    return roleIcons[roleKey || 'specialist'] || Bot;
  };

  const getAgentColor = (index: number) => {
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-emerald-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-violet-500 to-purple-500',
      'from-indigo-500 to-blue-500',
    ];
    return colors[index % colors.length];
  };

  const getWorkflowIcon = (triggerType: string) => {
    const triggerIcons: Record<string, any> = {
      'schedule': Clock,
      'webhook': Globe,
      'manual': Play,
      'event': Zap,
    };
    return triggerIcons[triggerType] || Workflow;
  };

  const getWorkflowColor = (triggerType: string) => {
    const triggerColors: Record<string, string> = {
      'schedule': 'from-blue-500 to-indigo-500',
      'webhook': 'from-green-500 to-emerald-500',
      'manual': 'from-purple-500 to-violet-500',
      'event': 'from-yellow-500 to-orange-500',
    };
    return triggerColors[triggerType] || 'from-gray-500 to-slate-500';
  };

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = {
        ...params,
        id: `edge-${params.source}-${params.target}`,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#8b5cf6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodes([node.id]);
  }, [setSelectedNodes]);

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(nodes, edges);
    }
  }, [nodes, edges, onSave]);

  const handleExecute = useCallback(() => {
    if (onExecute) {
      onExecute();
    }
  }, [onExecute]);

  const nodeCreationTools = [
    {
      type: 'agent',
      icon: Bot,
      label: 'AI Agent',
      color: 'from-purple-500 to-pink-500',
      description: 'Intelligent digital worker'
    },
    {
      type: 'trigger',
      icon: Zap,
      label: 'Trigger',
      color: 'from-emerald-500 to-teal-500',
      description: 'Workflow starter'
    },
    {
      type: 'action',
      icon: Settings,
      label: 'Action',
      color: 'from-blue-500 to-cyan-500',
      description: 'Process executor'
    },
    {
      type: 'condition',
      icon: Target,
      label: 'Condition',
      color: 'from-orange-500 to-red-500',
      description: 'Logic branch'
    },
    {
      type: 'delay',
      icon: Clock,
      label: 'Delay',
      color: 'from-violet-500 to-purple-500',
      description: 'Wait period'
    },
  ];

  const addNode = useCallback((type: string) => {
    const nodeCreationTool = nodeCreationTools.find(tool => tool.type === type);
    if (!nodeCreationTool) return;

    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { 
        x: Math.random() * 300 + 200, 
        y: Math.random() * 300 + 200 
      },
      data: {
        label: `New ${nodeCreationTool.label}`,
        description: nodeCreationTool.description,
        icon: nodeCreationTool.icon,
        color: nodeCreationTool.color,
        status: 'new'
      },
    };

    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type);
    },
    [reactFlowInstance, addNode]
  );

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Quantum Background Effects */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Top Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-4 left-4 right-4 z-50"
      >
        <GlassCard variant="medium" className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Workflow className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">
                    {blueprint?.suggested_structure.guild_name || 'Quantum Canvas'}
                  </h3>
                  <p className="text-gray-300 text-xs">
                    {nodes.length} nodes • {edges.length} connections
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {['design', 'simulate', 'deploy'].map((mode, index) => (
                  <HolographicButton
                    key={mode}
                    variant={canvasMode === mode ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setCanvasMode(mode as any)}
                    className="capitalize"
                  >
                    {mode}
                  </HolographicButton>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <HolographicButton
                variant="ghost"
                size="sm"
                onClick={() => setIsGridVisible(!isGridVisible)}
              >
                <Grid className="w-4 h-4" />
              </HolographicButton>
              
              <HolographicButton
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimapVisible(!isMinimapVisible)}
              >
                {isMinimapVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </HolographicButton>

              <HolographicButton
                variant="ghost"
                size="sm"
                onClick={() => setIsCollaborative(!isCollaborative)}
              >
                <Users className="w-4 h-4" />
              </HolographicButton>

              <HolographicButton
                variant="outline"
                size="sm"
                onClick={handleSave}
              >
                <Save className="w-4 h-4" />
              </HolographicButton>

              <HolographicButton
                variant="primary"
                size="sm"
                onClick={handleExecute}
                disabled={isExecuting}
                glow
              >
                {isExecuting ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </HolographicButton>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Left Sidebar - Node Palette */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute left-4 top-24 bottom-4 w-64 z-40"
      >
        <GlassCard variant="medium" className="p-4 h-full">
          <div className="flex flex-col h-full">
            <div className="mb-4">
              <h4 className="text-white font-semibold mb-2">Node Palette</h4>
              <p className="text-gray-300 text-xs">
                Drag nodes to canvas or click to add
              </p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto">
              {nodeCreationTools.map((tool) => (
                <motion.div
                  key={tool.type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer"
                  onClick={() => addNode(tool.type)}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData('application/reactflow', tool.type);
                    event.dataTransfer.effectAllowed = 'move';
                  }}
                >
                  <GlassCard variant="subtle" className="p-3 hover:bg-white/10 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
                        <tool.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{tool.label}</div>
                        <div className="text-gray-300 text-xs">{tool.description}</div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {/* Blueprint Info */}
            {blueprint && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <h5 className="text-white font-medium mb-2">Blueprint Info</h5>
                <div className="space-y-2 text-xs">
                  <div className="text-gray-300">
                    <span className="text-purple-400">{blueprint.suggested_structure.agents.length}</span> Agents
                  </div>
                  <div className="text-gray-300">
                    <span className="text-blue-400">{blueprint.suggested_structure.workflows.length}</span> Workflows
                  </div>
                  <div className="text-gray-300">
                    Status: <span className="text-green-400">Active</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Main Canvas */}
      <div 
        ref={reactFlowWrapper} 
        className="w-full h-full ml-72 mr-4"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          proOptions={proOptions}
          className="bg-transparent"
        >
          <Background 
            variant={isGridVisible ? 'dots' : undefined}
            gap={20}
            size={1}
            color="#ffffff"
            style={{ opacity: isGridVisible ? 0.1 : 0 }}
          />
          
          <Controls 
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg"
            showZoom={true}
            showFitView={true}
            showInteractive={true}
          />

          {/* Execution Status Panel */}
          <Panel position="bottom-center">
            <AnimatePresence>
              {isExecuting && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <GlassCard variant="medium" className="px-6 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-white font-medium">Executing Workflow...</span>
                      <div className="text-gray-300 text-sm">
                        {nodes.filter(n => n.data.status === 'executing').length} / {nodes.length} nodes active
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </Panel>

          {/* Collaboration Indicator */}
          <Panel position="top-right">
            <AnimatePresence>
              {isCollaborative && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <GlassCard variant="subtle" className="p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-white text-sm">Live Collaboration</span>
                      <div className="flex -space-x-1">
                        {[1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full border-2 border-white/20 flex items-center justify-center text-white text-xs"
                          >
                            {i}
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};