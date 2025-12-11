// firebase-messaging-sw.js (modular)

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getMessaging, onBackgroundMessage } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-sw.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDpfbjezbYxrW3XMDegBSC5iFPEQEyD0Ls",
  authDomain: "funlearningjapanese-b8e08.firebaseapp.com",
  projectId: "funlearningjapanese-b8e08",
  storageBucket: "funlearningjapanese-b8e08.appspot.com",
  messagingSenderId: "1055688629268",
  appId: "1:1055688629268:web:248183b62f15c34a2d5b01",
  measurementId: "G-LCMXVLPS81"
};

// Initialize
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Background Notification Handler
onBackgroundMessage(messaging, (payload) => {
  console.log("[SW] Background message received", payload);

  const title = payload.notification?.title ?? "通知";
  const options = {
    body: payload.notification?.body,
    icon: "/icon.png"
  };

  self.registration.showNotification(title, options);
});
