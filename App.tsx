import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Activity, Video, Sparkles, Loader2, RefreshCw, Terminal } from 'lucide-react';
import { AgentGraph } from './components/AgentGraph';

type Tab = 'graph' | 'preview';

interface LogEntry {
  id: string;
  timestamp: string;
  agent: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  color: string;
}

const AGENT_COLORS: Record<string, string> = {
  system: '#ffffff',
  professor: '#FDB927',
  director: '#B366FF',
  cinematographer: '#B366FF',
  audio: '#FFE55C',
  coder: '#FFE55C',
  reviewer: '#FDB927',
  compiler: '#ffffff',
  debugger: '#ef4444',
  merger: '#552583',
  output: '#FDB927'
};

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('graph');
  
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [errorNode, setErrorNode] = useState<string | null>(null);
  
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [logs]);

  const addLog = (agent: string, message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }),
      agent,
      message,
      type,
      color: AGENT_COLORS[agent] || '#ffffff'
    }]);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setActiveTab('graph');
    setLogs([]);
    setCompletedNodes([]);
    setErrorNode(null);
    setVideoUrl(null);

    const pipeline = [
      { node: 'professor', delay: 2000, msg: 'Writing lecture script and extracting key concepts...' },
      { node: 'director', delay: 2500, msg: 'Planning visual scenes and spatial layout...' },
      { node: 'cinematographer', delay: 1500, msg: 'Defining color palette and animation directives...' },
      { node: 'audio', delay: 3000, msg: 'Synthesizing voiceover with Edge-TTS...' },
      { node: 'coder', delay: 4000, msg: 'Writing Manim Python code...' },
      { node: 'reviewer', delay: 2000, msg: 'Reviewing code for spatial layout issues...' },
      { node: 'compiler', delay: 3000, msg: 'Compiling Manim scene...' },
      { node: 'debugger', delay: 2500, msg: 'Fixing compilation error: NameError "ShowCreation"...', isError: true },
      { node: 'compiler', delay: 3000, msg: 'Re-compiling Manim scene...' },
      { node: 'merger', delay: 2000, msg: 'Multiplexing audio and video with FFmpeg...' },
      { node: 'output', delay: 1000, msg: 'Video generation complete.' }
    ];

    let currentCompleted: string[] = ['input'];
    setCompletedNodes(currentCompleted);
    addLog('system', `Initializing Manimatic 2.0 pipeline for topic: "${prompt}"`, 'info');

    for (let i = 0; i < pipeline.length; i++) {
      const step = pipeline[i];
      
      if (step.isError) {
        setErrorNode('compiler');
        addLog('compiler', 'Compilation failed. Traceback routed to Debugger.', 'error');
        await new Promise(r => setTimeout(r, 1500));
        setErrorNode(null);
      }

      setActiveNode(step.node);
      addLog(step.node, step.msg, 'info');
      
      await new Promise(r => setTimeout(r, step.delay));
      
      if (step.node !== 'debugger') {
        currentCompleted = [...currentCompleted, step.node];
        setCompletedNodes(currentCompleted);
        addLog(step.node, `Task completed successfully.`, 'success');
      } else {
        addLog(step.node, `Code patched successfully. Retrying compilation.`, 'warning');
      }
    }

    setActiveNode(null);
    setIsGenerating(false);
    setVideoUrl('https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    setActiveTab('preview');
    addLog('system', 'Pipeline finished. Video ready for playback.', 'success');
  };

  return (
    <div className="min-h-screen bg-space-900 text-white font-sans overflow-hidden flex relative">
      {/* Animated Background Meshes */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-lakers-purple/30 mix-blend-screen filter blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-lakers-gold/15 mix-blend-screen filter blur-[120px] animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-lakers-lightPurple/20 mix-blend-screen filter blur-[120px] animate-blob" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="relative z-10 w-full h-screen p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto">
        
        {/* LEFT PANEL: Controls & Telemetry */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
          
          {/* Header */}
          <div className="flex items-center gap-4 bg-space-800/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lakers-gold to-lakers-purple flex items-center justify-center shadow-[0_0_20px_rgba(253,185,39,0.4)]">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                MANIMATIC <span className="text-lakers-gold font-mono font-normal text-sm tracking-[0.3em] ml-1">2.0</span>
              </h1>
              <div className="flex items-center gap-2 mt-1 text-xs font-mono text-white/50">
                <span className="w-2 h-2 rounded-full bg-lakers-lightGold animate-pulse shadow-[0_0_10px_rgba(255,229,92,0.8)]" />
                Swarm Intelligence Online
              </div>
            </div>
          </div>

          {/* Input Section */}
          <div className="bg-space-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-lakers-gold/5 to-lakers-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <form onSubmit={handleGenerate} className="relative z-10 flex flex-col gap-4">
              <div>
                <label htmlFor="prompt" className="block text-xs font-mono text-white/50 uppercase tracking-widest mb-3">
                  Target Concept
                </label>
                <input
                  id="prompt"
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Fourier Transforms..."
                  disabled={isGenerating}
                  className="w-full bg-space-900/50 border border-white/10 rounded-2xl px-5 py-4 text-lg font-display focus:outline-none focus:border-lakers-gold focus:ring-1 focus:ring-lakers-gold focus:shadow-[0_0_20px_rgba(253,185,39,0.2)] transition-all disabled:opacity-50 placeholder:text-white/20"
                />
              </div>
              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="relative overflow-hidden w-full bg-white text-space-900 py-4 rounded-2xl font-display font-bold tracking-widest uppercase hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] group/btn"
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)] -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin relative z-10" size={20} />
                    <span className="relative z-10">Orchestrating Swarm...</span>
                  </>
                ) : (
                  <>
                    <Play size={20} className="fill-current relative z-10" />
                    <span className="relative z-10">Generate Video</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Live Telemetry Logs */}
          <div className="flex-1 bg-space-900/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] z-10 opacity-50" />
            <div className="px-6 py-4 border-b border-white/10 bg-space-800/50 flex items-center gap-3 relative z-20">
              <Terminal size={16} className="text-lakers-gold" />
              <h3 className="font-mono text-xs uppercase tracking-widest text-white/70">Live Telemetry</h3>
            </div>
            <div className="flex-1 p-6 overflow-y-auto font-mono text-xs sm:text-sm relative z-20 space-y-3">
              {logs.length === 0 ? (
                <div className="text-white/30 italic flex items-center h-full justify-center">Awaiting command...</div>
              ) : (
                logs.map((log) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={log.id} 
                    className="flex gap-3 leading-relaxed"
                  >
                    <span className="text-white/30 shrink-0">[{log.timestamp}]</span>
                    <span className="shrink-0 w-28 sm:w-32 uppercase tracking-wider font-bold" style={{ color: log.color }}>
                      {log.agent}
                    </span>
                    <span className={`flex-1 ${
                      log.type === 'error' ? 'text-red-400' :
                      log.type === 'success' ? 'text-lakers-lightGold' :
                      log.type === 'warning' ? 'text-lakers-lightPurple' :
                      'text-white/80'
                    }`}>
                      {log.message}
                    </span>
                  </motion.div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Visualization */}
        <div className="lg:col-span-8 flex flex-col h-full bg-space-800/30 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          {/* Tabs */}
          <div className="flex border-b border-white/10 bg-space-900/50 p-2 gap-2">
            <button
              onClick={() => setActiveTab('graph')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-display font-bold uppercase tracking-wider transition-all ${activeTab === 'graph' ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
            >
              <Activity size={18} />
              Agent Swarm Graph
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              disabled={!videoUrl && !isGenerating}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-display font-bold uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed ${activeTab === 'preview' ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
            >
              <Video size={18} />
              Final Render
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              {activeTab === 'graph' && (
                <motion.div
                  key="graph"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <AgentGraph activeNode={activeNode} completedNodes={completedNodes} errorNode={errorNode} />
                </motion.div>
              )}

              {activeTab === 'preview' && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center p-8 bg-space-900/50"
                >
                  {videoUrl ? (
                    <div className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(253,185,39,0.15)] relative group">
                      <video 
                        src={videoUrl} 
                        controls 
                        autoPlay 
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-lg text-xs font-mono text-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        <Sparkles size={14} className="text-lakers-gold" />
                        Rendered via Manim CE + FFmpeg
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-6 text-white/40">
                      <div className="relative">
                        <div className="absolute inset-0 bg-lakers-gold/20 blur-xl rounded-full" />
                        <RefreshCw className="animate-spin relative z-10 text-lakers-gold" size={48} />
                      </div>
                      <p className="font-display font-bold text-lg uppercase tracking-widest text-white/60">Awaiting Render Output...</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
