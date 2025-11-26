import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-functions.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { app } from './firebase-config.js';

const auth = getAuth(app);
const functions = getFunctions(app);

async function setAdmin(uid, makeAdmin) {
  const fn = httpsCallable(functions, 'setAdmin');
  return fn({ uid, makeAdmin });
}