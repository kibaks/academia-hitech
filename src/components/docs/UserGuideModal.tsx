import React, { useState } from 'react';
import {
  X,
  Download,
  BookOpen,
  Printer,
  Sparkles,
  Bot,
  Award,
  ShieldCheck,
  Building2,
  HelpCircle,
  Layers,
  ChevronRight,
  Search,
  CheckCircle2,
  FileText,
  Maximize2,
  ExternalLink,
  ChevronLeft,
  Smartphone,
  Laptop,
  Check,
  Coins,
} from 'lucide-react';
import { generateUserGuidePDF } from '../../lib/pdfGuideGenerator';
import { GUIDE_SCREENSHOTS, GuideScreenshotItem } from '../../assets/images/guideScreenshots';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [zoomedImage, setZoomedImage] = useState<GuideScreenshotItem | null>(null);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      await generateUserGuidePDF();
    } catch (err) {
      console.error('Erreur génération PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.open('/api/documentation/html', '_blank');
  };

  const sections = [
    { id: 'home', title: '1. Accueil & Portail Public', icon: Layers, screenshotKey: 'home' },
    { id: 'roles', title: '2. Matrice de Sécurité RBAC', icon: ShieldCheck, screenshotKey: 'permissions' },
    { id: 'learner', title: '3. Catalogue des Formations', icon: BookOpen, screenshotKey: 'catalog' },
    { id: 'player', title: '4. Lecteur Multimédia & Cours', icon: FileText, screenshotKey: 'player' },
    { id: 'quiz', title: '5. Quiz & Évaluations QCM', icon: Award, screenshotKey: 'quiz' },
    { id: 'certificate', title: '6. Diplôme & QR Code Infalsifiable', icon: CheckCircle2, screenshotKey: 'certificate' },
    { id: 'gamification', title: '7. Gamification & ITECH Coins', icon: Sparkles, screenshotKey: 'gamification' },
    { id: 'tutor', title: '8. Tuteur Virtuel IA & Mascotte', icon: Bot, screenshotKey: 'tutor' },
    { id: 'whatsapp', title: '9. Robot WhatsApp (+1 555-631-6001)', icon: Smartphone, screenshotKey: 'whatsapp' },
    { id: 'trainer', title: '10. Studio Formateur IA Gemini', icon: Laptop, screenshotKey: 'studio' },
    { id: 'curriculum', title: '11. Éditeur de Curriculum Visuel', icon: FileText, screenshotKey: 'curriculum' },
    { id: 'tracker', title: '12. Suivi de Promotion & Émargement', icon: Check, screenshotKey: 'tracker' },
    { id: 'centers', title: '13. Gestion Multi-Centres Campus', icon: Building2, screenshotKey: 'centers' },
    { id: 'currencies', title: '14. Multi-Devises (USD / FC)', icon: Coins, screenshotKey: 'currencies' },
    { id: 'faq', title: '15. FAQ & Support Officiel', icon: HelpCircle, screenshotKey: null },
  ];

  const currentSectionIdx = sections.findIndex((s) => s.id === activeSection);
  const currentSection = sections[currentSectionIdx] || sections[0];

  const goToNextSection = () => {
    if (currentSectionIdx < sections.length - 1) {
      setActiveSection(sections[currentSectionIdx + 1].id);
    }
  };

  const goToPrevSection = () => {
    if (currentSectionIdx > 0) {
      setActiveSection(sections[currentSectionIdx - 1].id);
    }
  };

  // Helper component to render a screenshot with macOS-style chrome and zoom trigger
  const renderScreenshotCard = (item: GuideScreenshotItem) => {
    return (
      <div className="space-y-4 my-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-900 overflow-hidden shadow-md group relative">
          {/* Window Chrome Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-800/90 border-b border-slate-700/60">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              <span className="ml-2 text-[10px] font-mono text-slate-400 truncate max-w-[200px] sm:max-w-md">
                academia-itech.org/{item.id}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30">
                {item.badge}
              </span>
              <button
                type="button"
                onClick={() => setZoomedImage(item)}
                className="p-1 rounded-lg bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600 transition-colors"
                title="Agrandir la capture d'écran"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Screenshot Image Container */}
          <div
            onClick={() => setZoomedImage(item)}
            className="cursor-pointer relative overflow-hidden group-hover:opacity-95 transition-opacity"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-auto object-cover max-h-[380px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="px-3 py-1.5 rounded-xl bg-slate-950/80 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Cliquer pour agrandir</span>
              </span>
            </div>
          </div>

          {/* Caption & Quick Highlights */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="text-slate-300 font-medium">
              <strong className="text-white">{item.title}</strong>
              <p className="text-[11px] text-slate-400 mt-0.5">{item.subtitle}</p>
            </div>
            <button
              onClick={() => setZoomedImage(item)}
              className="shrink-0 text-sky-400 hover:text-sky-300 text-[11px] font-bold flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Voir en plein écran</span>
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Highlight Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {item.highlights.map((highlight, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 p-2.5 rounded-xl bg-sky-50/60 border border-sky-100 text-xs text-slate-700"
            >
              <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>

        {/* Clear & Sharp Explanations */}
        <div className="mt-4 pt-3 border-t border-slate-200">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Explications Claires et Procédure Pas à Pas :</span>
          </h4>
          <div className="space-y-2">
            {item.explanationSteps.map((step) => (
              <div
                key={step.step}
                className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-sky-300 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-xs text-slate-900">{step.title}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-6xl h-[95vh] sm:h-[92vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          {/* Header Modal */}
          <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 border-b border-slate-200 bg-slate-50/90 shrink-0 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black shadow-md shadow-sky-600/20 shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h3 className="text-xs sm:text-base font-bold text-slate-900 truncate">
                    Manuel & Guide Utilisateur
                  </h3>
                  <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold border border-sky-200 shrink-0">
                    PDF A4
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 truncate hidden xs:block">
                  14 scénarios réels illustrés • Version A4 officielle
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={handlePrint}
                type="button"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors shadow-xs"
                title="Ouvrir la version imprimable A4 prête pour export PDF"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Imprimer A4</span>
              </button>

              <button
                id="modal-header-download-pdf-btn"
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                type="button"
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/20 active:scale-95 transition-all shrink-0"
                title="Télécharger le manuel complet en PDF A4"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>{isGenerating ? 'Génération...' : 'Télécharger PDF'}</span>
              </button>

              <button
                onClick={onClose}
                type="button"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Main Grid Content */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
            {/* Left Sidebar Navigation (Desktop only) */}
            <div className="hidden md:flex md:col-span-4 border-r border-slate-200 bg-slate-50/50 p-4 flex-col gap-2 overflow-y-auto shrink-0">
              <div className="relative mb-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une section..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                />
              </div>

              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mt-1">
                Sommaire du Guide (15 Chapitres)
              </div>

              <div className="space-y-1 overflow-y-auto">
                {sections
                  .filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    const hasScreenshot = !!section.screenshotKey;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        type="button"
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-colors ${
                          isActive
                            ? 'bg-sky-600 text-white shadow-xs font-bold'
                            : 'text-slate-700 hover:bg-slate-200/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                          <span className="truncate">{section.title}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {hasScreenshot && (
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                                isActive ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-600'
                              }`}
                              title="Contient une capture d'écran"
                            >
                              IMG
                            </span>
                          )}
                          <ChevronRight
                            className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`}
                          />
                        </div>
                      </button>
                    );
                  })}
              </div>

              {/* Bottom Card for Full Document */}
              <div className="mt-auto pt-3 border-t border-slate-200">
                <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-[11px] text-sky-900 space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-600" />
                    <span>Guide A4 Complet (12 pages)</span>
                  </div>
                  <p className="text-sky-800 text-[10px] leading-relaxed">
                    Téléchargez le manuel intégral prêt pour impression avec toutes les captures d'écran et la table des matières officielle.
                  </p>
                  <div className="flex gap-1.5 pt-1">
                    <button
                      onClick={handleDownloadPDF}
                      type="button"
                      className="flex-1 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] transition-colors flex items-center justify-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Télécharger PDF</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      type="button"
                      className="py-1.5 px-2.5 rounded-lg bg-white border border-sky-300 text-sky-700 font-bold text-[10px] hover:bg-sky-100 transition-colors"
                      title="Imprimer"
                    >
                      <Printer className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Main Viewer Panel */}
            <div className="col-span-1 md:col-span-8 p-3.5 sm:p-6 overflow-y-auto text-slate-800 space-y-4 sm:space-y-6">
              {/* Mobile Chapter Selector (Visible only on mobile) */}
              <div className="md:hidden space-y-1.5 p-3 rounded-2xl bg-sky-50/90 border border-sky-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-sky-950 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                    <span>Sommaire : Chapitre {currentSectionIdx + 1}/15</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-200/70 text-sky-900 font-bold">
                    {currentSection.screenshotKey ? 'Illustré' : 'Texte'}
                  </span>
                </div>
                <select
                  id="mobile-chapter-select"
                  value={activeSection}
                  onChange={(e) => setActiveSection(e.target.value)}
                  className="w-full py-2 px-2.5 rounded-xl bg-white border border-sky-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
                >
                  {sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.title}
                    </option>
                  ))}
                </select>
              </div>
              {/* Dynamic rendering of all 14 scenarios with real screenshots */}
              {currentSection.screenshotKey && GUIDE_SCREENSHOTS[currentSection.screenshotKey] ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
                    {React.createElement(currentSection.icon, { className: "w-4 h-4" })}
                    <span>{currentSection.title}</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {GUIDE_SCREENSHOTS[currentSection.screenshotKey].title}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {GUIDE_SCREENSHOTS[currentSection.screenshotKey].subtitle}
                  </p>

                  {renderScreenshotCard(GUIDE_SCREENSHOTS[currentSection.screenshotKey])}
                </div>
              ) : activeSection === "faq" ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4" />
                    <span>Chapitre 15 : FAQ & Support Officiel</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Foire Aux Questions & Guide de Dépannage
                  </h2>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="font-bold text-xs text-slate-900 mb-1">
                        Q : Que faire si le robot WhatsApp ne répond pas immédiatement ?
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Assurez-vous d'avoir enregistré le numéro complet avec le code pays (+1 555-631-6001). Si la connexion mobile est faible, le tuteur web reste accessible en continu dans votre navigateur.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="font-bold text-xs text-slate-900 mb-1">
                        Q : Comment un employeur peut-il vérifier mon certificat ?
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Il lui suffit de pointer son smartphone vers le <strong>QR Code</strong> figurant sur le document pour être dirigé vers la page sécurisée attestant de l'authenticité de votre diplôme.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="font-bold text-xs text-slate-900 mb-1">
                        Q : Comment recharger mes ITECH Coins ?
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Les pièces s'obtiennent naturellement en réussissant les quiz et en complétant les leçons quotidiennes, ou peuvent être converties via nos passerelles de paiement locales (M-Pesa, Cartes).
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs">
                    <div className="font-bold text-sky-900">Assistance Pédagogique & Technique :</div>
                    <p className="text-[11px] text-sky-800 mt-1">
                      Email : <strong>support@academia-itech.cd</strong> • Direction : <strong>direction@academia-itech.cd</strong><br />
                      Monitoring Cloudflare : <a href="https://patient-pine-7b82.landrykibakweto123.workers.dev/" target="_blank" rel="noreferrer" className="underline font-bold">patient-pine-7b82.workers.dev</a>
                    </p>
                  </div>
                </div>
              ) : null}


              {/* Navigation Footer for Chapters */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={goToPrevSection}
                  disabled={currentSectionIdx === 0}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    currentSectionIdx === 0
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Chapitre Précédent</span>
                </button>

                <div className="text-[11px] text-slate-400 font-medium">
                  {currentSectionIdx + 1} / {sections.length}
                </div>

                <button
                  type="button"
                  onClick={goToNextSection}
                  disabled={currentSectionIdx === sections.length - 1}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    currentSectionIdx === sections.length - 1
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-sky-700 hover:bg-sky-50 font-bold'
                  }`}
                >
                  <span>Chapitre Suivant</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Footer Bar */}
          <div className="hidden md:flex px-6 py-2.5 border-t border-slate-200 bg-slate-50 items-center justify-between text-xs text-slate-500 shrink-0">
            <div>
              <span>Édition Illustrée 2026</span> • <span className="text-slate-400">Direction Pédagogique Academia ITECH</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                type="button"
                className="hover:text-slate-800 text-[11px] flex items-center gap-1 font-medium"
              >
                <ExternalLink className="w-3 h-3 text-slate-400" />
                <span>Ouvrir URL /api/documentation/html</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                type="button"
                className="font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Guide_Utilisateur_Academia_ITECH.pdf</span>
              </button>
            </div>
          </div>

          {/* Dedicated Mobile Sticky Action Bar */}
          <div className="md:hidden px-3.5 py-2.5 border-t border-slate-200 bg-white/95 backdrop-blur-md shadow-lg flex items-center justify-between gap-2 shrink-0">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">Guide Officiel A4</div>
              <div className="text-[10px] text-slate-500 truncate">14 scénarios réels illustrés</div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handlePrint}
                type="button"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
                title="Imprimer / Plein écran"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                id="modal-mobile-bottom-download-btn"
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/20 active:scale-95 transition-all"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>{isGenerating ? 'En cours...' : 'Télécharger PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Modal for Screenshots */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-60 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Lightbox Top Bar */}
            <div className="px-5 py-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">{zoomedImage.title}</h4>
                <span className="text-xs text-sky-400">{zoomedImage.badge}</span>
              </div>
              <button
                onClick={() => setZoomedImage(null)}
                className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lightbox Full Size Image */}
            <div className="p-3 bg-slate-950 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img
                src={zoomedImage.image}
                alt={zoomedImage.title}
                className="max-h-[70vh] w-auto object-contain rounded-xl shadow-lg border border-slate-800"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Lightbox Bottom Explanation */}
            <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <span>{zoomedImage.subtitle}</span>
              <button
                onClick={() => setZoomedImage(null)}
                className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
