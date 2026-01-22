
import React from 'react';
import { Agent } from '../types';
import { AGENT_ROLES } from '../constants';

interface AgentSwarmProps {
  agents: Agent[];
}

export const AgentSwarm: React.FC<AgentSwarmProps> = ({ agents }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {AGENT_ROLES.map((roleDef) => {
        const agentState = agents.find(a => a.role === roleDef.role);
        const isWorking = agentState?.status === 'thinking' || agentState?.status === 'executing';

        return (
          <div 
            key={roleDef.role}
            className={`p-3 rounded-lg border transition-all duration-300 ${
              isWorking 
                ? 'bg-blue-900/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                : 'bg-gray-900/40 border-gray-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] mono px-1.5 py-0.5 rounded ${
                isWorking ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'
              }`}>
                {roleDef.role}
              </span>
              {isWorking && (
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-75" />
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-150" />
                </div>
              )}
            </div>
            <h4 className="text-xs font-bold text-gray-200 truncate">{roleDef.name}</h4>
            <p className="text-[10px] text-gray-500 line-clamp-2 mt-1 leading-tight h-6">
              {agentState?.lastMessage || roleDef.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};
