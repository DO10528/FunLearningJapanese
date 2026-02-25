import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDF18...", 
    authDomain: "japanese-fun-learning.firebaseapp.com",
    projectId: "japanese-fun-learning",
    storageBucket: "japanese-fun-learning.firebasestorage.app",
    messagingSenderId: "548074697960",
    appId: "1:548074697960:web:4f207ed1f0f4ea583a6963",
    measurementId: "G-4JXY1T51SV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
