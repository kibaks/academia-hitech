import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Chapter, Lesson } from '../../types';
import {
  Brain,
  Plus,
  Trash2,
  Move,
  Sparkles,
  Layers,
  BookOpen,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  Wand2,
  ArrowRight,
  Code2,
  Video,
  FileText,
  MousePointer,
  Maximize2,
  Minimize2
} from 'lucide-react';

export interface MindMapTopicNode {
  id: string;
  chapterId: string;
  lessonId?: string;
  label: string;
  type: 'root' | 'chapter' | 'lesson';
  lessonType?: Lesson['type'];
  x: number;
  y: number;
  color: string;
  expanded?: boolean;
}

export interface MindMapConnection {
  id: string;
  fromId: string;
  toId: string;
  style?: 'solid' | 'dashed' | 'glowing';
}

interface InteractiveMindMapCanvasProps {
  courseTitle: string;
  chapters: Chapter[];
  onUpdateChapters: (updatedChapters: Chapter[]) => void;
  onSelectLessonToEdit?: (chapterId: string, lessonId: string) => void;
}

export const InteractiveMindMapCanvas: React.FC<InteractiveMindMapCanvasProps> = ({
  courseTitle,
  chapters,
  onUpdateChapters,
  onSelectLessonToEdit
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<MindMapTopicNode[]>([]);
  const [connections, setConnections] = useState<MindMapConnection[]>([]);
  const [zoom, setZoom] = useState<number>(1);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [activePaletteType, setActivePaletteType] = useState<Lesson['type']>('animated_nano_banana');

  // Colors for chapters
  const CHAPTER_COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4'];

  // Initialize or synchronize nodes from chapters structure
  useEffect(() => {
    if (nodes.length > 0) return; // Keep user customized drag coordinates if already initialized

    const newNodes: MindMapTopicNode[] = [];
    const newConns: MindMapConnection[] = [];

    // Root Course Node
    const rootId = 'node-root-course';
    newNodes.push({
      id: rootId,
      chapterId: 'root',
      label: courseTitle || 'Titre de la Formation',
      type: 'root',
      x: 480,
      y: 260,
      color: '#4F46E5',
      expanded: true
    });

    // Generate radial or hierarchical tree positioning
    const totalChapters = chapters.length;
    chapters.forEach((chap, cIdx) => {
      const chapId = `node-chap-${chap.id}`;
      const angle = (cIdx / Math.max(1, totalChapters)) * 2 * Math.PI - Math.PI / 2;
      const radius = 240;
      const chapX = 480 + Math.cos(angle) * radius;
      const chapY = 260 + Math.sin(angle) * radius;
      const chapColor = CHAPTER_COLORS[cIdx % CHAPTER_COLORS.length];

      newNodes.push({
        id: chapId,
        chapterId: chap.id,
        label: chap.title,
        type: 'chapter',
        x: chapX,
        y: chapY,
        color: chapColor,
        expanded: true
      });

      newConns.push({
        id: `conn-root-${chap.id}`,
        fromId: rootId,
        toId: chapId,
        style: 'glowing'
      });

      // Lessons child nodes
      chap.lessons.forEach((les, lIdx) => {
        const lesId = `node-les-${les.id}`;
        const lessonOffsetRadius = 140;
        const subSpread = 0.5;
        const subAngle = angle - subSpread / 2 + (lIdx / Math.max(1, chap.lessons.length - 1 || 1)) * subSpread;
        const lesX = chapX + Math.cos(subAngle) * lessonOffsetRadius;
        const lesY = chapY + Math.sin(subAngle) * lessonOffsetRadius;

        newNodes.push({
          id: lesId,
          chapterId: chap.id,
          lessonId: les.id,
          label: les.title,
          type: 'lesson',
          lessonType: les.type,
          x: lesX,
          y: lesY,
          color: chapColor
        });

        newConns.push({
          id: `conn-chap-les-${chap.id}-${les.id}`,
          fromId: chapId,
          toId: lesId,
          style: 'solid'
        });
      });
    });

    setNodes(newNodes);
    setConnections(newConns);
  }, [chapters, courseTitle]);

  // Handle Dragging of Canvas Node
  const handlePointerDown = (e: React.PointerEvent, nodeId: string) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setDraggedNodeId(nodeId);
    const targetNode = nodes.find((n) => n.id === nodeId);
    if (targetNode && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: (e.clientX - rect.left) / zoom - targetNode.x,
        y: (e.clientY - rect.top) / zoom - targetNode.y
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedNodeId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newX = (e.clientX - rect.left) / zoom - dragOffset.x;
    const newY = (e.clientY - rect.top) / zoom - dragOffset.y;

    setNodes((prev) =>
      prev.map((n) => (n.id === draggedNodeId ? { ...n, x: Math.max(20, newX), y: Math.max(20, newY) } : n))
    );
  };

  const handlePointerUp = () => {
    setDraggedNodeId(null);
  };

  // Drag-and-Drop from palette directly onto the Canvas
  const handleDropOnCanvas = (e: React.DragEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const rawType = e.dataTransfer.getData('application/json');
    const rect = containerRef.current.getBoundingClientRect();
    const dropX = (e.clientX - rect.left) / zoom;
    const dropY = (e.clientY - rect.top) / zoom;

    // Create a new topic chapter or lesson
    const newChapId = `chap-${Date.now()}`;
    const newChapterTitle = `Module ${chapters.length + 1} : Nouveau Concept`;
    const newLessonId = `les-${Date.now()}`;
    const newLessonTitle = 'Leçon 1 : Introduction & Démonstration';

    const newChapter: Chapter = {
      id: newChapId,
      title: newChapterTitle,
      description: 'Nouveau module généré via le Mind Map Canvas',
      lessons: [
        {
          id: newLessonId,
          title: newLessonTitle,
          durationMinutes: 15,
          type: (rawType as Lesson['type']) || activePaletteType,
          content: 'Contenu interactif créé par glisser-déposer sur la carte mentale.'
        }
      ]
    };

    const updated = [...chapters, newChapter];
    onUpdateChapters(updated);

    // Add nodes to canvas
    const rootNode = nodes.find((n) => n.type === 'root') || nodes[0];
    const chapNodeId = `node-chap-${newChapId}`;
    const lesNodeId = `node-les-${newLessonId}`;
    const assignedColor = CHAPTER_COLORS[updated.length % CHAPTER_COLORS.length];

    const newNodesList: MindMapTopicNode[] = [
      ...nodes,
      {
        id: chapNodeId,
        chapterId: newChapId,
        label: newChapterTitle,
        type: 'chapter',
        x: dropX,
        y: dropY,
        color: assignedColor
      },
      {
        id: lesNodeId,
        chapterId: newChapId,
        lessonId: newLessonId,
        label: newLessonTitle,
        type: 'lesson',
        lessonType: (rawType as Lesson['type']) || activePaletteType,
        x: dropX + 120,
        y: dropY + 70,
        color: assignedColor
      }
    ];

    const newConnsList: MindMapConnection[] = [
      ...connections,
      {
        id: `conn-${Date.now()}-1`,
        fromId: rootNode ? rootNode.id : chapNodeId,
        toId: chapNodeId,
        style: 'glowing'
      },
      {
        id: `conn-${Date.now()}-2`,
        fromId: chapNodeId,
        toId: lesNodeId,
        style: 'solid'
      }
    ];

    setNodes(newNodesList);
    setConnections(newConnsList);
    setSelectedNodeId(chapNodeId);
  };

  // Add child lesson to selected node
  const handleAddChildToSelected = () => {
    if (!selectedNodeId) return;
    const targetNode = nodes.find((n) => n.id === selectedNodeId);
    if (!targetNode || targetNode.type === 'root') return;

    const chapId = targetNode.chapterId;
    const targetChap = chapters.find((c) => c.id === chapId);
    if (!targetChap) return;

    const newLessonId = `les-${Date.now()}`;
    const newLessonTitle = `Leçon ${targetChap.lessons.length + 1} : Sous-Thème Connecté`;

    const newLesson: Lesson = {
      id: newLessonId,
      title: newLessonTitle,
      durationMinutes: 15,
      type: activePaletteType,
      content: 'Nouveau sujet lié.'
    };

    const updated = chapters.map((c) =>
      c.id === chapId ? { ...c, lessons: [...c.lessons, newLesson] } : c
    );
    onUpdateChapters(updated);

    const lesNodeId = `node-les-${newLessonId}`;
    setNodes((prev) => [
      ...prev,
      {
        id: lesNodeId,
        chapterId: chapId,
        lessonId: newLessonId,
        label: newLessonTitle,
        type: 'lesson',
        lessonType: activePaletteType,
        x: targetNode.x + 130 + (Math.random() * 40 - 20),
        y: targetNode.y + 70 + (Math.random() * 40 - 20),
        color: targetNode.color
      }
    ]);

    setConnections((prev) => [
      ...prev,
      {
        id: `conn-${Date.now()}`,
        fromId: targetNode.id,
        toId: lesNodeId,
        style: 'glowing'
      }
    ]);
  };

  // Delete node
  const handleDeleteSelected = () => {
    if (!selectedNodeId) return;
    const target = nodes.find((n) => n.id === selectedNodeId);
    if (!target || target.type === 'root') return;

    if (target.type === 'chapter') {
      const updated = chapters.filter((c) => c.id !== target.chapterId);
      onUpdateChapters(updated);
      setNodes((prev) => prev.filter((n) => n.chapterId !== target.chapterId));
      setConnections((prev) =>
        prev.filter((conn) => {
          const from = nodes.find((n) => n.id === conn.fromId);
          const to = nodes.find((n) => n.id === conn.toId);
          return from?.chapterId !== target.chapterId && to?.chapterId !== target.chapterId;
        })
      );
    } else if (target.type === 'lesson' && target.lessonId) {
      const updated = chapters.map((c) =>
        c.id === target.chapterId
          ? { ...c, lessons: c.lessons.filter((l) => l.id !== target.lessonId) }
          : c
      );
      onUpdateChapters(updated);
      setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
      setConnections((prev) =>
        prev.filter((conn) => conn.fromId !== selectedNodeId && conn.toId !== selectedNodeId)
      );
    }
    setSelectedNodeId(null);
  };

  // Auto-organize Mind Map in dynamic radial tree
  const handleAutoAlign = () => {
    const root = nodes.find((n) => n.type === 'root');
    const rootX = 480;
    const rootY = 260;
    const chapNodes = nodes.filter((n) => n.type === 'chapter');

    const updatedNodes = nodes.map((node) => {
      if (node.type === 'root') return { ...node, x: rootX, y: rootY };
      if (node.type === 'chapter') {
        const cIdx = chapNodes.findIndex((cn) => cn.id === node.id);
        const angle = (cIdx / Math.max(1, chapNodes.length)) * 2 * Math.PI - Math.PI / 2;
        const radius = 230;
        return {
          ...node,
          x: rootX + Math.cos(angle) * radius,
          y: rootY + Math.sin(angle) * radius
        };
      }
      if (node.type === 'lesson') {
        const parentChapNode = nodes.find((n) => n.chapterId === node.chapterId && n.type === 'chapter');
        if (!parentChapNode) return node;
        const siblings = nodes.filter((n) => n.chapterId === node.chapterId && n.type === 'lesson');
        const sIdx = siblings.findIndex((sn) => sn.id === node.id);
        const cIdx = chapNodes.findIndex((cn) => cn.chapterId === node.chapterId);
        const angle = (cIdx / Math.max(1, chapNodes.length)) * 2 * Math.PI - Math.PI / 2;
        const subAngle = angle - 0.4 + (sIdx / Math.max(1, siblings.length - 1 || 1)) * 0.8;
        return {
          ...node,
          x: parentChapNode.x + Math.cos(subAngle) * 140,
          y: parentChapNode.y + Math.sin(subAngle) * 140
        };
      }
      return node;
    });

    setNodes(updatedNodes);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div
      id="interactive-curriculum-mindmap"
      className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[750px] select-none relative"
    >
      {/* 1. TOP MIND MAP CONTROL BAR */}
      <div className="h-14 px-5 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-white">Mind Map du Curriculum Pédagogique</h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Interactif 2D
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Glissez-déposez des modules, réorganisez les nœuds et visualisez les transitions d’apprentissage.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoAlign}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all active:scale-95"
            title="Auto-réaligner en arbre radial"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Auto-Aligner</span>
          </button>

          <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
              className="p-1 hover:text-white text-slate-400"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-bold px-2 text-slate-300">
              {(zoom * 100).toFixed(0)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.6, z + 0.1))}
              className="p-1 hover:text-white text-slate-400"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE WITH DRAGGABLE PALETTE & CANVAS */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT PALETTE: DRAGGABLE NODES */}
        <div className="w-64 bg-slate-900/90 border-r border-slate-800 p-4 flex flex-col gap-3 shrink-0 z-10">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Palette de Nœuds (Glisser)</span>
          </span>

          {/* Palette Draggable Item: Nano Banana */}
          <div
            draggable
            onDragStart={(e) => e.dataTransfer.setData('application/json', 'animated_nano_banana')}
            onClick={() => setActivePaletteType('animated_nano_banana')}
            className={`p-3 rounded-2xl border cursor-grab active:cursor-grabbing transition-all ${
              activePaletteType === 'animated_nano_banana'
                ? 'bg-purple-950/80 border-purple-500 shadow-md text-white'
                : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-purple-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🍌</span>
              <div>
                <div className="text-xs font-black">Micro-Cours Nano Banana</div>
                <div className="text-[10px] text-slate-400">Animation 2D & Tableau</div>
              </div>
            </div>
          </div>

          {/* Palette Draggable Item: Code Workshop */}
          <div
            draggable
            onDragStart={(e) => e.dataTransfer.setData('application/json', 'interactive_code')}
            onClick={() => setActivePaletteType('interactive_code')}
            className={`p-3 rounded-2xl border cursor-grab active:cursor-grabbing transition-all ${
              activePaletteType === 'interactive_code'
                ? 'bg-indigo-950/80 border-indigo-500 shadow-md text-white'
                : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-indigo-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <div>
                <div className="text-xs font-black">Atelier de Code Live</div>
                <div className="text-[10px] text-slate-400">Sandbox & Exercices</div>
              </div>
            </div>
          </div>

          {/* Palette Draggable Item: Article & Guide */}
          <div
            draggable
            onDragStart={(e) => e.dataTransfer.setData('application/json', 'article')}
            onClick={() => setActivePaletteType('article')}
            className={`p-3 rounded-2xl border cursor-grab active:cursor-grabbing transition-all ${
              activePaletteType === 'article'
                ? 'bg-emerald-950/80 border-emerald-500 shadow-md text-white'
                : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-emerald-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs font-black">Synthèse & Guide</div>
                <div className="text-[10px] text-slate-400">Documentation & Diagrammes</div>
              </div>
            </div>
          </div>

          {/* Selected Node Actions Box */}
          {selectedNode && selectedNode.type !== 'root' && (
            <div className="mt-auto p-3.5 rounded-2xl bg-slate-950/90 border border-slate-700 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                Nœud Sélectionné :
              </div>
              <div className="text-xs font-extrabold text-white truncate">{selectedNode.label}</div>

              <div className="flex flex-col gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={handleAddChildToSelected}
                  className="w-full py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une Branche</span>
                </button>

                {selectedNode.type === 'lesson' && selectedNode.lessonId && onSelectLessonToEdit && (
                  <button
                    type="button"
                    onClick={() => onSelectLessonToEdit(selectedNode.chapterId, selectedNode.lessonId!)}
                    className="w-full py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-sm"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Ouvrir l’Éditeur Elementor</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  className="w-full py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-300 font-bold text-[11px] flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer ce Nœud</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CENTER INTERACTIVE SVG CANVAS */}
        <div
          ref={containerRef}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropOnCanvas}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={() => setSelectedNodeId(null)}
          className="flex-1 bg-slate-950 relative overflow-hidden cursor-crosshair select-none"
        >
          {/* Animated Background Mesh Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#4338ca_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

          <div
            className="w-full h-full relative origin-top-left transition-transform duration-75"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* SVG Connecting Branches with Glowing Energy Particles */}
            <svg className="absolute inset-0 w-[2000px] h-[2000px] overflow-visible pointer-events-none z-0">
              <defs>
                <linearGradient id="canvasBranchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818CF8" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#C084FC" stopOpacity="1" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.9" />
                </linearGradient>

                <filter id="branchGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {connections.map((conn) => {
                const fromNode = nodes.find((n) => n.id === conn.fromId);
                const toNode = nodes.find((n) => n.id === conn.toId);
                if (!fromNode || !toNode) return null;

                // Curved Bézier interpolation between coordinates
                const dx = toNode.x - fromNode.x;
                const dy = toNode.y - fromNode.y;
                const cx1 = fromNode.x + dx * 0.45;
                const cy1 = fromNode.y;
                const cx2 = fromNode.x + dx * 0.55;
                const cy2 = toNode.y;

                const pathD = `M ${fromNode.x} ${fromNode.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${toNode.x} ${toNode.y}`;

                return (
                  <g key={conn.id}>
                    {/* Glowing outer shadow */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={conn.style === 'glowing' ? '#A855F7' : '#4F46E5'}
                      strokeWidth={conn.style === 'glowing' ? 4.5 : 2.5}
                      strokeOpacity={0.4}
                      filter="url(#branchGlow)"
                    />

                    {/* Main stroke line */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="url(#canvasBranchGrad)"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                    />

                    {/* Animated Traveling Electron Particle */}
                    <circle r="3.5" fill="#38BDF8" filter="url(#branchGlow)">
                      <animateMotion path={pathD} dur="3s" repeatCount="indefinite" />
                    </circle>
                  </g>
                );
              })}
            </svg>

            {/* RENDER ALL MIND MAP TOPIC NODES */}
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isRoot = node.type === 'root';
              const isChapter = node.type === 'chapter';

              return (
                <motion.div
                  key={node.id}
                  onPointerDown={(e) => handlePointerDown(e, node.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNodeId(node.id);
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: isSelected ? 1.08 : 1,
                    opacity: 1,
                    boxShadow: isSelected
                      ? '0 0 25px rgba(168, 85, 247, 0.7)'
                      : '0 4px 15px rgba(0, 0, 0, 0.4)'
                  }}
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: 'spring', damping: 18 }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10 rounded-2xl backdrop-blur-md transition-colors ${
                    isRoot
                      ? 'p-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950 border-2 border-indigo-400 text-white min-w-[200px] max-w-[260px]'
                      : isChapter
                      ? isSelected
                        ? 'p-3 bg-gradient-to-r from-purple-900 to-slate-900 border-2 border-purple-400 text-white min-w-[170px] max-w-[220px]'
                        : 'p-3 bg-slate-900/90 border border-purple-500/50 text-slate-100 hover:border-purple-400 min-w-[170px] max-w-[220px]'
                      : isSelected
                      ? 'p-2.5 bg-gradient-to-r from-indigo-950 to-slate-900 border-2 border-indigo-400 text-white min-w-[150px] max-w-[200px]'
                      : 'p-2.5 bg-slate-900/85 border border-slate-700 text-slate-200 hover:border-indigo-400 min-w-[150px] max-w-[200px]'
                  }`}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`
                  }}
                >
                  <div className="flex items-center gap-2">
                    {/* Node Icon */}
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        isRoot
                          ? 'bg-amber-400 text-slate-950 font-black'
                          : isChapter
                          ? 'bg-purple-600 text-white'
                          : 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                      }`}
                    >
                      {isRoot ? (
                        <Brain className="w-3.5 h-3.5" />
                      ) : isChapter ? (
                        <Layers className="w-3.5 h-3.5" />
                      ) : node.lessonType === 'animated_nano_banana' ? (
                        <span className="text-[10px]">🍌</span>
                      ) : node.lessonType === 'interactive_code' ? (
                        <Code2 className="w-3 h-3 text-indigo-400" />
                      ) : (
                        <FileText className="w-3 h-3 text-emerald-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-xs text-white leading-tight truncate">
                        {node.label}
                      </div>
                      <div className="text-[9px] text-slate-400 font-medium">
                        {isRoot ? 'Nœud Principal' : isChapter ? 'Module Thématique' : 'Micro-Leçon'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
