import React, { useState } from 'react';
import { Course, Center, UserRole } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import {
  Sparkles,
  Award,
  BookOpen,
  Bot,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Search,
  Star,
  Clock,
  Code2,
  Terminal,
  Zap,
  Globe2,
  Lock,
  Smartphone,
  ChevronRight,
  Play,
  CreditCard,
  Coins
} from 'lucide-react';

interface VisitorHomeProps {
  courses: Course[];
  centers: Center[];
  onOpenAuth: (mode: 'login' | 'register', defaultRole?: UserRole) => void;
  onExploreCatalog: () => void;
  onSelectCourse: (course: Course) => void;
  onVerifyCert: () => void;
  onViewPermissions: () => void;
}

export const VisitorHome: React.FC<VisitorHomeProps> = ({
  courses,
  centers,
  onOpenAuth,
  onExploreCatalog,
  onSelectCourse,
  onVerifyCert,
  onViewPermissions,
}) => {
  const { formatPrice, currencyInfo } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [certSearchId, setCertSearchId] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [certVerifiedResult, setCertVerifiedResult] = useState<{
    found: boolean;
    data?: any;
  } | null>(null);

  // Subscription plans baseline in USD
  const SUBSCRIPTIONS = {
    learnerFree: { monthly: 0, annual: 0 },
    learnerPro: { monthly: 19, annual: 15 },
    centerPro: { monthly: 750, annual: 600 },
  };

  const handleQuickCertVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certSearchId.trim()) return;

    if (certSearchId.toUpperCase().includes('8941') || certSearchId.toUpperCase().includes('ITECH')) {
      setCertVerifiedResult({
        found: true,
        data: {
          number: certSearchId.toUpperCase(),
          learner: 'Landry K.',
          course: 'Masterclass IA Générative, LLMs & Agents Autonomes',
          grade: '96%',
          distinction: 'Mention Très Bien',
          date: '20 août 2026',
          center: 'ITECH Campus Paris',
          issuer: 'Dr. Elena Rostova & Collège Académique ITECH',
        },
      });
    } else {
      setCertVerifiedResult({
        found: true,
        data: {
          number: certSearchId.toUpperCase(),
          learner: 'Étudiant Certifié ITECH',
          course: 'Architecture Fullstack & Cloud DevOps',
          grade: '92%',
          distinction: 'Mention Bien',
          date: '15 juillet 2026',
          center: 'Dakar AI & Cyber Institute',
          issuer: 'Collège Académique International ITECH',
        },
      });
    }
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="visitor-homepage-root" className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-4 sm:pt-8 pb-12">
        {/* Soft background accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-sky-700 text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Plateforme E-Learning Technologique Propulsée par l’IA</span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            <span className="text-slate-500 font-normal">Édition 2026</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Formez-vous aux métiers du futur avec{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-600 to-sky-600">
              l'Intelligence Artificielle
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Parcours certifiants en IA, Cybersécurité et Cloud. Bénéficiez d’un <strong>tuteur virtuel AIDA synchronisé sur WhatsApp</strong>,
            d’un <strong>Studio IA de création</strong> pour formateurs, et de <strong>diplômes officiels vérifiés</strong> sur la blockchain ITECH.
          </p>

          {/* Interactive Search / CTA Box */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="p-2 rounded-2xl bg-white border border-slate-200 shadow-md flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher : IA, Prompting, Python, Pentest, React 19..."
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>
              <button
                onClick={onExploreCatalog}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center gap-2 shadow-xs shadow-sky-500/20 active:scale-95 transition-all"
              >
                <span>Explorer le Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => onOpenAuth('register', 'learner')}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-sky-500 hover:bg-sky-400 text-white shadow-xs shadow-sky-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Créer un Compte Apprenant Gratuit</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-sky-600" />
                <span>Se Connecter / Comptes Démo</span>
              </button>
              <button
                onClick={onViewPermissions}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>Voir le Système de Permissions (RBAC)</span>
              </button>
            </div>
          </div>

          {/* Key Metrics Stats Ticker */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-sky-600">98.4%</div>
              <div className="text-xs font-medium text-slate-500 mt-1">Taux de réussite certifiée</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">+10,000</div>
              <div className="text-xs font-medium text-slate-500 mt-1">Apprenants actifs</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">45+</div>
              <div className="text-xs font-medium text-slate-500 mt-1">Centres & Campus affiliés</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">24/7</div>
              <div className="text-xs font-medium text-slate-500 mt-1">Tuteur IA & Bot WhatsApp</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ROLE ORIENTATION & ACCESS SYSTEM */}
      <section className="max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Écosystème Rôles & Permissions</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Une plateforme adaptée à chaque acteur de la formation
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Que vous soyez étudiant, formateur chevronné ou directeur d'un établissement d'enseignement supérieur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Apprenant */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                  Pour les Apprenants
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">Apprendre, Pratiquer & Valider</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Accédez à des cours interactifs avec éditeur de code, recevez l'aide de l'IA AIDA sur WhatsApp et décrochez vos diplômes certifiants.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Lecteur de cours avec code interactif & vidéos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Assistance IA WhatsApp 24h/24 & rappels de révision</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Certificat officiel téléchargeable et imprimable</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onOpenAuth('register', 'learner')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white transition-all shadow-xs shadow-sky-500/20 active:scale-95"
            >
              Rejoindre en tant qu'Apprenant
            </button>
          </div>

          {/* Card 2: Formateur */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Pour les Formateurs
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">Studio IA de Génération de Cours</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Concevez des programmes complets, des leçons structurées et des banques de QCMs interactifs en quelques secondes grâce à Gemini AI.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Génération automatique de syllabus & contenu riche</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Créateur de Quiz avec explications détaillées</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Publication immédiate sur le catalogue du centre</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onOpenAuth('login', 'trainer')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs active:scale-95"
            >
              Accéder au Studio IA Formateur
            </button>
          </div>

          {/* Card 3: Centres & Entreprises */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                  Centres & Universités
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">Gestion Multi-Centres Marque Blanche</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Déployez votre propre portail de formation avec votre logo, domaine sur-mesure, gestion d'équipe et suivi analytique des cohortes.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Portail personnalisé (Logo, Couleurs, Sous-domaine)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Gestion des formateurs et quotas d'étudiants</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Tableaux de bord de performance et taux de complétion</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onOpenAuth('login', 'center_admin')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs active:scale-95"
            >
              Espace Administrateur Campus
            </button>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COURSES SHOWCASE & SPOTLIGHT */}
      <section className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Programme Phare à la Une
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Formation en Avant-Plan & Programmes d'Excellence
            </h2>
          </div>
          <button
            onClick={onExploreCatalog}
            className="text-xs font-bold text-sky-600 hover:text-sky-500 flex items-center gap-1 group"
          >
            <span>Voir l'ensemble des formations ({courses.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Highlight Spotlight Foreground Course Banner */}
        {courses.length > 0 && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white border border-slate-700/60 shadow-xl p-6 sm:p-8 lg:p-10">
            {/* Ambient decorative glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left description column */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-sky-500 text-white shadow-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Formation en Avant-Plan
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/10 backdrop-blur-xs">
                    {courses[0].level}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    Certificat Professionnel Inclus
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight break-words">
                  {courses[0].title}
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {courses[0].description}
                </p>

                {/* Instructor & Metadata row */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-slate-300 border-t border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <img
                      src={courses[0].authorAvatar}
                      alt={courses[0].authorName}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80';
                      }}
                      className="w-10 h-10 rounded-2xl object-cover ring-2 ring-sky-400"
                    />
                    <div>
                      <span className="font-bold text-white block">{courses[0].authorName}</span>
                      <span className="text-[11px] text-sky-300">{courses[0].authorRole}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{courses[0].rating}</span>
                    <span className="text-slate-400 text-xs font-normal">({courses[0].reviewCount} avis certifiés)</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Users className="w-4 h-4 text-sky-400" />
                    <span>{courses[0].studentCount} apprenants inscrits</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-4 h-4 text-teal-400" />
                    <span>{courses[0].durationHours}h de formation immersive</span>
                  </div>
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => onSelectCourse(courses[0])}
                    className="px-6 py-3 rounded-2xl text-sm font-bold bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/30 flex items-center gap-2 transform active:scale-95 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Rejoindre la formation</span>
                  </button>
                  <button
                    onClick={() => onSelectCourse(courses[0])}
                    className="px-5 py-3 rounded-2xl text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs flex items-center gap-2 transition-all"
                  >
                    <BookOpen className="w-4 h-4 text-slate-300" />
                    <span>Consulter le syllabus complet</span>
                  </button>
                </div>
              </div>

              {/* Right featured image column */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl group bg-slate-900">
                  <img
                    src={courses[0].thumbnail}
                    alt={courses[0].title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80';
                    }}
                    className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-semibold text-white bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-xl border border-white/20">
                        {courses[0].chapters?.length || 4} Modules d'ingénierie
                      </span>
                      <span className="text-xs font-bold text-sky-300 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-xl border border-sky-400/30 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        Accrédité ITECH
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other courses grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredCourses.slice(1, 4).map((course) => (
            <div
              key={course.id}
              className="rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-white/90 backdrop-blur-md text-slate-800 shadow-xs">
                      {course.category.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {course.durationHours}h
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {course.studentCount} inscrits
                    </span>
                    <span>•</span>
                    <span className="text-sky-600 font-semibold">{course.level}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug break-words">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {course.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {course.skillsGained.slice(0, 3).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-700 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={course.authorAvatar}
                    alt={course.authorName}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80';
                    }}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  />
                  <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">
                    {course.authorName}
                  </span>
                </div>

                <button
                  onClick={() => onSelectCourse(course)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-50 hover:bg-sky-500 hover:text-white text-sky-700 border border-sky-200 transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3" />
                  <span>Aperçu du cours</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SUBSCRIPTIONS & PRICING PLANS (DYNAMIC CONFIGURATION) */}
      <section className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold">
            <Coins className="w-3.5 h-3.5 text-sky-500" />
            <span>Devise sélectionnée : {currencyInfo.flag} {currencyInfo.name} ({currencyInfo.code})</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Formules d'Abonnement Simples & Transparentes
          </h2>
          <p className="text-sm text-slate-600">
            Choisissez la formule adaptée à vos ambitions professionnelles ou à l'échelle de votre centre de formation.
          </p>

          {/* Monthly / Annual Billing Toggle */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold mt-2">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Facturation Mensuelle
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Facturation Annuelle</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${billingCycle === 'annual' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Gratuit */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase text-slate-500">Découverte</span>
              <div className="text-3xl font-bold text-slate-900">
                {formatPrice(0)}
                <span className="text-xs text-slate-500 font-normal ml-1">/ à vie</span>
              </div>
              <p className="text-xs text-slate-600">Accédez aux modules d'introduction et explorez le catalogue.</p>
              <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Accès aux premiers chapitres gratuits</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Éditeur de code interactif basique</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Accès au catalogue public</div>
              </div>
            </div>
            <button
              onClick={() => onOpenAuth('register', 'learner')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all active:scale-95"
            >
              Commencer Gratuitement
            </button>
          </div>

          {/* Card 2: Pass Apprenant Pro */}
          <div className="p-6 rounded-3xl bg-white border-2 border-sky-500 shadow-md flex flex-col justify-between space-y-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-sky-500 text-white uppercase shadow-xs shadow-sky-500/20">
              Recommandé Apprenants
            </div>
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase text-sky-600">Pass Apprenant Pro</span>
              <div className="text-3xl font-bold text-slate-900 flex items-baseline gap-1">
                <span>{formatPrice(billingCycle === 'monthly' ? SUBSCRIPTIONS.learnerPro.monthly : SUBSCRIPTIONS.learnerPro.annual)}</span>
                <span className="text-xs text-slate-500 font-normal">/ mois</span>
              </div>
              <p className="text-xs text-slate-600">Tout illimité avec tuteur WhatsApp 24/7 et certifications officielles.</p>
              <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Accès complet à 100% des cours</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Tuteur IA AIDA illimité sur WhatsApp</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Diplômes & Certificats Blockchain vérifiés</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Mode hors-ligne & résumés IA</div>
              </div>
            </div>
            <button
              onClick={() => onOpenAuth('register', 'learner')}
              className="w-full py-3 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white shadow-xs shadow-sky-500/20 active:scale-95 transition-all"
            >
              S'abonner au Pass Pro
            </button>
          </div>

          {/* Card 3: Licence Campus / Centre */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase text-slate-700">Licence Établissement</span>
              <div className="text-3xl font-bold text-slate-900 flex items-baseline gap-1">
                <span>{formatPrice(billingCycle === 'monthly' ? SUBSCRIPTIONS.centerPro.monthly : SUBSCRIPTIONS.centerPro.annual)}</span>
                <span className="text-xs text-slate-500 font-normal">/ mois</span>
              </div>
              <p className="text-xs text-slate-600">Solution clé-en-main en marque blanche pour instituts et universités.</p>
              <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Jusqu'à 1 000 apprenants inclus</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Studio IA Formateurs illimité</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Marque blanche (Logo & Sous-domaine)</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Émission illimitée de certificats sécurisés</div>
              </div>
            </div>
            <button
              onClick={() => onOpenAuth('login', 'center_admin')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all active:scale-95"
            >
              Déployer un Campus
            </button>
          </div>
        </div>
      </section>

      {/* 5. VERIFY CERTIFICATE PUBLIC TOOL */}
      <section className="max-w-5xl mx-auto rounded-3xl bg-slate-900 text-white p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Vérification d’Authenticité Publique</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Certificats Officiels Vérifiés sur la Blockchain ITECH
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Chaque diplôme émis par Academia ITECH ou nos centres affiliés dispose d’un identifiant unique et d’un QR Code infalsifiable, consultable par les recruteurs et entreprises partenaires.
            </p>

            <form onSubmit={handleQuickCertVerify} className="space-y-3 pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={certSearchId}
                  onChange={(e) => setCertSearchId(e.target.value)}
                  placeholder="Ex : ITECH-CERT-2026-8941"
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-800/90 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-xs flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Vérifier</span>
                </button>
              </div>
              <span className="text-[11px] text-slate-400 block">
                Astuce : Testez avec l’identifiant exemple <code className="text-amber-300">ITECH-CERT-2026-8941</code>
              </span>
            </form>
          </div>

          <div className="lg:col-span-6">
            {certVerifiedResult?.found ? (
              <div className="p-5 rounded-2xl bg-slate-800 border border-amber-500/40 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Certificat Authentique & Valide
                  </span>
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                    {certVerifiedResult.data.number}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-slate-400 text-[11px]">Bénéficiaire :</div>
                  <div className="text-white font-bold text-sm">{certVerifiedResult.data.learner}</div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-slate-400 text-[11px]">Formation certifiante :</div>
                  <div className="text-slate-200 font-semibold">{certVerifiedResult.data.course}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-700">
                    <span className="text-slate-400 block">Score / Mention :</span>
                    <span className="text-amber-400 font-bold">{certVerifiedResult.data.grade} ({certVerifiedResult.data.distinction})</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-700">
                    <span className="text-slate-400 block">Délivré par :</span>
                    <span className="text-slate-300 font-semibold truncate block">{certVerifiedResult.data.center}</span>
                  </div>
                </div>

                <button
                  onClick={onVerifyCert}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                >
                  Afficher le Certificat Complet Imprimable
                </button>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 text-center space-y-3">
                <Award className="w-12 h-12 text-amber-400/80 mx-auto" />
                <h4 className="text-sm font-bold text-white">Registre Public des Certifications</h4>
                <p className="text-xs text-slate-400">
                  Entrez le numéro présent au bas d'un diplôme pour certifier les compétences et le score d'un lauréat.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. PARTNER CENTERS & CAMPUS NETWORK */}
      <section className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Réseau Académique International</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Des campus connectés à travers le monde
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Découvrez les établissements partenaires qui utilisent la technologie Academia ITECH pour former leurs promotions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {centers.map((center) => (
            <div
              key={center.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-sky-300 transition-all space-y-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={center.logo}
                  alt={center.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{center.name}</h3>
                  <span className="text-[11px] text-slate-500">{center.customDomain || `${center.slug}.academia-itech.com`}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {center.description}
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                <div className="p-2 rounded-xl bg-slate-50">
                  <div className="text-xs font-bold text-slate-900">{center.studentsCount}</div>
                  <div className="text-[10px] text-slate-500">Étudiants</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <div className="text-xs font-bold text-slate-900">{center.trainers.length}</div>
                  <div className="text-[10px] text-slate-500">Formateurs</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <div className="text-xs font-bold text-sky-600 uppercase font-bold">{center.subscriptionPlan}</div>
                  <div className="text-[10px] text-slate-500">Plan Campus</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CALL TO ACTION FOOTER BANNER */}
      <section className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 text-white p-8 sm:p-12 text-center space-y-6 shadow-xl">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Prêt à accélérer votre carrière technologique ?
        </h2>
        <p className="text-xs sm:text-sm text-sky-100 max-w-2xl mx-auto leading-relaxed">
          Inscrivez-vous gratuitement dès aujourd'hui pour explorer les modules, interagir avec AIDA sur WhatsApp et rejoindre notre communauté d'experts.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onOpenAuth('register', 'learner')}
            className="px-6 py-3 rounded-xl text-sm font-bold bg-white text-sky-900 hover:bg-slate-50 shadow-md active:scale-95 transition-all"
          >
            Créer mon Compte Gratuitement
          </button>
          <button
            onClick={() => onOpenAuth('login')}
            className="px-6 py-3 rounded-xl text-sm font-bold bg-sky-700/80 hover:bg-sky-700 text-white border border-sky-300/40 shadow-xs active:scale-95 transition-all"
          >
            Se Connecter / Démo Rapide
          </button>
        </div>
      </section>
    </div>
  );
};
