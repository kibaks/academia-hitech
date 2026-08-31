import { Course, Center, UserProfile, NanoBananaLesson, LearnerCourseProgress, ProfilePost, NetworkConnection } from '../types';

export interface CourseTemplate {
  id: string;
  title: string;
  category: Course['category'];
  level: Course['level'];
  shortDescription: string;
  durationHours: number;
  tags: string[];
  bannerImage: string;
  thumbnail: string;
  modulesCount: number;
  sampleCourse: Partial<Course>;
}

export interface ProfileTemplate {
  id: string;
  role: UserProfile['role'];
  label: string;
  description: string;
  data: Partial<UserProfile>;
}

export interface CenterTemplate {
  id: string;
  name: string;
  slogan: string;
  subdomain: string;
  primaryColor: string;
  subscriptionPlan: 'starter' | 'pro' | 'enterprise';
  description: string;
  specialties: string[];
  suggestedCourses: string[];
  logo: string;
}

// 1. NANO BANANA ANIMATED LESSONS TEMPLATES
export const NANO_BANANA_TEMPLATES: NanoBananaLesson[] = [
  {
    id: 'nano-transformers-ai',
    title: 'Comment fonctionne un Transformer d\'IA ?',
    topic: 'Intelligence Artificielle & LLMs',
    characterName: 'AIDA la mascotte IA',
    characterAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    totalDurationSeconds: 180,
    scenes: [
      {
        id: 'scene-1',
        title: 'Le Découpage en Tokens (Tokenization)',
        narratorText: 'Tout commence par la découpe des mots en petits morceaux numériques appelés tokens. Une phrase devient une suite de nombres compréhensibles par la machine.',
        animationType: 'neural_network',
        visualElement: {
          type: 'comparison',
          title: 'Texte brut vs Suite de Tokens',
          description: 'Transformation textuelle instantanée',
          details: [
            '"Bonjour Academia ITECH" → [9421, 1845, 8740, 204]',
            'Chaque token est projeté dans un espace vectoriel à 1536 dimensions (Embeddings)',
            'Les mots sémantiquement proches se retrouvent côte à côte dans cet espace.'
          ]
        },
        keyTakeaway: 'Les LLMs ne lisent pas des lettres mais des vecteurs sémantiques interconnectés.',
        miniQuiz: {
          question: 'Qu\'est-ce qu\'un token pour un modèle de langage comme GPT ou Gemini ?',
          options: [
            'Une clé API secrète de connexion',
            'Un fragment de mot ou sous-mot converti en identifiant numérique',
            'Un pixel affiché sur l\'écran'
          ],
          correctIndex: 1,
          explanation: 'Exactement ! Le tokenizer découpe les phrases en sous-mots pour les associer à des identifiants numériques.'
        }
      },
      {
        id: 'scene-2',
        title: 'Le Mécanisme d\'Auto-Attention (Self-Attention)',
        narratorText: 'C\'est le super-pouvoir du Transformer ! Pour chaque mot, le modèle calcule combien il doit faire attention aux autres mots de la phrase.',
        animationType: 'neural_network',
        visualElement: {
          type: 'svg_diagram',
          title: 'Matrice d\'Attention Query - Key - Value (Q, K, V)',
          description: 'Calcul dynamique des poids d\'attention',
          details: [
            'Query (Q) : Que cherche ce mot ?',
            'Key (K) : Que propose chaque mot voisin ?',
            'Value (V) : Quelle est l\'information à transmettre ?',
            'Score = Softmax((Q × Kᵀ) / √dₖ) × V'
          ]
        },
        keyTakeaway: 'L\'attention permet au modèle de comprendre le contexte sans ambiguïté (ex: "La banque au bord de la rivière" vs "La banque financière").',
        miniQuiz: {
          question: 'Pourquoi l\'auto-attention est-elle révolutionnaire par rapport aux anciens réseaux RNN ?',
          options: [
            'Elle traite tous les mots en parallèle et capture les dépendances longue distance instantanément',
            'Elle consomme 0 mégawatt d\'énergie',
            'Elle supprime le besoin d\'avoir un processeur GPU'
          ],
          correctIndex: 0,
          explanation: 'Bravo ! La parallélisation totale et la capture instantanée du contexte global ont rendu possible l\'explosion des modèles modernes.'
        }
      },
      {
        id: 'scene-3',
        title: 'La Prédiction du Prochain Token (Génération)',
        narratorText: 'Enfin, le modèle calcule une distribution de probabilités sur tout son vocabulaire pour choisir le mot suivant le plus cohérent.',
        animationType: 'code_flow',
        visualElement: {
          type: 'code_step',
          title: 'Échantillonnage avec Température',
          description: 'Contrôle de la créativité et de la rigueur',
          codeBefore: `// Température basse = Factuel & Précis\ntemperature = 0.2 // -> "Le ciel est bleu."`,
          codeAfter: `// Température élevée = Créatif & Varié\ntemperature = 0.9 // -> "Le firmament scintille d'azur."`,
          highlightLines: [2, 5]
        },
        keyTakeaway: 'Le modèle génère le texte mot par mot (token par token) en réinjectant chaque prédiction dans son contexte.',
        miniQuiz: {
          question: 'Que se passe-t-il si vous réglez la température sur 0 ?',
          options: [
            'Le modèle s\'éteint complètement',
            'Le modèle choisit systématiquement le token ayant la plus forte probabilité (déterministe)',
            'Le modèle invente des histoires de science-fiction'
          ],
          correctIndex: 1,
          explanation: 'Parfait ! Une température de 0 rend la génération déterministe et idéale pour le code et les calculs exacts.'
        }
      }
    ]
  },
  {
    id: 'nano-react-hooks',
    title: 'Comprendre le Cycle de Vie des React Hooks en 3 minutes',
    topic: 'Développement Web Moderne',
    characterName: 'DevBot Mentor',
    characterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    totalDurationSeconds: 150,
    scenes: [
      {
        id: 'scene-1',
        title: 'useState : La Mémoire du Composant',
        narratorText: 'Chaque modification d\'état avec useState déclenche un re-rendu ultra-rapide du Virtual DOM.',
        animationType: 'code_flow',
        visualElement: {
          type: 'code_step',
          title: 'Déclaration & Mise à jour d\'état',
          description: 'Syntaxe de déstructuration moderne',
          codeBefore: `const [count, setCount] = useState(0);`,
          codeAfter: `// Déclenche le re-rendu avec la nouvelle valeur\nsetCount(prev => prev + 1);`,
          highlightLines: [2]
        },
        keyTakeaway: 'Ne modifiez jamais directement une variable d\'état : utilisez toujours la fonction setter fournie.',
        miniQuiz: {
          question: 'Pourquoi passer une fonction fléchée `prev => prev + 1` dans le setter ?',
          options: [
            'Pour éviter les race conditions lors de mises à jour multiples groupées',
            'C\'est obligatoire selon les règles du W3C',
            'Pour accélérer la vitesse de la connexion internet'
          ],
          correctIndex: 0,
          explanation: 'Exact ! Passer un callback garantit que vous travaillez toujours sur la valeur d\'état la plus fraîche.'
        }
      },
      {
        id: 'scene-2',
        title: 'useEffect : Synchronisation avec le Monde Extérieur',
        narratorText: 'Le tableau de dépendances contrôle exactement quand vos effets de bord (API, timers, abonnements) doivent s\'exécuter.',
        animationType: 'concept_card',
        visualElement: {
          type: 'comparison',
          title: 'Tableaux de Dépendances vs Comportement',
          description: 'Les 3 modes d\'exécution essentiels',
          details: [
            '[] (Vide) : Exécuté 1 seule fois au montage initial (Mount)',
            '[userId] : Ré-exécuté uniquement quand `userId` change',
            'Pas de tableau : Exécuté à chaque re-rendu (Attention aux boucles !)'
          ]
        },
        keyTakeaway: 'N\'oubliez jamais de retourner une fonction de nettoyage (cleanup) pour détruire vos écouteurs et éviter les fuites mémoire.',
        miniQuiz: {
          question: 'Comment annuler un intervalle ou fermer une connexion WebSocket dans un useEffect ?',
          options: [
            'En appelant window.close()',
            'En retournant une fonction de nettoyage `return () => clearInterval(id);`',
            'En supprimant le composant du DOM manuellement'
          ],
          correctIndex: 1,
          explanation: 'Exactement ! La fonction retournée est exécutée avant le prochain effet ou au démontage du composant.'
        }
      }
    ]
  },
  {
    id: 'nano-cyber-zero-trust',
    title: 'L\'Architecture de Cybersécurité "Zero Trust"',
    topic: 'Sécurité Réseau & Cloud',
    characterName: 'CyberShield Agent',
    characterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    totalDurationSeconds: 160,
    scenes: [
      {
        id: 'scene-1',
        title: 'Le Principe Fondateur : "Ne jamais faire confiance, toujours vérifier"',
        narratorText: 'Dans l\'ancien modèle du château fort, quiconque était à l\'intérieur était considéré comme sûr. Avec Zero Trust, chaque requête est authentifiée et chiffrée, même en réseau local.',
        animationType: 'security_shield',
        visualElement: {
          type: 'comparison',
          title: 'Périmètre Traditionnel vs Zero Trust',
          description: 'Évolution de la posture défensive',
          details: [
            'Château & Fossé : Confiance implicite à l\'intérieur du VPN',
            'Zero Trust : Micro-segmentation, MFA obligatoire, chiffrement de bout en bout',
            'Principe du Moindre Privilège (PoLP) attribué en temps réel'
          ]
        },
        keyTakeaway: 'Considérez toujours que le réseau est hostile et que l\'intrus est déjà à l\'intérieur.',
        miniQuiz: {
          question: 'Quel est le pilier central du Zero Trust ?',
          options: [
            'Installer un seul mot de passe complexe pour toute l\'entreprise',
            'Vérifier continuellement l\'identité, l\'appareil et le contexte de chaque requête',
            'Désactiver la connexion Internet le soir'
          ],
          correctIndex: 1,
          explanation: 'Parfait ! L\'évaluation continue du contexte et l\'accès au moindre privilège constituent le cœur de la sécurité moderne.'
        }
      }
    ]
  }
];

