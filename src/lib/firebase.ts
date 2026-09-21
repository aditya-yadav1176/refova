/**
 * firebase.ts -- Firebase client SDK initialization
 *
 * Only Firebase Auth is initialized here.
 * Firestore and Storage are accessed via the backend REST API.
 * The VITE_FIREBASE_* vars are the safe public client config.
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const apiKey = (import.meta.env["VITE_FIREBASE_API_KEY"] as string | undefined)?.trim();
const projectId = (import.meta.env["VITE_FIREBASE_PROJECT_ID"] as string | undefined)?.trim() || "refova-f44cb";

export const isFirebaseConfigured = Boolean(apiKey && apiKey.length > 5);

const firebaseConfig = {
  apiKey: isFirebaseConfigured ? apiKey! : "AIzaSyDummyKeyForSSRRendering1234567890",
  authDomain: (import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"] as string | undefined) || `${projectId}.firebaseapp.com`,
  projectId: projectId,
  storageBucket: (import.meta.env["VITE_FIREBASE_STORAGE_BUCKET"] as string | undefined) || `${projectId}.firebasestorage.app`,
  messagingSenderId: (import.meta.env["VITE_FIREBASE_MESSAGING_SENDER_ID"] as string | undefined) || "123456789012",
  appId: (import.meta.env["VITE_FIREBASE_APP_ID"] as string | undefined) || "1:123456789012:web:dummy",
};

let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]!;
}

export const auth: Auth = getAuth(app);
export { app };
