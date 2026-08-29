import { UserRole } from '../types';
import {
  BookOpen,
  GraduationCap,
  Bot,
  Trophy,
  Award,
  Wand2,
  FileQuestion,
  UploadCloud,
  BarChart3,
  Building2,
  Users,
  CreditCard,
  Palette,
  ShieldCheck,
  Globe2,
  Sparkles,
  PlayCircle,
  LucideIcon,
  CheckCircle2
} from 'lucide-react';

export interface WorkflowStep {
  id: string;
  stepNumber: number;
  tabId: string;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  requiredPermission?: string;
  actionHint?: string;
}

export interface WorkflowTrack {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  targetRole: UserRole | 'all';
  icon: LucideIcon;
  colorScheme: 'indigo' | 'emerald' | 'blue' | 'amber' | 'slate';
  steps: WorkflowStep[];
}

export const WORKFLOW_TRACKS: WorkflowTrack[] = [
  // 1. Parcours Découverte & Candidats (Visitor)
  {
    id: 'track-visitor',
    title: 'Parcours Découverte & Orientation',
    shortTitle: 'Découverte',
    subtitle: 'Explorez l’académie, nos formations IA et vérifiez les diplômes officiels.',
    targetRole: 'all',
    icon: Globe2,
    colorScheme: 'slate',
    steps: [
      {
        id: 'vis-1',
        stepNumber: 1,
        tabId: 'home',
        label: 'Accueil',
        title: 'Vitrine Académique',
        description: 'Présentation de la plateforme, des filières technologiques et des campus affiliés.',
        icon: Globe2,
        actionHint: 'Découvrir la plateforme',
      },
      {
        id: 'vis-2',
        stepNumber: 2,
        tabId: 'catalog',
        label: 'Catalogue',
        title: 'Formations & Programmes',
        description: 'Consultez les programmes en IA Générative, Cybersécurité et Cloud DevOps.',
        icon: BookOpen,
        actionHint: 'Explorer les cursus',
      },
      {
        id: 'vis-3',
        stepNumber: 3,
        tabId: 'home',
        label: 'Vérification Diplôme',
        title: 'Registre Public Blockchain',
        description: 'Vérifiez en temps réel l’authenticité des certificats délivrés aux étudiants.',
        icon: Award,
        actionHint: 'Vérifier un certificat',
      },
      {
        id: 'vis-4',
        stepNumber: 4,
        tabId: 'permissions',
        label: 'Sécurité RBAC',
        title: 'Gouvernance & Droits',
        description: 'Auditez la matrice complète des rôles et permissions de sécurité.',
        icon: ShieldCheck,
        actionHint: 'Voir les permissions',
      },
    ],
  },

  // 2. Parcours Apprenant (Learning Cycle)
  {
    id: 'track-learner',
    title: 'Parcours d’Apprentissage Apprenant',
    shortTitle: 'Parcours Étudiant',
    subtitle: 'De l’inscription à la certification officielle et l’obtention de vos badges XP.',
    targetRole: 'learner',
    icon: GraduationCap,
    colorScheme: 'indigo',
    steps: [
      {
        id: 'lrn-1',
        stepNumber: 1,
        tabId: 'catalog',
        label: '1. Inscription',
        title: 'Explorer & Rejoindre',
        description: 'Sélectionnez votre cursus de spécialisation et intégrez la cohorte.',
        icon: BookOpen,
        actionHint: 'Choisir un cours',
      },
      {
        id: 'lrn-2',
        stepNumber: 2,
        tabId: 'player',
        label: '2. Suivi & Pratique',
        title: 'Lecteur Interactif & Code',
        description: 'Suivez les leçons vidéo, lisez les synthèses et exécutez du code en temps réel.',
        icon: PlayCircle,
        badge: 'Interactif',
        actionHint: 'Reprendre la leçon',
      },
      {
        id: 'lrn-3',
        stepNumber: 3,
        tabId: 'tuteur',
        label: '3. Tuteur IA AIDA',
        title: 'Coaching 24/7 & WhatsApp',
        description: 'Posez vos questions à l’IA pédagogique et recevez des rappels personnalisés.',
        icon: Bot,
        badge: 'WhatsApp',
        actionHint: 'Interroger AIDA',
      },
      {
        id: 'lrn-4',
        stepNumber: 4,
        tabId: 'my-learning',
        label: '4. Examen & Diplôme',
        title: 'Quiz & Certifications',
        description: 'Validez le QCM d’évaluation finale (score > 80%) et générez votre certificat officiel.',
        icon: Award,
        actionHint: 'Voir mes diplômes',
      },
      {
        id: 'lrn-5',
        stepNumber: 5,
        tabId: 'gamification',
        label: '5. Récompenses & XP',
        title: 'Boutique XP & Classement',
        description: 'Gagnez des points d’expérience, montez de niveau et débloquez des avantages exclusifs.',
        icon: Trophy,
        actionHint: 'Voir mon niveau',
      },
    ],
  },

  // 3. Workflow Formateur (Pedagogical Studio & Creation)
  {
    id: 'track-trainer',
    title: 'Workflow Création Pédagogique & Formateur',
    shortTitle: 'Studio Formateur',
    subtitle: 'Concevez, testez et publiez des cours interactifs propulsés par l’IA Gemini.',
    targetRole: 'trainer',
    icon: Sparkles,
    colorScheme: 'emerald',
    steps: [
      {
        id: 'trn-1',
        stepNumber: 1,
        tabId: 'studio',
        label: '1. Syllabus IA',
        title: 'Générateur de Cours IA',
        description: 'Définissez le sujet et laissez Gemini structurer chapitres, leçons et code d’exemple.',
        icon: Wand2,
        badge: 'Gemini',
        actionHint: 'Générer un syllabus',
      },
      {
        id: 'trn-2',
        stepNumber: 2,
        tabId: 'studio',
        label: '2. Quiz & Examens',
        title: 'Création des Évaluations',
        description: 'Générez des banques de questions à choix multiples avec justifications pédagogiques.',
        icon: FileQuestion,
        actionHint: 'Créer des quiz',
      },
      {
        id: 'trn-3',
        stepNumber: 3,
        tabId: 'catalog',
        label: '3. Publication',
        title: 'Déploiement Catalogue',
        description: 'Mettez en ligne le cours sur votre campus pour vos cohortes d’étudiants.',
        icon: UploadCloud,
        actionHint: 'Voir au catalogue',
      },
      {
        id: 'trn-4',
        stepNumber: 4,
        tabId: 'dashboard',
        label: '4. Suivi & Taux',
        title: 'Analytiques & Réussite',
        description: 'Supervisez la complétion des chapitres et les notes moyennes obtenues.',
        icon: BarChart3,
        actionHint: 'Analyser les cohortes',
      },
    ],
  },

  // 4. Workflow Direction Campus & Multi-Centres (Center Admin)
  {
    id: 'track-admin',
    title: 'Workflow Direction & Administration Campus',
    shortTitle: 'Gestion Campus',
    subtitle: 'Supervisez vos équipes, quotas d’étudiants et personnalisez la marque blanche.',
    targetRole: 'center_admin',
    icon: Building2,
    colorScheme: 'blue',
    steps: [
      {
        id: 'adm-1',
        stepNumber: 1,
        tabId: 'centers',
        label: '1. Dashboard Campus',
        title: 'Indicateurs Clés',
        description: 'Vue d’ensemble des inscriptions, cours actifs et taux de diplomation globale.',
        icon: BarChart3,
        actionHint: 'Voir les statistiques',
      },
      {
        id: 'adm-2',
        stepNumber: 2,
        tabId: 'centers',
        label: '2. Équipe Formateurs',
        title: 'Attribution & Gestion',
        description: 'Invitez des enseignants, assignez les matières et supervisez leur production.',
        icon: Users,
        actionHint: 'Gérer les formateurs',
      },
      {
        id: 'adm-3',
        stepNumber: 3,
        tabId: 'centers',
        label: '3. Quotas & Forfait',
        title: 'Abonnement & Licences',
        description: 'Ajustez votre plan (Starter / Pro / Enterprise) et surveillez le quota d’apprenants.',
        icon: CreditCard,
        actionHint: 'Gérer l’abonnement',
      },
      {
        id: 'adm-4',
        stepNumber: 4,
        tabId: 'centers',
        label: '4. Marque Blanche',
        title: 'Branding & Domaine',
        description: 'Personnalisez le logo, la couleur principale et le nom de domaine personnalisé.',
        icon: Palette,
        actionHint: 'Éditer le portail',
      },
    ],
  },

  // 5. Workflow Gouvernance & Sécurité (Super Admin)
  {
    id: 'track-governance',
    title: 'Workflow Gouvernance & Audit Multi-Centres',
    shortTitle: 'Gouvernance',
    subtitle: 'Contrôle universel du réseau, gestion des académies et matrice de permissions.',
    targetRole: 'super_admin',
    icon: ShieldCheck,
    colorScheme: 'amber',
    steps: [
      {
        id: 'gov-1',
        stepNumber: 1,
        tabId: 'centers',
        label: '1. Réseau Campus',
        title: 'Supervision Multi-Centres',
        description: 'Gestion globale des campus affiliés (Paris, Dakar, Casablanca, Montréal).',
        icon: Building2,
        actionHint: 'Superviser les centres',
      },
      {
        id: 'gov-2',
        stepNumber: 2,
        tabId: 'permissions',
        label: '2. Matrice RBAC',
        title: 'Politique de Sécurité',
        description: 'Gérer les 17 permissions système et les règles d’accès aux fonctionnalités.',
        icon: ShieldCheck,
        actionHint: 'Auditer les permissions',
      },
      {
        id: 'gov-3',
        stepNumber: 3,
        tabId: 'dashboard',
        label: '3. Métriques Réseau',
        title: 'Statistiques Globales',
        description: 'Volume total des diplômes émis et activité multi-établissements.',
        icon: BarChart3,
        actionHint: 'Voir le réseau',
      },
    ],
  },
];

export function getWorkflowTrackForRole(role: UserRole): WorkflowTrack {
  if (role === 'learner') return WORKFLOW_TRACKS[1];
  if (role === 'trainer') return WORKFLOW_TRACKS[2];
  if (role === 'center_admin') return WORKFLOW_TRACKS[3];
  if (role === 'super_admin') return WORKFLOW_TRACKS[4];
  return WORKFLOW_TRACKS[0]; // Visitor
}
