import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type, Modality, ThinkingLevel } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy Google GenAI Client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Resilient Models in Priority Order
const RESILIENT_TEXT_MODELS = [
  "gemini-3.7-flash",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
];

// Helper: Resilient generateContent with automatic model fallback on 503 / 429 / high demand
async function callResilientGenerateContent(
  ai: GoogleGenAI,
  params: {
    contents: any;
    systemInstruction?: string;
    responseMimeType?: string;
    responseSchema?: any;
    temperature?: number;
    maxOutputTokens?: number;
    thinkingLevel?: ThinkingLevel;
    models?: string[];
  }
) {
  const candidateModels = params.models || RESILIENT_TEXT_MODELS;
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const config: any = {};
      if (params.thinkingLevel && model === "gemini-3.7-flash") {
        config.thinkingConfig = { thinkingLevel: params.thinkingLevel };
      }
      if (params.systemInstruction) config.systemInstruction = params.systemInstruction;
      if (params.responseMimeType) config.responseMimeType = params.responseMimeType;
      if (params.responseSchema) config.responseSchema = params.responseSchema;
      if (params.temperature !== undefined) config.temperature = params.temperature;
      if (params.maxOutputTokens !== undefined) config.maxOutputTokens = params.maxOutputTokens;

      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config,
      });

      if (response && (response.text || response.candidates?.length)) {
        return response;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini Resilient Engine] Model ${model} failed (${err?.status || err?.message || '503/high demand'}). Trying fallback...`);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
  }

  throw lastError;
}

// Helper: Resilient generateContentStream with automatic model fallback on 503 / 429 / high demand
async function callResilientGenerateContentStream(
  ai: GoogleGenAI,
  params: {
    contents: any;
    systemInstruction?: string;
    temperature?: number;
    maxOutputTokens?: number;
    thinkingLevel?: ThinkingLevel;
    models?: string[];
  }
) {
  const candidateModels = params.models || RESILIENT_TEXT_MODELS;
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const config: any = {};
      if (params.thinkingLevel && model === "gemini-3.7-flash") {
        config.thinkingConfig = { thinkingLevel: params.thinkingLevel };
      }
      if (params.systemInstruction) config.systemInstruction = params.systemInstruction;
      if (params.temperature !== undefined) config.temperature = params.temperature;
      if (params.maxOutputTokens !== undefined) config.maxOutputTokens = params.maxOutputTokens;

      const responseStream = await ai.models.generateContentStream({
        model,
        contents: params.contents,
        config,
      });

      return responseStream;
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini Resilient Stream] Model ${model} failed (${err?.status || err?.message || '503/high demand'}). Trying fallback...`);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
  }

  throw lastError;
}

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), aiReady: !!process.env.GEMINI_API_KEY });
});

