import React from 'react';
import { Logo } from './Logo';
import { useCurrency } from '../../context/CurrencyContext';
import {
  Globe2,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Award,
  Sparkles,
  Bot,
  BookOpen,
  Layers,
  Users,
  Building2,
  ExternalLink,
  Heart,
  CheckCircle2,
  Coins,
  Send,
  Lock,
  FileText
} from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenCertVerifier?: () => void;
  onOpenUserGuide?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenCertVerifier, onOpenUserGuide }) => {
  const { currencyInfo } = useCurrency();

  return (
    <footer id="main-footer" className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 selection:bg-sky-500 selection:text-white">
      {/* Top Banner: Panafrican Innovation Callout */}
      <div className="border-b border-slate-800/80 bg-gradient-to-r from-sky-950/60 via-slate-900 to-sky-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  L'Académie Technologique Panafricaine Nouvelle Génération
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Formations certifiantes en IA, Fintech, Cloud & Cybersécurité avec Tuteur IA Multilingue (Lingala, Swahili, Wolof, Français).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigate('catalog')}
                className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-sky-500/20 active:scale-95 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explorer le Catalogue</span>
              </button>
              <button
                onClick={() => onNavigate('tuteur')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold text-xs sm:text-sm border border-slate-700 transition-all flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                <span>Tester le Tuteur IA</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & Sovereignty */}
          <div className="lg:col-span-2 space-y-4">
            <div className="cursor-pointer inline-block" onClick={() => onNavigate('home')}>
              <Logo size="md" showTagline={true} />
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Plateforme d'apprentissage et de certification d'élite conçue pour former la prochaine génération d'ingénieurs logiciels, chercheurs en IA et leaders fintech en Afrique et dans le monde.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-sky-950/80 text-sky-300 border border-sky-800/60">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                Certifications Officielles
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                Devise : {currencyInfo.name} ({currencyInfo.symbol})
              </span>
            </div>

            {/* Newsletter Input */}
            <div className="pt-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Newsletter Tech Panafricaine :
              </label>
              <form onSubmit={(e) => { e.preventDefault(); alert('Merci pour votre inscription à la newsletter Academia ITECH !'); }} className="flex items-center gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Votre adresse email..."
                  required
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>S'abonner</span>
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Multi-Campus Réseau */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Réseau Multi-Campus</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('centers')} className="hover:text-sky-300 transition-colors text-left">
                  🇨🇩 <strong>Kinshasa Campus</strong> (Silicon River)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('centers')} className="hover:text-sky-300 transition-colors text-left">
                  🇸🇳 <strong>Dakar Hub</strong> (IA & LLM Langues)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('centers')} className="hover:text-sky-300 transition-colors text-left">
                  🇨🇮 <strong>Abidjan Lab</strong> (Fintech & Cloud)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('centers')} className="hover:text-sky-300 transition-colors text-left">
                  🇷🇼 <strong>Kigali Academy</strong> (Smart Cities & IoT)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('centers')} className="text-sky-400 hover:underline pt-1 inline-flex items-center gap-1">
                  <span>Voir tous les campus</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Formations Clés */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>Cursus & Formations</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-sky-300 transition-colors text-left">
                  IA Générative & NLP Africain
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-sky-300 transition-colors text-left">
                  Fintech & APIs Mobile Money
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-sky-300 transition-colors text-left">
                  Cybersécurité Offensive & SOC
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-sky-300 transition-colors text-left">
                  Architecture Fullstack & Offline-First
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-sky-300 transition-colors text-left">
                  Data Science & Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Outils & Vérification */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Outils & Services</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('tuteur')} className="hover:text-sky-300 transition-colors text-left flex items-center gap-1">
                  <Bot className="w-3 h-3 text-sky-400" />
                  <span>Tuteur IA Multilingue 24/7</span>
                </button>
              </li>
              {onOpenUserGuide && (
                <li>
                  <button onClick={onOpenUserGuide} className="hover:text-sky-300 transition-colors text-left flex items-center gap-1 text-sky-300 font-semibold">
                    <FileText className="w-3 h-3 text-sky-400" />
                    <span>Manuel Utilisateur (PDF)</span>
                  </button>
                </li>
              )}
              <li>
                <button onClick={onOpenCertVerifier || (() => onNavigate('home'))} className="hover:text-sky-300 transition-colors text-left flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>Vérificateur de Diplôme QR</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profile')} className="hover:text-sky-300 transition-colors text-left">
                  Profil Apprenant & Mes Cours
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('permissions')} className="hover:text-sky-300 transition-colors text-left">
                  Matrice des Rôles (RBAC)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('studio')} className="hover:text-sky-300 transition-colors text-left">
                  Studio IA pour Formateurs
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© 2026 <strong>Academia ITECH</strong>. Tous droits réservés.</span>
            <span>•</span>
            <span className="text-slate-400">Kinshasa — Dakar — Abidjan — Kigali</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Systèmes 100% Opérationnels
            </span>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Conformité RGPD et Protection des Données Panafricaines'); }} className="hover:text-slate-300">
              Confidentialité & RGPD
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Conditions Générales d’Utilisation Academia ITECH'); }} className="hover:text-slate-300">
              CGU & Certifications
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
