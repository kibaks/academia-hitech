import React, { useState } from 'react';
import { PresentationSlide } from '../../types';
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  FileText,
  Sparkles,
  Layers,
  HelpCircle,
  ExternalLink,
  Plus,
  Trash2
} from 'lucide-react';

interface PresentationPlayerProps {
  title?: string;
  presentationData?: {
    fileUrl?: string;
    fileName?: string;
    fileSize?: string;
    format?: 'pptx' | 'ppt' | 'pdf' | 'embed';
    embedUrl?: string;
    slideCount?: number;
    slides?: PresentationSlide[];
  };
  isEditable?: boolean;
  onUpdateSlides?: (slides: PresentationSlide[]) => void;
  className?: string;
}

export const PresentationPlayer: React.FC<PresentationPlayerProps> = ({
  title = 'Support de Présentation PowerPoint (PPTX)',
  presentationData,
  isEditable = false,
  onUpdateSlides,
  className = '',
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const slides: PresentationSlide[] =
    presentationData?.slides && presentationData.slides.length > 0
      ? presentationData.slides
      : [
          {
            title: 'Introduction & Objectifs Pédagogiques',
            content: '• Présentation des concepts fondamentaux\n• Architecture et vue d\'ensemble\n• Résultats attendus en fin de session',
            speakerNotes: 'Insister sur les cas pratiques et les standards industriels actuels.',
          },
          {
            title: 'Architecture & Modèle Conceptuel',
            content: '• Décomposition en modules indépendants\n• Gestion des flux de données asynchrones\n• Bonnes pratiques de sécurité et de résilience',
            speakerNotes: 'Détailler les diagrammes de séquence avec les étudiants.',
          },
          {
            title: 'Synthèse & Prochaines Étapes',
            content: '• Résumé des 3 points clés à mémoriser\n• Travaux pratiques et exercices d\'application\n• Validation des acquis par mini-quiz',
            speakerNotes: 'Préparer les étudiants à l\'atelier pratique qui suit immédiatement.',
          },
        ];

  const totalSlides = slides.length;
  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlideIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fileName = presentationData?.fileName || `${title.replace(/\s+/g, '_')}.pptx`;
    
    // If fileUrl is a data URL, trigger download
    if (presentationData?.fileUrl && presentationData.fileUrl.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = presentationData.fileUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Mock / direct download trigger
      const blob = new Blob(
        [
          `# ${title}\n\n` +
            slides
              .map(
                (s, i) =>
                  `## Diapositive ${i + 1} : ${s.title}\n${s.content}\n\n*Notes du présentateur :* ${s.speakerNotes || 'N/A'}\n\n---`
              )
              .join('\n\n')
        ],
        { type: 'text/markdown;charset=utf-8' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName.replace(/\.pptx$/i, '')}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950 p-4 sm:p-8 flex flex-col justify-between'
          : `bg-slate-950 border border-slate-800 shadow-xl ${className}`
      }`}
    >
      {/* Top Presentation Bar */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Presentation className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-white truncate">{title}</h4>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 font-bold uppercase border border-amber-800/60">
                {presentationData?.format?.toUpperCase() || 'PPTX'}
              </span>
              <span>
                {presentationData?.fileName || 'support_officiel_cours.pptx'}
              </span>
              {presentationData?.fileSize && <span>• {presentationData.fileSize}</span>}
            </div>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          {currentSlide.speakerNotes && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowNotes(!showNotes);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                showNotes
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Afficher les notes d'animation"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Notes</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDownload}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Télécharger la présentation"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Télécharger</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
            title={isFullscreen ? 'Quitter plein écran' : 'Plein écran'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Main Slide Viewer Canvas */}
      <div className="relative flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 p-5 sm:p-8 flex flex-col justify-between min-h-[340px] sm:min-h-[400px]">
        {/* If an external embed URL is provided (Office Online / Google Slides) */}
        {presentationData?.embedUrl ? (
          <div className="w-full h-full min-h-[380px] rounded-xl overflow-hidden bg-black">
            <iframe
              src={presentationData.embedUrl}
              title={title}
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div>
        ) : (
          <>
            {/* Slide Stage Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Slide {currentSlideIndex + 1} / {totalSlides}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  Academia ITECH • Module Pédagogique
                </span>
              </div>
              <div className="text-[11px] font-bold text-slate-400">
                {Math.round(((currentSlideIndex + 1) / totalSlides) * 100)}% visualisé
              </div>
            </div>

            {/* Slide Main Content Box */}
            <div className="my-auto py-6 space-y-4 max-w-2xl mx-auto w-full">
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                {currentSlide.title}
              </h3>

              {currentSlide.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-800 max-h-56">
                  <img
                    src={currentSlide.imageUrl}
                    alt={currentSlide.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed font-sans bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 shadow-inner">
                {currentSlide.content}
              </div>
            </div>

            {/* Presenter Notes Box (Collapsible) */}
            {showNotes && currentSlide.speakerNotes && (
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs mb-3 space-y-1 animate-fadeIn">
                <div className="font-bold flex items-center gap-1.5 text-amber-300 text-[11px] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Notes Pédagogiques du Formateur :</span>
                </div>
                <p className="leading-relaxed opacity-90">{currentSlide.speakerNotes}</p>
              </div>
            )}

            {/* Slide Navigation Footbar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 gap-3">
              <button
                type="button"
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Précédent</span>
              </button>

              {/* Slide Dots / Indicator */}
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] sm:max-w-none py-1">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlideIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentSlideIndex
                        ? 'w-6 bg-amber-400 shadow-xs'
                        : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                    title={`Aller à la diapositive ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-amber-950/40"
              >
                <span className="hidden sm:inline">Suivant</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Slide Thumbnails Tray (for quick jump) */}
      {!presentationData?.embedUrl && totalSlides > 1 && (
        <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
          {slides.map((slide, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlideIndex(idx);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold shrink-0 transition-all text-left max-w-[140px] truncate ${
                idx === currentSlideIndex
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span className="opacity-60 block text-[8px] uppercase">Slide {idx + 1}</span>
              <span className="truncate block">{slide.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