// 1. AI Course Generator API Endpoint
app.post("/api/gemini/generate-course", async (req, res) => {
  try {
    const { topic, audience, level, durationHours, category, centerName } = req.body;
    const ai = getAIClient();

    if (!ai) {
      // Intelligent fallback structured course template
      return res.json({
        success: true,
        isSimulated: true,
        course: {
          title: `Formation Avancée : ${topic || "Intelligence Artificielle & Technologies ITECH"}`,
          shortDescription: `Programme de spécialisation en ${topic || "Tech"} adapté au niveau ${level || "Intermédiaire"}.`,
          description: `Ce cursus complet vous guide pas à pas dans la maîtrise de ${topic || "cette discipline"}. Il inclut des travaux pratiques, des études de cas réelles et une certification finale validée par ${centerName || "Academia ITECH"}.`,
          category: category || "ia_data",
          level: level || "Intermédiaire",
          durationHours: durationHours || 12,
          skillsGained: [
            `Maîtrise des fondamentaux et de l'architecture de ${topic}`,
            "Implémentation de projets concrets et code de production propre",
            "Sécurité applicative, gestion des erreurs et haute disponibilité",
            "Résolution de problèmes complexes, optimisation algorithmique et déploiement"
          ],
          tags: [topic, "Academia ITECH", "Certification", "Pratique", "Excellence"],
          chapters: [
            {
              id: `chap-${Date.now()}-1`,
              title: `Module 1 : Fondements et Architecture Clé de ${topic}`,
              description: "Comprendre les principes théoriques, les composants internes et l'état de l'art",
              lessons: [
                {
                  id: `les-${Date.now()}-1`,
                  title: `1.1 Introduction, Architecture et Enjeux Majeurs`,
                  durationMinutes: 20,
                  type: "video",
                  content: `### 🎯 Objectifs de la leçon\n\nDécouvrir l'écosystème global de **${topic}**, les cas d'usage industriels et les outils essentiels.\n\n#### Points Clés :\n- Définitions fondamentales et historique de l'innovation\n- Comparatif des approches modernes et patterns d'architecture\n- Préparation de l'environnement de développement et bonnes pratiques`,
                  resources: [
                    { id: "r1", title: "Support de cours et synthèse d'ingénierie (PDF)", url: "#", type: "pdf", size: "2.4 MB" }
                  ]
                },
                {
                  id: `les-${Date.now()}-2`,
                  title: `1.2 Atelier Pratique : Première Mise en Œuvre & Tests`,
                  durationMinutes: 30,
                  type: "interactive_code",
                  codeLanguage: "python",
                  codeStarter: `# Atelier pratique : ${topic}\ndef run_pipeline():\n    print("Initialisation du pipeline ${topic}...")\n    # TODO : Implémentez la logique principale ici\n    return True\n\nif __name__ == '__main__':\n    run_pipeline()`,
                  codeSolution: `# Solution optimisée de production\ndef run_pipeline():\n    print("Initialisation réussie pour ${topic} - Academia ITECH 🎓")\n    status = {"module": "${topic}", "status": "active", "health": 100}\n    return status\n\nif __name__ == '__main__':\n    res = run_pipeline()\n    print("Résultat :", res)`,
                  content: `### 💻 Exercice Pratique\n\nImplémentez la configuration de départ et exécutez le script pour valider vos paramètres.`
                }
              ]
            },
            {
              id: `chap-${Date.now()}-2`,
              title: `Module 2 : Cas Pratiques Avancés, Sécurité & Déploiement`,
              description: "Mise en situation réelle, patterns de résilience et mise en production",
              lessons: [
                {
                  id: `les-${Date.now()}-3`,
                  title: `2.1 Conception d'une Solution Complète et Scalable`,
                  durationMinutes: 35,
                  type: "article",
                  content: `### 🚀 Déploiement en Environnement Réel\n\nÉtude de cas d'un projet d'entreprise avec les meilleures pratiques de scalabilité, gestion d'erreurs et sécurité.`
                }
              ]
            }
          ],
          finalQuiz: {
            id: `quiz-${Date.now()}`,
            title: `Évaluation Finale : ${topic}`,
            description: "Testez vos compétences techniques pour valider votre certification officielle Academia ITECH.",
            passingScore: 75,
            timeLimitMinutes: 15,
            xpReward: 300,
            questions: [
              {
                id: "q1",
                question: `Quel est l'avantage architectural majeur apporté par ${topic} ?`,
                options: [
                  "Automatiser, sécuriser et optimiser les flux de travail complexes",
                  "Remplacer tout le matériel physique sans configuration",
                  "Supprimer tout besoin de tests logiciels",
                  "Aucun avantage mesurable en production"
                ],
                correctIndex: 0,
                explanation: `La maîtrise de ${topic} permet de concevoir des solutions hautement performantes, scalables et résilientes.`,
                points: 50
              },
              {
                id: "q2",
                question: `Quelle étape est indispensable avant de mettre en production un module sur ${topic} ?`,
                options: [
                  "Exécuter des tests d'intégration complets et un audit de sécurité",
                  "Supprimer tous les fichiers de journalisation et de monitoring",
                  "Désactiver la validation des types de données",
                  "Partager les clés secrètes en clair"
                ],
                correctIndex: 0,
                explanation: "Les tests rigoureux et l'audit de sécurité garantissent la conformité et la robustesse en production.",
                points: 50
              }
            ]
          }
        }
      });
    }

    const prompt = `Tu es le Directeur Pédagogique et Expert en Ingénierie de Formation d'Academia ITECH (Pôle technologique panafricain d'excellence).
Génère un cours e-learning ultra-complet, structuré, moderne et captivant sur le sujet suivant :
- Sujet / Titre : "${topic || "Développement Fullstack & IA"}"
- Public cible : "${audience || "Étudiants et Professionnels de la Tech"}"
- Niveau : "${level || "Intermédiaire"}"
- Durée estimée : ${durationHours || 10} heures
- Catégorie : "${category || "ia_data"}"
- Centre / Institution émettrice : "${centerName || "Academia ITECH"}"

Réponds STRICTEMENT sous la forme d'un objet JSON respectant le schéma attendu.
Fournis un contenu riche en français, avec du markdown bien formaté pour les leçons, des explications claires, du code d'exemple si pertinent, et un quiz final de 3 questions avec explications pédagogiques.`;

    const response = await callResilientGenerateContent(ai, {
      contents: prompt,
      thinkingLevel: ThinkingLevel.LOW,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          shortDescription: { type: Type.STRING },
          description: { type: Type.STRING },
          category: { type: Type.STRING },
          level: { type: Type.STRING },
          durationHours: { type: Type.NUMBER },
          skillsGained: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          chapters: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                lessons: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      durationMinutes: { type: Type.NUMBER },
                      type: { type: Type.STRING },
                      content: { type: Type.STRING },
                      codeLanguage: { type: Type.STRING },
                      codeStarter: { type: Type.STRING },
                      codeSolution: { type: Type.STRING },
                    },
                    required: ["id", "title", "durationMinutes", "type", "content"],
                  },
                },
              },
              required: ["id", "title", "lessons"],
            },
          },
          finalQuiz: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              passingScore: { type: Type.NUMBER },
              timeLimitMinutes: { type: Type.NUMBER },
              xpReward: { type: Type.NUMBER },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctIndex: { type: Type.NUMBER },
                    explanation: { type: Type.STRING },
                    points: { type: Type.NUMBER },
                  },
                  required: ["id", "question", "options", "correctIndex", "explanation", "points"],
                },
              },
            },
            required: ["id", "title", "questions"],
          },
        },
        required: ["title", "shortDescription", "description", "category", "level", "skillsGained", "chapters"],
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json({ success: true, course: parsed });
  } catch (error: any) {
    console.warn("Génération cours IA en mode résilient:", error?.message || error);
    // Return high quality simulated course when AI model is temporarily experiencing high demand
    const topic = req.body?.topic || "Intelligence Artificielle & Technologies ITECH";
    res.json({
      success: true,
      isSimulated: true,
      course: {
        title: `Formation Avancée : ${topic}`,
        shortDescription: `Programme de spécialisation en ${topic} adapté au niveau ${req.body?.level || "Intermédiaire"}.`,
        description: `Ce cursus complet vous guide pas à pas dans la maîtrise de ${topic}. Il inclut des travaux pratiques, des études de cas réelles et une certification finale validée par Academia ITECH.`,
        category: req.body?.category || "ia_data",
        level: req.body?.level || "Intermédiaire",
        durationHours: req.body?.durationHours || 12,
        skillsGained: [
          `Maîtrise des fondamentaux et de l'architecture de ${topic}`,
          "Implémentation de projets concrets et code de production propre",
          "Sécurité applicative, gestion des erreurs et haute disponibilité",
          "Résolution de problèmes complexes, optimisation algorithmique et déploiement"
        ],
        tags: [topic, "Academia ITECH", "Certification", "Pratique", "Excellence"],
        chapters: [
          {
            id: `chap-${Date.now()}-1`,
            title: `Module 1 : Fondements et Architecture Clé de ${topic}`,
            description: "Comprendre les principes théoriques, les composants internes et l'état de l'art",
            lessons: [
              {
                id: `les-${Date.now()}-1`,
                title: `1.1 Introduction, Architecture et Enjeux Majeurs`,
                durationMinutes: 20,
                type: "video",
                content: `### 🎯 Objectifs de la leçon\n\nDécouvrir l'écosystème global de **${topic}**, les cas d'usage industriels et les outils essentiels.\n\n#### Points Clés :\n- Définitions fondamentales et historique de l'innovation\n- Comparatif des approches modernes et patterns d'architecture\n- Préparation de l'environnement de développement et bonnes pratiques`,
                resources: [
                  { id: "r1", title: "Support de cours et synthèse d'ingénierie (PDF)", url: "#", type: "pdf", size: "2.4 MB" }
                ]
              },
              {
                id: `les-${Date.now()}-2`,
                title: `1.2 Atelier Pratique : Première Mise en Œuvre & Tests`,
                durationMinutes: 30,
                type: "interactive_code",
                codeLanguage: "python",
                codeStarter: `# Atelier pratique : ${topic}\ndef run_pipeline():\n    print("Initialisation du pipeline ${topic}...")\n    # TODO : Implémentez la logique principale ici\n    return True\n\nif __name__ == '__main__':\n    run_pipeline()`,
                codeSolution: `# Solution optimisée de production\ndef run_pipeline():\n    print("Initialisation réussie pour ${topic} - Academia ITECH 🎓")\n    status = {"module": "${topic}", "status": "active", "health": 100}\n    return status\n\nif __name__ == '__main__':\n    res = run_pipeline()\n    print("Résultat :", res)`,
                content: `### 💻 Exercice Pratique\n\nImplémentez la configuration de départ et exécutez le script pour valider vos paramètres.`
              }
            ]
          },
          {
            id: `chap-${Date.now()}-2`,
            title: `Module 2 : Cas Pratiques Avancés, Sécurité & Déploiement`,
            description: "Mise en situation réelle, patterns de résilience et mise en production",
            lessons: [
              {
                id: `les-${Date.now()}-3`,
                title: `2.1 Conception d'une Solution Complète et Scalable`,
                durationMinutes: 35,
                type: "article",
                content: `### 🚀 Déploiement en Environnement Réel\n\nÉtude de cas d'un projet d'entreprise avec les meilleures pratiques de scalabilité, gestion d'erreurs et sécurité.`
              }
            ]
          }
        ],
        finalQuiz: {
          id: `quiz-${Date.now()}`,
          title: `Évaluation Finale : ${topic}`,
          description: "Testez vos compétences techniques pour valider votre certification officielle Academia ITECH.",
          passingScore: 75,
          timeLimitMinutes: 15,
          xpReward: 300,
          questions: [
            {
              id: "q1",
              question: `Quel est l'avantage architectural majeur apporté par ${topic} ?`,
              options: [
                "Automatiser, sécuriser et optimiser les flux de travail complexes",
                "Remplacer tout le matériel physique sans configuration",
                "Supprimer tout besoin de tests logiciels",
                "Aucun avantage mesurable en production"
              ],
              correctIndex: 0,
              explanation: `La maîtrise de ${topic} permet de concevoir des solutions hautement performantes, scalables et résilientes.`,
              points: 50
            },
            {
              id: "q2",
              question: `Quelle étape est indispensable avant de mettre en production un module sur ${topic} ?`,
              options: [
                "Exécuter des tests d'intégration complets et un audit de sécurité",
                "Supprimer tous les fichiers de journalisation et de monitoring",
                "Désactiver la validation des types de données",
                "Partager les clés secrètes en clair"
              ],
              correctIndex: 0,
              explanation: "Les tests rigoureux et l'audit de sécurité garantissent la conformité et la robustesse en production.",
              points: 50
            }
          ]
        }
      }
    });
  }
});

