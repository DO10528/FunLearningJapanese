// ★重要：Firebaseのバージョンを安定版(10.12.0)に変更
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import {
  getFirestore, doc, setDoc, updateDoc, getDocs, collection,
  query, orderBy, limit, onSnapshot, where, getDoc, increment
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, OAuthProvider, signInWithPopup, linkWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpfbjezbYxrW3XMDegBSC5iFPEQEyD0Ls",
  authDomain: "funlearningjapanese-b8e08.firebaseapp.com",
  projectId: "funlearningjapanese-b8e08",
  storageBucket: "funlearningjapanese-b8e08.appspot.com",
  messagingSenderId: "1055688629268",
  appId: "1:1055688629268:web:248183b62f15c34a2d5b01",
  measurementId: "G-LCMXVLPS81"
};

let app, analytics, db, auth, messaging;
try {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  db = getFirestore(app);
  auth = getAuth(app);
  messaging = getMessaging(app);
} catch (e) {
  console.error("Firebase Initialization Error:", e);
}

// グローバルスコープへ公開が必要なオブジェクトを登録（既存コードとの互換性のため）
window.app = app;
window.analytics = analytics;
window.db = db;
window.auth = auth;
window.messaging = messaging;
window.doc = doc;
window.setDoc = setDoc;
window.updateDoc = updateDoc;
window.getDoc = getDoc;
window.increment = increment;

const SESS_KEY = 'user_mode';
let currentUserDocUnsubscribe = null;
const VAPID_KEY = "BOp9ikY5zWsK4tBsSWaZ2wxa_uEoS4VOnJzWN0u7HqyDNMO7K4xchPkKKQu1iEyxx-X1yrV3uLyt8mwY7NVBdo0";
const lineProvider = new OAuthProvider('oidc.line');

// Service Worker Registration
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
    const swPath = isLocalhost ? './firebase-messaging-sw.js' : '/FunLearningJapanese/firebase-messaging-sw.js';
    try {
      const registration = await navigator.serviceWorker.register(swPath);
      return registration;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
};
registerServiceWorker();

// Messaging setup
if(messaging) {
  onMessage(messaging, (payload) => {
    const title = payload.notification.title;
    const body = payload.notification.body;
    alert(`【通知】\n${title}\n${body}`);
  });
}

window.requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    alert("お使いのブラウザは通知に対応していません。");
    return;
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("通知がブロックされています。");
      return;
    }
    const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
    const swPath = isLocalhost ? './firebase-messaging-sw.js' : '/FunLearningJapanese/firebase-messaging-sw.js';
    let swReg = await navigator.serviceWorker.getRegistration(swPath);
    if (!swReg) swReg = await navigator.serviceWorker.register(swPath);
    
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swReg
    });
    if(token) {
      const user = auth.currentUser;
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, { fcmToken: token, tokenUpdatedAt: new Date().toISOString() });
          alert("通知設定完了！");
        } catch(e) {}
      } else {
        alert("通知が許可されました！（ゲスト）");
      }
    }
  } catch (err) {
    alert("エラー: " + err.message);
  }
};

const isInAppBrowser = () => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  return (ua.indexOf("Line") > -1 || ua.indexOf("FBAN") > -1 || ua.indexOf("Instagram") > -1 || ua.indexOf("Twitter") > -1);
};
window.isInAppBrowser = isInAppBrowser;

// Export objects if other modules need them
export { app, analytics, db, auth, messaging };
