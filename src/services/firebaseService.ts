import { initializeApp } from "firebase/app";
import {
  DataSnapshot,
  getDatabase,
  onDisconnect,
  onValue,
  ref,
  remove,
  set,
} from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const firebaseSet = async (path: string, data: unknown) => {
  try {
    await set(ref(database, path), data);
  } catch (error) {
    console.error(`Error setting data at path ${path}:`, error);
  }
};

export const firebaseRemove = async (path: string) => {
  try {
    await remove(ref(database, path));
  } catch (error) {
    console.error(`Error removing data at path ${path}:`, error);
  }
};

export const firebaseOnValue = (
  path: string,
  callback: (snapshot: DataSnapshot) => void
) => {
  return onValue(ref(database, path), callback);
};

export const firebaseOnDisconnectRemove = (path: string) => {
  onDisconnect(ref(database, path)).remove();
};
