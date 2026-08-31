import { Trainer } from '../types';

export interface InstructorPreset {
  id: string;
  name: string;
  gender: 'female' | 'male';
  specialty: string;
  title: string;
  avatar: string;
  bio: string;
  country: string;
  city: string;
  rating: number;
}

export const BLACK_INSTRUCTORS_PRESETS: InstructorPreset[] = [
  {
    id: 'inst-fatou-sow',
    name: 'Pr. Fatou Sow',
    gender: 'female',
    specialty: 'Intelligence Artificielle & NLP Langues Africaines',
    title: 'Lead Chercheuse IA Panafricaine & NLP',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    bio: 'Directrice de recherche en NLP pour les langues nationales africaines (Swahili, Lingala, Wolof). Conférencière internationale et mentore d\'ingénieurs IA.',
    country: 'Sénégal',
    city: 'Dakar',
    rating: 4.98
  },
  {
    id: 'inst-landry-bakweto',
    name: 'Dr. Landry Bakweto',
    gender: 'male',
    specialty: 'Systèmes Distribués, Cloud Hybride & DevOps',
    title: 'Professeur Agrégé & Architecte Cloud',
    avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=600&auto=format&fit=crop&q=80',
    bio: 'Professeur agrégé en informatique à Kinshasa, consultant en infrastructures résilientes, edge computing et conteneurisation à haute disponibilité.',
    country: 'RD Congo',
    city: 'Kinshasa',
    rating: 4.96
  },
  {
    id: 'inst-amina-diallo',
    name: 'Amina Diallo',
    gender: 'female',
    specialty: 'Fintech, Mobile Money & Sécurité Bancaire',
    title: 'Directrice R&D Fintech & Systèmes de Paiement',
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=600&auto=format&fit=crop&q=80',
    bio: 'Architecte de passerelles de transactions bancaires et Mobile Money (Wave, M-Pesa, Orange Money). Consultante en conformité financière BCEAO.',
    country: 'Côte d\'Ivoire',
    city: 'Abidjan',
    rating: 4.95
  },
  {
    id: 'inst-malik-konate',
    name: 'Malik Konaté',
    gender: 'male',
    specialty: 'Cybersécurité Offensive, SOC & Pentest Bancaire',
    title: 'Ethical Hacker & Consultant SOC Certifié CISSP/OSCP',
    avatar: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=600&auto=format&fit=crop&q=80',
    bio: 'Auditeur expert en tests d\'intrusion, sécurité d\'infrastructures critiques gouvernementales et réponse aux incidents Red Team / Blue Team.',
    country: 'Sénégal / Mali',
    city: 'Dakar',
    rating: 4.93
  },
  {
    id: 'inst-kofi-mensah',
    name: 'Ing. Kofi Mensah',
    gender: 'male',
    specialty: 'Architectures Microservices & React 19 / Node.js',
    title: 'Lead Architecte Logiciel & Ingénieur Fullstack',
    avatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=600&auto=format&fit=crop&q=80',
    bio: 'Tech Lead ayant conçu des plateformes scalables pour des millions d\'utilisateurs en Afrique de l\'Ouest. Passionné par TypeScript et les architectures réactives.',
    country: 'Ghana',
    city: 'Accra',
    rating: 4.92
  },
  {
    id: 'inst-grace-mukendi',
    name: 'Grace Mukendi',
    gender: 'female',
    specialty: 'Data Engineering, MLOps & Big Data Africain',
    title: 'Senior Data Engineer & MLOps Specialist',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&auto=format&fit=crop&q=80',
    bio: 'Spécialiste de la construction de pipelines de données massives (Spark, Kafka, dbt) et du déploiement de modèles de Machine Learning en production.',
    country: 'RD Congo',
    city: 'Lubumbashi',
    rating: 4.94
  },
  {
    id: 'inst-mamadou-toure',
    name: 'Dr. Mamadou Touré',
    gender: 'male',
    specialty: 'IoT, Systèmes Embarqués & Smart Cities',
    title: 'Directeur de Laboratoire IoT & IA Embarquée',
    avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=600&auto=format&fit=crop&q=80',
    bio: 'Chercheur en électronique connectée et réseaux de capteurs basse consommation (LoRaWAN) pour l\'agriculture de précision et la gestion énergétique.',
    country: 'Sénégal',
    city: 'Saint-Louis',
    rating: 4.91
  },
  {
    id: 'inst-esther-mutombo',
    name: 'Esther Mutombo',
    gender: 'female',
    specialty: 'Design Systèmes, UX/UI & Accessibilité Numérique',
    title: 'Head of Product Design & Human-Centered AI',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    bio: 'Designer d\'expérience utilisateur axée sur les interfaces mobiles légères, la clarté cognitive et l\'accessibilité pour les utilisateurs à faible bande passante.',
    country: 'RD Congo / Rwanda',
    city: 'Kigali',
    rating: 4.95
  }
];

export const AVATAR_PHOTO_PRESETS = BLACK_INSTRUCTORS_PRESETS.map((inst) => ({
  id: inst.id,
  name: inst.name,
  specialty: inst.specialty,
  url: inst.avatar,
  gender: inst.gender
}));
