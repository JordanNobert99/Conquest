const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

// Callable function only usable by authenticated admins
exports.setAdmin = functions.https.onCall(async (data, context) => {
  // Ensure the caller is authenticated
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Request had no auth.');

  // Ensure caller is an admin (custom claim)
  if (!context.auth.token || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can change admin status.');
  }

  const { uid, makeAdmin } = data;
  if (!uid || typeof makeAdmin !== 'boolean') {
    throw new functions.https.HttpsError('invalid-argument', 'Require uid and makeAdmin:boolean.');
  }

  // Set custom claim
  await admin.auth().setCustomUserClaims(uid, { ...(makeAdmin ? { admin: true } : {}) });

  // Update Firestore users/{uid} document (trusted server write)
  const userRef = db.collection('users').doc(uid);
  await userRef.set({ isAdmin: !!makeAdmin, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });

  return { success: true };
});