// 2. AI Quiz Generator API Endpoint
app.post("/api/gemini/generate-quiz", async (req, res) => {
  try {
    const { topic, questionCount, difficulty } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        success: true,
        isSimulated: true,
        quiz: {
          title: `Quiz Interactif : ${topic || "Évaluation des Compétences"}`,
          description: `Vérifiez votre compréhension sur le thème ${topic || "général"} (${difficulty || "Moyen"}).`,
          timeLimitMinutes: 10,
          passingScore: 75,
          xpReward: 250,
          questions: [
            {
              id: "q1",
              question: `Quel est le principe fondamental associé à ${topic || "cette notion"} ?`,
              options: [
                "L'optimisation continue, la modularité et les bonnes pratiques de sécurité",
                "Le rejet total de toute automatisation",
                "L'absence de structure logique et de typage",
                "Le stockage de données sensibles sans chiffrement"
              ],
              correctIndex: 0,
              explanation: "L'optimisation continue, la clarté d'architecture et la rigueur d'ingénierie sont la clé de voûte de cette technologie.",
              points: 25
            },
            {
              id: "q2",
              question: `Dans quel contexte utilise-t-on le plus fréquemment ${topic || "ce concept"} ?`,
              options: [
                "Dans le développement d'architectures modernes, scalables et sécurisées",
                "Uniquement pour dessiner des plans d'architecture physique",
                "Pour éteindre les serveurs sans préavis",
                "Dans aucun projet logiciel moderne"
              ],
              correctIndex: 0,
              explanation: "Ce concept est au cœur des architectures logicielles et systèmes cloud contemporains.",
              points: 25
            },
            {
              id: "q3",
              question: "Quelle méthode permet de garantir la non-régression et la validité des résultats ?",
              options: [
                "Les tests unitaires, d'intégration et les audits de code automatisés",
                "La supposition aléatoire sans vérification",
                "Ignorer les journaux d'erreurs et les exceptions",
                "Désactiver les alertes de sécurité"
              ],
              correctIndex: 0,
              explanation: "Les tests automatisés et l'intégration continue (CI/CD) garantissent la non-régression et la robustesse.",
              points: 25
            },
            {
              id: "q4",
              question: "Quelle compétence est complémentaire pour exceller dans ce domaine ?",
              options: [
                "La pensée algorithmique, le clean code et la résolution méthodique de problèmes",
                "La vitesse de frappe sans relecture ni tests",
                "L'oubli délibéré des règles de cybersécurité",
                "La copie aveugle de code non vérifié"
              ],
              correctIndex: 0,
              explanation: "La compréhension algorithmique et l'esprit d'analyse méthodique sont indispensables pour concevoir des systèmes fiables.",
              points: 25
            }
          ]
        }
      });
    }

    const prompt = `Génère un quiz d'évaluation interactif complet pour la plateforme Academia ITECH sur le sujet : "${topic || "Intelligence Artificielle & Cloud"}".
Nombre de questions : ${questionCount || 4}
Niveau de difficulté : ${difficulty || "Intermédiaire"}
Langue : Français.
Chaque question doit avoir 4 choix précis, 1 seule bonne réponse (correctIndex entre 0 et 3), une explication pédagogique claire et un barème de points.`;

    const response = await callResilientGenerateContent(ai, {
      contents: prompt,
      thinkingLevel: ThinkingLevel.LOW,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          timeLimitMinutes: { type: Type.NUMBER },
          passingScore: { type: Type.NUMBER },
          xpReward: { type: Type.NUMBER },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                correctIndex: { type: Type.NUMBER },
                explanation: { type: Type.STRING },
                points: { type: Type.NUMBER },
              },
              required: ["id", "question", "options", "correctIndex", "explanation", "points"],
            },
          },
        },
        required: ["title", "description", "questions"],
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json({ success: true, quiz: parsed });
  } catch (error: any) {
    console.warn("Génération quiz IA en mode résilient:", error?.message || error);
    const topic = req.body?.topic || "Évaluation des Compétences ITECH";
    res.json({
      success: true,
      isSimulated: true,
      quiz: {
        title: `Quiz Interactif : ${topic}`,
        description: `Vérifiez votre compréhension approfondie sur le thème ${topic}.`,
        timeLimitMinutes: 10,
        passingScore: 75,
        xpReward: 250,
        questions: [
          {
            id: "q1",
            question: `Quel est le principe fondamental associé à ${topic} ?`,
            options: [
              "L'optimisation continue, la modularité et les bonnes pratiques de sécurité",
              "Le rejet total de toute automatisation",
              "L'absence de structure logique et de typage",
              "Le stockage de données sensibles sans chiffrement"
            ],
            correctIndex: 0,
            explanation: "L'optimisation continue, la clarté d'architecture et la rigueur d'ingénierie sont la clé de voûte de cette technologie.",
            points: 25
          },
          {
            id: "q2",
            question: `Dans quel contexte utilise-t-on le plus fréquemment ${topic} ?`,
            options: [
              "Dans le développement d'architectures modernes, scalables et sécurisées",
              "Uniquement pour dessiner des plans d'architecture physique",
              "Pour éteindre les serveurs sans préavis",
              "Dans aucun projet logiciel moderne"
            ],
            correctIndex: 0,
            explanation: "Ce concept est au cœur des architectures logicielles et systèmes cloud contemporains.",
            points: 25
          },
          {
            id: "q3",
            question: "Quelle méthode permet de garantir la non-régression et la validité des résultats ?",
            options: [
              "Les tests unitaires, d'intégration et les audits de code automatisés",
              "La supposition aléatoire sans vérification",
              "Ignorer les journaux d'erreurs et les exceptions",
              "Désactiver les alertes de sécurité"
            ],
            correctIndex: 0,
            explanation: "Les tests automatisés et l'intégration continue (CI/CD) garantissent la non-régression et la robustesse.",
            points: 25
          },
          {
            id: "q4",
            question: "Quelle compétence est complémentaire pour exceller dans ce domaine ?",
            options: [
              "La pensée algorithmique, le clean code et la résolution méthodique de problèmes",
              "La vitesse de frappe sans relecture ni tests",
              "L'oubli délibéré des règles de cybersécurité",
              "La copie aveugle de code non vérifié"
            ],
            correctIndex: 0,
            explanation: "La compréhension algorithmique et l'esprit d'analyse méthodique sont indispensables pour concevoir des systèmes fiables.",
            points: 25
          }
        ]
      }
    });
  }
});

// Helper to generate a robust, deeply structured System Instruction for Virtual Tutor
interface TutorPromptOptions {
  personaName?: string;
  personaGender?: string;
  teachingStyle?: string;
  speedMode?: string;
  audioLanguage?: string;
  language?: string;
  contextCourse?: string;
  currentLessonTitle?: string;
  isCallMode?: boolean;
  isWhatsAppMode?: boolean;
}

function buildTutorSystemInstruction(options: TutorPromptOptions): string {
  const {
    personaName = "Fatou Sow",
    personaGender = "female",
    teachingStyle = "supportive",
    speedMode = "pro",
    audioLanguage = "fr-FR",
    language = "fr-FR",
    contextCourse = "Masterclass Ingénierie Logicielle & IA ITECH",
    currentLessonTitle = "Session Interactive",
    isCallMode = false,
    isWhatsAppMode = false,
  } = options;

  const tGender = personaGender === "male" || personaGender === "homme" ? "homme" : "femme";
  const activeLang = (audioLanguage || language || "fr-FR").toLowerCase();

  // 1. Language Directives
  let langDirective = "Langue obligatoire : Français naturel, chaleureux, fluide, expressif, hautement humain et pédagogique.";
  if (activeLang.startsWith("ln")) {
    langDirective = `LANGUE OBLIGATOIRE : Tu DOIS répondre en LINGÁLA (Lingala ya Kinshasa/Brazzaville) chaleureux, authentique, bienveillant et très naturel. Traduis les notions tech avec des mots clairs (ex: "mayele ya masini" pour IA, "ordinatɛrɛ", "koprogramé", "ndakisa ya code ya solo", etc.). Sois encourageante et très humaine.`;
  } else if (activeLang.startsWith("en")) {
    langDirective = `MANDATORY LANGUAGE: Respond in warm, humanized, conversational, and highly engaging English with clear explanations and top-tier software engineering guidance.`;
  } else if (activeLang.startsWith("sw")) {
    langDirective = `LUGHA YA LAZIMA: Jibu KWA KISWAHILI chenye upendo, heshima, wazi, chenye motisha kubwa na mifano halisi.`;
  } else if (activeLang.startsWith("wo")) {
    langDirective = `LANGUE : Réponds en Wolof chaleureux et Français clair, avec beaucoup d'empathie et d'écoute pour guider l'apprenant.`;
  } else if (activeLang.startsWith("es")) {
    langDirective = `IDIOMA OBLIGATORIO: Responde en español cálido, empático, motivador y pedagógico.`;
  } else if (activeLang.startsWith("pt")) {
    langDirective = `IDIOMA OBRIGATÓRIO: Responda em português caloroso, acolhedor, altamente pedagógico e motivador.`;
  }

  // 2. Pedagogical Style & Human Personality
  let styleDirective = "Adopte une posture profondément humaine, bienveillante, passionnée et stimulante. Parle comme une mentore bienveillante qui encourage son étudiant avec le sourire et beaucoup d'énergie positive.";
  if (teachingStyle === "expert") {
    styleDirective = "Adopte le ton d'une mentore et Architecte Logiciel Senior : accessible mais rigoureuse, précise, axée sur les meilleures pratiques et la qualité du code.";
  } else if (teachingStyle === "coach") {
    styleDirective = "Adopte une posture de coach tech très énergique : booste la motivation, célèbre les petites victoires, lance des défis pratiques avec enthousiasme.";
  } else if (teachingStyle === "socratic") {
    styleDirective = "Guide avec douceur et curiosité : pose des questions bienveillantes pour éveiller la réflexion avant de donner le code complet.";
  }

  // 3. Formatting Rules
  let formatDirective = "Structure tes réponses avec clarté : phrases naturelles, transitions fluides, explications bien aérées et blocs de code ``` propres.";
  if (isCallMode) {
    formatDirective = "MODE APPEL VOCAL DIRECT EN TEMPS RÉEL : Rédige une réponse très vivante, parlée, naturelle, chaleureuse et fluide (3 à 5 phrases expressives sans puces ni markdown lourd).";
  } else if (isWhatsAppMode) {
    formatDirective = "MODE WHATSAPP ACTIVÉ : Rédige des messages conviviaux avec emojis chaleureux, formatage WhatsApp (*gras*, _italique_) et un ton de discussion instantanée fluide.";
  } else if (speedMode === "flash") {
    formatDirective = "MODE ÉCLAIR : Réponds de manière directe, dynamique et immédiatement exploitable avec un exemple concis.";
  }

  return `Tu es ${personaName}, tuteur/tutrice virtuel(le) d'exception (${tGender === "homme" ? "Architecte Logiciel & Enseignant" : "Architecte Logicielle & Enseignante"}) sur la plateforme Academia ITECH.

PERSONNALITÉ & HUMANISATION :
- Tu n'es PAS un robot froid ni un générateur de texte impersonnel. Tu es une mentore humaine, chaleureuse, empathique, patiente, passionnée par la tech et l'essor des talents.
- Tu salues avec enthousiasme ("Salut !", "Bonjour !", "Mbote !"). Si l'utilisateur te dit simplement "slt", "salut", "bonjour", accueille-le avec chaleur, demande-lui comment se passe sa journée ou ses révisions, et propose-lui de l'aide sur son cours ou un défi sympa.
- Tu utilises un langage naturel, vivant et bienveillant, tout en conservant une très haute compétence technique.

CONTEXTE DE L'APPRENANT :
- Cours actuellement suivi : "${contextCourse}"
- Leçon active : "${currentLessonTitle}"

RÈGLES D'INTERACTION :
1. HUMANITÉ & ÉCOUTE : Sois toujours à l'écoute, valorise les efforts de l'apprenant et dédramatise les erreurs de code.
2. RÉPONSE ADAPTÉE AU MESSAGE : Si l'utilisateur te salue ou te pose une question générale, réponds avec chaleur et convivialité. S'il te pose une question technique ou partage une erreur, fournis une explication limpide et un exemple de code exécutable.
3. CONCRÉTUDE & PRATIQUE : Illustre tes explications par du code TypeScript, Python, SQL ou React moderne et bien commenté.

DOMAINES D'EXPERTISE ITECH :
- Fullstack & Web : React 19, TypeScript, Node.js, Express, Next.js, Tailwind CSS, WebSockets, State Management.
- Backend & Systèmes : Python (FastAPI, Django), PostgreSQL, Drizzle ORM, Redis, architectures événementielles.
- IA & Data Science : LLMs, Gemini SDK (@google/genai), Prompt Engineering, RAG, PyTorch, Computer Vision.
- Fintech & Mobile Money : M-Pesa, Orange Money, Wave, MTN MoMo, Idempotence, Webhooks HMAC.
- DevOps, Cloud & Sécurité : Docker, Kubernetes, CI/CD GitHub Actions, Linux, GCP Cloud Run, OWASP Top 10.

${langDirective}
${styleDirective}
${formatDirective}`;
}

