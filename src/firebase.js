import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const rsvpCollection = collection(db, 'rsvps');

export async function sendRSVP({ name, message, attending }) {
  return addDoc(rsvpCollection, {
    name,
    message,
    attending,
    createdAt: serverTimestamp()
  });
}

export async function authenticateAdmin(email, password) {
  const adminsCollection = collection(db, 'admins');
  const adminsQuery = query(
    adminsCollection,
    where('email', '==', email),
    where('password', '==', password)
  );
  const querySnapshot = await getDocs(adminsQuery);
  return !querySnapshot.empty;
}
