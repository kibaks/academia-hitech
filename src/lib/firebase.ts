import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  limit,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, CourseChatMessage } from '../types';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore with experimentalForceLongPolling for seamless reliability in iframes and proxies
export const db = (() => {
  try {
    return initializeFirestore(
      app,
      {
        experimentalForceLongPolling: true,
      },
      firebaseConfig.firestoreDatabaseId || undefined
    );
  } catch {
    return firebaseConfig.firestoreDatabaseId
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
  }
})();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Error Context:', JSON.stringify(errInfo));
  return errInfo;
}

/**
 * Validates connection to Firestore backend as per Firebase skill
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.info('[Firebase] Mode hors-ligne / persistance locale active.');
    }
    return false;
  }
}

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
    const errStr = String(error);
    if (errStr.includes('permission-denied') || errStr.includes('Missing or insufficient permissions')) {
      handleFirestoreError(error, OperationType.GET, `${PROFILES_COLLECTION}/${userId}`);
    } else {
      console.info('[Firebase] Profil restauré depuis le stockage local');
    }
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
    const errStr = String(error);
    if (errStr.includes('permission-denied') || errStr.includes('Missing or insufficient permissions')) {
      handleFirestoreError(error, OperationType.WRITE, `${PROFILES_COLLECTION}/${profile.id}`);
    } else {
      console.info('[Firebase] Sauvegarde locale garantie pour', profile.id);
    }
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
      const errStr = String(error);
      if (errStr.includes('permission-denied') || errStr.includes('Missing or insufficient permissions')) {
        handleFirestoreError(error, OperationType.GET, `${PROFILES_COLLECTION}/${userId}`);
      } else {
        console.info('[Firebase] Synchronisation profil active en local');
      }
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
    const errStr = String(error);
    if (errStr.includes('permission-denied') || errStr.includes('Missing or insufficient permissions')) {
      handleFirestoreError(error, OperationType.WRITE, `${COURSE_CHATS_COLLECTION}/${message.id}`);
    } else {
      console.info('[Firebase] Message sauvegardé dans le stockage local du cours');
    }
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
      const errStr = String(err);
      if (errStr.includes('permission-denied') || errStr.includes('Missing or insufficient permissions')) {
        handleFirestoreError(err, OperationType.LIST, COURSE_CHATS_COLLECTION);
      } else {
        console.info('[Firebase] Forum synchronisé avec les données locales');
      }
    }
  );
}
