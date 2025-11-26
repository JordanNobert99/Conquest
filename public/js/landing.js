import { onAuthChange, logoutUser, getUserDoc } from './auth.js';

const userInfoEl = document.getElementById('userInfo');
const logoutBtn = document.getElementById('logoutBtn');

// Guard redirect + logging to prevent flip-flop
let unsubscribe = onAuthChange(async (user) => {
  console.log('[auth:landing] onAuthStateChanged ->', user);
  if (!user) {
    // only redirect if not already on login page
    if (!location.pathname.endsWith('/login.html')) {
      location.replace('./login.html');
    } else {
      console.log('[auth:landing] already on login.html — no redirect');
    }
    return;
  }

  // Show basic info (optionally fetch Firestore doc)
  const profile = await getUserDoc(user.uid);
  userInfoEl.textContent = `Signed in as ${profile?.displayName || user.email || 'Unknown'} (${user.uid})`;
});

logoutBtn.addEventListener('click', async () => {
  await logoutUser();
  if (!location.pathname.endsWith('/login.html')) location.replace('./login.html');
});