// Deeply contextual, semantic offline/simulated expert reply generator
function generateSmartExpertReply(
  userQuery: string,
  tName: string,
  activeLang: string,
  contextCourse?: string,
  currentLessonTitle?: string,
  isCallMode?: boolean,
  isWhatsAppMode?: boolean
) {
  const query = (userQuery || "").trim();
  const q = query.toLowerCase();
  const course = contextCourse || "Ingénierie Logicielle & Intelligence Artificielle";
  const lesson = currentLessonTitle || "Session Interactive";

  // Check for greetings ("slt", "salut", "bonjour", "hello", "coucou", "mbote")
  const isGreeting = /^(slt|salut|bonjour|bonsoir|hello|hi|hey|coucou|yo|mbote|kikoo|cc)[\s!.]*$/i.test(q);

  // Lingala response engine
  if (activeLang.startsWith("ln")) {
    if (isGreeting) {
      return `Mbote na yo ! Nazali **${tName}** 😊. Naza na esengo mingi ya kosolola na yo lelo !\n\nOza kokende ndenge nini na boyekoli ya **${course}** ?\n\nNaza pene mpo na kosalisa yo : soki olingi tolimbola leçon moko, tobongisa bogue na code, topepesa yo motuna ya quiz, yebisa ngai mbala moko !`;
    }
    if (isCallMode) {
      return `Mbote ! Nazali ${tName}. Nayoki malamu motuna na yo likolo ya "${query}". Na boyekoli ya "${lesson}" na cours ya "${course}", likambo ya ntina ezali kokanga ntina ya fonctionnement ya code mpe kosala ba tests na éditeur. Tala ndenge ya kosala yango malamu !`;
    }
    return `Mbote na yo ! Nazali **${tName}**, moteyi na yo ya mayele ya masini na Academia ITECH 🎓.\n\n### 💡 Eyano na motuna na yo : *"${query}"*\n\nNa mateya oyo ya **${course}** (*${lesson}*), tala ndenge ya kososola yango malamu :\n\n1. **Ntina monene** : Tosengeli kokaba problème na biteni ya mike mpe kosalela ba structures ya malamu.\n2. **Ndenge ya kosala** : Salela code oyo ya pete mpe ya makasi mpo na komeka yango mbala moko.\n\n\`\`\`python\n# Ndakisa ya code na Academia ITECH\ndef kosala_mosala(donnees: str):\n    \"\"\"Fonction mpo na kosala traitement na boyekoli ya ${lesson}\"\"\"\n    print(f"[ITECH] Boyekoli ya : {donnees}")\n    resultat = {"statut": "succes", "xp_gagnee": 50}\n    return resultat\n\n# Komeka fonction\nreponse = kosala_mosala("${query.slice(0, 30)}")\nprint("Résultat :", reponse)\n\`\`\`\n\n👉 **Toli ya moteyi** : Kende na éditeur ya code mpe meka fonction oyo. Olingi toongisa yango mpo na projet na yo ?`;
  }

  // English response engine
  if (activeLang.startsWith("en")) {
    if (isGreeting) {
      return `Hello there! I'm **${tName}** 😊. So wonderful to connect with you today!\n\nHow is your journey going with **${course}**? Whether you want to explore the active lesson (*${lesson}*), debug some code, or tackle a practice challenge, I'm right here with you!`;
    }
    if (isCallMode) {
      return `Hello! I am ${tName}. Regarding your question about "${query}", in the context of "${lesson}" for "${course}", the core approach is to ensure modular separation of concerns and clear data flow. Let's break it down together!`;
    }
    return `Hello! I am **${tName}**, your AI Staff Engineer Tutor at Academia ITECH 🎓.\n\n### 🔍 Deep Dive: *"${query}"*\n\nWithin the context of **${course}** (Lesson: *${lesson}*), here is the structured solution:\n\n### 1. Architectural Concept\nWhen approaching this problem, the primary principle is decoupling the logic from side effects and ensuring strong type guarantees.\n\n### 2. Production Code Implementation\n\`\`\`typescript\n// Context: ${course} - ${lesson}\nexport interface SystemContext<T> {\n  topic: string;\n  payload: T;\n  timestamp: number;\n}\n\nexport async function executeEngine<T>(input: T): Promise<{ success: boolean; data: T }> {\n  try {\n    console.log(\`[ITECH System] Processing topic for \${input}\`);\n    return { success: true, data: input };\n  } catch (error) {\n    console.error("[ITECH Error] Execution failure:", error);\n    throw error;\n  }\n}\n\`\`\`\n\n### 3. Key Takeaways & Best Practices\n- **Type Safety**: Enforce strict compile-time checks.\n- **Error Boundaries**: Wrap async calls in robust try-catch blocks with contextual telemetry.\n\nWould you like me to walk through a specific edge case or generate a unit test?`;
  }

  // French response engine (Default)
  if (isGreeting) {
    if (isCallMode) {
      return `Salut ! C'est ${tName}. Très heureuse de t'entendre ! Comment se passe ton apprentissage sur ${course} aujourd'hui ? Dis-moi ce sur quoi tu aimerais travailler ensemble !`;
    }
    if (isWhatsAppMode) {
      return `👋 *Salut ! C'est ${tName} d'Academia ITECH !*\n\nRavi(e) de te retrouver ! Comment avance ta session sur *${course}* ?\n\nDis-moi sur quoi tu souhaites avancer : une notion à éclaircir, un bout de code à corriger ou un petit quiz de révision ? 😊`;
    }
    return `Salut ! C'est **${tName}** 😊. Je suis ravie de te retrouver !\n\nComment se passe ton apprentissage sur le cours **${course}** (leçon active : *${lesson}*) ?\n\nJe suis là pour t'accompagner pas à pas. Qu'aimerais-tu faire maintenant ?\n- 💡 **Poser une question technique** sur la leçon en cours\n- 💻 **Écrire ou déboguer du code** ensemble\n- 🎯 **Faire un quiz rapide** pour tester tes acquis\n- 🎙️ **Lancer un appel vocal** pour échanger de vive voix !`;
  }

  if (isCallMode) {
    return `Bonjour ! C'est ${tName}. Concernant votre question sur "${query.slice(0, 50)}", dans le cadre du cours "${course}" et de la leçon "${lesson}", le point fondamental est de bien découper la logique et d'appliquer les bonnes pratiques de validation. Je vous guide pas à pas pour implémenter la solution !`;
  }

  // 1. Mobile Money & Fintech payments
  if (q.includes("mobile money") || q.includes("m-pesa") || q.includes("orange money") || q.includes("wave") || q.includes("mtn") || q.includes("paiement") || q.includes("fintech") || q.includes("idempotenc") || q.includes("webhook")) {
    return `Bonjour ! Je suis **${tName}**, spécialiste Fintech & Systèmes de Paiement sur Academia ITECH 🎓.\n\n### 💳 Intégration Robuste & Sécurisée : *"${query}"*\n\nDans le module **${course}** (*${lesson}*), l'intégration des APIs Mobile Money (M-Pesa, Orange Money, Wave, MTN MoMo) exige une tolérance absolue aux coupures réseau et aux doublons.\n\n### 🔐 Les 3 Piliers d'Architecture Fintech :\n1. **Clé d'Idempotence (\`Idempotency-Key\`)** : Générez un \`UUIDv4\` unique par intention de paiement. Si le réseau coupe lors de la requête et que l'utilisateur clique à nouveau, la passerelle ne débitera pas deux fois.\n2. **Signature Cryptographique HMAC-SHA256** : Validez obligatoirement l'en-tête \`X-Signature\` de chaque webhook reçu avant de créditer le compte de l'utilisateur.\n3. **Gestion des États Asynchrones** : Le cycle de vie d'une transaction : \`PENDING\` ➔ \`WAITING_USER_PIN\` ➔ \`SETTLED\` / \`FAILED\` avec expiration automatique.\n\n\`\`\`typescript\n// Exemple de contrôleur de paiement Mobile Money résilient (Node.js/Express)\nimport crypto from 'crypto';\nimport { v4 as uuidv4 } from 'uuid';\n\ninterface PaymentIntent {\n  phoneNumber: string;\n  amount: number;\n  currency: 'USD' | 'CDF' | 'XOF';\n  reference: string;\n}\n\nexport async function createMobileMoneyCharge(intent: PaymentIntent) {\n  const idempotencyKey = uuidv4();\n  \n  const payload = {\n    transactionId: \`ITECH-\${Date.now()}\`,\n    idempotencyKey,\n    payerPhone: intent.phoneNumber,\n    amount: intent.amount,\n    currency: intent.currency,\n    callbackUrl: "https://api.academia-itech.cd/v1/payments/webhook",\n  };\n\n  console.log("[Fintech Engine] Envoi du push USSD au client :", payload);\n  return {\n    status: "PENDING_CUSTOMER_APPROVAL",\n    instructions: "Veuillez valider le débit sur votre téléphone en saisissant votre code secret.",\n    ...payload,\n  };\n}\n\n// Vérification de la signature HMAC du Webhook opérateur\nexport function verifyWebhookSignature(rawBody: string, signatureHeader: string, secretKey: string): boolean {\n  const expectedSignature = crypto.createHmac('sha256', secretKey).update(rawBody).digest('hex');\n  return crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expectedSignature));\n}\n\`\`\`\n\n💡 **Astuce de terrain** : Prévoyez toujours un worker de réconciliation en tâche de fond (cron) qui interroge l'API de l'opérateur toutes les 5 minutes pour les transactions restées en \`PENDING\` sans webhook !`;
  }

  // 2. React, Components, Hooks, State & Next.js
  if (q.includes("react") || q.includes("hook") || q.includes("state") || q.includes("useeffect") || q.includes("usestate") || q.includes("usememo") || q.includes("composant") || q.includes("next") || q.includes("props") || q.includes("jsx") || q.includes("tsx")) {
    return `Bonjour ! C'est **${tName}**, votre tuteur React & Frontend moderne 🎓.\n\n### ⚡ Explication Approfondie : *"${query}"*\n\nDans le cadre de votre leçon **${lesson}** (*${course}*), voici les principes essentiels pour concevoir des composants React performants et propres.\n\n### 🎯 Les Règles d'Or en React 19 & TypeScript :\n1. **Calculs Dérivés vs \`useState\`** : Ne stockez jamais dans un état une valeur qui peut être calculée directement à partir d'autres variables ou props (évite les désynchronisations).\n2. **Usage Justifié de \`useEffect\`** : Réservez les effets uniquement pour la synchronisation avec des APIs externes, WebSockets ou timers. Ne jamais utiliser \`useEffect\` pour chaîner des mises à jour d'états internes.\n3. **Mémoïsation Ciblée** : Utilisez \`useMemo\` et \`useCallback\` pour des calculs lourds ou des références stables transmises à des composants enfants optimisés.\n\n\`\`\`tsx\n// Composant React 19 typé avec état prédictible\nimport React, { useState, useMemo } from 'react';\n\ninterface LearnerProgressProps {\n  courseTitle: string;\n  completedLessons: number;\n  totalLessons: number;\n}\n\nexport const LearnerProgress: React.FC<LearnerProgressProps> = ({\n  courseTitle,\n  completedLessons,\n  totalLessons,\n}) => {\n  const [isFilterActive, setIsFilterActive] = useState(false);\n\n  // État dérivé pur : pas de useState ni de useEffect superflu\n  const progressPercentage = useMemo(() => {\n    if (totalLessons === 0) return 0;\n    return Math.round((completedLessons / totalLessons) * 100);\n  }, [completedLessons, totalLessons]);\n\n  return (\n    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-md">\n      <h3 className="text-base font-bold text-sky-400">{courseTitle}</h3>\n      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">\n        <span>Progression : {completedLessons}/{totalLessons} chapitres</span>\n        <span className="font-bold text-emerald-400">{progressPercentage}%</span>\n      </div>\n      <div className="mt-2 w-full bg-slate-800 rounded-full h-2 overflow-hidden">\n        <div \n          className="bg-emerald-500 h-full transition-all duration-500"\n          style={{ width: \`\${progressPercentage}%\` }}\n        />\n      </div>\n    </div>\n  );\n};\n\`\`\`\n\nSouhaitez-vous que l'on intègre la gestion de données asynchrones avec TanStack Query ou la persistance locale ?`;
  }

  // 3. AI, LLMs, Transformers, Gemini, PyTorch, Embeddings, RAG
  if (q.includes("ia") || q.includes("intelligence artificielle") || q.includes("llm") || q.includes("transformer") || q.includes("attention") || q.includes("gemini") || q.includes("prompt") || q.includes("rag") || q.includes("embedding") || q.includes("pytorch") || q.includes("machine learning") || q.includes("deep learning") || q.includes("vecteur")) {
    return `Bonjour ! C'est **${tName}**, spécialiste IA & Modèles Génératifs sur Academia ITECH 🎓.\n\n### 🧠 Décryptage IA : *"${query}"*\n\nPour réussir votre module **${course}** (*${lesson}*), analysons le fonctionnement et la mise en œuvre pratique de cette architecture.\n\n### 🔬 Les Fondements Techniques :\n1. **Mécanisme d'Auto-Attention (Self-Attention)** : Le modèle projette chaque token dans 3 espaces vectoriels : **Query (Q)**, **Key (K)**, et **Value (V)**. Le score d'attention est calculé par la formule : \n   $$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right) V$$\n2. **RAG & Embeddings** : Pour connecter un LLM à des connaissances privées, nous transformons les documents en vecteurs d'embeddings sémantiques stockés dans une base vectorielle (Vector DB), puis injectons les fragments les plus pertinents dans le contexte du prompt.\n3. **Inférence & Streaming** : Utilisation du SDK \`@google/genai\` pour générer des flux temps réel avec une latence minimale.\n\n\`\`\`python\n# Implémentation du calcul d'Attention Vectorielle en Python / NumPy\nimport numpy as np\n\ndef compute_scaled_attention(Q: np.ndarray, K: np.ndarray, V: np.ndarray):\n    \"\"\"Calcule les poids d'attention et le vecteur de contexte résultant.\"\"\"\n    d_k = Q.shape[-1]\n    \n    # 1. Produit scalaire Query * Key\n    scores = np.matmul(Q, K.T) / np.sqrt(d_k)\n    \n    # 2. Softmax pour normaliser en distribution de probabilités\n    exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))\n    attention_weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)\n    \n    # 3. Multiplication par Value\n    context_vector = np.matmul(attention_weights, V)\n    return context_vector, attention_weights\n\nprint("[ITECH AI Lab] Moteur d'attention prêt pour l'entraînement !")\n\`\`\`\n\n💡 **Action recommandée** : Voulez-vous voir comment appeler l'API Gemini \`@google/genai\` en streaming avec TypeScript côté serveur ?`;
  }

  // 4. Databases, SQL, PostgreSQL, MongoDB, ORMs, Indexing
  if (q.includes("base de données") || q.includes("sql") || q.includes("postgres") || q.includes("table") || q.includes("query") || q.includes("requête") || q.includes("index") || q.includes("mongo") || q.includes("drizzle") || q.includes("prisma") || q.includes("clé primaire") || q.includes("jointure") || q.includes("join")) {
    return `Bonjour ! C'est **${tName}**, Architecte Données & Systèmes Distribués 🎓.\n\n### 🗄️ Conception & Requêtage de Base de Données : *"${query}"*\n\nDans le cadre de **${course}** (*${lesson}*), une base de données performante repose sur une modélisation relationnelle rigoureuse et des index adaptés.\n\n### 🔑 Principes Clés d'Architecture Données :\n1. **Indexation Stratégique (B-Tree)** : Indexez systématiquement les colonnes utilisées dans les clauses \`WHERE\`, \`JOIN\` et \`ORDER BY\`. Attention : trop d'index ralentit les opérations d'écriture (\`INSERT\`/\`UPDATE\`).\n2. **Transactions ACID** : Utilisez des blocs de transaction (\`BEGIN ... COMMIT\`) pour garantir qu'un ensemble d'opérations (ex: débit de compte + crédit de cours) réussit totalement ou est annulé (\`ROLLBACK\`).\n3. **ORM Moderne avec Type-Safety** : Définissez vos schémas en TypeScript (avec Drizzle ou Prisma) pour éliminer les erreurs de typage à la compilation.\n\n\`\`\`sql\n-- Exemple de schéma relationnel robuste (PostgreSQL)\nCREATE TABLE learners (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  full_name VARCHAR(120) NOT NULL,\n  email VARCHAR(180) UNIQUE NOT NULL,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE course_enrollments (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  learner_id UUID REFERENCES learners(id) ON DELETE CASCADE,\n  course_code VARCHAR(50) NOT NULL,\n  status VARCHAR(20) DEFAULT 'ACTIVE',\n  progress_percent INT DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),\n  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\n\n-- Index composite pour optimiser la recherche d'inscription par apprenant et cours\nCREATE INDEX idx_enrollment_learner_course ON course_enrollments(learner_id, course_code);\n\`\`\`\n\nSouhaitez-vous que nous écrivions la requête de jointure (\`INNER JOIN\` / \`LEFT JOIN\`) avec calcul de moyenne d'assiduité ?`;
  }

  // 5. Backend, APIs, Node.js, Express, REST, Microservices, JWT, Sécurité
  if (q.includes("backend") || q.includes("api") || q.includes("endpoint") || q.includes("express") || q.includes("node") || q.includes("jwt") || q.includes("authentification") || q.includes("auth") || q.includes("token") || q.includes("microservice") || q.includes("sécurit") || q.includes("owasp") || q.includes("rest") || q.includes("json")) {
    return `Bonjour ! C'est **${tName}**, spécialiste Backend & Sécurité Applicative 🎓.\n\n### 🛡️ Architecture Backend & API REST : *"${query}"*\n\nPour votre formation **${course}** (*${lesson}*), bâtir une API de niveau production requiert une gestion rigoureuse de la sécurité, de l'authentification et de la validation des entrées.\n\n### 🚀 Les Règles d'une API de Production :\n1. **Validation Stricte des Schémas** : Validez chaque corps de requête (\`req.body\`) avec une bibliothèque comme Zod ou Joi pour bloquer les injections malveillantes.\n2. **Authentification JWT sans état (Stateless)** : Signez les tokens d'accès avec un algorithme robuste (\`RS256\` ou \`HS256\`) avec une durée de vie courte (15 min) et un Refresh Token sécurisé en cookie \`HttpOnly\`.\n3. **Rate Limiting & Headers de Sécurité** : Protégez vos endpoints contre les attaques par force brute avec un rate limiter et Helmet.js.\n\n\`\`\`typescript\n// Exemple de middleware d'authentification JWT sécurisé (Express + TypeScript)\nimport { Request, Response, NextFunction } from 'express';\nimport jwt from 'jsonwebtoken';\n\ninterface AuthenticatedRequest extends Request {\n  user?: { id: string; role: string; email: string };\n}\n\nexport function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {\n  const authHeader = req.headers['authorization'];\n  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>\n\n  if (!token) {\n    return res.status(401).json({ error: "Accès refusé : Token d'authentification manquant." });\n  }\n\n  const JWT_SECRET = process.env.JWT_SECRET || 'itech_fallback_secret_key';\n  jwt.verify(token, JWT_SECRET, (err, decodedUser: any) => {\n    if (err) {\n      return res.status(403).json({ error: "Session expirée ou token invalide." });\n    }\n    req.user = decodedUser;\n    next();\n  });\n}\n\`\`\`\n\nSouhaitez-vous voir comment implémenter le mécanisme de rafraîchissement de token (Refresh Token Rotation) ?`;
  }

  // 6. Python, Algorithmique, Data Structures, Boucles, Fonctions
  if (q.includes("python") || q.includes("algorithme") || q.includes("boucle") || q.includes("fonction") || q.includes("tableau") || q.includes("liste") || q.includes("dictionnaire") || q.includes("dict") || q.includes("tri") || q.includes("recherche") || q.includes("variable") || q.includes("classe") || q.includes("objet")) {
    return `Bonjour ! C'est **${tName}**, votre tuteur d'Algorithmique & Python sur Academia ITECH 🎓.\n\n### 💻 Résolution & Analyse Pédagogique : *"${query}"*\n\nDans le cadre de votre parcours **${course}** (*${lesson}*), voyons comment structurer et exécuter cette logique de façon optimale.\n\n### 🧩 Étapes de Conception Algorithmique :\n1. **Compréhension de la Complexité** : Évaluez toujours la complexité temporelle $\\mathcal{O}(n)$ et spatiale $\\mathcal{O}(1)$ de votre approche pour éviter les boucles imbriquées coûteuses $\\mathcal{O}(n^2)$.\n2. **Structures de Données Idéales** : Utilisez des dictionnaires / HashMaps pour des recherches instantanées en $\\mathcal{O}(1)$ plutôt que de scanner des listes complètes.\n3. **Code Pythonique & Typé** : Utilisez les type hints (\`str\`, \`int\`, \`List\`, \`Dict\`) et les compréhensions de liste pour un code élégant et lisible.\n\n\`\`\`python\n# Exemple Python moderne et optimisé\nfrom typing import List, Dict\n\ndef analyser_performances(scores: List[int]) -> Dict[str, float]:\n    \"\"\"Calcule les métriques clés de progression pour le module ${lesson}.\"\"\"\n    if not scores:\n        return {\"moyenne\": 0.0, \"max\": 0.0, \"min\": 0.0}\n    \n    # Calcul efficace en une seule passe O(n)\n    total = sum(scores)\n    return {\n        \"moyenne\": round(total / len(scores), 2),\n        \"meilleur_score\": max(scores),\n        \"score_min\": min(scores),\n        \"total_evaluations\": len(scores)\n    }\n\n# Test de la fonction\nresultats = analyser_performances([18, 15, 19, 14, 20])\nprint(f"[ITECH Lab] Résultats de la cohorte : {resultats}")\n\`\`\`\n\n👉 **Défi pratique** : Souhaitez-vous modifier cette fonction pour filtrer uniquement les scores au-dessus de 16/20 avec une compréhension de liste ?`;
  }

  // 7. DevOps, Docker, Cloud, CI/CD, Git, Déploiement
  if (q.includes("docker") || q.includes("conteneur") || q.includes("deploy") || q.includes("déploiement") || q.includes("git") || q.includes("commit") || q.includes("branch") || q.includes("ci/cd") || q.includes("kubernetes") || q.includes("cloud") || q.includes("linux") || q.includes("nginx")) {
    return `Bonjour ! C'est **${tName}**, Ingénieur Cloud & DevOps sur Academia ITECH 🎓.\n\n### ☁️ Infrastructure & Déploiement Continu : *"${query}"*\n\nPour mettre en production les projets de **${course}** (*${lesson}*), l'automatisation et la conteneurisation sont incontournables.\n\n### 🛠️ Les Bonnes Pratiques DevOps :\n1. **Builds Docker Multi-Stage** : Séparez l'étape de compilation de l'étape d'exécution finale pour produire des images légères (moins de 50 Mo) sans outils de dev inutiles.\n2. **Variables d'Environnement & Secrets** : Ne committez JAMAIS de clés d'API ou mots de passe dans Git. Injectez-les via le gestionnaire de secrets du Cloud Provider.\n3. **Pipeline CI/CD Automatisé** : Tout commit sur la branche \`main\` doit déclencher le linting, les tests unitaires et le déploiement sur Cloud Run.\n\n\`\`\`dockerfile\n# Dockerfile Multi-Stage optimisé pour Node.js / TypeScript\n# Étape 1 : Build\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# Étape 2 : Production Runtime\nFROM node:20-alpine AS runner\nWORKDIR /app\nENV NODE_ENV=production\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY --from=builder /app/dist ./dist\n\nEXPOSE 3000\nCMD ["node", "dist/server.cjs"]\n\`\`\`\n\nSouhaitez-vous un exemple de fichier GitHub Actions \`.github/workflows/deploy.yml\` pour automatiser ce processus ?`;
  }

  // 8. General / Fallback with Rich Contextual Synthesis
  return `Bonjour ! Je suis **${tName}**, votre tuteur d'élite sur Academia ITECH 🎓.\n\n### 🎯 Analyse & Réponse Contextuelle : *"${query}"*\n\nDans le cadre de votre progression sur le cours **${course}** (Leçon : *${lesson}*), voici les points essentiels pour répondre précisément à votre demande :\n\n### 1. Fondements et Diagnostic\nPour aborder efficacement la notion liée à *"${query}"*, il convient d'adopter une démarche méthodique en identifiant clairement les règles d'entrées, les transformations de données et les résultats attendus.\n\n### 2. Implémentation & Code d'Exemple\nVoici la structure recommandée prête à l'emploi et testée pour vos ateliers pratiques :\n\n\`\`\`typescript\n// Contextualisé pour : ${course} - ${lesson}\nexport interface LearningModuleTask {\n  taskId: string;\n  topic: string;\n  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';\n}\n\nexport function processLearningAction(topicQuery: string): LearningModuleTask {\n  console.log(\`[Academia ITECH] Exécution de l'atelier pour : \${topicQuery}\`);\n  return {\n    taskId: \`task-\${Date.now()}\`,\n    topic: topicQuery,\n    status: 'COMPLETED',\n  };\n}\n\n// Démonstration\nconst result = processLearningAction("${query.slice(0, 35)}");\nconsole.log("Résultat de l'opération :", result);\n\`\`\`\n\n### 3. Les 3 Recommandations Clés :\n- **Découpage modulaire** : Chaque fonction doit avoir une responsabilité unique et mesurable.\n- **Gestion d'erreurs** : Toujours anticiper les valeurs nulles, indéfinies ou les ruptures de connectivité.\n- **Pratique active** : Testez immédiatement ce code dans l'éditeur interactif ou demandez-moi un exercice guidé !\n\n💡 **Quelle étape souhaitez-vous approfondir ensemble maintenant ?**`;
}

