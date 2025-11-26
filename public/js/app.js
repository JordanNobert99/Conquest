import { app, analytics } from './firebase-config.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

// Ensure auth is checked and redirect relative to the current document
const auth = getAuth(app);
const statusEl = document.getElementById('status');

onAuthStateChanged(auth, (user) => {
  console.log('[auth:index] onAuthStateChanged ->', user);
  if (user) {
    // Signed in -> landing page next to index.html
    if (!location.pathname.endsWith('/landing.html')) {
      location.replace('./landing.html');
    }
  } else {
    // Not signed in -> login page
    if (!location.pathname.endsWith('/login.html')) {
      location.replace('./login.html');
    }
  }
}, (err) => {
  console.error('Auth error', err);
  if (statusEl) {
    const p = statusEl.querySelector('p');
    if (p) p.textContent = 'Auth error — check console.';
  }
});