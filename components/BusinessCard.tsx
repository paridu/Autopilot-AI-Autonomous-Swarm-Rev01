
import React from 'react';
import { BusinessInstance } from '../types';

interface BusinessCardProps {
  business: BusinessInstance;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const statusColors = {
    ideation: 'bg-purple-500',
    building: 'bg-blue-500',
    launched: 'bg-green-500',
    scaling: 'bg-orange-500',
    killed: 'bg-red-500'
  };

  return (
    <div className={`p-4 rounded-xl border bg-gray-900/60 flex flex-col h-full border-gray-800 transition-all ${
      business.status === 'killed' ? 'opacity-40 grayscale' : 'hover:border-blue-500/30'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white ${statusColors[business.status]}`}>
            {business.status}
          </span>
          <p className="text-[10px] text-gray-500 mt-1 mono">ID: {business.id.slice(0, 8)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase">Generation</p>
          <p className="text-sm font-bold text-blue-400 mono">G-{business.genome.generation}</p>
        </div>
      </div>
      
      <h3 className="text-sm font-bold text-white mb-2 line-clamp-1">{business.goal}</h3>
      <p className="text-xs text-gray-400 flex-1 line-clamp-3 mb-4">{business.vision}</p>
      
      <div className="grid grid-cols-3 gap-2 mt-auto pt-3 border-t border-gray-800">
        <div className="text-center">
          <p className="text-[9px] text-gray-500 uppercase">Users</p>
          <p className="text-xs font-bold text-gray-200">{business.metrics.users.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] text-gray-500 uppercase">Rev</p>
          <p className="text-xs font-bold text-green-400">${business.metrics.revenue.toFixed(0)}</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] text-gray-500 uppercase">Cost</p>
          <p className="text-xs font-bold text-red-400">${business.metrics.cost.toFixed(0)}</p>
        </div>
      </div>
    </div>
  );
};
