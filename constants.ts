
import { AgentRole } from './types';

export const AGENT_ROLES: { role: AgentRole; name: string; description: string }[] = [
  { role: "CEO", name: "CEO Agent", description: "Vision & KPI Alignment" },
  { role: "COO", name: "COO Agent", description: "Workflow Automation" },
  { role: "CTO", name: "CTO Agent", description: "System Architecture" },
  { role: "PM", name: "Product Manager Agent", description: "PRD & Roadmap" },
  { role: "UXR", name: "UX Research Agent", description: "User Psychology" },
  { role: "UXD", name: "UX Designer Agent", description: "Flow & Wireframes" },
  { role: "Frontend", name: "Frontend Agent", description: "UI Implementation" },
  { role: "Backend", name: "Backend Agent", description: "API & Business Logic" },
  { role: "AI", name: "AI Engineer Agent", description: "Prompt & Model Ops" },
  { role: "Data", name: "Data Agent", description: "Schema & Analytics" },
  { role: "Growth", name: "Growth Agent", description: "Viral & SEO" },
  { role: "Marketing", name: "Marketing Agent", description: "Content Strategy" },
  { role: "Sales", name: "Sales Agent", description: "Monetization Funnel" },
  { role: "Finance", name: "Finance Agent", description: "Cost & Pricing" },
  { role: "Legal", name: "Legal Agent", description: "Compliance" },
  { role: "Security", name: "Security Agent", description: "Threat Modeling" },
  { role: "QA", name: "QA Agent", description: "Bug Detection" },
  { role: "DevOps", name: "DevOps Agent", description: "Deploy & Scale" },
  { role: "Optimizer", name: "Optimizer Agent", description: "Performance Tuning" },
  { role: "Evolution", name: "Evolution Agent", description: "Self Improvement" }
];

export const INITIAL_TREASURY = 50000;
