import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyANQlvPCbx1eDGVNkmK9HenAh0Cw_fD4Bw",
  authDomain: "sparxapi.firebaseapp.com",
  projectId: "sparxapi",
  storageBucket: "sparxapi.firebasestorage.app",
  messagingSenderId: "291924279653",
  appId: "1:291924279653:web:328c9c8ceec6e5d401618c",
  measurementId: "G-0RM66GJ5FL"
};

const app = initializeApp(firebaseConfig);

let analytics;
let auth;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
  auth = getAuth(app);

  // Enable debug mode only on localhost
  if (window.location.hostname === "localhost") {
    localStorage.setItem("firebase:analytics_debug_mode", "true");
    console.log("Firebase debug mode enabled for localhost");
  }

}

export { app, analytics, auth };