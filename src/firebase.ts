import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY || 'demo-api-key',
  authDomain:
    process.env.VUE_APP_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID || 'craniobeimler',
  storageBucket:
    process.env.VUE_APP_FIREBASE_STORAGE_BUCKET || 'craniobeimler.appspot.com',
  messagingSenderId:
    process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.VUE_APP_FIREBASE_APP_ID || '1:123456789:web:abcdef123456',
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID || 'G-ABCDEFGHIJ',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Connect to emulators in development mode
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8026);
}

export { db };
