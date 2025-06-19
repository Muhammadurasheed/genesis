// Core Genesis Types
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  avatar_url?: string;
}

export interface Guild {
  id: string;
  name: string;
  description: string;
  purpose: string;
  user_id: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  created_at: string;
  updated_at: string;
  agents: Agent[];
  workflows: Workflow[];
  metadata: Record<string, any>;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  guild_id: string;
  personality: string;
  instructions: string;
  tools: AgentTool[];
  memory_config: AgentMemory;
  voice_config: VoiceConfig;
  status: 'active' | 'paused' | 'error';
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

export interface AgentTool {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'database' | 'external';
  config: Record<string, any>;
  credentials?: Record<string, string>;
}

export interface AgentMemory {
  short_term_enabled: boolean;
  long_term_enabled: boolean;
  memory_limit: number;
  retention_days: number;
}

export interface VoiceConfig {
  enabled: boolean;
  voice_id: string;
  voice_name: string;
  stability: number;
  similarity_boost: number;
  style: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  guild_id: string;
  trigger: WorkflowTrigger;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  status: 'draft' | 'active' | 'paused';
  created_at: string;
  updated_at: string;
}

export interface WorkflowTrigger {
  type: 'manual' | 'schedule' | 'webhook' | 'event';
  config: Record<string, any>;
}

export interface WorkflowNode {
  id: string;
  type: 'agent' | 'action' | 'condition' | 'delay';
  position: { x: number; y: number };
  data: Record<string, any>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: Record<string, any>;
}

export interface Blueprint {
  id: string;
  user_input: string;
  interpretation: string;
  suggested_structure: {
    guild_name: string;
    guild_purpose: string;
    agents: Array<{
      name: string;
      role: string;
      description: string;
      tools_needed: string[];
    }>;
    workflows: Array<{
      name: string;
      description: string;
      trigger_type: string;
    }>;
  };
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface SimulationResult {
  id: string;
  guild_id: string;
  test_data: Record<string, any>;
  agent_responses: Array<{
    agent_id: string;
    response: string;
    thought_process: string[];
    execution_time: number;
  }>;
  overall_success: boolean;
  errors: string[];
  created_at: string;
}

// UI State Types
export interface WizardState {
  step: 'welcome' | 'intent' | 'blueprint' | 'credentials' | 'simulation' | 'deployment';
  user_input: string;
  blueprint?: Blueprint;
  credentials: Record<string, string>;
  errors: string[];
}

export interface CanvasState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNode?: string;
  selectedEdge?: string;
  viewport: { x: number; y: number; zoom: number };
}