/**
 * Intelligent Speech Synthesis & Accent Optimization Utility
 * Enforces strict language/accent matching (e.g. 100% French accent for French/Lingála,
 * never falling back to English voices that cause distorted pronunciation).
 */

export interface SpeechVoiceOption {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
  gender: 'male' | 'female' | 'neutral';
  isLocal: boolean;
}

let cachedVoices: SpeechSynthesisVoice[] = [];

/**
 * Initializes and caches available voices in browser
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }

  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices.length > 0 ? cachedVoices : voices;
}

// Subscribe to browser voice load events (essential for Chrome/Edge/Safari)
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  getAvailableVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

/**
 * Cleans text for natural speech synthesis (removes code blocks, markdown, adds pauses)
 */
export function cleanTextForSpeech(text: string, langCode: string = 'fr-FR'): string {
  if (!text) return '';

  let cleaned = text
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, 'voir le code affiché.')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove markdown headers
    .replace(/^#+\s+/gm, '')
    // Remove bold/italics
    .replace(/[*_~]+/g, '')
    // Remove link markdown [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove bullet points at start of line
    .replace(/^\s*[-*+]\s+/gm, '')
    // Remove numbered lists markers
    .replace(/^\s*\d+\.\s+/gm, '')
    // Expand tech abbreviations for natural pronunciation in French
    .replace(/\bIA\b/g, 'I A')
    .replace(/\bAI\b/g, langCode.startsWith('en') ? 'A I' : 'I A')
    .replace(/\bITECH\b/gi, 'Itech')
    .replace(/\bAPI\b/g, 'A P I')
    .replace(/\bAPIs\b/g, 'A P I')
    .replace(/\bUI\b/g, 'U I')
    .replace(/\bUX\b/g, 'U X')
    .replace(/\bSQL\b/g, 'S Q L')
    .replace(/\bHTML\b/g, 'H T M L')
    .replace(/\bCSS\b/g, 'C S S')
    .replace(/\bURL\b/g, 'U R L')
    .replace(/\bJSON\b/g, 'J-Son')
    .replace(/\bC\+\+\b/g, 'C plus plus')
    .replace(/\bC#\b/g, 'C sharp')
    .replace(/\bCI\/CD\b/g, 'C I C D')
    .trim();

  return cleaned;
}

/**
 * Finds the most natural, native voice strictly matching target language and gender.
 * FORBIDDEN: Falling back to English voice when speaking French or Lingála.
 */
export function findBestVoice(
  langCode: string = 'fr-FR',
  preferredGender: 'male' | 'female' = 'female'
): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  if (!voices || voices.length === 0) return null;

  const targetLang = (langCode || 'fr-FR').toLowerCase();

  // Normalize language prefix (Lingala uses French phonetics for web synthesis engines)
  let langPrefix = 'fr';
  if (targetLang.startsWith('en')) {
    langPrefix = 'en';
  } else if (targetLang.startsWith('es')) {
    langPrefix = 'es';
  } else if (targetLang.startsWith('pt')) {
    langPrefix = 'pt';
  } else if (targetLang.startsWith('sw')) {
    // If Swahili voice exists, use sw; else fallback to fr (natural African/Bantu phonetics)
    const hasSwahili = voices.some((v) => v.lang.toLowerCase().startsWith('sw'));
    langPrefix = hasSwahili ? 'sw' : 'fr';
  } else {
    langPrefix = 'fr';
  }

  // 1. Filter strictly to voices of the target language
  const languageMatchingVoices = voices.filter((v) =>
    v.lang.toLowerCase().startsWith(langPrefix)
  );

  if (languageMatchingVoices.length === 0) {
    // If no voice for target language, find any standard French voice (never English for French text!)
    const frenchFallback = voices.filter((v) => v.lang.toLowerCase().startsWith('fr'));
    if (frenchFallback.length > 0) {
      return frenchFallback[0];
    }
    return voices[0] || null;
  }

  // 2. Female voice keywords & known names
  const femaleKeywords = [
    'female',
    'femme',
    'julie',
    'hortense',
    'amelie',
    'amélie',
    'audrey',
    'aurelie',
    'aurélie',
    'celine',
    'céline',
    'virginie',
    'clara',
    'denise',
    'marie',
    'lea',
    'léa',
    'chloe',
    'chloé',
    'sarah',
    'samantha',
    'victoria',
    'zira',
    'karen',
    'monica',
    'lucia',
    'joana',
  ];

  // 3. Male voice keywords & known names
  const maleKeywords = [
    'male',
    'homme',
    'paul',
    'henri',
    'thomas',
    'nicolas',
    'jean',
    'pierre',
    'mathieu',
    'guillaume',
    'david',
    'george',
    'daniel',
    'jorge',
    'diego',
  ];

  const targetKeywords = preferredGender === 'female' ? femaleKeywords : maleKeywords;
  const oppositeKeywords = preferredGender === 'female' ? maleKeywords : femaleKeywords;

  // 3. Rank voices by precision
  // High quality priority: Google, Natural, Enhanced, Microsoft, Apple
  const scoredVoices = languageMatchingVoices.map((voice) => {
    let score = 0;
    const nameLower = voice.name.toLowerCase();

    // Matching gender keyword in name
    if (targetKeywords.some((k) => nameLower.includes(k))) {
      score += 50;
    }
    // Opposite gender penalty
    if (oppositeKeywords.some((k) => nameLower.includes(k))) {
      score -= 30;
    }

    // High fidelity browser synthesis boosts
    if (nameLower.includes('natural') || nameLower.includes('enhanced') || nameLower.includes('neural')) {
      score += 25;
    }
    if (nameLower.includes('google') && nameLower.includes('français')) {
      score += 20;
    }
    if (nameLower.includes('microsoft') || nameLower.includes('apple')) {
      score += 15;
    }
    if (voice.localService) {
      score += 5;
    }
    // Exact dialect match (e.g. fr-FR over fr-CA if fr-FR requested)
    if (voice.lang.toLowerCase() === targetLang) {
      score += 10;
    }

    return { voice, score };
  });

  scoredVoices.sort((a, b) => b.score - a.score);
  return scoredVoices[0]?.voice || languageMatchingVoices[0] || null;
}

/**
 * Execute Speech Synthesis with strict accent and safety handling
 */
export function playTutorSpeech({
  text,
  langCode = 'fr-FR',
  gender = 'female',
  pitch = 1.05,
  rate = 1.0,
  onStart,
  onEnd,
  onError,
}: {
  text: string;
  langCode?: string;
  gender?: 'male' | 'female';
  pitch?: number;
  rate?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onError) onError();
    return null;
  }

  window.speechSynthesis.cancel();

  const clean = cleanTextForSpeech(text, langCode);
  if (!clean) {
    if (onEnd) onEnd();
    return null;
  }

  const utterance = new SpeechSynthesisUtterance(clean);

  // Set standard lang
  const targetLang = langCode.startsWith('ln') ? 'fr-FR' : langCode || 'fr-FR';
  utterance.lang = targetLang;
  utterance.pitch = pitch;
  utterance.rate = rate;

  // Strictly select native voice matching target language
  const bestVoice = findBestVoice(langCode, gender);
  if (bestVoice) {
    utterance.voice = bestVoice;
    // Ensure utterance lang matches chosen voice lang
    utterance.lang = bestVoice.lang;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn('Speech synthesis notification:', e);
    if (onError) onError();
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

/**
 * Stop any ongoing speech synthesis immediately
 */
export function stopTutorSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
