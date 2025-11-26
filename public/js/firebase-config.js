import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

export const firebaseConfig = {
    apiKey: "AIzaSyCo1qVX09KpyNlzBOmUQMmwpwOVAIUrMQk",
    authDomain: "conquest-3e895.firebaseapp.com",
    projectId: "conquest-3e895",
    storageBucket: "conquest-3e895.firebasestorage.app",
    messagingSenderId: "934699295798",
    appId: "1:934699295798:web:d5477ff6ec92c259be2497"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
