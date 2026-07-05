// Firebase core
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// Firestore (database)
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Analytics (optional — safe to remove if not needed)
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

// Your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyAxoY0NrTLKO8t6iqUZjntgMjR4MklEpEs",
  authDomain: "portfolio-shristi.firebaseapp.com",
  projectId: "portfolio-shristi",
  storageBucket: "portfolio-shristi.appspot.com",
  messagingSenderId: "1000384953520",
  appId: "1:1000384953520:web:013001964377d67226cf75",
  measurementId: "G-CECT68C5T1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Only start analytics in browsers that support it (avoids console errors)
isSupported().then((ok) => { if (ok) getAnalytics(app); });

// Reusable helper: saves a contact-form submission to the "contacts" collection
export async function saveContact({ name, email, message }) {
  return addDoc(collection(db, "contacts"), {
    name,
    email,
    message,
    time: serverTimestamp()
  });
}