// 2. COURSE & MODULE BUILDER TEMPLATES
export const COURSE_TEMPLATES: CourseTemplate[] = [
  {
    id: 'tpl-fullstack-ai',
    title: 'Masterclass Développeur Full-Stack IA & Microservices',
    category: 'development',
    level: 'Intermédiaire',
    shortDescription: 'Plan complet de 8 modules combinant React 19, Node/Express, PostgreSQL et intégration des LLMs Gemini.',
    durationHours: 36,
    tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Gemini API', 'Docker'],
    bannerImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=80',
    modulesCount: 5,
    sampleCourse: {
      title: 'Masterclass Développeur Full-Stack IA & Microservices',
      category: 'development',
      level: 'Intermédiaire',
      description: 'Apprenez à concevoir, développer et déployer des applications complètes intégrant des agents d\'intelligence artificielle générative.',
      shortDescription: 'Architecture moderne, APIs robustes et assistants IA en production.',
      price: 0,
      hasCertificate: true,
      skillsGained: [
        'Architecture React 19 & TypeScript',
        'Conception d\'APIs REST & GraphQL',
        'Intégration du SDK Google GenAI / Gemini',
        'Conteneurisation Docker & Déploiement Cloud Run'
      ]
    }
  },
  {
    id: 'tpl-cyber-soc',
    title: 'Analyste SOC & Défense Cybersécurité Opérationnelle',
    category: 'cybersecurity',
    level: 'Avancé',
    shortDescription: 'Programme complet d\'analyse des menaces, détection d\'intrusions SIEM et réponse aux incidents.',
    durationHours: 42,
    tags: ['SOC', 'SIEM', 'Threat Hunting', 'Incident Response', 'MITRE ATT&CK'],
    bannerImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&auto=format&fit=crop&q=80',
    modulesCount: 6,
    sampleCourse: {
      title: 'Analyste SOC & Défense Cybersécurité Opérationnelle',
      category: 'cybersecurity',
      level: 'Avancé',
      description: 'Formez-vous aux protocoles des équipes de réponse à incident (CSIRT) et aux outils d\'analyse forensique moderne.',
      shortDescription: 'Détection avancée des menaces et investigation numérique.',
      price: 0,
      hasCertificate: true,
      skillsGained: [
        'Maîtrise des matrices MITRE ATT&CK',
        'Analyse de journaux et corrélation SIEM',
        'Forensique mémoire et réseau',
        'Rédaction de rapports d\'incidents conformes ISO 27001'
      ]
    }
  },
  {
    id: 'tpl-cloud-devops',
    title: 'Ingénieur Cloud DevOps & Kubernetes CI/CD',
    category: 'cloud_devops',
    level: 'Tous niveaux',
    shortDescription: 'Parcours complet : Infrastructure as Code avec Terraform, Docker, Kubernetes et pipelines automatisés GitHub Actions.',
    durationHours: 30,
    tags: ['Terraform', 'Kubernetes', 'AWS', 'GCP', 'GitHub Actions', 'Prometheus'],
    bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&auto=format&fit=crop&q=80',
    modulesCount: 4,
    sampleCourse: {
      title: 'Ingénieur Cloud DevOps & Kubernetes CI/CD',
      category: 'cloud_devops',
      level: 'Tous niveaux',
      description: 'Automatisez vos déploiements logiciels à grande échelle avec une observabilité temps réel.',
      shortDescription: 'Déploiement continu, IaC et haute disponibilité.',
      price: 0,
      hasCertificate: true,
      skillsGained: [
        'Écriture de manifests Kubernetes sécurisés',
        'Création de pipelines CI/CD zero-downtime',
        'Provisionnement Terraform modulaire',
        'Monitoring avec Prometheus & Grafana'
      ]
    }
  }
];

