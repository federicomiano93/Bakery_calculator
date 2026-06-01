import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore, enableIndexedDbPersistence, collection, doc, setDoc, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "REVOKED_API_KEY",
  authDomain: "bakery-app-ebf90.firebaseapp.com",
  projectId: "bakery-app-ebf90",
  storageBucket: "bakery-app-ebf90.firebasestorage.app",
  messagingSenderId: "27778450817",
  appId: "1:27778450817:web:74e1bab55d10c3f9279480"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
enableIndexedDbPersistence(db).catch(() => {});

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

onSnapshot(collection(db, 'log'), (snapshot) => {
  const log = [];
  snapshot.forEach(d => log.push(d.data()));
  window.firestoreLog = log;
  document.dispatchEvent(new CustomEvent('firestore-log-updated'));
});
