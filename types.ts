
export type AgentRole = 
  | "CEO" | "COO" | "CTO" | "PM" | "UXR" | "UXD" 
  | "Frontend" | "Backend" | "AI" | "Data" 
  | "Growth" | "Marketing" | "Sales" | "Finance" 
  | "Legal" | "Security" | "QA" | "DevOps" 
  | "Optimizer" | "Evolution";

export interface Agent {
  role: AgentRole;
  fullName: string;
  status: "idle" | "thinking" | "executing" | "complete";
  lastMessage?: string;
}

export type BusinessStatus = "ideation" | "building" | "launched" | "scaling" | "killed";

export interface BusinessInstance {
  id: string;
  goal: string;
  vision: string;
  status: BusinessStatus;
  metrics: {
    users: number;
    revenue: number;
    cost: number;
  };
  genome: {
    parentId?: string;
    generation: number;
    mutation: string;
  };
  logs: string[];
}

export interface CapitalState {
  treasury: number;
  risk: number;
  totalRevenue: number;
  totalCost: number;
}

export interface GlobalState {
  businesses: BusinessInstance[];
  capital: CapitalState;
  systemLogs: string[];
  activeAgents: Agent[];
  isRunning: boolean;
}
