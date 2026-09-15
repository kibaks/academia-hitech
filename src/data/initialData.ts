import { Course, Badge, Center, RewardItem, LeaderboardUser, UserProfile, Trainer } from '../types';
import {
  INITIAL_COURSE_VIDEO_PROJECT,
  CARTOON_AI_ODYSSEY_PROJECT,
  CARTOON_WHITEBOARD_CLOUD_PROJECT,
  CARTOON_SAFETY_HEROES_PROJECT,
  CARTOON_FINTECH_MAGIC_COIN_PROJECT,
  CARTOON_KIDS_CODING_PROJECT,
} from './videoProjectsData';

export const INITIAL_TRAINERS: Trainer[] = [
  {
    id: 'trainer-fatou-s',
    name: 'Fatou Sow',
    email: 'fatou.sow@dakar-ai.tech',
    specialty: 'Intelligence Artificielle & NLP Langues Africaines',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    bio: 'Lead Chercheuse IA Panafricaine, spécialiste des grands modèles de langage appliqués aux dialectes et langues nationales africaines.',
    coursesAssigned: ['course-ia-llm'],
    rating: 4.98,
    status: 'active'
  },
  {
    id: 'trainer-landry-b',
    name: 'Dr. Landry Bakweto',
    email: 'landry.bakweto@kinshasa-tech.cd',
    specialty: 'Systèmes Distribués & Cloud Hybride',
    avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=300&auto=format&fit=crop&q=80',
    bio: 'Professeur agrégé en informatique (Kinshasa), consultant en architectures de calcul résilientes et réseaux à faible latence.',
    coursesAssigned: ['course-fullstack-cloud'],
    rating: 4.95,
    status: 'active'
  },
  {
    id: 'trainer-amina-d',
    name: 'Amina Diallo',
    email: 'amina.diallo@abidjan-fintech.ci',
    specialty: 'Fintech, Mobile Money & Sécurité des Transactions',
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=300&auto=format&fit=crop&q=80',
    bio: 'Directrice R&D Fintech à Abidjan, architecte de passerelles de paiement bancaire et solutions de microfinance par téléphone mobile.',
    coursesAssigned: ['course-fintech-africa'],
    rating: 4.94,
    status: 'active'
  },
  {
    id: 'trainer-malik-k',
    name: 'Malik Konaté',
    email: 'malik.konate@dakar-ai.tech',
    specialty: 'Cybersécurité Offensive & Protection des Données',
    avatar: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=300&auto=format&fit=crop&q=80',
    bio: 'Consultant SOC certifié CISSP et OSCP, intervenant international sur la sécurité des banques et infrastructures gouvernementales.',
    coursesAssigned: ['course-cyber-sec'],
    rating: 4.91,
    status: 'active'
  }
];

export const INITIAL_CENTERS: Center[] = [
  {
    id: 'center-1',
    name: 'Kinshasa Silicon River & Digital Campus',
    slug: 'kinshasa-tech',
    subdomain: 'kinshasa',
    logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    primaryColor: '#0ea5e9',
    subscriptionPlan: 'enterprise',
    plan: 'enterprise',
    trainerCount: 16,
    studentCount: 1850,
    studentsCount: 1850,
    maxStudents: 5000,
    courseCount: 32,
    createdAt: '2025-01-10',
    isVerified: true,
    contactEmail: 'contact@kinshasa-tech.cd',
    description: 'Pôle technologique d\'excellence en RDC : Intelligence Artificielle, Cloud Résilient et Génie Logiciel de classe mondiale.',
    customDomain: 'campus.kinshasa-tech.cd',
    trainers: [INITIAL_TRAINERS[1]]
  },
  {
    id: 'center-2',
    name: 'Dakar AI & Cyber Hub',
    slug: 'dakar-ai',
    subdomain: 'dakar',
    logo: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=150&auto=format&fit=crop&q=80',
    primaryColor: '#10b981',
    subscriptionPlan: 'pro',
    plan: 'pro',
    trainerCount: 12,
    studentCount: 1240,
    studentsCount: 1240,
    maxStudents: 2500,
    courseCount: 24,
    createdAt: '2025-03-15',
    isVerified: true,
    contactEmail: 'admissions@dakar-ai.tech',
    description: 'Institut panafricain de formation avancée en modèles de langage (LLMs), traitement des langues africaines et cybersécurité offensive.',
    customDomain: 'dakar.academia-itech.com',
    trainers: [INITIAL_TRAINERS[0], INITIAL_TRAINERS[3]]
  },
  {
    id: 'center-3',
    name: 'Abidjan Fintech & Tech Lab',
    slug: 'abidjan-fintech',
    subdomain: 'abidjan',
    logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=150&auto=format&fit=crop&q=80',
    primaryColor: '#6366f1',
    subscriptionPlan: 'pro',
    plan: 'pro',
    trainerCount: 10,
    studentCount: 980,
    studentsCount: 980,
    maxStudents: 1500,
    courseCount: 18,
    createdAt: '2025-06-20',
    isVerified: true,
    contactEmail: 'info@abidjan-fintech.ci',
    description: 'Accélérateur de compétences en ingénierie financière digitale, Mobile Money, Web Fullstack et architectures Cloud en Afrique de l\'Ouest.',
    customDomain: 'abidjan.academia-itech.com',
    trainers: [INITIAL_TRAINERS[2]]
  },
  {
    id: 'center-4',
    name: 'Kigali Silicon Innovation Academy',
    slug: 'kigali-innovation',
    subdomain: 'kigali',
    logo: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=150&auto=format&fit=crop&q=80',
    primaryColor: '#f59e0b',
    subscriptionPlan: 'enterprise',
    plan: 'enterprise',
    trainerCount: 8,
    studentCount: 750,
    studentsCount: 750,
    maxStudents: 2000,
    courseCount: 15,
    createdAt: '2025-08-01',
    isVerified: true,
    contactEmail: 'campus@kigali-tech.rw',
    description: 'Hub high-tech connecté d\'Afrique de l\'Est pour l\'IoT, l\'intelligence artificielle embarquée et la ville intelligente.',
    customDomain: 'kigali.academia-itech.com',
    trainers: [INITIAL_TRAINERS[1]]
  }
];

