import { Course, Badge, Center, RewardItem, LeaderboardUser, UserProfile, Trainer } from '../types';

export const INITIAL_TRAINERS: Trainer[] = [
  {
    id: 'trainer-dr-elena',
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@itech-paris.academy',
    specialty: 'Intelligence Artificielle & Deep Learning',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Ancienne chercheuse CNRS, directrice de recherche en modèles génératifs et LLMs.',
    coursesAssigned: ['course-ia-llm'],
    rating: 4.95,
    status: 'active'
  },
  {
    id: 'trainer-malik-k',
    name: 'Malik Konaté',
    email: 'malik.konate@dakar-ai.tech',
    specialty: 'Cybersécurité & Ethical Hacking',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Consultant SOC certifié CISSP et OSCP, intervenant international sur la sécurité des API.',
    coursesAssigned: ['course-cyber-sec'],
    rating: 4.88,
    status: 'active'
  },
  {
    id: 'trainer-sarah-m',
    name: 'Sarah Mansouri',
    email: 'sarah.mansouri@casatech-lab.ma',
    specialty: 'Cloud Architecture & Fullstack React/Node',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Lead Architecte Cloud AWS/GCP et passionnée par les frameworks web ultra-rapides.',
    coursesAssigned: ['course-fullstack-cloud'],
    rating: 4.92,
    status: 'active'
  }
];

export const INITIAL_CENTERS: Center[] = [
  {
    id: 'center-1',
    name: 'ITECH Campus Paris & Digital Hub',
    slug: 'itech-paris',
    subdomain: 'paris',
    logo: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=150&auto=format&fit=crop&q=80',
    primaryColor: '#0ea5e9',
    subscriptionPlan: 'enterprise',
    plan: 'enterprise',
    trainerCount: 14,
    studentCount: 1420,
    studentsCount: 1420,
    maxStudents: 5000,
    courseCount: 28,
    createdAt: '2025-01-10',
    isVerified: true,
    contactEmail: 'contact@itech-paris.academy',
    description: 'Pôle d\'excellence en Intelligence Artificielle, Cloud Architecture et Cybersécurité.',
    customDomain: 'campus.itech-paris.fr',
    trainers: [INITIAL_TRAINERS[0]]
  },
  {
    id: 'center-2',
    name: 'Dakar AI & Cyber Institute',
    slug: 'dakar-ai',
    subdomain: 'dakar',
    logo: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=150&auto=format&fit=crop&q=80',
    primaryColor: '#10b981',
    subscriptionPlan: 'pro',
    plan: 'pro',
    trainerCount: 8,
    studentCount: 890,
    studentsCount: 890,
    maxStudents: 1000,
    courseCount: 16,
    createdAt: '2025-03-15',
    isVerified: true,
    contactEmail: 'admissions@dakar-ai.tech',
    description: 'Institut panafricain de formation avancée aux technologies émergentes et Big Data.',
    customDomain: 'dakar.academia-itech.com',
    trainers: [INITIAL_TRAINERS[1]]
  },
  {
    id: 'center-3',
    name: 'Casablanca Tech Innovation Lab',
    slug: 'casa-tech',
    subdomain: 'casablanca',
    logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=150&auto=format&fit=crop&q=80',
    primaryColor: '#6366f1',
    subscriptionPlan: 'pro',
    plan: 'pro',
    trainerCount: 6,
    studentCount: 640,
    studentsCount: 640,
    maxStudents: 1000,
    courseCount: 12,
    createdAt: '2025-06-20',
    isVerified: true,
    contactEmail: 'info@casatech-lab.ma',
    description: 'Accélérateur de compétences logicielles, Dév Web Fullstack et UX Design moderne.',
    customDomain: 'casatech.academia-itech.com',
    trainers: [INITIAL_TRAINERS[2]]
  }
];

