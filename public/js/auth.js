// Auth + Firestore user-sync utilities for Conquest (instrumented for debugging).
import { app } from './firebase-config.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore, doc, setDoc, serverTimestamp, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const auth = getAuth(app);
const db = getFirestore(app);

console.log('[auth] initialized with projectId=', app?.options?.projectId);

/**
 * Register a new user (email/password). Creates/updates a document in `users/{uid}`.
 */
export async function registerUser(email, password, displayName) {
  try {
    console.log('[auth] registerUser ->', email);
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;
    console.log('[auth] created user', user.uid);

    if (displayName) {
      try {
        await updateProfile(user, { displayName });
        console.log('[auth] updated displayName');
      } catch (e) {
        console.warn('[auth] updateProfile failed', e);
      }
    }

    const userRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || null,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        provider: user.providerData?.[0]?.providerId || null
      }, { merge: true });
      console.log('[auth] setDoc succeeded for users/' + user.uid);
    } catch (e) {
      console.error('[auth] setDoc FAILED for users/' + user.uid, e);
      // surface the error to the caller
      throw e;
    }

    return user;
  } catch (err) {
    console.error('[auth] registerUser error', err);
    throw err;
  }
}

/**
 * Sign in an existing user with email/password.
 */
export async function loginUser(email, password) {
  try {
    console.log('[auth] loginUser ->', email);
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const user = cred.user;
    console.log('[auth] signed in', user.uid);

    const userRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userRef, {
        email: user.email,
        lastLogin: serverTimestamp()
      }, { merge: true });
      console.log('[auth] updated lastLogin for users/' + user.uid);
    } catch (e) {
      console.error('[auth] setDoc lastLogin FAILED for users/' + user.uid, e);
      throw e;
    }

    return user;
  } catch (err) {
    console.error('[auth] loginUser error', err);
    throw err;
  }
}

/** Sign out current user. */
export async function logoutUser() {
  await signOut(auth);
}

/** Subscribe to auth state changes. */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/** Helper to get current user document from Firestore. */
export async function getUserDoc(uid) {
  if (!uid) return null;
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
}