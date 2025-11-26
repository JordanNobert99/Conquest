// UI glue for login.html
import { registerUser, loginUser, onAuthChange } from './auth.js';

const form = document.getElementById('authForm');
const modeButtons = Array.from(document.querySelectorAll('.tab'));
const title = document.getElementById('title');
const displayNameInput = document.getElementById('displayName');
const errorEl = document.getElementById('error');
let mode = 'login';

function setMode(m) {
  mode = m;
  modeButtons.forEach(b => b.classList.toggle('active', b.dataset.mode === m));
  title.textContent = m === 'login' ? 'Sign in' : 'Create account';
  displayNameInput.style.display = m === 'register' ? 'block' : 'none';
}

modeButtons.forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
setMode('login');

// Debug log + guard redirects to avoid loops
onAuthChange(user => {
  console.log('[auth:login] onAuthStateChanged ->', user);
  if (user) {
    // only redirect if not already on landing page
    if (!location.pathname.endsWith('/landing.html')) {
      location.replace('./landing.html');
    } else {
      console.log('[auth:login] already on landing.html — no redirect');
    }
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.style.display = 'none';
  const email = form.email.value.trim();
  const password = form.password.value;
  const displayName = form.displayName.value.trim() || null;

  try {
    if (mode === 'register') {
      await registerUser(email, password, displayName);
    } else {
      await loginUser(email, password);
    }
    // Use guarded redirect (in case onAuthChange already handled it)
    if (!location.pathname.endsWith('/landing.html')) location.replace('./landing.html');
  } catch (err) {
    console.error(err);
    errorEl.textContent = err?.message || 'Authentication error';
    errorEl.style.display = 'block';
  }
});