/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  GitBranch, 
  Smartphone, 
  Search, 
  Filter, 
  MoreVertical, 
  Send, 
  CheckCircle2, 
  Clock, 
  Users, 
  Bot, 
  Zap, 
  RefreshCw, 
  QrCode,
  ArrowUpRight,
  ChevronRight,
  Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell
} from 'recharts';
import { cn } from './lib/utils';

// --- Mock Data ---

const dashboardMetrics = [
  { label: 'Atendimentos', value: '1.284', change: '+12%', icon: MessageSquare, color: 'text-primary' },
  { label: 'TMR (Média)', value: '1m 42s', change: '-18%', icon: Clock, color: 'text-secondary' },
  { label: 'Atendentes Online', value: '12', change: 'Estável', icon: Users, color: 'text-green-500' },
  { label: 'Resolução Bot', value: '74%', change: '+5%', icon: Bot, color: 'text-purple-500' },
];

const hourlyData = [
  { hour: '08h', atendimentos: 45 },
  { hour: '09h', atendimentos: 52 },
  { hour: '10h', atendimentos: 85 },
  { hour: '11h', atendimentos: 110 },
  { hour: '12h', atendimentos: 95 },
  { hour: '13h', atendimentos: 70 },
  { hour: '14h', atendimentos: 120 },
  { hour: '15h', atendimentos: 145 },
  { hour: '16h', atendimentos: 130 },
  { hour: '17h', atendimentos: 90 },
];

const sparklineData = [
  { value: 400 }, { value: 300 }, { value: 600 }, { value: 800 }, { value: 500 }, { value: 900 }, { value: 1100 }
];

const agents = [
  { name: 'Ana Silva', status: 'online', avatar: 'https://picsum.photos/seed/ana/40/40' },
  { name: 'Bruno Costa', status: 'ocupado', avatar: 'https://picsum.photos/seed/bruno/40/40' },
  { name: 'Carla Dias', status: 'ausente', avatar: 'https://picsum.photos/seed/carla/40/40' },
  { name: 'Diego Lima', status: 'online', avatar: 'https://picsum.photos/seed/diego/40/40' },
];

const conversations = [
  { id: 1, name: 'João Pereira', lastMsg: 'Olá, gostaria de saber o preço...', time: '14:20', status: 'Aguardando', tag: 'Aguardando', color: 'bg-yellow-500/20 text-yellow-500' },
  { id: 2, name: 'Maria Souza', lastMsg: 'Obrigado pela ajuda!', time: '13:45', status: 'Bot', tag: 'Bot', color: 'bg-purple-500/20 text-purple-500' },
  { id: 3, name: 'Roberto Santos', lastMsg: 'Pode me enviar o catálogo?', time: '12:10', status: 'Em Atendimento', tag: 'Em Atendimento', color: 'bg-blue-500/20 text-blue-500' },
  { id: 4, name: 'Fernanda Lima', lastMsg: 'Atendimento finalizado.', time: 'Ontem', status: 'Finalizado', tag: 'Finalizado', color: 'bg-gray-500/20 text-gray-400' },
];

