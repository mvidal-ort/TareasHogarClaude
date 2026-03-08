import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBTdUqSuibMuDbH5t0wmaWc7v1L-gR876I",
  authDomain: "tareashogarclaude.firebaseapp.com",
  projectId: "tareashogarclaude",
  storageBucket: "tareashogarclaude.firebasestorage.app",
  messagingSenderId: "74217728523",
  appId: "1:74217728523:web:4cd3191b5de710417e750e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);