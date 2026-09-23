import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDREdq56SV_HVhyC_t40OvazuAK2TaX1go",
  authDomain: "app-treino-640b4.firebaseapp.com",
  projectId: "app-treino-640b4",
  storageBucket: "app-treino-640b4.firebasestorage.app",
  messagingSenderId: "752078428156",
  appId: "1:752078428156:web:298b9566b499f8d5c54479",
  measurementId: "G-H0VN7ZGJZQ",
};

export const firebaseConfigured = true;
export const app = getApps()[0] ?? initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