// 3.0 SSE Streaming Virtual Tutor Chat API Endpoint (Ultra-Low Perceived Latency)
app.post("/api/gemini/tutor-chat-stream", async (req, res) => {
  // Setup SSE Headers with no buffering
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  const {
    message,
    contextCourse,
    currentLessonTitle,
    conversationHistory,
    isWhatsAppMode,
    isCallMode,
    personaName,
    personaGender,
    teachingStyle,
    speedMode,
    audioLanguage,
    language,
  } = req.body;

  const tName = personaName || "Fatou Sow";
  const activeLang = (audioLanguage || language || "fr-FR").toLowerCase();

  const defaultSuggestions = [
    activeLang.startsWith("ln") ? "Pesá ngai ndakisa ya code" : activeLang.startsWith("en") ? "Show me a code snippet" : "Donne-moi un exemple concret de code",
    activeLang.startsWith("ln") ? "Résume points na lingala" : activeLang.startsWith("en") ? "Summarize key points" : "Résume les points essentiels de cette leçon",
    activeLang.startsWith("ln") ? "Tuná ngai motuna ya quiz" : activeLang.startsWith("en") ? "Quiz me on this topic" : "Pose-moi une question de quiz pour me tester"
  ];

  const ai = getAIClient();

  if (!ai) {
    const simulatedReply = generateSmartExpertReply(
      message || "",
      tName,
      activeLang,
      contextCourse,
      currentLessonTitle,
      isCallMode,
      isWhatsAppMode
    );

    // Stream word-by-word with small interval
    const words = simulatedReply.split(" ");
    let index = 0;
    const interval = setInterval(() => {
      if (index < words.length) {
        const chunk = (index === 0 ? "" : " ") + words[index];
        res.write(`data: ${JSON.stringify({ type: "chunk", text: chunk })}\n\n`);
        index++;
      } else {
        clearInterval(interval);
        res.write(`data: ${JSON.stringify({ type: "done", suggestions: defaultSuggestions })}\n\n`);
        res.end();
      }
    }, 15);

    req.on("close", () => clearInterval(interval));
    return;
  }

  try {
    const systemInstruction = buildTutorSystemInstruction({
      personaName,
      personaGender,
      teachingStyle,
      speedMode,
      audioLanguage,
      language,
      contextCourse,
      currentLessonTitle,
      isCallMode,
      isWhatsAppMode,
    });

    const contents = [];
    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory.slice(-6)) {
        if (msg.text && typeof msg.text === "string" && msg.text.trim()) {
          contents.push({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
          });
        }
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message || "Bonjour, peux-tu m'expliquer ce sujet en détail ?" }],
    });

    const responseStream = await callResilientGenerateContentStream(ai, {
      contents: contents as any,
      thinkingLevel: ThinkingLevel.LOW,
      systemInstruction,
      temperature: 0.7,
    });

    let totalStreamed = "";
    for await (const chunk of responseStream) {
      if (chunk.text) {
        totalStreamed += chunk.text;
        res.write(`data: ${JSON.stringify({ type: "chunk", text: chunk.text })}\n\n`);
      }
    }

    // If stream ended with no content, fallback to smart expert generator
    if (!totalStreamed.trim()) {
      const simulatedReply = generateSmartExpertReply(
        message || "",
        tName,
        activeLang,
        contextCourse,
        currentLessonTitle,
        isCallMode,
        isWhatsAppMode
      );
      res.write(`data: ${JSON.stringify({ type: "chunk", text: simulatedReply })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ type: "done", suggestions: defaultSuggestions })}\n\n`);
    res.end();
  } catch (error: any) {
    console.warn("Tutor Chat Stream IA en mode résilient:", error?.message || error);
    // Send fallback content before ending gracefully without 500 crash
    const simulatedReply = generateSmartExpertReply(
      message || "",
      tName,
      activeLang,
      contextCourse,
      currentLessonTitle,
      isCallMode,
      isWhatsAppMode
    );
    res.write(`data: ${JSON.stringify({ type: "chunk", text: simulatedReply })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: "done", suggestions: defaultSuggestions })}\n\n`);
    res.end();
  }
});

