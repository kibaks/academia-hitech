import { UserRole, PermissionKey, PermissionDefinition } from '../types';

export const ALL_PERMISSIONS: PermissionDefinition[] = [
  // 1. Général & Découverte
  {
    key: 'view_landing',
    label: 'Visiter la page d’accueil',
    category: 'Général & Découverte',
    description: 'Accéder à la vitrine publique, présentation des filières et centres partenaires.',
  },
  {
    key: 'view_catalog',
    label: 'Consulter le catalogue de formations',
    category: 'Général & Découverte',
    description: 'Parcourir les filières (IA, Cybersécurité, Cloud, Web), filtres et moteurs de recherche.',
  },
  {
    key: 'preview_course',
    label: 'Aperçu du programme de cours',
    category: 'Général & Découverte',
    description: 'Voir la table des matières, les compétences ciblées et les détails du cursus.',
  },

  // 2. Apprentissage & Évaluation
  {
    key: 'enroll_course',
    label: 'S’inscrire aux cours',
    category: 'Apprentissage & Évaluation',
    description: 'Rejoindre une cohorte de formation et suivre sa progression.',
  },
  {
    key: 'access_player',
    label: 'Lecteur interactif & leçons vidéo/code',
    category: 'Apprentissage & Évaluation',
    description: 'Suivre les cours en vidéo, exécuter du code interactif et télécharger les ressources.',
  },
  {
    key: 'take_quiz',
    label: 'Passer les évaluations & Quiz certifiants',
    category: 'Apprentissage & Évaluation',
    description: 'Effectuer les QCMs chronométrés et valider les compétences acquises.',
  },
  {
    key: 'earn_certificate',
    label: 'Génération & Vérification de certificats officiels',
    category: 'Apprentissage & Évaluation',
    description: 'Obtenir un diplôme numérique sécurisé par QR code et imprimable en haute définition.',
  },
  {
    key: 'access_ai_tutor',
    label: 'Tuteur Virtuel AIDA & Rappels WhatsApp',
    category: 'Apprentissage & Évaluation',
    description: 'Bénéficier de l’assistance pédagogique IA personnalisée 24/7 sur web et WhatsApp.',
  },
  {
    key: 'access_gamification',
    label: 'Gamification, Badges, Niveaux & Boutique XP',
    category: 'Apprentissage & Évaluation',
    description: 'Gagner des points XP, monter de niveau, débloquer des trophées et échanger des récompenses.',
  },

  // 3. Création & Studio IA
  {
    key: 'access_ai_studio',
    label: 'Accès au Studio IA de Création',
    category: 'Création & Studio IA',
    description: 'Utiliser l’IA pour concevoir des plans de cours, générer du contenu pédagogique et des quiz.',
  },
  {
    key: 'create_and_publish_course',
    label: 'Publier des cours dans le catalogue',
    category: 'Création & Studio IA',
    description: 'Déployer de nouvelles formations accessibles aux étudiants du centre.',
  },

  // 4. Administration Centre
  {
    key: 'manage_trainers',
    label: 'Gestion de l’équipe de formateurs',
    category: 'Administration Centre',
    description: 'Inviter, assigner des cours et superviser la performance des enseignants.',
  },
  {
    key: 'edit_center_branding',
    label: 'Personnalisation Marque Blanche',
    category: 'Administration Centre',
    description: 'Configurer le nom, logo, couleur primaire et sous-domaine du campus.',
  },
  {
    key: 'manage_subscriptions',
    label: 'Gestion des quotas & Abonnements Campus',
    category: 'Administration Centre',
    description: 'Gérer les plans d’adhésion (Starter, Pro, Enterprise) et limites d’étudiants.',
  },
  {
    key: 'view_center_analytics',
    label: 'Analytiques de réussite du centre',
    category: 'Administration Centre',
    description: 'Visualiser les taux de complétion, scores aux quiz et activité globale.',
  },

  // 5. Super Gouvernance
  {
    key: 'manage_all_centers',
    label: 'Supervision globale Multi-Centres',
    category: 'Super Gouvernance',
    description: 'Gouvernance globale sur l’ensemble des académies, universités et campus affiliés.',
  },
  {
    key: 'manage_permissions_matrix',
    label: 'Administration de la matrice des permissions',
    category: 'Super Gouvernance',
    description: 'Ajuster les droits d’accès, rôles système et politiques de sécurité.',
  },
];

