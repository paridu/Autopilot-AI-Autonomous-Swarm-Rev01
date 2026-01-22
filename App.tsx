
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GlobalState, BusinessInstance, Agent, AgentRole } from './types';
import { AGENT_ROLES, INITIAL_TREASURY } from './constants';
import { gemini } from './services/gemini';
import { Terminal } from './components/Terminal';
import { AgentSwarm } from './components/AgentSwarm';
import { BusinessCard } from './components/BusinessCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Activity, ShieldAlert, Cpu, Play, Pause, RotateCcw, DollarSign } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<GlobalState>({
    businesses: [],
    capital: {
      treasury: INITIAL_TREASURY,
      risk: 0.2,
      totalRevenue: 0,
      totalCost: 0
    },
    systemLogs: ["Kernel initialized.", "Waiting for goal command..."],
    activeAgents: AGENT_ROLES.map(r => ({ role: r.role, fullName: r.name, status: 'idle' })),
    isRunning: false
  });

  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const addLog = useCallback((msg: string) => {
    setState(prev => ({
      ...prev,
      systemLogs: [...prev.systemLogs, msg].slice(-100)
    }));
  }, []);

  const updateAgent = useCallback((role: AgentRole, status: Agent['status'], message?: string) => {
    setState(prev => ({
      ...prev,
      activeAgents: prev.activeAgents.map(a => 
        a.role === role ? { ...a, status, lastMessage: message || a.lastMessage } : a
      )
    }));
  }, []);

  // Main lifecycle tick
  const runCycle = useCallback(async () => {
    if (!stateRef.current.isRunning) return;

    const { businesses, capital } = stateRef.current;
    addLog("--- NEW CYCLE STARTING ---");

    // 1. Ideation (if needed)
    if (businesses.filter(b => b.status !== 'killed').length < 3) {
      updateAgent('Evolution', 'thinking', "Analyzing financial standing for ideation...");
      try {
        const newIdeas = await gemini.generateIdeation(
          "Autonomous AI-driven digital services, high-scale automation",
          capital.treasury,
          capital.risk
        );
        const newBiz: BusinessInstance[] = newIdeas.map((idea: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          goal: idea.goal,
          vision: idea.vision,
          status: 'ideation',
          metrics: { users: 0, revenue: 0, cost: 0 },
          genome: { generation: 0, mutation: idea.mutation },
          logs: []
        }));
        
        setState(prev => ({
          ...prev,
          businesses: [...prev.businesses, ...newBiz]
        }));
        addLog(`Spawned ${newBiz.length} new business units tailored to treasury: $${capital.treasury.toFixed(0)}.`);
        updateAgent('Evolution', 'idle');
      } catch (err) {
        addLog("Evolution Agent failed to generate ideas.");
        console.error(err);
      }
    }

    // 2. Business Logic Execution
    const updatedBusinesses = await Promise.all(stateRef.current.businesses.map(async (biz) => {
      if (biz.status === 'killed') return biz;

      const newMetrics = { ...biz.metrics };
      let newStatus = biz.status;

      // Simulation logic
      if (newStatus === 'ideation') {
        newStatus = 'building';
        newMetrics.cost += Math.random() * 5000;
      } else if (newStatus === 'building') {
        if (Math.random() > 0.6) newStatus = 'launched';
        newMetrics.cost += Math.random() * 2000;
      } else if (newStatus === 'launched') {
        newMetrics.users += Math.floor(Math.random() * 1000);
        newMetrics.revenue += newMetrics.users * (Math.random() * 2);
        newMetrics.cost += Math.random() * 800;
        
        if (newMetrics.revenue > newMetrics.cost * 2 && newMetrics.users > 5000) {
          newStatus = 'scaling';
        }
      } else if (newStatus === 'scaling') {
        newMetrics.users += Math.floor(Math.random() * 5000);
        newMetrics.revenue += newMetrics.users * (Math.random() * 1.5);
        newMetrics.cost += newMetrics.revenue * 0.4;
      }

      // Selection pressure
      if (newMetrics.cost > 20000 && newMetrics.revenue < newMetrics.cost * 0.3) {
        newStatus = 'killed';
        addLog(`UNIT TERMINATED: ${biz.goal} (Negative ROI)`);
      }

      return { ...biz, metrics: newMetrics, status: newStatus };
    }));

    // 3. Capital Accounting
    const totalRev = updatedBusinesses.reduce((acc, b) => acc + b.metrics.revenue, 0);
    const totalCost = updatedBusinesses.reduce((acc, b) => acc + b.metrics.cost, 0);

    setState(prev => ({
      ...prev,
      businesses: updatedBusinesses,
      capital: {
        ...prev.capital,
        treasury: prev.capital.treasury + (totalRev - totalCost) * 0.1, // Net flow
        totalRevenue: totalRev,
        totalCost: totalCost
      }
    }));

    // 4. Random Agent Interaction for visual feel
    const randomRole = AGENT_ROLES[Math.floor(Math.random() * AGENT_ROLES.length)].role;
    updateAgent(randomRole, 'thinking');
    setTimeout(async () => {
      const insight = await gemini.getAgentPerspective(
        randomRole, 
        updatedBusinesses[0]?.goal || "System Ops", 
        "General production environment"
      );
      updateAgent(randomRole, 'idle', insight);
    }, 2000);

  }, [addLog, updateAgent]);

  useEffect(() => {
    let timer: any;
    if (state.isRunning) {
      timer = setInterval(() => {
        runCycle();
      }, 8000); // 8 second ticks
    }
    return () => clearInterval(timer);
  }, [state.isRunning, runCycle]);

  const toggleSystem = () => {
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
    addLog(state.isRunning ? "System Paused." : "System Activated.");
  };

  const resetSystem = () => {
    setState({
      businesses: [],
      capital: {
        treasury: INITIAL_TREASURY,
        risk: 0.2,
        totalRevenue: 0,
        totalCost: 0
      },
      systemLogs: ["Memory Purged.", "Kernel Reinitialized."],
      activeAgents: AGENT_ROLES.map(r => ({ role: r.role, fullName: r.name, status: 'idle' })),
      isRunning: false
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
        <div>
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2">
            <Cpu className="text-blue-500" />
            AUTOPILOT <span className="text-blue-500">AI</span>
            <span className="text-xs bg-gray-800 px-2 py-1 rounded-md ml-2 mono font-normal">REV-01</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 mono uppercase tracking-widest">Autonomous Civilization Layer</p>
        </div>

        <div className="flex gap-4">
          <div className="text-right flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Treasury Holdings</span>
            <span className={`text-2xl font-black mono ${state.capital.treasury >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${state.capital.treasury.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="h-10 w-px bg-gray-800 mx-2" />
          <div className="flex gap-2">
            <button 
              onClick={toggleSystem}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${
                state.isRunning 
                  ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/50' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/40'
              }`}
            >
              {state.isRunning ? <><Pause size={18} /> PAUSE</> : <><Play size={18} /> ACTIVATE</>}
            </button>
            <button 
              onClick={resetSystem}
              className="p-3 bg-gray-800 text-gray-400 hover:text-white rounded-xl transition-all"
              title="Reset Memory"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Stats & Logs */}
        <div className="lg:col-span-4 space-y-6">
          {/* Capital Metrics Card */}
          <div className="bg-gray-900/40 p-6 rounded-2xl border border-gray-800">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <TrendingUp size={16} /> Market Performance
            </h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Revenue', value: state.capital.totalRevenue },
                  { name: 'Cost', value: state.capital.totalCost },
                  { name: 'Net', value: state.capital.totalRevenue - state.capital.totalCost }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {
                      [0, 1, 2].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#ef4444' : '#3b82f6'} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-black/30 rounded-lg">
                <p className="text-[10px] text-gray-500 uppercase">Growth Rate</p>
                <p className="text-lg font-bold text-white">+12.4%</p>
              </div>
              <div className="p-3 bg-black/30 rounded-lg">
                <p className="text-[10px] text-gray-500 uppercase">Risk Index</p>
                <div className="flex items-center gap-2">
                   <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${state.capital.risk * 100}%` }} />
                   </div>
                   <span className="text-xs font-bold text-gray-200 mono">{state.capital.risk.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          <Terminal logs={state.systemLogs} />

          {/* System Health */}
          <div className="bg-gray-900/40 p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${state.isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
              <div>
                <p className="text-xs font-bold text-gray-200 uppercase">Unkillable Mode</p>
                <p className="text-[10px] text-gray-500 mono">RESILIENT_BRAIN_ACTIVE</p>
              </div>
            </div>
            <ShieldAlert size={20} className="text-blue-500 opacity-50" />
          </div>
        </div>

        {/* Right Column - Swarm & Factories */}
        <div className="lg:col-span-8 space-y-6">
          {/* Swarm Visual */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Activity size={16} /> 20-Agent Neural Swarm
              </h2>
              <span className="text-[10px] mono text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20">
                Latent Logic Threads: 104,223
              </span>
            </div>
            <AgentSwarm agents={state.activeAgents} />
          </section>

          {/* Business Factory Visual */}
          <section className="flex-1">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <RotateCcw size={16} /> Evolutionary Business Factory
            </h2>
            {state.businesses.length === 0 ? (
              <div className="h-64 border-2 border-dashed border-gray-800 rounded-3xl flex flex-col items-center justify-center text-gray-600">
                <p className="mono">NO ACTIVE INSTANCES</p>
                <p className="text-xs mt-2 uppercase tracking-widest">Wait for autonomous seed generation...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {state.businesses.map(biz => (
                  <BusinessCard key={biz.id} business={biz} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <footer className="mt-auto pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-[10px] mono uppercase tracking-widest">
        <div className="flex gap-6">
          <span>Clean Wealth Protocol: ENFORCED</span>
          <span>Entity: AUTONOMOUS HOLDINGS LTD (SG)</span>
        </div>
        <div className="flex gap-6">
          <span>AI Providers: [Gemini-3-Pro, Claude, Local_Edge]</span>
          <span>Silent God Mode: DARK_SHADOW</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
