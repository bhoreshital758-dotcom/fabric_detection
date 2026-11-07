import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  signInAnonymously
} from 'firebase/auth';
import { UserProfile } from '../types/fabric';

// Environment variables or fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForFallbackGuestMode123",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fabric-ai-pbl.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "fabric-ai-pbl",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "fabric-ai-pbl.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef"
};

let app: FirebaseApp | null = null;
let isFirebaseConfigured = false;

try {
  if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== "AIzaSyDummyKeyForFallbackGuestMode123") {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    isFirebaseConfigured = true;
  }
} catch (e) {
  console.warn('Firebase initialization note (running in guest mode):', e);
}

export const auth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();

export function subscribeToAuth(callback: (user: UserProfile) => void): () => void {
  if (auth && isFirebaseConfigured) {
    return onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        callback({
          id: fbUser.uid,
          name: fbUser.displayName || 'Fabric Explorer',
          email: fbUser.email || 'user@fabricai.app',
          avatarUrl: fbUser.photoURL || undefined,
          isGuest: fbUser.isAnonymous,
          scanCount: 0,
          joinedDate: 'Joined recently'
        });
      } else {
        callback(getLocalGuestProfile());
      }
    });
  }

  // Fallback guest session
  callback(getLocalGuestProfile());
  return () => {};
}

export function getLocalGuestProfile(): UserProfile {
  let guestId = localStorage.getItem('fabric_ai_guest_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('fabric_ai_guest_id', guestId);
  }
  return {
    id: guestId,
    name: 'Guest Explorer',
    email: 'guest@fabricai.local',
    isGuest: true,
    scanCount: 0,
    joinedDate: 'Current Session'
  };
}

export async function loginWithGoogle(): Promise<UserProfile> {
  if (auth && isFirebaseConfigured) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      return {
        id: user.uid,
        name: user.displayName || 'Fabric Explorer',
        email: user.email || 'user@fabricai.app',
        avatarUrl: user.photoURL || undefined,
        isGuest: false,
        scanCount: 0,
        joinedDate: 'Active Member'
      };
    } catch (err) {
      console.warn('Google sign-in popup error, using guest profile:', err);
    }
  }

  // Simulate instant login for demo / exhibition
  const demoUser: UserProfile = {
    id: 'demo_user_123',
    name: 'Vedant Garule',
    email: 'vedant@fabricai.fashion',
    isGuest: false,
    scanCount: 14,
    joinedDate: 'September 2026'
  };
  localStorage.setItem('fabric_ai_demo_user', JSON.stringify(demoUser));
  return demoUser;
}

export async function logoutUser(): Promise<void> {
  if (auth && isFirebaseConfigured) {
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.warn('Sign out error:', err);
    }
  }
  localStorage.removeItem('fabric_ai_demo_user');
}
