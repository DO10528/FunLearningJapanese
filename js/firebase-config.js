import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// だいすけ先生のFirebaseプロジェクト設定
const firebaseConfig = {
    apiKey: "AIzaSyDpfbjezbYxrW3XMDegBSC5iFPEQEyD0Ls", // ← ここが間違っているか古いとエラーになります！
    authDomain: "funlearningjapanese-b8e08.firebaseapp.com",
    projectId: "funlearningjapanese-b8e08",
    storageBucket: "funlearningjapanese-b8e08.appspot.com",
    messagingSenderId: "1055688629268",
    appId: "1:1055688629268:web:248183b62f15c34a2d5b01",
    measurementId: "G-LCMXVLPS81"
};

// Firebaseの初期化（これをしないとログイン機能が動きません）
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);