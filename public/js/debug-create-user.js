import { app } from './firebase-config.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore, doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

(async () => {
  const auth = getAuth(app);
  // wait briefly for sign-in
  for (let i = 0; i < 20 && !auth.currentUser; i++) await new Promise(r => setTimeout(r, 100));
  if (!auth.currentUser) return console.log('Sign in first.');
  const uid = auth.currentUser.uid;
  const db = getFirestore(app);
  await setDoc(doc(db, 'users', uid), {
    uid,
    email: auth.currentUser.email || null,
    createdAt: serverTimestamp()
  }, { merge: true });
  console.log('wrote users/' + uid);
})();