export const INITIAL_CENTRES = INITIAL_CENTERS;

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-1',
    title: 'Pionnier IA',
    description: 'A généré et complété son premier module assisté par IA',
    icon: 'Bot',
    category: 'special',
    rarity: 'rare'
  },
  {
    id: 'badge-2',
    title: 'Flamme Déterminée',
    description: 'A maintenu une série de 7 jours consécutifs d\'apprentissage',
    icon: 'Flame',
    category: 'streak',
    rarity: 'common'
  },
  {
    id: 'badge-3',
    title: 'Perfectionniste Quiz',
    description: 'A obtenu 100% à une évaluation sans aucune erreur',
    icon: 'Award',
    category: 'quiz',
    rarity: 'epic'
  },
  {
    id: 'badge-4',
    title: 'Architecte Fullstack',
    description: 'A validé la certification avancée en développement web et API',
    icon: 'Code2',
    category: 'course',
    rarity: 'epic'
  },
  {
    id: 'badge-5',
    title: 'Sentinelle Cyber',
    description: 'A complété les défis d\'analyse de vulnérabilités et sécurité offensive',
    icon: 'ShieldCheck',
    category: 'special',
    rarity: 'legendary'
  },
  {
    id: 'badge-6',
    title: 'Maître des 1000 XP',
    description: 'A accumulé plus de 1000 points d\'expérience sur la plateforme',
    icon: 'Zap',
    category: 'xp',
    rarity: 'common'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-ia-llm',
    title: 'Masterclass IA Générative, LLMs & Agents Autonomes',
    slug: 'masterclass-ia-generative-llm',
    category: 'ia_data',
    level: 'Intermédiaire',
    rating: 4.9,
    reviewCount: 342,
    studentCount: 1890,
    durationHours: 14.5,
    price: 0,
    isFeatured: true,
    isNew: true,
    hasCertificate: true,
    authorId: 'trainer-dr-elena',
    authorName: 'Dr. Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Directrice de Recherche IA & Machine Learning',
    centerId: 'center-1',
    centerName: 'ITECH Campus Paris',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80',
    shortDescription: 'Maîtrisez les modèles de fondation (Gemini, GPT), le prompt engineering avancé, le RAG (Retrieval Augmented Generation) et la création d\'agents autonomes.',
    description: 'Une formation complète et ultra-pratique conçue pour les développeurs, ingénieurs et chefs de projet souhaitant concevoir et déployer des architectures d\'IA modernes. Vous apprendrez à orchestrer des modèles de langage, à connecter vos bases de données vectorielles et à implémenter des flux de raisonnement structurés.',
    tags: ['Intelligence Artificielle', 'Gemini', 'LLM', 'RAG', 'Python', 'Agents'],
    skillsGained: ['Architecture LLM', 'Prompt Engineering Pro', 'Vector DB & Embeddings', 'Fine-tuning & Evaluation', 'Sécurité des Prompts'],
    chapters: [
      {
        id: 'chap-1',
        title: 'Module 1 : Fondements et Révolution des Modèles de Fondation',
        description: 'Comprendre l\'architecture Transformer et l\'écosystème moderne',
        lessons: [
          {
            id: 'les-101',
            title: '1.1 Introduction aux architectures Transformers & Mécanismes d\'Attention',
            durationMinutes: 18,
            type: 'video',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `### Introduction aux Transformers

L'architecture Transformer (introduite par Vaswani et al. en 2017) a transformé le traitement du langage naturel en remplaçant la récurrence par le **Self-Attention Mechanism**.

#### Les Composants Clés :
1. **Self-Attention** : Permet au modèle d'attribuer des poids d'importance relatifs à chaque mot de la séquence par rapport aux autres.
2. **Positional Encoding** : Injecte l'ordre des tokens dans la représentation vectorielle.
3. **Multi-Head Attention** : Apprend simultanément plusieurs aspects relationnels (syntaxe, sémantique, coréférences).

\`\`\`python
# Exemple de calcul simplifié de Scaled Dot-Product Attention
import numpy as np

def attention(Q, K, V, d_k):
    scores = np.matmul(Q, K.T) / np.sqrt(d_k)
    weights = np.exp(scores) / np.sum(np.exp(scores), axis=-1, keepdims=True)
    return np.matmul(weights, V)
\`\`\`
`,
            resources: [
              { id: 'res-1', title: 'Guide d\'architecture Transformers (PDF)', url: '#', type: 'pdf', size: '2.4 MB' },
              { id: 'res-2', title: 'Notebook Jupyter d\'introduction', url: '#', type: 'code', size: '15 KB' }
            ]
          },
          {
            id: 'les-102',
            title: '1.2 Prompt Engineering Avancé : Few-Shot, CoT (Chain-of-Thought) et ReAct',
            durationMinutes: 22,
            type: 'interactive_code',
            codeLanguage: 'python',
            codeStarter: `def build_cot_prompt(question: str, context: str) -> str:
    # TODO: Créez un prompt structuré en Chain-of-Thought
    system_rules = "Vous êtes un expert IA..."
    return f"{system_rules}\\n\\nContexte: {context}\\nQuestion: {question}"

print(build_cot_prompt("Comment optimiser un RAG ?", "RAG utilise des embeddings."))`,
            codeSolution: `def build_cot_prompt(question: str, context: str) -> str:
    prompt = f"""[Système : Expert IA Academia ITECH]
Règle : Réfléchis étape par étape avant de donner ta réponse finale.
1. Analyse le contexte fourni
2. Identifie les contraintes
3. Formule le plan de réponse

Contexte : {context}
Question : {question}
Réflexion pas-à-pas :"""
    return prompt

print(build_cot_prompt("Comment optimiser un RAG ?", "Indexation vectorielle et re-ranking."))`,
            content: `### Techniques de Prompting Avancé

Le **Chain-of-Thought (CoT)** oblige le modèle à générer des étapes intermédiaires de raisonnement avant de produire la réponse finale. Cela réduit drastiquement les hallucinations et augmente la précision sur les problèmes logiques complexes.

#### Modèles de prompting recommandés :
- **Zero-Shot CoT** : Ajouter *"Réfléchissons étape par étape"*.
- **Few-Shot CoT** : Fournir 2 ou 3 exemples complets de raisonnement.
- **ReAct (Reason + Act)** : Intercaler la réflexion interne avec l'appel d'outils externes (API, bases de données).
`
          },
          {
            id: 'les-103',
            title: '1.3 RAG (Retrieval-Augmented Generation) & Bases de Données Vectorielles',
            durationMinutes: 25,
            type: 'article',
            content: `### Architecture RAG d'Entreprise

Le RAG combine un système de recherche sémantique avec la puissance générative du LLM.

#### Pipeline typique :
1. **Ingestion & Chunking** : Découpage intelligent des documents (Markdown, PDF, Bases SQL).
2. **Embedding** : Transformation des fragments en vecteurs haute dimension (ex: 768 ou 1536 dimensions).
3. **Indexation Vectorielle** : Stockage dans une base comme Pinecone, ChromaDB ou pgvector.
4. **Recherche Sémantique (Cosine Similarity)** : Récupération des *k* fragments les plus pertinents.
5. **Génération Contextualisée** : Injection des fragments dans la fenêtre de contexte du modèle.

> **Astuce ITECH** : Pour améliorer de 30% la fidélité des réponses, appliquez toujours un **Cross-Encoder Re-ranker** sur les top 10 documents avant l'envoi au LLM.`
          }
        ]
      },
      {
        id: 'chap-2',
        title: 'Module 2 : Agents Autonomes, Function Calling & Déploiement',
        description: 'Orchestrer des outils et concevoir des flux automatisés multi-agents',
        lessons: [
          {
            id: 'les-201',
            title: '2.1 Function Calling & Outils Externes avec Gemini',
            durationMinutes: 20,
            type: 'video',
            content: `Dans cette leçon, nous allons implémenter le **Function Calling** natif pour permettre à notre assistant de rechercher des cours, d'inscrire des élèves et de vérifier des prérequis en direct.`
          },
          {
            id: 'les-202',
            title: '2.2 Déploiement en Production & Observabilité des LLMs',
            durationMinutes: 24,
            type: 'exercise',
            content: `Exercice pratique : Mettre en place un système de tracking des coûts de tokens, de latence P95 et de monitoring des taux d'hallucinations.`
          }
        ]
      }
    ],
    finalQuiz: {
      id: 'quiz-ia-mastery',
      title: 'Évaluation Finale : Certification IA & Agents Autonomes',
      description: 'Testez vos compétences théoriques et pratiques pour décrocher votre Certificat Officiel Academia ITECH.',
      courseId: 'course-ia-llm',
      passingScore: 75,
      timeLimitMinutes: 15,
      xpReward: 350,
      questions: [
        {
          id: 'q1',
          question: 'Quel est le rôle principal du mécanisme de Self-Attention dans un Transformer ?',
          options: [
            'Compresser la taille de la mémoire GPU lors de l\'entraînement',
            'Calculer l\'importance relative de chaque token par rapport à tous les autres tokens de la séquence',
            'Supprimer automatiquement les mots d\'arrêt (stop words)',
            'Convertir des données textuelles en fichiers binaires'
          ],
          correctIndex: 1,
          explanation: 'Le mécanisme de Self-Attention calcule une matrice d\'affinité (Q x K.T) pour pondérer dynamiquement les représentations contextuelles de chaque mot.',
          points: 25
        },
        {
          id: 'q2',
          question: 'Dans une architecture RAG, à quoi sert principalement le "Re-ranking" ?',
          options: [
            'À supprimer les doublons d\'adresses IP sur le réseau',
            'À réordonner les fragments récupérés avec un modèle plus précis (Cross-Encoder) avant de les fournir au LLM',
            'À traduire le prompt en plusieurs langues',
            'À chiffrer la base vectorielle'
          ],
          correctIndex: 1,
          explanation: 'Le Re-ranking affine la liste des documents récupérés par la recherche vectorielle afin de maximiser la pertinence sémantique du contexte fourni au modèle.',
          points: 25
        },
        {
          id: 'q3',
          question: 'Quelle est la caractéristique clé de la méthode Chain-of-Thought (CoT) ?',
          options: [
            'Elle force le modèle à répondre en moins de 3 mots',
            'Elle demande au modèle d\'expliciter son raisonnement étape par étape avant la conclusion',
            'Elle désactive la température du modèle',
            'Elle fonctionne uniquement sur des bases de données SQL'
          ],
          correctIndex: 1,
          explanation: 'Le Chain-of-Thought incite le modèle à décomposer son calcul mental, ce qui évite les erreurs hâtives sur les problèmes complexes.',
          points: 25
        },
        {
          id: 'q4',
          question: 'Quelle métrique est essentielle pour mesurer la qualité des embeddings vectoriels ?',
          options: [
            'Le Cosine Similarity (Similarité Cosinus)',
            'Le nombre de pixels par image',
            'La vitesse du ventilateur CPU',
            'Le port TCP 8080'
          ],
          correctIndex: 0,
          explanation: 'La similarité cosinus mesure le cosinus de l\'angle entre deux vecteurs, indiquant leur proximité sémantique dans l\'espace latent.',
          points: 25
        }
      ]
    }
  },
  {
    id: 'course-cyber-sec',
    title: 'Cybersécurité Offensive & Défense des Systèmes d\'Entreprise',
    slug: 'cybersecurite-offensive-defense',
    category: 'cybersecurity',
    level: 'Tous niveaux',
    rating: 4.85,
    reviewCount: 219,
    studentCount: 1240,
    durationHours: 18.0,
    price: 0,
    isFeatured: true,
    isNew: false,
    hasCertificate: true,
    authorId: 'trainer-malik-k',
    authorName: 'Malik Konaté',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Ethical Hacker & Consultant SOC Certifié CISSP',
    centerId: 'center-2',
    centerName: 'Dakar AI & Cyber Institute',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
    shortDescription: 'Apprenez les tests d\'intrusion (Pentesting), la sécurisation des architectures Cloud et la réponse aux incidents cyber en temps réel.',
    description: 'Une immersion complète dans la sécurité informatique moderne. Maîtrisez le framework MITRE ATT&CK, découvrez les failles OWASP Top 10, configurez des pare-feu applicatifs (WAF) et simulez des attaques Red Team / Blue Team.',
    tags: ['Cybersécurité', 'Pentest', 'OWASP', 'Linux', 'Ethical Hacking', 'SOC'],
    skillsGained: ['Audit de sécurité applicative', 'Sécurisation des réseaux & API', 'Analyse de logs & SIEM', 'Rétro-ingénierie'],
    chapters: [
      {
        id: 'chap-c1',
        title: 'Module 1 : Cartographie des Menaces & OWASP Top 10',
        description: 'Identifier et corriger les vulnérabilités applicatives majeures',
        lessons: [
          {
            id: 'les-c101',
            title: '1.1 Découverte des injections SQL, XSS et failles CSRF',
            durationMinutes: 20,
            type: 'video',
            content: `Analyse détaillée des failles d'injection et méthodes de remédiation par requêtes préparées (Prepared Statements).`
          },
          {
            id: 'les-c102',
            title: '1.2 Mise en place d\'un environnement de test isolé (Kali & Docker)',
            durationMinutes: 28,
            type: 'article',
            content: `Guide pas-à-pas pour configurer des conteneurs vulnérables de type DVWA et WebGoat en toute légalité.`
          }
        ]
      }
    ],
    finalQuiz: {
      id: 'quiz-cyber-cert',
      title: 'Quiz de Certification Sécurité ITECH',
      description: 'Validez votre socle de compétences en cybersécurité opérationnelle.',
      courseId: 'course-cyber-sec',
      passingScore: 80,
      timeLimitMinutes: 12,
      xpReward: 300,
      questions: [
        {
          id: 'qc1',
          question: 'Quelle est la meilleure défense contre les injections SQL ?',
          options: [
            'Chiffrer le mot de passe dans le code HTML',
            'Utiliser des requêtes préparées et paramétrées (Prepared Statements / ORM)',
            'Augmenter la taille du disque dur',
            'Désactiver le protocole HTTPS'
          ],
          correctIndex: 1,
          explanation: 'Les requêtes préparées garantissent que les entrées utilisateur sont traitées comme des données pures et jamais interprétées comme du code SQL exécutable.',
          points: 35
        },
        {
          id: 'qc2',
          question: 'Que signifie le concept de "Zero Trust" en sécurité d\'infrastructure ?',
          options: [
            'Ne faire confiance à aucun utilisateur ou appareil par défaut, vérifier continuellement',
            'Refuser tous les e-mails entrants',
            'Supprimer tous les comptes administrateur',
            'Autoriser tout le monde sur le réseau local'
          ],
          correctIndex: 0,
          explanation: 'Le principe Zero Trust repose sur la maxime "Never trust, always verify" quel que soit l\'emplacement réseau du demandeur.',
          points: 35
        },
        {
          id: 'qc3',
          question: 'Quelle faille permet à un attaquant d\'exécuter des scripts malveillants dans le navigateur de la victime ?',
          options: [
            'Cross-Site Scripting (XSS)',
            'DDoS (Déni de service distribué)',
            'Dépassement de tampon (Buffer Overflow)',
            'Attaque Man-in-the-Middle'
          ],
          correctIndex: 0,
          explanation: 'Le XSS injecte des scripts (généralement JavaScript) exécutés dans la session de la victime.',
          points: 30
        }
      ]
    }
  },
  {
    id: 'course-fullstack-cloud',
    title: 'Architecture Fullstack Moderne : React 19, Node.js & Cloud DevOps',
    slug: 'architecture-fullstack-react-node-cloud',
    category: 'development',
    level: 'Intermédiaire',
    rating: 4.92,
    reviewCount: 480,
    studentCount: 2310,
    durationHours: 22.0,
    price: 0,
    isFeatured: true,
    isNew: false,
    hasCertificate: true,
    authorId: 'trainer-sarah-m',
    authorName: 'Sarah Mansouri',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Lead Architecte Cloud & Formatrice ITECH',
    centerId: 'center-3',
    centerName: 'Casablanca Tech Innovation Lab',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    shortDescription: 'Concevez des applications web scalables de bout en bout, avec CI/CD automatisée, conteneurisation Docker et bases de données managées.',
    description: 'Devenez un développeur Fullstack polyvalent capable de concevoir, développer, tester et déployer des applications d\'envergure internationale avec les technologies les plus demandées par le marché.',
    tags: ['React', 'TypeScript', 'Node.js', 'Docker', 'DevOps', 'PostgreSQL'],
    skillsGained: ['Architecture Microservices', 'React 19 & Server Components', 'Pipelines CI/CD', 'Optimisation Performance'],
    chapters: [
      {
        id: 'chap-f1',
        title: 'Module 1 : Principes Avancés de React et State Management',
        description: 'Optimisation du rendu et hooks personnalisés',
        lessons: [
          {
            id: 'les-f101',
            title: '1.1 Maîtrise des hooks React et gestion des re-renders',
            durationMinutes: 19,
            type: 'video',
            content: `Explications sur useMemo, useCallback et les nouveautés de React 19 pour booster la fluidité de vos interfaces.`
          }
        ]
      }
    ],
    finalQuiz: {
      id: 'quiz-fullstack',
      title: 'Évaluation Architecte Fullstack ITECH',
      description: 'Validez votre compréhension des architectures web modernes et conteneurs.',
      courseId: 'course-fullstack-cloud',
      passingScore: 75,
      timeLimitMinutes: 10,
      xpReward: 300,
      questions: [
        {
          id: 'qf1',
          question: 'Pourquoi utilise-t-on Docker dans un pipeline moderne ?',
          options: [
            'Pour éliminer le syndrome "Ça marche sur ma machine" en garantissant un environnement identique partout',
            'Pour ralentir la cadence des mises en production',
            'Pour remplacer les langages de programmation',
            'Pour créer des animations 3D'
          ],
          correctIndex: 0,
          explanation: 'Docker encapsule le code, le runtime et les dépendances dans un conteneur standardisé et reproductible.',
          points: 50
        },
        {
          id: 'qf2',
          question: 'Quelle est la différence fondamentale entre REST et GraphQL ?',
          options: [
            'GraphQL permet au client de spécifier exactement les données dont il a besoin en une seule requête',
            'REST ne fonctionne qu\'en local',
            'GraphQL nécessite toujours Java',
            'REST est payant et GraphQL est gratuit'
          ],
          correctIndex: 0,
          explanation: 'GraphQL évite le sur-chargement (over-fetching) et sous-chargement (under-fetching) de données en donnant le contrôle précis au frontend.',
          points: 50
        }
      ]
    }
  }
];