// 3. PROFILE TEMPLATES
export const PROFILE_TEMPLATES: ProfileTemplate[] = [
  {
    id: 'tpl-learner-dev',
    role: 'learner',
    label: 'Apprenant Développeur Web & IA',
    description: 'Profil d\'étudiant axé sur la programmation web, l\'intelligence artificielle et les projets open-source.',
    data: {
      headline: 'Étudiant Passionné en Ingénierie Logicielle & Intelligence Artificielle',
      bio: 'En formation chez Academia ITECH. Passionné par l\'architecture microservices, le TypeScript et la création de produits numériques performants.',
      city: 'Paris',
      country: 'France',
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'Prompt Engineering'],
      languages: ['Français (Natif)', 'Anglais (Professionnel C1)', 'Lingála (Courant)'],
      workplaces: [
        { id: 'w1', role: 'Stagiaire Développeur Frontend', company: 'TechSolutions Inc.', period: '2025 - Présent', current: true },
        { id: 'w2', role: 'Projet Étudiant', company: 'Academia ITECH Lab', period: '2024 - 2025', current: false }
      ],
      education: [
        { id: 'e1', school: 'Academia ITECH', degree: 'Mastère Ingénierie Web & IA', year: '2025 - 2026' },
        { id: 'e2', school: 'Université Numérique', degree: 'Licence Informatique Générale', year: '2022 - 2025' }
      ],
      socialLinks: {
        github: 'https://github.com/learner-itech',
        linkedin: 'https://linkedin.com/in/learner-itech',
        portfolio: 'https://learner-portfolio.tech',
        whatsapp: '+33612345678'
      }
    }
  },
  {
    id: 'tpl-trainer-ai',
    role: 'trainer',
    label: 'Formateur Expert IA & Deep Learning',
    description: 'Profil d\'enseignant chercheur et formateur certifié spécialisé en modèles génératifs.',
    data: {
      headline: 'Directeur de Recherche en Modèles Génératifs | Formateur Certifié ITECH',
      bio: '10 ans d\'expérience dans la recherche en IA appliquée. Auteur de publications sur les Transformers et formateur de plus de 3 000 étudiants.',
      city: 'Paris & Dakar',
      country: 'International',
      skills: ['Python', 'PyTorch', 'Transformers', 'Google Gemini API', 'MLOps', 'LangChain', 'Mathématiques Appliquées'],
      languages: ['Français (Natif)', 'Anglais (Bilingue)', 'Russe (Intermédiaire)'],
      workplaces: [
        { id: 'w1', role: 'Lead Formateur IA', company: 'Academia ITECH Campus Paris', period: '2023 - Présent', current: true },
        { id: 'w2', role: 'Chercheuse en Deep Learning', company: 'AI Research Institute', period: '2019 - 2023', current: false }
      ],
      education: [
        { id: 'e1', school: 'École Polytechnique', degree: 'Doctorat en Intelligence Artificielle', year: '2016 - 2019' }
      ],
      socialLinks: {
        github: 'https://github.com/trainer-elena',
        linkedin: 'https://linkedin.com/in/dr-elena-rostova',
        portfolio: 'https://elena-ai-research.org'
      }
    }
  },
  {
    id: 'tpl-director-center',
    role: 'center_admin',
    label: 'Directeur de Campus & Chef de Centre',
    description: 'Profil de gouvernance académique, gestion des formateurs et partenariats institutionnels.',
    data: {
      headline: 'Directeur Général de Centre de Formation Numérique | Pôle d\'Excellence ITECH',
      bio: 'Pilote stratégique de la formation tech. Développement des cohortes, recrutement des formateurs d\'élite et insertion professionnelle des diplômés.',
      city: 'Dakar',
      country: 'Sénégal',
      skills: ['Gestion Pédagogique', 'Leadership d\'Équipe', 'Stratégie Éducative', 'Relations Entreprises', 'Audit Qualité'],
      languages: ['Français (Natif)', 'Anglais (Courant)', 'Wolof (Natif)'],
      workplaces: [
        { id: 'w1', role: 'Directeur de Campus', company: 'Dakar AI & Cyber Institute', period: '2024 - Présent', current: true },
        { id: 'w2', role: 'Directeur des Études', company: 'Institut Polytechnique Panafricain', period: '2018 - 2024', current: false }
      ],
      education: [
        { id: 'e1', school: 'INSEAD / HEC', degree: 'Executive MBA Management & Éducation', year: '2016 - 2018' }
      ],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/direction-campus',
        website: 'https://dakar-ai.tech'
      }
    }
  }
];