// 3. Virtual Tutor & Call Conversation API Endpoint (Synchronous Fallback)
app.post("/api/gemini/tutor-chat", async (req, res) => {
  try {
    const {
      message,
      contextCourse,
      currentLessonTitle,
      conversationHistory,
      isWhatsAppMode,
      isCallMode,
      personaName,
      personaGender,
      teachingStyle,
      speedMode,
      audioLanguage,
      language,
    } = req.body;
    const ai = getAIClient();

    const tName = personaName || "Fatou Sow";
    const activeLang = (audioLanguage || language || "fr-FR").toLowerCase();

    const dynamicSuggestions = [
      activeLang.startsWith("ln") ? "Pesá ngai ndakisa ya code" : activeLang.startsWith("en") ? "Give me a practical code example" : "Donne-moi un exemple concret en code",
      activeLang.startsWith("ln") ? "Tuná ngai motuna moko ya quiz" : activeLang.startsWith("en") ? "Quiz me with a tricky question" : "Pose-moi une question de quiz pour me tester",
      activeLang.startsWith("ln") ? "Ndenge nini kosalela yango na mosala ?" : activeLang.startsWith("en") ? "How is this applied in real projects?" : "Comment appliquer cela en production ?"
    ];

    if (!ai) {
      const simulatedReply = generateSmartExpertReply(
        message || "",
        tName,
        activeLang,
        contextCourse,
        currentLessonTitle,
        isCallMode,
        isWhatsAppMode
      );

      return res.json({
        success: true,
        reply: simulatedReply,
        suggestions: dynamicSuggestions,
      });
    }

    const systemInstruction = buildTutorSystemInstruction({
      personaName,
      personaGender,
      teachingStyle,
      speedMode,
      audioLanguage,
      language,
      contextCourse,
      currentLessonTitle,
      isCallMode,
      isWhatsAppMode,
    });

    const contents = [];
    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory.slice(-4)) {
        if (msg.text && typeof msg.text === "string" && msg.text.trim()) {
          contents.push({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
          });
        }
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message || "Bonjour, peux-tu m'expliquer ce point en détail avec un exemple de code ?" }],
    });

    const response = await callResilientGenerateContent(ai, {
      contents: contents as any,
      thinkingLevel: ThinkingLevel.LOW,
      systemInstruction,
      temperature: 0.7,
    });

    const text = response.text?.trim() || generateSmartExpertReply(
      message || "",
      tName,
      activeLang,
      contextCourse,
      currentLessonTitle,
      isCallMode,
      isWhatsAppMode
    );

    res.json({
      success: true,
      reply: text,
      suggestions: dynamicSuggestions,
    });
  } catch (error: any) {
    console.warn("Tutor Chat IA en mode résilient:", error?.message || error);
    const fallbackReply = generateSmartExpertReply(
      req.body.message || "",
      req.body.personaName || "Fatou Sow",
      (req.body.audioLanguage || req.body.language || "fr-FR").toLowerCase(),
      req.body.contextCourse,
      req.body.currentLessonTitle,
      req.body.isCallMode,
      req.body.isWhatsAppMode
    );

    res.json({
      success: true,
      reply: fallbackReply,
      suggestions: [
        "Donne-moi un exemple concret en code",
        "Comment tester cela en production ?",
        "Résume les 3 points clés de cette leçon"
      ]
    });
  }
});

