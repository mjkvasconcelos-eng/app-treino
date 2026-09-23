import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDREdq56SV_HVhyC_t40OvazuAK2TaX1go",
  authDomain: "app-treino-640b4.firebaseapp.com",
  projectId: "app-treino-640b4",
  storageBucket: "app-treino-640b4.firebasestorage.app",
  messagingSenderId: "752078428156",
  appId: "1:752078428156:web:298b9566b499f8d5c54479",
  measurementId: "G-H0VN7ZGJZQ",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let firebaseConfigured = false;

try {
  app = getApps()[0] ?? initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  firebaseConfigured = true;
} catch (error) {
  console.error('Firebase não pôde ser inicializado. O app continuará em modo local.', error);
}

export { app, auth, db, firebaseConfigured };