export const ROLE_PERMISSIONS_MAP: Record<UserRole, PermissionKey[]> = {
  visitor: [
    'view_landing',
    'view_catalog',
    'preview_course',
  ],
  learner: [
    'view_landing',
    'view_catalog',
    'preview_course',
    'enroll_course',
    'access_player',
    'take_quiz',
    'earn_certificate',
    'access_ai_tutor',
    'access_gamification',
  ],
  trainer: [
    'view_landing',
    'view_catalog',
    'preview_course',
    'enroll_course',
    'access_player',
    'take_quiz',
    'earn_certificate',
    'access_ai_tutor',
    'access_gamification',
    'access_ai_studio',
    'create_and_publish_course',
    'view_center_analytics',
  ],
  center_admin: [
    'view_landing',
    'view_catalog',
    'preview_course',
    'enroll_course',
    'access_player',
    'take_quiz',
    'earn_certificate',
    'access_ai_tutor',
    'access_gamification',
    'access_ai_studio',
    'create_and_publish_course',
    'manage_trainers',
    'edit_center_branding',
    'manage_subscriptions',
    'view_center_analytics',
  ],
  super_admin: [
    'view_landing',
    'view_catalog',
    'preview_course',
    'enroll_course',
    'access_player',
    'take_quiz',
    'earn_certificate',
    'access_ai_tutor',
    'access_gamification',
    'access_ai_studio',
    'create_and_publish_course',
    'manage_trainers',
    'edit_center_branding',
    'manage_subscriptions',
    'view_center_analytics',
    'manage_all_centers',
    'manage_permissions_matrix',
  ],
};

export const ROLE_DETAILS: Record<
  UserRole,
  {
    title: string;
    badgeLabel: string;
    badgeStyle: string;
    description: string;
    typicalUsers: string;
    colorTheme: string;
  }
> = {
  visitor: {
    title: 'Visiteur Public',
    badgeLabel: 'Non Connecté',
    badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
    description: 'Accès public libre pour découvrir les programmes, centres partenaires et offres de formation.',
    typicalUsers: 'Candidats, curieux, nouveaux visiteurs avant inscription.',
    colorTheme: 'slate',
  },
  learner: {
    title: 'Apprenant / Étudiant',
    badgeLabel: 'Étudiant Certifiant',
    badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'Accès complet au parcours d’apprentissage, joueur interactif, examens, tuteur AIDA et obtention de certificats officiels.',
    typicalUsers: 'Étudiants en informatique, ingénieurs en reconversion, professionnels en formation continue.',
    colorTheme: 'indigo',
  },
  trainer: {
    title: 'Formateur / Enseignant',
    badgeLabel: 'Formateur & Auteur',
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Accès au Studio IA de création de cours, conception de quiz avec Gemini, suivi des apprenants et publication de cours.',
    typicalUsers: 'Professeurs d’université, experts industriels certifiés, consultants formateurs.',
    colorTheme: 'emerald',
  },
  center_admin: {
    title: 'Directeur de Centre',
    badgeLabel: 'Administrateur Campus',
    badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Supervision globale de l’établissement, gestion de l’équipe de formateurs, personnalisation de la marque blanche et quotas campus.',
    typicalUsers: 'Directeurs pédagogiques, gérants de centres de formation, recteurs d’académies.',
    colorTheme: 'blue',
  },
  super_admin: {
    title: 'Super Administrateur ITECH',
    badgeLabel: 'Gouvernance Globale',
    badgeStyle: 'bg-amber-50 text-amber-800 border-amber-300',
    description: 'Contrôle total sur l’infrastructure multi-centres, gestion de la matrice de permissions et supervision globale du réseau.',
    typicalUsers: 'Équipe dirigeante Academia ITECH, administrateurs système.',
    colorTheme: 'amber',
  },
};

export function hasPermission(role: UserRole | undefined, permissionKey: PermissionKey): boolean {
  if (!role) return ROLE_PERMISSIONS_MAP.visitor.includes(permissionKey);
  const permissions = ROLE_PERMISSIONS_MAP[role] || ROLE_PERMISSIONS_MAP.visitor;
  return permissions.includes(permissionKey);
}

export function getRolePermissions(role: UserRole): PermissionKey[] {
  return ROLE_PERMISSIONS_MAP[role] || ROLE_PERMISSIONS_MAP.visitor;
}
