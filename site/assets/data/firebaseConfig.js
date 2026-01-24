import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics'; // JS SDK, not native

const firebaseConfig = {
  apiKey: "AIzaSyANQlvPCbx1eDGVNkmK9HenAh0Cw_fD4Bw",
  authDomain: "sparxapi.firebaseapp.com",
  projectId: "sparxapi",
  storageBucket: "sparxapi.firebasestorage.app",
  messagingSenderId: "291924279653",
  appId: "1:291924279653:web:328c9c8ceec6e5d401618c",
  measurementId: "G-0RM66GJ5FL"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics safely for Web
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, analytics, logEvent };