export const INITIAL_CENTRES = INITIAL_CENTERS;

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-1',
    title: 'Pionnier IA Africaine',
    description: 'A généré et complété son premier module assisté par IA en contexte panafricain',
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
    title: 'Architecte Fullstack & Cloud',
    description: 'A validé la certification avancée en développement web résilient et APIs',
    icon: 'Code2',
    category: 'course',
    rarity: 'epic'
  },
  {
    id: 'badge-5',
    title: 'Sentinelle Cyber Panafricaine',
    description: 'A complété les défis d\'analyse de vulnérabilités et sécurité offensive',
    icon: 'ShieldCheck',
    category: 'special',
    rarity: 'legendary'
  },
  {
    id: 'badge-6',
    title: 'Maître des 1000 XP',
    description: 'A franchi le cap symbolique du millier d\'XP sur Academia ITECH',
    icon: 'Sparkles',
    category: 'xp',
    rarity: 'common'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-cartoon-ai-odyssey',
    title: 'L\'Odyssée de l\'Intelligence Artificielle en Dessin Animé Illustratif',
    slug: 'odyssee-ia-dessin-anime-illustre',
    category: 'ia_data',
    level: 'Débutant',
    rating: 5.0,
    reviewCount: 420,
    studentCount: 2350,
    durationHours: 6.5,
    price: 0,
    pricingType: 'free',
    isFeatured: true,
    isNew: true,
    hasCertificate: true,
    authorId: 'trainer-nia-ai',
    authorName: 'Professeure Nia & Milo le Robot',
    authorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80',
    authorRole: 'Formatrice Pédagogique & Spécialiste Dessin Animé 2D',
    centerId: 'center-1',
    centerName: 'Kinshasa Silicon River & Digital Campus',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80',
    shortDescription: 'Découvrez l\'IA, le Cloud, la Sécurité et la Fintech à travers des leçons animées 2D, des mascottes expressives et des quiz interactifs sans complexité de montage.',
    description: 'Une formation conçue sous forme de dessin animé pédagogique propre et moderne. Chaque concept est vulgarisé par des mascottes 2D attachantes (Professeure Nia, Milo le Robot, Leo l\'Explorateur, Zack Sécurité, Amina Diallo). Les apprenants suivent les leçons vidéo animées de façon fluide, rythmée par des quiz de validation en direct sans accès ni distraction d\'outils de montage.',
    tags: ['Dessin Animé', 'Illustration 2D', 'IA Débutant', 'Pédagogie Visuelle', 'Tableau Blanc', 'Academia ITECH'],
    skillsGained: [
      'Compréhension intuitive des réseaux de neurones',
      'Visualisation des architectures Cloud et datacenters',
      'Maîtrise des réflexes de cybersécurité en entreprise',
      'Principes de la monnaie numérique et mobile money'
    ],
    chapters: [
      {
        id: 'chap-cartoon-1',
        title: 'Module 1 : Le Réveil de l\'IA & les Réseaux de Neurones',
        description: 'Introduction animée avec la Professeure Nia et son assistant robot Milo',
        lessons: [
          {
            id: 'les-cartoon-101',
            title: '1.1 L\'Odyssée de l\'IA : Comment une machine apprend-elle ? (Dessin Animé)',
            durationMinutes: 12,
            type: 'video_project',
            videoProjectData: CARTOON_AI_ODYSSEY_PROJECT,
            content: `### 🎨 L'Odyssée de l'Intelligence Artificielle\n\nBienvenue dans ce cours animé ! Suivez la **Professeure Nia** et son assistant **Milo le Robot** pour explorer le fonctionnement fascinant des réseaux de neurones.\n\n#### Points clés abordés dans la vidéo :\n- **Le neurone artificiel** : de l'entrée pondérée au signal d'activation.\n- **L'entraînement par l'exemple** : comment l'IA ajuste ses poids pour reconnaître des motifs.\n- **Arrêt Quiz interactif** : testez vos acquis en direct pendant la vidéo !\n\n*Conçu pour une immersion totale de l'apprenant sans distraction de montage.*`,
          },
          {
            id: 'les-cartoon-102',
            title: '1.2 Le Cloud & les Réseaux Expliqués en Whiteboard Doodle par Leo',
            durationMinutes: 10,
            type: 'video_project',
            videoProjectData: CARTOON_WHITEBOARD_CLOUD_PROJECT,
            content: `### 🖍️ Le Cloud Computing sur Tableau Blanc Doodle\n\nAvec **Leo l'Explorateur**, découvrez pourquoi le "Cloud" n'est pas un nuage magique mais un réseau mondial interconnecté de centres de données.\n\n#### Au programme :\n- Datacenters & câbles sous-marins\n- Haute disponibilité et redondance\n- Quiz de validation au milieu de la capsule`,
          }
        ]
      },
      {
        id: 'chap-cartoon-2',
        title: 'Module 2 : Sécurité, Fintech & Pratique du Code en BD',
        description: 'Vignettes interactives, bandes dessinées pédagogiques et algorithmes pour tous',
        lessons: [
          {
            id: 'les-cartoon-201',
            title: '2.1 Les Héros de la Sécurité Usine & Numérique en Bande Dessinée',
            durationMinutes: 15,
            type: 'video_project',
            videoProjectData: CARTOON_SAFETY_HEROES_PROJECT,
            content: `### 🛡️ Les Héros de la Sécurité avec Zack le Gardien\n\nFormat bande dessinée aux couleurs vives : apprenez les règles d'or de la protection industrielle et de la cybersécurité des infrastructures.`,
          },
          {
            id: 'les-cartoon-202',
            title: '2.2 La Pièce Magique : Fintech & Mobile Money par Amina',
            durationMinutes: 12,
            type: 'video_project',
            videoProjectData: CARTOON_FINTECH_MAGIC_COIN_PROJECT,
            content: `### 💳 Fintech & Mobile Money en 2D Vectorielle\n\nSuivez Amina pour comprendre les flux financiers numériques, l'idempotence et les passerelles de paiement sécurisées.`,
          },
          {
            id: 'les-cartoon-203',
            title: '2.3 Premiers Pas en Algorithmique avec Maya la Codeuse',
            durationMinutes: 14,
            type: 'video_project',
            videoProjectData: CARTOON_KIDS_CODING_PROJECT,
            content: `### 💻 Logique & Algorithmique Débutant\n\nMaya vous guide pas à pas dans la création de boucles, conditions et fonctions à travers des exemples visuels ludiques.`,
          }
        ]
      }
    ],
    finalQuiz: {
      id: 'quiz-cartoon-final',
      title: 'Certification Fondations de l\'IA & Culture Numérique Animée',
      description: 'Grand quiz récapitulatif avec badge certifié.',
      courseId: 'course-cartoon-ai-odyssey',
      passingScore: 80,
      timeLimitMinutes: 15,
      xpReward: 350,
      questions: [
        {
          id: 'q-cart-1',
          question: 'Dans un réseau de neurones illustré, quel est le rôle d\'un poids synaptique ?',
          options: [
            'Il détermine l\'importance accordée à chaque information entrante',
            'Il mesure la vitesse du ventilateur de l\'ordinateur',
            'Il stocke l\'historique du navigateur',
            'Il chiffre le mot de passe utilisateur'
          ],
          correctIndex: 0,
          points: 10,
          explanation: 'Les poids synaptiques quantifient la force de connexion entre neurones et s\'ajustent pendant l\'apprentissage.'
        },
        {
          id: 'q-cart-2',
          question: 'Que représente le "Cloud" dans la vidéo de Leo ?',
          options: [
            'De l\'eau condensée dans l\'atmosphère',
            'Un réseau mondial de serveurs physiques reliés par fibres optiques',
            'Un superordinateur sur la Lune',
            'Une clé USB magique sans matériel'
          ],
          correctIndex: 1,
          points: 10,
          explanation: 'Le Cloud repose sur des infrastructures physiques concrètes réparties dans le monde.'
        }
      ]
    }
  },
  {
    id: 'course-ia-llm',
    title: 'Masterclass IA Générative, LLMs & Traitement des Langues Africaines (NLP)',
    slug: 'masterclass-ia-generative-llm-afrique',
    category: 'ia_data',
    level: 'Avancé',
    rating: 4.96,
    reviewCount: 384,
    studentCount: 1820,
    durationHours: 24.5,
    price: 45, // In baseline USD, dynamically converted to CDF, FCFA, NGN, etc.
    originalPrice: 85,
    pricingType: 'paid',
    isFeatured: true,
    isNew: true,
    hasCertificate: true,
    authorId: 'trainer-fatou-s',
    authorName: 'Fatou Sow',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    authorRole: 'Lead Chercheuse IA & NLP Panafricain',
    centerId: 'center-2',
    centerName: 'Dakar AI & Cyber Hub',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    shortDescription: 'Maîtrisez l\'architecture des Transformers, le Fine-Tuning de LLMs open-source, les bases vectorielles RAG et l\'adaptation aux langues africaines (Lingala, Swahili, Wolof).',
    description: 'Une formation d\'excellence conçue pour former l\'élite des ingénieurs IA en Afrique. Vous apprendrez à concevoir des architectures RAG robustes, à optimiser des modèles sur du matériel local, et à développer des solutions d\'IA adaptées aux réalités linguistiques et économiques du continent.',
    tags: ['Intelligence Artificielle', 'NLP', 'Lingala', 'Swahili', 'Transformers', 'RAG', 'Python', 'Gemini'],
    skillsGained: [
      'Conception d\'architectures RAG d\'entreprise',
      'Fine-Tuning de modèles pour langues africaines',
      'Optimisation de prompts (CoT, ReAct)',
      'Déploiement d\'agents IA autonomes'
    ],
    chapters: [
      {
        id: 'chap-1',
        title: 'Module 1 : Fondations des Transformers & NLP Multilingue Africain',
        description: 'Mécanismes d\'attention, tokenisation des langues à faible ressource et embeddings',
        lessons: [
          {
            id: 'les-101',
            title: '1.1 Architecture Transformer : Self-Attention & Multi-Head Attention',
            durationMinutes: 18,
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            videoProjectData: INITIAL_COURSE_VIDEO_PROJECT,
            content: `### Comprendre le mécanisme d'Attention dans les Transformers

Le papier fondateur *"Attention Is All You Need"* (Vaswani et al., 2017) a révolutionné le traitement automatique du langage naturel (NLP).

#### Les Composants Clés :
1. **Self-Attention** : Permet au modèle d'attribuer des poids d'importance relatifs à chaque mot de la séquence par rapport aux autres.
2. **Positional Encoding** : Injecte l'ordre des tokens dans la représentation vectorielle.
3. **Multi-Head Attention** : Apprend simultanément plusieurs aspects relationnels (syntaxe, sémantique, coréférences en Lingala, Swahili, Français).

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
              { id: 'res-1', title: 'Guide d\'architecture Transformers & NLP Africain (PDF)', url: '#', type: 'pdf', size: '2.4 MB' },
              { id: 'res-2', title: 'Notebook Jupyter : Tokenisation Swahili & Lingala', url: '#', type: 'code', size: '28 KB' }
            ],
            allowPreview: true,
          },
          {
            id: 'les-102',
            title: '1.2 Prompt Engineering Avancé : Few-Shot, CoT (Chain-of-Thought) et ReAct',
            durationMinutes: 22,
            type: 'interactive_code',
            allowPreview: false,
            requiresPayment: true,
            prerequisites: ['les-101'],
            codeLanguage: 'python',
            codeStarter: `def build_cot_prompt(question: str, context: str) -> str:
    # TODO: Créez un prompt structuré en Chain-of-Thought
    system_rules = "Vous êtes un expert IA..."
    return f"{system_rules}\\n\\nContexte: {context}\\nQuestion: {question}"

print(build_cot_prompt("Comment optimiser un RAG pour les données en Lingala ?", "Indexation vectorielle et traduction sémantique."))`,
            codeSolution: `def build_cot_prompt(question: str, context: str) -> str:
    prompt = f"""[Système : Expert IA Academia ITECH]
Règle : Réfléchis étape par étape avant de donner ta réponse finale.
1. Analyse le contexte fourni et les particularités linguistiques
2. Identifie les contraintes de mémoire et d'indexation
3. Formule le plan de réponse

Contexte : {context}
Question : {question}
Réflexion pas-à-pas :"""
    return prompt

print(build_cot_prompt("Comment optimiser un RAG pour les données en Lingala ?", "Indexation vectorielle bilingue."))`,
            content: `### Techniques de Prompting Avancé
Le **Chain-of-Thought (CoT)** oblige le modèle à générer des étapes intermédiaires de raisonnement avant de produire la réponse finale. Cela réduit drastiquement les hallucinations et augmente la précision sur les requêtes complexes.`
          },
          {
            id: 'les-103',
            title: '1.3 RAG (Retrieval-Augmented Generation) & Bases Vectorielles',
            durationMinutes: 25,
            type: 'article',
            allowPreview: false,
            requiresPayment: true,
            prerequisites: ['les-102'],
            quizId: 'quiz-llm-checkpoint',
            requiredQuizScore: 80,
            content: `### Architecture RAG d'Entreprise en Afrique
Le RAG combine un système de recherche sémantique avec la puissance générative du LLM pour interroger des bases documentaires locales sans avoir à ré-entraîner le modèle à coût prohibitif.`
          }
        ],
        checkpointQuiz: {
          id: 'quiz-llm-checkpoint',
          title: 'Quiz de Validation Étape 1 : Attention & Prompting (Seuil : 80%)',
          description: 'Validation impérative à 80% minimum pour débloquer la leçon 1.3 sur le RAG et les bases vectorielles.',
          courseId: 'course-ia-llm',
          passingScore: 80,
          timeLimitMinutes: 10,
          xpReward: 200,
          questions: [
            {
              id: 'qc-1',
              question: 'Quel est l\'impact fondamental du Chain-of-Thought (CoT) sur les modèles de langage ?',
              options: [
                'Il accélère le GPU en diminuant la mémoire',
                'Il réduit drastiquement les hallucinations en forçant des étapes de déduction logique explicites',
                'Il convertit le texte en binaire',
                'Il interdit les requêtes en langues locales'
              ],
              correctIndex: 1,
              explanation: 'Le CoT guide le modèle à travers des étapes intermédiaires de raisonnement, renforçant la fiabilité sur les calculs et la logique.',
              points: 50
            },
            {
              id: 'qc-2',
              question: 'Pour adapter un tokenizer aux langues africaines (Swahili, Lingala), que faut-il optimiser en priorité ?',
              options: [
                'La mémoire RAM de l\'ordinateur client',
                'Le vocabulaire de sous-mots (BPE / SentencePiece) pour éviter la sur-segmentation des affixes bantous',
                'La résolution de l\'écran',
                'Désactiver le protocole HTTPS'
              ],
              correctIndex: 1,
              explanation: 'Un vocabulaire de tokens optimisé évite qu\'un mot commun comme "tokoloba" soit morcelé en 5 fragments inefficaces.',
              points: 50
            }
          ]
        }
      }
    ],
    finalQuiz: {
      id: 'quiz-ia-mastery',
      title: 'Évaluation Finale : Certification IA & NLP Panafricain',
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
          explanation: 'Le Re-ranking affine la liste des documents récupérés par la recherche vectorielle afin de maximiser la pertinence sémantique.',
          points: 25
        }
      ]
    }
  },
  {
    id: 'course-fintech-africa',
    title: 'Ingénierie Fintech & Systèmes Mobile Money en Afrique (Wave, M-Pesa, Orange Money & APIs)',
    slug: 'fintech-mobile-money-afrique',
    category: 'business',
    level: 'Intermédiaire',
    rating: 4.94,
    reviewCount: 312,
    studentCount: 1560,
    durationHours: 20.0,
    price: 35,
    originalPrice: 60,
    pricingType: 'paid',
    isFeatured: true,
    isNew: true,
    hasCertificate: true,
    authorId: 'trainer-amina-d',
    authorName: 'Amina Diallo',
    authorAvatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=300&auto=format&fit=crop&q=80',
    authorRole: 'Directrice R&D Fintech & Systèmes de Paiement',
    centerId: 'center-3',
    centerName: 'Abidjan Fintech & Tech Lab',
    thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
    shortDescription: 'Concevez des passerelles de paiement résilientes, intégrez les protocoles USSD, Webhooks sécurisés, réconciliation bancaire et KYC conforme aux réglementations régionales (BCEAO, BCC).',
    description: 'Une formation pratique et indispensable pour les développeurs et fondateurs tech en Afrique. Apprenez à intégrer les APIs de Mobile Money les plus utilisées sur le continent et à garantir une disponibilité 99.99% même lors des pics de transactions.',
    tags: ['Fintech', 'Mobile Money', 'M-Pesa', 'Orange Money', 'Wave', 'APIs', 'BCEAO', 'Sécurité'],
    skillsGained: [
      'Intégration d\'APIs Mobile Money (Wave, M-Pesa, Orange Money)',
      'Gestion des webhooks idempotents et réconciliation financière',
      'Sécurisation des transactions et conformité KYC/AML',
      'Architecture haute disponibilité pour paiements par USSD/Web'
    ],
    chapters: [
      {
        id: 'chap-ft1',
        title: 'Module 1 : Écosystème des Paiements Digitaux & Standards Africains',
        description: 'Protocoles bancaires, interopérabilité régionale et passerelles de paiement',
        lessons: [
          {
            id: 'les-ft101',
            title: '1.1 Architecture d\'une passerelle Mobile Money avec idempotence',
            durationMinutes: 24,
            type: 'video',
            allowPreview: true,
            content: `Comprendre le rôle des clés d'idempotence pour éviter les doubles débits lors des coupures réseau temporaires.`
          },
          {
            id: 'les-ft102',
            title: '1.2 Intégration C2B / B2C M-Pesa & Wave avec Webhooks signés HMAC',
            durationMinutes: 28,
            type: 'interactive_code',
            allowPreview: false,
            requiresPayment: true,
            prerequisites: ['les-ft101'],
            quizId: 'quiz-fintech',
            requiredQuizScore: 80,
            codeLanguage: 'typescript',
            codeStarter: `function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {\n  // TODO: Implémentez la vérification cryptographique HMAC-SHA256\n  return false;\n}`,
            content: `Sécurisez la réception des notifications de transfert Mobile Money (Wave, Orange, M-Pesa) pour éviter la falsification de paiements.`
          }
        ]
      }
    ],
    finalQuiz: {
      id: 'quiz-fintech',
      title: 'Quiz de Certification Fintech & Mobile Money',
      description: 'Validez votre maîtrise des passerelles de paiement et transactions bancaires en ligne.',
      courseId: 'course-fintech-africa',
      passingScore: 80,
      timeLimitMinutes: 12,
      xpReward: 320,
      questions: [
        {
          id: 'qft1',
          question: 'Pourquoi la clé d\'idempotence est-elle critique dans une API de paiement Mobile Money ?',
          options: [
            'Pour rendre l\'interface utilisateur plus jolie',
            'Pour empêcher qu\'une même transaction soit exécutée deux fois en cas de rejeu ou perte de connexion réseau',
            'Pour compresser les images des reçus',
            'Pour supprimer les frais de commission'
          ],
          correctIndex: 1,
          explanation: 'L\'idempotence garantit qu\'une requête répétée avec la même clé produit exactement le même résultat sans déclencher un nouveau débit sur le compte du client.',
          points: 50
        }
      ]
    }
  },
  {
    id: 'course-cyber-sec',
    title: 'Cybersécurité Offensive, Audit Bancaire & Défense des Infrastructures Africaines',
    slug: 'cybersecurite-offensive-defense-afrique',
    category: 'cybersecurity',
    level: 'Tous niveaux',
    rating: 4.88,
    reviewCount: 245,
    studentCount: 1420,
    durationHours: 21.0,
    price: 50,
    pricingType: 'subscription',
    subscriptionPlanRequired: 'all',
    isFeatured: true,
    isNew: false,
    hasCertificate: true,
    authorId: 'trainer-malik-k',
    authorName: 'Malik Konaté',
    authorAvatar: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=300&auto=format&fit=crop&q=80',
    authorRole: 'Ethical Hacker & Consultant SOC Certifié CISSP',
    centerId: 'center-2',
    centerName: 'Dakar AI & Cyber Hub',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
    shortDescription: 'Apprenez les tests d\'intrusion (Pentesting), la sécurisation des systèmes financiers, l\'analyse de malwares et la conformité aux directives de cybersécurité régionales.',
    description: 'Une immersion complète dans la sécurité informatique moderne. Maîtrisez le framework MITRE ATT&CK, sécurisez les APIs bancaires et simulez des attaques Red Team / Blue Team en environnement contrôlé.',
    tags: ['Cybersécurité', 'Pentest', 'OWASP', 'Linux', 'Ethical Hacking', 'SOC', 'Banque'],
    skillsGained: ['Audit de sécurité applicative', 'Sécurisation des réseaux & API', 'Analyse de logs & SIEM', 'Rétro-ingénierie'],
    chapters: [
      {
        id: 'chap-c1',
        title: 'Module 1 : Cartographie des Menaces & OWASP Top 10',
        description: 'Identifier et corriger les vulnérabilités applicatives majeures',
        lessons: [
          {
            id: 'les-c101',
            title: '1.1 Découverte des injections SQL, failles d\'authentification et API abuse',
            durationMinutes: 20,
            type: 'video',
            content: `Analyse détaillée des failles d'injection et méthodes de remédiation par requêtes préparées.`
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
          question: 'Quelle est la meilleure défense contre les injections SQL sur une API bancaire ?',
          options: [
            'Chiffrer le mot de passe dans le code HTML',
            'Utiliser des requêtes préparées et paramétrées (Prepared Statements / ORM)',
            'Augmenter la taille du disque dur',
            'Désactiver le protocole HTTPS'
          ],
          correctIndex: 1,
          explanation: 'Les requêtes préparées garantissent que les entrées utilisateur sont traitées comme des données pures.',
          points: 50
        }
      ]
    }
  },
  {
    id: 'course-fullstack-cloud',
    title: 'Architecture Fullstack Moderne, Offline-First & Cloud Hybride (React 19, Node.js & Docker)',
    slug: 'architecture-fullstack-offline-first-cloud',
    category: 'development',
    level: 'Intermédiaire',
    rating: 4.95,
    reviewCount: 520,
    studentCount: 2680,
    durationHours: 26.0,
    price: 40,
    originalPrice: 75,
    pricingType: 'paid',
    isFeatured: true,
    isNew: false,
    hasCertificate: true,
    authorId: 'trainer-landry-b',
    authorName: 'Dr. Landry Bakweto',
    authorAvatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=300&auto=format&fit=crop&q=80',
    authorRole: 'Professeur Agrégé & Architecte Systèmes Distribués',
    centerId: 'center-1',
    centerName: 'Kinshasa Silicon River & Digital Campus',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    shortDescription: 'Concevez des applications web ultra-rapides conçues pour fonctionner même en réseau intermittent (Offline-First, Service Workers, IndexedDB, Docker & CI/CD).',
    description: 'Devenez un ingénieur Fullstack chevronné capable de déployer des applications d\'envergure internationale adaptées aux contextes de connectivité variés.',
    tags: ['React 19', 'TypeScript', 'Node.js', 'Docker', 'Offline-First', 'PWA', 'PostgreSQL'],
    skillsGained: ['Architecture Offline-First & Sync', 'React 19 Server Components', 'Conteneurisation Docker', 'Optimisation Performance'],
    chapters: [
      {
        id: 'chap-f1',
        title: 'Module 1 : Principes Avancés de React et State Management',
        description: 'Optimisation du rendu et hooks personnalisés',
        lessons: [
          {
            id: 'les-f101',
            title: '1.1 Architecture Offline-First avec IndexedDB et synchronisation de fond',
            durationMinutes: 22,
            type: 'video',
            content: `Comment concevoir une application web réactive et résiliente aux micro-coupures de connexion.`
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
          question: 'Quel est l\'intérêt fondamental d\'une architecture "Offline-First" ?',
          options: [
            'Permettre à l\'utilisateur d\'interagir sans blocage même sans connexion internet, avec synchronisation automatique au rétablissement du réseau',
            'Ralentir la vitesse de chargement',
            'Supprimer les bases de données',
            'Remplacer les serveurs web'
          ],
          correctIndex: 0,
          explanation: 'L\'Offline-First garantit une expérience utilisateur fluide en écrivant d\'abord dans le stockage local avant de propager les mutations.',
          points: 50
        }
      ]
    }
  },
  {
    id: 'course-python-libre',
    title: 'Initiation à Python & Algorithmique Fondamentale (Programme Ouvert)',
    slug: 'python-algorithmique-fondamentaux',
    category: 'development',
    level: 'Débutant',
    rating: 4.92,
    reviewCount: 680,
    studentCount: 3450,
    durationHours: 12.0,
    price: 0,
    pricingType: 'free',
    isFeatured: false,
    isNew: true,
    hasCertificate: true,
    authorId: 'trainer-landry-b',
    authorName: 'Dr. Landry Bakweto',
    authorAvatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=300&auto=format&fit=crop&q=80',
    authorRole: 'Professeur Agrégé & Architecte Systèmes Distribués',
    centerId: 'center-1',
    centerName: 'Kinshasa Silicon River & Digital Campus',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&auto=format&fit=crop&q=80',
    shortDescription: 'Apprenez les bases de la programmation avec Python : variables, boucles, structures de données, fonctions et premiers scripts automatisés.',
    description: 'Une formation 100% gratuite accessible à tous pour débuter dans le numérique et préparer son entrée dans les filières IA ou Génie Logiciel.',
    tags: ['Python', 'Débutant', 'Algorithmes', 'Code Libre', 'Gratuit'],
    skillsGained: ['Syntaxe Python moderne', 'Structures de données', 'Pensée algorithmique', 'Résolution de problèmes'],
    chapters: [
      {
        id: 'chap-py1',
        title: 'Module 1 : Prise en main de Python et Logique de Code',
        description: 'Variables, types de données et opérations',
        lessons: [
          {
            id: 'les-py101',
            title: '1.1 Premier programme Python et syntaxe propre',
            durationMinutes: 15,
            type: 'video',
            content: 'Découvrir Python, l\'interpréteur et la fonction print.'
          }
        ]
      }
    ],
    finalQuiz: {
      id: 'quiz-python-open',
      title: 'Test d\'Aptitude Python Fondations',
      description: 'Validez votre certificat débutant gratuit.',
      courseId: 'course-python-libre',
      passingScore: 70,
      timeLimitMinutes: 10,
      xpReward: 200,
      questions: [
        {
          id: 'qpy1',
          question: 'Comment déclare-t-on une liste en Python ?',
          options: ['[1, 2, 3]', '{1, 2, 3}', '(1, 2, 3)', '<1, 2, 3>'],
          correctIndex: 0,
          explanation: 'Les crochets [] définissent une liste ordonnée et modifiable en Python.',
          points: 50
        }
      ]
    }
  },
  {
    id: 'course-devops-cloud',
    title: 'DevOps Panafricain : Kubernetes, Terraform & CI/CD Multi-Cloud',
    slug: 'devops-kubernetes-terraform-afrique',
    category: 'cloud_devops',
    level: 'Avancé',
    rating: 4.97,
    reviewCount: 198,
    studentCount: 920,
    durationHours: 28.0,
    price: 65,
    pricingType: 'subscription',
    subscriptionPlanRequired: 'all',
    isFeatured: true,
    isNew: true,
    hasCertificate: true,
    authorId: 'trainer-landry-b',
    authorName: 'Dr. Landry Bakweto',
    authorAvatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=300&auto=format&fit=crop&q=80',
    authorRole: 'Professeur Agrégé & Architecte Systèmes Distribués',
    centerId: 'center-1',
    centerName: 'Kinshasa Silicon River & Digital Campus',
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    shortDescription: 'Maîtrisez l\'orchestration de conteneurs avec Kubernetes, l\'Infrastructure as Code avec Terraform et les pipelines CI/CD résilients sur GCP & AWS.',
    description: 'Une formation réservée aux membres avec abonnement Pass Mensuel ou Pass Annuel. Préparez les certifications CKA et devenez un pilier de l\'infrastructure cloud.',
    tags: ['DevOps', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Abonnement', 'Cloud'],
    skillsGained: ['Déploiement de clusters Kubernetes', 'Pipelines GitOps automatisés', 'Monitoring Prometheus & Grafana', 'Infrastructure as Code'],
    chapters: [
      {
        id: 'chap-k8s1',
        title: 'Module 1 : Architecture Kubernetes en Production',
        description: 'Pods, Deployments, Services et Ingress Controllers',
        lessons: [
          {
            id: 'les-k8s101',
            title: '1.1 Déployer un cluster résilient et auto-cicatrisant',
            durationMinutes: 30,
            type: 'video',
            content: 'Découvrir le Control Plane Kubernetes, etiket les workers et configurer les probes.'
          }
        ]
      }
    ],
    finalQuiz: {
      id: 'quiz-devops-cert',
      title: 'Quiz de Certification DevOps & Kubernetes',
      description: 'Validez votre compétence Cloud Master.',
      courseId: 'course-devops-cloud',
      passingScore: 80,
      timeLimitMinutes: 15,
      xpReward: 400,
      questions: [
        {
          id: 'qk8s1',
          question: 'Quel composant du Control Plane Kubernetes stocke l\'état complet du cluster ?',
          options: ['kube-proxy', 'etcd', 'kubelet', 'containerd'],
          correctIndex: 1,
          explanation: 'etcd est la base clé-valeur distribuée et hautement disponible stockant tout l\'état de Kubernetes.',
          points: 50
        }
      ]
    }
  },
  // =========================================================================
  // COURS EXEMPLE 1 : CONDITIONNÉ À LA CONNEXION + ABONNEMENT PASS PRO
  // =========================================================================
  {
    id: 'course-cloud-k8s-subscription',
    title: 'Masterclass Architecte Cloud Native & Kubernetes (Réservé Pass Abonnement Pro)',
    slug: 'architecte-cloud-kubernetes-pass-pro',
    category: 'cloud_devops',
    level: 'Avancé',
    rating: 4.97,
    reviewCount: 240,
    studentCount: 1120,
    durationHours: 32.0,
    price: 49,
    originalPrice: 99,
    pricingType: 'subscription',
    subscriptionPlanRequired: 'pro',
    requiresLogin: true,
    isFeatured: true,
    isNew: true,
    hasCertificate: true,
    authorId: 'trainer-landry-b',
    authorName: 'Dr. Landry Bakweto',
    authorAvatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=300&auto=format&fit=crop&q=80',
    authorRole: 'Professeur Agrégé en Systèmes Distribués & Cloud',
    centerId: 'center-1',
    centerName: 'Kinshasa Silicon River & Digital Campus',
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    shortDescription: 'Ce programme d\'élite exige une connexion authentifiée et un abonnement Pass Pro actif pour accéder aux clusters dédiés et pipelines GitOps.',
    description: 'Une formation haut niveau pour concevoir des infrastructures résilientes, des maillages de services (Istio) et des déploiements Kubernetes multi-cloud à haute disponibilité en Afrique subsaharienne et à l\'international.',
    tags: ['Kubernetes', 'Abonnement', 'Pass Pro', 'Docker', 'GitOps', 'ArgoCD', 'Cloud'],
    skillsGained: [
      'Déploiement de clusters Kubernetes haute disponibilité',
      'Orchestration GitOps avec ArgoCD & Helm',
      'Sécurisation des secrets et politiques réseau Cilium',
      'Monitoring d\'infrastructures distribuées avec Prometheus & Grafana'
    ],
    chapters: [
      {
        id: 'chap-k8s-sub1',
        title: 'Module 1 : Architecture du Control Plane & Topologies Résilientes',
        description: 'Conception d\'un cluster d\'entreprise multi-maîtres avec etcd distribué',
        lessons: [
          {
            id: 'les-k8s-sub101',
            title: '1.1 Fondamentaux de la haute disponibilité Kubernetes (Aperçu ouvert)',
            durationMinutes: 20,
            type: 'video',
            allowPreview: true,
            requiresPayment: false,
            content: `### Architecture Kubernetes Haute Disponibilité
Ce module introductif présente les concepts de base du Control Plane (API Server, Controller Manager, Scheduler, etcd) et les mécanismes de quorum Raft.`
          },
          {
            id: 'les-k8s-sub102',
            title: '1.2 Déploiement d\'un cluster de production avec Ingress & Cert-Manager (Pass Pro Requis)',
            durationMinutes: 35,
            type: 'interactive_code',
            allowPreview: false,
            requiresPayment: true,
            requiresSubscription: true,
            codeLanguage: 'yaml',
            codeStarter: `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: core-ingress-api\nspec:\n  replicas: 3\n  # Complétez la spec pour haute disponibilité...`,
            content: `Configuration de certificats Let's Encrypt automatisés avec ACME et équilibrage de charge via Ingress Controller.`
          }
        ]
      }
    ],
    finalQuiz: {
      id: 'quiz-k8s-sub-final',
      title: 'Certification Architecte Kubernetes Cloud Native',
      description: 'Évaluation finale pour valider votre titre d\'Architecte Kubernetes certifié.',
      courseId: 'course-cloud-k8s-subscription',
      passingScore: 80,
      timeLimitMinutes: 20,
      xpReward: 450,
      questions: [
        {
          id: 'qk8s-1',
          question: 'Comment Kubernetes maintient-il le quorum dans un cluster etcd à 3 nœuds ?',
          options: [
            'Il requiert au moins 2 nœuds actifs pour valider une écriture (majorité absolue (N/2)+1)',
            'Un seul nœud suffit quel que soit l\'état des autres',
            'Il fait appel à un serveur DNS externe',
            'Les écritures sont stockées en mémoire tampon sans quorum'
          ],
          correctIndex: 0,
          explanation: 'Dans l\'algorithme Raft, un cluster de 3 nœuds tolère la perte d\'1 nœud car 2 nœuds forment la majorité (quorum = 2).',
          points: 50
        },
        {
          id: 'qk8s-2',
          question: 'Quelle ressource Kubernetes définit la communication réseau autorisée entre Pods ?',
          options: ['NetworkPolicy', 'IngressRoute', 'ClusterRole', 'ServiceAccount'],
          correctIndex: 0,
          explanation: 'Les NetworkPolicies spécifient les règles de filtrage de paquets de couche 3/4 pour isoler les pods.',
          points: 50
        }
      ]
    }
  },

  // =========================================================================
  // COURS EXEMPLE 2 : LEÇONS SPÉCIFIQUES VERROUILLÉES POUR UN PAIEMENT À L'ACTE
  // =========================================================================
  {
    id: 'course-mobile-money-locked-lessons',
    title: 'Génie Logiciel & Intégration Mobile Money (Avec Leçons Ateliers Payantes à l\'Acte)',
    slug: 'genie-logiciel-mobile-money-lecons-payantes',
    category: 'business',
    level: 'Intermédiaire',
    rating: 4.93,
    reviewCount: 295,
    studentCount: 1420,
    durationHours: 22.0,
    price: 0, // Entrée gratuite pour les leçons théoriques, mais ateliers spécifiques verrouillés pour paiement
    pricingType: 'free',
    isFeatured: true,
    isNew: true,
    hasCertificate: true,
    authorId: 'trainer-amina-d',
    authorName: 'Amina Diallo',
    authorAvatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=300&auto=format&fit=crop&q=80',
    authorRole: 'Directrice R&D Systèmes de Paiement Panafricains',
    centerId: 'center-3',
    centerName: 'Abidjan Fintech & Tech Lab',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&auto=format&fit=crop&q=80',
    shortDescription: 'Programme modulaire : leçons théoriques ouvertes à tous, avec 2 ateliers pratiques avancés verrouillés nécessitant un paiement unitaire (5 $).',
    description: 'Apprenez à développer des passerelles de paiement sécurisées adaptées au contexte africain (M-Pesa, Wave, Orange Money). Les leçons fondamentales sont gratuites, et vous pouvez débloquer les ateliers de code en production à la carte pour 5 $ ou via le pass complet.',
    tags: ['Fintech', 'Mobile Money', 'Leçons Payantes', 'Wave', 'M-Pesa', 'Orange Money', 'Webhooks'],
    skillsGained: [
      'Architecture de passerelle de micro-paiement USSD et Web',
      'Sécurisation des webhooks de paiement avec signatures HMAC-SHA256',
      'Gestion de l\'idempotence contre les doubles débits',
      'Audit financier et réconciliation automatique des comptes'
    ],
    chapters: [
      {
        id: 'chap-mm-free',
        title: 'Module 1 : Fondements des Paiements Digitaux en Afrique (Accès Ouvert)',
        description: 'Comprendre l\'écosystème bancaire, la réglementation BCEAO et les flux C2B/B2C',
        lessons: [
          {
            id: 'les-mm-101',
            title: '1.1 Panorama des réseaux Mobile Money (M-Pesa, Wave, Orange, Airtel)',
            durationMinutes: 18,
            type: 'video',
            allowPreview: true,
            requiresPayment: false,
            content: `### Panorama des réseaux Mobile Money en Afrique
Analyse comparative des protocoles USSD, API REST et QR Code selon les zones économiques (UEMOA, CEMAC, Afrique de l'Est).`
          },
          {
            id: 'les-mm-102',
            title: '1.2 Spécifications des Webhooks et gestion des échecs réseau temporaires',
            durationMinutes: 22,
            type: 'article',
            allowPreview: true,
            requiresPayment: false,
            content: `### Résilience des notifications de paiement
Comment architecturer des files d'attente asynchrones (RabbitMQ, Redis) pour traiter les callbacks de paiement sans perte de paquets.`
          }
        ]
      },
      {
        id: 'chap-mm-paid',
        title: 'Module 2 : Ateliers Pratiques en Production (Leçons Premium Verrouillées)',
        description: 'Laboratoires de code avancés débloquables unitairement (5 $ par leçon) ou avec le Pass',
        lessons: [
          {
            id: 'les-mm-workshop-prod',
            title: '2.1 Atelier Code : Implémentation du Webhook C2B avec Anti-Replay & Idempotence',
            durationMinutes: 30,
            type: 'interactive_code',
            allowPreview: false,
            requiresPayment: true,
            lessonPrice: 5,
            isPremiumLocked: true,
            codeLanguage: 'typescript',
            codeStarter: `import crypto from 'crypto';\n\nexport function verifyMpesaSignature(payload: string, signature: string, secretKey: string): boolean {\n  // TODO: Implémentez la validation HMAC sécurisée\n  return false;\n}`,
            content: `### Atelier Pratique Débloqué : Signature Cryptographique & Idempotence
Cette leçon premium vous donne le code source complet et l'accès au simulateur OpenAPI pour tester en direct la réception des push STK M-Pesa.`
          },
          {
            id: 'les-mm-reconciliation-lab',
            title: '2.2 Laboratoire Virtuel : Réconciliation bancaire automatisée & Audit Trail BCEAO',
            durationMinutes: 35,
            type: 'article',
            allowPreview: false,
            requiresPayment: true,
            lessonPrice: 5,
            isPremiumLocked: true,
            content: `### Audit Trail & Réconciliation Automatisée
Système complet de comparaison des journaux de transactions télécoms et bancaires avec alerte d'écart en temps réel.`
          }
        ]
      }
    ],
    finalQuiz: {
      id: 'quiz-mm-cert',
      title: 'Évaluation Finale : Spécialiste Intégration Mobile Money',
      description: 'Validez vos compétences pour obtenir votre certificat officiel d\'ingénieur Fintech.',
      courseId: 'course-mobile-money-locked-lessons',
      passingScore: 75,
      timeLimitMinutes: 15,
      xpReward: 350,
      questions: [
        {
          id: 'qmm-1',
          question: 'Pourquoi la clé d\'idempotence est-elle indispensable lors d\'un appel API de débit Mobile Money ?',
          options: [
            'Pour chiffrer le mot de passe du client',
            'Pour garantir qu\'un retry réseau n\'exécute pas deux fois le même débit sur le compte du client',
            'Pour accélérer la connexion internet en 4G',
            'Pour envoyer un SMS marketing'
          ],
          correctIndex: 1,
          explanation: 'L\'idempotence garantit qu\'une requête répétée avec la même clé produit le même résultat sans créer de transaction additionnelle.',
          points: 50
        }
      ]
    }
  },

  // =========================================================================
  // COURS EXEMPLE 3 : ACCÈS CONDITIONNÉ PAR LA RÉUSSITE D'UN QUIZ D'ADMISSION (80%)
  // =========================================================================
  {
    id: 'course-cyber-advanced-quiz-conditioned',
    title: 'Bootcamp Expert Cybersécurité Offensive & Red Team (Admission : Quiz 80% requis)',
    slug: 'bootcamp-expert-cybersecurite-admission-quiz',
    category: 'cybersecurity',
    level: 'Avancé',
    rating: 4.98,
    reviewCount: 410,
    studentCount: 890,
    durationHours: 36.0,
    price: 39,
    originalPrice: 79,
    pricingType: 'paid',
    requiresLogin: true,
    prerequisiteQuizId: 'quiz-cyber-admission',
    prerequisiteQuizTitle: 'Épreuve d\'Admission : Fondamentaux Linux, Réseaux & Cryptographie (80% requis)',
    prerequisiteQuizMinScore: 80,
    isFeatured: true,
    isNew: true,
    hasCertificate: true,
    authorId: 'trainer-malik-k',
    authorName: 'Malik Konaté',
    authorAvatar: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=300&auto=format&fit=crop&q=80',
    authorRole: 'Consultant SOC Certifié CISSP & OSCP',
    centerId: 'center-2',
    centerName: 'Dakar AI & Cyber Hub',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    shortDescription: 'L\'accès à ce cursus d\'élite est verrouillé : vous devez impérativement obtenir au moins 80% au quiz d\'admission technique pour débloquer l\'inscription.',
    description: 'Formation intensive réservée aux profils ayant validé le test d\'entrée. Vous apprendrez le test d\'intrusion avancé, l\'analyse de malwares, la défense active de périmètre et la sécurité des infrastructures critiques.',
    tags: ['Cybersécurité', 'Admission Quiz', '80% Requis', 'Red Team', 'Pentest', 'Linux', 'SOC'],
    skillsGained: [
      'Tests d\'intrusion applicatifs et réseaux avancés',
      'Analyse de trafic chiffré et détection d\'anomalies IDS/IPS',
      'Élévation de privilèges Linux & Windows Active Directory',
      'Audit de conformité et durcissement de systèmes critiques'
    ],
    prerequisiteQuiz: {
      id: 'quiz-cyber-admission',
      title: 'Épreuve d\'Admission SOC & Pentest (Seuil éliminatoire : 80%)',
      description: 'Démontrez votre maîtrise des prérequis réseau et système pour débloquer l\'accès au Bootcamp Expert.',
      courseId: 'course-cyber-advanced-quiz-conditioned',
      passingScore: 80,
      timeLimitMinutes: 10,
      xpReward: 300,
      questions: [
        {
          id: 'qadm-1',
          question: 'Lors d\'un scan de ports SYN Stealth Scan (Nmap -sS), quelle est la particularité de la poignée de main TCP ?',
          options: [
            'La connexion TCP complète est établie puis fermée avec FIN',
            'Le scanner envoie un SYN, reçoit SYN-ACK puis envoie immédiatement un RST pour ne pas finaliser la connexion',
            'Le scan utilise uniquement le protocole UDP sur le port 53',
            'Le scanner bloque la carte réseau'
          ],
          correctIndex: 1,
          explanation: 'Le half-open scan (-sS) n\'établit jamais la connexion complète, réduisant la trace dans les journaux applicatifs standards.',
          points: 34
        },
        {
          id: 'qadm-2',
          question: 'Dans la commande Linux `chmod 4755 /usr/bin/script`, à quoi sert le bit 4 au début ?',
          options: [
            'Il rend le fichier en lecture seule pour root',
            'Il active le bit SUID (Set User ID) pour exécuter le binaire avec les privilèges du propriétaire',
            'Il chiffre le script en AES-256',
            'Il supprime le fichier après 4 jours'
          ],
          correctIndex: 1,
          explanation: 'Le bit SUID (valeur 4) permet à tout utilisateur d\'exécuter le binaire avec les privilèges du propriétaire (souvent root).',
          points: 33
        },
        {
          id: 'qadm-3',
          question: 'Quel type d\'attaque utilise des tables pré-calculées d\'empreintes cryptographiques pour casser des condensats ?',
          options: [
            'Attaque par force brute séquentielle',
            'Attaque par Tables Arc-en-ciel (Rainbow Tables)',
            'Attaque par injection SQL aveugle',
            'Dépassement de tampon (Buffer Overflow)'
          ],
          correctIndex: 1,
          explanation: 'Les Rainbow Tables utilisent un compromis temps-mémoire précalculé pour inverser les fonctions de hachage non salées.',
          points: 33
        }
      ]
    },
    chapters: [
      {
        id: 'chap-cyber-adm1',
        title: 'Module 1 : Reconnaissance Passive & Cartographie d\'Attaque',
        description: 'OSINT avancée, footprinting et identification des faiblesses de surface',
        lessons: [
          {
            id: 'les-cyber-adm101',
            title: '1.1 Détection des vecteurs d\'attaque & Modélisation des menaces (MITRE ATT&CK)',
            durationMinutes: 25,
            type: 'video',
            allowPreview: true,
            content: `Comprendre la matrice MITRE ATT&CK pour anticiper les phases de déplacement latéral et d'exfiltration.`
          },
          {
            id: 'les-cyber-adm102',
            title: '1.2 Exploitation de vulnérabilités Web & Contournement WAF en environnement isolé',
            durationMinutes: 30,
            type: 'interactive_code',
            allowPreview: false,
            requiresPayment: true,
            codeLanguage: 'python',
            codeStarter: `# Exploit PoC en environnement sandbox\nimport requests\n\ndef test_injection(url: str, payload: str):\n    pass`,
            content: `Mise en pratique encadrée sur laboratoire éphémère pour tester les défenses d'une API bancaire.`
          }
        ]
      }
    ],
    finalQuiz: {
      id: 'quiz-cyber-master-final',
      title: 'Examen de Certification Pentesteur Expert Academia ITECH',
      description: 'L\'examen ultime validant vos compétences pratiques d\'audit de sécurité offensive.',
      courseId: 'course-cyber-advanced-quiz-conditioned',
      passingScore: 80,
      timeLimitMinutes: 25,
      xpReward: 500,
      questions: [
        {
          id: 'qcm-1',
          question: 'Quelle mesure est la plus efficace pour prévenir les attaques par Cross-Site Request Forgery (CSRF) ?',
          options: [
            'Utiliser des jetons anti-CSRF imprévisibles et l\'attribut de cookie SameSite=Strict',
            'Masquer l\'adresse IP du serveur',
            'Désactiver le protocole TLS',
            'Changer le nom de domaine de l\'application'
          ],
          correctIndex: 0,
          explanation: 'Les jetons synchrones liés à la session utilisateur et le mode SameSite empêchent les requêtes forgées par des tiers.',
          points: 50
        }
      ]
    }
  },

  // =========================================================================
  // COURS EXEMPLE 4 : LEÇONS CONDITIONNÉES PAR DES QUIZ D'ÉTAPE (CHECKPOINTS 80%)
  // =========================================================================
  {
    id: 'course-ia-agentic-checkpoints',
    title: 'Agents IA Autonomes & Multi-LLMs (Leçons Débloquées par Quiz d\'Étape 80%)',
    slug: 'agents-ia-autonomes-lecons-conditionnees-quiz',
    category: 'ia_data',
    level: 'Avancé',
    rating: 4.96,
    reviewCount: 340,
    studentCount: 1680,
    durationHours: 26.0,
    price: 40,
    originalPrice: 75,
    pricingType: 'paid',
    requiresLogin: true,
    isFeatured: true,
    isNew: true,
    hasCertificate: true,
    authorId: 'trainer-fatou-s',
    authorName: 'Fatou Sow',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    authorRole: 'Chercheuse Senior IA & Systèmes Multi-Agents',
    centerId: 'center-2',
    centerName: 'Dakar AI & Cyber Hub',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80',
    shortDescription: 'Progression rigoureuse : chaque chapitre clé est verrouillé et exige 80% au quiz d\'étape précédent pour ouvrir la leçon suivante.',
    description: 'Concevez des agents autonomes capables d\'appeler des outils, de corriger leur code et de collaborer en essaim. Chaque leçon avancée est conditionnée par la réussite du quiz de l\'étape précédente avec 80% minimum.',
    tags: ['Agents IA', 'Quiz Checkpoint', '80% Requis', 'LangGraph', 'ReAct', 'Gemini', 'Python'],
    skillsGained: [
      'Conception de boucles d\'action-réflexion ReAct et Tree-of-Thoughts',
      'Orchestration d\'agents avec LangGraph et gestion d\'état persistant',
      'Intégration d\'outils externes (Recherche web, SQL, APIs)',
      'Déploiement d\'agents fiables avec garde-fous de sécurité'
    ],
    chapters: [
      {
        id: 'chap-ag1',
        title: 'Module 1 : Fondations des Architectures Agentiques',
        description: 'Perception, mémoire court/long terme et prise de décision des LLMs',
        lessons: [
          {
            id: 'les-ag101',
            title: '1.1 Anatomie d\'un Agent : Boucle ReAct (Thought -> Action -> Observation)',
            durationMinutes: 20,
            type: 'video',
            allowPreview: true,
            requiresPayment: false,
            content: `### Le paradigme ReAct
Comment les modèles modernes utilisent la planification pas-à-pas pour invoquer des fonctions et analyser les réponses d'environnement.`
          },
          {
            id: 'les-ag102',
            title: '1.2 Validation du Module 1 : Quiz d\'Étape ReAct (Seuil obligatoire : 80%)',
            durationMinutes: 15,
            type: 'exercise',
            allowPreview: true,
            quizId: 'quiz-agents-step1',
            requiredQuizScore: 80,
            content: `Ce quiz de jalon vérifie votre compréhension du flux de contrôle de l'agent. Vous devez impérativement obtenir au moins 80% pour déverrouiller la leçon 2.1 sur LangGraph.`
          }
        ],
        checkpointQuiz: {
          id: 'quiz-agents-step1',
          title: 'Quiz de Validation Étape 1 : Fondations des Agents (Seuil : 80%)',
          description: 'Obtenez 80% minimum pour débloquer immédiatement la Leçon 2.1.',
          courseId: 'course-ia-agentic-checkpoints',
          passingScore: 80,
          timeLimitMinutes: 10,
          xpReward: 250,
          questions: [
            {
              id: 'qag1-1',
              question: 'Dans la boucle ReAct, que représente la phase "Observation" ?',
              options: [
                'Le texte écrit par l\'utilisateur au départ',
                'Le résultat retourné par l\'outil ou l\'API exécuté par l\'agent',
                'La mémoire RAM consommée par le modèle',
                'Le code Python compilé'
              ],
              correctIndex: 1,
              explanation: 'L\'observation est la donnée brute renvoyée par le monde extérieur ou l\'outil invoqué lors de la phase Action.',
              points: 50
            },
            {
              id: 'qag1-2',
              question: 'Quelle est la fonction principale d\'un "Garde-fou" (Guardrail) dans un système agentique ?',
              options: [
                'Empêcher l\'agent d\'exécuter des actions destructrices ou non autorisées hors de son périmètre',
                'Remplacer le LLM par une base SQL',
                'Augmenter la vitesse du processeur',
                'Traduire les réponses en binaire'
              ],
              correctIndex: 0,
              explanation: 'Les garde-fous vérifient la sécurité des entrées et des sorties pour garantir l\'alignement et la conformité.',
              points: 50
            }
          ]
        }
      },
      {
        id: 'chap-ag2',
        title: 'Module 2 : Orchestration Multi-Agents & LangGraph (Conditionné par Quiz 1)',
        description: 'Coordination de graphes d\'états cycliques et collaboration entre agents spécialisés',
        lessons: [
          {
            id: 'les-ag201',
            title: '2.1 Implémentation d\'un Graphe LangGraph avec Auto-Correction (Conditionné par Quiz Étape 1 à 80%)',
            durationMinutes: 32,
            type: 'interactive_code',
            allowPreview: false,
            requiresPayment: true,
            prerequisiteQuizId: 'quiz-agents-step1',
            prerequisiteQuizTitle: 'Quiz Étape 1 : Fondations des Agents',
            requiredQuizScore: 80,
            codeLanguage: 'python',
            codeStarter: `from typing import TypedDict\n\nclass AgentState(TypedDict):\n    messages: list\n    next_step: str\n\n# Définissez le graphe avec nœud de validation...`,
            content: `### LangGraph Avancé : Graphe Cyclique avec Rétro-Contrôle
Félicitations pour avoir obtenu au moins 80% au quiz d'étape ! Vous avez désormais accès à cet atelier avancé.`
          },
          {
            id: 'les-ag202',
            title: '2.2 Déploiement d\'un Essaim Multi-Agents (Superviseur & Travailleurs Spécialisés)',
            durationMinutes: 38,
            type: 'article',
            allowPreview: false,
            requiresPayment: true,
            prerequisiteQuizId: 'quiz-agents-step1',
            requiredQuizScore: 80,
            content: `Architecture d'un routeur superviseur distribuant les sous-tâches à des agents spécialisés (chercheur, codeur, relecteur).`
          }
        ]
      }
    ],
    finalQuiz: {
      id: 'quiz-agents-master',
      title: 'Certification Finale : Maître Architecte Systèmes Agentiques IA',
      description: 'Démontrez votre savoir-faire pour décrocher le certificat officiel d\'Architecte IA.',
      courseId: 'course-ia-agentic-checkpoints',
      passingScore: 80,
      timeLimitMinutes: 20,
      xpReward: 400,
      questions: [
        {
          id: 'qagf-1',
          question: 'Pourquoi préférer un graphe d\'état (comme LangGraph) à une chaîne linéaire (Chain) pour un agent complexe ?',
          options: [
            'Parce que le graphe permet des cycles, des boucles de réessai et de l\'auto-correction non réalisables en chaîne linéaire',
            'Parce que le graphe ne nécessite aucun code Python',
            'Parce que les graphes s\'exécutent sans connexion réseau',
            'Parce que le graphe supprime tous les coûts d\'API'
          ],
          correctIndex: 0,
          explanation: 'Les graphes permettent des flux cycliques indispensables pour qu\'un agent puisse tester, échouer et réajuster son plan.',
          points: 50
        }
      ]
    }
  }
];

export const INITIAL_REWARDS: RewardItem[] = [
  {
    id: 'rew-1',
    title: 'Session Mentorat 1-to-1 avec un Expert Africain (45 min)',
    description: 'Bénéficiez d\'un appel vidéo privé avec un formateur expert (Dakar, Kinshasa, Abidjan) pour déboguer votre projet ou préparer vos entretiens tech.',
    costXp: 800,
    category: 'coaching',
    icon: 'Video'
  },
  {
    id: 'rew-2',
    title: 'Bon de Réduction Examen Certification (-50%)',
    description: 'Une réduction exclusive valable sur n\'importe quelle certification professionnelle partenaire Academia ITECH.',
    costXp: 500,
    category: 'discount',
    icon: 'Ticket'
  },
  {
    id: 'rew-3',
    title: 'Pack Goodies Academia ITECH Afrique',
    description: 'Polo officiel brodé ITECH, carnet de notes développeur et stickers holographiques expédiés dans votre campus de rattachement.',
    costXp: 1200,
    category: 'swag',
    icon: 'Package'
  },
  {
    id: 'rew-4',
    title: 'Badge Profil VIP "Grand Maître Tech"',
    description: 'Affichez une aura dorée unique et le badge d\'honneur sur tous les classements de la communauté panafricaine.',
    costXp: 600,
    category: 'perk',
    icon: 'Crown'
  }
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 'user-top1',
    name: 'Amina Diallo',
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=300&auto=format&fit=crop&q=80',
    centerName: 'Abidjan Fintech & Tech Lab',
    xp: 2840,
    level: 7,
    rank: 1,
    badgesCount: 9,
    streakDays: 24
  },
  {
    id: 'user-top2',
    name: 'Landry Kibakweto',
    avatar: 'https://images.unsplash.com/photo-1531891437562-4301cf092a9d?w=300&auto=format&fit=crop&q=80',
    centerName: 'Kinshasa Silicon River & Digital Campus',
    xp: 2490,
    level: 6,
    rank: 2,
    badgesCount: 7,
    streakDays: 19
  },
  {
    id: 'user-top3',
    name: 'Mamadou Touré',
    avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=300&auto=format&fit=crop&q=80',
    centerName: 'Dakar AI & Cyber Hub',
    xp: 2150,
    level: 5,
    rank: 3,
    badgesCount: 6,
    streakDays: 14
  },
  {
    id: 'user-top4',
    name: 'Grace Mukendi',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    centerName: 'Kinshasa Silicon River & Digital Campus',
    xp: 1450,
    level: 4,
    rank: 4,
    badgesCount: 4,
    streakDays: 7
  },
  {
    id: 'user-top5',
    name: 'Kofi Mensah',
    avatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=300&auto=format&fit=crop&q=80',
    centerName: 'Kigali Silicon Innovation Academy',
    xp: 1120,
    level: 3,
    rank: 5,
    badgesCount: 3,
    streakDays: 5
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'user-me',
  name: 'Landry Kibakweto',
  email: 'landrykibakweto123@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1531891437562-4301cf092a9d?w=300&auto=format&fit=crop&q=80',
  role: 'learner',
  centerId: 'center-1',
  centerName: 'Kinshasa Silicon River & Digital Campus',
  city: 'Kinshasa',
  country: 'RD Congo',
  headline: 'Étudiant Ingénieur Logiciel & Passionné d\'IA Panafricaine',
  bio: 'Développeur passionné par l\'intelligence artificielle, les systèmes distribués et les solutions technologiques adaptées aux défis africains.',
  xp: 1450,
  level: 4,
  streakDays: 7,
  lastActiveDate: new Date().toISOString(),
  enrolledCourseIds: ['course-ia-llm', 'course-fintech-africa', 'course-cyber-sec'],
  completedLessonIds: ['les-101'],
  unlockedBadgeIds: ['badge-1', 'badge-2', 'badge-6'],
  skills: ['Python', 'TypeScript', 'React 19', 'NLP Lingala/Swahili', 'Docker', 'Mobile Money APIs'],
  languages: ['Français (Courant)', 'Lingála (Maternel)', 'Anglais (Professionnel)', 'Swahili (Notions)'],
  earnedCertificates: [
    {
      id: 'cert-prev-001',
      certificateNumber: 'ITECH-AFRICA-2026-8941',
      courseId: 'course-ia-llm',
      courseTitle: 'Masterclass IA Générative, LLMs & Traitement des Langues Africaines',
      learnerId: 'user-me',
      learnerName: 'Landry Kibakweto',
      issueDate: '20 août 2026',
      gradePercentage: 96,
      distinction: 'Mention Très Bien',
      qrCodeData: 'https://academia-itech.cd/verify/ITECH-AFRICA-2026-8941',
      trainerName: 'Fatou Sow & Conseil Pédagogique ITECH',
      centerName: 'Kinshasa Silicon River & Digital Campus'
    }
  ]
};

export const DEMO_PROFILES: UserProfile[] = [
  {
    id: 'user-me',
    name: 'Landry Kibakweto',
    email: 'landrykibakweto123@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1531891437562-4301cf092a9d?w=300&auto=format&fit=crop&q=80',
    role: 'learner',
    centerId: 'center-1',
    centerName: 'Kinshasa Silicon River & Digital Campus',
    city: 'Kinshasa',
    country: 'RD Congo',
    headline: 'Apprenant en Génie Logiciel & IA',
    xp: 1450,
    level: 4,
    streakDays: 7,
    lastActiveDate: new Date().toISOString(),
    enrolledCourseIds: ['course-ia-llm', 'course-fintech-africa', 'course-cyber-sec'],
    completedLessonIds: ['les-101'],
    unlockedBadgeIds: ['badge-1', 'badge-2', 'badge-6'],
    earnedCertificates: [
      {
        id: 'cert-prev-001',
        certificateNumber: 'ITECH-AFRICA-2026-8941',
        courseId: 'course-ia-llm',
        courseTitle: 'Masterclass IA Générative, LLMs & Traitement des Langues Africaines',
        learnerId: 'user-me',
        learnerName: 'Landry Kibakweto',
        issueDate: '20 août 2026',
        gradePercentage: 96,
        distinction: 'Mention Très Bien',
        qrCodeData: 'https://academia-itech.cd/verify/ITECH-AFRICA-2026-8941',
        trainerName: 'Fatou Sow & Conseil Pédagogique ITECH',
        centerName: 'Kinshasa Silicon River & Digital Campus'
      }
    ]
  },
  {
    id: 'user-trainer-fatou',
    name: 'Fatou Sow',
    email: 'fatou.sow@dakar-ai.tech',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    role: 'trainer',
    centerId: 'center-2',
    centerName: 'Dakar AI & Cyber Hub',
    city: 'Dakar',
    country: 'Sénégal',
    headline: 'Lead Chercheuse IA & Formatrice Panafricaine',
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
    id: 'user-admin-dr-landry',
    name: 'Dr. Landry Bakweto',
    email: 'directeur@kinshasa-tech.cd',
    avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=300&auto=format&fit=crop&q=80',
    role: 'center_admin',
    centerId: 'center-1',
    centerName: 'Kinshasa Silicon River & Digital Campus',
    city: 'Kinshasa',
    country: 'RD Congo',
    headline: 'Directeur du Campus & Professeur Agrégé',
    xp: 4900,
    level: 10,
    streakDays: 45,
    lastActiveDate: new Date().toISOString(),
    enrolledCourseIds: ['course-ia-llm', 'course-fintech-africa', 'course-fullstack-cloud'],
    completedLessonIds: ['les-101', 'les-c101'],
    unlockedBadgeIds: ['badge-1', 'badge-2', 'badge-5'],
    earnedCertificates: []
  },
  {
    id: 'user-super-sarah',
    name: 'Amina Diallo',
    email: 'gouvernance@academia-itech.africa',
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=300&auto=format&fit=crop&q=80',
    role: 'super_admin',
    centerId: 'center-3',
    centerName: 'Direction Panafricaine Academia ITECH',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    headline: 'Présidente du Conseil de Gouvernance Numérique',
    xp: 9990,
    level: 20,
    streakDays: 120,
    lastActiveDate: new Date().toISOString(),
    enrolledCourseIds: ['course-ia-llm', 'course-fintech-africa', 'course-cyber-sec', 'course-fullstack-cloud'],
    completedLessonIds: ['les-101', 'les-102', 'les-103', 'les-c101'],
    unlockedBadgeIds: ['badge-1', 'badge-2', 'badge-3', 'badge-4', 'badge-5', 'badge-6'],
    earnedCertificates: []
  }
];
