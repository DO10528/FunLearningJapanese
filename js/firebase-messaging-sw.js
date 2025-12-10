// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js');

// index.htmlにあるのと同じ設定
const firebaseConfig = {
  apiKey: "AIzaSyDpfbjezbYxrW3XMDegBSC5iFPEQEyD0Ls",
  authDomain: "funlearningjapanese-b8e08.firebaseapp.com",
  projectId: "funlearningjapanese-b8e08",
  storageBucket: "funlearningjapanese-b8e08.firebaseapp.com",
  messagingSenderId: "1055688629268",
  appId: "1:1055688629268:web:248183b62f15c34a2d5b01",
  measurementId: "G-LCMXVLPS81"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// バックグラウンドで通知を受け取った時の処理
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png' // アイコンがあれば指定
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});