export const INITIAL_REWARDS: RewardItem[] = [
  {
    id: 'rew-1',
    title: 'Session Mentorat 1-to-1 (45 min)',
    description: 'Bénéficiez d\'un appel vidéo privé avec un formateur expert pour déboguer votre projet ou préparer vos entretiens.',
    costXp: 800,
    category: 'coaching',
    icon: 'Video'
  },
  {
    id: 'rew-2',
    title: 'Code Promo Formation Partenaire (-50%)',
    description: 'Une réduction exclusive valable sur n\'importe quelle certification professionnelle partenaire ITECH.',
    costXp: 500,
    category: 'discount',
    icon: 'Ticket'
  },
  {
    id: 'rew-3',
    title: 'Pack Goodies Academia ITECH',
    description: 'T-shirt brodé ITECH, stickers holographiques et carnet de notes développeur envoyés à domicile.',
    costXp: 1200,
    category: 'swag',
    icon: 'Package'
  },
  {
    id: 'rew-4',
    title: 'Badge Profil VIP "Grand Maître"',
    description: 'Affichez une aura dorée unique et le badge d\'élite sur tous les classements de la communauté.',
    costXp: 600,
    category: 'perk',
    icon: 'Crown'
  }
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 'user-top1',
    name: 'Amina Diallo',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    centerName: 'Dakar AI & Cyber Institute',
    xp: 2840,
    level: 7,
    rank: 1,
    badgesCount: 9,
    streakDays: 24
  },
  {
    id: 'user-top2',
    name: 'Youssef El Mansouri',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    centerName: 'Casablanca Tech Lab',
    xp: 2490,
    level: 6,
    rank: 2,
    badgesCount: 7,
    streakDays: 19
  },
  {
    id: 'user-top3',
    name: 'Claire Dupont',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    centerName: 'ITECH Campus Paris',
    xp: 2150,
    level: 5,
    rank: 3,
    badgesCount: 6,
    streakDays: 14
  },
  {
    id: 'user-top4',
    name: 'Landry K.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    centerName: 'ITECH Campus Paris',
    xp: 1450,
    level: 4,
    rank: 4,
    badgesCount: 4,
    streakDays: 7
  },
  {
    id: 'user-top5',
    name: 'Mamadou Touré',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    centerName: 'Dakar AI & Cyber Institute',
    xp: 1120,
    level: 3,
    rank: 5,
    badgesCount: 3,
    streakDays: 5
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'user-me',
  name: 'Landry K.',
  email: 'landrykibakweto123@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  role: 'learner',
  centerId: 'center-1',
  centerName: 'ITECH Campus Paris',
  xp: 1450,
  level: 4,
  streakDays: 7,
  lastActiveDate: new Date().toISOString(),
  enrolledCourseIds: ['course-ia-llm', 'course-cyber-sec'],
  completedLessonIds: ['les-101'],
  unlockedBadgeIds: ['badge-1', 'badge-2', 'badge-6'],
  earnedCertificates: [
    {
      id: 'cert-prev-001',
      certificateNumber: 'ITECH-CERT-2026-8941',
      courseId: 'course-ia-llm',
      courseTitle: 'Masterclass IA Générative, LLMs & Agents Autonomes',
      learnerId: 'user-me',
      learnerName: 'Landry K.',
      issueDate: '20 août 2026',
      gradePercentage: 96,
      distinction: 'Mention Très Bien',
      qrCodeData: 'https://academia-itech.edu/verify/ITECH-CERT-2026-8941',
      trainerName: 'Dr. Elena Rostova & Collège ITECH',
      centerName: 'ITECH Campus Paris'
    }
  ]
};