// 4. TRAINING CENTER TEMPLATES
export const CENTER_TEMPLATES: CenterTemplate[] = [
  {
    id: 'tpl-center-ai-excellence',
    name: 'Pôle Panafricain d\'Intelligence Artificielle',
    slogan: 'L\'Excellence Technologique et la Souveraineté Numérique',
    subdomain: 'ai-excellence',
    primaryColor: '#0ea5e9',
    subscriptionPlan: 'enterprise',
    description: 'Campus de référence dédié aux data scientists, ingénieurs en IA générative et architectes de modèles fondamentaux.',
    specialties: ['Intelligence Artificielle', 'Deep Learning & LLMs', 'Data Engineering', 'Éthique de l\'IA'],
    suggestedCourses: ['course-ia-llm', 'course-ai-agentic'],
    logo: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'tpl-center-cyber-defense',
    name: 'CyberDefense Security Academy',
    slogan: 'Former les Sentinelles du Cyber-Espace',
    subdomain: 'cyber-defense',
    primaryColor: '#10b981',
    subscriptionPlan: 'pro',
    description: 'Centre d\'entraînement offensif et défensif avec cyber-ranges virtuels, simulation de crises et préparation aux certifications.',
    specialties: ['Cybersécurité Offensive', 'Analyse SOC & SIEM', 'Audit & Pentest', 'Gouvernance ISO 27001'],
    suggestedCourses: ['course-cyber-sec', 'course-zero-trust'],
    logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'tpl-center-code-bootcamp',
    name: 'FullStack Coding & Cloud Lab',
    slogan: 'De Zéro à Développeur Opérationnel en 6 Mois',
    subdomain: 'coding-lab',
    primaryColor: '#6366f1',
    subscriptionPlan: 'pro',
    description: 'Bootcamp immersif axé sur la pratique intensive, le mentorat quotidien et la réalisation de projets en conditions réelles.',
    specialties: ['React & Next.js', 'Node.js & Python', 'Cloud DevOps', 'Mobile Flutter'],
    suggestedCourses: ['course-fullstack-cloud', 'course-microservices'],
    logo: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=150&auto=format&fit=crop&q=80'
  }
];