const messages = [
  { id: 1, sender: 'cliente', text: 'Olá, como posso contratar o plano premium?', time: '14:20' },
  { id: 2, sender: 'bot', text: 'Olá! Sou o assistente virtual. Nossos planos começam em R$ 99/mês. Deseja falar com um consultor?', time: '14:21' },
  { id: 3, sender: 'atendente', text: 'Olá João, sou a Ana. Vou te ajudar com os detalhes do plano premium.', time: '14:25' },
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active ? "bg-primary text-dark font-bold shadow-lg shadow-primary/20" : "text-neutral-400 hover:bg-white/5 hover:text-white"
    )}
  >
    <Icon size={20} className={cn("transition-transform group-hover:scale-110", active ? "text-dark" : "text-neutral-500")} />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const MetricCard = ({ metric }: { metric: typeof dashboardMetrics[0] }) => (
  <div className="bg-card border border-border p-5 rounded-2xl hover:border-primary/30 transition-colors group">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-2.5 rounded-lg bg-white/5", metric.color)}>
        <metric.icon size={22} />
      </div>
      <span className={cn(
        "text-xs font-bold px-2 py-1 rounded-full",
        metric.change.startsWith('+') ? "bg-green-500/10 text-green-500" : 
        metric.change.startsWith('-') ? "bg-red-500/10 text-red-500" : "bg-white/10 text-white"
      )}>
        {metric.change}
      </span>
    </div>
    <h3 className="text-neutral-400 text-sm font-medium mb-1">{metric.label}</h3>
    <p className="text-2xl font-display font-bold">{metric.value}</p>
  </div>
);

