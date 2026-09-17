import React, { useState } from 'react';
import { UserRole, PermissionKey } from '../../types';
import {
  ALL_PERMISSIONS,
  ROLE_PERMISSIONS_MAP,
  ROLE_DETAILS,
  hasPermission
} from '../../lib/permissions';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Lock,
  Sparkles,
  GraduationCap,
  Building2,
  UserCheck,
  Globe2,
  Filter,
  Info,
  Code2,
  Award,
  Bot,
  Zap,
  Users
} from 'lucide-react';

interface PermissionsMatrixViewProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onOpenAuthModal?: () => void;
}

export const PermissionsMatrixView: React.FC<PermissionsMatrixViewProps> = ({
  currentRole,
  onSelectRole,
  onOpenAuthModal,
}) => {
  const [activeViewTab, setActiveViewTab] = useState<'matrix' | 'visitor_requirements'>('visitor_requirements');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterQuery, setFilterQuery] = useState<string>('');

  const categories = [
    'all',
    'Général & Découverte',
    'Apprentissage & Évaluation',
    'Création & Studio IA',
    'Administration Centre',
    'Super Gouvernance',
  ];

  const rolesOrder: UserRole[] = ['visitor', 'learner', 'trainer', 'center_admin', 'super_admin'];

  // Detailed Identification of all aspects requiring login/account creation
  const AUTH_REQUIREMENTS_SPECS = [
    {
      id: 'player_and_code',
      title: 'Lecteur Interactif & Exécution de Code',
      icon: Code2,
      category: 'Apprentissage',
      visitorVisibility: 'Aperçu découverte limité (Leçon 1 d\'introduction uniquement)',
      visitorHidden: 'Leçons suivantes, console d\'exécution de code interactif, terminal Docker/Python, notes personnelles et téléchargement des supports',
      requiresAuth: true,
      requiredRole: 'learner',
      reason: 'Nécessite une session utilisateur pour sauvegarder l\'état du terminal de code, l\'avancement des leçons et la progression horaire.',
    },
    {
      id: 'enrollment_and_tracking',
      title: 'Inscription aux Formations & Sauvegarde de Progression',
      icon: GraduationCap,
      category: 'Apprentissage',
      visitorVisibility: 'Fiche descriptive du cours, objectifs et compétences cibles',
      visitorHidden: 'Inscription officielle, affectation à une cohorte, historique de progression et taux de complétion',
      requiresAuth: true,
      requiredRole: 'learner',
      reason: 'L\'inscription lie l\'étudiant à son campus, enregistre ses dates de début et suit son éligibilité à l\'examen final.',
    },
    {
      id: 'quizzes_and_exams',
      title: 'Évaluations, Checkpoints & Examens Certifiants',
      icon: CheckCircle2,
      category: 'Évaluation',
      visitorVisibility: 'Information sur l\'existence de l\'épreuve (seuil requis, ex. 80%)',
      visitorHidden: 'Passage effectif des QCMs chronométrés, correction détaillée, enregistrement des scores et validation des modules',
      requiresAuth: true,
      requiredRole: 'learner',
      reason: 'Les notes obtenues doivent être rattachées à un dossier étudiant authentifié pour garantir la validité académique.',
    },
    {
      id: 'certificates',
      title: 'Diplômes & Certificats Officiels Blockchain',
      icon: Award,
      category: 'Certification',
      visitorVisibility: 'Outil de vérification publique par identifiant de certificat existant',
      visitorHidden: 'Génération nominative, téléchargement du PDF officiel haute définition, QR code infalsifiable lié à l\'étudiant',
      requiresAuth: true,
      requiredRole: 'learner',
      reason: 'Un certificat officiel est strictement nominatif et requiert la vérification de l\'identité de l\'apprenant.',
    },
    {
      id: 'ai_tutor_whatsapp',
      title: 'Tuteur Virtuel AIDA & Synchronisation WhatsApp',
      icon: Bot,
      category: 'Assistance IA',
      visitorVisibility: 'Présentation de la technologie AIDA et simulation d\'exemple de prompt',
      visitorHidden: 'Historique continu des conversations IA, contexte personnalisé du cours en cours, déclenchement des rappels d\'étude et vocaux sur WhatsApp',
      requiresAuth: true,
      requiredRole: 'learner',
      reason: 'Le tuteur analyse les lacunes spécifiques de l\'étudiant et doit être connecté à son numéro WhatsApp ou son profil.',
    },
    {
      id: 'gamification_and_rewards',
      title: 'Système Gamification, Badges XP & Boutique Récompenses',
      icon: Zap,
      category: 'Gamification',
      visitorVisibility: 'Présentation publique du programme de fidélité et aperçu des niveaux',
      visitorHidden: 'Cumul de points XP par leçon terminée (+50 XP), flamme de streak journalière, déblocage des badges et échange de récompenses',
      requiresAuth: true,
      requiredRole: 'learner',
      reason: 'Les points XP et badges sont des actifs d\'apprentissage personnels conservés dans le portefeuille de l\'étudiant.',
    },
    {
      id: 'campus_community',
      title: 'Campus Social & Espace Communauté Étudiante',
      icon: Users,
      category: 'Communauté',
      visitorVisibility: 'Aperçu d\'accroche avec flou de protection de la vie privée',
      visitorHidden: 'Mur des publications, commentaires, entraide sur les exercices, profils complets des camarades et messagerie privée',
      requiresAuth: true,
      requiredRole: 'learner',
      reason: 'Protection de la vie privée des étudiants et sécurisation des échanges internes au campus.',
    },
    {
      id: 'creation_studio',
      title: 'Studio IA de Création & Éditeur Elementor/Animaker',
      icon: Sparkles,
      category: 'Enseignement',
      visitorVisibility: 'Présentation des capacités de création pour formateurs',
      visitorHidden: 'Accès au générateur Gemini de cours, éditeur de plans, studio vidéo Animaker 2D, publication au catalogue',
      requiresAuth: true,
      requiredRole: 'trainer',
      reason: 'Réservé aux formateurs et auteurs certifiés habilités par la direction de l\'établissement.',
    },
    {
      id: 'campus_management',
      title: 'Gestion de Campus, Formateurs & Devises Monétaires',
      icon: Building2,
      category: 'Administration',
      visitorVisibility: 'Liste des campus partenaires sur la page d\'accueil',
      visitorHidden: 'Gestion des invitations de formateurs, quotas étudiants, personnalisation marque blanche, taux de change FX et forfaits',
      requiresAuth: true,
      requiredRole: 'center_admin',
      reason: 'Données administratives et financières hautement sensibles réservées aux directeurs d\'établissement et super-admins.',
    },
  ];

  const filteredPermissions = ALL_PERMISSIONS.filter((perm) => {
    const matchesCategory = selectedCategory === 'all' || perm.category === selectedCategory;
    const matchesSearch =
      perm.label.toLowerCase().includes(filterQuery.toLowerCase()) ||
      perm.description.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="permissions-matrix-root" className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Sécurité & Contrôle d'Accès (RBAC)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Matrice des Rôles & Système de Permissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Organisation hiérarchique et granulaire des droits d'accès pour chaque rôle au sein de l'écosystème Academia ITECH.
          </p>
        </div>

        {/* Current Active Role Banner */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            {currentRole === 'visitor' && <Globe2 className="w-5 h-5" />}
            {currentRole === 'learner' && <GraduationCap className="w-5 h-5" />}
            {currentRole === 'trainer' && <Sparkles className="w-5 h-5" />}
            {currentRole === 'center_admin' && <Building2 className="w-5 h-5" />}
            {currentRole === 'super_admin' && <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Votre Rôle Actif :</span>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>{ROLE_DETAILS[currentRole].title}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${ROLE_DETAILS[currentRole].badgeStyle}`}>
                {ROLE_DETAILS[currentRole].badgeLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="view-tab-visitor-reqs"
            onClick={() => setActiveViewTab('visitor_requirements')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeViewTab === 'visitor_requirements'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4 text-indigo-600" />
            <span>Exigences de Connexion : Visiteur vs Compte Connecté</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-100 text-indigo-800 font-extrabold">9 Aspects</span>
          </button>

          <button
            type="button"
            id="view-tab-matrix"
            onClick={() => setActiveViewTab('matrix')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeViewTab === 'matrix'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-slate-500" />
            <span>Matrice RBAC Globale (5 Rôles)</span>
          </button>
        </div>

        {onOpenAuthModal && (
          <button
            onClick={onOpenAuthModal}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Tester les Profils Démo</span>
          </button>
        )}
      </div>

      {activeViewTab === 'visitor_requirements' ? (
        /* SECTION: ALL ASPECTS REQUIRING ACCOUNT CREATION / VISITOR RESTRICTIONS */
        <div className="space-y-6">
          {/* Summary Warning Banner for Visitor Mode */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/50 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Spécification Fonctionnelle & Sécuritaire des Accès</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  Pourquoi toutes les informations ne sont pas affichées en mode visiteur ?
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Le mode visiteur offre une <strong>vitrine publique de découverte</strong> (parcours du catalogue, aperçu du syllabus et vérification de diplômes). En revanche, l'accès aux cours complets, l'exécution de code, les évaluations chronométrées, la certification officielle et le tuteur WhatsApp exigent la création d'un compte étudiant ou formateur vérifié.
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2">
                <div className="p-3 rounded-2xl bg-white/10 border border-white/15 text-center">
                  <div className="text-lg font-black text-amber-400">9 Domaines</div>
                  <div className="text-[10px] text-slate-300">Contrôlés par Compte</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cards of 9 Aspects requiring Login / Account Creation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AUTH_REQUIREMENTS_SPECS.map((spec) => {
              const Icon = spec.icon;
              return (
                <div
                  key={spec.id}
                  id={`spec-card-${spec.id}`}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider">
                        Compte Requis
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                        {spec.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight mt-0.5">
                        {spec.title}
                      </h3>
                    </div>

                    {/* What is visible in visitor mode */}
                    <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                      <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Visible en mode Visiteur :</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-snug pl-5">
                        {spec.visitorVisibility}
                      </p>
                    </div>

                    {/* What is hidden / restricted */}
                    <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1">
                      <div className="text-[11px] font-bold text-rose-800 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>Masqué & Réservé au Compte :</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-snug pl-5">
                        {spec.visitorHidden}
                      </p>
                    </div>

                    {/* Reason */}
                    <p className="text-[11px] text-slate-500 leading-relaxed italic border-t border-slate-100 pt-2">
                      <strong>Justification :</strong> {spec.reason}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Rôle minimum :</span>
                    <span className="font-bold text-slate-800">
                      {ROLE_DETAILS[spec.requiredRole as UserRole]?.title || spec.requiredRole}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* SECTION: RBAC PERMISSIONS TABLE */
        <>
          {/* Rôles Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {rolesOrder.map((r) => {
              const info = ROLE_DETAILS[r];
              const isCurrent = currentRole === r;
              const permCount = ROLE_PERMISSIONS_MAP[r].length;

              return (
                <button
                  key={r}
                  onClick={() => onSelectRole(r)}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between space-y-3 ${
                    isCurrent
                      ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${info.badgeStyle}`}>
                        {info.badgeLabel}
                      </span>
                      {isCurrent && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-indigo-200 animate-ping" />
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-slate-900">{info.title}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                      {info.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 font-medium">{permCount} / {ALL_PERMISSIONS.length} privilèges</span>
                    <span className={`font-bold ${isCurrent ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {isCurrent ? 'Rôle Actuel' : 'Simuler'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-1 mr-1 flex-shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'Toutes les permissions' : cat}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Rechercher une permission..."
              className="w-full sm:w-64 px-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Permissions Matrix Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <th className="py-3.5 px-4 font-bold w-2/5">Permission & Fonctionnalité</th>
                    <th className="py-3.5 px-3 text-center font-bold">Visiteur</th>
                    <th className="py-3.5 px-3 text-center font-bold">Apprenant</th>
                    <th className="py-3.5 px-3 text-center font-bold">Formateur</th>
                    <th className="py-3.5 px-3 text-center font-bold">Directeur</th>
                    <th className="py-3.5 px-3 text-center font-bold text-amber-900">Super Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPermissions.map((perm) => (
                    <tr key={perm.key} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{perm.label}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                              {perm.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">{perm.description}</p>
                        </div>
                      </td>

                      {rolesOrder.map((role) => {
                        const granted = hasPermission(role, perm.key);
                        const isCurrentCol = currentRole === role;

                        return (
                          <td
                            key={role}
                            className={`py-3 px-3 text-center ${
                              isCurrentCol ? 'bg-indigo-50/40' : ''
                            }`}
                          >
                            {granted ? (
                              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400 border border-slate-200">
                                <XCircle className="w-4 h-4" />
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Information Box */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-xs text-indigo-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold">Politique de Sécurité & RBAC Dynamique</h4>
          <p className="text-slate-600 leading-relaxed">
            Le système applique strictement les permissions au niveau des composants et des contrôles de navigation.
            Vous pouvez basculer de rôle à tout moment à l'aide du sélecteur en haut à droite pour tester en temps réel chaque interface et valider les accès.
          </p>
        </div>
      </div>
    </div>
  );
};
