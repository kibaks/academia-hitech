import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  limit,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, CourseChatMessage } from '../types';
import { INITIAL_USER_PROFILE, DEMO_PROFILES } from '../data/initialData';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific databaseId if configured
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const PROFILES_COLLECTION = 'user_profiles';
const COURSE_CHATS_COLLECTION = 'course_chats';
const ACTIVE_USER_KEY = 'academia_active_user_id';

/**
 * Local storage cache helper to prevent profile data loss across sessions/logouts
 */
export function getStoredUserProfile(userId: string): UserProfile | null {
  try {
    const raw = localStorage.getItem(`academia_profile_${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return null;
}

export function setStoredUserProfileLocally(profile: UserProfile): void {
  try {
    localStorage.setItem(`academia_profile_${profile.id}`, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export function getStoredActiveUserId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_USER_KEY);
  } catch {
    return null;
  }
}

export function setStoredActiveUserId(userId: string | null): void {
  try {
    if (userId) {
      localStorage.setItem(ACTIVE_USER_KEY, userId);
    } else {
      localStorage.removeItem(ACTIVE_USER_KEY);
    }
  } catch {
    // ignore
  }
}

/**
 * Merges a candidate profile with its locally persisted changes if available
 */
export function getEffectiveProfile(candidate: UserProfile): UserProfile {
  const stored = getStoredUserProfile(candidate.id);
  if (!stored) return candidate;
  return {
    ...candidate,
    ...stored,
  };
}

/**
 * Ensures clean data for Firestore (replaces undefined with null or omitted)
 */
function sanitizeProfileForFirestore(data: Partial<UserProfile>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined) {
      sanitized[key] = val;
    }
  }
  return sanitized;
}

/**
 * Load user profile from Firestore, fallback to local stored profile
 */
export async function fetchUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, PROFILES_COLLECTION, userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      setStoredUserProfileLocally(data);
      return data;
    }
    // Check local storage fallback
    return getStoredUserProfile(userId);
  } catch (error) {
    console.warn('[Firebase] Erreur chargement profil Firestore:', error);
    return getStoredUserProfile(userId);
  }
}

/**
 * Save or update user profile in Firestore AND local storage
 */
export async function saveUserProfileToFirestore(profile: UserProfile): Promise<void> {
  // Always update local storage first so changes are immediately preserved
  setStoredUserProfileLocally(profile);

  try {
    const userDocRef = doc(db, PROFILES_COLLECTION, profile.id);
    const cleanData = sanitizeProfileForFirestore(profile);
    cleanData.updatedAt = new Date().toISOString();
    await setDoc(userDocRef, cleanData, { merge: true });
  } catch (error) {
    console.warn('[Firebase] Erreur sauvegarde profil Firestore (conservation locale active):', error);
  }
}

/**
 * Subscribe to real-time profile updates for reactive UI
 */
export function subscribeToUserProfile(userId: string, onUpdate: (profile: UserProfile) => void) {
  const userDocRef = doc(db, PROFILES_COLLECTION, userId);
  return onSnapshot(
    userDocRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as UserProfile;
        setStoredUserProfileLocally(data);
        onUpdate(data);
      }
    },
    (error) => {
      console.warn('[Firebase] Listener profil interrompu ou non autorisé:', error);
    }
  );
}

/**
 * ----------------------------------------------------------------------
 * COURSE FORUM & DIRECT TEACHER CHAT PERSISTENCE
 * ----------------------------------------------------------------------
 */

export function getLocalCourseChatMessages(courseId: string): CourseChatMessage[] {
  try {
    const raw = localStorage.getItem(`academia_chat_${courseId}`);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

export function saveLocalCourseChatMessage(courseId: string, message: CourseChatMessage): CourseChatMessage[] {
  const current = getLocalCourseChatMessages(courseId);
  const updated = [...current, message];
  try {
    localStorage.setItem(`academia_chat_${courseId}`, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}

/**
 * Save course chat message to Firestore and local storage
 */
export async function saveCourseChatMessageToFirestore(message: CourseChatMessage): Promise<void> {
  // 1. Instant local persistence
  saveLocalCourseChatMessage(message.courseId, message);

  // 2. Cloud Firestore persistence
  try {
    const chatDocRef = doc(db, COURSE_CHATS_COLLECTION, message.id);
    await setDoc(chatDocRef, {
      ...message,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('[Firebase] Erreur sauvegarde message chat Firestore (conservé en local):', error);
  }
}

/**
 * Subscribe to course chat messages from Firestore with local fallback
 */
export function subscribeToCourseChat(
  courseId: string,
  onUpdate: (messages: CourseChatMessage[]) => void
) {
  const chatsRef = collection(db, COURSE_CHATS_COLLECTION);
  const q = query(chatsRef, where('courseId', '==', courseId), limit(100));

  return onSnapshot(
    q,
    (snapshot) => {
      if (!snapshot.empty) {
        const remoteMessages = snapshot.docs.map((d) => d.data() as CourseChatMessage);
        remoteMessages.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        onUpdate(remoteMessages);
      }
    },
    (err) => {
      console.warn('[Firebase] Note écoute chat en direct Firestore:', err);
    }
  );
}
