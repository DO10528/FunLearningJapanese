// firebase-messaging-sw.js (compat version)
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js');

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

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Background Notification Handler
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message received:", payload);

  const notificationTitle = payload.notification?.title ?? "通知";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/icon.png"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
