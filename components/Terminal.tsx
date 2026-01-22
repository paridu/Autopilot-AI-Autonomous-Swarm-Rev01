
import React, { useEffect, useRef } from 'react';

interface TerminalProps {
  logs: string[];
}

export const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-black/80 rounded-lg border border-gray-800 p-4 h-64 flex flex-col">
      <div className="flex items-center gap-2 border-b border-gray-800 pb-2 mb-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-xs text-gray-500 mono ml-2 uppercase tracking-widest">System Kernel v2.5.0-Flash</span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-hide mono text-sm space-y-1">
        {logs.map((log, i) => (
          <div key={i} className="text-blue-400">
            <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span> {log}
          </div>
        ))}
        <div className="text-white">
          $ <span className="cursor-blink">_</span>
        </div>
      </div>
    </div>
  );
};
