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
            `Maîtrise des fondamentaux de ${topic}`,
            "Implémentation de projets concrets et architecture robuste",
            "Bonnes pratiques de production et sécurité",
            "Résolution de problèmes complexes et optimisation"
          ],
          tags: [topic, "Academia ITECH", "Certification", "Pratique"],
          chapters: [
            {
              id: `chap-${Date.now()}-1`,
              title: `Module 1 : Fondements et Concepts Clés de ${topic}`,
              description: "Comprendre les principes théoriques et l'état de l'art",
              lessons: [
                {
                  id: `les-${Date.now()}-1`,
                  title: `1.1 Introduction et Enjeux Majeurs de ${topic}`,
                  durationMinutes: 20,
                  type: "video",
                  content: `### 🎯 Objectifs de la leçon\n\nDécouvrir l'écosystème global de **${topic}**, les cas d'usage industriels et les outils essentiels.\n\n#### Points Clés :\n- Définitions fondamentales et historique\n- Comparatif des approches modernes\n- Préparation de l'environnement de travail`,
                  resources: [
                    { id: "r1", title: "Support de cours et synthèse (PDF)", url: "#", type: "pdf", size: "1.8 MB" }
                  ]
                },
                {
                  id: `les-${Date.now()}-2`,
                  title: `1.2 Atelier Pratique : Première Mise en Œuvre`,
                  durationMinutes: 30,
                  type: "interactive_code",
                  codeLanguage: "python",
                  codeStarter: `# Atelier pratique ${topic}\ndef main():\n    print("Initialisation du module ${topic}")\n\nmain()`,
                  codeSolution: `# Solution optimisée\ndef main():\n    print("Initialisation réussie pour ${topic} - Academia ITECH")\n\nif __name__ == '__main__':\n    main()`,
                  content: `### 💻 Exercice Pratique\n\nImplémentez la configuration de départ et exécutez le script pour valider vos paramètres.`
                }
              ]
            },
            {
              id: `chap-${Date.now()}-2`,
              title: `Module 2 : Cas Pratiques Avancés et Déploiement`,
              description: "Mise en situation réelle et optimisation",
              lessons: [
                {
                  id: `les-${Date.now()}-3`,
                  title: `2.1 Conception d'une Solution Complète`,
                  durationMinutes: 35,
                  type: "article",
                  content: `### 🚀 Déploiement en Environnement Réel\n\nÉtude de cas d'un projet d'entreprise avec les meilleures pratiques de scalabilité et de sécurité.`
                }
              ]
            }
          ],
          finalQuiz: {
            id: `quiz-${Date.now()}`,
            title: `Évaluation Finale : ${topic}`,
            description: "Testez vos connaissances pour valider votre certification officielle.",
            passingScore: 75,
            timeLimitMinutes: 15,
            xpReward: 300,
            questions: [
              {
                id: "q1",
                question: `Quel est l'avantage principal de maîtriser ${topic} ?`,
                options: [
                  "Automatiser et optimiser les flux de travail complexes",
                  "Remplacer tout le matériel informatique",
                  "Supprimer le besoin d'Internet",
                  "Aucun avantage mesurable"
                ],
                correctIndex: 0,
                explanation: `La maîtrise de ${topic} permet de concevoir des solutions performantes et scalables selon les standards de l'industrie.`,
                points: 50
              },
              {
                id: "q2",
                question: `Quelle étape est cruciale avant la mise en production sur ${topic} ?`,
                options: [
                  "Les tests de validation et l'audit de sécurité",
                  "Supprimer la documentation",
                  "Ignorer la gestion des erreurs",
                  "Partager les accès administrateur publiquement"
                ],
                correctIndex: 0,
                explanation: "Les tests rigoureux et les audits de conformité garantissent la fiabilité et la sécurité de la solution.",
                points: 50
              }
            ]
          }
        }
      });
    }

    const prompt = `Tu es le Directeur Pédagogique et Expert en Ingénierie de Formation d'Academia ITECH.
Génère un cours e-learning ultra-complet, structuré, moderne et captivant sur le sujet suivant :
- Sujet / Titre : "${topic || "Développement Fullstack & IA"}"
- Public cible : "${audience || "Étudiants et Professionnels de la Tech"}"
- Niveau : "${level || "Intermédiaire"}"
- Durée estimée : ${durationHours || 10} heures
- Catégorie : "${category || "ia_data"}"
- Centre / Institution émettrice : "${centerName || "Academia ITECH"}"

Réponds STRICTEMENT sous la forme d'un objet JSON respectant le schéma attendu.
Fournis un contenu riche en français, avec du markdown bien formaté pour les leçons, des explications claires, du code d'exemple si pertinent, et un quiz final de 3 questions avec explications pédagogiques.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
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
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json({ success: true, course: parsed });
  } catch (error: any) {
    console.error("Erreur génération cours IA:", error);
    res.status(500).json({ error: error.message || "Erreur lors de la génération" });
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
                "L'optimisation continue et l'application des bonnes pratiques",
                "Le rejet total de toute automatisation",
                "L'absence de structure logique",
                "Le stockage sans chiffrement"
              ],
              correctIndex: 0,
              explanation: "L'optimisation continue et la rigueur d'ingénierie sont la clé de voûte de cette technologie.",
              points: 25
            },
            {
              id: "q2",
              question: `Dans quel contexte utilise-t-on le plus fréquemment ${topic || "ce concept"} ?`,
              options: [
                "Dans le développement d'architectures modernes et sécurisées",
                "Uniquement pour dessiner des plans d'architecture physique",
                "Pour éteindre les serveurs la nuit",
                "Dans aucun projet moderne"
              ],
              correctIndex: 0,
              explanation: "Ce concept est au cœur des architectures logicielles et systèmes contemporains.",
              points: 25
            },
            {
              id: "q3",
              question: "Quelle méthode permet de vérifier la validité des résultats ?",
              options: [
                "Les tests unitaires et d'intégration automatisés",
                "La supposition aléatoire",
                "Ignorer les journaux d'erreurs",
                "Désactiver les alertes"
              ],
              correctIndex: 0,
              explanation: "Les tests automatisés garantissent la non-régression et la robustesse.",
              points: 25
            },
            {
              id: "q4",
              question: "Quelle compétence est complémentaire pour exceller dans ce domaine ?",
              options: [
                "La pensée critique et la maîtrise des algorithmes",
                "La vitesse de frappe sans relecture",
                "L'oubli des règles de cybersécurité",
                "La copie de code sans compréhension"
              ],
              correctIndex: 0,
              explanation: "La compréhension algorithmique et l'esprit d'analyse sont indispensables.",
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

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
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
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json({ success: true, quiz: parsed });
  } catch (error: any) {
    console.error("Erreur génération quiz IA:", error);
    res.status(500).json({ error: error.message || "Erreur quiz IA" });
  }
});

// 3. Virtual Tutor & Call Conversation API Endpoint (Ultra-Fast Multilingual Response)
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

    const tName = personaName || "AIDA";
    const tGender = personaGender === "male" || personaGender === "homme" ? "homme" : "femme";
    const isFlash = speedMode === "flash" || isCallMode;
    const activeLang = (audioLanguage || language || "fr-FR").toLowerCase();

    // Determine Language Directives & Greetings
    let langDirective = "Langue : Français impeccable, naturel et pédagogique.";
    let langGreeting = `Bonjour ! Je suis **${tName}**, votre tuteur IA Academia ITECH 🎓.`;
    let langWaIntro = `🤖 *Academia ITECH - ${tName}*\n\nSalut ! 👋`;
    let langCallIntro = `Oui, je vous écoute parfaitement ! Concernant ${currentLessonTitle || contextCourse || "votre cursus"}, quelle est votre question ?`;

    if (activeLang.startsWith("ln")) {
      // Lingala (DR Congo / Congo)
      langDirective = `LANGUE OBLIGATOIRE : Tu DOIS répondre exclusivement en LINGÁLA (Lingala ya Kinshasa/Brazzaville) naturel, chaleureux et pédagogique. Traduis les termes informatiques, code et IA de manière claire en Lingala accessible (ex: "mayele ya masini" pour IA, "ordinatɛrɛ", "koprogramé", etc.) avec des exemples stimulants.`;
      langGreeting = `Mbote na yo ! Nazali **${tName}**, moteyi na yo ya mayele ya masini (IA) na Academia ITECH 🎓. Nayoki malamu motuna na yo !`;
      langWaIntro = `🤖 *Academia ITECH - ${tName}*\n\nMbote ! 👋`;
      langCallIntro = `Mbote ! Nazali koyoka yo malamu mpenza. Lobela ngai motuna na yo na Lingala !`;
    } else if (activeLang.startsWith("en")) {
      // English
      langDirective = `MANDATORY LANGUAGE: Respond exclusively in clean, professional, and engaging English. Provide top-tier software engineering, AI, and cloud guidance.`;
      langGreeting = `Hello! I am **${tName}**, your AI Tutor at Academia ITECH 🎓. I received your question!`;
      langWaIntro = `🤖 *Academia ITECH - ${tName}*\n\nHello there! 👋`;
      langCallIntro = `Yes, I can hear you loud and clear! What would you like to explore regarding ${currentLessonTitle || contextCourse || "your module"}?`;
    } else if (activeLang.startsWith("sw")) {
      // Swahili
      langDirective = `LUGHA YA LAZIMA: Jibu KWA KISWAHILI fasaha, wazi na chenye motisha. Eleza dhana za programu, teknolojia na kompyuta kwa ufasaha.`;
      langGreeting = `Habari yako! Mimi ni **${tName}**, mkufunzi wako wa akili bandia (AI) katika Academia ITECH 🎓. Nimepokea swali lako!`;
      langWaIntro = `🤖 *Academia ITECH - ${tName}*\n\nHabari! 👋`;
      langCallIntro = `Habari! Nakusikia vizuri sana. Niambie swali lako kuhusu ${currentLessonTitle || contextCourse || "somo lako"}!`;
    } else if (activeLang.startsWith("es")) {
      // Spanish
      langDirective = `IDIOMA OBLIGATORIO: Responde exclusivamente en español impecable, motivador y pedagógico.`;
      langGreeting = `¡Hola! Soy **${tName}**, tu tutor de IA en Academia ITECH 🎓.`;
      langWaIntro = `🤖 *Academia ITECH - ${tName}*\n\n¡Hola! 👋`;
      langCallIntro = `¡Hola! Te escucho perfectamente. ¿Qué te gustaría aprender hoy?`;
    } else if (activeLang.startsWith("pt")) {
      // Portuguese
      langDirective = `IDIOMA OBRIGATÓRIO: Responda em português claro, profissional e altamente pedagógico.`;
      langGreeting = `Olá! Eu sou **${tName}**, seu tutor de IA na Academia ITECH 🎓.`;
      langWaIntro = `🤖 *Academia ITECH - ${tName}*\n\nOlá! 👋`;
      langCallIntro = `Olá! Estou ouvindo com clareza. Qual é a sua pergunta?`;
    }

    if (!ai) {
      let simulatedReply = "";
      if (isCallMode) {
        simulatedReply = langCallIntro;
      } else if (isWhatsAppMode) {
        simulatedReply = `${langWaIntro}\n\n${message ? `_\"${message}\"_` : ""}\n\n📚 *Conseil* : Relis le module *${currentLessonTitle || "en cours"}* pour continuer à progresser !`;
      } else {
        simulatedReply = `${langGreeting}\n\nJ'ai bien noté votre question : *"${message}"*.\n\nSur le cours **${contextCourse || "Tech & IA"}** (leçon : *${currentLessonTitle || "Général"}*), le point clé à retenir est de toujours décomposer le problème en sous-étapes logiques.\n\n💡 **Astuce ITECH** : Pratiquez directement dans l'éditeur de code intégré ou lancez un appel vocal avec moi pour approfondir !`;
      }

      return res.json({
        success: true,
        reply: simulatedReply,
        suggestions: [
          activeLang.startsWith("ln") ? "Pesá ngai ndakisa ya code" : activeLang.startsWith("en") ? "Give me a practical code example" : "Donne-moi un exemple concret en code",
          activeLang.startsWith("ln") ? "Tuná ngai motuna moko ya quiz" : activeLang.startsWith("en") ? "Quiz me with a tricky question" : "Peux-tu me poser une question piège ?",
          activeLang.startsWith("ln") ? "Ndenge nini kosalela yango na mosala ?" : activeLang.startsWith("en") ? "How is this used in production?" : "Comment appliquer cela en entreprise ?"
        ]
      });
    }

    let styleDirective = "Adopte une pédagogie bienveillante, encourageante et claire.";
    if (teachingStyle === "expert") {
      styleDirective = "Adopte un ton d'expert senior très technique, précis, concis, direct et sans fioritures.";
    } else if (teachingStyle === "coach") {
      styleDirective = "Adopte une posture de coach énergique, stimulant, orienté défis, passage à l'action et gain d'XP.";
    } else if (teachingStyle === "socratic") {
      styleDirective = "Utilise la méthode socratique : guide l'étudiant en lui posant des questions ciblées pour qu'il trouve la solution par lui-même.";
    }

    let formatDirective = "Utilise du markdown soigné avec blocs de code ``` si approprié.";
    if (isCallMode) {
      formatDirective = "MODE APPEL VOCAL DIRECT : Rédige une réponse fluide, orale, sans puces ni markdown lourd, de 2 à 4 phrases maximum, prête à être lue à voix haute avec naturel et expressivité dans la langue configurée.";
    } else if (isWhatsAppMode) {
      formatDirective = "MODE WHATSAPP ACTIVÉ : Utilise des astérisques *gras*, underscores _italique_, emojis chaleureux et messages concis.";
    } else if (isFlash) {
      formatDirective = "MODE ÉCLAIR ULTRA-RAPIDE : Sois direct, percutant et concis (maximum 2 à 3 paragraphes courts ou une liste à puces synthétique).";
    }

    const systemInstruction = `Tu es ${tName}, tuteur virtuel d'élite (${tGender === "homme" ? "formateur homme" : "tutrice femme"}) sur la plateforme Academia ITECH.
Ton rôle : Transmettre les compétences de haut niveau en ingénierie logicielle, IA, cloud et cybersécurité.
${langDirective}
${styleDirective}
${formatDirective}
Contexte actuel :
- Cours : ${contextCourse || "Masterclass Academia ITECH"}
- Leçon active : ${currentLessonTitle || "Introduction Générale"}`;

    const contents = [];
    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory.slice(-4)) {
        contents.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message || "Bonjour, peux-tu m'expliquer les points clés de ce cours ?" }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: contents as any,
      config: {
        systemInstruction,
        thinkingConfig: {
          thinkingBudget: 0,
        },
        maxOutputTokens: isCallMode ? 300 : isFlash ? 450 : 750,
        temperature: 0.7,
      },
    });

    const text = response.text || "Je suis à votre écoute pour vous faire progresser !";
    res.json({
      success: true,
      reply: text,
      suggestions: [
        "Donne-moi un exemple pratique",
        "Résume les points essentiels",
        "Génère un mini-quiz sur cette leçon"
      ]
    });
  } catch (error: any) {
    console.error("Erreur Tutor Chat IA:", error);
    res.status(500).json({ error: error.message || "Erreur communication tuteur" });
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

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
    });

    res.json({ success: true, script: response.text });
  } catch (error: any) {
    console.error("Erreur génération script:", error);
    res.status(500).json({ error: error.message || "Erreur script" });
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
