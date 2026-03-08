import React, { useEffect } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, Position, Handle } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Brain, Clapperboard, Palette, Mic, Code2, Eye, TerminalSquare, Bug, Combine, Play, FileText } from 'lucide-react';

const CustomNode = ({ data }: any) => {
  const isActive = data.status === 'running';
  const isCompleted = data.status === 'completed';
  const isError = data.status === 'error';
  const color = data.color || '#00F0FF';

  return (
    <div 
      className="relative px-5 py-4 rounded-2xl backdrop-blur-xl transition-all duration-500 min-w-[220px]"
      style={{
        backgroundColor: 'rgba(11, 9, 26, 0.7)',
        border: `1px solid ${isActive ? color : isError ? '#ef4444' : isCompleted ? `${color}50` : 'rgba(255,255,255,0.1)'}`,
        boxShadow: isActive ? `0 0 30px ${color}40, inset 0 0 20px ${color}20` : isError ? `0 0 30px rgba(239,68,68,0.4)` : '0 10px 30px rgba(0,0,0,0.5)',
        transform: isActive ? 'scale(1.05)' : 'scale(1)'
      }}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-space-800 !border-2" style={{ borderColor: isCompleted || isActive ? color : '#555' }} />
      
      <div className="flex items-center gap-4">
        <div 
          className="p-3 rounded-xl transition-all duration-500"
          style={{
            backgroundColor: isActive || isCompleted ? `${color}20` : isError ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)',
            color: isActive || isCompleted ? color : isError ? '#ef4444' : '#888',
            boxShadow: isActive ? `0 0 20px ${color}40` : 'none'
          }}
        >
          {data.icon}
        </div>
        <div>
          <div className="text-sm font-display font-bold tracking-wide text-white">{data.label}</div>
          <div className="text-[10px] font-mono uppercase tracking-widest mt-1" style={{ color: isActive ? color : isError ? '#ef4444' : isCompleted ? `${color}80` : '#666' }}>
            {isActive ? (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                Processing
              </span>
            ) : isError ? 'Failed' : isCompleted ? 'Done' : 'Waiting'}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-space-800 !border-2" style={{ borderColor: isCompleted || isActive ? color : '#555' }} />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

const initialNodes = [
  { id: 'input', type: 'custom', position: { x: 250, y: 0 }, data: { label: 'User Prompt', icon: <FileText size={20} />, status: 'completed', color: '#ffffff' } },
  { id: 'professor', type: 'custom', position: { x: 250, y: 120 }, data: { label: 'Professor Agent', icon: <Brain size={20} />, status: 'waiting', color: '#FDB927' } },
  { id: 'director', type: 'custom', position: { x: 250, y: 240 }, data: { label: 'Director Agent', icon: <Clapperboard size={20} />, status: 'waiting', color: '#B366FF' } },
  { id: 'cinematographer', type: 'custom', position: { x: 250, y: 360 }, data: { label: 'Cinematographer', icon: <Palette size={20} />, status: 'waiting', color: '#B366FF' } },
  { id: 'audio', type: 'custom', position: { x: 20, y: 480 }, data: { label: 'Edge TTS', icon: <Mic size={20} />, status: 'waiting', color: '#FFE55C' } },
  { id: 'coder', type: 'custom', position: { x: 480, y: 480 }, data: { label: 'Coder Agent', icon: <Code2 size={20} />, status: 'waiting', color: '#FFE55C' } },
  { id: 'reviewer', type: 'custom', position: { x: 480, y: 600 }, data: { label: 'Reviewer Agent', icon: <Eye size={20} />, status: 'waiting', color: '#FDB927' } },
  { id: 'compiler', type: 'custom', position: { x: 250, y: 720 }, data: { label: 'Manim Compiler', icon: <TerminalSquare size={20} />, status: 'waiting', color: '#ffffff' } },
  { id: 'debugger', type: 'custom', position: { x: 600, y: 720 }, data: { label: 'Debugger Agent', icon: <Bug size={20} />, status: 'waiting', color: '#ef4444' } },
  { id: 'merger', type: 'custom', position: { x: 250, y: 860 }, data: { label: 'FFmpeg Merger', icon: <Combine size={20} />, status: 'waiting', color: '#552583' } },
  { id: 'output', type: 'custom', position: { x: 250, y: 980 }, data: { label: 'Final Video', icon: <Play size={20} />, status: 'waiting', color: '#FDB927' } },
];

const initialEdges = [
  { id: 'e1', source: 'input', target: 'professor', animated: true },
  { id: 'e2', source: 'professor', target: 'director', animated: true },
  { id: 'e3', source: 'director', target: 'cinematographer', animated: true },
  { id: 'e4a', source: 'cinematographer', target: 'audio', animated: true },
  { id: 'e4b', source: 'cinematographer', target: 'coder', animated: true },
  { id: 'e5', source: 'coder', target: 'reviewer', animated: true },
  { id: 'e6a', source: 'audio', target: 'compiler', animated: true },
  { id: 'e6b', source: 'reviewer', target: 'compiler', animated: true },
  { id: 'e7', source: 'compiler', target: 'debugger', animated: true, label: 'on error', style: { stroke: '#ef4444' } },
  { id: 'e8', source: 'debugger', target: 'compiler', animated: true, label: 'retry', style: { stroke: '#FFB800' } },
  { id: 'e9', source: 'compiler', target: 'merger', animated: true, label: 'on success' },
  { id: 'e10', source: 'merger', target: 'output', animated: true },
];

export function AgentGraph({ activeNode, completedNodes, errorNode }: { activeNode: string | null, completedNodes: string[], errorNode: string | null }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        let status = 'waiting';
        if (node.id === errorNode) status = 'error';
        else if (node.id === activeNode) status = 'running';
        else if (completedNodes.includes(node.id)) status = 'completed';
        return { ...node, data: { ...node.data, status } };
      })
    );

    setEdges((eds) => 
      eds.map((edge) => {
        const sourceNode = initialNodes.find(n => n.id === edge.source);
        const color = sourceNode?.data.color || '#ffffff';
        const isSourceCompleted = completedNodes.includes(edge.source);
        const isTargetActive = edge.target === activeNode;
        const isAnimating = isSourceCompleted && isTargetActive;
        const isDone = completedNodes.includes(edge.target);
        
        return {
          ...edge,
          animated: isAnimating || edge.source === activeNode,
          style: {
            ...edge.style,
            stroke: isAnimating || isDone ? color : 'rgba(255,255,255,0.1)',
            strokeWidth: isAnimating ? 3 : isDone ? 2 : 1,
            opacity: isAnimating || isDone ? 1 : 0.5,
            filter: isAnimating ? `drop-shadow(0 0 5px ${color})` : 'none',
          }
        }
      })
    );
  }, [activeNode, completedNodes, errorNode, setNodes, setEdges]);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        className="bg-transparent"
      >
        <Background color="rgba(255,255,255,0.05)" gap={24} size={2} />
        <Controls className="!bg-space-800 !border-white/10 !fill-white" />
      </ReactFlow>
    </div>
  );
}