// 5. INITIAL POSTS FOR FACEBOOK FEED
export const INITIAL_PROFILE_POSTS: ProfilePost[] = [
  {
    id: 'post-1',
    authorId: 'user-current',
    authorName: 'Landry Kibakweto',
    authorAvatar: 'https://images.unsplash.com/photo-1531891437562-4301cf092a9d?w=300&auto=format&fit=crop&q=80',
    authorRole: 'learner',
    content: '🎉 Très fier d\'avoir validé avec succès le module "Architecture des Transformers et Fine-Tuning de LLMs" ! Un grand merci aux formateurs d\'Academia ITECH et au tuteur interactif AIDA.',
    type: 'certificate_earned',
    certificateRef: {
      courseTitle: 'Masterclass Ingénierie des LLMs & IA Générative',
      distinction: 'Mention Très Bien (96%)',
      certificateNumber: 'ITECH-CERT-2026-0042'
    },
    timestamp: 'Il y a 2 heures',
    likes: 24,
    isLiked: false,
    isPinned: true,
    comments: [
      {
        id: 'c1',
        authorId: 'trainer-fatou-s',
        authorName: 'Fatou Sow',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
        content: 'Félicitations pour cette belle note ! Ton implémentation de l\'auto-attention était particulièrement soignée. Continue ainsi ! 👏',
        timestamp: 'Il y a 1 heure',
        likes: 8
      },
      {
        id: 'c2',
        authorId: 'user-friend-1',
        authorName: 'Amina Diallo',
        authorAvatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=300&auto=format&fit=crop&q=80',
        content: 'Bravo Landry ! Hâte de collaborer avec toi sur le projet de fin d\'études ! 🚀',
        timestamp: 'Il y a 30 minutes',
        likes: 3
      }
    ]
  },
  {
    id: 'post-2',
    authorId: 'user-current',
    authorName: 'Landry Kibakweto',
    authorAvatar: 'https://images.unsplash.com/photo-1531891437562-4301cf092a9d?w=300&auto=format&fit=crop&q=80',
    authorRole: 'learner',
    content: '💡 Astuce du jour pour les développeurs React : utilisez `useDeferredValue` lorsque vous traitez des filtres de recherche complexes sans bloquer le thread principal ! Voici le snippet :',
    type: 'code_snippet',
    codeLanguage: 'typescript',
    codeContent: `const deferredQuery = useDeferredValue(searchQuery);\nconst filteredItems = useMemo(() => {\n  return bigList.filter(item => item.name.includes(deferredQuery));\n}, [deferredQuery]);`,
    timestamp: 'Hier à 16:45',
    likes: 42,
    isLiked: true,
    comments: []
  }
];

