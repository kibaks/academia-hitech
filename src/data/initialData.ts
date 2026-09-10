import { Course, Badge, Center, RewardItem, LeaderboardUser, UserProfile, Trainer } from '../types';

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
