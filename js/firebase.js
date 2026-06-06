import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore, enableIndexedDbPersistence, collection, doc, setDoc, deleteDoc, onSnapshot, arrayUnion } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB0h112KenmhJNQJGikLGU3RSH-KyAOA9Q",
  authDomain: "bakery-app-ebf90.firebaseapp.com",
  projectId: "bakery-app-ebf90",
  storageBucket: "bakery-app-ebf90.firebasestorage.app",
  messagingSenderId: "27778450817",
  appId: "1:27778450817:web:74e1bab55d10c3f9279480"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
enableIndexedDbPersistence(db).catch(() => {});

// Start Firestore listener only after auth token is available
signInAnonymously(auth).then(() => {
  onSnapshot(collection(db, 'log'), (snapshot) => {
    const log = [];
    snapshot.forEach(d => log.push(d.data()));
    window.firestoreLog = log;
    document.dispatchEvent(new CustomEvent('firestore-log-updated'));
  });
}).catch(() => {});

export async function saveLogToFirestore(record) {
  try {
    await setDoc(doc(db, 'log', record.dough.toLowerCase()), record);
  } catch(e) {
    console.error('Firestore save error:', e);
  }
}

export async function deleteLogFromFirestore(dough) {
  try {
    await deleteDoc(doc(db, 'log', dough.toLowerCase()));
  } catch(e) {
    console.error('Firestore delete error:', e);
  }
}

export async function saveDailyEntry(entry) {
  try {
    const dateStr = entry.date_iso;
    await setDoc(doc(db, 'daily-logs', dateStr), {
      date: dateStr,
      entries: arrayUnion(entry)
    }, { merge: true });
  } catch(e) {
    console.error('Firestore daily-log save error:', e);
  }
}