// 6. INITIAL NETWORK CONNECTIONS
export const INITIAL_NETWORK_CONNECTIONS: NetworkConnection[] = [
  {
    id: 'net-1',
    name: 'Fatou Sow',
    role: 'trainer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    headline: 'Formatrice en Chef IA & Modèles Génératifs',
    centerName: 'Dakar AI & Cyber Hub',
    mutualCount: 18,
    isFriend: true,
    isOnline: true
  },
  {
    id: 'net-2',
    name: 'Malik Konaté',
    role: 'trainer',
    avatar: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=300&auto=format&fit=crop&q=80',
    headline: 'Consultant Lead Cybersécurité & SOC',
    centerName: 'Dakar AI & Cyber Hub',
    mutualCount: 12,
    isFriend: true,
    isOnline: false
  },
  {
    id: 'net-3',
    name: 'Amina Diallo',
    role: 'learner',
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=300&auto=format&fit=crop&q=80',
    headline: 'Étudiante en Data Science & IA',
    centerName: 'Abidjan Fintech & Tech Lab',
    mutualCount: 9,
    isFriend: true,
    isOnline: true
  },
  {
    id: 'net-4',
    name: 'Mamadou Touré',
    role: 'learner',
    avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=300&auto=format&fit=crop&q=80',
    headline: 'Développeur FullStack Cloud',
    centerName: 'Kinshasa Silicon River & Digital Campus',
    mutualCount: 14,
    isFriend: true,
    isOnline: true
  },
  {
    id: 'net-5',
    name: 'Grace Mukendi',
    role: 'trainer',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&auto=format&fit=crop&q=80',
    headline: 'Architecte Cloud AWS & GCP',
    centerName: 'Kinshasa Silicon River & Digital Campus',
    mutualCount: 7,
    isFriend: false,
    isOnline: false
  }
];