const Dashboard = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {dashboardMetrics.map((m, i) => <MetricCard key={i} metric={m} />)}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-lg font-bold">Volume de Atendimentos</h2>
            <p className="text-xs text-neutral-500">Comparativo hora a hora (Hoje vs Ontem)</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[10px] uppercase tracking-wider text-neutral-400">Hoje</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-white/10" />
              <span className="text-[10px] uppercase tracking-wider text-neutral-400">Ontem</span>
            </div>
          </div>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis 
                dataKey="hour" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#71717a', fontSize: 10 }} 
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '8px' }}
              />
              <Bar dataKey="atendimentos" radius={[4, 4, 0, 0]}>
                {hourlyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 7 ? '#facc15' : '#262626'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Users size={16} className="text-primary" /> Atendentes
          </h2>
          <div className="space-y-4">
            {agents.map((agent, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={agent.avatar} alt={agent.name} className="w-9 h-9 rounded-full border border-border" referrerPolicy="no-referrer" />
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card",
                      agent.status === 'online' ? "bg-green-500" : agent.status === 'ocupado' ? "bg-yellow-500" : "bg-neutral-600"
                    )} />
                  </div>
                  <div>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">{agent.name}</p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-tighter">{agent.status}</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-neutral-700 group-hover:text-neutral-400" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary rounded-2xl p-6 text-dark overflow-hidden relative group">
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Volume 7 Dias</p>
            <h2 className="text-3xl font-display font-black mb-4">8.420</h2>
            <div className="h-12 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line type="monotone" dataKey="value" stroke="#0a0a0a" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <Zap size={80} className="absolute -bottom-4 -right-4 text-dark/10 rotate-12 group-hover:scale-110 transition-transform" />
        </div>
      </div>
    </div>
  </div>
);

const Inbox = () => {
  const [filter, setFilter] = useState('Todos');
  
  return (
    <div className="h-[calc(100vh-120px)] flex gap-4 animate-in slide-in-from-bottom-4 duration-500">
      {/* Sidebar Inbox */}
      <div className="w-80 flex flex-col bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-bottom border-border space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar conversas..." 
              className="w-full bg-white/5 border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
            {['Todos', 'Aguardando', 'Meus'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all",
                  filter === f ? "bg-primary text-dark" : "text-neutral-500 hover:text-white"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <div key={c.id} className="p-4 border-b border-border/50 hover:bg-white/5 cursor-pointer transition-colors group">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-bold group-hover:text-primary transition-colors">{c.name}</h3>
                <span className="text-[10px] text-neutral-500">{c.time}</span>
              </div>
              <p className="text-xs text-neutral-400 truncate mb-2">{c.lastMsg}</p>
              <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded", c.color)}>
                {c.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              JP
            </div>
            <div>
              <h3 className="text-sm font-bold">João Pereira</h3>
              <p className="text-[10px] text-green-500 flex items-center gap-1">
                <Circle size={6} fill="currentColor" /> Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-neutral-500 hover:text-white transition-colors"><Search size={18} /></button>
            <button className="text-neutral-500 hover:text-white transition-colors"><MoreVertical size={18} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex justify-center">
            <span className="text-[10px] uppercase tracking-widest text-neutral-600 bg-white/5 px-3 py-1 rounded-full">Hoje, 25 de Março</span>
          </div>
          {messages.map((m) => (
            <div key={m.id} className={cn(
              "flex flex-col max-w-[70%]",
              m.sender === 'cliente' ? "self-start" : "self-end items-end"
            )}>
              <div className={cn(
                "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                m.sender === 'cliente' ? "bg-white/5 rounded-tl-none border border-border" : 
                m.sender === 'bot' ? "bg-purple-500/10 text-purple-100 rounded-tr-none border border-purple-500/20" :
                "bg-primary text-dark font-medium rounded-tr-none"
              )}>
                {m.text}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 px-1">
                {m.sender === 'bot' && <Bot size={10} className="text-purple-500" />}
                <span className="text-[9px] text-neutral-500 uppercase tracking-tighter">{m.sender} • {m.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border bg-white/[0.02]">
          <div className="flex items-center gap-3 bg-white/5 border border-border rounded-2xl p-2 pl-4">
            <input 
              type="text" 
              placeholder="Digite sua mensagem..." 
              className="flex-1 bg-transparent border-none focus:outline-none text-sm"
            />
            <button className="p-2.5 bg-primary text-dark rounded-xl hover:scale-105 transition-transform">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Flows = () => (
  <div className="space-y-6 animate-in zoom-in-95 duration-500">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div className="bg-card border border-border p-5 rounded-2xl">
        <h3 className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-1">Tokens Consumidos</h3>
        <p className="text-2xl font-display font-bold">128.4k</p>
        <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
          <div className="bg-purple-500 h-full w-[65%]" />
        </div>
      </div>
      <div className="bg-card border border-border p-5 rounded-2xl">
        <h3 className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-1">Taxa de Sucesso</h3>
        <p className="text-2xl font-display font-bold">98.2%</p>
        <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
          <div className="bg-green-500 h-full w-[98%]" />
        </div>
      </div>
      <div className="bg-card border border-border p-5 rounded-2xl">
        <h3 className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-1">Tempo de Execução</h3>
        <p className="text-2xl font-display font-bold">0.8s</p>
        <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
          <div className="bg-blue-500 h-full w-[40%]" />
        </div>
      </div>
      <div className="bg-card border border-border p-5 rounded-2xl">
        <h3 className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-1">Fluxos Ativos</h3>
        <p className="text-2xl font-display font-bold">24</p>
        <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
          <div className="bg-primary h-full w-[80%]" />
        </div>
      </div>
    </div>

    <div className="bg-card border border-border rounded-3xl p-8 h-[500px] relative overflow-hidden flex items-center justify-center bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px]">
      <div className="flex items-center gap-12 relative z-10">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-white/5 border border-border rounded-2xl flex items-center justify-center text-primary shadow-2xl">
            <Zap size={28} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Gatilho</span>
        </div>
        
        <ChevronRight className="text-neutral-800" />

        <div className="flex flex-col items-center gap-3">
          <div className="w-32 h-20 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex flex-col items-center justify-center text-purple-500 shadow-2xl shadow-purple-500/5">
            <Bot size={24} className="mb-1" />
            <span className="text-[10px] font-bold">IA GPT-4o</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Processamento</span>
        </div>

        <ChevronRight className="text-neutral-800" />

        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-white/5 border border-border rounded-2xl flex items-center justify-center text-secondary shadow-2xl">
            <GitBranch size={28} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Condição</span>
        </div>

        <ChevronRight className="text-neutral-800" />

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-xl text-green-500">
            <CheckCircle2 size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Finalizar</span>
          </div>
          <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-xl text-blue-500">
            <Users size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Humano</span>
          </div>
        </div>
      </div>

      <div className="absolute top-6 left-6 flex items-center gap-2 bg-dark/50 backdrop-blur-md border border-border px-3 py-1.5 rounded-full">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Fluxo Ativo: Suporte Vendas</span>
      </div>
    </div>
  </div>
);

const Instances = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
    {[1, 2].map((i) => (
      <div key={i} className="bg-card border border-border rounded-3xl p-8 space-y-8 hover:border-primary/20 transition-all group">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/5 border border-border rounded-2xl flex items-center justify-center text-primary">
              <Smartphone size={28} />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold">Instância #{i}</h3>
              <p className="text-xs text-neutral-500">Conectado via Webhook v2.4</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Circle size={6} fill="currentColor" /> Ativo
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/[0.02] rounded-2xl border border-border/50">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Uptime</p>
            <p className="text-lg font-bold">99.9%</p>
          </div>
          <div className="text-center p-4 bg-white/[0.02] rounded-2xl border border-border/50">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Latência</p>
            <p className="text-lg font-bold">42ms</p>
          </div>
          <div className="text-center p-4 bg-white/[0.02] rounded-2xl border border-border/50">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Volume</p>
            <p className="text-lg font-bold">4.2k</p>
          </div>
        </div>

        <div className="flex items-center justify-center p-10 bg-white/5 rounded-3xl border border-dashed border-border group-hover:bg-white/[0.08] transition-colors cursor-pointer">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-white rounded-2xl shadow-2xl shadow-white/5">
              <QrCode size={120} className="text-dark" />
            </div>
            <p className="text-xs font-medium text-neutral-400">Clique para atualizar QR Code</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 border border-border rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
            <RefreshCw size={14} /> Reconectar
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-dark rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-[1.02] transition-transform">
            Configurações
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard': return <Dashboard />;
      case 'Caixa de Entrada': return <Inbox />;
      case 'Fluxos & IA': return <Flows />;
      case 'Instâncias': return <Instances />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex bg-dark">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-dark shadow-lg shadow-primary/20">
            <Zap size={24} fill="currentColor" />
          </div>
          <h1 className="text-xl font-display font-black tracking-tighter">
            atendemos<span className="text-primary">Whats</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeTab === 'Dashboard'} 
            onClick={() => setActiveTab('Dashboard')} 
          />
          <SidebarItem 
            icon={MessageSquare} 
            label="Caixa de Entrada" 
            active={activeTab === 'Caixa de Entrada'} 
            onClick={() => setActiveTab('Caixa de Entrada')} 
          />
          <SidebarItem 
            icon={GitBranch} 
            label="Fluxos & IA" 
            active={activeTab === 'Fluxos & IA'} 
            onClick={() => setActiveTab('Fluxos & IA')} 
          />
          <SidebarItem 
            icon={Smartphone} 
            label="Instâncias" 
            active={activeTab === 'Instâncias'} 
            onClick={() => setActiveTab('Instâncias')} 
          />
        </nav>

        <div className="p-4 bg-white/5 rounded-2xl border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
              <Zap size={14} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Plano Pro</p>
          </div>
          <p className="text-xs text-neutral-500 mb-3">Você está usando 85% do seu limite de tokens.</p>
          <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors">
            Upgrade
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 border-b border-border px-8 flex items-center justify-between bg-dark/50 backdrop-blur-xl sticky top-0 z-50">
          <div>
            <h2 className="text-xl font-display font-bold">{activeTab}</h2>
            <p className="text-xs text-neutral-500">Bem-vindo de volta, Administrador.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Sistema Online
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-bold group-hover:text-primary transition-colors">Flávio Ribeiro</p>
                <p className="text-[10px] text-neutral-500 uppercase tracking-tighter">Admin Principal</p>
              </div>
              <img 
                src="https://picsum.photos/seed/flavio/40/40" 
                alt="User" 
                className="w-10 h-10 rounded-xl border border-border group-hover:border-primary transition-colors"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