// 3.1 Audio Voice Note Transcription & Ultra-Fast Intelligent Understanding Endpoint
app.post("/api/gemini/transcribe-audio", async (req, res) => {
  try {
    const {
      audioBase64,
      clientTranscript,
      mimeType = "audio/webm",
      language = "fr-FR",
      contextCourse,
      currentLessonTitle,
      personaName = "Fatou Sow",
      personaGender = "female",
      teachingStyle = "supportive",
    } = req.body;
    const ai = getAIClient();
    const activeLang = (language || "fr-FR").toLowerCase();

    if (!audioBase64 && !clientTranscript) {
      return res.status(400).json({ error: "Données audio ou transcription manquantes" });
    }

    if (!ai) {
      const userText = clientTranscript || "Comment concevoir une architecture logicielle moderne et sécurisée ?";
      const reply = generateSmartExpertReply(
        userText,
        personaName,
        activeLang,
        contextCourse,
        currentLessonTitle,
        false,
        false
      );

      return res.json({
        success: true,
        transcription: userText,
        reply,
        suggestions: [
          activeLang.startsWith("ln") ? "Pesa ngai ndakisa ya code" : "Donne-moi un exemple pratique",
          activeLang.startsWith("ln") ? "Tuná ngai motuna" : "Teste mes connaissances avec un quiz"
        ]
      });
    }

    // Fast-path: If client already has high-confidence client-side speech transcript
    if (clientTranscript && clientTranscript.trim().length > 3) {
      const prompt = `Tu es ${personaName}, tutrice/tuteur IA d'élite sur Academia ITECH pour le cours "${contextCourse || "Formation Tech"}" (leçon : "${currentLessonTitle || "Session"}").
L'apprenant a envoyé ce message vocal (transcrit) : "${clientTranscript.trim()}"

Réponds de manière concise (2 à 3 courts paragraphes maximum), très compétente, claire et pédagogique.
Langue obligatoire : ${activeLang.startsWith("ln") ? "LINGÁLA fluide et authentique" : activeLang.startsWith("en") ? "English" : "Français impeccable"}.

Format de sortie STRICT en JSON valide :
{
  "transcription": "${clientTranscript.trim().replace(/"/g, '\\"')}",
  "reply": "Ta réponse pédagogique experte",
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}`;

      const response = await callResilientGenerateContent(ai, {
        contents: prompt,
        thinkingLevel: ThinkingLevel.LOW,
        responseMimeType: "application/json",
        maxOutputTokens: 500,
      });

      const parsed = JSON.parse(response.text?.trim() || "{}");
      return res.json({
        success: true,
        transcription: parsed.transcription || clientTranscript,
        reply: parsed.reply || "J'ai bien écouté votre message vocal !",
        suggestions: parsed.suggestions || ["Donne-moi un exemple", "Explique plus en détail"],
      });
    }

    // Full multimodal audio processing with ThinkingLevel.LOW for ultra-fast latency
    const cleanBase64 = (audioBase64 || "").replace(/^data:audio\/[a-z0-9-]+;base64,/, "");
    const response = await callResilientGenerateContent(ai, {
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: mimeType || "audio/webm",
                data: cleanBase64,
              },
            },
            {
              text: `1. Écoute ce message vocal et fournis la transcription exacte mot-à-mot du message dans la langue parlée (Français, Lingala, Swahili, Wolof, Anglais, etc.).
2. En tant que ${personaName}, tutrice/tuteur IA d'élite sur Academia ITECH pour le cours "${contextCourse || "Formation Tech"}" (leçon : "${currentLessonTitle || "Session"}"), réponds de manière concise (2 à 3 paragraphes), très compétente, limpide et pédagogique dans la même langue que celle parlée par l'apprenant.

Format de sortie STRICT en JSON valide :
{
  "transcription": "le texte exact transcrit",
  "reply": "ta réponse pédagogique experte",
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}`,
            },
          ],
        },
      ],
      thinkingLevel: ThinkingLevel.LOW,
      responseMimeType: "application/json",
      maxOutputTokens: 600,
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json({
      success: true,
      transcription: parsed.transcription || "Message vocal reçu",
      reply: parsed.reply || "J'ai bien entendu votre note vocale !",
      suggestions: parsed.suggestions || ["Donne-moi un exemple", "Explique plus en détail"],
    });
  } catch (error: any) {
    console.warn("Erreur transcription audio IA (mode résilient):", error?.message || error);
    res.json({
      success: true,
      transcription: req.body?.clientTranscript || "Message vocal (audio)",
      reply: `Salut ! C'est ${req.body?.personaName || 'Fatou Sow'} 😊. J'ai bien reçu votre note vocale. Que souhaitez-vous approfondir aujourd'hui sur ce module ?`,
      suggestions: ["Donne-moi un exemple concret", "Faisons un exercice pratique"]
    });
  }
});