// 7. INITIAL LEARNER PROGRESS DATA FOR TEACHER MONITORING
export const INITIAL_LEARNER_PROGRESS: LearnerCourseProgress[] = [
  {
    learnerId: 'lrn-1',
    learnerName: 'Alexandre Moreau',
    learnerEmail: 'alexandre.m@etudiant.itech.fr',
    learnerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    courseId: 'course-ia-llm',
    courseTitle: 'Masterclass Ingénierie des LLMs & IA Générative',
    progressPercentage: 92,
    completedLessonsCount: 11,
    totalLessonsCount: 12,
    quizAveragePercentage: 96,
    timeSpentMinutes: 340,
    lastActive: 'Il y a 10 minutes',
    status: 'ahead',
    lastCompletedLessonTitle: 'Déploiement et Fine-tuning de Llama 3',
    notes: 'Excellente compréhension du fine-tuning LoRA. Prêt pour le projet final.'
  },
  {
    learnerId: 'lrn-2',
    learnerName: 'Fatou Ndiaye',
    learnerEmail: 'fatou.ndiaye@dakar-etudiant.tech',
    learnerAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    courseId: 'course-ia-llm',
    courseTitle: 'Masterclass Ingénierie des LLMs & IA Générative',
    progressPercentage: 75,
    completedLessonsCount: 9,
    totalLessonsCount: 12,
    quizAveragePercentage: 88,
    timeSpentMinutes: 280,
    lastActive: 'Hier à 18:20',
    status: 'on_track',
    lastCompletedLessonTitle: 'Mécanismes d\'Attention Multi-Têtes',
    notes: 'Régulière et investie. Bonne participation dans les quiz.'
  },
  {
    learnerId: 'lrn-3',
    learnerName: 'Marc Dubreuil',
    learnerEmail: 'marc.dubreuil@gmail.com',
    learnerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    courseId: 'course-ia-llm',
    courseTitle: 'Masterclass Ingénierie des LLMs & IA Générative',
    progressPercentage: 25,
    completedLessonsCount: 3,
    totalLessonsCount: 12,
    quizAveragePercentage: 54,
    timeSpentMinutes: 75,
    lastActive: 'Il y a 6 jours',
    status: 'needs_help',
    lastCompletedLessonTitle: 'Introduction aux Architectures de Réseaux',
    notes: 'Bloqué sur le quiz des matrices vectorielles. Relance d\'accompagnement envoyée.'
  },
  {
    learnerId: 'lrn-4',
    learnerName: 'Chloé Fontaine',
    learnerEmail: 'chloe.fontaine@outlook.fr',
    learnerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    courseId: 'course-ia-llm',
    courseTitle: 'Masterclass Ingénierie des LLMs & IA Générative',
    progressPercentage: 60,
    completedLessonsCount: 7,
    totalLessonsCount: 12,
    quizAveragePercentage: 82,
    timeSpentMinutes: 210,
    lastActive: 'Aujourd\'hui à 09:15',
    status: 'on_track',
    lastCompletedLessonTitle: 'Calculs d\'Embeddings Vectoriels',
    notes: 'Très bonne progression sur les exercices pratiques.'
  }
];