export const DEMO_PROFILES: UserProfile[] = [
  {
    id: 'user-me',
    name: 'Landry K.',
    email: 'landrykibakweto123@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'learner',
    centerId: 'center-1',
    centerName: 'ITECH Campus Paris',
    xp: 1450,
    level: 4,
    streakDays: 7,
    lastActiveDate: new Date().toISOString(),
    enrolledCourseIds: ['course-ia-llm', 'course-cyber-sec'],
    completedLessonIds: ['les-101'],
    unlockedBadgeIds: ['badge-1', 'badge-2', 'badge-6'],
    earnedCertificates: [
      {
        id: 'cert-prev-001',
        certificateNumber: 'ITECH-CERT-2026-8941',
        courseId: 'course-ia-llm',
        courseTitle: 'Masterclass IA Générative, LLMs & Agents Autonomes',
        learnerId: 'user-me',
        learnerName: 'Landry K.',
        issueDate: '20 août 2026',
        gradePercentage: 96,
        distinction: 'Mention Très Bien',
        qrCodeData: 'https://academia-itech.edu/verify/ITECH-CERT-2026-8941',
        trainerName: 'Dr. Elena Rostova & Collège ITECH',
        centerName: 'ITECH Campus Paris'
      }
    ]
  },
  {
    id: 'user-trainer-elena',
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@itech-paris.academy',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'trainer',
    centerId: 'center-1',
    centerName: 'ITECH Campus Paris',
    xp: 3820,
    level: 8,
    streakDays: 32,
    lastActiveDate: new Date().toISOString(),
    enrolledCourseIds: ['course-ia-llm', 'course-fullstack-cloud'],
    completedLessonIds: ['les-101', 'les-102', 'les-103'],
    unlockedBadgeIds: ['badge-1', 'badge-3', 'badge-4'],
    earnedCertificates: []
  },
  {
    id: 'user-admin-marc',
    name: 'Marc Lemoine',
    email: 'directeur@itech-paris.academy',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    role: 'center_admin',
    centerId: 'center-1',
    centerName: 'ITECH Campus Paris',
    xp: 4900,
    level: 10,
    streakDays: 45,
    lastActiveDate: new Date().toISOString(),
    enrolledCourseIds: ['course-ia-llm', 'course-cyber-sec', 'course-fullstack-cloud'],
    completedLessonIds: ['les-101', 'les-c101'],
    unlockedBadgeIds: ['badge-1', 'badge-2', 'badge-5'],
    earnedCertificates: []
  },
  {
    id: 'user-super-sarah',
    name: 'Sarah Jenkins',
    email: 'superadmin@academia-itech.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'super_admin',
    centerId: 'center-1',
    centerName: 'Siège International Academia ITECH',
    xp: 9990,
    level: 20,
    streakDays: 120,
    lastActiveDate: new Date().toISOString(),
    enrolledCourseIds: ['course-ia-llm', 'course-cyber-sec', 'course-fullstack-cloud'],
    completedLessonIds: ['les-101', 'les-102', 'les-103', 'les-c101'],
    unlockedBadgeIds: ['badge-1', 'badge-2', 'badge-3', 'badge-4', 'badge-5', 'badge-6'],
    earnedCertificates: []
  }
];

export const INITIAL_CURRENT_USER = INITIAL_USER_PROFILE;