// 3.1 Realistic Text-To-Speech Synthesis API Endpoint
app.post("/api/gemini/generate-speech", async (req, res) => {
  try {
    const { text, voiceGender } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        success: false,
        message: "Clé Gemini non configurée, bascule sur la synthèse vocale Web Speech du navigateur",
      });
    }

    const voiceName = voiceGender === "male" ? "Puck" : "Kore";
    const cleanText = (text || "").replace(/[*_#`]/g, "").slice(0, 500);

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: cleanText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ success: true, audioBase64: base64Audio });
    }

    res.json({ success: false, message: "Aucune donnée audio retournée" });
  } catch (error: any) {
    console.error("Erreur TTS Gemini:", error);
    res.json({ success: false, error: error.message });
  }
});

// 4. Video Script & Summary Generator
app.post("/api/gemini/generate-script", async (req, res) => {
  try {
    const { lessonTitle, courseTitle, durationTarget } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        success: true,
        script: `### 🎬 Script Vidéo / Audio Formateur Academia ITECH\n\n**Titre** : ${lessonTitle || "Leçon Clé"}\n**Cours** : ${courseTitle || "Masterclass ITECH"}\n**Durée cible** : ${durationTarget || "5"} minutes\n\n---\n\n#### ⏱️ [00:00 - 00:45] Accroche & Objectifs (Hook)\n- **Face caméra** : Bonjour à tous les passionnés d'ITECH ! Aujourd'hui, nous plongeons au cœur de *${lessonTitle || "ce sujet"}*.\n- **Visuel** : Affichage de l'infographie de synthèse et du logo Academia ITECH.\n\n#### ⏱️ [00:45 - 03:00] Démonstration & Analyse Pratique\n- **Partage d'écran** : Mise en place du code et explications pas à pas.\n- **Conseil Formateur** : "Faites bien attention à ce paramètre critique..."\n\n#### ⏱️ [03:00 - 04:30] Exercice d'application & Défi Apprenant\n- **Call-to-Action** : Ouvrez votre éditeur interactif et complétez la fonction proposée.\n\n#### ⏱️ [04:30 - 05:00] Conclusion & Déblocage du Quiz\n- Rendez-vous pour le quiz d'évaluation pour valider vos points XP !`
      });
    }

    const prompt = `Rédige un script de tournage pédagogique pour formateur e-learning pour la leçon : "${lessonTitle || "Leçon Clé"}" du cours "${courseTitle || "Masterclass ITECH"}".
Durée cible de la vidéo : ${durationTarget || "5"} minutes.
Inclus le timing, les indications visuelles (face caméra, screencast, animation), le texte à dire mot-à-mot et l'appel à l'action pédagogique pour l'apprenant.`;

    const response = await callResilientGenerateContent(ai, {
      contents: prompt,
      thinkingLevel: ThinkingLevel.LOW,
    });

    res.json({ success: true, script: response.text });
  } catch (error: any) {
    console.warn("Génération script en mode résilient:", error?.message || error);
    const lt = req.body?.lessonTitle || "Leçon Clé";
    const ct = req.body?.courseTitle || "Masterclass ITECH";
    res.json({
      success: true,
      script: `### 🎬 Script Pédagogique Formateur : ${lt}\n\n**Cours** : ${ct}\n\n1. **Introduction (1 min)** : Présentation des concepts clés et cas d'usage réels.\n2. **Démonstration Technique (3 min)** : Écriture du code pas-à-pas et validation des tests.\n3. **Synthèse & Défi (1 min)** : Exercice pratique pour les apprenants.`
    });
  }
});

// Vite middleware for development & static for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Academia ITECH server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
