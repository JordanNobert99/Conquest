import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { app } from './firebase-config.js';

const auth = getAuth(app);

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  // Force token refresh to pick up recent claim changes:
  const idTokenResult = await user.getIdTokenResult(true);
  const isAdmin = !!idTokenResult.claims.admin;

  console.log('isAdmin:', isAdmin);

  // Optional: fallback to Firestore read of users/{uid}.isAdmin if you want:
  // but ensure rules restrict writes to the isAdmin field.
});